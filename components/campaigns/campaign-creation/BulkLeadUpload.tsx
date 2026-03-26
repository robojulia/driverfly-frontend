import React, { useState, useCallback, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  ProgressBar,
  Row,
  Table,
} from 'react-bootstrap';
import { ArrowRight, Check, Download, Plus, Trash, Upload, X } from 'react-bootstrap-icons';
import { BulkLeadDto, LeadEntity } from '../../../models/campaigns/bulk-lead-upload.dto';
import { normalizePhoneNumber } from '../../../utils/phone-normalization';

type TargetField = 'name' | 'first_name' | 'last_name' | 'phone' | 'email' | 'ignore';
type Step = 'upload' | 'mapping' | 'preview';

interface ColumnMapping {
  [csvColumn: string]: TargetField;
}

interface BulkLeadUploadProps {
  onLeadsChange: (leads: BulkLeadDto[], isValid: boolean) => void;
}

const TARGET_FIELD_OPTIONS: { value: TargetField; label: string }[] = [
  { value: 'ignore', label: '— Ignore —' },
  { value: 'name', label: 'Full Name' },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'email', label: 'Email Address' },
];

const NAME_PATTERNS = /^(full.?name|name|driver.?name|contact.?name)$/i;
const FIRST_NAME_PATTERNS = /^(first.?name|first|fname|given.?name)$/i;
const LAST_NAME_PATTERNS = /^(last.?name|last|lname|surname|family.?name)$/i;
const PHONE_PATTERNS =
  /^(phone|cell|mobile|telephone|tel|phone.?number|cell.?number|mobile.?number|contact.?number|primary.?phone)$/i;
const EMAIL_PATTERNS = /^(email|e.?mail|email.?address)$/i;

function autoDetectMapping(columns: string[]): ColumnMapping {
  const mapping: ColumnMapping = {};
  const used = new Set<TargetField>();

  for (const col of columns) {
    const trimmed = col.trim();
    if (!used.has('name') && NAME_PATTERNS.test(trimmed)) {
      mapping[col] = 'name';
      used.add('name');
    } else if (!used.has('first_name') && FIRST_NAME_PATTERNS.test(trimmed)) {
      mapping[col] = 'first_name';
      used.add('first_name');
    } else if (!used.has('last_name') && LAST_NAME_PATTERNS.test(trimmed)) {
      mapping[col] = 'last_name';
      used.add('last_name');
    } else if (!used.has('phone') && PHONE_PATTERNS.test(trimmed)) {
      mapping[col] = 'phone';
      used.add('phone');
    } else if (!used.has('email') && EMAIL_PATTERNS.test(trimmed)) {
      mapping[col] = 'email';
      used.add('email');
    } else {
      mapping[col] = 'ignore';
    }
  }

  return mapping;
}

function applyMapping(rows: any[], mapping: ColumnMapping): BulkLeadDto[] {
  return rows
    .map((row) => {
      let name = '';
      let firstName = '';
      let lastName = '';
      let phone = '';
      let email = '';

      for (const [col, target] of Object.entries(mapping)) {
        const val = (row[col] || '').trim();
        if (!val) continue;
        switch (target) {
          case 'name':
            name = val;
            break;
          case 'first_name':
            firstName = val;
            break;
          case 'last_name':
            lastName = val;
            break;
          case 'phone':
            phone = normalizePhoneNumber(val);
            break;
          case 'email':
            email = val;
            break;
        }
      }

      if (!name) {
        name = [firstName, lastName].filter(Boolean).join(' ');
      }

      if (!name && !phone) return null;

      return { name, phone, email: email || undefined } as BulkLeadDto;
    })
    .filter(Boolean) as BulkLeadDto[];
}

const BulkLeadUpload: React.FC<BulkLeadUploadProps> = ({ onLeadsChange }) => {
  const [step, setStep] = useState<Step>('upload');
  const [fileName, setFileName] = useState('');
  const [csvErrors, setCsvErrors] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [csvLeads, setCsvLeads] = useState<BulkLeadDto[]>([]);
  const [manualLeads, setManualLeads] = useState<BulkLeadDto[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [progress, setProgress] = useState(0);

  const schema = LeadEntity.yupSchemaForBulkUpload();

  const allLeads = [...csvLeads, ...manualLeads];

  const validateLeads = useCallback(
    async (items: BulkLeadDto[]) => {
      const errors: Record<number, any> = {};
      const phoneSet = new Set<string>();

      for (let i = 0; i < items.length; i++) {
        const lead = items[i];
        const rowError: any = {};

        try {
          await schema.validate(lead, { abortEarly: false });
        } catch (err: any) {
          if (err.inner) {
            err.inner.forEach((e: any) => {
              rowError[e.path] = e.message;
            });
          }
        }

        if (lead.phone) {
          const normalized = normalizePhoneNumber(lead.phone);
          if (normalized && phoneSet.has(normalized)) {
            rowError.phone = 'Duplicate phone number in upload';
          } else if (normalized) {
            phoneSet.add(normalized);
          }
        }

        if (Object.keys(rowError).length > 0) errors[i] = rowError;
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [schema]
  );

  useEffect(() => {
    const combined = [...csvLeads, ...manualLeads];
    const isValid = Object.keys(validationErrors).length === 0 && combined.length > 0;
    onLeadsChange(combined, isValid);
  }, [csvLeads, manualLeads, validationErrors, onLeadsChange]);

  useEffect(() => {
    const combined = [...csvLeads, ...manualLeads];
    if (combined.length > 0) {
      validateLeads(combined);
    } else {
      setValidationErrors({});
    }
  }, [csvLeads, manualLeads, validateLeads]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(e.target.value);
    setCsvErrors([]);
    setProgress(0);

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setCsvErrors([{ message: 'File size exceeds 5MB limit' }]);
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const { data, errors, meta } = results;
        if (errors?.length) setCsvErrors(errors);

        const columns: string[] = meta.fields || [];
        setCsvColumns(columns);
        setRawRows(data);
        setColumnMapping(autoDetectMapping(columns));
        setStep('mapping');
      },
      error: (err: any) => setCsvErrors([{ message: err.message }]),
    });
  };

  const handleMappingChange = (col: string, target: TargetField) => {
    setColumnMapping((prev) => {
      const next = { ...prev };
      // Each target field can only be used once; clear any previous assignment
      if (target !== 'ignore') {
        for (const k of Object.keys(next)) {
          if (next[k] === target && k !== col) next[k] = 'ignore';
        }
      }
      next[col] = target;
      return next;
    });
  };

  const applyMappingAndPreview = () => {
    const mapped = applyMapping(rawRows, columnMapping);
    setCsvLeads(mapped);
    setStep('preview');
  };

  const handleAddManualRow = () => {
    setManualLeads((prev) => [...prev, { name: '', phone: '', email: '' }]);
    if (step === 'upload') setStep('preview');
  };

  const handleDeleteRow = (index: number) => {
    if (index < csvLeads.length) {
      setCsvLeads((prev) => prev.filter((_, i) => i !== index));
    } else {
      const mi = index - csvLeads.length;
      setManualLeads((prev) => prev.filter((_, i) => i !== mi));
    }
  };

  const handleFieldChange = (index: number, field: keyof BulkLeadDto, value: string) => {
    const processed = field === 'phone' && value ? normalizePhoneNumber(value) : value;

    if (index < csvLeads.length) {
      setCsvLeads((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: processed };
        return next;
      });
    } else {
      const mi = index - csvLeads.length;
      setManualLeads((prev) => {
        const next = [...prev];
        next[mi] = { ...next[mi], [field]: processed };
        return next;
      });
    }
  };

  const handleReset = () => {
    setStep('upload');
    setFileName('');
    setCsvColumns([]);
    setRawRows([]);
    setColumnMapping({});
    setCsvLeads([]);
    setValidationErrors({});
    setCsvErrors([]);
    setProgress(0);
    setOnlyErrors(false);
  };

  const errorCount = Object.keys(validationErrors).length;
  const displayedLeads = onlyErrors ? allLeads.filter((_, i) => validationErrors[i]) : allLeads;

  const mappingHasName = Object.values(columnMapping).some((v) =>
    ['name', 'first_name', 'last_name'].includes(v)
  );
  const mappingHasPhone = Object.values(columnMapping).includes('phone');
  const mappingIsValid = mappingHasName && mappingHasPhone;

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5 className="mb-3">
          <Upload className="me-2" />
          Upload Campaign Leads
        </h5>

        {/* Step 1: File upload row — always visible except during mapping */}
        {step !== 'mapping' && (
          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Upload CSV File</Form.Label>
                <Form.Control
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  value={fileName}
                />
                <Form.Text className="text-muted">
                  Your CSV can use any column names — you'll map them in the next step. Max 5MB.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end gap-2 flex-wrap">
              <a download href="/CampaignLeadsTemplate.csv" className="btn btn-outline-primary">
                <Download className="me-2" />
                Template
              </a>
              <Button variant="success" onClick={handleAddManualRow}>
                <Plus className="me-2" />
                Add Row
              </Button>
            </Col>
          </Row>
        )}

        {/* CSV parse errors */}
        {csvErrors.length > 0 && (
          <Alert variant="warning" className="mb-3">
            <strong>CSV Parsing Issues:</strong>
            <ul className="mb-0 mt-2">
              {csvErrors.map((error, i) => (
                <li key={i}>
                  {error.message}
                  {error.row !== undefined && ` at row ${error.row + 1}`}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Step 2: Column mapping */}
        {step === 'mapping' && (
          <>
            <Alert variant="info" className="mb-3">
              <strong>Map your CSV columns</strong> — Match each column to the right field. At
              minimum, map a name and a phone column.
            </Alert>

            <Table bordered size="sm" className="mb-3">
              <thead className="table-light">
                <tr>
                  <th>CSV Column</th>
                  <th>Sample Values</th>
                  <th style={{ minWidth: 180 }}>Maps To</th>
                </tr>
              </thead>
              <tbody>
                {csvColumns.map((col) => (
                  <tr key={col}>
                    <td className="fw-semibold align-middle">{col}</td>
                    <td className="text-muted small align-middle" style={{ maxWidth: 200 }}>
                      {rawRows
                        .slice(0, 3)
                        .map((r) => r[col])
                        .filter(Boolean)
                        .join(', ') || '—'}
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={columnMapping[col] || 'ignore'}
                        onChange={(e) => handleMappingChange(col, e.target.value as TargetField)}
                      >
                        {TARGET_FIELD_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {!mappingIsValid && (
              <Alert variant="warning" className="mb-3">
                Map at least one <strong>name</strong> column and one <strong>phone</strong> column
                to continue.
              </Alert>
            )}

            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={handleReset}>
                Back
              </Button>
              <Button variant="primary" disabled={!mappingIsValid} onClick={applyMappingAndPreview}>
                <ArrowRight className="me-2" />
                Preview {rawRows.length} Lead{rawRows.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Preview & edit */}
        {step === 'preview' && (
          <>
            {progress > 0 && progress < 100 && (
              <ProgressBar
                variant="primary"
                now={progress}
                label={`${progress}%`}
                striped
                animated
                className="mb-3"
              />
            )}

            {allLeads.length > 0 && (
              <div className="mb-3">
                <Row className="align-items-center">
                  <Col md={6}>
                    <Alert variant={errorCount > 0 ? 'danger' : 'success'} className="mb-0 py-2">
                      <strong>
                        {allLeads.length} lead{allLeads.length !== 1 ? 's' : ''} loaded
                        {errorCount > 0 && ` — ${errorCount} with errors`}
                      </strong>
                    </Alert>
                  </Col>
                  {errorCount > 0 && (
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        label="Only show leads with errors"
                        checked={onlyErrors}
                        onChange={(e) => setOnlyErrors(e.target.checked)}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            )}

            {allLeads.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th style={{ width: 50 }}>Status</th>
                      <th style={{ width: 40 }}>#</th>
                      <th>Name *</th>
                      <th>Phone *</th>
                      <th>Email</th>
                      <th style={{ width: 80 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedLeads.map((lead, displayIdx) => {
                      const actualIdx = onlyErrors
                        ? allLeads.findIndex((l) => l === lead)
                        : displayIdx;
                      const rowError = validationErrors[actualIdx];

                      return (
                        <tr key={actualIdx}>
                          <td className="text-center align-middle">
                            {rowError ? (
                              <X color="red" size={20} />
                            ) : (
                              <Check color="green" size={20} />
                            )}
                          </td>
                          <td className="align-middle">{actualIdx + 1}</td>
                          <td>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={lead.name}
                              onChange={(e) =>
                                handleFieldChange(actualIdx, 'name', e.target.value)
                              }
                              isInvalid={!!rowError?.name}
                            />
                            {rowError?.name && (
                              <Form.Control.Feedback type="invalid">
                                {rowError.name}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              type="tel"
                              size="sm"
                              value={lead.phone}
                              onChange={(e) =>
                                handleFieldChange(actualIdx, 'phone', e.target.value)
                              }
                              isInvalid={!!rowError?.phone}
                            />
                            {rowError?.phone && (
                              <Form.Control.Feedback type="invalid">
                                {rowError.phone}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              type="email"
                              size="sm"
                              value={lead.email || ''}
                              onChange={(e) =>
                                handleFieldChange(actualIdx, 'email', e.target.value)
                              }
                              isInvalid={!!rowError?.email}
                            />
                            {rowError?.email && (
                              <Form.Control.Feedback type="invalid">
                                {rowError.email}
                              </Form.Control.Feedback>
                            )}
                          </td>
                          <td className="text-center align-middle">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteRow(actualIdx)}
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Alert variant="info">
                <strong>No leads yet.</strong>
                <br />
                Upload a CSV file above or click <strong>Add Row</strong> to enter leads manually.
              </Alert>
            )}

            <div className="d-flex gap-2 mt-2 flex-wrap">
              {csvLeads.length > 0 && (
                <Button variant="outline-secondary" size="sm" onClick={() => setStep('mapping')}>
                  Re-map Columns
                </Button>
              )}
              {allLeads.length > 0 && (
                <Button variant="outline-danger" size="sm" onClick={handleReset}>
                  Clear All
                </Button>
              )}
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default BulkLeadUpload;

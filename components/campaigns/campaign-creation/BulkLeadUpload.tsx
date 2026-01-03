import React, { useState, useCallback, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
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
import { Check, Download, Plus, Trash, Upload, X } from 'react-bootstrap-icons';
import { BulkLeadDto, LeadEntity } from '../../../models/campaigns/bulk-lead-upload.dto';
import { normalizePhoneNumber } from '../../../utils/phone-normalization';

interface BulkLeadUploadProps {
  onLeadsChange: (leads: BulkLeadDto[], isValid: boolean) => void;
}

interface FormValues {
  items: BulkLeadDto[];
}

const BulkLeadUpload: React.FC<BulkLeadUploadProps> = ({ onLeadsChange }) => {
  const [fileName, setFileName] = useState('');
  const [csvErrors, setCsvErrors] = useState<any[]>([]);
  const [progress, setProgress] = useState(0);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, any>>({});

  const form = useFormik<FormValues>({
    initialValues: {
      items: [],
    },
    validationSchema: yup.object({
      items: yup.array().of(LeadEntity.yupSchemaForBulkUpload()),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async () => {
      // Not used - validation happens on change
    },
  });

  // Validate items and check for duplicates
  const validateItems = useCallback(async (items: BulkLeadDto[]) => {
    const errors: Record<number, any> = {};
    const phoneSet = new Set<string>();
    const schema = LeadEntity.yupSchemaForBulkUpload();

    for (let i = 0; i < items.length; i++) {
      const lead = items[i];
      const rowError: any = {};

      // Validate with Yup schema
      try {
        await schema.validate(lead, { abortEarly: false });
      } catch (err: any) {
        if (err.inner) {
          err.inner.forEach((error: any) => {
            rowError[error.path] = error.message;
          });
        }
      }

      // Check for duplicates within upload
      if (lead.phone) {
        const normalized = normalizePhoneNumber(lead.phone);
        if (normalized && phoneSet.has(normalized)) {
          rowError.phone = 'Duplicate phone number in upload';
        } else if (normalized) {
          phoneSet.add(normalized);
        }
      }

      if (Object.keys(rowError).length > 0) {
        errors[i] = rowError;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  // Notify parent of changes
  useEffect(() => {
    const isValid = Object.keys(validationErrors).length === 0 && form.values.items.length > 0;
    onLeadsChange(form.values.items, isValid);
  }, [form.values.items, validationErrors, onLeadsChange]);

  // Validate items whenever they change
  useEffect(() => {
    if (form.values.items.length > 0) {
      validateItems(form.values.items);
    }
  }, [form.values.items, validateItems]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files, value },
    } = e;
    const file = files?.[0];

    setFileName(value);
    setCsvErrors([]);
    setProgress(0);

    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setCsvErrors([{ message: 'File size exceeds 5MB limit' }]);
      return;
    }

    // Parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const { data, errors } = results as any;

        if (errors?.length) {
          setCsvErrors(errors);
        }

        // Process rows
        const contents: BulkLeadDto[] = data
          .map((row: any, i: number) => {
            // Skip completely empty rows
            if (!Object.values(row).some(Boolean)) return null;

            const lead: BulkLeadDto = {
              name: row.name?.trim() || '',
              phone: row.phone?.trim() || '',
              email: row.email?.trim() || undefined,
            };

            // Normalize phone number immediately
            if (lead.phone) {
              lead.phone = normalizePhoneNumber(lead.phone);
            }

            setProgress(Math.floor(((i + 1) * 100) / data.length));
            return lead;
          })
          .filter(Boolean);

        form.setValues({ items: contents });
        setProgress(100);
      },
      error: (error) => {
        setCsvErrors([{ message: error.message }]);
      },
    });
  };

  const handleAddRow = () => {
    const newLead: BulkLeadDto = {
      name: '',
      phone: '',
      email: '',
    };
    form.setFieldValue('items', [...form.values.items, newLead]);
  };

  const handleDeleteRow = (index: number) => {
    const newItems = [...form.values.items];
    newItems.splice(index, 1);
    form.setFieldValue('items', newItems);
  };

  const handleFieldChange = (index: number, field: keyof BulkLeadDto, value: string) => {
    let processedValue = value;

    // Normalize phone number on change
    if (field === 'phone' && value) {
      processedValue = normalizePhoneNumber(value);
    }

    form.setFieldValue(`items.${index}.${field}`, processedValue);
  };

  const getRowError = (index: number) => {
    return validationErrors[index];
  };

  const hasError = (index: number) => {
    const error = getRowError(index);
    return error && Object.keys(error).length > 0;
  };

  const displayedItems = onlyErrors
    ? form.values.items.filter((_, i) => hasError(i))
    : form.values.items;

  const errorCount = Object.keys(validationErrors).length;

  return (
    <Card className="mb-3">
      <Card.Body>
        <h5 className="mb-3">
          <Upload className="me-2" />
          Upload Campaign Leads
        </h5>

        {/* CSV Upload Section */}
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
                Maximum file size: 5MB. Download template below for correct format.
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <a
              download
              href="/CampaignLeadsTemplate.csv"
              className="btn btn-outline-primary w-100"
            >
              <Download className="me-2" />
              Download Template
            </a>
          </Col>
        </Row>

        {/* CSV Errors */}
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

        {/* Progress Bar */}
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

        {/* Manual Entry Button */}
        <div className="mb-3">
          <Button variant="success" onClick={handleAddRow}>
            <Plus className="me-2" />
            Add Lead Manually
          </Button>
        </div>

        {/* Validation Summary */}
        {form.values.items.length > 0 && (
          <div className="mb-3">
            <Row>
              <Col md={6}>
                <Alert variant={errorCount > 0 ? 'danger' : 'success'}>
                  <strong>
                    {form.values.items.length} lead(s) loaded
                    {errorCount > 0 && ` - ${errorCount} with errors`}
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

        {/* Leads Table */}
        {form.values.items.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Status</th>
                  <th style={{ width: '50px' }}>#</th>
                  <th>Name *</th>
                  <th>Phone *</th>
                  <th>Email</th>
                  <th style={{ width: '80px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((lead, displayIndex) => {
                  // Get actual index in full array
                  const actualIndex = onlyErrors
                    ? form.values.items.findIndex((item) => item === lead)
                    : displayIndex;
                  const rowError = getRowError(actualIndex);
                  const hasRowError = hasError(actualIndex);

                  return (
                    <tr key={actualIndex}>
                      <td className="text-center">
                        {hasRowError ? (
                          <X color="red" size={20} />
                        ) : (
                          <Check color="green" size={20} />
                        )}
                      </td>
                      <td>{actualIndex + 1}</td>
                      <td>
                        <Form.Control
                          type="text"
                          size="sm"
                          value={lead.name}
                          onChange={(e) =>
                            handleFieldChange(actualIndex, 'name', e.target.value)
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
                            handleFieldChange(actualIndex, 'phone', e.target.value)
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
                            handleFieldChange(actualIndex, 'email', e.target.value)
                          }
                          isInvalid={!!rowError?.email}
                        />
                        {rowError?.email && (
                          <Form.Control.Feedback type="invalid">
                            {rowError.email}
                          </Form.Control.Feedback>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRow(actualIndex)}
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
        )}

        {form.values.items.length === 0 && (
          <Alert variant="info">
            <strong>No leads uploaded yet.</strong>
            <br />
            Upload a CSV file or add leads manually using the button above.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default BulkLeadUpload;

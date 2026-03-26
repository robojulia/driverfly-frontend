import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Alert,
  Input,
  FormFeedback,
  Spinner,
} from 'reactstrap';
import { PersonPlus, Plus, Trash, Upload } from 'react-bootstrap-icons';
import Papa from 'papaparse';
import { useTranslation } from '../../hooks/use-translation';
import { BulkLeadDto, LeadEntity } from '../../models/campaigns/bulk-lead-upload.dto';
import { normalizePhoneNumber } from '../../utils/phone-normalization';

interface ManualTargetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLeads: (leads: BulkLeadDto[]) => Promise<void>;
  loading?: boolean;
}

const emptyRow = (): BulkLeadDto => ({ name: '', phone: '', email: '' });

export const ManualTargetSelectionModal: React.FC<ManualTargetSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddLeads,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [rows, setRows] = useState<BulkLeadDto[]>([emptyRow()]);
  const [errors, setErrors] = useState<Record<number, { name?: string; phone?: string }>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const schema = LeadEntity.yupSchemaForBulkUpload();

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setRows([emptyRow()]);
      setErrors({});
      setSubmitError(null);
      setCsvError(null);
    }
  }, [isOpen]);

  const validate = useCallback(
    async (items: BulkLeadDto[]) => {
      const newErrors: Record<number, { name?: string; phone?: string }> = {};
      const phoneSet = new Set<string>();

      for (let i = 0; i < items.length; i++) {
        const row = items[i];
        const rowError: { name?: string; phone?: string } = {};

        try {
          await schema.validate(row, { abortEarly: false });
        } catch (err: any) {
          if (err.inner) {
            err.inner.forEach((e: any) => {
              rowError[e.path as 'name' | 'phone'] = e.message;
            });
          }
        }

        if (row.phone) {
          const normalized = normalizePhoneNumber(row.phone);
          if (normalized && phoneSet.has(normalized)) {
            rowError.phone = 'Duplicate phone number';
          } else if (normalized) {
            phoneSet.add(normalized);
          }
        }

        if (Object.keys(rowError).length > 0) newErrors[i] = rowError;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [schema]
  );

  const handleFieldChange = (index: number, field: keyof BulkLeadDto, value: string) => {
    const processed = field === 'phone' && value ? normalizePhoneNumber(value) : value;
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: processed };
      return next;
    });
    // Clear the specific field error on change
    setErrors((prev) => {
      if (!prev[index]?.[field as 'name' | 'phone']) return prev;
      const next = { ...prev };
      const rowErr = { ...next[index] };
      delete rowErr[field as 'name' | 'phone'];
      if (Object.keys(rowErr).length === 0) delete next[index];
      else next[index] = rowErr;
      return next;
    });
  };

  const handleAddRow = () => setRows((prev) => [...prev, emptyRow()]);

  const handleDeleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const next: Record<number, any> = {};
      for (const [k, v] of Object.entries(prev)) {
        const ki = Number(k);
        if (ki < index) next[ki] = v;
        else if (ki > index) next[ki - 1] = v;
      }
      return next;
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCsvError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const { data, meta } = results;
        const fields: string[] = (meta.fields || []).map((f: string) => f.toLowerCase().trim());

        const nameCol = meta.fields?.find((_: string, i: number) =>
          /^(name|full.?name|driver.?name|first.?name)$/i.test(fields[i])
        );
        const phoneCol = meta.fields?.find((_: string, i: number) =>
          /^(phone|cell|mobile|tel|phone.?number|cell.?number|mobile.?number)$/i.test(fields[i])
        );
        const emailCol = meta.fields?.find((_: string, i: number) =>
          /^(email|e.?mail)$/i.test(fields[i])
        );

        if (!phoneCol) {
          setCsvError(
            'Could not find a phone column. Make sure your CSV has a column named "phone", "cell", or "mobile".'
          );
          return;
        }

        const parsed: BulkLeadDto[] = data
          .map((row: any) => {
            const phone = normalizePhoneNumber((row[phoneCol] || '').trim());
            const name = nameCol ? (row[nameCol] || '').trim() : '';
            const email = emailCol ? (row[emailCol] || '').trim() : '';
            if (!phone && !name) return null;
            return { name, phone, email: email || undefined } as BulkLeadDto;
          })
          .filter(Boolean);

        if (parsed.length === 0) {
          setCsvError('No valid rows found in the CSV file.');
          return;
        }

        // Merge with existing non-empty rows
        setRows((prev) => {
          const nonEmpty = prev.filter((r) => r.name || r.phone);
          return nonEmpty.length > 0 ? [...nonEmpty, ...parsed] : parsed;
        });
      },
      error: (err: any) => setCsvError(err.message),
    });
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const nonEmpty = rows.filter((r) => r.name || r.phone);
    if (nonEmpty.length === 0) {
      setSubmitError('Add at least one driver before submitting.');
      return;
    }

    const valid = await validate(nonEmpty);
    if (!valid) {
      setSubmitError('Please fix the errors below before submitting.');
      return;
    }

    try {
      await onAddLeads(nonEmpty);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to add targets. Please try again.');
    }
  };

  const nonEmptyCount = rows.filter((r) => r.name || r.phone).length;

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" backdrop="static">
      <ModalHeader toggle={onClose}>
        <PersonPlus size={20} className="me-2" />
        Add Targets
      </ModalHeader>

      <ModalBody>
        <p className="text-muted mb-3">
          Enter the name and phone number for each driver you want to add. A profile will
          automatically be created for each one so call notes can be stored.
        </p>

        {/* CSV upload */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <label className="btn btn-outline-secondary btn-sm mb-0" style={{ cursor: 'pointer' }}>
            <Upload size={14} className="me-1" />
            Import from CSV
            <input
              type="file"
              accept=".csv"
              className="d-none"
              onChange={handleCsvUpload}
              disabled={loading}
            />
          </label>
          <small className="text-muted">CSV should have columns: name, phone (and optionally email)</small>
        </div>

        {csvError && (
          <Alert color="warning" className="mb-3">
            {csvError}
          </Alert>
        )}

        {submitError && (
          <Alert color="danger" className="mb-3">
            {submitError}
          </Alert>
        )}

        <div className="table-responsive">
          <Table size="sm" bordered>
            <thead className="table-light">
              <tr>
                <th style={{ width: 40 }}>#</th>
                <th>Name *</th>
                <th>Phone *</th>
                <th>Email</th>
                <th style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="align-middle text-center text-muted small">{i + 1}</td>
                  <td>
                    <Input
                      bsSize="sm"
                      type="text"
                      placeholder="Full name"
                      value={row.name}
                      onChange={(e) => handleFieldChange(i, 'name', e.target.value)}
                      invalid={!!errors[i]?.name}
                      disabled={loading}
                    />
                    {errors[i]?.name && <FormFeedback>{errors[i].name}</FormFeedback>}
                  </td>
                  <td>
                    <Input
                      bsSize="sm"
                      type="tel"
                      placeholder="Phone number"
                      value={row.phone}
                      onChange={(e) => handleFieldChange(i, 'phone', e.target.value)}
                      invalid={!!errors[i]?.phone}
                      disabled={loading}
                    />
                    {errors[i]?.phone && <FormFeedback>{errors[i].phone}</FormFeedback>}
                  </td>
                  <td>
                    <Input
                      bsSize="sm"
                      type="email"
                      placeholder="Email (optional)"
                      value={row.email || ''}
                      onChange={(e) => handleFieldChange(i, 'email', e.target.value)}
                      disabled={loading}
                    />
                  </td>
                  <td className="text-center align-middle">
                    {rows.length > 1 && (
                      <Button
                        color="link"
                        size="sm"
                        className="text-danger p-0"
                        onClick={() => handleDeleteRow(i)}
                        disabled={loading}
                      >
                        <Trash size={15} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Button color="outline-secondary" size="sm" onClick={handleAddRow} disabled={loading}>
          <Plus size={16} className="me-1" />
          Add Row
        </Button>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading || nonEmptyCount === 0}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              Adding...
            </>
          ) : (
            <>
              <PersonPlus size={16} className="me-2" />
              Add {nonEmptyCount > 0 ? `${nonEmptyCount} ` : ''}Target{nonEmptyCount !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

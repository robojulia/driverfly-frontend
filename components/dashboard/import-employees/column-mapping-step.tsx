import { useState } from 'react';
import { Alert, Badge, Button, Form, Spinner, Table } from 'react-bootstrap';
import { ArrowRight, Magic } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/use-translation';
import {
  aiErrorMessage,
  ColumnMapping,
  ImportFieldSpec,
  profileColumns,
  suggestMappingWithAi,
  ValueMaps,
} from '../../../utils/ai-import-mapping';

interface ColumnMappingStepProps {
  target: string;
  fields: ImportFieldSpec[];
  requiredFields: string[];
  columns: string[];
  rows: Record<string, any>[];
  mapping: ColumnMapping;
  valueMaps: ValueMaps;
  onChange: (mapping: ColumnMapping, valueMaps: ValueMaps) => void;
  onBack: () => void;
  onContinue: () => void;
}

/**
 * Lets the user review (and optionally ask AI to suggest) which uploaded column feeds each field,
 * and how low-cardinality values translate onto allowed options. Nothing here edits cell values.
 */
const ColumnMappingStep = ({
  target,
  fields,
  requiredFields,
  columns,
  rows,
  mapping,
  valueMaps,
  onChange,
  onBack,
  onContinue,
}: ColumnMappingStepProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [aiColumns, setAiColumns] = useState<Set<string>>(new Set());

  const profiles = profileColumns(columns, rows);
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));
  const usedFields = new Set(Object.values(mapping).filter(Boolean));
  const missingRequired = requiredFields.filter((f) => !usedFields.has(f));

  const onSuggest = async () => {
    setLoading(true);
    try {
      const suggestion = await suggestMappingWithAi(target, fields, columns, rows);
      // Only fill columns the user has not mapped yet; never overwrite a choice they made.
      const next = { ...mapping };
      const taken = new Set(Object.values(mapping).filter(Boolean));
      const filled = new Set<string>();
      for (const [col, field] of Object.entries(suggestion.mapping)) {
        if (!field || next[col] || taken.has(field)) continue;
        next[col] = field;
        taken.add(field);
        filled.add(col);
      }
      const nextValueMaps = { ...valueMaps };
      for (const [col, vm] of Object.entries(suggestion.valueMaps)) {
        if (next[col] === vm.field) {
          nextValueMaps[col] = { field: vm.field, map: { ...vm.map, ...nextValueMaps[col]?.map } };
        }
      }
      setAiColumns(filled);
      onChange(next, nextValueMaps);
      toast.success(t('AI_MAPPING_SUGGESTED_{count}', { count: filled.size }));
    } catch (e) {
      toast.error(aiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const setColumnField = (col: string, field: string | null) => {
    const next = { ...mapping };
    if (field) {
      for (const k of Object.keys(next)) if (next[k] === field) next[k] = null;
    }
    next[col] = field;
    const nextAi = new Set(aiColumns);
    nextAi.delete(col);
    setAiColumns(nextAi);
    onChange(next, valueMaps);
  };

  const setValueOption = (col: string, field: string, raw: string, option: string) => {
    const current = valueMaps[col]?.field === field ? valueMaps[col].map : {};
    const map = { ...current };
    if (option) map[raw] = option;
    else delete map[raw];
    onChange(mapping, { ...valueMaps, [col]: { field, map } });
  };

  return (
    <>
      <Alert variant="info" className="mb-3">
        {t('MAP_IMPORT_COLUMNS_EXPLANATION')}
      </Alert>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <Button variant="outline-primary" disabled={loading} onClick={onSuggest}>
          {loading ? <Spinner size="sm" animation="border" className="me-2" /> : <Magic className="me-2" />}
          {t('SUGGEST_MAPPING_WITH_AI')}
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table bordered size="sm" className="mb-3">
          <thead className="table-light">
            <tr>
              <th>{t('FILE_COLUMN')}</th>
              <th>{t('SAMPLE_VALUES')}</th>
              <th style={{ minWidth: 200 }}>{t('MAPS_TO')}</th>
              <th style={{ minWidth: 260 }}>{t('VALUE_TRANSLATIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(({ name, samples, distinct }) => {
              const field = fieldByKey.get(mapping[name] ?? '');
              const isEnum = field?.type === 'enum' || field?.type === 'enum[]';
              const vm = field && valueMaps[name]?.field === field.key ? valueMaps[name].map : {};
              return (
                <tr key={name}>
                  <td className="fw-semibold align-middle">
                    {name}
                    {aiColumns.has(name) && (
                      <Badge bg="info" className="ms-2">
                        AI
                      </Badge>
                    )}
                  </td>
                  <td className="text-muted small align-middle" style={{ maxWidth: 220 }}>
                    {samples.join(', ') || '—'}
                  </td>
                  <td>
                    <Form.Select
                      size="sm"
                      disabled={loading}
                      value={mapping[name] ?? ''}
                      onChange={(e) => setColumnField(name, e.target.value || null)}
                    >
                      <option value="">{t('IGNORE_COLUMN')}</option>
                      {fields.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.label}
                          {requiredFields.includes(f.key) ? ' *' : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td className="small">
                    {isEnum &&
                      distinct
                        .filter((raw) => !field.options.includes(raw))
                        .map((raw) => (
                          <div key={raw} className="d-flex align-items-center gap-2 mb-1">
                            <span className="text-nowrap">{raw}</span>
                            <ArrowRight />
                            <Form.Select
                              size="sm"
                              disabled={loading}
                              value={vm[raw] ?? ''}
                              onChange={(e) => setValueOption(name, field.key, raw, e.target.value)}
                            >
                              <option value="">{t('KEEP_AS_IS')}</option>
                              {field.options.map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                        ))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {missingRequired.length > 0 && (
        <Alert variant="warning" className="mb-3">
          {t('REQUIRED_FIELDS_NOT_MAPPED')}:{' '}
          {missingRequired.map((k) => fieldByKey.get(k)?.label ?? k).join(', ')}
        </Alert>
      )}

      <div className="d-flex gap-2 mb-3">
        <Button variant="outline-secondary" onClick={onBack}>
          {t('BACK')}
        </Button>
        <Button variant="primary" disabled={loading} onClick={onContinue}>
          <ArrowRight className="me-2" />
          {t('PREVIEW_{count}_ROWS', { count: rows.length })}
        </Button>
      </div>
    </>
  );
};

export default ColumnMappingStep;

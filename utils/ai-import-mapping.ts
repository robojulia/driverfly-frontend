import axios from 'axios';
import BaseApi from '../pages/api/_baseApi';

/**
 * AI-assisted import mapping.
 *
 * The AI only ever *chooses* among things we already have: which uploaded column feeds which
 * system field, and which allowed enum option a raw cell value stands for. It never writes cell
 * values. Rows are always built in code by copying the uploaded cells, and every AI choice is
 * checked against the real column names, the real cell values and the allowed options (here and
 * again on the server) before it is used, so a made-up column, value or option is dropped rather
 * than imported.
 */

export type ImportFieldType = 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'enum[]';

export interface ImportFieldSpec {
  key: string;
  label: string;
  type: ImportFieldType;
  /** Allowed values for enum / enum[] fields. */
  options?: string[];
  description?: string;
}

export interface ImportColumnProfile {
  name: string;
  /** A few example cells so the AI can recognise unlabeled columns. */
  samples: string[];
  /**
   * Every distinct (comma-separated) value in the column, sent only for low-cardinality columns so
   * the AI can translate them onto enum options. Empty for free-text columns like names or phones.
   */
  distinct: string[];
}

export type ColumnMapping = Record<string, string | null>;

/** Raw cell value -> allowed option, valid only while the column still maps to `field`. */
export type ValueMaps = Record<string, { field: string; map: Record<string, string> }>;

export interface AiMappingResult {
  mapping: ColumnMapping;
  valueMaps: ValueMaps;
}

export const MAX_SAMPLES = 3;
export const MAX_DISTINCT = 60;
export const MAX_CELL_LENGTH = 100;

export function splitTokens(cell: unknown): string[] {
  return `${cell ?? ''}`
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function profileColumns(columns: string[], rows: Record<string, any>[]): ImportColumnProfile[] {
  return columns
    .filter((name) => name.trim())
    .map((name) => {
      const cells = rows.map((r) => `${r[name] ?? ''}`.trim()).filter(Boolean);
      const samples = Array.from(new Set(cells))
        .slice(0, MAX_SAMPLES)
        .map((v) => v.slice(0, MAX_CELL_LENGTH));
      const tokens = Array.from(new Set(cells.flatMap(splitTokens)));
      const distinct =
        tokens.length <= MAX_DISTINCT && tokens.every((v) => v.length <= MAX_CELL_LENGTH) ? tokens : [];
      return { name, samples, distinct };
    });
}

/** Header-only guess used before (or instead of) the AI: exact key or label, ignoring case/punctuation. */
export function exactMapping(columns: string[], fields: ImportFieldSpec[]): ColumnMapping {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const used = new Set<string>();
  const mapping: ColumnMapping = {};
  for (const col of columns) {
    const field = fields.find(
      (f) => !used.has(f.key) && (norm(f.key) === norm(col) || norm(f.label) === norm(col))
    );
    mapping[col] = field?.key ?? null;
    if (field) used.add(field.key);
  }
  return mapping;
}

/**
 * Drops anything in an AI answer that does not refer to a real column, a real cell value or an
 * allowed option, and keeps each field on at most one column. Shared by the API route and the
 * client so the guarantee does not depend on either side alone.
 */
export function sanitizeAiMapping(
  raw: { columns?: { column: string; field: string }[]; values?: { column: string; raw: string; option: string }[] },
  columns: ImportColumnProfile[],
  fields: ImportFieldSpec[]
): AiMappingResult {
  const byName = new Map(columns.map((c) => [c.name, c]));
  const fieldByKey = new Map(fields.map((f) => [f.key, f]));
  const mapping: ColumnMapping = {};
  const used = new Set<string>();

  for (const c of columns) mapping[c.name] = null;
  for (const { column, field } of raw?.columns ?? []) {
    if (!byName.has(column) || mapping[column] || !fieldByKey.has(field) || used.has(field)) continue;
    mapping[column] = field;
    used.add(field);
  }

  const valueMaps: ValueMaps = {};
  for (const { column, raw: value, option } of raw?.values ?? []) {
    const field = fieldByKey.get(mapping[column] ?? '');
    if (!field || !field.options?.includes(option)) continue;
    if (!byName.get(column).distinct.includes(value)) continue;
    valueMaps[column] ??= { field: field.key, map: {} };
    valueMaps[column].map[value] = option;
  }

  return { mapping, valueMaps };
}

/** Renames each row's keys to field keys; cell contents are copied untouched. */
export function remapRow(row: Record<string, any>, mapping: ColumnMapping): Record<string, any> {
  const out: Record<string, any> = {};
  for (const [col, field] of Object.entries(mapping)) {
    if (field && row[col] != null) out[field] = row[col];
  }
  return out;
}

/** The AI's option for a raw value, if one was suggested for this column/field pair. */
export function translateValue(
  valueMaps: ValueMaps,
  mapping: ColumnMapping,
  field: string,
  value: string
): string {
  const column = Object.keys(mapping).find((c) => mapping[c] === field);
  const vm = column && valueMaps[column];
  if (!vm || vm.field !== field) return value;
  return vm.map[value.trim()] ?? value;
}

class AiImportMappingApi extends BaseApi {
  async suggest(body: {
    target: string;
    fields: ImportFieldSpec[];
    columns: ImportColumnProfile[];
  }): Promise<AiMappingResult> {
    // Same-origin Next.js route; BaseApi still attaches the user's bearer token.
    const baseURL = typeof window !== 'undefined' ? `${window.location.origin}/api/` : '/api/';
    const { data } = await this.post('ai-import-mapping', body, { baseURL, timeout: 120000 });
    return data;
  }
}

export async function suggestMappingWithAi(
  target: string,
  fields: ImportFieldSpec[],
  columns: string[],
  rows: Record<string, any>[]
): Promise<AiMappingResult> {
  const profiles = profileColumns(columns, rows);
  const answer = await new AiImportMappingApi().suggest({ target, fields, columns: profiles });
  // Re-check on the client: the server already sanitized, but never trust a round trip.
  return sanitizeAiMapping(
    {
      columns: Object.entries(answer?.mapping ?? {})
        .filter(([, f]) => f)
        .map(([column, field]) => ({ column, field })),
      values: Object.entries(answer?.valueMaps ?? {}).flatMap(([column, vm]) =>
        Object.entries(vm.map).map(([raw, option]) => ({ column, raw, option }))
      ),
    },
    profiles,
    fields
  );
}

export function aiErrorMessage(e: any): string {
  if (axios.isAxiosError(e)) return (e.response?.data as any)?.error || e.message;
  return e?.message || 'AI mapping failed';
}

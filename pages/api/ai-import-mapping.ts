/**
 * POST /api/ai-import-mapping
 *   Body: { target, fields: ImportFieldSpec[], columns: ImportColumnProfile[] }
 *   Returns { mapping, valueMaps } - which uploaded column feeds which field, and which allowed
 *   option each low-cardinality raw value stands for.
 *
 * Claude only picks from lists we give it (column names, field keys, enum options) and the answer
 * is sanitized against the request before it is returned, so it cannot introduce data of its own.
 * Rows never pass through here; the client builds them from the uploaded cells.
 */

import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  ImportColumnProfile,
  ImportFieldSpec,
  MAX_CELL_LENGTH,
  MAX_DISTINCT,
  MAX_SAMPLES,
  sanitizeAiMapping,
} from '../../utils/ai-import-mapping';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const NO_MATCH = '__NO_MATCH__';
const IGNORE = '__IGNORE__';
const MAX_COLUMNS = 150;
const MAX_FIELDS = 100;

function getBackendApiUrl(): string {
  return (process.env.BASE_URL_API ?? process.env.NEXT_PUBLIC_BASE_URL_API ?? 'http://localhost:4000/api').replace(/\/$/, '');
}

/** Only signed-in DriverFly users may spend Anthropic credits here. */
async function isSignedIn(authHeader?: string): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) return false;
  try {
    await axios.get(`${getBackendApiUrl()}/auth/profile`, {
      headers: { Authorization: authHeader },
      timeout: 15000,
    });
    return true;
  } catch {
    return false;
  }
}

function clean(s: unknown): string {
  return `${s ?? ''}`.slice(0, MAX_CELL_LENGTH);
}

function parseBody(body: any): { target: string; fields: ImportFieldSpec[]; columns: ImportColumnProfile[] } | null {
  if (!Array.isArray(body?.fields) || !Array.isArray(body?.columns)) return null;
  if (!body.fields.length || !body.columns.length) return null;
  if (body.fields.length > MAX_FIELDS || body.columns.length > MAX_COLUMNS) return null;

  const fields: ImportFieldSpec[] = body.fields.map((f: any) => ({
    key: clean(f?.key),
    label: clean(f?.label),
    type: f?.type,
    options: Array.isArray(f?.options) ? f.options.map(clean) : undefined,
    description: f?.description ? `${f.description}`.slice(0, 300) : undefined,
  }));
  const columns: ImportColumnProfile[] = body.columns.map((c: any) => ({
    name: `${c?.name ?? ''}`,
    samples: (Array.isArray(c?.samples) ? c.samples : []).slice(0, MAX_SAMPLES).map(clean),
    distinct: (Array.isArray(c?.distinct) ? c.distinct : []).slice(0, MAX_DISTINCT).map(clean),
  }));
  if (fields.some((f) => !f.key) || columns.some((c) => !c.name)) return null;

  return { target: `${body.target ?? 'records'}`.slice(0, 100), fields, columns };
}

function outputSchema(fields: ImportFieldSpec[], columns: ImportColumnProfile[]) {
  const options = Array.from(new Set(fields.flatMap((f) => f.options ?? [])));
  const columnNames = columns.map((c) => c.name);
  return {
    type: 'object',
    additionalProperties: false,
    required: ['columns', 'values'],
    properties: {
      columns: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['column', 'field'],
          properties: {
            column: { type: 'string', enum: columnNames },
            field: { type: 'string', enum: [...fields.map((f) => f.key), IGNORE] },
          },
        },
      },
      values: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['column', 'raw', 'option'],
          properties: {
            column: { type: 'string', enum: columnNames },
            raw: { type: 'string' },
            option: { type: 'string', enum: [...options, NO_MATCH] },
          },
        },
      },
    },
  };
}

function buildPrompt(target: string, fields: ImportFieldSpec[], columns: ImportColumnProfile[]): string {
  const fieldLines = fields.map((f) => {
    const opts = f.options?.length ? ` options: ${f.options.join(' | ')}` : '';
    const desc = f.description ? ` - ${f.description}` : '';
    return `- ${f.key} (${f.label}; ${f.type})${desc}${opts}`;
  });
  const columnLines = columns.map((c) => {
    const distinct = c.distinct.length ? ` distinct values: ${JSON.stringify(c.distinct)}` : '';
    return `- ${JSON.stringify(c.name)} samples: ${JSON.stringify(c.samples)}${distinct}`;
  });

  return `A user is importing ${target} from a spreadsheet into our system. Match the spreadsheet's columns to our fields.

Our fields:
${fieldLines.join('\n')}

Spreadsheet columns (header, then example cells):
${columnLines.join('\n')}

1. "columns": for every spreadsheet column, give the field it holds, or "${IGNORE}" if none fits. Judge by the header and the example cells together. Use each field for at most one column; if two columns could fit, pick the better one and ignore the other. Only map a column when you are confident - a wrong mapping is worse than none, because the user can map it by hand.
2. "values": for each column you mapped to an enum or enum[] field that lists distinct values, give one entry per distinct value: the option it clearly means (e.g. "Class A" -> "A", "Haz-Mat" -> "HAZMAT"), or "${NO_MATCH}" when it does not clearly mean one option. Copy "raw" exactly as it appears in the distinct values list.

You are only choosing from the lists above; do not invent, correct or reformat any data.`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!(await isSignedIn(req.headers.authorization as string | undefined))) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured' });
  }

  const input = parseBody(req.body);
  if (!input) {
    return res.status(400).json({ error: 'fields and columns are required' });
  }
  const { target, fields, columns } = input;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: outputSchema(fields, columns) },
      },
      messages: [{ role: 'user', content: buildPrompt(target, fields, columns) }],
    });

    if (message.stop_reason !== 'end_turn') {
      console.error('AI import mapping stopped early:', message.stop_reason);
      return res.status(502).json({ error: 'The AI could not suggest a mapping. Please map the columns by hand.' });
    }

    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');
    const answer = JSON.parse(text);

    return res.status(200).json(sanitizeAiMapping(answer, columns, fields));
  } catch (error: any) {
    console.error('AI import mapping error:', error);
    return res.status(502).json({ error: 'Failed to get an AI mapping suggestion' });
  }
}

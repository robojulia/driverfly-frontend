import { ApplicantExtrasEntity } from '../models/applicant';

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === '';
}

/**
 * Merges a browser-restored snapshot of applicant extras over the set loaded
 * from the server, without losing anything the server knows.
 *
 * The crash-recovery snapshot in localStorage used to *replace* the server set
 * outright. That is safe only if the snapshot is strictly newer and strictly
 * complete, and it is neither: it is whatever that one browser last held, which
 * can be missing entries the server has, or hold a blanked-out value for one the
 * driver has since signed. Replacing wholesale then silently discards real
 * answers — signatures among them.
 *
 * Merge rules, per extra type:
 *  - the restored entry wins when it actually carries a value;
 *  - a blank restored entry never displaces a value the server has;
 *  - server entries the snapshot doesn't mention are kept.
 */
export function mergeRestoredExtras(
  serverExtras: ApplicantExtrasEntity[] | undefined,
  restoredExtras: ApplicantExtrasEntity[] | undefined
): ApplicantExtrasEntity[] {
  const merged = new Map<string, ApplicantExtrasEntity>();

  for (const extra of serverExtras ?? []) {
    if (extra?.type) merged.set(String(extra.type), extra);
  }

  for (const extra of restoredExtras ?? []) {
    if (!extra?.type) continue;
    const key = String(extra.type);
    const existing = merged.get(key);
    if (existing && isBlank(extra.value) && !isBlank(existing.value)) continue;
    merged.set(key, extra);
  }

  return Array.from(merged.values());
}

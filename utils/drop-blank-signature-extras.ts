import { ApplicantExtrasEntity } from '../models/applicant';

/** Extras whose value is a drawn/typed signature image. */
const SIGNATURE_TYPES = [
  'SIGNATURE',
  'SIGNATURE_VOE_AUTHORIZATION',
  'SIGNATURE_DISCLOSURE_AUTHORIZATION',
  'SIGNATURE_IMPORTANT_BACKGROUND',
  'SIGNATURE_GENERAL_CONSENT',
];

function isBlank(value: unknown): boolean {
  return value === null || value === undefined || String(value).trim() === '';
}

/**
 * Drops signature extras that carry no signature from a background-save payload.
 *
 * The backend merges extras by type and copies any key that is *present* on the
 * incoming row (safeAssign). An extra sent as `{ type: SIGNATURE_X, value: null }`
 * therefore overwrites a signature the driver had already saved. A value of
 * `undefined` is harmless — JSON.stringify drops the key — but `null` is not.
 *
 * The form produces that null routinely: clearing the signature pad, or
 * unticking the typed-signature consent box, sets the field to null, and any
 * background save that fires afterwards (the per-step auto-save, or the
 * page-exit beacon) flushes it. The driver believes they signed; the stored
 * signature is gone.
 *
 * Background saves exist to preserve progress, so they must never be able to
 * *destroy* a signature. Only the explicit final submit changes signature state,
 * and it filters blanks of its own accord. Non-signature extras are untouched —
 * clearing those really is how the driver changes an answer.
 */
export function dropBlankSignatureExtras(
  extras: ApplicantExtrasEntity[] | undefined
): ApplicantExtrasEntity[] {
  return (extras ?? []).filter(
    (extra) => !(SIGNATURE_TYPES.includes(String(extra?.type)) && isBlank(extra?.value))
  );
}

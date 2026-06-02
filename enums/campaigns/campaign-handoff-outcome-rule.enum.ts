/**
 * Determines which AI call outcomes automatically create a handoff for a campaign.
 * Evaluated against `CampaignCallSummary.outcome` once the AI conversation completes.
 */
export enum CampaignHandoffOutcomeRule {
  /** Never auto-create handoffs (manual only) */
  NONE = 'none',
  /** Only when the AI assessed the outcome as positive */
  POSITIVE = 'positive',
  /** When the AI assessed the outcome as positive or neutral */
  POSITIVE_OR_NEUTRAL = 'positive_or_neutral',
  /** For every target whose conversation completed, regardless of outcome */
  ANY_COMPLETED = 'any_completed',
}

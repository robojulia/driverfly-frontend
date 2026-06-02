export enum CampaignHandoffStatus {
  /** Created and waiting for the assignee to pick it up */
  PENDING = 'pending',
  /** Assignee has acknowledged and is working it */
  ACCEPTED = 'accepted',
  /** Follow-up is finished */
  COMPLETED = 'completed',
  /** No longer needs human follow-up */
  DISMISSED = 'dismissed',
}

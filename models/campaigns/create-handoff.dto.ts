/**
 * Payload to create a handoff for a campaign target.
 * `assignedUserId` is optional — when omitted the assignee is resolved from the
 * campaign's default assignee or the auto-assign algorithm.
 */
export interface CreateHandoffDto {
  campaignTargetId: number;
  assignedUserId?: number;
  notes?: string;
  reason?: string;
}

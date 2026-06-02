import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CampaignHandoffsApi, {
  HandoffStatsResponse,
} from '../../pages/api/campaign-handoffs';
import UserApi from '../../pages/api/user';
import { CampaignHandoffEntity } from '../../models/campaigns/campaign-handoff.entity';
import { CreateHandoffDto } from '../../models/campaigns/create-handoff.dto';
import { HandoffQueryDto } from '../../models/campaigns/handoff-query.dto';
import { CampaignHandoffStatus } from '../../enums/campaigns/campaign-handoff-status.enum';
import { UserEntity } from '../../models/user/user.entity';
import { Status } from '../../enums/status.enum';
import { AssignableUser, AutoAssignMethod, pickNextUser } from '../../utils/auto-assign';

/**
 * Loads the active company users/recruiters a handoff can be assigned to.
 * Mirrors the filtering used by {@link useAutoAssign}.
 */
export const useAssignableUsers = () => {
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const userApi = new UserApi();
      const all = await userApi.list();
      setUsers(all.filter((u) => u.status === Status.ACTIVE && !u.company_disabled));
    } catch (err) {
      console.error('Error loading assignable users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { users, loading, reload: load };
};

/**
 * Resolve which user a handoff should go to when the creator did not pick one.
 * Falls back: explicit default assignee → auto-assign across active users → none.
 */
export async function resolveHandoffAssignee(opts: {
  companyId: number;
  users: UserEntity[];
  defaultAssigneeUserId?: number;
  autoAssign?: boolean;
  autoAssignMethod?: AutoAssignMethod;
}): Promise<number | null> {
  const { companyId, users, defaultAssigneeUserId, autoAssign, autoAssignMethod } = opts;

  if (defaultAssigneeUserId) return defaultAssigneeUserId;
  if (!autoAssign || !users.length) return null;

  const userApi = new UserApi();
  const scores: Record<number, number> = {};
  if (autoAssignMethod === 'weighted') {
    try {
      const summaries = await userApi.getScoreSummaries();
      summaries.forEach((s) => {
        scores[s.userId] = s.overallScore;
      });
    } catch {
      // weighted falls back to equal weights
    }
  }

  const assignable: AssignableUser[] = users
    .filter((u) => u.id != null)
    .map((u) => ({ id: u.id as number, score: scores[u.id as number] ?? 50 }));

  return pickNextUser(assignable, autoAssignMethod || 'round_robin', companyId);
}

/** Send the assignee notification email for a freshly created handoff. */
async function sendHandoffEmail(handoff: CampaignHandoffEntity) {
  const assignee = handoff.assignedUser;
  if (!assignee?.email) return;

  const inboxUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/dashboard/company/handoffs`
      : undefined;

  try {
    await axios.post('/api/send-handoff-email', {
      assigneeEmail: assignee.email,
      assigneeName: [assignee.first_name, assignee.last_name].filter(Boolean).join(' '),
      driverName: handoff.targetName,
      driverPhone: handoff.targetPhone,
      driverEmail: handoff.targetEmail,
      campaignName: handoff.campaignName,
      notes: handoff.notes,
      summary: handoff.callSummary?.summary,
      outcome: handoff.callSummary?.outcome,
      inboxUrl,
    });
  } catch (err) {
    // Email failure should not break the handoff flow
    console.error('Failed to send handoff notification email:', err);
  }
}

/**
 * Per-campaign handoffs — used by the campaign detail target list to create
 * handoffs and read existing ones.
 */
export const useCampaignHandoffs = (campaignId: number) => {
  const [handoffs, setHandoffs] = useState<CampaignHandoffEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const api = new CampaignHandoffsApi();

  const load = useCallback(async () => {
    if (!campaignId) return;
    try {
      setLoading(true);
      const list = await api.listForCampaign(campaignId);
      setHandoffs(list);
      return list;
    } catch (err) {
      console.error('Error loading campaign handoffs:', err);
      setHandoffs([]);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const createHandoff = useCallback(
    async (dto: CreateHandoffDto) => {
      const created = await api.create(campaignId, dto);
      await sendHandoffEmail(created);
      setHandoffs((prev) => [created, ...prev]);
      return created;
    },
    [campaignId]
  );

  return { handoffs, loading, load, createHandoff };
};

/**
 * Handoff inbox — the assignee's queue of handoffs with lifecycle actions.
 */
export const useHandoffInbox = () => {
  const [handoffs, setHandoffs] = useState<CampaignHandoffEntity[]>([]);
  const [stats, setStats] = useState<HandoffStatsResponse | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const api = new CampaignHandoffsApi();

  const load = useCallback(async (query?: HandoffQueryDto) => {
    try {
      setLoading(true);
      setError(null);
      const [list, statsData] = await Promise.all([
        api.list(query),
        api.getStats().catch(() => null),
      ]);
      setHandoffs(list.handoffs || []);
      setTotal(list.total || 0);
      if (statsData) setStats(statsData);
      return list;
    } catch (err) {
      console.error('Error loading handoff inbox:', err);
      setError('Failed to load handoffs');
      setHandoffs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (handoffId: number, status: CampaignHandoffStatus) => {
      const updated = await api.update(handoffId, { status });
      setHandoffs((prev) => prev.map((h) => (h.id === handoffId ? updated : h)));
      return updated;
    },
    []
  );

  const reassign = useCallback(async (handoffId: number, assignedUserId: number) => {
    const updated = await api.update(handoffId, { assignedUserId });
    setHandoffs((prev) => prev.map((h) => (h.id === handoffId ? updated : h)));
    return updated;
  }, []);

  const accept = useCallback(
    (id: number) => updateStatus(id, CampaignHandoffStatus.ACCEPTED),
    [updateStatus]
  );
  const complete = useCallback(
    (id: number) => updateStatus(id, CampaignHandoffStatus.COMPLETED),
    [updateStatus]
  );
  const dismiss = useCallback(
    (id: number) => updateStatus(id, CampaignHandoffStatus.DISMISSED),
    [updateStatus]
  );

  return {
    handoffs,
    stats,
    total,
    loading,
    error,
    load,
    accept,
    complete,
    dismiss,
    reassign,
  };
};

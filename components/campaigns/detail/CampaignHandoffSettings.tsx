import React, { useMemo, useState } from 'react';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import { PersonCheck } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { CampaignEntity } from '../../../models/campaigns/campaign.entity';
import { UserEntity } from '../../../models/user/user.entity';
import {
  CampaignHandoffConfig,
  DEFAULT_CAMPAIGN_HANDOFF_CONFIG,
} from '../../../models/campaigns/campaign-handoff.entity';
import { CampaignHandoffOutcomeRule } from '../../../enums/campaigns/campaign-handoff-outcome-rule.enum';
import { AutoAssignMethod } from '../../../utils/auto-assign';
import CampaignsApi from '../../../pages/api/campaigns';

interface CampaignHandoffSettingsProps {
  campaign: CampaignEntity;
  users: UserEntity[];
  onSaved?: () => void;
}

const OUTCOME_RULE_LABELS: Record<CampaignHandoffOutcomeRule, string> = {
  [CampaignHandoffOutcomeRule.NONE]: 'Never (manual only)',
  [CampaignHandoffOutcomeRule.POSITIVE]: 'When AI outcome is positive',
  [CampaignHandoffOutcomeRule.POSITIVE_OR_NEUTRAL]: 'When AI outcome is positive or neutral',
  [CampaignHandoffOutcomeRule.ANY_COMPLETED]: 'For every completed conversation',
};

const userLabel = (u: UserEntity) =>
  [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || `User #${u.id}`;

export const CampaignHandoffSettings: React.FC<CampaignHandoffSettingsProps> = ({
  campaign,
  users,
  onSaved,
}) => {
  const initial: CampaignHandoffConfig = useMemo(
    () => ({
      ...DEFAULT_CAMPAIGN_HANDOFF_CONFIG,
      ...(campaign.config?.handoff as Partial<CampaignHandoffConfig> | undefined),
    }),
    [campaign.config?.handoff]
  );

  const [config, setConfig] = useState<CampaignHandoffConfig>(initial);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(config) !== JSON.stringify(initial);

  const update = (patch: Partial<CampaignHandoffConfig>) =>
    setConfig((prev) => ({ ...prev, ...patch }));

  const handleSave = async () => {
    try {
      setSaving(true);
      const campaignsApi = new CampaignsApi();
      await campaignsApi.update(campaign.id, {
        config: { ...(campaign.config || {}), handoff: config },
      });
      toast.success('Handoff settings saved.');
      onSaved?.();
    } catch (err) {
      console.error('Error saving handoff settings:', err);
      toast.error('Failed to save handoff settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-sm mt-4">
      <CardHeader className="bg-white border-bottom d-flex align-items-center">
        <PersonCheck size={18} className="me-2 text-primary" />
        <span className="fw-semibold">Recruiter Handoff</span>
      </CardHeader>
      <CardBody>
        <p className="text-muted small">
          Automatically route drivers to a recruiter once the AI conversation completes. You can
          also hand off any driver manually from the Targets tab.
        </p>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="handoffEnabled"
            checked={config.enabled}
            onChange={(e) => update({ enabled: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="handoffEnabled">
            Enable automatic handoffs
          </label>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Hand off…</label>
            <select
              className="form-select"
              value={config.outcomeRule}
              disabled={!config.enabled}
              onChange={(e) =>
                update({ outcomeRule: e.target.value as CampaignHandoffOutcomeRule })
              }
            >
              {Object.values(CampaignHandoffOutcomeRule).map((rule) => (
                <option key={rule} value={rule}>
                  {OUTCOME_RULE_LABELS[rule]}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Default assignee</label>
            <select
              className="form-select"
              value={config.autoAssign ? '' : config.defaultAssigneeUserId ?? ''}
              disabled={config.autoAssign}
              onChange={(e) =>
                update({
                  defaultAssigneeUserId: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            >
              <option value="">Select a recruiter</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {userLabel(u)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="handoffAutoAssign"
            checked={!!config.autoAssign}
            onChange={(e) => update({ autoAssign: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="handoffAutoAssign">
            Distribute across recruiters automatically (instead of a single assignee)
          </label>
        </div>

        {config.autoAssign && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Distribution method</label>
              <select
                className="form-select"
                value={config.autoAssignMethod || 'round_robin'}
                onChange={(e) =>
                  update({ autoAssignMethod: e.target.value as AutoAssignMethod })
                }
              >
                <option value="round_robin">Round robin (even split)</option>
                <option value="weighted">Weighted by recruiter score</option>
              </select>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end">
          <Button color="primary" onClick={handleSave} disabled={!dirty || saving}>
            {saving ? 'Saving…' : 'Save handoff settings'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default CampaignHandoffSettings;

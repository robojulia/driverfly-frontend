import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { CompanyPreferenceCategory } from '../../enums/company/company-preference-category.enum';
import { CompanyPreferenceAutoRecrutingLabel } from '../../enums/company/company-preferences-auto-recruiting-label.enum';
import { CompanyPreferenceEntity } from '../../models/company/company-preferences.entity';
import CompanyApi from '../../pages/api/company';
import BaseCheck from '../forms/base-check';

export type AutoAssignMethod = 'round_robin' | 'weighted';

interface AutoAssignSettingsProps {
  companyId: number;
}

export const AutoAssignSettings: React.FC<AutoAssignSettingsProps> = ({ companyId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const [assignMethod, setAssignMethod] = useState<AutoAssignMethod>('round_robin');

  const [enabledPref, setEnabledPref] = useState<CompanyPreferenceEntity | null>(null);
  const [methodPref, setMethodPref] = useState<CompanyPreferenceEntity | null>(null);

  const api = new CompanyApi();

  useEffect(() => {
    if (!companyId) return;
    loadPreferences();
  }, [companyId]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await api.preferences.list(companyId);

      const ep = prefs.find(
        (p) => p.label === CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_INBOUND_APPLICANTS
      );
      const mp = prefs.find(
        (p) => p.label === CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_METHOD
      );

      if (ep) {
        setEnabledPref(ep);
        setAutoAssignEnabled(Boolean(ep.value));
      }
      if (mp) {
        setMethodPref(mp);
        setAssignMethod((mp.value as AutoAssignMethod) || 'round_robin');
      }
    } catch (e) {
      console.error('Failed to load auto-assign preferences', e);
    } finally {
      setLoading(false);
    }
  };

  const savePref = async (
    current: CompanyPreferenceEntity | null,
    label: CompanyPreferenceAutoRecrutingLabel,
    value: any
  ): Promise<CompanyPreferenceEntity> => {
    if (current?.id) {
      return api.preferences.update(companyId, current.id, { ...current, value });
    }
    return api.preferences.create(companyId, {
      category: CompanyPreferenceCategory.AUTO_RECRUITING,
      label,
      value,
    });
  };

  const handleToggleEnabled = async (checked: boolean) => {
    setAutoAssignEnabled(checked);
    setSaving(true);
    try {
      const updated = await savePref(
        enabledPref,
        CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_INBOUND_APPLICANTS,
        checked
      );
      setEnabledPref(updated);
      toast.success(checked ? 'Auto-assign enabled' : 'Auto-assign disabled');
    } catch (e) {
      console.error('Failed to save auto-assign preference', e);
      toast.error('Unable to save preference');
      setAutoAssignEnabled(!checked);
    } finally {
      setSaving(false);
    }
  };

  const handleMethodChange = async (method: AutoAssignMethod) => {
    setAssignMethod(method);
    setSaving(true);
    try {
      const updated = await savePref(
        methodPref,
        CompanyPreferenceAutoRecrutingLabel.AUTO_ASSIGN_METHOD,
        method
      );
      setMethodPref(updated);
    } catch (e) {
      console.error('Failed to save assignment method preference', e);
      toast.error('Unable to save preference');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4 d-flex align-items-center gap-2">
          <Spinner size="sm" animation="border" />
          <span className="text-muted small">Loading assignment settings…</span>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body className="p-4">
        {/* Header row */}
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5
              className="mb-1"
              style={{ color: '#1a202c', fontWeight: 600, fontSize: '14px' }}
            >
              Auto Assign Inbound Applicants
            </h5>
            <p className="mb-0 small" style={{ color: '#718096' }}>
              Automatically assign new applicants to recruiters as they come in.
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            {saving && <Spinner size="sm" animation="border" />}
            <span
              className="small"
              style={{ color: autoAssignEnabled ? '#1a202c' : '#718096', fontWeight: 500 }}
            >
              {autoAssignEnabled ? 'Active' : 'Disabled'}
            </span>
            <BaseCheck
              checked={autoAssignEnabled}
              onChange={(e) => handleToggleEnabled(Boolean((e.target as any).value))}
              disabled={saving}
            />
          </div>
        </div>

        {/* Assignment method — shown only when enabled */}
        {autoAssignEnabled && (
          <div
            className="mt-4 p-3 rounded"
            style={{ background: '#f7fafc', border: '1px solid #e2e8f0' }}
          >
            <p className="mb-3 small fw-semibold" style={{ color: '#2d3748' }}>
              Assignment Method
            </p>

            {/* Round Robin */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="assignMethod"
                  id="method-round-robin"
                  checked={assignMethod === 'round_robin'}
                  onChange={() => handleMethodChange('round_robin')}
                  disabled={saving}
                  style={{ cursor: 'pointer' }}
                />
                <label
                  className="form-check-label fw-medium small"
                  htmlFor="method-round-robin"
                  style={{ cursor: 'pointer' }}
                >
                  Round Robin
                </label>
              </div>
              <p className="text-muted small ms-4 mb-0">
                Applicants are distributed evenly across all active recruiters in rotation.
              </p>
            </div>

            {/* Weighted by Performance */}
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="assignMethod"
                  id="method-weighted"
                  checked={assignMethod === 'weighted'}
                  onChange={() => handleMethodChange('weighted')}
                  disabled={saving}
                  style={{ cursor: 'pointer' }}
                />
                <label
                  className="form-check-label fw-medium small"
                  htmlFor="method-weighted"
                  style={{ cursor: 'pointer' }}
                >
                  Weighted by Performance Score
                </label>
              </div>
              <p className="text-muted small ms-4 mb-2">
                Higher-scoring recruiters receive proportionally more applicants. Shares are
                calculated from each recruiter&apos;s summary score relative to the team total.
              </p>

              {/* Example callout */}
              <div
                className="ms-4 p-2 rounded small"
                style={{
                  background: '#ebf8ff',
                  border: '1px solid #bee3f8',
                  color: '#2b6cb0',
                }}
              >
                <strong>Example:</strong> Recruiter A (5★ score) and Recruiter B (3★ score) — for
                every 8 inbound leads, Recruiter A receives 5 and Recruiter B receives 3.
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

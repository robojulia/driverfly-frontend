import React, { useState, useMemo, useEffect } from 'react';
import { Button } from 'reactstrap';
import { Button as BsButton } from 'react-bootstrap';
import {
  ArrowLeft,
  TelephoneInbound,
  Clock,
  PersonCheck,
  CalendarCheck,
} from 'react-bootstrap-icons';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { CampaignType } from '../../enums/campaigns/campaign-type.enum';
import { useCampaigns } from '../../hooks/campaigns/use-campaigns';
import { useTranslation } from '../../hooks/use-translation';
import { CampaignTypeSummaryTable } from './CampaignTypeSummaryTable';
import { CampaignsTable } from './CampaignsTable';

export type ViewMode = 'summary' | 'detail';

interface DetailView {
  communicationType: CampaignCommunicationType;
  campaignType: CampaignType;
}

interface CampaignsViewProps {
  onTitleChange?: (title: string) => void;
  onViewModeChange?: (mode: ViewMode) => void;
  onTabChange?: (tab: TabType) => void;
  onRequestInbound?: () => void;
}

type TabType = CampaignCommunicationType | 'INBOUND_CALLS';

export const CampaignsView: React.FC<CampaignsViewProps> = ({ onTitleChange, onViewModeChange, onTabChange, onRequestInbound }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>(
    CampaignCommunicationType.VOICE
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [detailView, setDetailView] = useState<DetailView | null>(null);

  const { campaigns, loading, error, loadCampaigns } = useCampaigns();

  // Load campaigns on mount
  useEffect(() => {
    if (loadCampaigns) {
      loadCampaigns({
        page: 1,
        limit: 1000, // Load all campaigns for summary view
        sortBy: 'createdAt',
        sortOrder: 'DESC',
      });
    }
  }, [loadCampaigns]);

  // Group campaigns by communication type and campaign type
  const groupedCampaigns = useMemo(() => {
    if (!campaigns) return {};

    const groups: Record<
      CampaignCommunicationType,
      Partial<Record<CampaignType, CampaignEntity[]>>
    > = {
      [CampaignCommunicationType.VOICE]: {},
      [CampaignCommunicationType.SMS]: {},
    };

    campaigns.forEach((campaign) => {
      const commType = campaign.communicationType;
      const campType = campaign.type;

      if (!groups[commType][campType]) {
        groups[commType][campType] = [];
      }
      groups[commType][campType]!.push(campaign);
    });

    return groups;
  }, [campaigns]);

  const handleDrillDown = (commType: CampaignCommunicationType, campType: CampaignType) => {
    setDetailView({ communicationType: commType, campaignType: campType });
    setViewMode('detail');

    // Notify parent of view mode change
    if (onViewModeChange) {
      onViewModeChange('detail');
    }

    // Update page title
    if (onTitleChange) {
      const typeLabel = getCampaignTypeLabel(campType);
      const commLabel = commType === CampaignCommunicationType.VOICE ? 'Voice' : 'Text';
      onTitleChange(`${typeLabel} - ${commLabel} Campaigns`);
    }
  };

  const handleBackToSummary = () => {
    setViewMode('summary');
    setDetailView(null);

    // Notify parent of view mode change
    if (onViewModeChange) {
      onViewModeChange('summary');
    }

    // Reset page title
    if (onTitleChange) {
      onTitleChange('MARKETING_CAMPAIGNS');
    }
  };

  const getCampaignTypeLabel = (type: CampaignType | string): string => {
    // Handle both new enum value and legacy database value
    if (type === CampaignType.REIGNITE_PAST_LEADS || type === 'JOB_REACHOUT') {
      return t('CAMPAIGN_TYPES.REIGNITE_PAST_LEADS');
    }
    return type as string;
  };

  const renderSummaryView = (communicationType: CampaignCommunicationType) => {
    const campaignsByType = groupedCampaigns[communicationType] || {};
    const campaignTypes = Object.keys(campaignsByType);

    if (campaignTypes.length === 0) {
      return (
        <div className="text-center py-5">
          <p className="text-muted">
            No {communicationType === CampaignCommunicationType.VOICE ? 'voice' : 'text'} campaigns
            yet
          </p>
        </div>
      );
    }

    return (
      <CampaignTypeSummaryTable
        campaignsByType={campaignsByType}
        onTypeClick={(type) => handleDrillDown(communicationType, type as CampaignType)}
      />
    );
  };

  const renderInboundView = () => {
    const features = [
      {
        icon: <Clock size={22} />,
        title: 'Always Available',
        description:
          'Answers every inbound call 24/7 so no applicant or lead ever reaches a busy signal or voicemail.',
      },
      {
        icon: <PersonCheck size={22} />,
        title: 'Pre-Qualifies Drivers',
        description:
          'Screens callers against your requirements and routes qualified applicants straight into your pipeline.',
      },
      {
        icon: <CalendarCheck size={22} />,
        title: 'Schedules Callbacks',
        description:
          'Captures caller details and books follow-up callbacks for anything it can’t resolve on the spot.',
      },
    ];

    return (
      <div className="text-center py-5">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 96, 120, 0.1)',
            color: 'var(--primary-dark, #006078)',
            marginBottom: '1rem',
          }}
        >
          <TelephoneInbound size={32} />
        </div>

        <h4 style={{ fontWeight: 600 }}>AI Inbound Call Agent</h4>
        <p className="text-muted" style={{ maxWidth: '560px', margin: '0.5rem auto 0' }}>
          Set up an AI receptionist that answers your inbound calls, screens drivers,
          and books callbacks around the clock. Tell us how you want calls handled and
          our team will configure your agent.
        </p>

        <div
          className="row justify-content-center"
          style={{ maxWidth: '900px', margin: '2.5rem auto 0' }}
        >
          {features.map((feature) => (
            <div className="col-md-4 mb-4" key={feature.title}>
              <div
                style={{
                  height: '100%',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--medium-gray, #dee2e6)',
                  backgroundColor: 'var(--form-info-bg, #f8f9fa)',
                  textAlign: 'left',
                }}
              >
                <div style={{ color: 'var(--primary-dark, #006078)', marginBottom: '0.75rem' }}>
                  {feature.icon}
                </div>
                <div style={{ fontWeight: 600, marginBottom: '0.35rem' }}>{feature.title}</div>
                <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {onRequestInbound && (
          <BsButton variant="primary" size="lg" onClick={onRequestInbound}>
            Request Inbound AI Setup
          </BsButton>
        )}
      </div>
    );
  };

  const renderDetailView = () => {
    if (!detailView) return null;

    const campaigns = groupedCampaigns[detailView.communicationType]?.[detailView.campaignType];

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <Button color="link" onClick={handleBackToSummary} style={{ padding: 0, fontSize: '0.9rem' }}>
            <ArrowLeft size={16} /> Back to Summary
          </Button>
        </div>

        <CampaignsTable
          campaigns={campaigns || []}
          loading={loading}
          showFilters={true}
        />
      </div>
    );
  };

  if (loading && !campaigns) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">{t('LOADING')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {t('ERROR_LOADING_CAMPAIGNS')}
      </div>
    );
  }

  // If in detail view, don't show tabs
  if (viewMode === 'detail') {
    return renderDetailView();
  }

  return (
    <div>
      {/* Tabs for Voice vs Text - Pills style matching employee Active/Past buttons */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            padding: '4px',
            backgroundColor: 'var(--form-info-bg, #f8f9fa)',
            borderRadius: '12px',
            border: '1px solid var(--medium-gray, #dee2e6)',
          }}
        >
          <button
            onClick={() => handleTabChange(CampaignCommunicationType.VOICE)}
            style={{
              padding: '0.875rem 1.5rem',
              fontSize: '1.125rem',
              backgroundColor:
                activeTab === CampaignCommunicationType.VOICE
                  ? 'var(--primary-dark, #006078)'
                  : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '120px',
              justifyContent: 'center',
              color:
                activeTab === CampaignCommunicationType.VOICE
                  ? 'var(--text-light, #ffffff)'
                  : 'var(--text-secondary, #6c757d)',
              boxShadow:
                activeTab === CampaignCommunicationType.VOICE
                  ? '0 2px 4px rgba(95, 203, 196, 0.3)'
                  : 'none',
              transform:
                activeTab === CampaignCommunicationType.VOICE ? 'translateY(-1px)' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== CampaignCommunicationType.VOICE) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== CampaignCommunicationType.VOICE) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            Voice Campaigns
          </button>
          <button
            onClick={() => handleTabChange(CampaignCommunicationType.SMS)}
            style={{
              padding: '0.875rem 1.5rem',
              fontSize: '1.125rem',
              backgroundColor:
                activeTab === CampaignCommunicationType.SMS
                  ? 'var(--primary-dark, #006078)'
                  : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '120px',
              justifyContent: 'center',
              color:
                activeTab === CampaignCommunicationType.SMS
                  ? 'var(--text-light, #ffffff)'
                  : 'var(--text-secondary, #6c757d)',
              boxShadow:
                activeTab === CampaignCommunicationType.SMS
                  ? '0 2px 4px rgba(95, 203, 196, 0.3)'
                  : 'none',
              transform:
                activeTab === CampaignCommunicationType.SMS ? 'translateY(-1px)' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== CampaignCommunicationType.SMS) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== CampaignCommunicationType.SMS) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            Text Campaigns
          </button>
          <button
            onClick={() => handleTabChange('INBOUND_CALLS')}
            style={{
              padding: '0.875rem 1.5rem',
              fontSize: '1.125rem',
              backgroundColor:
                activeTab === 'INBOUND_CALLS'
                  ? 'var(--primary-dark, #006078)'
                  : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '120px',
              justifyContent: 'center',
              color:
                activeTab === 'INBOUND_CALLS'
                  ? 'var(--text-light, #ffffff)'
                  : 'var(--text-secondary, #6c757d)',
              boxShadow:
                activeTab === 'INBOUND_CALLS'
                  ? '0 2px 4px rgba(95, 203, 196, 0.3)'
                  : 'none',
              transform:
                activeTab === 'INBOUND_CALLS' ? 'translateY(-1px)' : 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'INBOUND_CALLS') {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'INBOUND_CALLS') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            Inbound Calls
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === CampaignCommunicationType.VOICE &&
          renderSummaryView(CampaignCommunicationType.VOICE)}
        {activeTab === CampaignCommunicationType.SMS &&
          renderSummaryView(CampaignCommunicationType.SMS)}
        {activeTab === 'INBOUND_CALLS' && renderInboundView()}
      </div>
    </div>
  );
};

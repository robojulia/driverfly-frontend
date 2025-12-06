import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, ButtonGroup } from 'react-bootstrap';
import {
  Pencil,
  MapFill,
  CurrencyDollar,
  CalendarEventFill,
  PeopleFill,
  ClockFill,
  BarChartFill,
  InfoCircleFill,
  TelephoneFill,
  ChevronDown,
  ChevronUp,
  BoxArrowUpRight,
} from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { DeleteButton } from '../buttons/delete-button';
import { ReactivateJobButton } from '../jobs/reactivate-job';
import { JobAICampaigns } from './JobAICampaigns';
import { EligibilityOverview } from './EligibilityOverview';
import { JobDetailsOverview } from './JobDetailsOverview';
import { CampaignCta } from './CampaignCta';
import { JobAnalyticsDashboard } from '../analytics/JobAnalyticsDashboard';
import { JobEntity } from '../../models/job/job.entity';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import { useFeatureFlag } from '../../context/feature-flag-context';
import { useJobCampaigns } from '../../hooks/campaigns/use-campaigns';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import JobApi from '../../pages/api/job';
import EligibilityApi from '../../pages/api/eligibility';
import styles from '../../styles/job-dashboard.module.css';

interface JobDashboardProps {
  job: JobEntity;
  onJobUpdate?: (updatedJob: JobEntity) => void;
  onJobDelete?: () => void;
}

type TabType = 'overview' | 'applicants' | 'analytics' | 'ai-campaigns';

export const JobDashboard: React.FC<JobDashboardProps> = ({
  job: initialJob,
  onJobUpdate,
  onJobDelete,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const campaignsEnabled = useFeatureFlag('CAMPAIGNS_ENABLED');

  const [job, setJob] = useState<JobEntity>(initialJob);
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    // Persist active tab across token refreshes using sessionStorage
    if (typeof window !== 'undefined') {
      const savedTab = sessionStorage.getItem(`jobDashboard_activeTab_${initialJob.id}`);
      return (savedTab as TabType) || 'overview';
    }
    return 'overview';
  });
  const [eligibilityStats, setEligibilityStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [campaignCtaExpanded, setCampaignCtaExpanded] = useState(false);

  // Load campaigns for this job - only if campaigns are enabled
  const {
    campaigns,
    loading: campaignsLoading,
    loadJobCampaigns,
  } = useJobCampaigns(campaignsEnabled ? job.id : null);

  // Load eligibility stats and campaigns
  useEffect(() => {
    const loadEligibilityStats = async () => {
      try {
        setLoadingStats(true);
        const eligibilityApi = new EligibilityApi();

        // Fetch applicants who applied DIRECTLY to this job only
        const stats = await eligibilityApi.getJobEligibilityScores(job.id, {
          limit: 100,
          offset: 0,
          appliedOnly: true,
        });

        // Fetch all eligible applicants from the entire system
        const systemStats = await eligibilityApi.getJobEligibilityScores(job.id, {
          limit: 1000,
          offset: 0,
          appliedOnly: false,
        });

        // Calculate summary stats from applicants who DIRECTLY applied to this job
        // Only count those who are eligible AND applied directly
        const eligibleCount =
          stats.scoredApplicants?.filter((item) => item.eligibilityStatus === 'ELIGIBLE')?.length ||
          0;

        const ineligibleCount =
          stats.scoredApplicants?.filter((item) => item.eligibilityStatus === 'NOT_ELIGIBLE')
            ?.length || 0;

        const recentCount =
          stats.scoredApplicants?.filter((item) => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(item.lastUpdated) > weekAgo;
          })?.length || 0;

        const avgScore =
          stats.scoredApplicants?.length > 0
            ? stats.scoredApplicants.reduce((sum, item) => sum + item.score, 0) /
              stats.scoredApplicants.length
            : 0;

        // Count eligible from entire system
        const eligibleFromSystemCount =
          systemStats.scoredApplicants?.filter((item) => item.eligibilityStatus === 'ELIGIBLE')
            ?.length || 0;

        const eligibilityStats = {
          totalApplicants: stats.totalApplicants || 0,
          eligibleApplicants: eligibleCount,
          ineligibleApplicants: ineligibleCount,
          eligibilityRate:
            stats.totalApplicants > 0 ? (eligibleCount / stats.totalApplicants) * 100 : 0,
          recentApplications: recentCount,
          averageScore: avgScore,
          eligibleFromSystem: eligibleFromSystemCount,
        };

        setEligibilityStats(eligibilityStats);

        // Load existing campaigns for this job - only if campaigns are enabled
        if (campaignsEnabled) {
          await loadJobCampaigns();
        }
      } catch (error) {
        console.error('Failed to load eligibility stats:', error);
        // Set default stats on error
        setEligibilityStats({
          totalApplicants: 0,
          eligibleApplicants: 0,
          ineligibleApplicants: 0,
          eligibilityRate: 0,
          recentApplications: 0,
          averageScore: 0,
          eligibleFromSystem: 0,
        });
      } finally {
        setLoadingStats(false);
      }
    };

    if (job.id) {
      loadEligibilityStats();
    }
  }, [job.id, loadJobCampaigns, campaignsEnabled]);

  // Redirect to overview if user is on analytics tab but campaigns are disabled
  useEffect(() => {
    if (!campaignsEnabled && activeTab === 'analytics') {
      handleTabChange('overview');
    }
  }, [campaignsEnabled, activeTab]);

  // Helper function to change tabs and persist selection
  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`jobDashboard_activeTab_${job.id}`, tabId);
    }
  };

  // Helper function to generate job posting URL
  const getJobPostingUrl = () => {
    if (!job.title || !job.id) return '#';

    // Create a slug from the job title (similar to how it's likely generated)
    const slug = job.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();

    return `/jobs/${job.id}/${slug}`;
  };

  const handleEditClick = () => {
    router.push(`${router.asPath}/edit`);
  };

  const handleDeleteClick = async () => {
    try {
      const api = new JobApi();
      await api.remove(job.id);
      toast.success(
        t(
          'Forms.SUCCESS_{action}_{name}',
          { action: 'Forms.Deleted', name: 'JOB' },
          { translateProps: true }
        )
      );
      if (onJobDelete) {
        onJobDelete();
      } else {
        router.push('/dashboard/company/jobs');
      }
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        toast: toast,
        t: t,
        defaultMessage: 'UNABLE_TO_DELETE',
      });
    }
  };

  const formatSalary = (job: JobEntity) => {
    if (job.min_weekly_pay && job.max_weekly_pay) {
      return `$${job.min_weekly_pay.toLocaleString()} - $${job.max_weekly_pay.toLocaleString()}/week`;
    } else if (job.min_weekly_pay) {
      return `$${job.min_weekly_pay.toLocaleString()}+/week`;
    }
    return 'Salary not specified';
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Not specified';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return { label: 'Active', class: styles.statusActive };
      case 'inactive':
        return { label: 'Inactive', class: styles.statusInactive };
      default:
        return { label: status || 'Unknown', class: styles.statusInactive };
    }
  };

  const statusDisplay = getStatusDisplay(job.status);

  // Helper functions for campaign CTA toggle
  const getActiveCampaign = () => {
    return campaigns.find((c) => c.status === 'ACTIVE' || c.status === 'DRAFT');
  };

  const getCampaignToggleText = () => {
    const activeCampaign = getActiveCampaign();
    if (activeCampaign) {
      const status = activeCampaign.status === 'ACTIVE' ? 'active' : 'draft';
      return `Campaign in ${status}`;
    }
    const candidateCount = eligibilityStats?.eligibleApplicants || 0;
    return `Reach ${candidateCount} candidates`;
  };

  const getCampaignToggleClass = () => {
    const activeCampaign = getActiveCampaign();
    if (activeCampaign) {
      return activeCampaign.status === 'ACTIVE'
        ? styles.campaignToggleActive
        : styles.campaignToggleDraft;
    }
    return '';
  };

  const tabs: Array<{
    id: TabType;
    label: string;
    icon: any;
    badge?: number;
  }> = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: InfoCircleFill,
    },
    {
      id: 'applicants' as TabType,
      label: 'Candidates',
      icon: PeopleFill,
    },
    ...(campaignsEnabled
      ? [
          {
            id: 'analytics' as TabType,
            label: 'Analytics',
            icon: BarChartFill,
          },
        ]
      : []),
    ...(campaignsEnabled
      ? [
          {
            id: 'ai-campaigns' as TabType,
            label: 'AI Campaigns',
            icon: TelephoneFill,
          },
        ]
      : []),
  ];

  const can = {
    update: hasPermission('CanUpdateJob'),
    delete: hasPermission('CanDeleteJob'),
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container-fluid">
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <h1 className={styles.jobTitle}>{job.title}</h1>

              <div className={styles.jobMeta}>
                <div className={styles.metaItem}>
                  <MapFill className={styles.metaIcon} />
                  {job.location
                    ? `${job.location.city}, ${job.location.state}`
                    : 'Location not specified'}
                </div>
                <div className={styles.metaItem}>
                  <CurrencyDollar className={styles.metaIcon} />
                  {formatSalary(job)}
                </div>
                <div className={styles.metaItem}>
                  <CalendarEventFill className={styles.metaIcon} />
                  Posted {formatDate(job.created_at)}
                </div>
                <div className={styles.metaItem}>
                  <span className={`${styles.statusBadge} ${statusDisplay.class}`}>
                    {statusDisplay.label}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                href={getJobPostingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="me-2"
              >
                <BoxArrowUpRight className="me-1" />
                View Job Posting
              </Button>
              <ReactivateJobButton
                variant="outline-success"
                job={job}
                className="border-0"
                onComplete={(updatedJob) => {
                  setJob(updatedJob);
                  if (onJobUpdate) onJobUpdate(updatedJob);
                }}
              />
              {can.delete && <DeleteButton onDelete={handleDeleteClick} />}
              {can.update && (
                <Button type="button" onClick={handleEditClick}>
                  <Pencil /> {t('EDIT')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <tab.icon className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && <JobDetailsOverview job={job} />}

        {activeTab === 'applicants' && (
          <div className={styles.overviewContainer}>
            {/* Mobile Campaign Toggle - Only if campaigns enabled */}
            {campaignsEnabled && (
              <div className={styles.campaignToggleContainer}>
                <button
                  className={`${styles.campaignToggle} ${getCampaignToggleClass()} ${
                    campaignCtaExpanded ? styles.campaignToggleExpanded : ''
                  }`}
                  onClick={() => setCampaignCtaExpanded(!campaignCtaExpanded)}
                >
                  <div className={styles.campaignToggleContent}>
                    <TelephoneFill className={styles.campaignToggleIcon} />
                    <span className={styles.campaignToggleText}>{getCampaignToggleText()}</span>
                  </div>
                  {campaignCtaExpanded ? (
                    <ChevronUp className={styles.campaignToggleChevron} />
                  ) : (
                    <ChevronDown className={styles.campaignToggleChevron} />
                  )}
                </button>

                {/* Collapsible Campaign CTA for mobile */}
                <div
                  className={`${styles.campaignCtaCollapsible} ${
                    campaignCtaExpanded ? styles.campaignCtaExpanded : ''
                  }`}
                >
                  <CampaignCta
                    job={job}
                    campaigns={campaigns}
                    campaignsLoading={campaignsLoading}
                    eligibilityStats={eligibilityStats}
                    onCampaignCreated={loadJobCampaigns}
                  />
                </div>
              </div>
            )}

            <div
              className={
                false && campaignsEnabled
                  ? styles.overviewMainLayout
                  : styles.overviewMainLayoutFullWidth
              }
            >
              {/* Main Content: Eligibility Overview with Stats + Table */}
              <div className={styles.overviewMainContent}>
                <EligibilityOverview
                  jobId={job.id}
                  loading={loadingStats}
                  eligibilityStats={eligibilityStats}
                  loadingStats={loadingStats}
                />
              </div>

              {/* Right Sidebar: Campaign CTA (Desktop) - Only if campaigns enabled */}
              {/* NOTE: CAMPAIGN SIDEBAR HIDDEN FOR NOW */}
              {false && campaignsEnabled && (
                <div className={styles.overviewSidebar}>
                  <CampaignCta
                    job={job}
                    campaigns={campaigns}
                    campaignsLoading={campaignsLoading}
                    eligibilityStats={eligibilityStats}
                    onCampaignCreated={loadJobCampaigns}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && campaignsEnabled && <JobAnalyticsDashboard job={job} />}

        {activeTab === 'ai-campaigns' && campaignsEnabled && (
          <JobAICampaigns
            job={job}
            campaigns={campaigns}
            eligibilityStats={eligibilityStats}
            onCampaignCreated={loadJobCampaigns}
          />
        )}
      </div>
    </div>
  );
};

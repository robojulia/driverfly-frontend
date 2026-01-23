import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import CampaignsApi, {
  CreateJobReachoutCampaignDto,
  CampaignReachPreviewResponse,
} from '../../pages/api/campaigns';
import { JobEntity } from '../../models/job/job.entity';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignStatus } from '../../enums/campaigns/campaign-status.enum';
import { CampaignCommunicationType } from '../../enums/campaigns/campaign-communication-type.enum';
import { useTranslation } from '../use-translation';
import { useFeatureFlag } from '../../context/feature-flag-context';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import { BulkLeadDto } from '../../models/campaigns/bulk-lead-upload.dto';

interface UseCampaignCreationProps {
  job: JobEntity;
  campaigns: CampaignEntity[];
  eligibilityStats: any;
  onCampaignCreated?: () => void;
}

export const useCampaignCreation = ({
  job,
  campaigns,
  eligibilityStats,
  onCampaignCreated,
}: UseCampaignCreationProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const callCampaignsEnabled = useFeatureFlag('CALL_CAMPAIGNS_ENABLED');

  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [selectedCommunicationType, setSelectedCommunicationType] =
    useState<CampaignCommunicationType>(
      callCampaignsEnabled ? CampaignCommunicationType.VOICE : CampaignCommunicationType.SMS
    );
  const [reachPreview, setReachPreview] = useState<CampaignReachPreviewResponse | null>(null);
  const [loadingReachPreview, setLoadingReachPreview] = useState(false);

  // Bulk lead upload state
  const [uploadMode, setUploadMode] = useState<'auto' | 'manual'>('auto');
  const [bulkLeads, setBulkLeads] = useState<BulkLeadDto[]>([]);
  const [leadsValid, setLeadsValid] = useState(false);

  // Campaign validation logic
  const draftCampaigns = campaigns.filter((c) => c.status === CampaignStatus.DRAFT);
  const completedCampaigns = campaigns.filter(
    (c) => c.status === CampaignStatus.COMPLETED || c.status === CampaignStatus.CANCELLED
  );
  const hasExistingCampaigns = campaigns.length > 0;
  const hasDraftCampaign = draftCampaigns.length > 0;
  const canCreateCampaign = (eligibilityStats?.eligibleFromSystem > 0) || (eligibilityStats?.eligibleApplicants > 0);

  const fetchReachPreview = useCallback(
    async (communicationType: CampaignCommunicationType) => {
      try {
        setLoadingReachPreview(true);
        const campaignsApi = new CampaignsApi();
        const preview = await campaignsApi.getCampaignReachPreview({
          jobId: job.id,
          communicationType,
          minScore: 50, // Match the minScore used in campaign creation
          excludeApplied: false, // Include direct applicants within the date limit
          directApplicantDaysLimit: 30, // Only include applicants who applied to this job within last 30 days
        });
        setReachPreview(preview);
      } catch (error) {
        console.error('Failed to fetch reach preview:', error);
        // Fallback to old stats if available
        setReachPreview(null);
      } finally {
        setLoadingReachPreview(false);
      }
    },
    [job.id]
  );

  // Fetch reach preview when modal opens or communication type changes
  useEffect(() => {
    if (campaignModalOpen) {
      fetchReachPreview(selectedCommunicationType);
    }
  }, [campaignModalOpen, selectedCommunicationType, fetchReachPreview]);

  // Update default communication type when feature flag changes
  useEffect(() => {
    if (!callCampaignsEnabled) {
      setSelectedCommunicationType(CampaignCommunicationType.SMS);
    }
  }, [callCampaignsEnabled]);

  const handleCommunicationTypeChange = useCallback(
    (type: CampaignCommunicationType) => {
      setSelectedCommunicationType(type);
      if (campaignModalOpen) {
        fetchReachPreview(type);
      }
    },
    [campaignModalOpen, fetchReachPreview]
  );

  const handleCreateCampaign = useCallback(async () => {
    // Validation for auto mode
    if (uploadMode === 'auto') {
      // Prevent creating duplicate draft campaigns
      if (hasDraftCampaign) {
        toast.warning(
          'You already have a draft campaign for this job. Please manage the existing draft campaign.'
        );
        setCampaignModalOpen(false);
        return;
      }

      if (!canCreateCampaign) {
        toast.error('Cannot create campaign: No eligible candidates available.');
        setCampaignModalOpen(false);
        return;
      }
    }

    // Validation for manual mode
    if (uploadMode === 'manual') {
      if (bulkLeads.length === 0) {
        toast.error('Please upload at least one lead before creating the campaign.');
        return;
      }

      if (!leadsValid) {
        toast.error('Please fix validation errors before creating the campaign.');
        return;
      }
    }

    try {
      setCreatingCampaign(true);
      const campaignsApi = new CampaignsApi();

      const campaignDto: CreateJobReachoutCampaignDto = {
        jobId: job.id,
        name: `${uploadMode === 'manual' ? 'Manual Lead ' : ''}${
          selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Voice'
        } Campaign - ${job.title}`,
        description: `${uploadMode === 'manual' ? 'Manual lead upload: ' : ''}${
          selectedCommunicationType === CampaignCommunicationType.SMS ? 'Text messaging' : 'Calling'
        } ${uploadMode === 'manual' ? 'leads' : 'qualified candidates'} for ${job.title} position`,
        minScore: uploadMode === 'manual' ? undefined : 50, // Only set minScore for auto mode
        communicationType: selectedCommunicationType,
        filters: uploadMode === 'manual' ? undefined : {
          appliedOnly: false,
          excludeDirectApplicants: false, // Include direct applicants, but with date filtering
          directApplicantDaysLimit: 30, // Only include applicants who applied to this job within last 30 days
        },
      };

      const campaign = await campaignsApi.createJobReachoutCampaign(campaignDto);

      // If manual mode, upload bulk leads
      if (uploadMode === 'manual' && bulkLeads.length > 0) {
        try {
          await campaignsApi.addBulkLeads(campaign.id, bulkLeads);
          toast.success(
            `Campaign created with ${bulkLeads.length} lead${bulkLeads.length !== 1 ? 's' : ''}! Redirecting to campaign management...`
          );
        } catch (leadError) {
          // Campaign was created but leads failed to upload
          toast.warning(
            'Campaign created but some leads failed to upload. You can add them later from the campaign page.'
          );
          console.error('Failed to upload leads:', leadError);
        }
      } else {
        toast.success('Campaign created successfully! Redirecting to campaign management...');
      }

      // Navigate to the campaign page
      setTimeout(() => {
        router.push(`/dashboard/company/campaigns/${campaign.id}`);
      }, 1500);

      // Call the callback if provided
      if (onCampaignCreated) {
        onCampaignCreated();
      }
    } catch (error) {
      // Handle specific ConflictException for duplicate draft campaigns
      if (error.response?.status === 409) {
        toast.warning(
          'You already have a draft campaign for this job. Please manage the existing draft campaign instead.',
          { autoClose: 8000 }
        );
      } else {
        globalAjaxExceptionHandler(error, {
          toast: toast,
          t: t,
          defaultMessage: 'Failed to create campaign',
        });
      }
    } finally {
      setCreatingCampaign(false);
      setCampaignModalOpen(false);
    }
  }, [
    uploadMode,
    bulkLeads,
    leadsValid,
    hasDraftCampaign,
    canCreateCampaign,
    job.id,
    job.title,
    selectedCommunicationType,
    router,
    onCampaignCreated,
    t,
  ]);

  const openCampaignModal = useCallback(() => {
    setCampaignModalOpen(true);
  }, []);

  const closeCampaignModal = useCallback(() => {
    setCampaignModalOpen(false);
  }, []);

  const handleUploadModeChange = useCallback((mode: 'auto' | 'manual') => {
    setUploadMode(mode);
    // Reset bulk leads when switching modes
    if (mode === 'auto') {
      setBulkLeads([]);
      setLeadsValid(false);
    }
  }, []);

  const handleBulkLeadsChange = useCallback((leads: BulkLeadDto[], isValid: boolean) => {
    setBulkLeads(leads);
    setLeadsValid(isValid);
  }, []);

  return {
    // Modal state
    campaignModalOpen,
    openCampaignModal,
    closeCampaignModal,

    // Creation state
    creatingCampaign,
    handleCreateCampaign,

    // Communication type
    selectedCommunicationType,
    handleCommunicationTypeChange,
    callCampaignsEnabled,

    // Reach preview
    reachPreview,
    loadingReachPreview,

    // Validation state
    draftCampaigns,
    completedCampaigns,
    hasExistingCampaigns,
    hasDraftCampaign,
    canCreateCampaign,

    // Bulk lead upload state
    uploadMode,
    handleUploadModeChange,
    bulkLeads,
    handleBulkLeadsChange,
    leadsValid,
  };
};

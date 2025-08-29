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
  const callCampaignsEnabled = useFeatureFlag('CallCampaignsEnabled');

  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [selectedCommunicationType, setSelectedCommunicationType] =
    useState<CampaignCommunicationType>(
      callCampaignsEnabled ? CampaignCommunicationType.VOICE : CampaignCommunicationType.SMS
    );
  const [reachPreview, setReachPreview] = useState<CampaignReachPreviewResponse | null>(null);
  const [loadingReachPreview, setLoadingReachPreview] = useState(false);

  // Campaign validation logic
  const draftCampaigns = campaigns.filter((c) => c.status === CampaignStatus.DRAFT);
  const completedCampaigns = campaigns.filter(
    (c) => c.status === CampaignStatus.COMPLETED || c.status === CampaignStatus.CANCELLED
  );
  const hasExistingCampaigns = campaigns.length > 0;
  const hasDraftCampaign = draftCampaigns.length > 0;
  const canCreateCampaign = eligibilityStats?.eligibleApplicants > 0;

  const fetchReachPreview = useCallback(
    async (communicationType: CampaignCommunicationType) => {
      try {
        setLoadingReachPreview(true);
        const campaignsApi = new CampaignsApi();
        const preview = await campaignsApi.getCampaignReachPreview({
          jobId: job.id,
          communicationType,
          minScore: 50, // Match the minScore used in campaign creation
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

    try {
      setCreatingCampaign(true);
      const campaignsApi = new CampaignsApi();

      const campaignDto: CreateJobReachoutCampaignDto = {
        jobId: job.id,
        name: `${
          selectedCommunicationType === CampaignCommunicationType.SMS ? 'SMS' : 'Voice'
        } Campaign - ${job.title}`,
        description: `${
          selectedCommunicationType === CampaignCommunicationType.SMS ? 'Text messaging' : 'Calling'
        } qualified candidates for ${job.title} position`,
        minScore: 50, // Minimum eligibility score
        communicationType: selectedCommunicationType,
        filters: {
          appliedOnly: false, // Exclude those who already applied to this job
          excludeDirectApplicants: true, // Only get candidates who applied to company but not this specific job
        },
      };

      const campaign = await campaignsApi.createJobReachoutCampaign(campaignDto);

      toast.success('Campaign created successfully! Redirecting to campaign management...');

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
  };
};

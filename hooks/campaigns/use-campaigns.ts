import { useState, useEffect, useCallback } from 'react';
import CampaignsApi, {
  CampaignListResponse,
  CampaignStatsResponse,
} from '../../pages/api/campaigns';
import { CampaignEntity } from '../../models/campaigns/campaign.entity';
import { CampaignTargetEntity } from '../../models/campaigns/campaign-target.entity';
import { CampaignQueryDto } from '../../models/campaigns/campaign-query.dto';
import { UpdateCampaignDto } from '../../models/campaigns/update-campaign.dto';

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<CampaignEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const campaignsApi = new CampaignsApi();

  const loadCampaigns = useCallback(async (query?: CampaignQueryDto) => {
    try {
      setLoading(true);
      setError(null);

      const response: CampaignListResponse = await campaignsApi.findAll(query);
      setCampaigns(response.campaigns || []);
      setTotal(response.total || 0);

      return response;
    } catch (err) {
      console.error('Error loading campaigns:', err);
      setError('Failed to load campaigns');
      // Ensure campaigns remains an array even on error
      setCampaigns([]);
      setTotal(0);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCampaign = useCallback(async (id: number, dto: UpdateCampaignDto) => {
    try {
      const updatedCampaign = await campaignsApi.update(id, dto);

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? updatedCampaign : campaign))
      );

      return updatedCampaign;
    } catch (err) {
      console.error('Error updating campaign:', err);
      throw err;
    }
  }, []);

  const cancelCampaign = useCallback(async (id: number) => {
    try {
      const cancelledCampaign = await campaignsApi.cancel(id);

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? cancelledCampaign : campaign))
      );

      return cancelledCampaign;
    } catch (err) {
      console.error('Error cancelling campaign:', err);
      throw err;
    }
  }, []);

  const startCampaign = useCallback(async (id: number) => {
    try {
      const startedCampaign = await campaignsApi.start(id);

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? startedCampaign : campaign))
      );

      return startedCampaign;
    } catch (err) {
      console.error('Error starting campaign:', err);
      throw err;
    }
  }, []);

  const regenerateTargets = useCallback(async (id: number) => {
    try {
      // Call regenerate targets API (returns { campaignId, targetCount, message })
      await campaignsApi.regenerateTargets(id);

      // Reload the updated campaign data
      const updatedCampaign = await campaignsApi.findById(id);

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? updatedCampaign : campaign))
      );

      return updatedCampaign;
    } catch (err) {
      console.error('Error regenerating campaign targets:', err);
      throw err;
    }
  }, []);

  return {
    campaigns,
    loading,
    error,
    total,
    loadCampaigns,
    updateCampaign,
    cancelCampaign,
    startCampaign,
    regenerateTargets,
  };
};

export const useCampaign = (id: number) => {
  const [campaign, setCampaign] = useState<CampaignEntity | null>(null);
  const [targets, setTargets] = useState<CampaignTargetEntity[]>([]);
  const [stats, setStats] = useState<CampaignStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const campaignsApi = new CampaignsApi();

  const loadCampaign = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Load campaign details and stats in parallel
      // Campaign details now include targets
      const [campaignData, statsData] = await Promise.all([
        campaignsApi.findById(id),
        campaignsApi.getStats(id),
      ]);

      setCampaign(campaignData);
      setStats(statsData);
      // Extract targets from campaign data
      setTargets(campaignData.targets || []);

      return { campaign: campaignData, stats: statsData, targets: campaignData.targets || [] };
    } catch (err) {
      console.error('Error loading campaign:', err);
      setError('Failed to load campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateCampaign = useCallback(
    async (dto: UpdateCampaignDto) => {
      if (!id) return;

      try {
        const updatedCampaign = await campaignsApi.update(id, dto);
        setCampaign(updatedCampaign);
        return updatedCampaign;
      } catch (err) {
        console.error('Error updating campaign:', err);
        throw err;
      }
    },
    [id]
  );

  const cancelCampaign = useCallback(async () => {
    if (!id) return;

    try {
      const cancelledCampaign = await campaignsApi.cancel(id);
      setCampaign(cancelledCampaign);
      return cancelledCampaign;
    } catch (err) {
      console.error('Error cancelling campaign:', err);
      throw err;
    }
  }, [id]);

  const startCampaign = useCallback(async () => {
    if (!id) return;

    try {
      const startedCampaign = await campaignsApi.start(id);
      setCampaign(startedCampaign);
      return startedCampaign;
    } catch (err) {
      console.error('Error starting campaign:', err);
      throw err;
    }
  }, [id]);

  const regenerateTargets = useCallback(async () => {
    if (!id) return;

    try {
      // Call regenerate targets API (returns { campaignId, targetCount, message })
      await campaignsApi.regenerateTargets(id);

      // Reload the complete campaign data after regeneration
      const [updatedCampaign, updatedStats] = await Promise.all([
        campaignsApi.findById(id),
        campaignsApi.getStats(id),
      ]);

      setCampaign(updatedCampaign);
      setTargets(updatedCampaign.targets || []);
      setStats(updatedStats);

      return updatedCampaign;
    } catch (err) {
      console.error('Error regenerating campaign targets:', err);
      throw err;
    }
  }, [id]);

  const deleteTarget = useCallback(
    async (targetId: number) => {
      if (!id) return;

      try {
        await campaignsApi.deleteTarget(id, targetId);

        // Remove the target from local state
        setTargets((prev) => prev.filter((target) => target.id !== targetId));

        // Reload stats to get updated counts
        const updatedStats = await campaignsApi.getStats(id);
        setStats(updatedStats);

        return true;
      } catch (err) {
        console.error('Error deleting campaign target:', err);
        throw err;
      }
    },
    [id]
  );

  useEffect(() => {
    loadCampaign();
  }, [loadCampaign]);

  return {
    campaign,
    targets,
    stats,
    loading,
    error,
    loadCampaign,
    updateCampaign,
    cancelCampaign,
    startCampaign,
    regenerateTargets,
    deleteTarget,
  };
};

export const useJobCampaigns = (jobId: number) => {
  const [campaigns, setCampaigns] = useState<CampaignEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const campaignsApi = new CampaignsApi();

  const loadJobCampaigns = useCallback(
    async (status?: string[]) => {
      if (!jobId) return [];

      try {
        setLoading(true);
        setError(null);

        const campaigns = await campaignsApi.findByJobId(jobId, status);
        setCampaigns(campaigns);

        return campaigns;
      } catch (err) {
        console.error('Error loading job campaigns:', err);
        setError('Failed to load job campaigns');
        setCampaigns([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [jobId]
  );

  return {
    campaigns,
    loading,
    error,
    loadJobCampaigns,
  };
};

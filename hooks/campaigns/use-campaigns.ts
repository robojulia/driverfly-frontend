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
      setCampaigns(response.data || []);
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

  const regenerateTargets = useCallback(async (id: number) => {
    try {
      const regeneratedCampaign = await campaignsApi.regenerateTargets(id);

      // Update the campaign in the local state
      setCampaigns((prev) =>
        prev.map((campaign) => (campaign.id === id ? regeneratedCampaign : campaign))
      );

      return regeneratedCampaign;
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

      // Load campaign details, stats, and targets in parallel
      const [campaignData, statsData, targetsData] = await Promise.all([
        campaignsApi.findById(id),
        campaignsApi.getStats(id),
        campaignsApi.getTargets(id, { page: 1, limit: 100 }),
      ]);

      setCampaign(campaignData);
      setStats(statsData);
      setTargets(targetsData.data);

      return { campaign: campaignData, stats: statsData, targets: targetsData.data };
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

  const regenerateTargets = useCallback(async () => {
    if (!id) return;

    try {
      const regeneratedCampaign = await campaignsApi.regenerateTargets(id);
      setCampaign(regeneratedCampaign);
      // Reload the full data to get updated stats and targets
      await loadCampaign();
      return regeneratedCampaign;
    } catch (err) {
      console.error('Error regenerating campaign targets:', err);
      throw err;
    }
  }, [id, loadCampaign]);

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
    regenerateTargets,
  };
};

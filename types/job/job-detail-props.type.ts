import { JobEntity } from '../../models/job/job.entity';

export type CampaignInfo = {
  campaignId?: string;
  source?: string;
  medium?: string;
};

export type JobDetailProps = {
  error?: any;
  job: JobEntity;
  quick_apply?: string;
  relatedJobs?: JobEntity[];
  campaignInfo?: CampaignInfo;
};

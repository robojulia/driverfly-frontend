import { JobEntity } from '../job/job.entity';
import { UserEntity } from '../user/user.entity';
export class SavedJobEntity {
  id: number;
  user?: UserEntity;
  job?: JobEntity;
  created_at?: Date;
}

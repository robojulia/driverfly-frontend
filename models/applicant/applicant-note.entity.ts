import { UserEntity } from '../user/user.entity';
import { ApplicantEntity } from './applicant.entity';

export interface ApplicantNoteEntity {
  id: number;
  applicant: ApplicantEntity;
  user?: UserEntity;
  text?: string;
  created_at?: string;
  last_updated_at?: string;
}

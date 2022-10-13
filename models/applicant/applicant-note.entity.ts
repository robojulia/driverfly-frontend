import { UserEntity } from '../user/user.entity';
import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";

export class ApplicantNoteEntity {
  id?: number;
  applicant?: ApplicantEntity;
  user?: UserEntity;
  text?: string;
  created_at?: string;
  last_updated_at?: string;

  static yupSchema() {
    return yup.object({
        text: yup.string().required().nullable()
    });
  }
}

import { UserEntity } from '../user/user.entity';
import { EmployeeEntity } from './employee.entity';
import * as yup from "yup";

export class EmployeeNoteEntity {
  id?: number;
  employee?: EmployeeEntity;
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

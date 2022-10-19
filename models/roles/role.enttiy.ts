import { Status } from '../../enums/status.enum';
import { CompanyEntity } from '../company/company.entity';
import * as yup from "yup"
  
export class RoleEntity {
    id?: number;
    company?: CompanyEntity;
    status?: Status;
    name?: string;
    permissions?: string[];
    created_at?: Date;
    last_updated_at?: Date;

    static yupConnectSchema() {
        return yup.object({
            id: yup.number().nullable().required()
        });
    }
}

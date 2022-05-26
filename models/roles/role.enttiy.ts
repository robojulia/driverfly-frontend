import { Status } from '../../enums/status.enum';
import { CompanyEntity } from '../company/company.entity';
  
export class RoleEntity {
    id?: number;
    company?: CompanyEntity;
    status?: Status;
    name?: string;
    permissions?: string[];
    created_at?: Date;
    last_updated_at?: Date;
}

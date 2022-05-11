import { DocumentEntity } from "../documents/document.entity";

export interface CompanyEntity {
  name: string;
  about: string;
  website?: string;
  photo?: DocumentEntity;
}

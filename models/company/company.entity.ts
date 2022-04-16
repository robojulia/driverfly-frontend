import { DocumentEntity } from "../documents/document.entity";

export interface CompanyEntity {
  name: string;
  about: string;
  photo?: DocumentEntity;
}

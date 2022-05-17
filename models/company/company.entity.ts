import { DocumentEntity } from "../documents/document.entity";
import * as yup from "yup";

export class CompanyEntity {
  name: string;
  about: string;
  website?: string;
  photo?: DocumentEntity;

  static yupSchema() {
    return yup.object({
      name: yup.string().required().nullable(),
      about: yup.string().nullable(),
      website: yup.string().url().nullable(),
      photo: yup.object({}).nullable(),
    });
  }
}

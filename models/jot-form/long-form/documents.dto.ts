import * as yup from "yup";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../applicant/applicant-extras.entity";
import { DocumentEntity } from "../../documents/document.entity";

export class DocumentsDto {
  document: DocumentEntity = new DocumentEntity();

  static yupSchema() {
    return yup.object({
      document: DocumentEntity.yupSchema(),
    });
  }
}

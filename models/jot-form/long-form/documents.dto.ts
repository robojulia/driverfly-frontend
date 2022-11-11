import * as yup from "yup";
import { DocumentEntity } from "../../documents/document.entity";

export class DocumentsDto {
  document: DocumentEntity = new DocumentEntity();

  static yupSchema() {
    return yup.object({
      document: DocumentEntity.yupSchema(),
    });
  }
}

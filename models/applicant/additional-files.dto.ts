import { DocumentEntity } from '../documents/document.entity';
import * as yup from 'yup';
import { ApplicantAdditionalFilesEnum } from '../../enums/applicants/applicant-additional-files.enum';

export class ApplicantAdditionalFilesDto {
  document?: DocumentEntity;

  static yupSchema() {
    return yup.object({
      document: DocumentEntity.yupSchema(ApplicantAdditionalFilesEnum),
    });
  }
}

import * as yup from "yup";
import { DocumentEntity } from "../documents/document.entity";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";

export class ApplicantMissingDocumentsDto {
	documents?: DocumentEntity[];
	mediaOptions?: boolean[] = [];

	static yupSchema() {
		return yup.object({
			documents: (
				yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
			).unique("type"),
			mediaOptions: yup.array().of(yup.boolean().default(false).optional().nullable()).optional().nullable()

		});

	}
}

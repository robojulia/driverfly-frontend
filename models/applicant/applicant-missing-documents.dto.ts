import * as yup from "yup";
import { DocumentEntity } from "../documents/document.entity";
import { ApplicantDocumentType } from "../../enums/applicants/applicant-document-type.enum";

export class ApplicantMissingDocumentsDto {
	documents?: DocumentEntity[];
	mediaOptions?: boolean[] = [];

	static yupSchema() {
		return yup.object({
			// documents: yup.array()
			// 	.of(DocumentEntity.yupSchema(ApplicantDocumentType))
			// 	.nullable()
			// 	.required()
			// 	// .unique("type")
			// 	.test('unique-types', 'Each document type must be unique', value => {
			// 		const types = value.map(doc => doc.type);
			// 		return new Set(types).size == types.length;
			// 	})
			// 	.min(1)
			// 	.test('has-at-least-one', 'At least one document is required', value => value.length >= 1)
			// ,

			documents: (
				yup.array(DocumentEntity.yupSchema(ApplicantDocumentType)) as any
			).unique("type"),
			mediaOptions: yup
				.array()
				.of(yup.boolean().default(false).optional().nullable())
				.optional()
				.nullable(),
		});
	}
}

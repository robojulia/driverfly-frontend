import * as yup from "yup";
import { DocumentVisibility } from "../../../enums/documents/document-visibility.enum";
import { DocumentEntity } from "../../documents/document.entity";

export class DocumentsDto {
	document: DocumentEntity;

	static yupSchema(enumType?: object) {
		return yup.object({
			document: yup.object({
				type: (enumType ? (yup.string() as any).enum(enumType) : yup.string()).optional().nullable(),
				visibility: (yup.string() as any).enum(DocumentVisibility).nullable(),
				name: yup.string().optional().nullable(),
				description: yup.string().nullable(),
				mime_type: yup.string().nullable(),
				file_base64: yup.string().optional().nullable(),
			}).optional().nullable()
		});
	}

	static key(entity: DocumentEntity) {
		return entity.type;
	}
}

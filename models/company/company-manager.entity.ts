import { DocumentEntity } from "../documents/document.entity";
import * as yup from "yup";
import { useTranslation } from "../../hooks/use-translation";
import { Status } from "../../enums/status.enum";
import { UserEntity } from "../user/user.entity";

export class CompanyManagerEntity {

	id?: number;
	name?: string;
	email?: string;
	phone?: string;

	static yupSchema() {
		const { t } = useTranslation()
		return yup.object({
			name: yup.string().required().nullable().max(255),
			email: yup.string().required().nullable().max(255),
			phone: yup.string().required().nullable().max(255),
		});
	}
}

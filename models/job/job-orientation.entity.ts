import * as yup from "yup";
import { BasicEntity } from "../BasicEntity.entity";
import { LocationEntity } from "../company/location.entity";

export class JobOrientationEntity {

	id?: number;
	jobId?: number;
	location?: LocationEntity;
	start_datetime?: string | Date;
	end_datetime?: string | Date;

	static yupSchema() {
		return yup.object({
			jobId: yup.number().nullable(),
            location: BasicEntity.yupSchema(),
			start_datetime: yup.date().required().nullable(),
			end_datetime: yup.date().required().nullable(),
		});
	}
}

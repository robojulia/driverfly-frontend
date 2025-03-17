import * as yup from "yup";
import { VehicleEntity } from '../company/vehicle.entity';
import { ApplicantEntity } from "./applicant.entity";


export class ApplicantVehicleEntity {
	constructor() { }
	id?: number;
	applicant?: ApplicantEntity;
	vehicle?: VehicleEntity;
	created_at?: Date;
	last_updated_at?: Date;


	static yupSchema() {
		return yup.object({
			vehicle: yup.object({
				id: yup.number().required()
			}).required().nullable(),
		});
	}

}

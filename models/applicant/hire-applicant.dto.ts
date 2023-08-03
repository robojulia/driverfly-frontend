import { JobEntity } from '../job/job.entity';
import { ApplicantStatus } from '../../enums/applicants/applicant-status.enum';
import { ApplicantEntity } from './applicant.entity';
import * as yup from "yup";
import "../../utils/yup";
import {
	ApplicantReasonCodeFired,
	ApplicantReasonCodeNotInterested,
	ApplicantReasonCodeNotQualified,
	ApplicantReasonCodeQuit
} from '../../enums/applicants/applicant-reason-codes.enum';
import { Status } from '../../enums/status.enum';
import { UserEntity } from '../user/user.entity';
import { ApplicantExperienceEntity } from './applicant-experience.entity';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';
import { VehicleTransmissionType } from '../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';

export class HireApplicantDto {
	applicantId?: number;
	jobId?: number;

	static yupSchema() {
		return yup.object({
			applicantId: yup.number().required().nullable(),
			jobId: yup.number().required().nullable()
		});
	}
}

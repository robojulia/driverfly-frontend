import { ApplicantEmployerEntity } from "./applicant-employer.entity";
import { ApplicantEntity } from "./applicant.entity";

export class SendBackgroundRequestDto {
    applicant: ApplicantEntity;
    employer: ApplicantEmployerEntity;
    delay: number;
}


import React from "react";

import { Col, Row } from "react-bootstrap";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { ApplicantAlreadyWorkedForm } from "./applicant-already-worked-form";
import { ApplicantBasicDetailsForm } from "./applicant-basic-details-form";
import { ApplicantEquipmentExperienceForm } from "./applicant-equipment-experience-form";
import { ApplicantJobsAppliedForm } from "./applicant-jobs-applied-form";
import { ApplicantSafetyBackgroundForm } from "./applicant-safety-background-form";
import { ApplicantUploadedDocumentsForm } from "./applicant-uploaded-documents-form";
import { ApplicantWorkHistoryForm } from "./applicant-work-history-form";
import { BaseFormProps } from "./base-form-props";
import { HireApplicantForm } from "./hire-applicant-form";

export interface EditApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function EditApplicantForm(props: EditApplicantFormProps) {
	return (
		<React.Fragment>
			<HireApplicantForm props={props} />
			<ApplicantBasicDetailsForm props={props} />
			<ApplicantEquipmentExperienceForm props={props} />
			<Row>
				<Col md="6" >
					<ApplicantWorkHistoryForm props={props} />
				</Col>
				<Col md="6">
					<ApplicantAlreadyWorkedForm props={props} />
				</Col>
			</Row>
			<ApplicantSafetyBackgroundForm props={props} />
			<ApplicantUploadedDocumentsForm props={props} />
			<ApplicantJobsAppliedForm props={props} />
		</React.Fragment>
	);
}

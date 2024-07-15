
import React from "react";

import { Col, Row } from "react-bootstrap";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { ApplicantAlreadyWorkedForm } from "./applicant-already-worked-form";
import { ApplicantBasicDetailsForm } from "./applicant-basic-details-form";
import { ApplicantEquipmentExperienceForm } from "./applicant-equipment-experience-form";
import { ApplicantEquipmentOwnForm } from "./applicant-equipment-own-form";
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
			<HireApplicantForm entity={props?.entity} className={props?.className} />
			<ApplicantBasicDetailsForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
			<Row>
				<Col md="6" >
					<ApplicantEquipmentExperienceForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
				</Col>
				<Col md="6">
					<ApplicantEquipmentOwnForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
				</Col>
			</Row>
			<Row>
				<Col md="6" >
					<ApplicantWorkHistoryForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
				</Col>
				<Col md="6">
					<ApplicantAlreadyWorkedForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
				</Col>
			</Row>
			<ApplicantSafetyBackgroundForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
			<ApplicantUploadedDocumentsForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} />
			<ApplicantJobsAppliedForm entity={props?.entity} className={props?.className} setApplicant={props?.setApplicant} onSaveComplete={props?.onSaveComplete} />
		</React.Fragment>
	);
}

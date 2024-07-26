
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

export interface EditApplicantFormProps extends BaseFormProps<ApplicantEntity> {
	isSubmitting: boolean;
	setIsSubmitting(value: boolean): void;
}

export function EditApplicantForm(props: EditApplicantFormProps) {
	return (
		<React.Fragment>
			<HireApplicantForm entity={props?.entity} className={props?.className} />
			<ApplicantBasicDetailsForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
			<Row>
				<Col md="6" >
					<ApplicantEquipmentExperienceForm isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} entity={props?.entity} className={props?.className} setEntity={props?.setEntity} />
				</Col>
				<Col md="6">
					<ApplicantEquipmentOwnForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
				</Col>
			</Row>
			<Row>
				<Col md="6" >
					<ApplicantWorkHistoryForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
				</Col>
				<Col md="6">
					<ApplicantAlreadyWorkedForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
				</Col>
			</Row>
			<ApplicantSafetyBackgroundForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
			<ApplicantUploadedDocumentsForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} />
			<ApplicantJobsAppliedForm entity={props?.entity} isSubmitting={props?.isSubmitting} setIsSubmitting={props?.setIsSubmitting} className={props?.className} setEntity={props?.setEntity} onSaveComplete={props?.onSaveComplete} />
		</React.Fragment>
	);
}

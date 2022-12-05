import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import BaseCheck from "../../base-check";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { EmploymentHistoryDto } from "../../../../models/jot-form/long-form/employment-history.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import StateSelect from "../../state-select";

export interface EmploymentHistoryProps extends PageProps { }

export function EmploymentHistory() {
	const {
		state: { applicant, applicantExtras },
		method: { updateApplicantExtras, stepNext, stepBack },
	} = useContext(jotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new EmploymentHistoryDto(),
		validationSchema: EmploymentHistoryDto.yupSchema(),
		onSubmit: (values) => {
			const { CURRENT_EMPLOYER } = values;
			updateApplicantExtras(CURRENT_EMPLOYER);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.CURRENT_EMPLOYER
		);
		form.setValues({
			...form.values,
			CURRENT_EMPLOYER: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.CURRENT_EMPLOYER),
			is_current_employed: !!apx?.value,
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("applicant", applicantExtras);

		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h4
					className={`${styles.heading__sty} ${styles.striped__border}`}
				>
					{t("EMPLOYMENT_HISTORY")}
				</h4>
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t("HONEST_ABOUT_PAST_EMP")}
				</p>
				<Row className={styles.align__text_left}>
					<BaseCheck
						className="mt-2 col float-left"
						required
						label="CURRENTLY_EMPLYED_QUESTION"
						name="is_current_employed"
						formik={form}
					/>
				</Row>
				{!!form.values?.is_current_employed ? (
					<>
						<Row>
							<h6
								className={`${styles.heading__sty} ${styles.align__text_left}`}
							>
								{t("CURRENT_EMPLOYER")}
							</h6>
							<p className={`${styles.paragraph} ${styles.align__text_left}`}>
								{t("NA")}
							</p>
						</Row>
						<Row className={styles.align__text_left}>
							<BaseInput
								className="col-md-6 my-3"
								name="CURRENT_EMPLOYER.value.current_company_name"
								label="CURRENT_COMPANY_NAME"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								name="CURRENT_EMPLOYER.value.current_company_position"
								label="CURRENT_COMPANY_POSITION"
								formik={form}
							/>
						</Row>

						<Row>
							<BaseInput
								className="col-md-6 my-lg-2 my-3"
								required
								type="date"
								name="CURRENT_EMPLOYER.value.start_date"
								label="START_DATE"
								formik={form}
							/>
							<BaseCheck
								className="mt-lg-5 my-3 col-md-6 float-left"
								required
								name="CURRENT_EMPLOYER.value.authorize"
								label="CONATACT_AUTHORITY"
								formik={form}
							/>
						</Row>

						<Row className={styles.align__text_left}>
							<BaseInput
								className="col-md-6 my-3"
								name="CURRENT_EMPLOYER.value.current_company_manager_name"
								label="MANAGER_OR_REPRESENTATIVE"
								formik={form}
							/>
							<BaseInputPhone
								className="col-md-6 my-3"
								name="CURRENT_EMPLOYER.value.current_company_phone_number"
								placeholder="phone"
								label="CURRENT_COMPANY_NUMBER"
								formik={form}
							/>
						</Row>

						<Row>
							<BaseInput
								className="col my-3"
								required
								name="CURRENT_EMPLOYER.value.current_company_email"
								label="CURRENT_COMPANY_EMAIL"
								placeholder="email"
								formik={form}
							/>
						</Row>
						<Row>
							<h6
								className={`${styles.align__text_left} ${styles.heading__sty}`}>
								{t("ADDRESS_CURRENT_COMPANY")}
							</h6>
						</Row>
						<Row>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="CURRENT_EMPLOYER.value.current_company_street_address_line_1"
								placeholder="ADDRESS_LINE_1"
								label="ADDRESS_LINE_1"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="CURRENT_EMPLOYER.value.current_company_street_address_line_2"
								placeholder="ADDRESS_LINE_2"
								label="ADDRESS_LINE_2"
								formik={form}
							/>
						</Row>
						<Row>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="CURRENT_EMPLOYER.value.current_company_zipcode"
								placeholder="zip_code"
								label="zip_code"
								formik={form}
							/>
							<BaseInput
								className="col-md-6 my-3"
								required
								name="CURRENT_EMPLOYER.value.city"
								label="City"
								formik={form}
							/>
							<StateSelect
								className="col my-3"
								required
								label="STATE"
								name="CURRENT_EMPLOYER.value.state"
								placeholder="STATE"
								formik={form}
							/>
						</Row>

						<Row>
							<BaseSelect
								className="col my-3"
								required
								labelPrefix="BooleanPreferenceType"
								enumType={BooleanPreferenceType}
								name="CURRENT_EMPLOYER.value.fmcsr"
								placeholder="CHOOSE"
								label="FMCR_QUESTION"
								formik={form}
							/>
						</Row>
						<Row>
							<BaseSelect
								className="col mt-4"
								required
								labelPrefix="BooleanPreferenceType"
								enumType={BooleanPreferenceType}
								name="CURRENT_EMPLOYER.value.fcr"
								placeholder="CHOOSE"
								label="JOB_DESIGNATED_CURRENT_COMPANY"
								formik={form}
							/>
						</Row>
					</>
				) : null}

				{/* )} */}
				<Row className="mt-5">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>
					<Col>
						<Button className="float-left" type="submit">
							{t("NEXT")}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

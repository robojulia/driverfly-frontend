import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import BaseCheck from "../../base-check";
import { BooleanPreferenceType } from "../../../../enums/users/boolean-preferences.enum";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import StateSelect from "../../state-select";
import { PastEmploymentHistoryExtraDto } from "../../../../models/jot-form/long-form/previous-emplyment-history/index.dto";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";

export function PastEmploymentHistory() {

	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PastEmploymentHistoryDto(),
		validationSchema: PastEmploymentHistoryDto.yupSchema(),
		onSubmit: (values) => {
			const { PAST_EMPLOYER } = values;
			updateApplicantExtras(PAST_EMPLOYER);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.PAST_EMPLOYER
		);
		form.setValues({
			...form.values,
			PAST_EMPLOYER: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.PAST_EMPLOYER),
			is_previous_employed: !!apx?.value,
		});
	}, [applicantExtras, applicant]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h4
					className={`${styles.heading__sty} ${styles.striped__border}`}
				>
					{t("PAST_EMPLOYMENT_HISTORY")}
				</h4>
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t("HONEST_ABOUT_PAST_EMPLOYMENT")}
				</p>
				<Row className={styles.align__text_left}>
					<BaseCheck
						className="mt-2 col-md-6 float-left"
						name="is_previous_employed"
						label="PREVIOUSLY_EMPLOYED"
						formik={form}
					/>
				</Row>
				{!!form?.values?.is_previous_employed && (
					<>
						<div className="mt-4 float-left d-flex justify-left pl-3">
							<Button
								size="sm"
								onClick={() =>
									form.setFieldValue("PAST_EMPLOYER.value", [
										...(form.values?.PAST_EMPLOYER?.value || []),
										new PastEmploymentHistoryExtraDto(),
									])
								}
							>
								<PlusCircle /> {t("TITLE_ADD_ACCIDENT_DETAILS")}
							</Button>
						</div>
						{form?.values?.PAST_EMPLOYER?.value?.length > 0 &&
							<>
								{form?.values?.PAST_EMPLOYER?.value?.map((entity, i) => {
									<Row key={i}>

									<div >

										<Row>
											<BaseCheck
												className="mt-3 col-md-6 float-left"
												required
												name={`PAST_EMPLOYER.value[${i}].authorize`}
												label="CONTACT_AUTHORIZATION"
												formik={form}
											/>
											<BaseInput
												className="col-md-6 my-3"
												name={`PAST_EMPLOYER.value[${i}].previous_company_manager_name`}
												label="PREVIOUS_MANAGER_NAME"
												formik={form}
											/>
										</Row>
										<Row>
											<BaseInputPhone
												className="col-md-6 my-3"
												name={`PAST_EMPLOYER.value[${i}].previous_company_phone_number`}
												placeholder="phone"
												label="PREVIOUS_COMPANY_PHONE_NUMBER"
												formik={form}
											/>
											<BaseInput
												className="col-md-6 my-3"
												required
												name={`PAST_EMPLOYER.value[${i}].previous_company_email`}
												label="PREVIOUS_COMPANY_EMAIL"
												placeholder="email"
												formik={form}
											/>
										</Row>
										<Row>
											<BaseInput
												className="col-md-6 my-3"
												required
												type="date"
												name={`PAST_EMPLOYER.value[${i}].start_date`}
												label="START_DATE"
												formik={form}
											/>
											<BaseInput
												className="col-md-6 my-3"
												required
												type="date"
												name={`PAST_EMPLOYER.value[${i}].end_date`}
												label="END_DATE"
												formik={form}
											/>
										</Row>
										<Row>
											<h6
												className={`${styles.align__text_left} ${styles.heading__sty}`}>
												{t("ADDRESS_PAST_COMPANY")}
											</h6>
										</Row>
										<Row>
											<BaseInput
												className="col-md-6 my-3"
												required
												name={`PAST_EMPLOYER.value[${i}].previous_company_street_address_line_1`}
												placeholder="ADDRESS_LINE_1"
												label="ADDRESS_LINE_1"
												formik={form}
											/>
											<BaseInput
												className="col-md-6 my-3"
												required
												name={`PAST_EMPLOYER.value[${i}].previous_company_street_address_line_2`}
												placeholder="ADDRESS_LINE_2"
												label="ADDRESS_LINE_2"
												formik={form}
											/>

											<BaseInput
												className="col-md-6 my-3"
												required
												name={`PAST_EMPLOYER.value[${i}].previous_company_zipcode`}
												placeholder="zip_code"
												label="zip_code"
												formik={form}
											/>

											<BaseInput
												className="col-md-6 my-3"
												required
												name={`PAST_EMPLOYER.value[${i}].city`}
												label="City"
												formik={form}
											/>

											<StateSelect
												className="col my-3"
												required
												label="STATE"
												name={`PAST_EMPLOYER.value[${i}].state`}
												placeholder="STATE"
												formik={form}
											/>
										</Row>
										<Row >
											<BaseSelect
												className="col-12 my-3"
												required
												labelPrefix="BooleanPreferenceType"
												enumType={BooleanPreferenceType}
												name={`PAST_EMPLOYER.value[${i}].fmcsr`}
												placeholder="CHOOSE"
												label="FMCR_QUESTION"
												formik={form}
											/>
											<BaseSelect
												className="col-12 my-3"
												required
												labelPrefix="BooleanPreferenceType"
												enumType={BooleanPreferenceType}
												name={`PAST_EMPLOYER.value[${i}].fcr`}
												placeholder="CHOOSE"
												label="JOB_DESIGNATED_CURRENT_COMPANY"
												formik={form}
											/>
										</Row>
										<Row className="mt-4 p-lg-0">
									
										</Row>
									</div>
									<a
												href="#"
												onClick={
													() =>
														form.setValues({
															...form.values,
															PAST_EMPLOYER: {
																...form.values?.PAST_EMPLOYER,
																value:
																	form.values?.PAST_EMPLOYER?.value?.filter(
																		(v, idx) => i != idx
																	),
															},
														})
												}
											>
												<DashCircle className="mt-3" color="red" />
										</a>
									</Row>
								})}
							</>
							
						}
					</>
				)}
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

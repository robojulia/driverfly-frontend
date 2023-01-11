import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseCheck from "../../base-check";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import StateSelect from "../../state-select";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { PastEmploymentPageDto } from "../../../../models/jot-form/long-form/past-employment-page.dto";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history/index.dto";
import { ApplicantEmployerEntity } from "../../../../models/applicant";

export function PastEmploymentHistory() {

	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PastEmploymentPageDto(),
		validationSchema: PastEmploymentPageDto.yupSchema(),
		onSubmit: (values) => {
			const { employers } = values;

			const employer: ApplicantEmployerEntity = applicant.employers?.find(v => !!v.is_current)

			if (employer) employers.push(employer)

			setApplicant({
				...applicant,
				employers
			});

			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const employers: PastEmploymentHistoryDto[] = applicant.employers?.filter(v => !!!v.is_current) as PastEmploymentHistoryDto[]

		form.setValues({
			...form.values,
			employers: employers.length > 0 ? employers : [{
				...(new PastEmploymentHistoryDto()),
				is_current: false
			}],
			is_previous_employed: !!employers?.length,
		});
	}, [applicant]);

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
						className="mt-2 col-md-8 float-left"
						name="is_previous_employed"
						label="PREVIOUSLY_EMPLOYED"
						formik={form}
					/>
				</Row>

				{(!!form?.values?.is_previous_employed && form?.values?.employers?.length > 0) &&
					<>
						{form?.values?.employers?.map((entity, i) => (
							<Row key={i} className="single-past-employer-items my-3">
								<div className="py-3">
									<Row>
										<BaseCheck
											className="mt-3 col-md-12 float-left"
											required
											name={`employers[${i}].can_contact`}
											label="CONTACT_AUTHORIZATION"
											formik={form}
										/>
									</Row>
									<Row className={styles.bold}>
										<BaseInput
											className="col-md-6 my-3"
											name={`employers[${i}].name`}
											label="PREVIOUS_COMPANY_NAME"
											required
											formik={form}
										/>
										<BaseInput
											className="col-md-6 my-3"
											name={`employers[${i}].manager_name`}
											label="PREVIOUS_MANAGER_NAME"
											required
											formik={form}
										/>
									</Row>
									<Row className={styles.bold}>
										<BaseInputPhone
											className="col-md-6 my-3"
											name={`employers[${i}].phone`}
											placeholder="phone"
											label="PREVIOUS_COMPANY_PHONE_NUMBER"
											formik={form}
										/>
										<BaseInput
											className="col-md-6 my-3"
											required
											name={`employers[${i}].email`}
											label="PREVIOUS_COMPANY_EMAIL"
											placeholder="email"
											formik={form}
										/>
									</Row>
									<Row className={styles.bold}>
										<BaseInput
											className="col-md-6 my-3"
											required
											type="date"
											name={`employers[${i}].start_at`}
											label="START_DATE"
											formik={form}
										/>
										<BaseInput
											className="col-md-6 my-3"
											required
											type="date"
											name={`employers[${i}].end_at`}
											label="END_DATE"
											formik={form}
										/>
									</Row>
									<Row className={styles.bold}>
										<p
											className={`${styles.align__text_left} `} style={{ fontSize: '20px', color: '#000', margin: '15px 0px', fontWeight: '600' }}>
											{t("ADDRESS_PAST_COMPANY")}
										</p>
									</Row>
									<Row className={styles.bold}>
										<BaseInput
											className="col-md-6 my-3"
											required
											name={`employers[${i}].address`}
											placeholder="ADDRESS_LINE_1"
											label="ADDRESS_LINE_1"
											formik={form}
										/>
										<BaseInput
											className="col-md-6 my-3"
											name={`employers[${i}].address_2`}
											placeholder="ADDRESS_LINE_2"
											label="ADDRESS_LINE_2"
											formik={form}
										/>

										<BaseInput
											className="col-md-6 my-3"
											required
											name={`employers[${i}].zip_code`}
											placeholder="zip_code"
											label="zip_code"
											formik={form}
										/>

										<BaseInput
											className="col-md-6 my-3"
											required
											name={`employers[${i}].city`}
											label="City"
											formik={form}
										/>

										<StateSelect
											className="col my-3"
											required
											label="STATE"
											name={`employers[${i}].state`}
											placeholder="STATE"
											formik={form}
										/>
									</Row>
									<Row >
										<BaseCheck
											className="mt-2 col-md-6 float-left"
											name={`employers[${i}].is_subject_to_fmcsrs`}
											label="FMCR_QUESTION"
											formik={form}
										/>
										<BaseCheck
											className="mt-2 col-md-6 float-left"
											name={`employers[${i}].is_subject_to_drug_tests`}
											label="JOB_DESIGNATED_CURRENT_COMPANY"
											formik={form}
										/>
									</Row>
								</div>
								<Button
									className="rounded-lg"
									variant="outline-danger close_btn w-25 mx-auto my-2"
									onClick={() =>
										form.setValues({
											...form.values,
											employers: form.values?.employers?.filter((v, idx) => i != idx),
										})
									}
								>
									<DashCircle />
								</Button>
								<div className='Row' style={{ height: '3px', borderBottom: 'solid 2px #8d8c8c', marginTop: '0px' }}></div >
							</Row>
						))}
					</>
				}
				<Row>
					{!!form?.values?.is_previous_employed && (
						<>
							<Col className="p-0 mt-2">
								<Button
									className="w-100 py-2"
									size="sm"
									onClick={() =>
										form.setFieldValue("employers", [
											...(form.values?.employers || []),
											{
												...(new PastEmploymentHistoryDto()),
												is_current: false
											},
										])
									}
								>
									<PlusCircle /> {t("ADD_PAST_EMPLOYMENT_HISTORY")}
								</Button>
							</Col>
						</>
					)}
				</Row>



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
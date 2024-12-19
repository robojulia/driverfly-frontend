import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import JotformContext, {
	JotFormContextType,
} from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEmployerEntity } from "../../../../models/applicant";
import { PastEmploymentHistoryDto } from "../../../../models/jot-form/long-form/past-employment-history/index.dto";
import { PastEmploymentPageDto } from "../../../../models/jot-form/long-form/past-employment-page.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import StateSelect from "../../state-select";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

export function PastEmploymentHistory() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	function updateApplicat({
		employers: past_employers,
		is_previous_employed,
	}: PastEmploymentPageDto) {
		const all_employers: ApplicantEmployerEntity[] = is_previous_employed
			? past_employers
			: [];
		const current_employer: ApplicantEmployerEntity =
			applicant?.employers?.find((v) => !!v.is_current);
		if (current_employer) all_employers.push(current_employer);

		setApplicant({
			...applicant,
			employers: all_employers,
		});
	}

	const form = useFormik({
		initialValues: new PastEmploymentPageDto(),
		validationSchema: PastEmploymentPageDto.yupSchema(),
		onSubmit: (values: PastEmploymentPageDto) => {
			updateApplicat(values);
			stepNext();
		},
		onReset: (values: PastEmploymentPageDto) => {
			updateApplicat(values);
			stepBack();
		},
	});

	useEffect(() => {
		const employers: PastEmploymentHistoryDto[] = applicant.employers?.filter(
			(v) => !!!v.is_current
		) as PastEmploymentHistoryDto[];

		form.setValues({
			...form.values,
			employers: employers?.length > 0 ? employers : [],
			is_previous_employed: !!employers?.length,
		});
	}, [applicant]);

	useEffect(() => {
		console.log("form.values", {
			employerslength: form?.values?.employers?.length,
			values: form.values,
		});
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			{/* <h4
				className={`${styles.heading__sty} mt-0 mb-0 pb-0 fs-5 text-start`}
				style={{ color: "gray" }}
			>
				{t(
					"ADD_EMPLOYMENT_HISTORY_NUMBER_{number}",
					{ number: applicant?.years_cdl_experience > 3 ? 10 : 3 },
					{ translateProps: true }
				)}
			</h4> */}
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("PAST_EMPLOYMENT_HISTORY")}</h1>

			<p className={`${styles.paragraph} ${styles.align__text_left}`}>
				{t("HONEST_ABOUT_PAST_EMPLOYMENT")}
			</p>
			<h5
				className={`${styles.heading__sty} pt-0 mt-2 fs-6 text-start`}
				style={{ color: "gray" }}
			>
				{t("ADD_EMPLOYMENT_HISTORY_SUB_HEADING")}{" "}
				{t("EMPLOYMENT_HISTORY_DATE_NOTE")}
			</h5>
			<Row className={styles.align__text_left}>
				<BaseRadio
					name={`is_previous_employed`}
					className="float-left ml-2 my-2 w-40"
					label={`PREVIOUSLY_EMPLOYED`}
					labelPrefix="BooleanType"
					enumType={BooleanType}
					value={
						form.values.is_previous_employed === true
							? BooleanType.YES
							: (form.values.is_previous_employed === false && BooleanType.NO)
					}
					onChange={({ target: { value } }) => {
						form.setFieldValue(
							"is_previous_employed",
							value === BooleanType.YES ? true : (value === BooleanType.NO && false)
						);
					}}
				/>
			</Row>
			{!!form?.values?.is_previous_employed &&
				form?.values?.employers?.length > 0 && (
					<>
						{form?.values?.employers?.map((entity, i) => (
							<div key={i} className="single-past-employer-items my-3 px-2">
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
											name={`employers[${i}].title`}
											label="PREVIOUS_COMPANY_TITLE"
											required
											formik={form}
										/>
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
											max={new Date().toISOString().split("T")[0]}
											name={`employers[${i}].start_at`}
											label="START_DATE"
											formik={form}
										/>
										<BaseInput
											className="col-md-6 my-3"
											required
											type="date"
											max={new Date().toISOString().split("T")[0]}
											name={`employers[${i}].end_at`}
											label="END_DATE"
											formik={form}
										/>
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
											type="number"
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
									<Row>
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
									variant="outline-danger close_btn w-25 mx-auto d-block my-2"
									onClick={() =>
										form.setValues({
											...form.values,
											employers: form.values?.employers?.filter(
												(v, idx) => i != idx
											),
										})
									}
								>
									<DashCircle />
								</Button>
								<div
									className="Row"
									style={{
										height: "3px",
										borderBottom: "solid 2px #8d8c8c",
										marginTop: "0px",
									}}
								></div>
							</div>
						))}
					</>
				)}

			{Boolean(form?.values?.is_previous_employed) &&
				form?.values?.employers?.length < 12 && (
					<Row>
						<Col className="mt-2">
							<Button
								className="w-100 py-2"
								size="sm"
								onClick={() =>
									form.setFieldValue("employers", [
										...(form.values?.employers || []),
										{
											...new PastEmploymentHistoryDto(),
											is_subject_to_fmcsrs: true,
											is_subject_to_drug_tests: true,
											is_current: false,
										},
									])
								}
							>
								<PlusCircle /> {t("ADD_PAST_EMPLOYMENT_HISTORY")}
							</Button>
						</Col>
					</Row>
				)}

			{!!form?.values?.is_previous_employed &&
				<Row>
					<BaseTextArea
						className="mt-3"
						label="EMPLOYMENT_GAP_DETAILS_LABEL"
						formik={form}
						name="employment_gap_details"
					/>
				</Row>
			}
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
	);
}

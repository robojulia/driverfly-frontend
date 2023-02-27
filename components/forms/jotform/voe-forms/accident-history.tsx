import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import VoeFormContext, { VoeFormContextType } from "../../../../context/voeform-context";
import { AccidentHistoryDto } from "../../../../models/jot-form/voe-form/accident-history.dto";
import styles from "../../../../styles/voe.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";

export function AccidentHistory() {
	const {
		state: { applicantVoe, applicant },
		method: { stepNext, stepBack, updateApplicantVoe },
	}: VoeFormContextType = useContext(VoeFormContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new AccidentHistoryDto(),
		validationSchema: AccidentHistoryDto.yupSchema(),
		onSubmit: (values) => {
			const {
				WAS_EMPLOYED_AS,
				DID_DRIVE_FOR_YOU,
				REGISTERED_ACCIDENTS_DETAILS,
				SAFETY_PERFORMANCE_HISTROY_REPORT,
				ACCIDENT_REPORTED_TO_GOVERNMENT,
				REASON_TO_LEAVE_EMPLOYMENT,
			} = values;
			updateApplicantVoe(WAS_EMPLOYED_AS);
			updateApplicantVoe(DID_DRIVE_FOR_YOU);
			updateApplicantVoe(REGISTERED_ACCIDENTS_DETAILS);
			updateApplicantVoe(SAFETY_PERFORMANCE_HISTROY_REPORT);
			updateApplicantVoe(ACCIDENT_REPORTED_TO_GOVERNMENT);
			updateApplicantVoe(REASON_TO_LEAVE_EMPLOYMENT);
			console.log("applicant voe ", applicantVoe);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});
	useEffect(() => {
		const apx = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.WAS_EMPLOYED_AS
		);
		const apx_did_drive = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU
		);
		const apx_safety_performance = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
		);
		const apx_accident_details = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
		);
		const apx_report_to_govt = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT
		);
		const apx_reason_to_leave = applicantVoe?.find(
			(v) => v.type === ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT
		);
		form.setValues({
			...form.values,
			WAS_EMPLOYED_AS: !!apx?.type
				? apx
				: new ApplicantVoeFormEntity(ApplicantVoeFormEnum.WAS_EMPLOYED_AS),
			DID_DRIVE_FOR_YOU: !!apx_did_drive?.type
				? apx_did_drive
				: new ApplicantVoeFormEntity(ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU),
			SAFETY_PERFORMANCE_HISTROY_REPORT: !!apx_safety_performance?.type
				? apx_safety_performance
				: new ApplicantVoeFormEntity(
					ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
				),
			REGISTERED_ACCIDENTS_DETAILS: !!apx_accident_details?.type
				? apx_accident_details
				: new ApplicantVoeFormEntity(
					ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
				),
			ACCIDENT_REPORTED_TO_GOVERNMENT: !!apx_report_to_govt?.type
				? apx_report_to_govt
				: new ApplicantVoeFormEntity(
					ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT
				),
			REASON_TO_LEAVE_EMPLOYMENT: !!apx_reason_to_leave?.type
				? apx_reason_to_leave
				: new ApplicantVoeFormEntity(
					ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT
				),
		});
	}, [applicantVoe]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form eror", form.errors);
	}, [form.values, form.errors]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<Row>
				<h4 className={styles.carrierName}>{t("ACCIDENT_HISTORY")}</h4>
			</Row>
			<Row>
				<div className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="col my-3 p-0"
						name="WAS_EMPLOYED_AS.value.position"
						label={t(
							"{applicantName}_WAS_EMPLOYED_AS",
							{
								applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
							},
							{ translateProps: true }
						)}
						placeholder="POSITION"
						formik={form}
					/>
				</div>
				<div className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="col my-3 p-0"
						name="WAS_EMPLOYED_AS.value.start_date"
						label="START_DATE"
						type="date"
						formik={form}
						placeholder="MM/YY"
					/>
				</div>
				<div className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="col my-3 p-0"
						name="WAS_EMPLOYED_AS.value.end_date"
						type="date"
						label="END_DATE"
						formik={form}
						placeholder="MM/YY"
					/>
				</div>
			</Row>

			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseCheck
					className="float-left col my-3"
					name="did_drive_check"
					label="VOE_DRIVER_QUES"
					formik={form}
				/>
			</Row>

			{form.values.did_drive_check ? (
				<Row
					className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
				>
					<BaseTextArea
						className="float-left my-2 col"
						name="DID_DRIVE_FOR_YOU.value"
						label="TYPE_OF_VEHICLE"
						formik={form}
					/>
				</Row>
			) : null}

			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseCheck
					className="float-left col my-2"
					name="SAFETY_PERFORMANCE_HISTROY_REPORT.value"
					label="SAFETY_PERFORMANCE_REPORT"
					formik={form}
				/>
			</Row>
			<>
				{
					Boolean(form?.values?.SAFETY_PERFORMANCE_HISTROY_REPORT?.value) && (
						<Row className={`${styles.align__text_left} ${styles.bold}`}>
							<BaseCheck
								className="float-left col my-2"
								name="REGISTERED_ACCIDENTS_DETAILS.value"
								label="ACCIDENT_REGISTER_DATA"
								formik={form}
							/>
						</Row>
					)
				}

				{/* <Row>
					{form.values.registered_accidents_check ? (
						<>
							<Row className="mt-3">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("VOE_ACCIDENT_NOTE")}
								</p>
							</Row>
							<div className="mt-4 float-left d-flex justify-left pl-3">
								<Button
									size="sm"
									onClick={() =>
										form.setFieldValue("REGISTERED_ACCIDENTS_DETAILS.value", [
											...(form.values?.REGISTERED_ACCIDENTS_DETAILS?.value ||
												[]),
											new RefisteredAccidentDetailsDto(),
										])
									}
								>
									<PlusCircle /> {t("TITLE_ADD_VIOLATION_DETAILS")}
								</Button>
							</div>
							{form.values.REGISTERED_ACCIDENTS_DETAILS?.value?.length > 0 && (
								<>
									{form.values.REGISTERED_ACCIDENTS_DETAILS.value.map(
										(entity, i) => (
											<Row
												className={`${styles.align__text_left} ${styles.bold}`}
											>
												<div>
													<BaseInput
														className="col-md-6 my-3"
														name={`REGISTERED_ACCIDENTS_DETAILS.value[${i}].date`}
														type="date"
														label="DATE"
														formik={form}
													/>
												</div>
												<div>
													<BaseInput
														className="col-md-6 my-3"
														name={`REGISTERED_ACCIDENTS_DETAILS.value[${i}].location`}
														label="LOCATION"
														formik={form}
													/>
												</div>
												<div>
													<BaseInput
														className="col-md-6 my-3 pl-0"
														name={`REGISTERED_ACCIDENTS_DETAILS.value[${i}].number_of_injuries`}
														label="NUMBER_OF_INJURIES"
														formik={form}
													/>
												</div>
												<div>
													<BaseInput
														className="col-12 mt-3 pl-0"
														name={`REGISTERED_ACCIDENTS_DETAILS.value[${i}].number_of_fatalities`}
														label="NUMBER_OF_FATALITIES"
														formik={form}
													/>
												</div>
												<div>
													<BaseInput
														className="col-13 mt-3 pl-0"
														name={`REGISTERED_ACCIDENTS_DETAILS.value[${i}].number_of_hazmat_spills`}
														label="NUMBER_OF_HAZMAT_SPILLS"
														formik={form}
													/>
												</div>
												<div className="mt-5">
													<a
														href="#"
														onClick={() =>
															form.setValues({
																...form.values,
																REGISTERED_ACCIDENTS_DETAILS: {
																	...form.values?.REGISTERED_ACCIDENTS_DETAILS,
																	value:
																		form.values?.REGISTERED_ACCIDENTS_DETAILS?.value?.filter(
																			(v, idx) => i != idx
																		),
																},
															})
														}
													>
														<DashCircle color="red" />
													</a>
												</div>
											</Row>
										)
									)}
								</>
							)}
						</>
					) : null}
				</Row> */}

				{
					Boolean(form?.values?.REGISTERED_ACCIDENTS_DETAILS?.value) && (
						<Row
							className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
						>
							<BaseTextArea
								className="float-left col my-3"
								name="ACCIDENT_REPORTED_TO_GOVERNMENT.value"
								label="OTHER_GOV_REPORTED_ACCIDENTS"
								formik={form}
							/>
						</Row>
					)
				}
			</>
			<Row className={`${styles.align__text_left} ${styles.bold}`}>
				<BaseSelect
					className="col my-3"
					required
					labelPrefix="ReasonsForLeavingEmployment"
					enumType={ReasonsForLeavingEmployment}
					name="REASON_TO_LEAVE_EMPLOYMENT.value"
					placeholder="CHOOSE"
					label="REASONS_FOR_LEAVING_EMPLOYMENT"
					formik={form}
				/>
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
	);
}

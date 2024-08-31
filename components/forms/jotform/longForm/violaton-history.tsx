import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantMovingViolationEntity } from "../../../../models/applicant/applicant-moving-violation.entity";
import { ViolationHistoryDto } from "../../../../models/jot-form/long-form/violation-history.dto";
import BaseInput from "../../base-input";
import BaseTextArea from "../../base-text-area";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function ViolationHistory() {
	const {
		state: { applicant },
		method: { stepBack, stepNext, setApplicant },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new ViolationHistoryDto(),
		validationSchema: ViolationHistoryDto.yupSchema(),
		onSubmit: (values) => {
			const { moving_violation_history, moving_violations_count, moving_violations_details } = values;
			try {
				setApplicant({
					...applicant,
					moving_violations_details,
					moving_violations_count,
					moving_violation_history
				});

			} catch (error) {
				console.log(error);
			}
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		form.setValues({
			...form.values,
			moving_violations_details: applicant?.moving_violations_details || null,
			moving_violations_count: applicant?.moving_violations_count || 0,
			moving_violation_history: applicant?.moving_violation_history
		});
	}, [applicant]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form error", form.errors);
	}, [form.values, form.errors]);
	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("VIOLATIONS_LAST_3_YEARS")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={`${styles.bold} p-3`}>
					<BaseInput
						min={0}
						type="number"
						className="col p-0"
						name="moving_violations_count"
						label="HOW_MANY_VIOALTION_3_YEARS"
						formik={form}
					/>
				</Row>
				{form.values.moving_violations_count > 0 && (
					<BaseTextArea
						label="VIOLATION_DETAILS"
						name="moving_violations_details"
						formik={form}
					/>
				)}
				{form.values.moving_violation_history?.length > 0 && (
					<>
						{form.values?.moving_violation_history?.map((entity, i) => (
							<Row key={i} className="single-past-employer-items my-3 ">
								<div className="col-md-12 mt-2">
									<Row className={styles.bold}>
										<BaseInput
											className="col-md-6 mt-3"
											name={`moving_violation_history[${i}].date_of_violation`}
											label="VIOLATION_DATE"
											type="date"
											formik={form}
											max={new Date().toISOString().split("T")[0]}
											required
										/>
										<BaseInput
											className="col-md-6 mt-3"
											name={`moving_violation_history[${i}].location`}
											label="location"
											formik={form}
											required
										/>

										<BaseInput
											className="col-md-6 mt-3"
											name={`moving_violation_history[${i}].charge`}
											label="CHARGE"
											formik={form}
											required
										/>
										<BaseInput
											className="col-md-6 mt-3"
											name={`moving_violation_history[${i}].penalty`}
											label="PENALTY"
											formik={form}
											required
										/>
										<Button
											className="rounded-lg md-6"
											variant="outline-danger close_btn w-25 mx-auto my-3"
											onClick={() =>
												form.setFieldValue('moving_violation_history',
													[...form.values?.moving_violation_history?.filter((itm, index) => {
														return index !== i
													})]
												)
												// form.setValues({
												// 	...form.values,
												// 	VIOLATION_DETAILS: {
												// 		...form.values?.VIOLATION_DETAILS,
												// 		value:
												// 			form.values?.VIOLATION_DETAILS?.value?.filter(
												// 				(v, idx) => i != idx
												// 			),
												// 	},
												// })
											}
										>
											<DashCircle />
										</Button>
										<div className='Row' style={{ height: '3px', borderBottom: 'solid 2px #8d8c8c', marginTop: '0px' }}></div >
									</Row>
								</div>
							</Row>
						))}
					</>
				)}

				{(
					Boolean(form?.values?.moving_violations_count > 0)
					&& Boolean(form?.values?.moving_violations_count > (form?.values?.moving_violation_history ?? []).length)
				) && (
						<Row>
							<div className="mt-4 float-left d-flex justify-left px-3">
								<Button
									className="w-100 py-2"
									size="sm"
									onClick={() =>
										form.setFieldValue("moving_violation_history", [
											...(form.values?.moving_violation_history || []),
											{ ...new ApplicantMovingViolationEntity() },
										])
									}
								>
									<PlusCircle /> {t("TITLE_ADD_VIOLATION_DETAILS")}
								</Button>
							</div>
						</Row>
					)}
				<Row className="mt-4">
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
			</Form >
		</>
	);
}

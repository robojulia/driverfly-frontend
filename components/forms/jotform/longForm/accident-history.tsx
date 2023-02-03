import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { AccidentHistoryDto } from "../../../../models/jot-form/long-form/accident-history.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { AccidentHistoryEntity } from "../../../../models/jot-form/long-form/accident-last-5-years/index.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export function AccidentHistory() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new AccidentHistoryDto(),
		validationSchema: AccidentHistoryDto.yupSchema(),
		onSubmit: (values) => {
			try {
				console.log("valuesDTO", values);
				const { accident_count, ACCIDENT_DETAILS } = values;

				setApplicant({
					...applicant,
					accident_count,
				});

				updateApplicantExtras(ACCIDENT_DETAILS);

				stepNext();
			} catch (error) {
				console.log("error", error);
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.ACCIDENT_DETAILS
		);
		form.setValues({
			...form.values,
			ACCIDENT_DETAILS: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.ACCIDENT_DETAILS),
			accident_count: applicant.accident_count || null,
		});
	}, [applicant, applicantExtras]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h6 className={styles.heading__sty}>
				{t("MORE_ABOUT_ACCIDENTS")}
			</h6>
			<Row className={styles.bold}>
				<BaseInput
					min={0}
					className="col my-3"
					type="number"
					name="accident_count"
					label="accidents_last_5_years"
					placeholder="PLACEHOLDER_FOR_DIGITS"
					formik={form}
				/>
			</Row>

			{form.values.ACCIDENT_DETAILS?.value?.length > 0 && (
				<>
					{form.values.ACCIDENT_DETAILS.value.map((entity, i) => (
						<Row className="pl-0 single-past-employer-items my-3" key={i}>
							<div className="col-md-12 mt-2">
								<Row className={styles.bold}>
									<BaseInput
										className="col-md-6 my-3"
										name={`ACCIDENT_DETAILS.value[${i}].date_of_accident`}
										label="DATE"
										type="date"
										formik={form}
										required
										max={new Date().toISOString().split("T")[0]}

									/>
									<BaseInput
										className="col-md-6 my-3"
										name={`ACCIDENT_DETAILS.value[${i}].nature_of_accident`}
										label="LABEL_ACCIDENT_NATURE"
										formik={form}
										required
									/>
									<BaseInput
										className="col-md-6 my-3"
										name={`ACCIDENT_DETAILS.value[${i}].location_of_accident`}
										label="LABEL_ACCIDENT_LOCATION"
										formik={form}
										required
									/>
									<BaseInput
										className="col-md-6 my-3"
										name={`ACCIDENT_DETAILS.value[${i}].number_of_fatalaties`}
										label="LABEL_ACCIDENT_FATALITIES"
										formik={form}
										required
									/>
									<BaseInput
										className="col-md-6 mt-2"
										name={`ACCIDENT_DETAILS.value[${i}].number_of_injured`}
										label="LABEL_ACCIDENT_INJURED"
										formik={form}
										required
									/>
									<BaseCheck
										className="col-md-6 mt-5"
										name={`ACCIDENT_DETAILS.value[${i}].dot_recordable`}
										label="LABEL_ACCIDENT_DOT"
										formik={form}
									/>

									<BaseCheck
										className="col-md-12 mt-4"
										name={`ACCIDENT_DETAILS.value[${i}].at_fault`}
										label="LABEL_ACCIDENT_FAULT"
										formik={form}
									/>
									<Button
										className="rounded-lg"
										variant="outline-danger close_btn w-25 mx-auto my-2"
										onClick={
											() =>
												form.setValues({
													...form.values,
													ACCIDENT_DETAILS: {
														...form.values?.ACCIDENT_DETAILS,
														value:
															form.values?.ACCIDENT_DETAILS?.value?.filter(
																(v, idx) => i != idx
															),
													},
												})
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
				Boolean(form?.values?.accident_count > 0)
				&& Boolean(form?.values?.accident_count > form?.values?.ACCIDENT_DETAILS?.value?.length)
			) && (
					<Row>
						<div className="mt-4 float-left d-flex justify-left">
							<Button
								className="w-100 py-2"
								size="sm"
								onClick={() =>
									form.setFieldValue("ACCIDENT_DETAILS.value", [
										...(form.values?.ACCIDENT_DETAILS?.value || []),
										new AccidentHistoryEntity(),
									])
								}
							>
								<PlusCircle /> {t("TITLE_ADD_ACCIDENT_DETAILS")}
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
		</Form>
	);
}

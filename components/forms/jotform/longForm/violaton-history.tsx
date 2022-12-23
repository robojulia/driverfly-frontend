import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ViolationHistoryDto } from "../../../../models/jot-form/long-form/violation-history.dto";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import { VioalationExtrasEntity } from "../../../../models/jot-form/long-form/violaton-history/index.dto";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import styles from "../../../../styles/jotform.module.css";

export function ViolationHistory() {
	const {
		state: { applicant, applicantExtras },
		method: { updateApplicantExtras, stepBack, stepNext, setApplicant },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new ViolationHistoryDto(),
		validationSchema: ViolationHistoryDto.yupSchema(),
		onSubmit: (values) => {
			const { VIOLATION_DETAILS, moving_violations_count } = values;
			try {
				updateApplicantExtras(VIOLATION_DETAILS);
				setApplicant({
					...applicant,
					moving_violations_count
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
		console.log("extrasss", applicantExtras);

		const apx_detail = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.VIOLATION_DETAILS
		);
		const apx_count = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.VIOLATION_COUNT
		);
		form.setValues({
			...form.values,
			VIOLATION_COUNT: !!apx_count?.type
				? apx_count
				: new ApplicantExtrasEntity(ApplicantExtras.VIOLATION_COUNT),
			VIOLATION_DETAILS: !!apx_detail?.type
				? apx_detail
				: new ApplicantExtrasEntity(ApplicantExtras.VIOLATION_DETAILS),
			moving_violations_count: applicant?.moving_violations_count
		});
	}, [applicant, applicantExtras]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form error", form.errors);
	}, [form.values, form.errors]);
	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h6 className={styles.heading__sty}>
				{t("VIOLATIONS_LAST_3_YEARS")}
			</h6>
			<Row className="p-2">
				<BaseInput
					type="number"
					className="col my-3 p-0"
					name="moving_violations_count"
					label="HOW_MANY_VIOALTION_3_YEARS"
					formik={form}
				/>
				<div className="mt-4 float-left d-flex justify-left p-0">

					<Button
						size="sm"
						onClick={() =>
							form.setFieldValue("VIOLATION_DETAILS.value", [
								...(form.values?.VIOLATION_DETAILS?.value || []),
								new VioalationExtrasEntity(),
							])
						}
					>
						<PlusCircle /> {t("TITLE_ADD_VIOLATION_DETAILS")}
					</Button>
				</div>
			</Row>

			{form.values.VIOLATION_DETAILS?.value?.length > 0 && (
				<>
					{form.values.VIOLATION_DETAILS.value.map((entity, i) => (
						<Row key={i} className="single-past-employer-items my-5">
							<div className="col-md-12 mt-2">
								<Row>
									<BaseInput
										className="col-md-6 mt-3"
										name={`VIOLATION_DETAILS.value[${i}].date_of_violation`}
										label="VIOLATION_DATE"
										type="date"
										formik={form}
									/>
									<BaseInput
										className="col-md-6 mt-3"
										name={`VIOLATION_DETAILS.value[${i}].location`}
										label="location"
										formik={form}
									/>
									<BaseInput
										className="col-md-6 mt-3"
										name={`VIOLATION_DETAILS.value[${i}].charge`}
										label="CHARGE"
										formik={form}
									/>
									<BaseInput
										className="col mt-3"
										name={`VIOLATION_DETAILS.value[${i}].penalty`}
										label="PENALTY"
										formik={form}
									/>
									<Button
										className="rounded-0 mt-3"
										variant="outline-danger close_btn"
										onClick={() =>
											form.setValues({
												...form.values,
												VIOLATION_DETAILS: {
													...form.values?.VIOLATION_DETAILS,
													value:
														form.values?.VIOLATION_DETAILS?.value?.filter(
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

			<Row className="mt-3">
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

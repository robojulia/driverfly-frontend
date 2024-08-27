import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/digitalhiringapp.module.css";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { PastSuspensionDto } from "../../../../models/jot-form/long-form/past-suspension.dto";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import ViewCard from "../../../view-details/view-card";
import BaseInput from "../../base-input";

export function PastSuspension() {

	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PastSuspensionDto(),
		validationSchema: PastSuspensionDto.yupSchema(),
		onSubmit: (values) => {
			const { license_revoked, license_revoked_details, has_past_dui, dui_years } = values;
			setApplicant({
				...applicant,
				has_past_dui: has_past_dui,
				dui_years: dui_years,
				license_revoked: license_revoked,
				license_revoked_details: license_revoked_details,
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		form.setValues({
			...form.values,
			has_past_dui: applicant?.has_past_dui,
			dui_years: applicant?.dui_years,
			license_revoked: applicant?.license_revoked,
			license_revoked_details: applicant?.license_revoked_details,
		});
	}, [applicant]);

	useEffect(() => {
		console.log("values", form?.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("SUSSPENSIONS")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.paragraph__left}>
					<BaseCheck
						className="float-left col"
						required
						name="license_revoked"
						label="LICENSE_PREVILLAGES"
						formik={form}
					/>
				</Row>
				{form.values.license_revoked ? (
					<Row className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseTextArea
							className="mt-3"
							name="license_revoked_details"
							label="EXPLAIN_SUSPENSION"
							formik={form}
						/>
					</Row>
				) : null}
				<Row className={styles.paragraph__left}>
					<BaseCheck
						className="col-12 mt-2"
						label="HAS_DUIS_DHA"
						name="has_past_dui"
						formik={form}
					/>
					{form.values?.has_past_dui && (
						<Col xs="12" className="mt-2">
							<ViewCard
								title="PAST_DUIS"
								actions={
									<Button
										size="sm"
										onClick={() =>
											form.setValues({
												...form.values,
												dui_years: [...(form.values?.dui_years || []), ""],
											})
										}
									>
										<PlusCircle /> {t("ADD")}
									</Button>
								}
							>
								{form.values?.dui_years?.length > 0 && (
									<Table striped>
										<thead>
											<tr>
												<th colSpan={2}>{t("YEAR")}</th>
											</tr>
										</thead>
										<tbody>
											{form.values?.dui_years?.map((entity, i) => (
												<tr key={i}>
													<td className="w-100">
														<BaseInput
															name={`dui_years[${i}]`}
															placeholder="YEAR"
															type="int"
															required
															min={1900}
															max="9999"
															formik={form}
														/>
													</td>
													<td>
														<a
															href="#"
															onClick={() =>
																form.setValues({
																	...form.values,
																	dui_years: form.values?.dui_years?.filter(
																		(v, idx) => i != idx
																	),
																})
															}
														>
															<DashCircle color="red" />
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								)}
							</ViewCard>
						</Col>
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

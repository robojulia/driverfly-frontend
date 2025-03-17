import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { DashCircle, PlusCircle } from "react-bootstrap-icons";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { PastSuspensionDto } from "../../../../models/jot-form/long-form/past-suspension.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import ViewCard from "../../../view-details/view-card";
import BaseInput from "../../base-input";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

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
			has_past_dui: applicant?.has_past_dui || null,
			dui_years: applicant?.dui_years,
			license_revoked: applicant?.license_revoked || null,
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
					<BaseRadio
						name={`license_revoked`}
						className="float-left ml-2 my-2 w-40"
						label={`LICENSE_PREVILLAGES`}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						value={
							form.values.license_revoked === true
								? BooleanType.YES
								: (form.values.license_revoked === false && BooleanType.NO)
						}
						onChange={({ target: { value } }) => {
							form.setFieldValue(
								"license_revoked",
								value === BooleanType.YES ? true : (value === BooleanType.NO && false)
							);
						}}
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
					<BaseRadio
						name={`has_past_dui`}
						className="float-left ml-2 my-2 w-40"
						label={`HAS_DUIS_DHA`}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						value={
							form.values.has_past_dui === true
								? BooleanType.YES
								: (form.values.has_past_dui === false && BooleanType.NO)
						}
						onChange={({ target: { value } }) => {
							form.setFieldValue(
								"has_past_dui",
								value === BooleanType.YES ? true : (value === BooleanType.NO && false)
							);
						}}
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

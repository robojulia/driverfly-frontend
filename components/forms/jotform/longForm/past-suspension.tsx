import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/digitalhiringapp.module.css";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { PastSuspensionDto } from "../../../../models/jot-form/long-form/past-suspension.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import ViewCard from "../../../view-details/view-card";
import BaseInput from "../../base-input";

export function PastSuspension() {

	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new PastSuspensionDto(),
		validationSchema: PastSuspensionDto.yupSchema(),
		onSubmit: (values) => {
			const { PAST_LICENSE_SUSPENSION } = values;
			updateApplicantExtras(PAST_LICENSE_SUSPENSION);
			setApplicant({
				...applicant,
				has_past_dui: values?.has_past_dui,
				dui_years: values?.dui_years,
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.PAST_LICENSE_SUSPENSION
		);

		form.setValues({
			...form.values,
			has_past_dui: applicant?.has_past_dui,
			dui_years: applicant?.dui_years,
			PAST_LICENSE_SUSPENSION: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.PAST_LICENSE_SUSPENSION),
			is_past_license_suspended: !!apx?.value,
		});
	}, [applicantExtras, applicant]);

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
						name="is_past_license_suspended"
						label="LICENSE_PREVILLAGES"
						formik={form}
					/>
				</Row>
				{form.values.is_past_license_suspended ? (
					<Row className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseTextArea
							className="mt-3"
							name="PAST_LICENSE_SUSPENSION.value"
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
															min={new Date().getFullYear() - 5}
															max={new Date().getFullYear()}
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

import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { UnableForJobDto } from "../../../../models/jot-form/long-form/unable-for-job.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

export function UnableForJob() {

	const {
		state: { applicantExtras },
		method: { updateApplicantExtras, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new UnableForJobDto(),
		validationSchema: UnableForJobDto.yupSchema(),
		onSubmit: (values) => {
			const { REASON_FOR_UNABLE_TO_PERFORM_JOB } = values;
			updateApplicantExtras(REASON_FOR_UNABLE_TO_PERFORM_JOB);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type == ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
		);
		form.setValues({
			...form.values,
			REASON_FOR_UNABLE_TO_PERFORM_JOB: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(
					ApplicantExtras.REASON_FOR_UNABLE_TO_PERFORM_JOB
				),
			is_unable_to_perform: !!apx?.value,
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("DISABLE_FOR_JOB")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.paragraph__left}>
					<BaseRadio
						name={`is_unable_to_perform`}
						className="float-left ml-2 my-2 w-40"
						label={`REASON_UNABLE_TO_PERFORM`}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						value={
							form.values.is_unable_to_perform === true
								? BooleanType.YES
								: (form.values.is_unable_to_perform === false && BooleanType.NO)
						}
						onChange={({ target: { value } }) => {
							form.setFieldValue(
								"is_unable_to_perform",
								value === BooleanType.YES ? true : (value === BooleanType.NO && false)
							);
						}}
					/>
				</Row>
				{form.values.is_unable_to_perform ? (
					<Row className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseTextArea
							className="mt-3"
							name="REASON_FOR_UNABLE_TO_PERFORM_JOB.value"
							label="EXPLAIN_SUSPENSION"
							formik={form}
						/>
					</Row>
				) : null}

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

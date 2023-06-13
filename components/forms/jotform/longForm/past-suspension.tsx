import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/digitalhiringapp.module.css";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { PastSuspensionDto } from "../../../../models/jot-form/long-form/past-suspension.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

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
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.PAST_LICENSE_SUSPENSION
		);
		form.setValues({
			...form.values,
			PAST_LICENSE_SUSPENSION: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.PAST_LICENSE_SUSPENSION),
			is_past_license_suspended: !!apx?.value,
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
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

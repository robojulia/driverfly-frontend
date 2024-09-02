import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import VoeFormContext, {
	VoeFormContextType,
} from "../../../../context/voeform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantVoeEntity } from "../../../../models/applicant/applicant-voe.entity";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/voe.module.css";

export function EmployedByUs() {
	const {
		state: { voe, applicant },
		method: { stepNext, stepBack, updateVoe, jumpToStep },
	}: VoeFormContextType = useContext(VoeFormContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new ApplicantVoeEntity(),
		validationSchema: ApplicantVoeEntity.yupSchemaEmployedByUs(),
		validateOnMount: false,
		onSubmit: ({ was_employed }) => {
			updateVoe({ was_employed });
			if (Boolean(was_employed)) {
				stepNext();
			} else {
				updateVoe({
					was_employed: false,
					position: null,
					start_date: null,
					end_date: null,
					did_drive_check: false,
					drived_vehicle: null,
					safety_performance: false,
					registered_accidents_details: false,
					accidents_reported_to_government: null,
					reason_to_leave: null,
				})
				jumpToStep(3);
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const { was_employed = false } = voe;
		form.setValues({
			...form.values,
			was_employed,
		});
	}, [voe]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form eror", form.errors);
	}, [form.values, form.errors]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h1 className={styles.carrierName}>{t("EMPLOYMENT_VERIF")}</h1>

			<Row>
				<BaseCheck
					className="mt-3 mb-3"
					name="was_employed"
					label={t(
						"{applicantName}_EMPLOYED_BY_US",
						{
							applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
						},
						{ translateProps: true }
					)}
					formik={form}
				/>
			</Row>
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

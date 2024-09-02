import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { DrivingExperienceDto } from "../../../../models/jot-form/long-form/driving-experience.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInput from "../../base-input";
import StateSelect from "../../state-select";

export function DrivingExperience() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const current_date = new Date();

	const form = useFormik({
		initialValues: new DrivingExperienceDto(),
		validationSchema: DrivingExperienceDto.yupSchema(),
		onSubmit: (values) => {
			try {
				const { license_number, state, license_expiry, license_state } = values;

				setApplicant({
					...applicant,
					license_number,
					state,
					license_expiry,
					license_state,
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
		const { license_number, state, license_expiry, license_state } = applicant;

		form.setValues({
			license_number: license_number || null,
			state: state || null,
			license_expiry: license_expiry || null,
			license_state: license_state || null,
		});
	}, []);
	useEffect(() => {
		console.log("form valuess---", form.values);

	}, [form.values])
	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("DRVING_EXPERIENCE")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.bold}>
					<BaseInput
						className="col-md-6 my-3"
						required
						name="license_number"
						placeholder="CDL_LICENSE_PLACEHOLDER"
						label="CDL_NUMBER"
						formik={form}
					/>
					<StateSelect
						className="col-md-6 my-3"
						required
						label="CURRENT_STATE"
						name="state"
						placeholder="STATE"
						formik={form}
					/>
					<BaseInput
						className="col-md-6 my-3"
						required
						type="date"
						name="license_expiry"
						placeholder="expiration_date"
						label="expiration_date"
						formik={form}
						min={(new Date(current_date.getFullYear(), current_date.getMonth() + 6, current_date.getDate())).toISOString().split("T")[0]}
					/>
					<StateSelect
						className="col-md-6  my-3"
						required
						label="state_issued"
						name="license_state"
						placeholder="ISSUANCE_STATE"
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
		</>
	);
}

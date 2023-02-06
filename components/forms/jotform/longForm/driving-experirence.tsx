import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { DrivingExperienceDto } from "../../../../models/jot-form/long-form/driving-experience.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import StateSelect from "../../state-select";

export function DrivingExperience() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

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

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<h4 className={styles.heading__sty}> {t("DRVING_EXPERIENCE")}</h4>
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
					max={`9999-11-11`}
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
	);
}

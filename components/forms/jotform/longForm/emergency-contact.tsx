import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { EmergenyContactDto } from "../../../../models/jot-form/long-form/emergency-contact.dto";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function EmergencyContact() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new EmergenyContactDto(),
		validationSchema: EmergenyContactDto.yupSchema(),

		onSubmit: (values) => {
			try {
				const {
					emergency_contact_name,
					emergency_contact_number,
					emergency_contact_relationship,
				} = values;
				setApplicant({
					...applicant,
					emergency_contact_name,
					emergency_contact_number,
					emergency_contact_relationship,
				});

				stepNext();
			} catch (error) {
				console.log(error);
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const {
			emergency_contact_name,
			emergency_contact_number,
			emergency_contact_relationship,
		} = applicant;
		form.setValues({
			...form.values,
			emergency_contact_name: emergency_contact_name || null,
			emergency_contact_number: emergency_contact_number || null,
			emergency_contact_relationship: emergency_contact_relationship || null,
		});
	}, [applicant]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("EMERGENCY_CONTACT_DETAILS")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="col-md-6 my-3"
						name="emergency_contact_name"
						placeholder="emergency_contact"
						label="EMERGENCY_CONTACT_NAME"
						formik={form}
					/>
					<BaseInputPhone
						className="col-md-6 my-3"
						name="emergency_contact_number"
						placeholder="phone"
						label="phone"
						formik={form}
					/>
					<BaseInput
						className="col my-3"
						name="emergency_contact_relationship"
						placeholder="relationship"
						label="relationship"
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

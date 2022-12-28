import { useContext, useEffect } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { EmergenyContactDto } from "../../../../models/jot-form/long-form/emergency-contact.dto";

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
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h4 className={styles.heading__sty}>
					{t("EMERGENCY_CONTACT_DETAILS")}
				</h4>

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

import React, { useContext } from "react";
import styles from "../../../../styles/jotform.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface ContinueLongFormProps extends PageProps { }

export function ContinueLongForm() {

	const {
		state: { applicant, applicantExtras },
		method: { stepNext },
	} = useContext(jotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: {},
		onSubmit: () => {
			stepNext();
		},
	});

	return (
		<>
			<form onSubmit={form.handleSubmit}>
				<Row>
					<h4 className={styles.carrierName__smaller}>
						{t("THANKS_BY_NAUTILIUS_TRUCKING")}
					</h4>
				</Row>
				<Row className="mt-3">
					<h6 className={`${styles.paragraph} ${styles.margin__top}`}>
						{t("THANKS_NOTE_BY_NAUTILIUS_TRUCKING")}
					</h6>
				</Row>
				<Row className="mt-3">
					<Col>
						<Button className="float-middle" type="submit">
							{t("CONTINUE_APPLICATION")}
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}

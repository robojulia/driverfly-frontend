import React, { useContext, useEffect } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { toast, ToastContainer } from "react-toastify";


export function ContinueLongForm() {
	const {
		state: { applicant },
		method: { stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: {},
		onSubmit: () => {
			stepNext();
		}
	});
	useEffect(() => {
		toast.success(t("successfully_saved_information"));

	}, [])
	return (
		<>
			<ToastContainer />
			<form onSubmit={form.handleSubmit}>
				<Row>
					<h4 className={styles.heading__sty}>
						{t("{company_name}_THANKS", { company_name: applicant?.company?.name }, { translateProps: true })}
					</h4>
				</Row>
				<Row className="mt-3">
					<h6 className={`${styles.paragraph} ${styles.margin__top}`}>
						{t("{company_name}_THANKS_NOTE", { company_name: applicant?.company?.name }, { translateProps: true })}
					</h6>
				</Row>
				<Row className="mt-3">
					<Col className="text-center" >
						<Button type="submit">
							{t("CONTINUE_APPLICATION")}
						</Button>
					</Col>
				</Row>
			</form>
		</>
	);
}

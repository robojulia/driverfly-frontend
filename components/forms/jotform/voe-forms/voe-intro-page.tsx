import { useFormik } from "formik";
import { useContext } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import VoeFormContext, { VoeFormContextType } from "../../../../context/voeform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/voe.module.css";

export function IntroPage() {
	const {
		state: { applicant, employer },
		method: { stepNext },
	}: VoeFormContextType = useContext(VoeFormContext);
	const { t } = useTranslation();

	const form = useFormik({
		initialValues: {},
		onSubmit: (values) => {
			stepNext();
		},
	});

	return (
		<Form onSubmit={form.handleSubmit}>
			<h1 className={styles.carrierName}>{t("VERIFICATION_OF_EMPLOYMENT")}</h1>
			<h4
				className={`${styles.paragraph} ${styles.margin__top} p-1`}
			>{employer?.name}
			</h4>

			<Row className="mt-3">
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t(
						"VOE_PARAGRAPH_{applicantName}_{companyName}",
						{
							applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
							companyName: `${applicant?.company?.name}`,
						},
						{ translateProps: true }
					)}
				</p>
			</Row>
			<Row className="mt-3">
				<Col className="text-center">
					<Button type="submit">{t("NEXT")}</Button>
				</Col>
			</Row>
		</Form>
	);
}

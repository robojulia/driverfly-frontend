import { useFormik } from "formik";
import { useContext } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/jotform.module.css";

export function HalfWay() {

	const {
		state: { applicant },
		method: { stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: {},
		onSubmit: (values) => {
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	return (
		<>
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h1 className={styles.heading__sty}>{t("HARD_QUESTIONS")}</h1>
				<h3 className="text-center">{t("ANSWER_FOLLOWIN_QUESTIONS")}</h3>
				<p className={`${styles.paragraph} my-4`}>{t("EXCLUDE_CONSIDERATION")}</p>
				<Row className="mt-4">
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

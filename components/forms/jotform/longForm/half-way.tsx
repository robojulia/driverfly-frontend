import { useFormik } from "formik";
import { useContext } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function HalfWay() {
	const {
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
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("HALF_WAY_DONE")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<div className="d-flex justify-content-center mt-n4 w-100" style={{ height: '200px' }}>
					<img src='/img/gifs/simpsonRunning.gif' alt="simpsons" />
				</div>
				<h1 className={`${styles.heading__sty} mt-0 pt-0`}>{t("HARD_QUESTIONS")}</h1>
				<h3 className="text-center text-black">{t("ANSWER_FOLLOWIN_QUESTIONS")}</h3>
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

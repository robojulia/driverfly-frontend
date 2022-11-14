import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import jotformContext from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { PageProps } from "../../../../types/jotform/page-props.type";

export interface HalfWayProps extends PageProps { }

export function HalfWay() {

	const {
		state: { applicant },
		method: { stepNext, stepBack },
	} = useContext(jotformContext);
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
				<h1>{t("HARD_QUESTIONS")}</h1>
				{/* <img src={giphy} alt="my-gif" /> */}
				<h3>{t("ANSWER_FOLLOWIN_QUESTIONS")}</h3>
				<h4>{t("EXCLUDE_CONSIDERATION")}</h4>
				<Row className="mt-5">
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

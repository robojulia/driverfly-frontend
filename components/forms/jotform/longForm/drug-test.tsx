import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { DrugTestDto } from "../../../../models/jot-form/long-form/drug-test.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";

export function DrugTest() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DrugTestDto(),
		validationSchema: DrugTestDto.yupSchema(),
		onSubmit: (values) => {
			const { positive_drug_test_details, positive_drug_test } = values;
			setApplicant({
				...applicant,
				positive_drug_test: positive_drug_test,
				positive_drug_test_details: positive_drug_test_details
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {

		form.setValues({
			...form.values,
			positive_drug_test: applicant?.positive_drug_test,
			positive_drug_test_details: applicant?.positive_drug_test_details
		});
	}, [applicant]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("DRUG_TEST")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.paragraph__left}>
					<BaseCheck
						className="col"
						name="positive_drug_test"
						label="DRUG_TEST_TESTIMONY_QUESTION"
						formik={form}
					/>
				</Row>
				{form.values.positive_drug_test ? (
					<Row className={`${styles.align__text_left} ${styles.bold}`}>
						<BaseTextArea
							className="float-left mt-3"
							name="positive_drug_test_details"
							label="PLEASE_EXPLAIN"
							formik={form}
						/>
					</Row>
				) : null}

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

import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { useTranslation } from "../../../../hooks/use-translation";
import { FelonyConvictionDto } from "../../../../models/jot-form/long-form/felony-conviction.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseRadio from "../../base-radio";
import BaseTextArea from "../../base-text-area";

export function FelonyConviction() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack },
	}: JotFormContextType = useContext(JotformContext);

	const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean>();

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new FelonyConvictionDto(),
		validationSchema: FelonyConvictionDto.yupSchema(),
		onSubmit: (values) => {
			const { criminal_history } = values;
			setApplicant({
				...applicant,
				criminal_history,
			});
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const { criminal_history } = applicant;
		form.setValues({
			...form.values,
			criminal_history: criminal_history
		});
		setHasCriminalHistory(!!criminal_history)
	}, [applicant]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("FELONY_CONVICTION")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row className={styles.paragraph__left}>
					<BaseRadio
						name={`is_owner_operator`}
						className="float-left ml-2 my-2 w-40"
						label={`EVER_FELONY_QUESTION`}
						labelPrefix="BooleanType"
						enumType={BooleanType}
						value={
							!!hasCriminalHistory 
								? BooleanType.YES
								: (hasCriminalHistory === false && BooleanType.NO)
						}
						onChange={({ target: { value } }) => {
							setHasCriminalHistory(value === BooleanType.YES ? true : (value === BooleanType.NO && false));
							if (value !== BooleanType.YES) {
								form.setFieldValue("criminal_history", null);
							}
						}}
					/>
				</Row>

				{hasCriminalHistory &&
					<BaseTextArea
						className="col-12 mt-2"
						label="PAST_CONVICTION"
						name="criminal_history"
						formik={form}
					/>
				}

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

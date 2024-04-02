import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import jotformContext from "../../../../context/jotform-context";
import { useTranslation } from "../../../../hooks/use-translation";
import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";

export function WorkedBefore() {
	const {
		state: { applicant },
		method: { setApplicant, stepNext, stepBack, },
	} = useContext(jotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new WorkedBeforeDto(),
		validationSchema: WorkedBeforeDto.yupSchema(),

		onSubmit: (values) => {
			setApplicant({ ...applicant, ...values });
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		form.setValues({
			...form.values,
			already_applied_to_company: applicant.already_applied_to_company,
			already_worked_to_company: applicant.already_worked_to_company,
			already_worked_start_date: applicant.already_worked_start_date,
			already_worked_end_date: applicant.already_worked_end_date,
		});
	}, [applicant]);

	// useEffect(() => {
	// 	console.log("values", form.values);
	// 	console.log("error", form.errors);
	// }, [form.values, form.errors]);

	return (
		<>
			<h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("WORKED_BEFORE")}</h1>

			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<Row>
					<BaseCheck
						className="float-left col"
						required
						name="already_applied_to_company"
						label="APPLIED_HERE_BEFORE"
						formik={form}
					/>
				</Row>
				{form.values?.already_applied_to_company ? (
					<>
						<Row >
							<Col>
								<BaseCheck
									className="my-3 col float-left p-0"
									required
									name="already_worked_to_company"
									label="WORKED_HERE_BEFORE"
									formik={form}
								/>
							</Col>
						</Row>
						{form.values.already_worked_to_company ? (
							<>
								<Row>
									<BaseInput
										className="col-md-6 my-3 font-weight-bold"
										type="date"
										name="already_worked_start_date"
										placeholder="DATE"
										label="FROM"
										max={new Date((new Date().getFullYear()), new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
										formik={form}
									/>
									<BaseInput
										className="col-md-6 my-3 font-weight-bold"
										type="date"
										name="already_worked_end_date"
										placeholder="DATE"
										required
										label="TO"
										max={new Date((new Date().getFullYear()), new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
										formik={form}
									/>

								</Row>
							</>
						) : null}
					</>
				) : null}
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

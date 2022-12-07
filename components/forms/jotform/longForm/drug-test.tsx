import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseTextArea from "../../base-text-area";
import BaseCheck from "../../base-check";
import styles from "../../../../styles/jotform.module.css";
import { DrugTestDto } from "../../../../models/jot-form/long-form/drug-test.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export function DrugTest() {
	const {
		state: { applicantExtras },
		method: { updateApplicantExtras, stepNext, stepBack },
	} = useContext(jotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new DrugTestDto(),
		validationSchema: DrugTestDto.yupSchema(),
		onSubmit: (values) => {
			const { DOT_REGULATION } = values;
			updateApplicantExtras(DOT_REGULATION);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.DOT_REGULATION
		);
		form.setValues({
			...form.values,
			DOT_REGULATION: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.DOT_REGULATION),
			is_tested_positive: !!apx?.value,
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<Row className={styles.paragraph__left}>
				<BaseCheck
					className="col"
					name="is_tested_positive"
					label="DRUG_TEST_TESTIMONY_QUESTION"
					formik={form}
				/>
			</Row>
			{form.values.is_tested_positive ? (
				<Row className={styles.align__text_left}>
					<BaseTextArea
						className="float-left mt-3"
						name="DOT_REGULATION.value"
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
	);
}

import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import jotformContext from "../../../../context/jotform-context";
import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export function WorkedBefore() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack, },
	} = useContext(jotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new WorkedBeforeDto(),
		validationSchema: WorkedBeforeDto.yupSchema(),

		onSubmit: (values) => {
			const { ALREADY_APPLIED_TO_COMPANY, ALREADY_WORKED_TO_COMPANY } = values;
			updateApplicantExtras(ALREADY_APPLIED_TO_COMPANY);
			updateApplicantExtras(ALREADY_WORKED_TO_COMPANY);
			stepNext();
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
		);
		const apx_worked_before = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.ALREADY_WORKED_TO_COMPANY
		);
		form.setValues({
			...form.values,
			ALREADY_APPLIED_TO_COMPANY: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.ALREADY_APPLIED_TO_COMPANY),
			ALREADY_WORKED_TO_COMPANY: !!apx_worked_before?.type
				? apx_worked_before
				: new ApplicantExtrasEntity(ApplicantExtras.ALREADY_WORKED_TO_COMPANY),
			// apx_worked_before: !!apx_worked_before.value,
			is_worked_before: !!apx?.value,
		});
	}, [applicantExtras]);

	useEffect(() => {
		console.log("values", form.values);
		console.log("error", form.errors);
	}, [form.values, form.errors]);

	return (
		<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
			<Row>
				<BaseCheck
					className="float-left col"
					required
					name="ALREADY_APPLIED_TO_COMPANY.value"
					label="APPLIED_HERE_BEFORE"
					formik={form}
				/>
			</Row>
			{form.values?.ALREADY_APPLIED_TO_COMPANY?.value ? (
				<>
					<Row >
						<Col>
							<BaseCheck
								className="my-3 col float-left p-0"
								required
								name="is_worked_before"
								label="WORKED_HERE_BEFORE"
								formik={form}
							/>
						</Col>
					</Row>
					{form.values.is_worked_before ? (
						<>
							<Row>
								<BaseInput
									className="col-md-6 my-3"
									type="date"
									name="ALREADY_WORKED_TO_COMPANY.value.start_date"
									placeholder="DATE"
									label="FROM"
									formik={form}
								/>
								<BaseInput
									className="col-md-6 my-3"
									type="date"
									name="ALREADY_WORKED_TO_COMPANY.value.end_date"
									placeholder="DATE"
									label="TO"
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
	);
}

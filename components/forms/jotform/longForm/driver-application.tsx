import { useContext, useEffect, useRef, useState } from "react";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import SignatureCanvas from "react-signature-canvas";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export function DriverApplication() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	let padRef = useRef<SignatureCanvas>(null);

	const clearSignatureCanvas = (): void => {
		padRef?.current?.clear();
		form.setFieldValue("SIGNATURE.value", null);
	}

	const form = useFormik({
		initialValues: new DriverApplicationDto(),
		validationSchema: DriverApplicationDto.yupSchema(),
		onSubmit: (values) => {
			try {
				const { first_name, last_name, APPLY_DATE, SIGNATURE } = values;
				setApplicant({ ...applicant, first_name, last_name });
				updateApplicantExtras(APPLY_DATE);
				updateApplicantExtras(SIGNATURE);
				stepNext();
			} catch (error) {
				console.log(error);
			}
		},
	});

	const handleSignatureEnd = () => {
		const signatureValue = padRef?.current?.toDataURL()?.toString();
		form.setFieldValue("SIGNATURE.value", signatureValue);
	};

	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);

	useEffect(() => {
		const { first_name, last_name } = applicant;
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.APPLY_DATE
		);
		const apx_sign = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.SIGNATURE
		);

		if (apx_sign) padRef?.current?.fromDataURL(apx_sign?.value)

		form.setValues({
			...form.values,
			APPLY_DATE: !!apx?.type
				? apx
				: new ApplicantExtrasEntity(ApplicantExtras.APPLY_DATE),
			SIGNATURE: !!apx_sign?.type
				? apx_sign
				: new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
			first_name: first_name || null,
			last_name: last_name || null,
		});
	}, [applicant]);

	return (
		<>
			<Form onSubmit={form.handleSubmit}>
				<h6 className={styles.carrierName}>
					<h1>
						{t(
							"{COMPANY_NAME}",
							{ COMPANY_NAME: applicant?.company?.name },
							{ translateProps: true }
						)}
					</h1>
				</h6>
				<h6 className={styles.heading__sty}>
					{t("DRIVER_APPLICATION")}
				</h6>
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t(
						"{COMPANY_NAME}_MVR_AND_DMV_AUTHORIZATION",
						{ COMPANY_NAME: applicant?.company?.name },
						{ translateProps: true }
					)}
				</p>

				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseInput
						className="col-md-6 my-3"
						required
						name="first_name"
						placeholder="FIRST_NAME"
						label="FIRST_NAME"
						readOnly
						formik={form}
					/>
					<BaseInput
						className="col-md-6 my-3"
						required
						name="last_name"
						placeholder="LAST_NAME"
						label="LAST_NAME"
						readOnly
						formik={form}
					/>
					<BaseInput
						className="col-md-12 my-3"
						required
						type="date"
						name="APPLY_DATE.value"
						placeholder="DATE"
						max={`9999-11-11`}
						min={new Date().toISOString().split("T")[0]}
						label="DATE"
						formik={form}
					/>
				</Row>
				<Row className={styles.align__text_left}>
					<Col md="10" className="my-3">
						<h6 className={styles.bold}>{t("SIGNATURE")}</h6>
						<SignatureCanvas
							name="SIGNATURE.value"
							className="mt-2"
							required
							ref={padRef}
							onEnd={handleSignatureEnd}
							canvasProps={{
								style: { border: "1px solid black" },
								className: "sigCanvas",
							}}
						/>
						{Boolean(form?.errors?.SIGNATURE) && <p className={`h6 text-danger  ${styles.align__text_left}`}><em>{t('ERROR_SIGNS_REQUIRED')}</em></p>}

					</Col>
					<Col md="2" className="d-flex align-self-center justify-content-center">
						<button
							type="button"
							className="theme-secondary-btn "
							onClick={clearSignatureCanvas}
						>
							{t("CLEAR")}
						</button>
					</Col>
				</Row>
				<Row className="mt-3">
					<Col className="text-center">
						<Button type="submit">
							{t("NEXT")}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

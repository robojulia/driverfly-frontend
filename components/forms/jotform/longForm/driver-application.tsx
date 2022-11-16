import React, { useContext, useEffect, useState } from "react";
import styles from "../../../../styles/jotform.module.css";
import { Form, Button, Col, Row, Table } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import { useFormik } from "formik";
import BaseInput from "../../base-input";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";
import { DriverApplicationDto } from "../../../../models/jot-form/long-form/driver-application.dto";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";

export interface DriverApplicationProps extends PageProps { }

export function DriverApplication() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack },
	} = useContext(jotformContext);

	const { t } = useTranslation();
	let padRef = React.useRef<SignatureCanvas>(null);
	const clearSignaturePad = () => padRef?.current?.clear();

	const form = useFormik({
		initialValues: new DriverApplicationDto(),
		validationSchema: DriverApplicationDto.yupSchema(),
		onSubmit: (values) => {
			try {
				const { first_name, last_name, APPLY_DATE, SIGNATURE } = values;
				// console.log("sign", values);
				setApplicant({ ...applicant, first_name, last_name });
				updateApplicantExtras(APPLY_DATE);
				updateApplicantExtras(SIGNATURE);
				stepNext();
			} catch (error) {
				console.log(error);
			}
		},
		onReset: () => {
			stepBack();
		},
	});

	const handleSignatureEnd = () => {
		console.log(padRef?.current?.toDataURL()?.toString());
		const signatureValue = padRef?.current?.toDataURL()?.toString();
		form.setFieldValue("SIGNATURE.value", signatureValue);
	};

	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
		console.log("applicant", applicant);
	}, [form.values, form.errors]);

	useEffect(() => {
		const { first_name, last_name } = applicant;
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.APPLY_DATE
		);
		const apx_sign = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.SIGNATURE
		);
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
					<h1>{t('{COMPANY_NAME}', { COMPANY_NAME: 'talhatrucking' }, { translateProps: true })}</h1>
				</h6>
				<h6 className={styles.carrierName__smaller}>
					{t("DRIVER_APPLICATION")}
				</h6>
				<p className={`${styles.paragraph} ${styles.align__text_left}`}>
					{t("MVR_AND_DMV_AUTHORIZATION_TO_NAUTILIUS")}
				</p>

				<Row className={styles.align__text_left}>
					<BaseInput
						className="col-md-6 my-3"
						name="first_name"
						placeholder="FIRST_NAME"
						label="FIRST_NAME"
						formik={form}
					/>
					<BaseInput
						className="col-md-6 my-3"
						name="last_name"
						placeholder="LAST_NAME"
						label="FIRST_NAME"
						formik={form}
					/>
					<BaseInput
						className="col-md-12 my-3"
						type="date"
						name="APPLY_DATE.value"
						placeholder="DATE"
						label="DATE"
						formik={form}
					/>
				</Row>
				<Row className={styles.align__text_left}>
					<Col className="my-3">
						<h6>{t("SIGNATURE")}</h6>

						<SignaturePad
							name="SIGNATURE.value"
							ref={padRef}
							onEnd={handleSignatureEnd}
							canvasProps={{
								style: { border: "1px solid black" },
								className: "sigCanvas",
							}}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<button onClick={clearSignaturePad} className="theme-secondary-btn ">{t("CLEAR")}</button>
					</Col>
				</Row>
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

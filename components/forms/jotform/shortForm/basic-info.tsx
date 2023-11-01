import React, { useEffect, useContext, useState } from "react";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { Button, Col, Row } from "react-bootstrap";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { BooleanTypeExtra } from "../../../../enums/jotform/bool-and-not-sure.enum";
import ApplicantApi from "../../../../pages/api/applicant";
import { LoaderIcon } from "../../../loading/loader-icon";


export function BasicInfo() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack, setApplicantExtras },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

	const form = useFormik({
		initialValues: new ContactDto(),
		validationSchema: ContactDto.yupSchema(),
		onSubmit: async (values) => {
			console.log("values", values);
			try {
				const { email, zip_code, AUTHORIZE_TO_COMMUNICATE } = values;

				setApplicant({
					...applicant,
					email,
					zip_code,
				});

				updateApplicantExtras(AUTHORIZE_TO_COMMUNICATE);

				stepNext();

			} catch (error) {
				console.log("error", error);
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		const apx = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.AUTHORIZE_TO_COMMUNICATE
		);
		form.setValues({
			...form.values,
			AUTHORIZE_TO_COMMUNICATE: !!apx?.type
				? apx
				: {
					...new ApplicantExtrasEntity(ApplicantExtras.AUTHORIZE_TO_COMMUNICATE),
					value: BooleanTypeExtra.YES
				},
			email: applicant.email,
			zip_code: applicant.zip_code,
		});

	}, []);
	return (
		<>
 			<h4 className={`${styles.align__text_center} text-black  ${styles.bold}`}>{t("basic_info")}</h4>
			<Form
				className={styles.align__text_left}
				onSubmit={form.handleSubmit}
				onReset={form.handleReset}
			>
				<Row className={styles.bold}>
					<BaseInput
						className="col-md-6 my-3"
						required
						name="email"
						label="email"
						placeholder="email"
						formik={form}
					/>
				</Row>
				<Row className={styles.bold}>
					<BaseInput
						className="col-12 my-3"
						required
						name="zip_code"
						type="number"
						label="zip_code"
						placeholder="zip_code"
						formik={form}
					/>
				</Row>
				<Row className={`${styles.align__text_left} ${styles.bold}`}>
					<BaseSelect
						className="col-12 my-3"
						required
						labelPrefix="BooleanPreferenceType"
						enumType={BooleanTypeExtra}
						name="AUTHORIZE_TO_COMMUNICATE.value"
						placeholder="CHOOSE"
						label={t("{company_name}_SMS_EMAIL_AUTHORIZATION_NAUTILIUS", { company_name: applicant?.company?.name }, { translateProps: true })}
						formik={form}
					/>
				</Row>
				<Row className="mt-5">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button
							disabled={form.isValidating || form.isSubmitting || !form.isValid}
							className="float-left theme-secondary-btn"
							type="submit"
						>
							{t("NEXT")} <LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

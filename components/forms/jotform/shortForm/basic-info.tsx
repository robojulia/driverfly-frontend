import React, { useEffect, useState, useContext } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import ApplicantApi from "../../../../pages/api/applicant";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import jotformContext from "../../../../context/jotform-context";
import { PageProps } from "../../../../types/jotform/page-props.type";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";

export interface ThirdPageProps extends PageProps { }

export function ThirdPage({ onNextClick, onBackClick }: ThirdPageProps) {

	const {
		state: { applicant, applicantExtras, steps },
		method: { setApplicant, updateApplicantExtras, setSteps },
	} = useContext(jotformContext);

	const { t } = useTranslation();
	const form = useFormik({
		initialValues: new ContactDto(),
		validationSchema: ContactDto.yupSchema(),
		onSubmit: (values) => {
			try {

				console.log("values", values);
				const {
					email,
					phone,
					zip_code,
					AUTHORIZE_TO_COMMUNICATE
				} = values

				setApplicant({
					...applicant,
					email,
					phone,
					zip_code,
				})

				updateApplicantExtras(AUTHORIZE_TO_COMMUNICATE)

				console.log("values", values);
				setSteps(steps + 1)
				// onNextClick(values);
			} catch (error) {
				console.log("error", error);
			}
		},
		onReset: (values) => {
			setSteps(steps - 1)
			// onBackClick();
		},
	});
	useEffect(() => {
		console.log("applicantExtras", applicantExtras);

	}, [])
	useEffect(() => {
		console.log("applicantExtras", applicantExtras);

	}, [applicantExtras])

	// const getInfoByPhone = async ({ target: { name, value } }) => {
	//   const applicantApi = new ApplicantApi();
	//   try {
	//     const response = await applicantApi.search({ [name]: value });
	//     console.log("response", response[0]);
	//     form.setFieldValue(name, value);
	//     setApplicant(response[0]);
	//   } catch (error) {
	//     console.log(error, "Error Occured");
	//   }
	// };
	// useEffect(() => {
	//   const { email, phone, zip_code, options } = applicant;
	//   form.setValues({
	//     email: email || null,
	//     phone: phone || null,
	//     zip_code: zip_code || null,
	//     options: options || null,
	//   });
	// }, [applicant]);

	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);

	}, [form.values, form.errors])

	return (
		<>
			<Form
				className={styles.align__text_left}
				onSubmit={form.handleSubmit}
				onReset={form.handleReset}
			>
				<Row>
					<BaseInput
						className="col-6"
						required
						name="email"
						label="email"
						placeholder="email"
						formik={form}
					/>
				</Row>
				<Row className="mt-3">
					<BaseInputPhone
						className="col-6"
						required
						name="phone"
						label="phone"
						// onChange={getInfoByPhone}
						formik={form}
					/>
				</Row>
				<Row className="mt-3">
					<BaseInput
						className="col-6"
						required
						name="zip_code"
						label="zip_code"
						placeholder="zip_code"
						formik={form}
					/>
				</Row>
				<Row>
					<BaseSelect
						className="mt-3"
						required
						options={["Yes", "No"]}
						name="AUTHORIZE_TO_COMMUNICATE.value"
						placeholder="CHOOSE"
						label="SMS_EMAIL_AUTHORIZATION_NAUTILIUS"
						formik={form}
					/>
				</Row>
				<Row className="mt-3">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button className="float-left theme-secondary-btn" type="submit">
							{t("NEXT")}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

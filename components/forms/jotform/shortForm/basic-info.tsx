import React, { useEffect, useContext, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { ContactDto } from "../../../../models/jot-form/short-form/contact.dto";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { BooleanTypeExtra } from "../../../../enums/jotform/bool-and-not-sure.enum";
import ApplicantApi from "../../../../pages/api/applicant";
import { LoaderIcon } from "../../../loading/loader-icon";
import ViewModal from "../../../view-details/view-modal";
import OtpInputField from 'react-otp-input';


export function BasicInfo() {
	const {
		state: { applicant, applicantExtras },
		method: { setApplicant, updateApplicantExtras, stepNext, stepBack, setApplicantExtras },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [otp, setOtp] = useState<string>('')
	const [showOtpField, seShowtOtpField] = useState<boolean>(false)

	const form = useFormik({
		initialValues: new ContactDto(),
		validationSchema: ContactDto.yupSchema(),
		onSubmit: async (values, { setErrors }) => {
			console.log("values", values);
			try {
				const { email, phone, zip_code, AUTHORIZE_TO_COMMUNICATE } = values;
				const applicantApi = new ApplicantApi()
				const applicantEmailExists = await applicantApi.searchByPublic({ email })
				// const applicantPhoneExists = await applicantApi.searchByPublic({ phone })

				if (applicantEmailExists) {
					setOpenModal(true)
					// } else if (applicantPhoneExists) {
					// 	setErrors({ phone: 'ALREADY_EXISTS' })
				} else {
					setApplicant({
						...applicant,
						email,
						phone,
						zip_code,
					});

					updateApplicantExtras(AUTHORIZE_TO_COMMUNICATE);

					stepNext();
				}
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
				: new ApplicantExtrasEntity(ApplicantExtras.AUTHORIZE_TO_COMMUNICATE),
			email: applicant.email,
			phone: applicant.phone,
			zip_code: applicant.zip_code,
		});
	}, []);


	const handleUsePreviousProfile = async () => {
		const applicantApi = new ApplicantApi()
		const { email } = form.values
		try {
			const applicantExistingProfile = await applicantApi.searchApplicantProfile({ email })
			setApplicant(applicantExistingProfile)
			setOpenModal(false)
			stepNext()

		} catch (error) {
			console.log("errors", error)
		}
	}

	const handleLeavePreviousProfile = () => {
		setOpenModal(false)
		stepNext()
	}

	const onCloseClick = () => {
		setOpenModal(false)
	}

	useEffect(() => {
		setApplicantExtras([...applicant?.extras])
	}, [applicant])
	const inputStyle = {
		width: '40px',
		height: '40px',
		margin: '8px',
		borderRadius: '4px',
		border: '1px solid #ccc',
		fontSize: '24px',
		fontWeight: 'bold',
		textAlign: 'center',
	};
	return (
		<>
			<ViewModal
				show={openModal}
				title="EMAIL_ALREADY_EXISTS"
				size="lg"
				onCloseClick={onCloseClick}
				footer={
					<Row className="mt-5 w-100">
						<Col>
							<Button className="float-right" onClick={handleLeavePreviousProfile}>
								{t("NO")}
							</Button>
						</Col>

						<Col>
							{
								showOtpField ? (
									<Button
										onClick={handleUsePreviousProfile}
										className="float-left theme-secondary-btn"
									>
										{t("SUBMIT")}
									</Button>
								) : (

									<Button
										onClick={() => seShowtOtpField(true)}
										className="float-left theme-secondary-btn"
									>
										{t("PROCEED")}
									</Button>
								)
							}
						</Col>
					</Row>
				}
			>
				<div>

					{showOtpField ? (
						<>
							<h5 className="text-center">{t("OTP_MESSAGES")}</h5>
							<div className="w-100 d-flex justify-content-center mt-4 mb-4">
								<OtpInputField
									inputStyle={inputStyle}
									value={otp}
									onChange={(e) => setOtp(e)}
									numInputs={4}
									separator={<span>-</span>}
								/>
							</div>

						</>
					) : (
						<>
							<h3 className="text-center text-warning">{t("ALREADY_AN_APPLICANT")}</h3>
							<h5 className="text-center">{t("DO_YOU_WISH_TO_PROCEED_WITH_PREVIOUS_PROFILE")}</h5>

						</>
					)}
				</div>
			</ViewModal>
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
					<BaseInputPhone
						className="col-md-6 my-3"
						required
						name="phone"
						label="phone"
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

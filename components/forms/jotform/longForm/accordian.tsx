import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import Accordion from "react-bootstrap/Accordion";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";

import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import ApplicantApi from "../../../../pages/api/applicant";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import { AccordianDto } from "../../../../models/jot-form/long-form/accordian.dto";

export interface AccordianPageProps extends PageProps { }

export function AccordianPage() {

	const {
		state: { applicantExtras, applicant },
		method: { stepBack },
	} = useContext(jotformContext);

	// new accordian
	const { t } = useTranslation();
	let padRef = React.useRef<SignatureCanvas>(null);
	const clearSignaturePad = () => padRef?.current?.clear();

	const form = useFormik({
		initialValues: new AccordianDto(),
		validationSchema: AccordianDto.yupSchema(),
		onSubmit: async (values) => {
			const applicantApi = new ApplicantApi();
			const filtered_extras = applicantExtras?.filter((v) => !!v.value);
			try {
				const response = await applicantApi.jotform.create({
					applicant,
					applicantExtras: filtered_extras,
				});
				toast.success(t("successfully_saved_information"));
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	const handleSignatureEnd = () => {
		const signatureValue = padRef?.current?.toDataURL()?.toString();
		form.setFieldValue("SIGNATURE.value", signatureValue);
	  };

	useEffect(() => {
		console.log("applicant extras", applicantExtras);
		console.log("applicant", applicant);
		const apx_sign = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.SIGNATURE
		);

		form.setFieldValue(
			"SIGNATURE",
			padRef?.current?.fromDataURL(apx_sign?.value)
		  );

		form.setValues({
			...form.values,
			SIGNATURE: !!apx_sign?.type
			  ? apx_sign
			  : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE)
		  });
	}, [applicant]);

	return (
		<>
			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h1>{t("FORMS_TO_SIGNUP")}</h1>
				<h6>{t("PLEASE_CLICK_EACH_ARROW")}</h6>
				<Accordion className="col-12">
					<Accordion.Item eventKey="0">
						<Accordion.Header>
							{t("VERIFICATION_OF_EMPLOYMENT")}
						</Accordion.Header>
						<Accordion.Body>
							<h2>{t("VERIFICATION_OF_EMPLOYMENT")}</h2>
							<h6>{t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}</h6>
							<Row className={styles.align__text_left}>
								<h3>{t("SECTION_I")}</h3>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<h6>{t("EMPLOYEE_NAME_NAUTILUS")}</h6>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<BaseInput
										className="col-6 mb-3 mt-3"
										name="BUSINESS_TAX_NUMBER"
										label="EMPLOYEE_SS_OR_BUSINESS"
									/>
								</Col>
							</Row>

							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{t("I_HEREBY_AUTHORIZE_RELEASE_OF_BUSINESS")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("ALCOHOL_TESTS_WITH_A_RESULT")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("VERIFY_POSITIVE_DRUG_TESTS")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("REFUSALS_TO_BE_TESTED")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("OTHER_VIOLATIONS_OF_DOT")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("INFORMATION_OBTAINED_FROM_PREVIOUS")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<p className={styles.paragraph}>
									{" "}
									{t("DOCUMENTATION_IF_ANY_OF_COMPLETION")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<h6>{t("SIGNATURE")}</h6>
									<SignaturePad
										name="SIGNATURE.value"
										onEnd={handleSignatureEnd}
										ref={padRef}
										canvasProps={{
											width: 600,
											height: 200,
											style: { border: "1px solid black" },
											className: "sigCanvas",
										}}
									/>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<button onClick={clearSignaturePad}>{t("CLEAR")}</button>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<h4 className="mt-3">{t("I_A")}</h4>
								<p className={styles.paragraph}>
									{t("NEW_EMPLOYER_NAME_NAUTTLUS")}
								</p>
								<p className={styles.paragraph}>{t("ADDRESS_MLK_BLVD")}</p>
								<p className={styles.paragraph}>
									{t("PHONE_#_(551)_430-1998")}
								</p>
								<p className={styles.paragraph}>Fax #: </p>
								<p className={styles.paragraph}>{t("DESIGNATED_EMPLOYER")}</p>
							</Row>
							<Row className={`${styles.align__text_left} ${styles.highlight}`}>
								<h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
							</Row>
							<Row className={styles.align__text_left}>
								<h4 className="mt-3">{t("I-B")}</h4>
								<p className={styles.paragraph}>{t("CURRENT_COMPANY_NAME")}</p>
								<p className={styles.paragraph}>{t("ADDRESS:")}</p>
								<p className={styles.paragraph}>{t("PHONE_#_:")}</p>
								<p className={styles.paragraph}>{t("FAX_#_:")}</p>
								<p className={styles.paragraph}>
									{t("DESIGNATED_EMPLOYER_REPRESENTATIVE")}{" "}
								</p>
							</Row>
							<Row className={`${styles.align__text_left} ${styles.highlight}`}>
								<h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
							</Row>
							<Row className={styles.blur}>
								<Row className={styles.align__text_left}>
									<Col>
										<h3 className="mt-3">{t("SECTION_II")}</h3>
									</Col>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("TO_BE_COMPLETED")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<Col>
										<h4>{t("II_A_ACCIDENT_HISTORY")}</h4>
									</Col>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("THE_APPLICANT_NAMED_ABOVE")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("EMPLOYES_AS___________________________")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("DID_HE/SHE_DRIVE_MOTOR_VEHICLE")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("REASON_FOR_LEAVING_YOUR_EMPLOY")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("IF_THERE_IS_NO_SAFETY")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("THE_APPLICANT_NAMED_ABOVE_WAS")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("ACCIDENTAL_COMPLETE_THE_FOLLOWING")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}> {t("COLUMNS")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("1")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("2")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("3")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("INFORMATION_CONCERNING_OTHER_ACCIDENTS")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("ANY_OTHER_MARK")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<Col>
										<h4>{t("II_B")}</h4>
									</Col>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("DOT_REGULATED_TESTING")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_ALCOHOL_TEST")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_VERIFIED_DRUG_TEST")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_REFUSE_TESTED")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_OTHER_VIOLATIONS_DOT_AGENCY")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_PREVIOUS_OWNER_REPORT_VIOLATION")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("QUESTION_RETURN_TO_DUTY")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("NOTE_PREVIOUS_EMPLOYER_REPORT")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<Col>
										<h4>{t("II_C")}</h4>
									</Col>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>
										{t("NAME_OF_PERSON_ABOVE")}
									</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE_TITLE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE_PHONE")}</p>
								</Row>
								<Row className={styles.align__text_left}>
									<p className={styles.paragraph}>{t("BLANK_LINE_DATE")}</p>
								</Row>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="1">
						<Accordion.Header>{t("DISCLOSURE_AUTHORIZATION")}</Accordion.Header>
						<Accordion.Body>
							<Row className="mb-3">
								<h1>
								{t('{COMPANY_NAME}', { COMPANY_NAME: 'talhatrucking' }, { translateProps: true })}
								</h1>
							</Row>
							<Row>
								<h3>{t("DISCLOSURE_AUTHORIZATION")}</h3>
							</Row>
							<Row className="mt-3 mb-3">
								<h6>{t("DISCLOSURE")}</h6>
							</Row>
							<Row>
								<p className={styles.paragraph}>
								{t('{COMPANY_NAME}_REQUEST_BACKGROUND_REPORTS', { COMPANY_NAME: 'talhatrucking' }, { translateProps: true })}
								</p>
							</Row>
							<Row>
								<p className={styles.paragraph}>
									{t("BACKGROUND_REPORTS_CONTAINS")}
								</p>
							</Row>
							<Row>
								<h6>{t("AUTHORIZATION")}</h6>
							</Row>
							<Row>
								<p className={styles.paragraph}>
									{t("AUTHORIZATION_NAUTILUS_TRUCKING")}
								</p>
							</Row>
							<Row>
								<p className={styles.paragraph}>
								<span>	{t("APPLICANT_NAME")} {t('{APPLICANT_NAME}', { APPLICANT_NAME: 'Talha Bhutta' }, { translateProps: true })}</span>
								</p>
							</Row>
							<Row>
								<Col>
									<h6>{t("SIGNATURE")}</h6>
									<SignaturePad
										name="SIGNATURE.value"
										onEnd={handleSignatureEnd}
										ref={padRef}
										canvasProps={{
											width: 600,
											height: 200,
											style: { border: "1px solid black" },
											className: "sigCanvas",
										}}
									/>
								</Col>
							</Row>
							<Row>
								<Col>
									<button onClick={clearSignaturePad}>{t("CLEAR")}</button>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<BaseInput
									className="col-3 mt-3 mb-3"
									required
									type="date"
									name="date"
									placeholder="DATE"
									label="DATE"
								/>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="2">
						<Accordion.Header>
							{t("IMPORTANT_DISCLOSURE_BACKGROUND_PSP")}
						</Accordion.Header>
						<Accordion.Body>
							<Row>
								<h1>{t('{COMPANY_NAME}', { COMPANY_NAME: 'talhatrucking' }, { translateProps: true })}</h1>
							</Row>
							<Row>
								<h3>{t("IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}</h3>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("WHEN_SUBMITTED_MAIL_PHONE_COMPUTER")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("NEITHER_EMPLYER_NOR_PROSPECTIVE_SUPPLYING")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CRASH_OR_SUSPENSION_INVOLVED")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CANNOT_OBTAIN_BACKGRPUND")}
								</p>
							</Row>
							<Row>
								<h5
									className={`${styles.paragraph} ${styles.align__text_left}`}
								>
									{t("AUTHORIZATION")}
								</h5>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("AGREE_WITH_EMPLOYER")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("AUTHORIZE_COMPANY_TO_ACCESS")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("UNDERSTAND_FMCSA_SAFETY_DATA")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("UNDERSTAND_PSP_VIOLATIONS")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("DISCLOSURE_BACKGROUND")}
								</p>
							</Row>
							<Row>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
								<span>	{t("APPLICANT_NAME")} {t('{APPLICANT_NAME}', { APPLICANT_NAME: 'Talha Bhutta' }, { translateProps: true })}</span>
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<h6>{t("SIGNATURE")}</h6>
									<SignaturePad
										name="SIGNATURE.value"
										onEnd={handleSignatureEnd}
										ref={padRef}
										canvasProps={{
											width: 600,
											height: 200,
											style: { border: "1px solid black" },
											className: "sigCanvas",
										}}
									/>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<button onClick={clearSignaturePad}>{t("CLEAR")}</button>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<BaseInput
									className="col-3 mt-3 mb-3"
									required
									type="date"
									name="date"
									placeholder="DATE"
									label="Date"
									// formik={form}
									/>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("NOTICE_DISCLOSURE")}
								</p>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									 {t('EMPLOYEE_DEF_NOTICE_{number}', { number: '49' }, { translateProps: true })}
								</p>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									 {t('{license}', { license: 'C.F.R. 383.5.' }, { translateProps: true })}
								</p>
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									 {t('LAST_UPDATED_{date}', { date: '12/22/2015' }, { translateProps: true })}
								</p>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
					<Accordion.Item eventKey="3">
						<Accordion.Header>{t("GENERAL_CONSENT_QUERIES")}</Accordion.Header>
						<Accordion.Body>
							<Row>
								<h1>{t('{COMPANY_NAME}', { COMPANY_NAME: 'talhatrucking' }, { translateProps: true })}</h1>
							</Row>
							<Row>
								<h3>{t("GENERAL_CONSENT_QUERIES")}</h3>
							</Row>

							<Row>
								<p className={styles.paragraph}>{t("INSTRUCTIONS_CFR")}</p>
							</Row>
							<Row>
								<BaseInput
									className="col-6 mt-3"
									name="name"
									placeholder="FULL_NAME"
								// formik={form}
								/>
							</Row>

							<Row>
								<BaseInput
									className="col-6 mt-3"
									name="employer_name"
									placeholder="EMPLOYER_NAME"
								// formik={form}
								/>
							</Row>
							<Row>
								<BaseInput
									className="col-6 mt-3"
									name="cdl_license_number"
									placeholder="CDL_LICENSE_PLACEHOLDER"
								// formik={form}
								/>
							</Row>
							<Row>
								<BaseInput
									className="col-6 mt-3"
									name="expiration_date"
									type="date"
									placeholder="expiration_date"
								// formik={form}
								/>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CONSENT_TO_CLEARINGHOUSE_1")}
								</p>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CONSENT_TO_CLEARINGHOUSE_2")}
								</p>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CONSENT_TO_CLEARINGHOUSE_3")}
								</p>
							</Row>
							<Row className="mt-4">
								<p className={`${styles.paragraph} ${styles.align__text_left}`}>
									{t("CONSENT_TO_CLEARINGHOUSE_4")}
								</p>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<h6>{t("SIGNATURE")}</h6>
									<SignaturePad
										name="SIGNATURE.value"
										onEnd={handleSignatureEnd}
										ref={padRef}
										canvasProps={{
											width: 600,
											height: 200,
											style: { border: "1px solid black" },
											className: "sigCanvas",
										}}
									/>
								</Col>
							</Row>
							<Row className={styles.align__text_left}>
								<Col>
									<button onClick={clearSignaturePad}>{t("CLEAR")}</button>
								</Col>
							</Row>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
				<Row className="mt-2">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button className="float-left" type="submit">
							{t("SUBMIT")}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

import { useFormik } from "formik";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import Accordion from "react-bootstrap/Accordion";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import ApplicantApi from "../../../../../pages/api/applicant";
import { toast, ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../../models/applicant/applicant-extras.entity";
import { AccordianDto } from "../../../../../models/jot-form/long-form/accordian.dto";
import { VerificationOfEmployment } from "./verification-of-employment";
import { DisclosureAuthorization } from "./disclosure-authorization";
import { ImportantDisclosureBackgroundPsp } from "./important-disclosure-background-psp";
import { GeneralConsentQueries } from "./general-consent-queries";
import SignatureCanvas from "react-signature-canvas";
import styles from "../../../../../styles/jotform.module.css";
import { LoaderIcon } from "../../../../loading/loader-icon";
import { ArrowDownCircleFill, ArrowUpCircleFill } from 'react-bootstrap-icons'
export function AccordianPage() {

	const {
		state: { applicantExtras, applicant },
		method: { stepBack, updateApplicantExtras, stepNext },
	}: JotFormContextType = useContext(JotformContext);
	const [showTab, setShowTab] = useState<boolean[]>([false, false, false, false])
	const [showTab1, setShowTab1] = useState<boolean>(false)
	const [showTab2, setShowTab2] = useState<boolean>(false)
	const [showTab3, setShowTab3] = useState<boolean>(false)
	const [showTab4, setShowTab4] = useState<boolean>(false)
	const { t } = useTranslation();

	useEffect(() => {
		console.log('bool values', showTab)
	}, [showTab])
	let padRef = useRef<SignatureCanvas>(null);

	const clearSignatureCanvas = (): void => {
		padRef?.current?.clear();
		form.setFieldValue("SIGNATURE.value", null);
	}

	const handleSignatureEnd = (): void => {
		const signatureValue = padRef?.current?.toDataURL()?.toString();
		form.setFieldValue("SIGNATURE.value", signatureValue);
	};

	const form = useFormik({
		initialValues: new AccordianDto(),
		validationSchema: AccordianDto.yupSchema(),
		onSubmit: async (values) => {
			const applicantApi = new ApplicantApi();

			try {
				const filtered_extras = applicantExtras?.filter((v) => !!v.value);
				const response = await applicantApi.jotform.update(applicant.id, {
					applicant,
					applicantExtras: filtered_extras,
				});

				if (response) stepNext()
			} catch (error) {
				console.log(error);
				globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
			}
		},
		onReset: (values) => {
			stepBack();
		},
	});

	useEffect(() => {
		updateApplicantExtras(form.values.EMPLOYEE_SS_OR_ID);
		updateApplicantExtras(form.values.DISCLOSURE_AND_AUTHORIZATION_DATE);
		updateApplicantExtras(form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);
		updateApplicantExtras(form.values.GENERAL_CONSENT);
		updateApplicantExtras(form.values.SIGNATURE);
	}, [form.values]);

	useEffect(() => {
		const apx_ss_id = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.EMPLOYEE_SS_OR_ID
		);
		const apx_disclosure_date = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
		);
		const apx_background_date = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
		);
		const apx_general_consent = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.GENERAL_CONSENT
		);
		const apx_sign = applicantExtras?.find(
			(v) => v.type === ApplicantExtras.SIGNATURE
		);

		if (apx_sign) padRef?.current?.fromDataURL(apx_sign?.value)

		form.setValues({
			...form.values,
			SIGNATURE: !!apx_sign?.type
				? apx_sign
				: new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
			EMPLOYEE_SS_OR_ID: !!apx_ss_id?.type
				? apx_ss_id
				: new ApplicantExtrasEntity(ApplicantExtras.EMPLOYEE_SS_OR_ID),
			DISCLOSURE_AND_AUTHORIZATION_DATE: !!apx_disclosure_date?.type
				? apx_disclosure_date
				: new ApplicantExtrasEntity(
					ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE
				),
			IMPORTANT_DISCLOSURE_BACKGROUND_DATE: !!apx_background_date?.type
				? apx_background_date
				: new ApplicantExtrasEntity(
					ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
				),
			GENERAL_CONSENT: !!apx_general_consent?.type
				? apx_general_consent
				: new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT),
		});
	}, [applicant]);

	useEffect(() => {
		console.log("form values", form.values);
		console.log("form errors", form.errors);
	}, [form.values, form.errors]);
	return (
		<>
			<ToastContainer />
			<Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
				<h1 className="my-3">{t("FORMS_TO_SIGNUP")}</h1>
				<h6 className="my-3">{t("PLEASE_CLICK_EACH_ARROW")}</h6>
				<button type="button" className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline " onClick={() => setShowTab([!!!showTab[0], false, false, false])}>
					{showTab[0] ? (
						<>
							{t("HIDE_VERIFICATION_OF_EMPLOYMENT")}
							< ArrowUpCircleFill />
						</>

					) : (
						<>
							{t("SHOW_VERIFICATION_OF_EMPLOYMENT")}
							< ArrowDownCircleFill />
						</>
					)}

				</button>
				{showTab[0] && <VerificationOfEmployment form={form} />}


				<button type="button" className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline" onClick={() => setShowTab([false, !!!showTab[1], false, false])}>
					{showTab[1] ? (
						<>
							{t("HIDE_DISCLOSURE_AUTHORIZATION")}
							< ArrowUpCircleFill />
						</>

					) : (
						<>
							{t("SHOW_DISCLOSURE_AUTHORIZATION")}
							< ArrowDownCircleFill />
						</>
					)}

				</button>
				{showTab[1] && <DisclosureAuthorization form={form} />}

				<button type="button" className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline" onClick={() => setShowTab([false, false, !!!showTab[2], false])}>
					{showTab[2] ? (
						<>
							{t("HIDE_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
							< ArrowUpCircleFill />
						</>

					) : (
						<>
							{t("SHOW_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
							< ArrowDownCircleFill />
						</>
					)}

				</button>
				{showTab[2] && <ImportantDisclosureBackgroundPsp form={form} />}


				<button type="button" className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline" onClick={() => setShowTab([false, false, false, !!!showTab[3]])}>
					{showTab[3] ? (
						<>
							{t("HIDE_GENERAL_CONSENT_QUERIES")}
							< ArrowUpCircleFill />
						</>

					) : (
						<>
							{t("SHOW_GENERAL_CONSENT_QUERIES")}
							< ArrowDownCircleFill />
						</>
					)}

				</button>
				{showTab[3] && <GeneralConsentQueries form={form} />}



				{/* <Row className={styles.align__text_left}>
					<Col md="9" className="my-3">
						<h6>{t("SIGNATURE")}</h6>
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
					</Col>
					<Col md="3" className="d-flex align-self-center justify-content-center">
						<Button
							type="button"
							className="theme-secondary-btn "
							onClick={clearSignatureCanvas}
						>{t("CLEAR")}</Button>
					</Col>
				</Row> */}
				<Row className="mt-4">
					<Col>
						<Button className="float-right" type="reset">
							{t("BACK")}
						</Button>
					</Col>

					<Col>
						<Button
							disabled={form.isValidating || form.isSubmitting || !form.isValid}
							className="float-left"
							type="submit"
						>
							{t("SUBMIT")}<LoaderIcon isLoading={!!form?.isSubmitting} />
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
}

import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import JotformContext, { JotFormContextType } from "../../../../../context/jotform-context";
import ApplicantApi from "../../../../../pages/api/applicant";
import { toast, ToastContainer } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { AccordianDto } from "../../../../../models/jot-form/long-form/accordian.dto";
import { VerificationOfEmployment } from "./verification-of-employment";
import { DisclosureAuthorization } from "./disclosure-authorization";
import { ImportantDisclosureBackgroundPsp } from "./important-disclosure-background-psp";
import { GeneralConsentQueries } from "./general-consent-queries";
import styles from "../../../../../styles/jotform.module.css";
import { LoaderIcon } from "../../../../loading/loader-icon";
import { ArrowDownCircleFill, ArrowUpCircleFill } from 'react-bootstrap-icons'
export function AccordianPage() {

	const {
		state: { applicantExtras, applicant },
		method: { stepBack, updateApplicantExtras, stepNext },
	}: JotFormContextType = useContext(JotformContext);
	const [showTab, setShowTab] = useState<boolean[]>([false, false, false, false])
	const { t } = useTranslation();

	useEffect(() => {
		console.log('bool values', showTab)
	}, [showTab])

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
		updateApplicantExtras(form.values.SIGNATURE_VOE_AUTHORIZATION);
		updateApplicantExtras(form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION);
		updateApplicantExtras(form.values.SIGNATURE_IMPORTANT_BACKGROUND);
		updateApplicantExtras(form.values.SIGNATURE_GENERAL_CONSENT);
	}, [form.values]);




	useEffect(() => {
		console.log("form values", form.values);
		console.log("form errors", form.errors);
		console.log("boolean errors", Object.keys(form.errors));

	}, [form.values, form.errors]);
	return (
		<>
			<ToastContainer />
			{
				Boolean(Object.keys(form.errors).length) ? (
					<div className="alert alert-warning alert-dismissible fade show text-center" role="alert">
						<strong>{t("ACCORDIAN_ALERT")}</strong>
					</div>
				) : null
			}
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

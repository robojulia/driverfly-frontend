import { useFormik } from "formik";
import { useContext, useEffect, useRef } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/jotform.module.css";
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

export function AccordianPage() {

	const {
		state: { applicantExtras, applicant },
		method: { stepBack, updateApplicantExtras },
	}: JotFormContextType = useContext(JotformContext);

	const { t } = useTranslation();

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

	useEffect(() => {
		updateApplicantExtras(form.values.EMPLOYEE_SS_OR_ID);
		updateApplicantExtras(form.values.DISCLOSURE_AND_AUTHORIZATION_DATE);
		updateApplicantExtras(form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);
		updateApplicantExtras(form.values.GENERAL_CONSENT);
		updateApplicantExtras(form.values.SIGNATURE);
	}, [form.values]);

	useEffect(() => {
		console.log("applicant extras", applicantExtras);
		console.log("applicant", applicant);

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

		// padRef?.current?.fromDataURL(apx_sign?.value)

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
				<h1>{t("FORMS_TO_SIGNUP")}</h1>
				<h6>{t("PLEASE_CLICK_EACH_ARROW")}</h6>
				<Accordion className="col-12 p-0 jotform__accordion">
					<VerificationOfEmployment
						eventKey="0"
						form={form}
					/>
					<DisclosureAuthorization
						eventKey="1"
						form={form}
					/>
					<ImportantDisclosureBackgroundPsp
						eventKey="2"
						form={form}
					/>
					<GeneralConsentQueries
						eventKey="3"
						form={form}
					/>
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

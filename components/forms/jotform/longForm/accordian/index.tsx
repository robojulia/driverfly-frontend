import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { ArrowDownCircleFill, ArrowUpCircleFill } from "react-bootstrap-icons";
import { toast, ToastContainer } from "react-toastify";
import JotformContext, {
  JotFormContextType,
} from "../../../../../context/jotform-context";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../../models/applicant";
import { AccordianDto } from "../../../../../models/jot-form/long-form/accordian.dto";
import ApplicantApi from "../../../../../pages/api/applicant";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { LoaderIcon } from "../../../../loading/loader-icon";
import { DisclosureAuthorization } from "./disclosure-authorization";
import { GeneralConsentQueries } from "./general-consent-queries";
import { ImportantDisclosureBackgroundPsp } from "./important-disclosure-background-psp";
import { VerificationOfEmployment } from "./verification-of-employment";
import styles from "../../../../../styles/digitalhiringapp.module.css";

export function AccordianPage() {
  const {
    state: { applicantExtras, applicant, jobs, company },
    method: { stepBack, updateApplicantExtras, stepNext },
  }: JotFormContextType = useContext(JotformContext);
  const [showTab, setShowTab] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new AccordianDto(),
    validationSchema: AccordianDto.yupSchema(),
    onSubmit: async (values) => {
      const applicantApi = new ApplicantApi();

      applicant.ssn = values.ssn;
      console.log("Submitting form with SSN:", values.ssn);
      try {
        const filtered_extras = applicantExtras?.filter(
          (v) => v?.value != null || v?.value != undefined
        );

        let response: ApplicantEntity;
        if (applicant?.id) {
          response = await applicantApi.jotform.update(applicant.id, {
            applicant,
            applicantExtras: filtered_extras,
            jobs,
          });
        } else {
          response = await applicantApi.jotform.create(company.id, {
            applicant,
            applicantExtras: filtered_extras,
            jobs,
          });
        }
        if (response) stepNext();
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
    updateApplicantExtras(form.values.DISCLOSURE_AND_AUTHORIZATION_DATE);
    updateApplicantExtras(form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);
    updateApplicantExtras(form.values.GENERAL_CONSENT);
    updateApplicantExtras(form.values.SIGNATURE_VOE_AUTHORIZATION);
    updateApplicantExtras(form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION);
    updateApplicantExtras(form.values.SIGNATURE_IMPORTANT_BACKGROUND);
    updateApplicantExtras(form.values.SIGNATURE_GENERAL_CONSENT);
  }, [form.values]);

  // useEffect(() => {
  // 	console.log("form values", form.values);
  // 	console.log("form errors", form.errors);
  // 	console.log("boolean errors", Object.keys(form.errors));
  // }, [form.values, form.errors]);

  // useEffect(() => {
  // 	console.log("in use error")
  // 	if (Boolean(Object.keys(form.errors).includes(ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION))) {
  // 		() => setShowTab([!!!showTab[0], false, false, false])
  // 	}
  // 	if (Boolean(Object.keys(form.errors).includes(ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION))) {
  // 		() => setShowTab([false, !!!showTab[1], false, false])
  // 	}
  // 	if (Boolean(Object.keys(form.errors).includes(ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND))) {
  // 		setShowTab([false, false, !!!showTab[2], false])
  // 		console.log("in 3rd error")
  // 	}
  // 	if (Boolean(Object.keys(form.errors).includes(ApplicantExtras.SIGNATURE_GENERAL_CONSENT))) {
  // 		() => setShowTab([false, false, false, !!!showTab[3]])
  // 	}

  // }, [form.errors])
  return (
    <>
      <ToastContainer />
      {Boolean(Object.keys(form.errors).length) ? (
        <div
          className="alert alert-warning alert-dismissible fade show text-center"
          role="alert"
        >
          <strong>{t("ACCORDIAN_ALERT")}</strong>
        </div>
      ) : null}
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
          {t("FORMS_TO_SIGNUP")}
        </h1>
        <h6 className={`${styles.paragraph} my-3`}>
          {t("PLEASE_CLICK_EACH_ARROW")}
        </h6>
        <button
          type="button"
          className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline "
          onClick={() => setShowTab([!!!showTab[0], false, false, false])}
        >
          {showTab[0] ? (
            <>
              {t("HIDE_VERIFICATION_OF_EMPLOYMENT")}
              <ArrowUpCircleFill />
            </>
          ) : (
            <>
              {t("SHOW_VERIFICATION_OF_EMPLOYMENT")}
              <ArrowDownCircleFill />
            </>
          )}
        </button>
        {showTab[0] && <VerificationOfEmployment form={form} />}

        <button
          type="button"
          className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline"
          onClick={() => setShowTab([false, !!!showTab[1], false, false])}
        >
          {showTab[1] ? (
            <>
              {t("HIDE_DISCLOSURE_AUTHORIZATION")}
              <ArrowUpCircleFill />
            </>
          ) : (
            <>
              {t("SHOW_DISCLOSURE_AUTHORIZATION")}
              <ArrowDownCircleFill />
            </>
          )}
        </button>
        {showTab[1] && <DisclosureAuthorization form={form} />}

        <button
          type="button"
          className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline"
          onClick={() => setShowTab([false, false, !!!showTab[2], false])}
        >
          {showTab[2] ? (
            <>
              {t("HIDE_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
              <ArrowUpCircleFill />
            </>
          ) : (
            <>
              {t("SHOW_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
              <ArrowDownCircleFill />
            </>
          )}
        </button>
        {showTab[2] && <ImportantDisclosureBackgroundPsp form={form} />}

        <button
          type="button"
          className="w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline"
          onClick={() => setShowTab([false, false, false, !!!showTab[3]])}
        >
          {showTab[3] ? (
            <>
              {t("HIDE_GENERAL_CONSENT_QUERIES")}
              <ArrowUpCircleFill />
            </>
          ) : (
            <>
              {t("SHOW_GENERAL_CONSENT_QUERIES")}
              <ArrowDownCircleFill />
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
              {t("SUBMIT")}
              <LoaderIcon isLoading={!!form?.isSubmitting} />
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}

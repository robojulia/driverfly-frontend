import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import {
  ArrowDownCircleFill,
  ArrowUpCircleFill,
  CheckCircleFill,
  ExclamationCircleFill,
} from "react-bootstrap-icons";
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
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { CompanyPreferenceEnhancementLabel } from "../../../../../enums/company/company-preference-enhancement-label.enum";

export function AccordianPage() {
  const {
    state: { applicantExtras, applicant, jobs, company, companyPreferences },
    method: { stepBack, updateApplicantExtras, stepNext },
  }: JotFormContextType = useContext(JotformContext);
  const [showTab, setShowTab] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const { t } = useTranslation();

  // Common icon style for consistent sizing
  const iconStyle = { fontSize: "16px", minWidth: "16px" };

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

    // For debugging
    console.log("General Consent:", form.values.GENERAL_CONSENT?.value);
    console.log(
      "General Consent Signature:",
      form.values.SIGNATURE_GENERAL_CONSENT?.value
    );
    console.log("isGeneralConsentComplete:", isGeneralConsentComplete());
  }, [form.values]);

  // Functions to check completion status of each section
  const isVerificationOfEmploymentComplete = () => {
    const isSignatureComplete =
      !!form.values.SIGNATURE_VOE_AUTHORIZATION?.value;

    // If SSN is required based on company preferences, check if it exists
    const ssnRequired = !!companyPreferences?.find(
      (v) => v.label === CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA
    )?.value;

    if (ssnRequired) {
      return (
        isSignatureComplete && !!form.values.ssn && form.values.ssn.length === 9
      );
    }

    return isSignatureComplete;
  };

  const isDisclosureAuthorizationComplete = () => {
    return (
      !!form.values.SIGNATURE_DISCLOSURE_AUTHORIZATION?.value &&
      !!form.values.DISCLOSURE_AND_AUTHORIZATION_DATE?.value
    );
  };

  const isImportantDisclosureComplete = () => {
    return (
      !!form.values.SIGNATURE_IMPORTANT_BACKGROUND?.value &&
      !!form.values.IMPORTANT_DISCLOSURE_BACKGROUND_DATE?.value
    );
  };

  const isGeneralConsentComplete = () => {
    return (
      !!form.values.SIGNATURE_GENERAL_CONSENT?.value &&
      !!form.values.GENERAL_CONSENT?.value?.consentGiven
    );
  };

  // Helper function to render status indicator
  const renderCompletionStatus = (isComplete) => {
    if (isComplete) {
      return (
        <CheckCircleFill
          className="ms-2 me-2 text-success"
          title={t("FORM_COMPLETED")}
          style={iconStyle}
        />
      );
    }
    return (
      <ExclamationCircleFill
        className="ms-2 me-2 text-warning"
        title={t("FORM_INCOMPLETE")}
        style={iconStyle}
      />
    );
  };

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
        <div className="mb-3">
          <small className="d-flex align-items-center">
            <CheckCircleFill className="text-success me-2" style={iconStyle} />
            <span className="text-success">{t("COMPLETED_FORM")}</span>
            <ExclamationCircleFill
              className="text-warning ms-3 me-2"
              style={iconStyle}
            />
            <span className="text-warning">{t("INCOMPLETE_FORM")}</span>
          </small>
        </div>
        <button
          type="button"
          className={`w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline ${
            isVerificationOfEmploymentComplete() ? "border-success" : ""
          }`}
          onClick={() => setShowTab([!!!showTab[0], false, false, false])}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {showTab[0]
                ? t("HIDE_VERIFICATION_OF_EMPLOYMENT")
                : t("SHOW_VERIFICATION_OF_EMPLOYMENT")}
            </div>
            {renderCompletionStatus(isVerificationOfEmploymentComplete())}
          </div>
          <div className="ms-2 mt-1">
            {showTab[0] ? (
              <ArrowUpCircleFill style={iconStyle} />
            ) : (
              <ArrowDownCircleFill style={iconStyle} />
            )}
          </div>
        </button>
        {showTab[0] && <VerificationOfEmployment form={form} />}

        <button
          type="button"
          className={`w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline ${
            isDisclosureAuthorizationComplete() ? "border-success" : ""
          }`}
          onClick={() => setShowTab([false, !!!showTab[1], false, false])}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {showTab[1]
                ? t("HIDE_DISCLOSURE_AUTHORIZATION")
                : t("SHOW_DISCLOSURE_AUTHORIZATION")}
            </div>
            {renderCompletionStatus(isDisclosureAuthorizationComplete())}
          </div>
          <div className="ms-2 mt-1">
            {showTab[1] ? (
              <ArrowUpCircleFill style={iconStyle} />
            ) : (
              <ArrowDownCircleFill style={iconStyle} />
            )}
          </div>
        </button>
        {showTab[1] && <DisclosureAuthorization form={form} />}

        <button
          type="button"
          className={`w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline ${
            isImportantDisclosureComplete() ? "border-success" : ""
          }`}
          onClick={() => setShowTab([false, false, !!!showTab[2], false])}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {showTab[2]
                ? t("HIDE_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")
                : t("SHOW_IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS")}
            </div>
            {renderCompletionStatus(isImportantDisclosureComplete())}
          </div>
          <div className="ms-2 mt-1">
            {showTab[2] ? (
              <ArrowUpCircleFill style={iconStyle} />
            ) : (
              <ArrowDownCircleFill style={iconStyle} />
            )}
          </div>
        </button>
        {showTab[2] && <ImportantDisclosureBackgroundPsp form={form} />}

        <button
          type="button"
          className={`w-100 d-flex justify-content-between align-items-center text-left py-3 my-2 tab__wid_for_jot theme-primary-btn-outline ${
            isGeneralConsentComplete() ? "border-success" : ""
          }`}
          onClick={() => setShowTab([false, false, false, !!!showTab[3]])}
        >
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              {showTab[3]
                ? t("HIDE_GENERAL_CONSENT_QUERIES")
                : t("SHOW_GENERAL_CONSENT_QUERIES")}
            </div>
            {renderCompletionStatus(isGeneralConsentComplete())}
          </div>
          <div className="ms-2 mt-1">
            {showTab[3] ? (
              <ArrowUpCircleFill style={iconStyle} />
            ) : (
              <ArrowDownCircleFill style={iconStyle} />
            )}
          </div>
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

import { useContext, useEffect, useState, useRef } from "react";
import { Col, Form, Row } from "react-bootstrap";
import InputMask from "react-input-mask";
import BaseInput from "../../../base-input";
import { useTranslation } from "../../../../../hooks/use-translation";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { AccordianProps } from "../../../../../types/jotform/accordian.type";
import JotformContext, {
  JotFormContextType,
} from "../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../../models/applicant";
import { CompanyPreferenceEnhancementLabel } from "../../../../../enums/company/company-preference-enhancement-label.enum";
import { SignatureComponent } from "../../../signature";

export function VerificationOfEmployment({ form }: AccordianProps) {
  const {
    state: { applicant, applicantExtras, companyPreferences, company },
    method: { setApplicant },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [maskedValue, setMaskedValue] = useState("");
  const inputRef = useRef(null);

  const handleSignatureChange = (signature: string | null) => {
    const signatureEntity = new ApplicantExtrasEntity(
      ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION
    );
    signatureEntity.value = signature;
    form.setFieldValue("SIGNATURE_VOE_AUTHORIZATION", signatureEntity);
  };

  useEffect(() => {
    const apx_sign_voe_authorization = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION
    );

    const signatureEntity =
      apx_sign_voe_authorization ||
      new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION);

    // Format SSN if it exists in the applicant data
    const formattedSSN = applicant.ssn ? formatSSN(applicant.ssn) : "";

    // Set initial masked value for display
    setMaskedValue(formattedSSN);

    // Set values in the form including SSN
    form.setValues({
      ...form.values,
      SIGNATURE_VOE_AUTHORIZATION: signatureEntity,
      ssn: applicant.ssn || "",
    });

    console.log("Initialized SSN in form:", applicant.ssn || "");
  }, [applicant]);

  // Initialize display value when SSN changes
  useEffect(() => {
    if (form.values.ssn) {
      // Format SSN for display (XXX-XX-XXXX)
      const formattedSSN = formatSSN(form.values.ssn);
      setMaskedValue(formattedSSN);
    } else {
      setMaskedValue("");
    }
  }, [form.values.ssn]);

  // Format SSN in XXX-XX-XXXX pattern
  const formatSSN = (value) => {
    if (!value) return "";

    // Remove all non-digit characters
    const ssn = value.replace(/\D/g, "");

    // Make sure we don't exceed 9 digits
    const cleaned = ssn.slice(0, 9);

    // Format based on the length
    if (cleaned.length < 4) {
      return cleaned;
    } else if (cleaned.length < 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(
        5,
        9
      )}`;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Remove all non-digit characters
    const rawValue = inputValue.replace(/\D/g, "");

    // Store raw digits in form
    form.setFieldValue("ssn", rawValue);

    // Format the display value
    const formatted = formatSSN(rawValue);
    setDisplayValue(formatted);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsFocused(true);
    // If there's a masked value, use it for the display value
    // Otherwise start with an empty string
    if (form.values.ssn) {
      setDisplayValue(formatSSN(form.values.ssn));
    } else {
      setDisplayValue("");
    }
  };

  // Handle input blur
  const handleBlur = (e) => {
    setIsFocused(false);

    // Get the current SSN value from the form or input
    const currentValue = form.values.ssn || displayValue.replace(/\D/g, "");

    // Make sure the ssn field is set in the form
    if (currentValue) {
      // Remove any formatting characters, keep only digits
      const rawValue = currentValue.replace(/\D/g, "");

      // Ensure we're storing the cleaned value in the form
      form.setFieldValue("ssn", rawValue);

      // Update the masked value for display when not focused
      setMaskedValue(formatSSN(rawValue));

      // Save the SSN to the applicant object so it persists between form opens
      setApplicant({
        ...applicant,
        ssn: rawValue,
      });

      console.log("SSN set in form on blur:", rawValue);
    }

    // Call formik's handleBlur to track field touched state
    form.handleBlur(e);
  };

  // Update applicant with SSN when it changes and passes validation
  useEffect(() => {
    // Only update if SSN exists, has changed from the current applicant value, and is valid (9 digits)
    if (
      form.values.ssn &&
      form.values.ssn !== applicant.ssn &&
      form.values.ssn.length === 9
    ) {
      // Debounce the update to avoid too many state changes
      const timer = setTimeout(() => {
        setApplicant({
          ...applicant,
          ssn: form.values.ssn,
        });
        console.log("Updated applicant SSN:", form.values.ssn);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [form.values.ssn]);

  const current_company = applicant?.employers?.find((v) => !!v?.is_current);

  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <h2 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t("VERIFICATION_OF_EMPLOYMENT")}
        </h2>
        <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}
        </h6>
        <Row className={styles.align__text_left}>
          <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("SECTION_I")}
          </h3>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t(
              "EMPLOYEE_NAME_NAUTILUS_{employee_name}",
              {
                employee_name: `${applicant?.first_name} ${applicant?.last_name}`,
              },
              { translateProps: true }
            )}
          </h6>
        </Row>

        {Boolean(
          companyPreferences?.find(
            (v) => v.label == CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA
          )?.value
        ) && (
          <Row className={styles.align__text_left}>
            <div className="col my-3">
              <Form.Group>
                <Form.Label>
                  {t("EMPLOYEE_SSN")} <span className="text-danger">*</span>
                </Form.Label>
                {isFocused ? (
                  // When focused, show regular input with masked format
                  <input
                    ref={inputRef}
                    type="text"
                    name="ssn"
                    value={displayValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`form-control ${
                      form.touched.ssn && form.errors.ssn ? "is-invalid" : ""
                    }`}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11} // 9 digits + 2 dashes
                    required
                  />
                ) : (
                  // When not focused, show password field with dots
                  <input
                    type="password"
                    name="ssn"
                    value={maskedValue}
                    onFocus={handleFocus}
                    className={`form-control ${
                      form.touched.ssn && form.errors.ssn ? "is-invalid" : ""
                    }`}
                    placeholder="XXX-XX-XXXX"
                    required
                    readOnly
                  />
                )}
                {form.touched.ssn && form.errors.ssn && (
                  <Form.Control.Feedback type="invalid">
                    {form.errors.ssn}
                  </Form.Control.Feedback>
                )}
                <small className="text-muted">{t("ENTER_FULL_SSN")}</small>
              </Form.Group>
            </div>
          </Row>
        )}

        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("I_HEREBY_AUTHORIZE_RELEASE_OF_BUSINESS")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("ALCOHOL_TESTS_WITH_A_RESULT")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("VERIFY_POSITIVE_DRUG_TESTS")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("REFUSALS_TO_BE_TESTED")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("OTHER_VIOLATIONS_OF_DOT")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("INFORMATION_OBTAINED_FROM_PREVIOUS")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t("DOCUMENTATION_IF_ANY_OF_COMPLETION")}
          </p>
        </Row>
        <Row className={styles.align__text_left}>
          <Col>
            <h6 className={`${styles.txtcolor} ${styles.align__text_left}`}>
              {t("SIGNATURE")}
            </h6>
            <SignatureComponent
              firstName={applicant?.first_name}
              lastName={applicant?.last_name}
              onSignatureChange={handleSignatureChange}
              initialSignature={form.values.SIGNATURE_VOE_AUTHORIZATION?.value}
              required
            />
          </Col>
        </Row>
        <Row className={styles.align__text_left}>
          <h4 className={`${styles.titlechildren} mt-3`}>{t("I_A")}</h4>
          <p className={`${styles.paragraph} ${styles.align__text_left}`}>
            {t(
              "NEW_EMPLOYER_NAME_{company_name}",
              { company_name: company?.name ?? applicant?.company?.name },
              { translateProps: true }
            )}
          </p>
        </Row>
        <Row className={`${styles.align__text_left} ${styles.highlight}`}>
          <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
        </Row>
        <Row className={styles.align__text_left}>
          <h4 className={`${styles.titlechildren} mt-3`}>{t("I-B")}</h4>
          {!!current_company?.is_current && (
            <>
              <b>
                <h5
                  className={`${styles.paragraph} ${styles.align__text_left}`}
                >
                  {t("CURENNT_COMPANY_DATA")}
                </h5>
              </b>
              {current_company?.name && (
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                  {t(
                    "CURENNT_COMPANY_{name}",
                    { name: current_company?.name },
                    { translateProps: true }
                  )}
                </p>
              )}
              {current_company?.address && (
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                  {t(
                    "CURENNT_COMPANY_{address}",
                    { address: current_company?.address },
                    { translateProps: true }
                  )}
                </p>
              )}
              {current_company?.phone && (
                <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                  {t(
                    "CURENNT_COMPANY_{phone}",
                    { phone: current_company?.phone },
                    { translateProps: true }
                  )}
                </p>
              )}
              {current_company?.manager_name && (
                <p
                  className={`${styles.paragraph} ${styles.align__text_left} bg-danger text-light w-75`}
                >
                  {t(
                    "DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}",
                    { current_manager_name: current_company?.manager_name },
                    { translateProps: true }
                  )}
                </p>
              )}

              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                {t("BLANK_LINE")}
              </p>
            </>
          )}
        </Row>
        <Row className={styles.align__text_left}>
          {applicant?.employers
            .filter((e) => !!e.name)
            ?.map(
              (v) =>
                !!!v.is_current && (
                  <>
                    <b>
                      <h5
                        className={`${styles.paragraph} ${styles.align__text_left}`}
                      >
                        {t("PAST_COMPANY_DATA")}
                      </h5>
                    </b>
                    <p
                      className={`${styles.paragraph} ${styles.align__text_left}`}
                    >
                      {t(
                        "CURENNT_COMPANY_{name}",
                        { name: v?.name ? v.name : `${t("N/A")}` },
                        { translateProps: true }
                      )}
                    </p>
                    <p
                      className={`${styles.paragraph} ${styles.align__text_left}`}
                    >
                      {t(
                        "CURENNT_COMPANY_{address}",
                        { address: v?.address ? v.address : `${t("N/A")}` },
                        { translateProps: true }
                      )}
                    </p>
                    <p
                      className={`${styles.paragraph} ${styles.align__text_left}`}
                    >
                      {t(
                        "CURENNT_COMPANY_{phone}",
                        { phone: v?.phone ? v?.phone : `${t("N/A")}` },
                        { translateProps: true }
                      )}
                    </p>
                    <p
                      className={`${styles.paragraph} ${styles.align__text_left} bg-danger text-light w-75`}
                    >
                      {t(
                        "DESIGNATED_EMPLOYER_REPRESENTATIVE_{current_manager_name}",
                        {
                          current_manager_name: v?.manager_name
                            ? v?.manager_name
                            : `${t("N/A")}`,
                        },
                        { translateProps: true }
                      )}
                    </p>
                    <p
                      className={`${styles.paragraph} ${styles.align__text_left}`}
                    >
                      {t("BLANK_LINE")}
                    </p>
                  </>
                )
            )}
        </Row>

        <Row className={`${styles.align__text_left} ${styles.highlight}`}>
          <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
        </Row>
        <Row
        //  className={styles.blur}
        >
          <Row className={styles.align__text_left}>
            <Col>
              <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>
                {t("SECTION_II")}
              </h3>
            </Col>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("TO_BE_COMPLETED")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <Col>
              <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>
                {t("II_A_ACCIDENT_HISTORY")}
              </h4>
            </Col>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("THE_APPLICANT_NAMED_ABOVE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("EMPLOYES_AS___________________________")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("DID_HE/SHE_DRIVE_MOTOR_VEHICLE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("REASON_FOR_LEAVING_YOUR_EMPLOY")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("IF_THERE_IS_NO_SAFETY")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("THE_APPLICANT_NAMED_ABOVE_WAS")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("ACCIDENTAL_COMPLETE_THE_FOLLOWING")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("COLUMNS")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("1")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("2")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("3")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("INFORMATION_CONCERNING_OTHER_ACCIDENTS")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("ANY_OTHER_MARK")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <Col>
              <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>
                {t("II_B")}
              </h4>
            </Col>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("DOT_REGULATED_TESTING")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_ALCOHOL_TEST")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_VERIFIED_DRUG_TEST")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_REFUSE_TESTED")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_OTHER_VIOLATIONS_DOT_AGENCY")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_PREVIOUS_OWNER_REPORT_VIOLATION")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("QUESTION_RETURN_TO_DUTY")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("NOTE_PREVIOUS_EMPLOYER_REPORT")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <Col>
              <h4 className={`${styles.paragraph} ${styles.align__text_left}`}>
                {t("II_C")}
              </h4>
            </Col>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("NAME_OF_PERSON_ABOVE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE_TITLE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE_PHONE")}
            </p>
          </Row>
          <Row className={styles.align__text_left}>
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t("BLANK_LINE_DATE")}
            </p>
          </Row>
        </Row>
      </Form>
    </>
  );
}

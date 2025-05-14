import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import OtpInputField from "react-otp-input";
import { ToastContainer, toast } from "react-toastify";
import JotformContext, {
  JotFormContextType,
} from "../../../../../context/jotform-context";
import { ApplicantExtras } from "../../../../../enums/applicants/applicant-extras.enum";
import { MessageStatus } from "../../../../../enums/conversation/message-status.enum";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ApplicantOTPEntity } from "../../../../../models/applicant/applicant-otp.entity";
import { PhoneNumberDto } from "../../../../../models/jot-form/short-form/phone-number.dto";
import ApplicantApi from "../../../../../pages/api/applicant";
import styles from "../../../../../styles/digitalhiringapp.module.css";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { LoaderIcon } from "../../../../loading/loader-icon";
import ViewModal from "../../../../view-details/view-modal";
import BaseInputPhone from "../../../base-input-phone";
import { socketInitializer } from "./socketInitializer";

export function PhoneNumber() {
  const {
    state: { applicant, companyJobs, steps },
    method: {
      setApplicant,
      setSteps,
      stepNext,
      stepBack,
      // setApplicantExtras
    },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [showOtpField, seShowtOtpField] = useState<boolean>(false);
  const [otpApplicant, setOtpApplicant] = useState<ApplicantOTPEntity>(null);
  const [otpException, setOtpException] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const form = useFormik({
    initialValues: new PhoneNumberDto(),
    validationSchema: PhoneNumberDto.yupSchema(),
    onSubmit: async (values, { setErrors }) => {
      try {
        const { phone } = values;
        const applicantApi = new ApplicantApi();
        const applicantPhoneExists = await applicantApi.searchByPublic({
          phone,
        });

        if (applicantPhoneExists) {
          setOpenModal(true);
        } else {
          setApplicant({
            ...applicant,
            phone,
          });
          stepNext();
        }
      } catch (error) {
        console.log("error", error);
      }
    },
    onReset: (values) => {
      companyJobs.length > 0 ? stepBack() : setSteps(steps - 2);
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      phone: applicant.phone,
    });
  }, []);

  const verifyOTP = async () => {
    const applicantApi = new ApplicantApi();
    const applicantId = otpApplicant?.applicantId;

    try {
      const applicantExistingProfile = await applicantApi.verifyOTP({
        applicantId,
        otp,
      });
      setApplicant(applicantExistingProfile);
      setOpenModal(false);
      stepNext();
    } catch (error) {
      globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
      setOtpException(true);
    }
  };

  const handleLeavePreviousProfile = () => {
    setOpenModal(false);
    setApplicant({
      ...applicant,
      phone: form.values.phone,
    });
    stepNext();
  };

  const onCloseClick = () => {
    setOpenModal(false);
  };

  const requestOTP = async () => {
    setIsResending(true);
    setOtpException(false);
    const applicantApi = new ApplicantApi();
    const { phone } = form.values;
    try {
      const OTPresponse = await applicantApi.requestOTP({ phone });
      setOtpApplicant(OTPresponse);
      seShowtOtpField(true);
    } catch (error) {
      console.log("errors", error);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const typesToExclude = [
      ApplicantExtras.SIGNATURE,
      ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
      ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
      ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
      ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
    ];

    const filteredSignature = applicant?.extras.filter(
      (v) => !typesToExclude.includes(v.type)
    );
    // if (!!applicant?.extras) setApplicantExtras([...filteredSignature])
  }, [applicant]);

  useEffect(() => {
    if (
      Boolean(otpApplicant?.applicant?.id) ||
      Boolean(otpApplicant?.applicantId)
    ) {
      console.log("socketInitializer");

      socketInitializer(
        otpApplicant?.applicantId || applicant?.id,
        ({ error_message, status, expiry }) => {
          if (expiry == new Date(otpApplicant?.expiry).toISOString()) {
            console.log("SmsStatus", {
              error_message,
              status,
              expiry,
            });
            if (Boolean(error_message)) {
              toast.error(t("UNABLE_TO_SEND_OTP"));
            }
            if (status == MessageStatus.SENT) {
              toast(t("OTP_MESSAGES_SENT"));
            }
            if (status == MessageStatus.DELIVERED) {
              toast.success(t("OTP_MESSAGES_DELIVERED"));
            }
          }
        }
      );
    }
  }, [otpApplicant, applicant]);

  return (
    <>
      <ToastContainer />
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t("phone")}
      </h1>

      <div className="mb-4">
        <Alert variant="light" className="border">
          <h5 className="mb-3">Why we need your phone number:</h5>

          <div className="d-flex align-items-start mb-3">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-phone-square text-primary"
                style={{ fontSize: "24px" }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>Job Updates</strong>
              <p className="mb-0">
                We'll send you important updates about this job opportunity and
                interview requests.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-start mb-3">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-shield text-primary"
                style={{ fontSize: "24px" }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>Secure Account Access</strong>
              <p className="mb-0">
                Your phone helps us verify it's really you when accessing your
                application.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-start">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-bell text-primary"
                style={{ fontSize: "24px" }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>Job Alerts</strong>
              <p className="mb-0">
                You'll have the option to receive notifications about new
                driving opportunities that match your experience.
              </p>
            </div>
          </div>

          <p className="mt-3 mb-0 text-muted font-italic">
            Your information is kept private and secure. Standard message rates
            may apply.
          </p>
        </Alert>
      </div>

      <ViewModal
        show={openModal}
        title={t("Existing Account Found")}
        size="lg"
        onCloseClick={onCloseClick}
        footer={
          <Row className="mt-5 w-100">
            <Col className="d-flex justify-content-end">
              <Button
                className="btn-secondary mx-2"
                onClick={handleLeavePreviousProfile}
              >
                {t("Start Fresh")}
              </Button>

              {showOtpField ? (
                <Button onClick={verifyOTP} className="btn-primary">
                  {t("Verify Code")}
                </Button>
              ) : (
                <Button onClick={requestOTP} className="btn-primary">
                  {t("Access Existing Profile")}
                </Button>
              )}
            </Col>
          </Row>
        }
      >
        <div>
          {showOtpField ? (
            <>
              <Alert variant="info" className="mb-4">
                <h5 className="mb-2">{t("Verification Code Sent")}</h5>
                <p className="mb-0">
                  {t(
                    "We've sent a 6-digit verification code to your phone number. Please enter it below to access your existing profile."
                  )}
                </p>
              </Alert>

              <div className="w-100 d-flex flex-column align-items-center mt-4 mb-4">
                <label className="mb-2 font-weight-bold">
                  {t("Enter your 6-digit code:")}
                </label>
                <OtpInputField
                  inputStyle={{
                    width: "40px",
                    height: "40px",
                    margin: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    fontSize: "24px",
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "#000",
                  }}
                  renderInput={(props) => <input {...props} />}
                  value={otp}
                  onChange={(e) => setOtp(e)}
                  shouldAutoFocus
                  numInputs={6}
                  renderSeparator={<span>-</span>}
                />
              </div>
              {otpException && (
                <Alert variant="warning" className="text-center">
                  <p className="mb-0">
                    {t("The code you entered is incorrect or has expired.")}
                    <br />
                    <Button
                      variant="link"
                      className="p-0 ml-1 text-primary"
                      onClick={requestOTP}
                      disabled={isResending}
                    >
                      {isResending ? t("Sending...") : t("Send a new code")}
                    </Button>
                  </p>
                </Alert>
              )}
            </>
          ) : (
            <>
              <Alert variant="info" className="mb-4">
                <h5 className="mb-2">
                  {t("We Found Your Previous Application")}
                </h5>
                <p className="mb-0">
                  {t(
                    "This phone number is already associated with an existing application in our system."
                  )}
                </p>
              </Alert>

              <div className="text-center mb-4">
                <h5>{t("You have two options:")}</h5>
                <div className="d-flex justify-content-center mt-4">
                  <div
                    className="text-center mx-3 p-3 border rounded"
                    style={{
                      width: "250px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    onClick={requestOTP}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <h6 className="font-weight-bold text-primary">
                      {t("Access Existing Profile")}
                    </h6>
                    <p className="text-muted">
                      {t(
                        "Continue with your previous information. We'll send a verification code to your phone."
                      )}
                    </p>
                  </div>
                  <div
                    className="text-center mx-3 p-3 border rounded"
                    style={{
                      width: "250px",
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    onClick={handleLeavePreviousProfile}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f8f9fa";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.boxShadow =
                        "0 2px 4px rgba(0,0,0,0.05)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <h6 className="font-weight-bold text-primary">
                      {t("Start Fresh")}
                    </h6>
                    <p className="text-muted">
                      {t("Begin a new application with this phone number.")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ViewModal>
      <Form
        className={styles.align__text_left}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <Row className="w-100 d-flex justify-content-center">
          <BaseInputPhone
            className="col-md-6 my-3 font-weight-bold"
            required
            name="phone"
            label="Phone Number"
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

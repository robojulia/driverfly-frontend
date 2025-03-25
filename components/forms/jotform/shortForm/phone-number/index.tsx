import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
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

    const form = useFormik({
        initialValues: new PhoneNumberDto(),
        validationSchema: PhoneNumberDto.yupSchema(),
        onSubmit: async (values, { setErrors }) => {
            try {
                const { phone } = values;
                const applicantApi = new ApplicantApi();
                // const applicantEmailExists = await applicantApi.searchByPublic({ email })
                const applicantPhoneExists = await applicantApi.searchByPublic({
                    phone,
                });

                if (applicantPhoneExists) {
                    setOpenModal(true);
                    // } else if (applicantPhoneExists) {
                    // 	setErrors({ phone: 'ALREADY_EXISTS' })
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
            companyJobs.length > 0 ? stepBack() : setSteps(steps - 2)
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
        setOtpException(false);
        const applicantApi = new ApplicantApi();
        const { phone } = form.values;
        try {
            const OTPresponse = await applicantApi.requestOTP({ phone });
            setOtpApplicant(OTPresponse);
            seShowtOtpField(true);
        } catch (error) {
            console.log("errors", error);
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
            <ViewModal
                show={openModal}
                title="NUMBER_ALREADY_EXISTS"
                size="lg"
                onCloseClick={onCloseClick}
                footer={
                    <Row className="mt-5 w-100">
                        <Col>
                            <Button
                                className="float-right"
                                onClick={handleLeavePreviousProfile}
                            >
                                {t("NO")}
                            </Button>
                        </Col>

                        <Col>
                            {showOtpField ? (
                                <Button
                                    onClick={verifyOTP}
                                    className="float-left theme-secondary-btn"
                                >
                                    {t("SUBMIT")}
                                </Button>
                            ) : (
                                <Button
                                    onClick={requestOTP}
                                    className="float-left theme-secondary-btn"
                                >
                                    {t("PROCEED")}
                                </Button>
                            )}
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
                                <p className="text-center">
                                    {t("OTP_EXCEPTION_MESSAGE")}
                                    <a
                                        role="button"
                                        className="text-primary"
                                        onClick={requestOTP}
                                    >
                                        {t("RESEND")}
                                    </a>
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <h3 className="text-center text-warning">
                                {t("ALREADY_AN_APPLICANT")}
                            </h3>
                            <h5 className="text-center">
                                {t("DO_YOU_WISH_TO_PROCEED_WITH_PREVIOUS_PROFILE")}
                            </h5>
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
                        label="ENTER_PHONE_NUMBER"
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

import { useFormik } from "formik";
import { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import VoeFormContext, { VoeFormContextType } from "../../../../context/voeform-context";
import { AccidentHistoryDto } from "../../../../models/jot-form/voe-form/accident-history.dto";
import styles from "../../../../styles/voe.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";
import { ApplicantVoeFormEnum } from "../../../../enums/applicants/applicant-voe-form.enum";
import { ApplicantVoeFormEntity } from "../../../../models/applicant/applicant-voe-form.entity";
import BaseInputPhone from "../../base-input-phone";
import { EmployedByUs } from "./employed-by-us";

export function ViewVOEdetails() {
    const {
        state: { applicantVoe, applicant },
        method: { stepNext, stepBack, updateApplicantVoe },
    }: VoeFormContextType = useContext(VoeFormContext);

    const { t } = useTranslation();
    const form = useFormik({
        initialValues: {},
        onSubmit: (values) => {

        },
        onReset: (values) => {
            stepBack();
        },
    });
    useEffect(() => {
        const apx = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.WAS_EMPLOYED_AS
        );
        const apx_did_drive = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU
        );
        const apx_safety_performance = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
        );
        const apx_accident_details = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
        );
        const apx_report_to_govt = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT
        );
        const apx_reason_to_leave = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT
        );
        const sender_info = applicantVoe?.find(
            (v) => v.type === ApplicantVoeFormEnum.SENDER_INFO
        );

        form.setValues({
            ...form.values,
            WAS_EMPLOYED_AS: !!apx?.type
                ? apx
                : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.WAS_EMPLOYED_AS),
            SENDER_INFO: !!sender_info?.type
                ? sender_info
                : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.SENDER_INFO),
            DID_DRIVE_FOR_YOU: !!apx_did_drive?.type
                ? apx_did_drive
                : new ApplicantVoeFormEntity(ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU),
            SAFETY_PERFORMANCE_HISTROY_REPORT: !!apx_safety_performance?.type
                ? apx_safety_performance
                : new ApplicantVoeFormEntity(
                    ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT
                ),
            REGISTERED_ACCIDENTS_DETAILS: !!apx_accident_details?.type
                ? apx_accident_details
                : new ApplicantVoeFormEntity(
                    ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS
                ),
            ACCIDENT_REPORTED_TO_GOVERNMENT: !!apx_report_to_govt?.type
                ? apx_report_to_govt
                : new ApplicantVoeFormEntity(
                    ApplicantVoeFormEnum.ACCIDENT_REPORTED_TO_GOVERNMENT
                ),
            REASON_TO_LEAVE_EMPLOYMENT: !!apx_reason_to_leave?.type
                ? apx_reason_to_leave
                : new ApplicantVoeFormEntity(
                    ApplicantVoeFormEnum.REASON_TO_LEAVE_EMPLOYMENT
                ),

        });

    }, [applicantVoe]);

    useEffect(() => {
        console.log("voe data", applicant.voeData)
        console.log("voe sender", sender_info)
    }, []);
    const signature = applicantVoe?.find(
        v => v.type === ApplicantVoeFormEnum.SIGNATURE_VOE
    )
    const employed_by_us = applicant?.voeData?.find(v => v.type === ApplicantVoeFormEnum.EMPLOYED_BY_US)
    const did_drive = applicant?.voeData?.find(v => v.type === ApplicantVoeFormEnum.DID_DRIVE_FOR_YOU)
    const safety_performance = applicant?.voeData?.find(v => v.type === ApplicantVoeFormEnum.SAFETY_PERFORMANCE_HISTROY_REPORT)
    const accident_register = applicant?.voeData?.find(v => v.type === ApplicantVoeFormEnum.REGISTERED_ACCIDENTS_DETAILS)
    const sender_info = applicant?.voeData?.find(v => v.type === ApplicantVoeFormEnum.SENDER_INFO)
    return (
        <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
            <Row>
                <h4 className={styles.carrierName}>{t("VOE_SUBMIT_DETAILS")}</h4>
            </Row>
            <Row className="pt-2">
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <span className="text-dark">
                        {t(
                            "{applicantName}_EMPLOYED_BY_US",
                            {
                                applicantName: `${applicant?.first_name} ${applicant?.last_name}`
                            },
                            { translateProps: true }
                        )}


                    </span>
                    <span className="text-dark ml-2">
                        {!!employed_by_us?.value ? t('YES') : t('NO')}
                    </span>
                </div>

            </Row>
            <Row className="pt-2">
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <span className="text-dark">
                        {t("VOE_DRIVER_QUES")}
                    </span>
                    <span className="text-dark ml-2">
                        {!!did_drive?.value ? t('YES') : t('NO')}
                    </span>
                </div>

            </Row>
            <Row className="pt-2">
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <span className="text-dark">
                        {t("SAFETY_PERFORMANCE_REPORT")}
                    </span>
                    <span className="text-dark ml-2">
                        {!!safety_performance?.value ? t('YES') : t('NO')}
                    </span>
                </div>

            </Row>
            <Row className="pt-2">
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <span className="text-dark">
                        {t("SAFETY_PERFORMANCE_REPORT")}
                    </span>
                    <span className="text-dark ml-2">
                        {!!accident_register?.value ? t('YES') : t('NO')}
                    </span>
                </div>

            </Row>
            <Row className="pt-2">
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <BaseInput
                        className="col my-3 p-0"
                        name="WAS_EMPLOYED_AS.value.position"
                        label={t(
                            "{applicantName}_WAS_EMPLOYED_AS",
                            {
                                applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
                            },
                            { translateProps: true }
                        )}
                        placeholder="POSITION"
                        formik={form}
                        readOnly
                    />
                </div>
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <BaseInput
                        className="col my-3 p-0"
                        name="WAS_EMPLOYED_AS.value.start_date"
                        label="START_DATE"
                        type="date"
                        formik={form}
                        placeholder="MM/YY"
                        readOnly
                    />
                </div>
                <div className={`${styles.align__text_left} ${styles.bold}`}>
                    <BaseInput
                        className="col my-3 p-0"
                        name="WAS_EMPLOYED_AS.value.end_date"
                        type="date"
                        label="END_DATE"
                        formik={form}
                        placeholder="MM/YY"
                        readOnly
                    />
                </div>
            </Row>

            <Row
                className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
            >
                <BaseTextArea
                    className="float-left my-2 col"
                    name="DID_DRIVE_FOR_YOU.value"
                    label="TYPE_OF_VEHICLE"
                    formik={form}
                    readOnly
                />
            </Row>


            <Row
                className={`${styles.align__text_left} ${styles.bold} ${styles.paragraph}`}
            >
                <BaseTextArea
                    className="float-left col my-3"
                    name="ACCIDENT_REPORTED_TO_GOVERNMENT.value"
                    label="OTHER_GOV_REPORTED_ACCIDENTS"
                    formik={form}
                    readOnly
                />
            </Row>
            <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <BaseSelect
                    className="col my-3"
                    required
                    labelPrefix="ReasonsForLeavingEmployment"
                    enumType={ReasonsForLeavingEmployment}
                    name="REASON_TO_LEAVE_EMPLOYMENT.value"
                    placeholder="CHOOSE"
                    label="REASONS_FOR_LEAVING_EMPLOYMENT"
                    formik={form}
                    readOnly
                />
            </Row>


            <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <BaseInput
                    className="my-3 float-left col-md-6"
                    label="FULL_NAME"
                    name="SENDER_INFO.value.name"
                    formik={form}
                    readOnly
                />
                <BaseInput
                    className="my-3 float-left col-md-6"
                    label="TITLE"
                    name="SENDER_INFO.value.title"
                    formik={form}
                    readOnly
                />
            </Row>
            <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <BaseInputPhone
                    className="my-3 float-left col-md-6"
                    label="PHONE"
                    name="SENDER_INFO.value.phone"
                    formik={form}
                    readOnly
                />
                <BaseInput
                    className="my-3 float-left col-md-6"
                    label="EMAIL"
                    name="SENDER_INFO.value.email"
                    formik={form}
                    readOnly
                />
            </Row>

            <Row className={`${styles.align__text_left} ${styles.bold}`}>
                <BaseInput
                    className="my-3 float-left col"
                    label="DATE"
                    name="SENDER_INFO.value.date"
                    type="date"
                    formik={form}
                    readOnly
                />
            </Row>
            <Row className={`${styles.align__text_left} ml-2`}>
                {
                    !!signature?.value ? <img src={signature?.value} style={{ width: '300px', height: '200px', border: '1px solid black' }} alt="image" /> : ''
                }
            </Row>
        </Form>
    );
}

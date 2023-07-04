import React, { useEffect, useContext, useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useFormik } from "formik";
import OtpInputField from 'react-otp-input';
import { toast, ToastContainer } from "react-toastify";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseInputPhone from "../../base-input-phone";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import ApplicantApi from "../../../../pages/api/applicant";
import { LoaderIcon } from "../../../loading/loader-icon";
import ViewModal from "../../../view-details/view-modal";
import { PhoneNumberDto } from "../../../../models/jot-form/short-form/phone-number.dto";
import { ApplicantOTPEntity } from "../../../../models/applicant/applicant-otp.entity";
import { globalAjaxExceptionHandler } from "../../../../utils/ajax";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import JobApi from "../../../../pages/api/job";
import { useEffectAsync } from "../../../../utils/react";
import { JobEntity } from "../../../../models/job/job.entity";
import BaseCheck from "../../base-check";
import { AtsJobDto } from "../../../../models/jot-form/short-form/ats-job.dto";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import CompanyApi from "../../../../pages/api/company";
import { Title } from "../../../filters/search";


export function AtsJobs() {

    const {
        state: { applicant },
        method: { setApplicant, stepNext, stepBack, setApplicantExtras },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();
    const [jobs, setJobs] = useState<JobEntity[]>([])

    const [jobCount, setJobCount] = useState<number>(null)

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const setOpen = () => setIsOpen(true)
    const setClose = () => setIsOpen(false)

    const [options, setOptions] = useState<Title[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const form = useFormik({
        initialValues: new AtsJobDto(),
        validationSchema: AtsJobDto.yupSchema(),
        onSubmit: async (values, { setErrors }) => {
            try {
                // const { phone } = values;
                // const applicantApi = new ApplicantApi()
                // // const applicantEmailExists = await applicantApi.searchByPublic({ email })
                // const applicantPhoneExists = await applicantApi.searchByPublic({ phone })

                // if (applicantPhoneExists) {
                //     setOpenModal(true)
                //     // } else if (applicantPhoneExists) {
                //     // 	setErrors({ phone: 'ALREADY_EXISTS' })
                // } else {
                //     setApplicant({
                //         ...applicant,
                //         phone,
                //     });

                //     stepNext();
                // }
            } catch (error) {
                console.log("error", error);
            }
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffectAsync(async () => {
        if (applicant?.company?.id) {
            const jobApi = new JobApi()
            const { items } = await jobApi.search({ companyId: applicant.company.id })
            setJobs(items)
        }
    }, [applicant?.company?.id]);

    useEffectAsync(async () => {
        if (applicant?.company?.id && form.values.applying_for_job) {
            const companyApi = new CompanyApi()
            const counts = await companyApi.employer.getJobCount(applicant.company.id)
            // if (!Boolean(count)) stepNext()
            setJobCount(counts > 0 ? counts : -1)
        }
    }, [form.values.applying_for_job]);

    useEffectAsync(async () => {
        console.log("jobCount", jobCount);
    }, [jobCount]);

    return (
        <>
            <Form
                className={styles.align__text_left}
                onSubmit={form.handleSubmit}
                onReset={form.handleReset}
            >
                <Row className="w-100 d-flex justify-content-center mb-2 mt-4 ">
                    <strong>
                        <em>
                            <h5 className="text-dark text-center" >
                                {t("are_you_applying_to_particular_job")}
                            </h5>
                        </em>
                    </strong>
                </Row>
                <Row className="w-100 d-flex justify-content-center">
                    <BaseCheck
                        disabled={jobCount == -1}
                        className="col-md-6 my-3"
                        required
                        name="applying_for_job"
                        formik={form}
                    />
                </Row>
                <Row className="w-100 d-flex justify-content-center">
                    <Col md="6">
                        {jobCount > 0 && <>
                            <label className={"heading-label my-4"}>{t('SEARCH_KEYWORD')} </label>
                            <AsyncTypeahead
                                // ref={typeaheadRef}
                                // defaultInputValue={filters.keywords || searchQuery || ""}
                                id="keywords-typeahead"
                                open={!!isOpen}
                                isLoading={isLoading}
                                labelKey="title"
                                minLength={0}
                                // onFocus={generalEventHandler}
                                // onBlur={generalEventHandler}
                                // onChange={optionChangehandler}
                                // onInputChange={inputChangeHandler}
                                // onKeyDown={keyDownHandler}
                                // onSearch={inputChangeHandler}
                                options={options}
                                placeholder={t("KEYWORD_PLACEHOLDER")}
                            // renderMenu={renderMenu}
                            />
                        </>}
                        {
                            jobCount == -1
                            && <label className={"heading-label my-4"}>{t('JOB_NOT_FOUND')} </label>
                        }
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col>
                        <Button className="float-right" type="reset">
                            {t("BACK")}
                        </Button>
                    </Col>

                    <Col>
                        <Button
                            disabled={(form.isValidating || form.isSubmitting || !form.isValid)}
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

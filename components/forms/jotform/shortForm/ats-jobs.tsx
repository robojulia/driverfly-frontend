import React, { useContext, useState } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useFormik } from "formik";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import JotformContext, { JotFormContextType } from "../../../../context/jotform-context";
import { LoaderIcon } from "../../../loading/loader-icon";
import JobApi from "../../../../pages/api/job";
import { useEffectAsync } from "../../../../utils/react";
import { JobEntity } from "../../../../models/job/job.entity";
import BaseCheck from "../../base-check";
import { AtsJobDto } from "../../../../models/jot-form/short-form/ats-job.dto";
import { PagingMetaProps } from "../../../../utils/job-filter";

export function AtsJobs() {

    const {
        state: { applicant, jobs },
        method: { setJobs, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const jobApi = new JobApi()
    const { t } = useTranslation();

    const [companyJobs, setCompanyJobs] = useState<{ items: JobEntity[], meta: PagingMetaProps }>(null)
    const [jobCount, setJobCount] = useState<number>(null)

    const form = useFormik({
        initialValues: new AtsJobDto(),
        validationSchema: AtsJobDto.yupSchema(),
        onSubmit: async ({ jobId }) => {
            if (Boolean(jobId)) setJobs([{ id: jobId }])

            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffectAsync(async () => {
        if (form.values?.applying_for_job) {
            const response = await jobApi.search({ companyId: applicant.company.id })
            setCompanyJobs(response)
            setJobCount(response?.items?.length > 0 ? response?.items?.length : -1)
        } else {
            form.setFieldValue('jobId', null)
            setJobCount(0)
        }
    }, [form.values?.applying_for_job]);

    useEffectAsync(async () => {
        const job = jobs?.find(v => v?.id)
        form.setFieldValue("jobId", job?.id)
        form.setFieldValue("applying_for_job", Boolean(job?.id))
    }, [jobs]);

    // useEffectAsync(async () => {
    //     console.log("form.values", form.values);
    //     console.log("form.errors", form.errors);
    // }, [form.values, form.errors]);

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
                            <label className={"heading-label my-4"}>{t('POSITION')} </label>
                            {companyJobs?.items?.map(job => (
                                <BaseCheck
                                    key={job.id}
                                    label={job.title}
                                    checked={form.values.jobId == job.id}
                                    onChange={() => form.setFieldValue('jobId', job.id)}
                                />
                            ))}
                        </>}
                        {
                            (jobCount == -1)
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

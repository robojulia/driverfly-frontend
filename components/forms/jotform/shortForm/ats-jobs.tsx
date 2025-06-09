import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { AtsJobDto } from '../../../../models/jot-form/short-form/ats-job.dto';
import { FormActions } from '../form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { useEffectAsync } from '../../../../utils/react';
import { LoaderIcon } from '../../../loading/loader-icon';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { JobSelect, JobDetails, InfoCard, FormLabel, RadioGroup } from '../../../shared/dha';

export function AtsJobs() {
  const {
    state: { applicant, jobs, companyJobs },
    method: { setJobs, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const [jobCount, setJobCount] = useState<number>(null);

  const form = useFormik({
    initialValues: new AtsJobDto(),
    validationSchema: AtsJobDto.yupSchema(),
    onSubmit: async ({ jobId }) => {
      if (Boolean(jobId)) {
        setJobs([...jobs, { id: jobId }]);
      }
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffectAsync(async () => {
    if (form.values?.applying_for_job) {
      setJobCount(companyJobs?.length > 0 ? companyJobs?.length : -1);
    } else {
      form.setFieldValue('jobId', null);
      setJobCount(0);
    }
  }, [companyJobs, form.values?.applying_for_job]);

  useEffectAsync(async () => {
    const job = jobs?.find((v) => companyJobs?.find((cjob) => cjob.id == v.id));
    form.setValues({
      applying_for_job: Boolean(job?.id),
      jobId: job?.id,
    });
  }, [jobs]);

  const handleNext = async () => {
    const { jobId } = form.values;
    if (Boolean(jobId)) {
      setJobs([...jobs, { id: jobId }]);
    }
    stepNext();
  };

  const handleBack = () => {
    stepBack();
  };

  const isFormValid =
    !form.isValidating &&
    !form.isSubmitting &&
    form.isValid &&
    (Boolean(form.values.applying_for_job) && Boolean(jobCount > 0)
      ? Boolean(form.values.applying_for_job) && Boolean(form.values.jobId)
      : true);

  const selectedJob = companyJobs?.find((job) => job.id == form.values.jobId);

  // Define radio group value clearly
  const getRadioGroupValue = () => {
    if (form.values.applying_for_job === true) {
      return BooleanType.YES;
    }
    if (form.values.applying_for_job === false) {
      return BooleanType.NO;
    }
    return undefined;
  };

  const radioGroupValue = getRadioGroupValue();

  const handleApplyingForJobChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
    }
    form.setFieldValue('applying_for_job', newValue);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('COMPANY_JOBS')}
      </h1>
      <Form
        className={styles.align__text_left}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="my-4">
            <RadioGroup
              name="applying_for_job"
              label={t('are_you_applying_to_particular_job')}
              enumType={BooleanType}
              value={radioGroupValue}
              onChange={handleApplyingForJobChange}
              disabled={jobCount === -1}
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
            />
          </div>
        </div>

        <Row className="w-100 d-flex">
          <Col md="12">
            {jobCount > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <FormLabel>{t('POSITION')}:</FormLabel>
                <JobSelect
                  jobs={companyJobs}
                  selectedJobId={form.values.jobId}
                  onJobSelect={(jobId) => form.setFieldValue('jobId', jobId)}
                  placeholder={t('SELECT_POSITION')}
                />
              </div>
            )}
            {jobCount == -1 && (
              <label className={'heading-label my-4'}>{t('JOB_NOT_FOUND')} </label>
            )}

            {/* General Application Pool Message */}
            {form.values.applying_for_job === false && (
              <InfoCard
                title="General Application"
                message="You'll be added to this company's general application pool. The company's hiring team will review your profile."
                variant="info"
              />
            )}
          </Col>
        </Row>

        {/* Job Details Section */}
        {selectedJob && <JobDetails job={selectedJob} />}

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          nextButtonText={
            <>
              {t('NEXT')} <LoaderIcon isLoading={!!form?.isSubmitting} />
            </>
          }
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

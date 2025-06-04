import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import React, { useContext, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from '../../../../hooks/use-translation';
import { HearAboutUsDto } from '../../../../models/jot-form/short-form/hear-about.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { HearAboutUsType } from '../../../../enums/jotform/hear-about-type.enum';
import ApplicantApi from '../../../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../../../utils/ajax';
import { FormActions } from '../form-buttons';
import { Input, Select } from '../../../shared/dha';

export function HearAbout() {
  const {
    state: { applicantExtras, applicant, jobs, utm, company },
    method: { setApplicantExtras, stepNext, stepBack, setApplicant },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new HearAboutUsDto(),
    validationSchema: HearAboutUsDto.yupSchema(),
    onSubmit: async (values) => {
      const applicantApi = new ApplicantApi();
      const { HEAR_ABOUT_US, REFERAL_NAME } = values;
      if (applicant?.can_pass_drug_test) {
        try {
          const filteredExtras = [
            ...applicantExtras,
            { ...HEAR_ABOUT_US },
            { ...REFERAL_NAME },
          ].filter((v) => !!v?.value);

          const data = await applicantApi.jotform.create(company.id, {
            applicant,
            applicantExtras: filteredExtras,
            jobs,
            utm,
          });
          setApplicantExtras(data?.extras);
          setApplicant({
            ...applicant,
            ...data,
          });

          stepNext();
        } catch (error) {
          console.log(error);
          globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
        }
      } else {
        stepNext();
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find((v) => v.type === ApplicantExtras.HEAR_ABOUT_US);
    const apx_referal_name = applicantExtras?.find((v) => v.type === ApplicantExtras.REFERAL_NAME);

    const hearAboutObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
      value: Boolean(utm?.referral_name) ? HearAboutUsType.REFERRAL : null,
    };

    const referalNameObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.REFERAL_NAME),
      value: Boolean(utm?.referral_name) ? utm?.referral_name : null,
    };

    form.setValues({
      ...form.values,
      HEAR_ABOUT_US: !!apx?.type ? apx : hearAboutObject,
      REFERAL_NAME: !!apx_referal_name?.type ? apx_referal_name : referalNameObject,
    });
  }, [applicantExtras]);

  useEffect(() => {
    console.log('form values', form.values);
    console.log('form error', form.errors);
  }, [form.values, form.errors]);

  const handleNext = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleSubmit(syntheticEvent);
  };

  const handleBack = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleReset(syntheticEvent);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('HOW_DID_YOU_HEAR_ABOUT_US')}
      </h1>

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto 2rem auto',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e5eb',
          borderRadius: '8px',
          color: '#667788',
          fontSize: '0.95rem',
          lineHeight: '1.5',
        }}
      >
        <p style={{ margin: 0 }}>{t('HEAR_ABOUT_US_HELP_TEXT')}</p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '800px', margin: '0' }}>
          <Select
            name="HEAR_ABOUT_US.value"
            label="Select an option"
            placeholder="CHOOSE"
            labelPrefix="HearAboutUsType"
            enumType={HearAboutUsType}
            value={form.values?.HEAR_ABOUT_US?.value || ''}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={
              form.touched?.HEAR_ABOUT_US?.value && form.errors?.HEAR_ABOUT_US?.value
                ? String(form.errors.HEAR_ABOUT_US.value)
                : undefined
            }
            disabled={Boolean(utm?.referral_name)}
            required
          />

          {form.values?.HEAR_ABOUT_US?.value === HearAboutUsType.REFERRAL && (
            <Input
              name="REFERAL_NAME.value"
              label={t('REFERRAL_NAME')}
              placeholder={t('REFERRAL_NAME')}
              value={form.values?.REFERAL_NAME?.value || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched?.REFERAL_NAME?.value && form.errors?.REFERAL_NAME?.value
                  ? String(form.errors.REFERAL_NAME.value)
                  : undefined
              }
              disabled={Boolean(utm?.referral_name)}
              required
              autoComplete="name"
              helperText="Please provide the name of the person who referred you"
            />
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={form.isValid && !form.isValidating}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

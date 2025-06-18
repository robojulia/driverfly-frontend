import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { DriverApplicationDto } from '../../../../models/jot-form/long-form/driver-application.dto';
import { PrimaryButton } from '../form-buttons';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { SignatureComponent } from '../../signature';
import { Input, DateInput } from '../../../shared/dha';

export interface DriverApplicationProps {
  isAutoRecruitmentLead?: boolean | (() => boolean);
}

export function DriverApplication({ isAutoRecruitmentLead }: DriverApplicationProps) {
  const {
    state: { applicant, applicantExtras, company },
    method: { setApplicant, updateApplicantExtras, stepNext },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [hasSignature, setHasSignature] = useState(false);

  const form = useFormik({
    initialValues: new DriverApplicationDto(),
    validationSchema: DriverApplicationDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { first_name, last_name, APPLY_DATE, SIGNATURE, is_automated_recruiting_lead } =
          values;
        setApplicant({
          ...applicant,
          first_name,
          last_name,
          is_automated_recruiting_lead,
        });
        updateApplicantExtras(APPLY_DATE);
        updateApplicantExtras(SIGNATURE);
        stepNext();
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    const { first_name, last_name, is_automated_recruiting_lead } = applicant;
    const apx = applicantExtras?.find((v) => v.type == ApplicantExtras.APPLY_DATE);
    const apx_sign = applicantExtras?.find((v) => v.type == ApplicantExtras.SIGNATURE);

    const applicantEntryObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.APPLY_DATE),
      value: new Date().toISOString(),
    };

    form.setValues({
      ...form.values,
      APPLY_DATE: !!apx?.type ? apx : applicantEntryObject,
      SIGNATURE: !!apx_sign?.type ? apx_sign : new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE),
      first_name: first_name || null,
      last_name: last_name || null,
      is_automated_recruiting_lead:
        isAutoRecruitmentLead == null
          ? Boolean(is_automated_recruiting_lead)
          : Boolean(isAutoRecruitmentLead),
    });

    // Check if there's an initial signature
    setHasSignature(!!apx_sign?.value);
  }, [applicant]);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date().toLocaleString('en-US', { timeZone: userTimeZone });
  const currentDate = new Date(now).toISOString().split('T')[0];

  const handleSignatureChange = (signature: string | null) => {
    form.setFieldValue('SIGNATURE.value', signature);
    setHasSignature(!!signature);
  };

  return (
    <>
      <div className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        <h1>
          {t(
            '{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </h1>
      </div>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('DRIVER_APPLICATION')}
      </h1>

      <div className={styles.formInfoBox}>
        <p>
          {t(
            '{COMPANY_NAME}_MVR_AND_DMV_AUTHORIZATION',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} className={styles.formStep}>
        <div className={styles.formContainer}>
          <div className={styles.formGridTwoColumn}>
            <Input
              name="first_name"
              label={t('FIRST_NAME')}
              placeholder={t('FIRST_NAME')}
              value={form.values.first_name || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              disabled
              error={
                form.touched.first_name && form.errors.first_name
                  ? String(form.errors.first_name)
                  : undefined
              }
              autoComplete="given-name"
            />

            <Input
              name="last_name"
              label={t('LAST_NAME')}
              placeholder={t('LAST_NAME')}
              value={form.values.last_name || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              disabled
              error={
                form.touched.last_name && form.errors.last_name
                  ? String(form.errors.last_name)
                  : undefined
              }
              autoComplete="family-name"
            />
          </div>

          <div className={styles.marginBottomLarge}>
            <DateInput
              name="APPLY_DATE.value"
              label={t('DATE')}
              placeholder={t('DATE')}
              value={form.values.APPLY_DATE?.value || currentDate}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.APPLY_DATE?.value && form.errors.APPLY_DATE?.value
                  ? String(form.errors.APPLY_DATE.value)
                  : undefined
              }
            />
          </div>

          <div className={styles.marginBottomLarge}>
            <h6 className={styles.formSectionHeading}>{t('SIGNATURE')}</h6>
            <SignatureComponent
              firstName={form.values.first_name}
              lastName={form.values.last_name}
              onSignatureChange={handleSignatureChange}
              initialSignature={form.values.SIGNATURE?.value}
              required
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <PrimaryButton
              type="submit"
              disabled={!hasSignature}
              style={{
                width: '100%',
                maxWidth: '200px',
              }}
            >
              {t('NEXT')}
            </PrimaryButton>
          </div>
        </div>
      </Form>
    </>
  );
}

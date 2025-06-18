import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantVoeEntity } from '../../../../models/applicant/applicant-voe.entity';
import { RadioGroup } from '../../../shared/dha/radio-group';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function EmployedByUs() {
  const {
    state: { voe, applicant, employer },
    method: { stepNext, stepBack, updateVoe, jumpToStep },
  }: VoeFormContextType = useContext(VoeFormContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      was_employed: voe.was_employed ?? null,
    },
    validationSchema: ApplicantVoeEntity.yupSchemaEmployedByUs(),
    validateOnMount: false,
    onSubmit: ({ was_employed }) => {
      updateVoe({ was_employed });
      if (Boolean(was_employed)) {
        stepNext();
      } else {
        updateVoe({
          was_employed: false,
          position: null,
          start_date: null,
          end_date: null,
          did_drive_check: false,
          drived_vehicle: null,
          safety_performance: false,
          registered_accidents_details: false,
          accidents_reported_to_government: null,
          reason_to_leave: null,
        });
        jumpToStep(3);
      }
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} className={styles.fadeIn}>
      <div className={styles.formContainer}>
        <div className={styles.formStep}>
          {' '}
          <div className={styles.formStepContent}>
            <h1 className={styles.heading__sty}>
              {t('EMPLOYMENT_VERIFICATION_QUESTION', {
                employerName: employer?.name,
              })}
            </h1>
            <p className={styles.paragraph}>
              {t('EMPLOYMENT_VERIFICATION_DESCRIPTION', {
                applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
                employerName: employer?.name,
              })}
            </p>

            <div className={styles.marginBottomLarge}>
              <RadioGroup
                name="was_employed"
                options={[
                  { value: 'true', label: 'YES' },
                  { value: 'false', label: 'NO' },
                ]}
                value={
                  form.values.was_employed !== null ? String(form.values.was_employed) : undefined
                }
                onChange={(value) => form.setFieldValue('was_employed', value === 'true')}
                required={true}
                error={
                  form.touched.was_employed && form.errors.was_employed
                    ? t('PLEASE_SELECT_AN_OPTION')
                    : undefined
                }
                variant="card"
                columns={2}
              />
            </div>
          </div>
          <div className={styles.formStepNavigation}>
            <div className={styles.navigationButtons}>
              <Button onClick={() => stepBack()} className={styles.secondaryButton}>
                {t('BACK')}
              </Button>
              <Button
                type="submit"
                className={styles.formButton}
                disabled={form.values.was_employed === null}
              >
                {t('NEXT')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantVoeEntity } from '../../../../models/applicant/applicant-voe.entity';
import styles from '../../../../styles/voe.module.css';

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
    <Form onSubmit={form.handleSubmit}>
      <div className={styles.employment_question}>
        <div className={styles.question_header}>
          <h1 className={styles.question_title}>
            {t('EMPLOYMENT_VERIFICATION_QUESTION', {
              employerName: employer?.name,
            })}
          </h1>
          <p className={styles.question_description}>
            {t('EMPLOYMENT_VERIFICATION_DESCRIPTION', {
              applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
              employerName: employer?.name,
            })}
          </p>
        </div>

        <div className={styles.radio_group}>
          <div
            className={`${styles.radio_option} ${
              form.values.was_employed === true ? styles.selected : ''
            }`}
            onClick={() => form.setFieldValue('was_employed', true)}
          >
            <label className={styles.radio_label}>
              <input
                type="radio"
                name="was_employed"
                checked={form.values.was_employed === true}
                onChange={() => form.setFieldValue('was_employed', true)}
              />
              {t('YES')}
            </label>
          </div>

          <div
            className={`${styles.radio_option} ${
              form.values.was_employed === false ? styles.selected : ''
            }`}
            onClick={() => form.setFieldValue('was_employed', false)}
          >
            <label className={styles.radio_label}>
              <input
                type="radio"
                name="was_employed"
                checked={form.values.was_employed === false}
                onChange={() => form.setFieldValue('was_employed', false)}
              />
              {t('NO')}
            </label>
          </div>
        </div>

        {form.touched.was_employed && form.errors.was_employed && (
          <div className="text-danger text-center mb-3">{t('PLEASE_SELECT_AN_OPTION')}</div>
        )}

        <div className={styles.button_container}>
          <Button
            onClick={() => stepBack()}
            className={`${styles.nav_button} ${styles.back_button}`}
          >
            {t('BACK')}
          </Button>
          <Button
            type="submit"
            className={`${styles.nav_button} ${styles.next_button}`}
            disabled={form.values.was_employed === null}
          >
            {t('NEXT')}
          </Button>
        </div>
      </div>
    </Form>
  );
}

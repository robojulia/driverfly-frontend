import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { ReasonsForLeavingEmployment } from '../../../../enums/users/reasons-for-leaving-employment';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantVoeEntity } from '../../../../models/applicant/applicant-voe.entity';
import BaseInput from '../../base-input';
import BaseRadio from '../../base-radio';
import BaseSelect from '../../base-select';
import BaseTextArea from '../../base-text-area';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function AccidentHistory() {
  const {
    state: { voe, applicant },
    method: { stepNext, stepBack, updateVoe },
  }: VoeFormContextType = useContext(VoeFormContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new ApplicantVoeEntity(),
    validationSchema: ApplicantVoeEntity.yupSchemaAccidentHistory(),
    validateOnMount: true,
    validateOnChange: true,
    onSubmit: ({
      position,
      start_date,
      end_date,
      did_drive_check,
      drived_vehicle,
      safety_performance,
      registered_accidents_details,
      accidents_reported_to_government,
      reason_to_leave,
    }) => {
      updateVoe({
        position,
        start_date,
        end_date,
        did_drive_check,
        drived_vehicle,
        safety_performance,
        registered_accidents_details,
        accidents_reported_to_government,
        reason_to_leave,
      });
      stepNext();
    },
  });

  useEffect(() => {
    const {
      position,
      start_date,
      end_date,
      drived_vehicle,
      did_drive_check,
      safety_performance,
      registered_accidents_details,
      accidents_reported_to_government,
      reason_to_leave,
    } = voe;

    form.setValues({
      ...form.values,
      position,
      start_date,
      end_date,
      did_drive_check: did_drive_check || null,
      drived_vehicle,
      safety_performance,
      registered_accidents_details,
      accidents_reported_to_government,
      reason_to_leave,
    });
  }, [voe]);

  const isFormValid = () => {
    return (
      form.isValid &&
      !form.isValidating &&
      Object.keys(form.touched).length > 0 &&
      form.values.did_drive_check !== null
    );
  };
  return (
    <Form onSubmit={form.handleSubmit} className={styles.fadeIn}>
      <div className={styles.formContainer}>
        <div className={styles.formStep}>
          <div className={styles.formStepContent}>
            <h1 className={styles.heading__sty}>{t('EMPLOYMENT_VERIF')}</h1>

            <div className={styles.formGrid}>
              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  name="position"
                  label={t(
                    '{applicantName}_WAS_EMPLOYED_AS',
                    {
                      applicantName: `${applicant?.first_name} ${applicant?.last_name}`,
                    },
                    { translateProps: true }
                  )}
                  placeholder="POSITION"
                  formik={form}
                />
              </div>

              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  name="start_date"
                  label="START_DATE"
                  type="date"
                  formik={form}
                  placeholder="MM/YY"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  name="end_date"
                  type="date"
                  label="END_DATE"
                  formik={form}
                  placeholder="MM/YY"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className={styles.marginBottomMedium}>
              <BaseRadio
                className="w-100"
                label="VOE_DRIVER_QUESTION"
                name="did_drive_check"
                formik={form}
                labelPrefix="BooleanType"
                enumType={BooleanType}
                onChange={({ target: { value } }) => {
                  form.setFieldValue('did_drive_check', value);
                  if (value !== BooleanType.YES) {
                    form.setFieldValue('drived_vehicle', null);
                  }
                }}
                required
              />
            </div>

            {form.values?.did_drive_check === BooleanType.YES && (
              <div className={styles.marginBottomMedium}>
                <BaseTextArea
                  className="w-100"
                  name="drived_vehicle"
                  label="TYPE_OF_VEHICLE"
                  formik={form}
                  required
                />
              </div>
            )}

            <div className={styles.marginBottomMedium}>
              <BaseRadio
                className="w-100"
                label="SAFETY_PERFORMANCE_REPORT"
                name="safety_performance"
                formik={form}
                labelPrefix="BooleanType"
                onChange={(e) => {
                  form.setFieldValue(
                    'safety_performance',
                    { true: true, false: false }[e.target.value] || false
                  );
                  form.setFieldValue('registered_accidents_details', false);
                }}
                options={[
                  {
                    label: BooleanType.YES,
                    value: true,
                  },
                  {
                    label: BooleanType.NO,
                    value: false,
                  },
                ]}
                required
              />
            </div>

            {form.values?.safety_performance === true && (
              <div className={styles.marginBottomMedium}>
                <BaseRadio
                  className="w-100"
                  label="ACCIDENT_REGISTER_DATA"
                  name="registered_accidents_details"
                  formik={form}
                  labelPrefix="BooleanType"
                  onChange={(e) => {
                    form.setFieldValue(
                      'registered_accidents_details',
                      { true: true, false: false }[e.target.value] || false
                    );
                    if (e.target.value === 'false') {
                      form.setFieldValue('accidents_reported_to_government', null);
                    }
                  }}
                  options={[
                    {
                      label: BooleanType.YES,
                      value: true,
                    },
                    {
                      label: BooleanType.NO,
                      value: false,
                    },
                  ]}
                  required
                />
              </div>
            )}

            {form.values?.registered_accidents_details === true && (
              <div className={styles.marginBottomMedium}>
                <BaseTextArea
                  required
                  className="w-100"
                  name="accidents_reported_to_government"
                  label="OTHER_GOV_REPORTED_ACCIDENTS"
                  formik={form}
                />
              </div>
            )}

            <div className={styles.marginBottomLarge}>
              <BaseSelect
                className="w-100"
                required
                labelPrefix="ReasonsForLeavingEmployment"
                enumType={ReasonsForLeavingEmployment}
                name="reason_to_leave"
                placeholder="CHOOSE"
                label="REASONS_FOR_LEAVING_EMPLOYMENT"
                formik={form}
              />
            </div>
          </div>

          <div className={styles.formStepNavigation}>
            <div className={styles.navigationButtons}>
              <Button onClick={() => stepBack()} className={styles.secondaryButton}>
                {t('BACK')}
              </Button>
              <Button type="submit" className={styles.formButton} disabled={!isFormValid()}>
                {t('NEXT')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

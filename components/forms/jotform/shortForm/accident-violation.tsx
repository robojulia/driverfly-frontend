import { useFormik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { AccidentViolationDto } from '../../../../models/jot-form/short-form/accident-violation.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import ViewModal from '../../../view-details/view-modal';
import BaseCheck from '../../base-check';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup } from '../../../shared/dha';

export function AccidentViolation() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (values: AccidentViolationDto) => {
    const { authorized_to_work_in_us } = values;

    if (authorized_to_work_in_us === false) {
      setShowModal(true);
    } else {
      submitForm(values);
    }
  };

  const shouldShowWorkAuthorizationCheck = () => {
    return Boolean(applicant.license_type == DriverLicenseType.NO_CDL);
  };

  const submitForm = (values: AccidentViolationDto) => {
    setApplicant({
      ...applicant,
      can_pass_drug_test: values.can_pass_drug_test,
      moving_violations_count: values.moving_violations_count,
      all_violations_count: values.all_violations_count,
      // Only save work authorization value if the field should be shown
      authorized_to_work_in_us: shouldShowWorkAuthorizationCheck()
        ? values.authorized_to_work_in_us
        : applicant.authorized_to_work_in_us, // Keep existing value if field not shown
      accident_count: values.accident_count,
    });
    stepNext();
  };

  // Create dynamic validation schema based on whether work authorization should be shown
  const validationSchema = useMemo(() => {
    const baseSchema = AccidentViolationDto.yupSchema();

    // If work authorization field should not be shown, make it optional
    if (!shouldShowWorkAuthorizationCheck()) {
      return baseSchema.shape({
        ...baseSchema.fields,
        authorized_to_work_in_us: yup.boolean().optional().nullable(),
      });
    }

    return baseSchema;
  }, [applicant.license_type]);

  const form = useFormik({
    initialValues: new AccidentViolationDto(),
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
  });

  const applicantValues = useMemo(() => {
    const {
      can_pass_drug_test,
      moving_violations_count,
      all_violations_count,
      authorized_to_work_in_us,
      accident_count,
    } = applicant;

    return {
      can_pass_drug_test: can_pass_drug_test ?? null,
      moving_violations_count: moving_violations_count ?? 0,
      all_violations_count: all_violations_count ?? 0,
      authorized_to_work_in_us: authorized_to_work_in_us ?? null,
      accident_count: accident_count ?? 0,
    };
  }, [applicant]);

  useEffect(() => {
    const initialValues = {
      ...applicantValues,
      moving_violations_count:
        applicantValues.moving_violations_count !== null
          ? applicantValues.moving_violations_count
          : 0,
      all_violations_count:
        applicantValues.all_violations_count !== null ? applicantValues.all_violations_count : 0,
      accident_count: applicantValues.accident_count !== null ? applicantValues.accident_count : 0,
      // Set work authorization to null if field is not shown, otherwise keep the applicant value
      authorized_to_work_in_us: shouldShowWorkAuthorizationCheck()
        ? applicantValues.authorized_to_work_in_us
        : null,
    };

    // Set values and reset form state to clear any validation errors
    form.setValues(initialValues, false);
    form.setTouched({}, false);
    form.setErrors({});

    // Validate form after initial value set with a small delay to ensure state is updated
    setTimeout(() => {
      form.validateForm();
    }, 0);
  }, [applicantValues, applicant.license_type]);

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

  // Define radio group value clearly
  const getDrugTestRadioValue = () => {
    if (form.values.can_pass_drug_test === true) {
      return BooleanType.YES;
    }
    if (form.values.can_pass_drug_test === false) {
      return BooleanType.NO;
    }
    return undefined;
  };

  const drugTestRadioValue = getDrugTestRadioValue();

  const handleDrugTestChange = (value: string) => {
    let newValue: boolean | null = null;
    if (value === BooleanType.YES) {
      newValue = true;
    } else if (value === BooleanType.NO) {
      newValue = false;
    }
    form.setFieldValue('can_pass_drug_test', newValue);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('ACCIDENTS_AND_VIOLATIONS')}
      </h1>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="my-4">
            <RadioGroup
              name="can_pass_drug_test"
              label={t('can_pass_drug_test')}
              enumType={BooleanType}
              value={drugTestRadioValue}
              onChange={handleDrugTestChange}
              required
              error={
                form.touched.can_pass_drug_test && form.errors.can_pass_drug_test
                  ? String(form.errors.can_pass_drug_test)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
            />
          </div>

          <div className="my-3">
            <p className={`${styles.paragraph} ${styles.align__text_left}`}>
              {t(
                '{company_name}_DRUG_TEST_DOT',
                { company_name: applicant?.company?.name },
                { translateProps: true }
              )}
            </p>
          </div>

          <div className="my-3">
            <Input
              name="moving_violations_count"
              type="number"
              label={t('voilations_in_last_3_years')}
              placeholder={t('PLACEHOLDER_FOR_DIGITS')}
              value={form.values.moving_violations_count?.toString() || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                form.setFieldValue('moving_violations_count', value);
              }}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.moving_violations_count && form.errors.moving_violations_count
                  ? String(form.errors.moving_violations_count)
                  : undefined
              }
              helperText="Enter the number of moving violations in the last 3 years"
            />
          </div>

          <div className="my-3">
            <Input
              name="all_violations_count"
              type="number"
              label={t('ALL_VIOLATION_IN_LAST_3_YEARS')}
              placeholder={t('PLACEHOLDER_FOR_DIGITS')}
              value={form.values.all_violations_count?.toString() || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                form.setFieldValue('all_violations_count', value);
              }}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.all_violations_count && form.errors.all_violations_count
                  ? String(form.errors.all_violations_count)
                  : undefined
              }
              helperText="Enter the total number of all violations in the last 3 years"
            />
          </div>

          <div className="my-3">
            <Input
              name="accident_count"
              type="number"
              label={t('accidents_last_5_years')}
              placeholder={t('PLACEHOLDER_FOR_DIGITS')}
              value={form.values.accident_count?.toString() || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                form.setFieldValue('accident_count', value);
              }}
              onBlur={form.handleBlur}
              required
              error={
                form.touched.accident_count && form.errors.accident_count
                  ? String(form.errors.accident_count)
                  : undefined
              }
              helperText="Enter the number of accidents in the last 5 years"
            />
          </div>

          {shouldShowWorkAuthorizationCheck() && (
            <div className="my-4">
              <BaseCheck
                className="my-3"
                name="authorized_to_work_in_us"
                label="ELIGIBLE_TO_WORK_IN_US"
                required
                formik={form}
              />
              {form.touched.authorized_to_work_in_us && form.errors.authorized_to_work_in_us && (
                <div className="invalid-feedback d-block">
                  {form.errors.authorized_to_work_in_us}
                </div>
              )}
            </div>
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

      <ViewModal
        show={showModal}
        title=""
        size="lg"
        onCloseClick={() => setShowModal(false)}
        footer={
          <Row className="mt-5 w-100">
            <Col>
              <Button className="float-right" onClick={() => setShowModal(false)}>
                {t('NO')}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={() => {
                  setShowModal(false);
                  submitForm(form.values);
                }}
                className="float-left theme-secondary-btn"
              >
                {t('PROCEED')}
              </Button>
            </Col>
          </Row>
        }
      >
        <>
          <h3 className="text-center">
            <b>{t('DHA_WARNING_MESSAGE_NOT_ELIGIBLE_TO_WORK_IN_US')}</b>
          </h3>
          <h4 className="text-center text-warning">
            {t('NOT_ELIGIBLE_MESSAGE', { company: applicant?.company?.name })}
          </h4>
          <h5 className="text-center">{t('PROCEED_WITH_APPLICATION')}</h5>
        </>
      </ViewModal>
    </>
  );
}

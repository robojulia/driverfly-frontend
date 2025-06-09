import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form, Card } from 'react-bootstrap';
import { PlusCircle, Trash } from 'react-bootstrap-icons';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { PastSuspensionDto } from '../../../../models/jot-form/long-form/past-suspension.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup, Button } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function PastSuspension() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isValid, setIsValid] = useState(false);

  // Enhanced validation schema to ensure required fields are properly validated
  const validationSchema = yup.object({
    license_revoked: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether your license has been suspended, revoked, or denied',
        (value) => value !== null
      ),
    license_revoked_details: yup.string().when('license_revoked', {
      is: true,
      then: (schema) => schema.required('Please provide details about your license suspension'),
      otherwise: (schema) => schema.nullable(),
    }),
    has_past_dui: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have had any DUI incidents',
        (value) => value !== null
      ),
    dui_years: yup.array().when('has_past_dui', {
      is: true,
      then: (schema) =>
        schema
          .min(1, 'Please provide at least one DUI year')
          .of(
            yup
              .number()
              .required('Year is required')
              .min(1900, 'Please enter a valid year')
              .max(new Date().getFullYear(), 'Year cannot be in the future')
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  });

  const form = useFormik({
    initialValues: {
      license_revoked: null as boolean | null,
      license_revoked_details: '',
      has_past_dui: null as boolean | null,
      dui_years: [] as (string | number)[],
    },
    validationSchema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const { license_revoked, license_revoked_details, has_past_dui, dui_years } = values;
      setApplicant({
        ...applicant,
        has_past_dui: has_past_dui,
        dui_years: dui_years,
        license_revoked: license_revoked,
        license_revoked_details: license_revoked_details,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      has_past_dui: applicant?.has_past_dui || null,
      dui_years: applicant?.dui_years || [],
      license_revoked: applicant?.license_revoked || null,
      license_revoked_details: applicant?.license_revoked_details || '',
    });
  }, [applicant]);

  // Helper functions for radio group values
  const getLicenseRevokedValue = () => {
    if (form.values.license_revoked === true) return BooleanType.YES;
    if (form.values.license_revoked === false) return BooleanType.NO;
    return undefined;
  };

  const getHasPastDuiValue = () => {
    if (form.values.has_past_dui === true) return BooleanType.YES;
    if (form.values.has_past_dui === false) return BooleanType.NO;
    return undefined;
  };

  // Handle radio group changes
  const handleLicenseRevokedChange = (value: string) => {
    const newValue = value === BooleanType.YES ? true : value === BooleanType.NO ? false : null;
    form.setFieldValue('license_revoked', newValue);
    form.setFieldTouched('license_revoked', true);

    // Clear details if "No" is selected
    if (newValue === false) {
      form.setFieldValue('license_revoked_details', '');
    }

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const handleHasPastDuiChange = (value: string) => {
    const newValue = value === BooleanType.YES ? true : value === BooleanType.NO ? false : null;
    form.setFieldValue('has_past_dui', newValue);
    form.setFieldTouched('has_past_dui', true);

    if (newValue === false) {
      // Clear DUI years if "No" is selected
      form.setFieldValue('dui_years', []);
    } else if (
      newValue === true &&
      (!form.values.dui_years || form.values.dui_years.length === 0)
    ) {
      // Add initial empty year if "Yes" is selected and no years exist
      form.setFieldValue('dui_years', ['']);
    }

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);
  };

  const addDuiYear = () => {
    form.setFieldValue('dui_years', [...(form.values?.dui_years || []), '']);
  };

  const removeDuiYear = (index: number) => {
    const newYears = form.values?.dui_years?.filter((_, idx) => idx !== index);
    form.setFieldValue('dui_years', newYears);
  };

  // Custom form validity check
  const checkFormValidity = () => {
    // Both radio questions must be answered (have values, regardless of touched state for initial state)
    const licenseQuestionAnswered = form.values.license_revoked !== null;
    const duiQuestionAnswered = form.values.has_past_dui !== null;

    // If license was revoked, details must be provided
    const licenseDetailsValid =
      form.values.license_revoked === true
        ? form.values.license_revoked_details &&
          form.values.license_revoked_details.trim().length > 0
        : true;

    // If user has past DUIs, at least one valid year must be provided
    const duiYearsValid =
      form.values.has_past_dui === true
        ? form.values.dui_years &&
          form.values.dui_years.length > 0 &&
          form.values.dui_years.every((year) => {
            const yearValue = typeof year === 'string' ? parseInt(year) : year;
            return yearValue && yearValue >= 1900 && yearValue <= new Date().getFullYear();
          })
        : true;

    // Check if there are any validation errors
    const hasNoErrors = Object.keys(form.errors).length === 0;

    return (
      licenseQuestionAnswered &&
      duiQuestionAnswered &&
      licenseDetailsValid &&
      duiYearsValid &&
      hasNoErrors
    );
  };

  // Update validity state whenever form values or errors change
  useEffect(() => {
    const newIsValid = checkFormValidity();
    setIsValid(newIsValid);
  }, [form.values, form.errors]);

  const handleNext = () => {
    // Mark all fields as touched to show validation errors
    form.setFieldTouched('license_revoked', true);
    form.setFieldTouched('has_past_dui', true);
    if (form.values.license_revoked === true) {
      form.setFieldTouched('license_revoked_details', true);
    }
    if (form.values.has_past_dui === true && form.values.dui_years) {
      form.values.dui_years.forEach((_, index) => {
        form.setFieldTouched(`dui_years[${index}]`, true);
      });
    }

    // Validate the form
    form.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0 && isValid) {
        const syntheticEvent = {
          preventDefault: () => {},
          target: {},
        } as any;
        form.handleSubmit(syntheticEvent);
      }
    });
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
        {t('SUSSPENSIONS')}
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
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a2b3c' }}>
          📋 License & DUI Information
        </p>
        <p style={{ margin: 0 }}>
          We need to know about any license suspensions or DUI incidents. This information is
          required for safety compliance and background verification purposes.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* License Revocation Question */}
          <div className="my-4">
            <RadioGroup
              name="license_revoked"
              label={t('LICENSE_PREVILLAGES')}
              enumType={BooleanType}
              value={getLicenseRevokedValue()}
              onChange={handleLicenseRevokedChange}
              required
              error={
                form.touched.license_revoked && form.errors.license_revoked
                  ? String(form.errors.license_revoked)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Select if your license has ever been suspended, revoked, or denied"
            />
          </div>

          {/* License Revocation Details */}
          {form.values.license_revoked === true && (
            <div className="my-4">
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                }}
              >
                <BaseTextArea
                  name="license_revoked_details"
                  label={t('EXPLAIN_SUSPENSION')}
                  placeholder="Please provide details about your license suspension, revocation, or denial..."
                  formik={form}
                  rows={3}
                  required
                />
                <small className="text-muted">
                  Include dates, reasons, and current status of your license
                </small>
              </div>
            </div>
          )}

          {/* DUI Question */}
          <div className="my-4">
            <RadioGroup
              name="has_past_dui"
              label={t('HAS_DUIS_DHA')}
              enumType={BooleanType}
              value={getHasPastDuiValue()}
              onChange={handleHasPastDuiChange}
              required
              error={
                form.touched.has_past_dui && form.errors.has_past_dui
                  ? String(form.errors.has_past_dui)
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Include DUI, DWI, or similar alcohol/drug-related driving offenses"
            />
          </div>

          {/* DUI Years Section */}
          {form.values.has_past_dui === true && (
            <div className="my-4">
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <h6 style={{ marginBottom: '1rem', color: '#495057' }}>
                  {t('PAST_DUIS')} Information
                </h6>
                <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem' }}>
                  Please provide the year(s) when you had DUI incidents. You currently have{' '}
                  <strong>{form.values.dui_years?.length || 0}</strong> year(s) recorded.
                </p>

                {form.values?.dui_years?.length > 0 && (
                  <div className="mb-4">
                    {form.values.dui_years.map((year, i) => (
                      <Card
                        key={i}
                        className="mb-3"
                        style={{ border: '1px solid rgb(134, 142, 150)' }}
                      >
                        <Card.Body style={{ padding: '1rem' }}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr auto',
                              gap: '1rem',
                              alignItems: 'start',
                            }}
                          >
                            <Input
                              name={`dui_years[${i}]`}
                              label={`DUI Year #${i + 1}`}
                              placeholder="Enter year (e.g., 2020)"
                              type="number"
                              value={year?.toString() || ''}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : '';
                                form.setFieldValue(`dui_years[${i}]`, value);
                              }}
                              onBlur={form.handleBlur}
                              required
                              min="1900"
                              max={new Date().getFullYear().toString()}
                              error={
                                form.touched.dui_years?.[i] && form.errors.dui_years?.[i]
                                  ? String(form.errors.dui_years[i])
                                  : undefined
                              }
                              icon={<span>📅</span>}
                              helperText="Year of the DUI incident"
                            />

                            <div style={{ marginTop: '2.2rem' }}>
                              <Button
                                variant="danger"
                                size="sm"
                                icon={<Trash />}
                                onClick={() => removeDuiYear(i)}
                                disabled={form.values?.dui_years?.length <= 1}
                              >
                                {t('REMOVE')}
                              </Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add DUI Year Button */}
                <div className="text-center">
                  <Button variant="outline" size="sm" icon={<PlusCircle />} onClick={addDuiYear}>
                    {t('ADD')} DUI Year
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isValid}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

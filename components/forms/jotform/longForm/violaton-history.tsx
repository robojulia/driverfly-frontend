import { useFormik } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { PlusCircle, TrashFill } from 'react-bootstrap-icons';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantMovingViolationEntity } from '../../../../models/applicant/applicant-moving-violation.entity';
import { ViolationHistoryDto } from '../../../../models/jot-form/long-form/violation-history.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function ViolationHistory() {
  const {
    state: { applicant, steps },
    method: { stepBack, stepNext, setApplicant },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const initializedRef = useRef(false);

  // Save form data function
  const saveFormData = async (formData: any) => {
    if (!applicant?.id || steps <= 9) return;

    try {
      const applicantApi = new ApplicantApi();
      await applicantApi.jotform.update(applicant.id, formData);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  // Updated validation - only validate violation details if they've been started
  const validationSchema = yup.object({
    has_violations: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have had any violations',
        (value) => value !== null
      ),
    moving_violations_count: yup.number().min(0).nullable(),
    moving_violations_details: yup.string().nullable(),
    moving_violation_history: yup.array().of(
      yup.object({
        date_of_violation: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Date is required when violation details are provided',
              function (value) {
                const violation = this.parent;
                const hasAnyField =
                  violation.location || violation.charge || violation.penalty || value;
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        location: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Location is required when violation details are provided',
              function (value) {
                const violation = this.parent;
                const hasAnyField =
                  violation.date_of_violation || violation.charge || violation.penalty || value;
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        charge: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Charge is required when violation details are provided',
              function (value) {
                const violation = this.parent;
                const hasAnyField =
                  violation.date_of_violation || violation.location || violation.penalty || value;
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        penalty: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Penalty is required when violation details are provided',
              function (value) {
                const violation = this.parent;
                const hasAnyField =
                  violation.date_of_violation || violation.location || violation.charge || value;
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
      })
    ),
  });

  const form = useFormik({
    initialValues: {
      ...new ViolationHistoryDto(),
      moving_violations_count: applicant.moving_violations_count || 0,
      moving_violation_history: applicant.moving_violation_history || [],
      moving_violations_details: applicant?.moving_violations_details || '',
      has_violations: null as boolean | null, // New field for initial question
    },
    validationSchema,
    onSubmit: (values) => {
      // Only submit the actual DTO fields, not the UI-only has_violations field
      let { moving_violation_history, moving_violations_count, moving_violations_details } = values;

      // Handle state persistence for radio button restoration
      if (values.has_violations === false) {
        // User said NO - clear all data and save state
        moving_violations_details = '';
        moving_violations_count = 0;
        moving_violation_history = [];
      } else if (
        values.has_violations === true &&
        !moving_violations_details &&
        (!moving_violation_history || moving_violation_history.length === 0)
      ) {
        // User said YES but provided no details - save marker for state restoration
        moving_violations_details = '__YES_NO_DETAILS__';
        moving_violations_count = 0;
        moving_violation_history = [];
      }

      const updatedApplicant = {
        ...applicant,
        moving_violations_details,
        moving_violations_count,
        moving_violation_history,
      };

      setApplicant(updatedApplicant);

      // Save form data on submit
      saveFormData({
        applicant: updatedApplicant,
      });

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    if (initializedRef.current) return;

    if (applicant) {
      const shortFormViolationCount = applicant.moving_violations_count || 0;
      const existingViolationHistory = applicant.moving_violation_history;
      const existingDetails = applicant.moving_violations_details;

      // Detect if they've previously submitted the long form page
      // moving_violations_details is only set when submitting the long form
      const hasVisitedLongForm =
        existingDetails !== undefined ||
        (existingViolationHistory !== undefined && existingViolationHistory !== null);

      let hasViolationsState: boolean | null = null;
      let violationHistoryToSet: any[] = [];
      let violationDetailsToSet = '';
      let violationCountToSet = 0;

      if (hasVisitedLongForm) {
        // Restore previously saved long form state
        const actualHistory = existingViolationHistory || [];
        const actualDetails = existingDetails || '';
        const hasActualViolations = shortFormViolationCount > 0 || actualHistory.length > 0;
        const hasActualDetails = actualDetails && actualDetails !== '__YES_NO_DETAILS__';

        if (hasActualViolations || hasActualDetails) {
          hasViolationsState = true;
        } else if (actualDetails === '__YES_NO_DETAILS__') {
          hasViolationsState = true;
        } else {
          hasViolationsState = false;
        }

        violationHistoryToSet = actualHistory;
        violationDetailsToSet = actualDetails === '__YES_NO_DETAILS__' ? '' : actualDetails;
        violationCountToSet = shortFormViolationCount;
      } else {
        // First time on this page — pre-populate from short form count
        if (shortFormViolationCount > 0) {
          hasViolationsState = true;
          violationHistoryToSet = Array.from({ length: shortFormViolationCount }, () => ({
            ...new ApplicantMovingViolationEntity(),
          }));
          violationCountToSet = shortFormViolationCount;
        } else {
          hasViolationsState = false;
          violationHistoryToSet = [];
          violationCountToSet = 0;
        }
      }

      form.setValues({
        ...form.values,
        moving_violations_count: violationCountToSet,
        moving_violation_history: violationHistoryToSet,
        moving_violations_details: violationDetailsToSet,
        has_violations: hasViolationsState,
      });

      initializedRef.current = true;
    }
  }, [applicant?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // REASON: Form object intentionally excluded to prevent infinite loop

  // Auto-update violation count based on violation history length
  useEffect(() => {
    const violationHistoryLength = form.values.moving_violation_history?.length || 0;
    if (form.values.moving_violations_count !== violationHistoryLength) {
      form.setFieldValue('moving_violations_count', violationHistoryLength);
    }
  }, [form.values.moving_violation_history, form.values.moving_violations_count]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // REASON: form.setFieldValue intentionally excluded - guard condition prevents infinite loops

  // Extract complex conditions into variables
  const hasViolations = form.values.has_violations === true;
  const hasViolationHistory = form.values?.moving_violation_history?.length > 0;
  const showViolationDetails = hasViolations;

  const handleHasViolationsChange = (value: string) => {
    const hasViolationsValue = value === BooleanType.YES;
    form.setFieldValue('has_violations', hasViolationsValue);
    form.setFieldTouched('has_violations', true);

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);

    if (hasViolationsValue) {
      // When user says yes, ensure count starts at 0 and will be updated by useEffect
      form.setFieldValue('moving_violations_count', 0);
      // Automatically add first violation entry if none exist
      if (!form.values.moving_violation_history || form.values.moving_violation_history.length === 0) {
        const newViolation = {
          ...new ApplicantMovingViolationEntity(),
        };
        form.setFieldValue('moving_violation_history', [newViolation]);
      }
    } else {
      // Clear all violation data if user says no and set count to 0
      form.setFieldValue('moving_violation_history', []);
      form.setFieldValue('moving_violations_details', '');
      form.setFieldValue('moving_violations_count', 0);
    }
  };

  const handleRemoveViolation = (indexToRemove: number) => {
    const filteredHistory = form.values?.moving_violation_history.filter(
      (v, idx) => indexToRemove !== idx
    );
    form.setFieldValue('moving_violation_history', filteredHistory);
  };

  const handleAddViolation = () => {
    const newViolation = {
      ...new ApplicantMovingViolationEntity(),
    };
    const newViolationHistory = [...(form.values?.moving_violation_history || []), newViolation];
    form.setFieldValue('moving_violation_history', newViolationHistory);
  };

  const formatDateForInput = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    return threeYearsAgo.toISOString().split('T')[0];
  };

  const getHasViolationsValue = () => {
    if (form.values.has_violations === true) return BooleanType.YES;
    if (form.values.has_violations === false) return BooleanType.NO;
    return undefined;
  };

  // Helper function to safely get nested error messages
  const getNestedError = (fieldPath: string) => {
    const pathParts = fieldPath.split('.');
    let error: any = form.errors;
    let touched: any = form.touched;

    for (const part of pathParts) {
      if (error && typeof error === 'object') {
        error = error[part];
      } else {
        error = undefined;
        break;
      }

      if (touched && typeof touched === 'object') {
        touched = touched[part];
      } else {
        touched = false;
        break;
      }
    }

    return touched && error ? String(error) : undefined;
  };

  // Helper function to determine if a violation field should be required
  const isViolationFieldRequired = (violationIndex: number) => {
    const violation = form.values.moving_violation_history?.[violationIndex];
    if (!violation) return false;

    return !!(
      violation.date_of_violation ||
      violation.location ||
      violation.charge ||
      violation.penalty
    );
  };

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
        {t('VIOLATION_HISTORY')}
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
        <p style={{ margin: '0 0 0.5rem 0' }}>
          We need to know about any moving violations you have received. This information helps us
          assess your driving record and ensure compliance with safety regulations.
        </p>
        <p style={{ margin: 0, fontWeight: '600', color: '#0066cc', fontSize: '1rem' }}>
          ⏰ Please report only moving violations from the past 3 years.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Primary Question: Have you had any violations? */}
          <div className="my-4">
            <RadioGroup
              name="has_violations"
              label={t('HAVE_YOU_HAD_VIOLATIONS_LAST_3_YEARS')}
              enumType={BooleanType}
              value={getHasViolationsValue()}
              onChange={handleHasViolationsChange}
              required
              error={
                form.touched.has_violations && form.values.has_violations === null
                  ? 'Please select whether you have had any violations'
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Include all moving violations in the last 3 years"
            />
          </div>

          {/* Violation Details Section */}
          {showViolationDetails && (
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
                <h5 style={{ marginBottom: '1rem', color: '#495057' }}>Violation Information</h5>

                {/* General Description */}
                <div className="mb-4">
                  <BaseTextArea
                    name="moving_violations_details"
                    label="General Description of Violations"
                    placeholder="Please provide a brief overview of the violations you have received..."
                    formik={form}
                    rows={3}
                  />
                  <small className="text-muted">
                    Provide a general summary before adding specific details below
                  </small>
                </div>

                {/* Specific Violation Details */}
                <div className="mb-3">
                  <h6 style={{ color: '#495057', marginBottom: '1rem' }}>
                    Specific Violation Details
                  </h6>
                  <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem' }}>
                    Please add detailed information for each violation. You currently have{' '}
                    <strong>{form.values.moving_violation_history?.length || 0}</strong>{' '}
                    violation(s) recorded.
                  </p>
                </div>

                {/* Violation History List */}
                {hasViolationHistory && (
                  <div className="mb-4">
                    {form.values.moving_violation_history.map((violation, i) => (
                      <Card key={i} className="mb-3" style={{ border: '1px solid #dee2e6' }}>
                        <Card.Header
                          style={{
                            backgroundColor: '#ffffff',
                            borderBottom: '1px solid #dee2e6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <h6 style={{ margin: 0, color: '#495057' }}>Violation #{i + 1}</h6>
                          <button
                            type="button"
                            onClick={() => handleRemoveViolation(i)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc3545',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                            title="Remove this violation"
                          >
                            <TrashFill size={16} />
                          </button>
                        </Card.Header>
                        <Card.Body style={{ padding: '1.5rem' }}>
                          <Row className="g-3">
                            <div className="col-md-6">
                              <Input
                                name={`moving_violation_history[${i}].date_of_violation`}
                                type="date"
                                label="Date of Violation"
                                placeholder="Select date"
                                value={formatDateForInput(violation.date_of_violation)}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (inputValue) {
                                    const selectedDate = new Date(inputValue);
                                    const minDate = new Date(getMinDate());

                                    if (selectedDate < minDate) {
                                      alert('You only need to enter violations from the past 3 years.');
                                      return;
                                    }

                                    form.setFieldValue(
                                      `moving_violation_history[${i}].date_of_violation`,
                                      inputValue
                                    );
                                  } else {
                                    form.setFieldValue(
                                      `moving_violation_history[${i}].date_of_violation`,
                                      ''
                                    );
                                  }
                                }}
                                onBlur={form.handleBlur}
                                required={isViolationFieldRequired(i)}
                                min={getMinDate()}
                                max={getMaxDate()}
                                error={getNestedError(
                                  `moving_violation_history.${i}.date_of_violation`
                                )}
                                icon={<span>📅</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`moving_violation_history[${i}].location`}
                                label="Location of Violation"
                                placeholder="City, State or specific location"
                                value={violation.location || ''}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                required={isViolationFieldRequired(i)}
                                error={getNestedError(`moving_violation_history.${i}.location`)}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`moving_violation_history[${i}].charge`}
                                label="Charge/Violation Type"
                                placeholder="e.g., Speeding, Running red light, etc."
                                value={violation.charge || ''}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                required={isViolationFieldRequired(i)}
                                error={getNestedError(`moving_violation_history.${i}.charge`)}
                                icon={<span>⚖️</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`moving_violation_history[${i}].penalty`}
                                label="Penalty/Fine"
                                placeholder="e.g., $150 fine, 3 points, etc."
                                value={violation.penalty || ''}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                required={isViolationFieldRequired(i)}
                                error={getNestedError(`moving_violation_history.${i}.penalty`)}
                                icon={<span>💰</span>}
                              />
                            </div>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add Violation Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAddViolation}
                    className={styles.addAnotherButton}
                  >
                    <PlusCircle size={16} />
                    Add Another Violation
                  </button>
                </div>
              </div>
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
    </>
  );
}

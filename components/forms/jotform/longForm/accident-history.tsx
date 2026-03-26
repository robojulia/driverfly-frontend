import { useFormik } from 'formik';
import { useContext, useEffect, useRef } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { PlusCircle, TrashFill } from 'react-bootstrap-icons';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantAccidentEntity } from '../../../../models/applicant/applicant-accidentr.entity';
import { AccidentHistoryDto } from '../../../../models/jot-form/long-form/accident-history.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup, Checkbox } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function AccidentHistory() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
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

  // Updated validation - only validate accident details if they've been started
  const validationSchema = yup.object({
    has_accidents: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have had any accidents',
        (value) => value !== null
      ),
    accident_count: yup.number().min(0).nullable(),
    accident_details: yup.string().nullable(),
    accident_history: yup.array().of(
      yup.object({
        date_of_accident: yup.date().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Date is required when accident details are provided',
              function (value) {
                const accident = this.parent;
                const hasAnyField =
                  accident.nature_of_accident ||
                  accident.location_of_accident ||
                  value ||
                  (accident.number_of_injured !== undefined &&
                    accident.number_of_injured !== null) ||
                  (accident.number_of_fatalaties !== undefined &&
                    accident.number_of_fatalaties !== null);
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        nature_of_accident: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Nature of accident is required when accident details are provided',
              function (value) {
                const accident = this.parent;
                const hasAnyField =
                  accident.date_of_accident ||
                  accident.location_of_accident ||
                  value ||
                  (accident.number_of_injured !== undefined &&
                    accident.number_of_injured !== null) ||
                  (accident.number_of_fatalaties !== undefined &&
                    accident.number_of_fatalaties !== null);
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        location_of_accident: yup.string().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Location is required when accident details are provided',
              function (value) {
                const accident = this.parent;
                const hasAnyField =
                  accident.date_of_accident ||
                  accident.nature_of_accident ||
                  value ||
                  (accident.number_of_injured !== undefined &&
                    accident.number_of_injured !== null) ||
                  (accident.number_of_fatalaties !== undefined &&
                    accident.number_of_fatalaties !== null);
                return hasAnyField ? !!value : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        number_of_injured: yup.number().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Number of injured is required when accident details are provided',
              function (value) {
                const accident = this.parent;
                const hasAnyField =
                  accident.date_of_accident ||
                  accident.nature_of_accident ||
                  accident.location_of_accident ||
                  (value !== undefined && value !== null) ||
                  (accident.number_of_fatalaties !== undefined &&
                    accident.number_of_fatalaties !== null);
                return hasAnyField ? value !== undefined && value !== null : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        number_of_fatalaties: yup.number().when([], {
          is: () => true,
          then: (schema) =>
            schema.test(
              'conditional-required',
              'Number of fatalities is required when accident details are provided',
              function (value) {
                const accident = this.parent;
                const hasAnyField =
                  accident.date_of_accident ||
                  accident.nature_of_accident ||
                  accident.location_of_accident ||
                  (accident.number_of_injured !== undefined &&
                    accident.number_of_injured !== null) ||
                  (value !== undefined && value !== null);
                return hasAnyField ? value !== undefined && value !== null : true;
              }
            ),
          otherwise: (schema) => schema.nullable(),
        }),
        dot_recordable: yup.boolean().default(false).optional(),
        at_fault: yup.boolean().default(false).optional(),
      })
    ),
  });

  const form = useFormik({
    initialValues: {
      ...new AccidentHistoryDto(),
      accident_count: applicant.accident_count || 0,
      accident_history: applicant.accident_history || [],
      accident_details: applicant?.accident_details || '',
      has_accidents: null as boolean | null, // New field for initial question
    },
    validationSchema,
    onSubmit: (values) => {
      try {
        // Save the user's choice along with the accident data
        const { accident_count, accident_history, accident_details, has_accidents } = values;

        let updatedApplicant = { ...applicant };

        // Always save the data based on the user's choice
        if (has_accidents === false) {
          // User said NO - clear all data but make sure we save empty array to indicate they've been here
          updatedApplicant = {
            ...updatedApplicant,
            accident_count: 0,
            accident_details: '',
            accident_history: [], // Empty array indicates they said NO
          };
        } else if (has_accidents === true) {
          // User said YES - save current state (even if they haven't added accidents yet)
          const finalDetails =
            accident_details && accident_details.trim() !== ''
              ? accident_details
              : '__YES_NO_DETAILS__'; // Special marker to indicate they said YES but no details yet

          updatedApplicant = {
            ...updatedApplicant,
            accident_count: accident_count || 0, // Ensure it's a number
            accident_details: finalDetails,
            accident_history: accident_history || [], // Empty array here means YES but no details yet
          };
        } else {
          // Shouldn't happen due to validation, but handle gracefully
          updatedApplicant = {
            ...updatedApplicant,
            accident_count: accident_count || 0,
            accident_details: accident_details || '',
            accident_history: accident_history || [],
          };
        }

        setApplicant(updatedApplicant);

        // Save form data on submit
        saveFormData({
          applicant: updatedApplicant,
        });

        stepNext();
      } catch (error) {
        console.log('error', error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    if (initializedRef.current) return;

    if (applicant) {
      const shortFormAccidentCount = applicant.accident_count || 0;
      const existingAccidentHistory = applicant.accident_history;
      const existingAccidentDetails = applicant.accident_details;

      // Detect if they've previously submitted the long form page
      // accident_details is only set when submitting the long form
      const hasVisitedLongForm =
        existingAccidentDetails !== undefined ||
        (existingAccidentHistory !== undefined && existingAccidentHistory !== null);

      let hasAccidentsState: boolean | null = null;
      let accidentHistoryToSet: any[] = [];
      let accidentDetailsToSet = '';
      let accidentCountToSet = 0;

      if (hasVisitedLongForm) {
        // Restore previously saved long form state
        const actualHistory = existingAccidentHistory || [];
        const actualDetails = existingAccidentDetails || '';

        if (shortFormAccidentCount > 0 || actualHistory.length > 0) {
          hasAccidentsState = true;
        } else if (actualDetails === '__YES_NO_DETAILS__') {
          hasAccidentsState = true;
        } else if (actualDetails.trim() !== '' && actualDetails !== '__YES_NO_DETAILS__') {
          hasAccidentsState = true;
        } else {
          hasAccidentsState = false;
        }

        accidentHistoryToSet = actualHistory;
        accidentDetailsToSet = actualDetails === '__YES_NO_DETAILS__' ? '' : actualDetails;
        accidentCountToSet = shortFormAccidentCount;
      } else {
        // First time on this page — pre-populate from short form count
        if (shortFormAccidentCount > 0) {
          hasAccidentsState = true;
          accidentHistoryToSet = Array.from({ length: shortFormAccidentCount }, () => ({
            ...new ApplicantAccidentEntity(),
            number_of_injured: 0,
            number_of_fatalaties: 0,
          }));
          accidentCountToSet = shortFormAccidentCount;
        } else {
          hasAccidentsState = false;
          accidentHistoryToSet = [];
          accidentCountToSet = 0;
        }
      }

      form.setValues({
        ...form.values,
        accident_count: accidentCountToSet,
        accident_history: accidentHistoryToSet,
        accident_details: accidentDetailsToSet,
        has_accidents: hasAccidentsState,
      });

      initializedRef.current = true;
    }
  }, [applicant?.id]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // REASON: Form object intentionally excluded to prevent infinite loop

  // Auto-update accident count based on accident history length
  useEffect(() => {
    const accidentHistoryLength = form.values.accident_history?.length || 0;
    if (form.values.accident_count !== accidentHistoryLength) {
      form.setFieldValue('accident_count', accidentHistoryLength);
    }
  }, [form.values.accident_history, form.values.accident_count]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // REASON: form.setFieldValue intentionally excluded - guard condition prevents infinite loops

  // Extract complex conditions into variables
  const hasAccidents = form.values.has_accidents === true;
  const hasAccidentHistory = form.values?.accident_history?.length > 0;
  const showAccidentDetails = hasAccidents;

  const handleHasAccidentsChange = (value: string) => {
    console.log('value', value);
    const hasAccidentsValue = value === BooleanType.YES;
    form.setFieldValue('has_accidents', hasAccidentsValue);
    form.setFieldTouched('has_accidents', true);

    // Force validation to run immediately
    setTimeout(() => {
      form.validateForm();
    }, 0);

    if (hasAccidentsValue) {
      // When user says yes, ensure count starts at 0 and will be updated by useEffect
      form.setFieldValue('accident_count', 0);
      // Automatically add first accident entry if none exist
      if (!form.values.accident_history || form.values.accident_history.length === 0) {
        const newAccident = {
          ...new ApplicantAccidentEntity(),
          number_of_injured: 0,
          number_of_fatalaties: 0,
        };
        form.setFieldValue('accident_history', [newAccident]);
      }
    } else {
      // Clear all accident data if user says no and set count to 0
      form.setFieldValue('accident_history', []);
      form.setFieldValue('accident_details', '');
      form.setFieldValue('accident_count', 0);
    }
  };

  const handleRemoveAccident = (indexToRemove: number) => {
    const filteredHistory = form.values?.accident_history.filter((v, idx) => indexToRemove !== idx);
    form.setFieldValue('accident_history', filteredHistory);
  };

  const handleAddAccident = () => {
    const newAccident = {
      ...new ApplicantAccidentEntity(),
      number_of_injured: 0,
      number_of_fatalaties: 0,
    };
    const newAccidentHistory = [...(form.values?.accident_history || []), newAccident];
    form.setFieldValue('accident_history', newAccidentHistory);
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
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
    return fiveYearsAgo.toISOString().split('T')[0];
  };

  const getHasAccidentsValue = () => {
    if (form.values.has_accidents === true) return BooleanType.YES;
    if (form.values.has_accidents === false) return BooleanType.NO;
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
        {t('ACCIDENT_HISTORY')}
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
          We need to know about any accidents you have been involved in. This information helps us
          assess your driving record and ensure compliance with safety regulations.
        </p>
        <p style={{ margin: 0, fontWeight: '600', color: '#0066cc', fontSize: '1rem' }}>
          ⏰ Please report only accidents from the past 5 years.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div className={styles.formContainer}>
          {/* Primary Question: Have you had any accidents? */}
          <div className="my-4">
            <RadioGroup
              name="has_accidents"
              label={t('HAVE_YOU_HAD_ACCIDENTS_LAST_5_YEARS')}
              enumType={BooleanType}
              value={getHasAccidentsValue()}
              onChange={handleHasAccidentsChange}
              required
              error={
                form.touched.has_accidents && form.values.has_accidents === null
                  ? 'Please select whether you have had any accidents'
                  : undefined
              }
              labelPrefix="BooleanType"
              columns={2}
              variant="card"
              helperText="Include all accidents in the last 5 years, regardless of fault"
            />
          </div>

          {/* Accident Details Section */}
          {showAccidentDetails && (
            <div className="my-4">
              <div className={styles.formCard}>
                <h5 className={styles.formCardTitle}>Accident Information</h5>

                {/* General Description */}
                <div className="mb-4">
                  <BaseTextArea
                    name="accident_details"
                    label="General Description of Accidents"
                    placeholder="Please provide a brief overview of the accidents you have been involved in..."
                    formik={form}
                    rows={3}
                  />
                  <small className="text-muted">
                    Provide a general summary before adding specific details below
                  </small>
                </div>

                {/* Specific Accident Details */}
                <div className="mb-5">
                  <h6 className={styles.formSectionHeading}>Specific Accident Details</h6>
                  <p
                    style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}
                  >
                    Please add detailed information for each accident. You currently have{' '}
                    <strong>{form.values.accident_history?.length || 0}</strong> accident(s)
                    recorded.
                  </p>
                </div>

                {/* Accident History List - Always show when hasAccidents is true */}
                {hasAccidents && form.values.accident_history && form.values.accident_history.length > 0 && (
                  <div className="mb-4">
                    {form.values.accident_history.map((accident, i) => (
                      <Card
                        key={i}
                        className="mb-3 mt-3"
                        style={{ border: '1px solid var(--medium-gray)' }}
                      >
                        <Card.Header className={styles.formCardHeader}>
                          <h6 className={styles.formCardTitle}>Accident #{i + 1}</h6>
                          <button
                            type="button"
                            onClick={() => handleRemoveAccident(i)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--danger)',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                            title="Remove this accident"
                          >
                            <TrashFill size={16} />
                          </button>
                        </Card.Header>
                        <Card.Body className={styles.formCardBody}>
                          <Row className="g-3">
                            <div className="col-md-6">
                              <Input
                                name={`accident_history[${i}].date_of_accident`}
                                type="date"
                                label="Date of Accident"
                                placeholder="Select date"
                                value={formatDateForInput(accident.date_of_accident)}
                                onChange={(e) => {
                                  const inputValue = e.target.value;
                                  if (inputValue) {
                                    const selectedDate = new Date(inputValue);
                                    const minDate = new Date(getMinDate());

                                    if (selectedDate < minDate) {
                                      alert('You only need to enter accidents from the past 5 years.');
                                      return;
                                    }

                                    form.setFieldValue(
                                      `accident_history[${i}].date_of_accident`,
                                      selectedDate
                                    );
                                  } else {
                                    form.setFieldValue(
                                      `accident_history[${i}].date_of_accident`,
                                      null
                                    );
                                  }
                                }}
                                onBlur={form.handleBlur}
                                required={
                                  !!(
                                    accident.nature_of_accident ||
                                    accident.location_of_accident ||
                                    (accident.number_of_injured !== undefined &&
                                      accident.number_of_injured !== null) ||
                                    (accident.number_of_fatalaties !== undefined &&
                                      accident.number_of_fatalaties !== null)
                                  )
                                }
                                min={getMinDate()}
                                max={getMaxDate()}
                                error={getNestedError(`accident_history.${i}.date_of_accident`)}
                                icon={<span>📅</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`accident_history[${i}].location_of_accident`}
                                label="Location of Accident"
                                placeholder="City, State or specific location"
                                value={accident.location_of_accident || ''}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                required={
                                  !!(
                                    accident.date_of_accident ||
                                    accident.nature_of_accident ||
                                    (accident.number_of_injured !== undefined &&
                                      accident.number_of_injured !== null) ||
                                    (accident.number_of_fatalaties !== undefined &&
                                      accident.number_of_fatalaties !== null)
                                  )
                                }
                                error={getNestedError(`accident_history.${i}.location_of_accident`)}
                              />
                            </div>
                            <div className="col-12">
                              <Input
                                name={`accident_history[${i}].nature_of_accident`}
                                label="Nature/Description of Accident"
                                placeholder="Brief description of what happened"
                                value={accident.nature_of_accident || ''}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                required={
                                  !!(
                                    accident.date_of_accident ||
                                    accident.location_of_accident ||
                                    (accident.number_of_injured !== undefined &&
                                      accident.number_of_injured !== null) ||
                                    (accident.number_of_fatalaties !== undefined &&
                                      accident.number_of_fatalaties !== null)
                                  )
                                }
                                error={getNestedError(`accident_history.${i}.nature_of_accident`)}
                                icon={<span>📝</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`accident_history[${i}].number_of_injured`}
                                type="number"
                                label="Number of People Injured"
                                placeholder="0"
                                value={accident.number_of_injured?.toString() || ''}
                                onChange={(e) => {
                                  let value = parseInt(e.target.value) || 0;
                                  value = Math.min(Math.max(value, 0), 999); // Cap at 999
                                  form.setFieldValue(
                                    `accident_history[${i}].number_of_injured`,
                                    value
                                  );
                                }}
                                onBlur={form.handleBlur}
                                required={
                                  !!(
                                    accident.date_of_accident ||
                                    accident.location_of_accident ||
                                    accident.nature_of_accident ||
                                    (accident.number_of_fatalaties !== undefined &&
                                      accident.number_of_fatalaties !== null)
                                  )
                                }
                                min="0"
                                max="999"
                                error={getNestedError(`accident_history.${i}.number_of_injured`)}
                                icon={<span>🏥</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Input
                                name={`accident_history[${i}].number_of_fatalaties`}
                                type="number"
                                label="Number of Fatalities"
                                placeholder="0"
                                value={accident.number_of_fatalaties?.toString() || ''}
                                onChange={(e) => {
                                  let value = parseInt(e.target.value) || 0;
                                  value = Math.min(Math.max(value, 0), 999); // Cap at 999
                                  form.setFieldValue(
                                    `accident_history[${i}].number_of_fatalaties`,
                                    value
                                  );
                                }}
                                onBlur={form.handleBlur}
                                required={
                                  !!(
                                    accident.date_of_accident ||
                                    accident.location_of_accident ||
                                    accident.nature_of_accident ||
                                    (accident.number_of_injured !== undefined &&
                                      accident.number_of_injured !== null)
                                  )
                                }
                                min="0"
                                max="999"
                                error={getNestedError(`accident_history.${i}.number_of_fatalaties`)}
                                icon={<span>⚠️</span>}
                              />
                            </div>
                            <div className="col-md-6">
                              <Checkbox
                                name={`accident_history[${i}].at_fault`}
                                label="I was at fault for this accident"
                                checked={accident.at_fault || false}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    `accident_history[${i}].at_fault`,
                                    e.target.checked
                                  );
                                }}
                                helperText="Check if you were determined to be at fault"
                              />
                            </div>
                            <div className="col-md-6">
                              <Checkbox
                                name={`accident_history[${i}].dot_recordable`}
                                label="DOT Recordable Accident"
                                checked={accident.dot_recordable || false}
                                onChange={(e) => {
                                  form.setFieldValue(
                                    `accident_history[${i}].dot_recordable`,
                                    e.target.checked
                                  );
                                }}
                                helperText="Check if this was a DOT recordable accident"
                              />
                            </div>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Add Accident Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleAddAccident}
                    className={styles.addAnotherButton}
                  >
                    <PlusCircle size={16} />
                    Add Another Accident
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

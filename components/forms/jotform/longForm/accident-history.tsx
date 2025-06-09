import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Form, Row, Card } from 'react-bootstrap';
import { PlusCircle, TrashFill } from 'react-bootstrap-icons';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantAccidentEntity } from '../../../../models/applicant/applicant-accidentr.entity';
import { AccidentHistoryDto } from '../../../../models/jot-form/long-form/accident-history.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { BooleanType } from '../../../../enums/jotform/boolean-type.enum';
import { FormActions } from '../form-buttons';
import { Input, RadioGroup, Checkbox } from '../../../shared/dha';
import BaseTextArea from '../../base-text-area';

export function AccidentHistory() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  // Simple validation - just require the user to select yes/no, everything else is optional
  const validationSchema = yup.object({
    has_accidents: yup
      .boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select whether you have had any accidents',
        (value) => value !== null
      ),
    // All other fields are optional - the original DTO doesn't require them
    accident_count: yup.number().min(0).nullable(),
    accident_details: yup.string().nullable(),
    accident_history: yup.array().of(ApplicantAccidentEntity.yupSchema()),
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
        // Only submit the actual DTO fields, not the UI-only has_accidents field
        const { accident_count, accident_history, accident_details } = values;
        setApplicant({
          ...applicant,
          accident_count,
          accident_details,
          accident_history,
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
    const existingAccidentCount = applicant.accident_count || 0;
    const existingAccidentHistory = applicant.accident_history || [];
    const hasExistingAccidents = existingAccidentCount > 0 || existingAccidentHistory.length > 0;

    form.setValues({
      ...form.values,
      accident_count: existingAccidentCount,
      accident_history: existingAccidentHistory,
      accident_details: applicant?.accident_details || '',
      has_accidents: hasExistingAccidents ? true : null,
    });
  }, [applicant]);

  // Auto-update accident count based on accident history length
  useEffect(() => {
    const accidentHistoryLength = form.values.accident_history?.length || 0;
    if (form.values.accident_count !== accidentHistoryLength) {
      form.setFieldValue('accident_count', accidentHistoryLength);
    }
  }, [form.values.accident_history]);

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
        <p style={{ margin: 0 }}>
          We need to know about any accidents you have been involved in during the last 5 years.
          This information helps us assess your driving record and ensure compliance with safety
          regulations.
        </p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
              <div
                style={{
                  padding: '1.5rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                }}
              >
                <h5 style={{ marginBottom: '1rem', color: '#495057' }}>Accident Information</h5>

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
                <div className="mb-3">
                  <h6 style={{ color: '#495057', marginBottom: '1rem' }}>
                    Specific Accident Details
                  </h6>
                  <p style={{ fontSize: '0.9rem', color: '#6c757d', marginBottom: '1rem' }}>
                    Please add detailed information for each accident. You currently have{' '}
                    <strong>{form.values.accident_history?.length || 0}</strong> accident(s)
                    recorded.
                  </p>
                </div>

                {/* Accident History List */}
                {hasAccidentHistory && (
                  <div className="mb-4">
                    {form.values.accident_history.map((accident, i) => (
                      <Card
                        key={i}
                        className="mb-3"
                        style={{ border: '1px solidrgb(134, 142, 150)' }}
                      >
                        <Card.Header
                          style={{
                            backgroundColor: '#ffffff',
                            borderBottom: '1px solid #dee2e6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <h6 style={{ margin: 0, color: '#495057' }}>Accident #{i + 1}</h6>
                          <button
                            type="button"
                            onClick={() => handleRemoveAccident(i)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#dc3545',
                              cursor: 'pointer',
                              padding: '0.25rem',
                            }}
                            title="Remove this accident"
                          >
                            <TrashFill size={16} />
                          </button>
                        </Card.Header>
                        <Card.Body style={{ padding: '1.5rem' }}>
                          <Row className="g-3">
                            <div className="col-md-6">
                              <Input
                                name={`accident_history[${i}].date_of_accident`}
                                type="date"
                                label="Date of Accident"
                                placeholder="Select date"
                                value={formatDateForInput(accident.date_of_accident)}
                                onChange={(e) => {
                                  const value = e.target.value ? new Date(e.target.value) : null;
                                  form.setFieldValue(
                                    `accident_history[${i}].date_of_accident`,
                                    value
                                  );
                                }}
                                onBlur={form.handleBlur}
                                required
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
                                required
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
                                required
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
                                  const value = parseInt(e.target.value) || 0;
                                  form.setFieldValue(
                                    `accident_history[${i}].number_of_injured`,
                                    value
                                  );
                                }}
                                onBlur={form.handleBlur}
                                required
                                min="0"
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
                                  const value = parseInt(e.target.value) || 0;
                                  form.setFieldValue(
                                    `accident_history[${i}].number_of_fatalaties`,
                                    value
                                  );
                                }}
                                onBlur={form.handleBlur}
                                required
                                min="0"
                                error={
                                  form.touched.accident_history?.[i]?.number_of_fatalaties &&
                                  form.errors.accident_history?.[i]?.number_of_fatalaties
                                    ? String(form.errors.accident_history[i].number_of_fatalaties)
                                    : undefined
                                }
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
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.75rem 1.5rem',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#0056b3';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#007bff';
                    }}
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

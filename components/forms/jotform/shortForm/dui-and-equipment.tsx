import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { PlusCircle, Trash } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExperienceEntity } from '../../../../models/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, Select, EquipmentCard, Button } from '../../../shared/dha';

export function DuiAndEquipment() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      equipment_experience: [],
    },
    validationSchema: yup.object({
      equipment_experience: (yup.array(ApplicantExperienceEntity.yupSchema()) as any).unique(
        'type',
        { mapper: ApplicantExperienceEntity.key }
      ),
      has_past_dui: yup.bool().nullable(),
      dui_years: yup
        .array(
          yup
            .number()
            .min(new Date().getFullYear() - 5)
            .max(new Date().getFullYear())
        )
        .nullable(),
    }),
    onSubmit: ({ equipment_experience }) => {
      setApplicant({
        ...applicant,
        equipment_experience,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { equipment_experience } = applicant;

    const initialValues = {
      equipment_experience: equipment_experience || [],
    };

    // Set values and reset form state to clear any validation errors
    form.setValues(initialValues, false);
    form.setTouched({}, false);
    form.setErrors({});

    // Validate form after initial value set with a small delay to ensure state is updated
    setTimeout(() => {
      form.validateForm();
    }, 0);
  }, [applicant]);

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

  const addEquipmentExperience = () => {
    form.setFieldValue('equipment_experience', [
      ...(form.values?.equipment_experience || []),
      new ApplicantExperienceEntity(),
    ]);
  };

  const removeEquipmentExperience = (index: number) => {
    const newExperiences = form.values?.equipment_experience?.filter((_, idx) => idx !== index);
    form.setFieldValue('equipment_experience', newExperiences);
  };

  const getFieldError = (fieldName: string) => {
    const touched = form.touched as any;
    const errors = form.errors as any;
    return touched[fieldName] && errors[fieldName] ? String(errors[fieldName]) : undefined;
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('EQUIPMENT_DRIVEN')}
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
          📋 {t('EQUIPMENT_EXPERIENCE_HELP_TITLE')}
        </p>
        <p style={{ margin: 0 }}>{t('EQUIPMENT_EXPERIENCE_HELP_TEXT')}</p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <EquipmentCard
            title="equipment_experience"
            actions={
              <Button
                size="sm"
                variant="outline"
                icon={<PlusCircle />}
                onClick={addEquipmentExperience}
                className="ml-2"
              >
                {t('ADD')}
              </Button>
            }
          >
            {form.values?.equipment_experience?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {form.values?.equipment_experience.map((entity, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '1.5rem',
                      border: '2px solid #e0e5eb',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1rem',
                        alignItems: 'end',
                      }}
                    >
                      <Select
                        name={`equipment_experience[${i}].type`}
                        label={t('TYPE')}
                        placeholder="SELECT_EQUIPMENT_TYPE"
                        labelPrefix="JobEquipmentType"
                        enumType={JobEquipmentType}
                        value={entity.type || ''}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        error={getFieldError(`equipment_experience[${i}].type`)}
                        required
                      />

                      <Input
                        name={`equipment_experience[${i}].years`}
                        label={t('YEARS')}
                        placeholder={t('PLACEHOLDER_FOR_DIGITS')}
                        type="number"
                        value={entity.years?.toString() || ''}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        error={getFieldError(`equipment_experience[${i}].years`)}
                        helperText="Enter years of experience with this equipment"
                        required
                      />
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1rem',
                      }}
                    >
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash />}
                        onClick={() => removeEquipmentExperience(i)}
                      >
                        {t('REMOVE')}
                      </Button>
                    </div>

                    {entity.type === JobEquipmentType.OTHER && (
                      <div style={{ marginTop: '1rem' }}>
                        <Input
                          name={`equipment_experience[${i}].type_other`}
                          label={t('OTHER_EQUIPMENT_TYPE')}
                          placeholder={t('SPECIFY_OTHER_EQUIPMENT')}
                          value={entity.type_other || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_experience[${i}].type_other`)}
                          helperText="Please specify the type of equipment"
                          required
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </EquipmentCard>
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

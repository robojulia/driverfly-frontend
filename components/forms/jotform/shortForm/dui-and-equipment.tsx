import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { PlusCircle, Trash } from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExperienceEntity } from '../../../../models/applicant';
import { ApplicantEquipmentEntity } from '../../../../models/applicant/applicant-equipment.entity';
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
      equipment_owned: [],
    },
    validationSchema: yup.object({
      equipment_experience: (yup.array(ApplicantExperienceEntity.yupSchemaForImport()) as any)
        .unique('type', { mapper: ApplicantExperienceEntity.key })
        .test('no-negative-years', 'Years of experience cannot be negative', function (value) {
          if (!value || !Array.isArray(value)) return true;

          for (const experience of value) {
            if (
              experience.years !== null &&
              experience.years !== undefined &&
              experience.years < 1
            ) {
              return this.createError({
                path: `${this.path}[${value.indexOf(experience)}].years`,
                message: 'Years of experience must be at least 1',
              });
            }
          }
          return true;
        }),
      equipment_owned: (yup.array(ApplicantEquipmentEntity.yupSchema()) as any)
        .unique('type', { mapper: ApplicantEquipmentEntity.key }),
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
    onSubmit: ({ equipment_experience, equipment_owned }) => {
      setApplicant({
        ...applicant,
        equipment_experience,
        equipment_owned: applicant.is_owner_operator ? equipment_owned : [],
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { equipment_experience, equipment_owned } = applicant;

    const initialValues = {
      equipment_experience: equipment_experience || [],
      equipment_owned: equipment_owned || [],
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

  const addEquipmentOwned = () => {
    form.setFieldValue('equipment_owned', [
      ...(form.values?.equipment_owned || []),
      new ApplicantEquipmentEntity(),
    ]);
  };

  const removeEquipmentOwned = (index: number) => {
    const newEquipment = form.values?.equipment_owned?.filter((_, idx) => idx !== index);
    form.setFieldValue('equipment_owned', newEquipment);
  };

  const getFieldError = (fieldName: string) => {
    const touched = form.touched as any;
    const errors = form.errors as any;
    return touched[fieldName] && errors[fieldName] ? String(errors[fieldName]) : undefined;
  };

  const handleYearsChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    // Prevent negative values and values greater than 100
    if (value < 0) {
      form.setFieldValue(`equipment_experience[${index}].years`, 1);
      return;
    }

    if (value > 100) {
      form.setFieldValue(`equipment_experience[${index}].years`, 100);
      return;
    }

    // Use formik's handleChange for normal values
    form.handleChange(e);
  };

  const handleStartYearChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const startYear = parseInt(e.target.value);
    form.setFieldValue(`equipment_experience[${index}].start_year`, startYear);

    const endYear = form.values.equipment_experience?.[index]?.end_year;
    if (startYear && endYear && endYear >= startYear) {
      const calculatedYears = endYear - startYear;
      form.setFieldValue(`equipment_experience[${index}].years`, calculatedYears);
    }
  };

  const handleEndYearChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const endYear = parseInt(e.target.value);
    form.setFieldValue(`equipment_experience[${index}].end_year`, endYear);

    const startYear = form.values.equipment_experience?.[index]?.start_year;
    if (startYear && endYear && endYear >= startYear) {
      const calculatedYears = endYear - startYear;
      form.setFieldValue(`equipment_experience[${index}].years`, calculatedYears);
    }
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('EQUIPMENT_DRIVEN')}
      </h1>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <EquipmentCard
            title="equipment_experience"
            emptyStateText={t('NO_EQUIPMENT_EXPERIENCE_PROVIDED')}
            emptyStateSubtext={t('CLICK_ADD_TO_GET_STARTED')}
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
                        name={`equipment_experience[${i}].start_year`}
                        label={t('START_YEAR')}
                        placeholder={t('ENTER_START_YEAR')}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear().toString()}
                        value={entity.start_year?.toString() || ''}
                        onChange={handleStartYearChange(i)}
                        onBlur={form.handleBlur}
                        error={getFieldError(`equipment_experience[${i}].start_year`)}
                        helperText="Year you started using this equipment"
                      />

                      <Input
                        name={`equipment_experience[${i}].end_year`}
                        label={t('END_YEAR')}
                        placeholder={t('ENTER_END_YEAR')}
                        type="number"
                        min="1900"
                        max={new Date().getFullYear().toString()}
                        value={entity.end_year?.toString() || ''}
                        onChange={handleEndYearChange(i)}
                        onBlur={form.handleBlur}
                        error={getFieldError(`equipment_experience[${i}].end_year`)}
                        helperText="Year you stopped using this equipment"
                      />

                      <Input
                        name={`equipment_experience[${i}].years`}
                        label={t('YEARS')}
                        placeholder={t('AUTO_CALCULATED')}
                        type="number"
                        min="1"
                        max="100"
                        value={entity.years?.toString() || ''}
                        onChange={handleYearsChange(i)}
                        onBlur={form.handleBlur}
                        error={getFieldError(`equipment_experience[${i}].years`)}
                        helperText="Total years (auto-calculated from start/end year)"
                        disabled={!!(entity.start_year && entity.end_year)}
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

          {/* Equipment Owned Section - Only shows for Owner Operators */}
          {applicant.is_owner_operator && (
            <EquipmentCard
              title="EQUIPMENT_OWNED"
              emptyStateText={t('NO_EQUIPMENT_OWNED_PROVIDED')}
              emptyStateSubtext={t('CLICK_ADD_TO_ADD_YOUR_EQUIPMENT')}
              actions={
                <Button
                  size="sm"
                  variant="outline"
                  icon={<PlusCircle />}
                  onClick={addEquipmentOwned}
                  className="ml-2"
                >
                  {t('ADD')}
                </Button>
              }
            >
              {form.values?.equipment_owned?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {form.values?.equipment_owned.map((entity, i) => (
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
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '1rem',
                          alignItems: 'end',
                        }}
                      >
                        <Select
                          name={`equipment_owned[${i}].type`}
                          label={t('TYPE')}
                          placeholder="SELECT_EQUIPMENT_TYPE"
                          labelPrefix="JobEquipmentType"
                          enumType={JobEquipmentType}
                          value={entity.type || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_owned[${i}].type`)}
                          required
                        />

                        <Input
                          name={`equipment_owned[${i}].quantity`}
                          label={t('QUANTITY')}
                          placeholder={t('ENTER_QUANTITY')}
                          type="number"
                          min="1"
                          value={entity.quantity?.toString() || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_owned[${i}].quantity`)}
                          required
                        />

                        <Input
                          name={`equipment_owned[${i}].make`}
                          label={t('MAKE')}
                          placeholder={t('ENTER_MAKE')}
                          value={entity.make || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_owned[${i}].make`)}
                        />

                        <Input
                          name={`equipment_owned[${i}].model`}
                          label={t('MODEL')}
                          placeholder={t('ENTER_MODEL')}
                          value={entity.model || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_owned[${i}].model`)}
                        />

                        <Input
                          name={`equipment_owned[${i}].year`}
                          label={t('YEAR')}
                          placeholder={t('ENTER_YEAR')}
                          type="number"
                          min="1900"
                          max={new Date().getFullYear().toString()}
                          value={entity.year?.toString() || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          error={getFieldError(`equipment_owned[${i}].year`)}
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
                          onClick={() => removeEquipmentOwned(i)}
                        >
                          {t('REMOVE')}
                        </Button>
                      </div>

                      {entity.type === JobEquipmentType.OTHER && (
                        <div style={{ marginTop: '1rem' }}>
                          <Input
                            name={`equipment_owned[${i}].type_other`}
                            label={t('OTHER_EQUIPMENT_TYPE')}
                            placeholder={t('SPECIFY_OTHER_EQUIPMENT')}
                            value={entity.type_other || ''}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={getFieldError(`equipment_owned[${i}].type_other`)}
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

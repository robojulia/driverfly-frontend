import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { JobGeography } from '../../../../enums/jobs/job-geography.enum';
import { JobSchedule } from '../../../../enums/jobs/job-schedule.enum';
import { BooleanPreferenceType } from '../../../../enums/users/boolean-preferences.enum';
import { OtherRequirementType } from '../../../../enums/users/other-requirements.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { PreferencesDto } from '../../../../models/jot-form/long-form/preferences.dto';
import ApplicantApi from '../../../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../../../utils/ajax';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { CheckboxGroup, Select, Banner } from '../../../shared/dha';

export function Preferences() {
  const {
    state: { applicant, applicantExtras, jobs, utm, company },
    method: { setApplicant, setApplicantExtras, updateApplicantExtras, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useFormik({
    initialValues: new PreferencesDto(),
    validationSchema: PreferencesDto.yupSchema(),
    onSubmit: async (values) => {
      const applicantApi = new ApplicantApi();
      console.log('values', values);

      try {
        const { routes, REQUIRE_W2_EMPLOYMENT, OTHER_ABSOLUTELY_REQUIREMENTS, preferred_location } =
          values;

        // Update applicant preferences
        setApplicant({ ...applicant, preferred_location, routes });
        updateApplicantExtras(REQUIRE_W2_EMPLOYMENT);
        updateApplicantExtras(OTHER_ABSOLUTELY_REQUIREMENTS);

        const data = await applicantApi.jotform.create(company.id, {
          applicant: { ...applicant, preferred_location, routes },
          applicantExtras,
          jobs,
          utm,
        });

        setApplicantExtras(data?.extras);
        setApplicant({
          ...applicant,
          ...data,
        });

        stepNext();
      } catch (error) {
        console.log(error);

        // Check if it's a conflict error with a translatable message
        if (error?.response?.data?.statusCode === 409 && error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          // Use the global handler for other types of errors
          globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
        }
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const apx_w2 = applicantExtras?.find((v) => v.type == ApplicantExtras.REQUIRE_W2_EMPLOYMENT);
    const apx_other = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS
    );

    const initialValues = {
      ...form.values,
      routes: applicant.routes || [],
      REQUIRE_W2_EMPLOYMENT: !!apx_w2?.type
        ? apx_w2
        : new ApplicantExtrasEntity(ApplicantExtras.REQUIRE_W2_EMPLOYMENT),
      OTHER_ABSOLUTELY_REQUIREMENTS: !!apx_other?.type
        ? apx_other
        : new ApplicantExtrasEntity(ApplicantExtras.OTHER_ABSOLUTELY_REQUIREMENTS),
      preferred_location: applicant.preferred_location || [],
    };

    // Set values and reset form state to clear any validation errors
    form.setValues(initialValues, false);
    form.setTouched({}, false);
    form.setErrors({});

    // Validate form after initial value set with a small delay to ensure state is updated
    setTimeout(() => {
      form.validateForm();
    }, 0);
  }, [applicant, applicantExtras]);

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

  const handlePreferredLocationChange = (values: string[]) => {
    form.setFieldValue('preferred_location', values);
  };

  const handleRoutesChange = (values: string[]) => {
    form.setFieldValue('routes', values);
  };

  const handleRequirementsChange = (values: string[]) => {
    form.setFieldValue('OTHER_ABSOLUTELY_REQUIREMENTS.value', values);
  };

  const getFieldError = (fieldName: string) => {
    const touched = form.touched as any;
    const errors = form.errors as any;
    return touched[fieldName] && errors[fieldName] ? String(errors[fieldName]) : undefined;
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('PREFERENCES')}
      </h1>

      {errorMessage && (
        <Banner message={t(errorMessage)} variant="error" onDismiss={() => setErrorMessage(null)} />
      )}

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
          🎯 {t('PREFERENCES_HELP_TITLE')}
        </p>
        <p style={{ margin: 0 }}>{t('PREFERENCES_HELP_TEXT')}</p>
      </div>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Preferred Location Section */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckboxGroup
              name="preferred_location"
              label={t('PREFERRED_LOCATION')}
              enumType={JobGeography}
              labelPrefix="JobGeography"
              value={form.values.preferred_location || []}
              onChange={handlePreferredLocationChange}
              error={getFieldError('preferred_location')}
              helperText={t('SELECT_ALL_LOCATIONS_YOU_PREFER')}
              variant="card"
              columns={2}
            />
          </div>

          {/* Routes Section */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckboxGroup
              name="routes"
              label={t('ROUTES_YOU_OPEN_FOR')}
              enumType={JobSchedule}
              labelPrefix="JobSchedule"
              value={form.values.routes || []}
              onChange={handleRoutesChange}
              error={getFieldError('routes')}
              helperText={t('SELECT_ALL_ROUTE_TYPES_YOU_ARE_OPEN_TO')}
              variant="card"
              columns={2}
            />
          </div>

          {/* W2 Employment Requirement - Only show if not owner operator */}
          {!applicant.is_owner_operator && (
            <div style={{ marginBottom: '2rem' }}>
              <Select
                name="REQUIRE_W2_EMPLOYMENT.value"
                label={t('DO_YOU_REQUIRE_W2_EMPLOYMET')}
                placeholder="CHOOSE"
                labelPrefix="BooleanPreferenceType"
                enumType={BooleanPreferenceType}
                value={form.values.REQUIRE_W2_EMPLOYMENT?.value || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={getFieldError('REQUIRE_W2_EMPLOYMENT.value')}
                helperText={t('SELECT_YOUR_EMPLOYMENT_PREFERENCE')}
              />
            </div>
          )}

          {/* Other Requirements Section */}
          <div style={{ marginBottom: '2rem' }}>
            <CheckboxGroup
              name="OTHER_ABSOLUTELY_REQUIREMENTS.value"
              label={t('NECESSARY_REQUIREMENTS')}
              enumType={OtherRequirementType}
              labelPrefix="OtherRequirementType"
              value={form.values.OTHER_ABSOLUTELY_REQUIREMENTS?.value || []}
              onChange={handleRequirementsChange}
              error={getFieldError('OTHER_ABSOLUTELY_REQUIREMENTS.value')}
              helperText={t('SELECT_ALL_REQUIREMENTS_THAT_ARE_ABSOLUTELY_NECESSARY')}
              variant="card"
              columns={1}
            />
          </div>
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

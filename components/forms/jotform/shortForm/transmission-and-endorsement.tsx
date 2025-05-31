import { useFormik } from 'formik';
import { useContext, useEffect } from 'react';
import { Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { LicenseRestrictions } from '../../../../enums/applicants/applicant-license-restrictions-type.enum';
import { DriverEndorsement } from '../../../../enums/users/driver-endorsement.enum';
import { VehicleTransmissionType } from '../../../../enums/vehicles/vehicle-transmission-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, CheckboxGroup } from '../../../shared/dha';

export function TransmissionAndEndorsement() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      endorsements: [],
      transmission_type: [],
      license_restrictions: [],
      license_restrictions_other: null,
      endorsements_other: null,
    },
    validationSchema: yup.object({
      transmission_type: yup.array((yup.string() as any).enum(VehicleTransmissionType)).nullable(),
      endorsements: yup
        .array((yup.string() as any).enum(DriverEndorsement))
        .optional()
        .nullable(),
      license_restrictions: yup.array((yup.string() as any).enum(LicenseRestrictions)).nullable(),
      license_restrictions_other: yup
        .string()
        .trim()
        .when('license_restrictions', {
          is: (v) => v && v?.includes(LicenseRestrictions.OTHER),
          then: yup.string()?.trim()?.required(),
        })
        .nullable(),
      endorsements_other: yup
        .string()
        .trim()
        .when('endorsements', {
          is: (v) => v && v.includes(DriverEndorsement.OTHER),
          then: yup.string().trim().required(),
        })
        .nullable(),
    }),
    onSubmit: ({
      endorsements,
      endorsements_other,
      transmission_type,
      license_restrictions,
      license_restrictions_other,
    }) => {
      setApplicant({
        ...applicant,
        endorsements,
        endorsements_other,
        transmission_type,
        license_restrictions,
        license_restrictions_other,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const {
      endorsements,
      transmission_type,
      license_restrictions,
      license_restrictions_other,
      endorsements_other,
    } = applicant;

    const initialValues = {
      transmission_type: transmission_type || [],
      license_restrictions: license_restrictions || [],
      license_restrictions_other: license_restrictions_other || null,
      endorsements: endorsements || [],
      endorsements_other: endorsements_other || null,
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

  const handleTransmissionChange = (values: string[]) => {
    form.setFieldValue('transmission_type', values);
  };

  const handleEndorsementsChange = (values: string[]) => {
    form.setFieldValue('endorsements', values);
  };

  const handleLicenseRestrictionsChange = (values: string[]) => {
    form.setFieldValue('license_restrictions', values);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('CDL_ENDORSEMENT_AND_RESTRICTIONS')}
      </h1>

      <Form
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
        className={`${styles.align__text_left} ${styles.formStep}`}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="my-4">
            <p className="text-black mt-2 mb-3">
              <strong>{t('PLEASE_SELECT_ENDORSEMENT')}</strong>
            </p>
          </div>

          {/* Transmission Experience Section */}
          <div className="my-4">
            <CheckboxGroup
              name="transmission_type"
              label={t('TRANSMISSION_EXPERIENCE')}
              enumType={VehicleTransmissionType}
              value={form.values.transmission_type || []}
              onChange={handleTransmissionChange}
              labelPrefix="VehicleTransmissionType"
              columns={2}
              variant="card"
              error={
                form.touched.transmission_type && form.errors.transmission_type
                  ? String(form.errors.transmission_type)
                  : undefined
              }
            />
          </div>

          {/* Endorsements Section */}
          <div className="my-4">
            <CheckboxGroup
              name="endorsements"
              label={t('ENDORSEMENTS')}
              enumType={DriverEndorsement}
              value={form.values.endorsements || []}
              onChange={handleEndorsementsChange}
              labelPrefix="DriverEndorsement"
              columns={2}
              variant="card"
              error={
                form.touched.endorsements && form.errors.endorsements
                  ? String(form.errors.endorsements)
                  : undefined
              }
            />

            {form.values?.endorsements?.includes(DriverEndorsement.OTHER) && (
              <div className="mt-3">
                <Input
                  name="endorsements_other"
                  label={t('OTHER_ENDORSEMENTS')}
                  placeholder={t('OTHER_ENDORSEMENTS')}
                  value={form.values.endorsements_other || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.endorsements_other && form.errors.endorsements_other
                      ? String(form.errors.endorsements_other)
                      : undefined
                  }
                  helperText="Please specify your other endorsements"
                />
              </div>
            )}
          </div>

          {/* License Restrictions Section */}
          <div className="my-4">
            <CheckboxGroup
              name="license_restrictions"
              label={t('DHA_CDL_RESTRICTIONS')}
              enumType={LicenseRestrictions}
              value={form.values.license_restrictions || []}
              onChange={handleLicenseRestrictionsChange}
              labelPrefix="LicenseRestrictions"
              columns={2}
              variant="card"
              error={
                form.touched.license_restrictions && form.errors.license_restrictions
                  ? String(form.errors.license_restrictions)
                  : undefined
              }
            />

            {form.values?.license_restrictions?.includes(LicenseRestrictions.OTHER) && (
              <div className="mt-3">
                <Input
                  name="license_restrictions_other"
                  label={t('OTHER_LICENSE_RESTRICTIONS')}
                  placeholder={t('OTHER_LICENSE_RESTRICTIONS')}
                  value={form.values.license_restrictions_other || ''}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.license_restrictions_other &&
                    form.errors.license_restrictions_other
                      ? String(form.errors.license_restrictions_other)
                      : undefined
                  }
                  helperText="Please specify your other license restrictions"
                />
              </div>
            )}
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

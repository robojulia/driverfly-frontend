import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { PlusCircle, Trash } from 'react-bootstrap-icons';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { CdlExtras } from '../../../../models/jot-form/long-form/cdl-object/index.dto';
import { OtherQueuesDto } from '../../../../models/jot-form/long-form/other-queues.dto';
import { FormActions } from '../form-buttons';
import { Input, Select, MaskedInput, Button, EquipmentCard } from '../../../shared/dha';
import stateList from '../../../../utils/stateList';
import { getCDLFormat } from '../../../../utils/cdl-formats';
import styles from '../../../../styles/digitalhiringapp.module.css';

// Custom hook to detect screen size for responsive state list
const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isSmallScreen;
};

export function OtherQueues() {
  const {
    state: { applicantExtras },
    method: { updateApplicantExtras, setApplicantExtras, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const current_date = new Date();
  const [isFormValid, setIsFormValid] = useState(false);
  const isSmallScreen = useScreenSize();

  // Create responsive state list
  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

  // Handler to convert license numbers to uppercase
  const handleLicenseNumberChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue(`CDL_NUMBER.value[${index}].license_number`, uppercaseValue);
  };

  const form = useFormik({
    initialValues: new OtherQueuesDto(),
    validationSchema: OtherQueuesDto.yupSchema(),
    onSubmit: (values) => {
      try {
        console.log('valuesDTO', values);
        const { CDL_NUMBER } = values;

        // Check if there are any valid CDL licenses
        const hasValidLicenses =
          CDL_NUMBER?.value &&
          CDL_NUMBER.value.length > 0 &&
          CDL_NUMBER.value.some(
            (license) =>
              license.license_number?.trim() && license.state?.trim() && license.date?.trim()
          );

        if (hasValidLicenses) {
          // Update with valid CDL licenses
          updateApplicantExtras(CDL_NUMBER);
        } else {
          // Remove CDL_NUMBER entry entirely if no valid licenses
          setApplicantExtras(
            (prev) => prev?.filter((extra) => extra.type !== ApplicantExtras.CDL_NUMBER) || []
          );
        }
      } catch (error) {
        console.error('Error submitting other queues form:', error);
      }
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if form is valid
  useEffect(() => {
    const licenses = form.values.CDL_NUMBER?.value || [];
    const hasLicenses = licenses.length > 0;

    if (!hasLicenses) {
      // No licenses provided - form is valid
      setIsFormValid(true);
    } else {
      // Licenses provided - validate each one
      const allLicensesValid = licenses.every(
        (license) => !!license.license_number && !!license.state && !!license.date
      );
      const hasNoErrors = Object.keys(form.errors).length === 0;
      setIsFormValid(allLicensesValid && hasNoErrors);
    }
  }, [form.values, form.errors]);

  useEffect(() => {
    console.log('applicant extras', applicantExtras);
    const apx_cdl = applicantExtras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER);
    form.setValues({
      ...form.values,
      CDL_NUMBER: !!apx_cdl?.type ? apx_cdl : new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER),
    });
  }, [applicantExtras]);

  const addCDLLicense = () => {
    form.setFieldValue('CDL_NUMBER.value', [
      ...(form.values.CDL_NUMBER?.value || []),
      new CdlExtras(),
    ]);
  };

  const removeCDLLicense = (index: number) => {
    const newLicenses = form.values.CDL_NUMBER?.value?.filter((_, idx) => idx !== index);
    form.setFieldValue('CDL_NUMBER.value', newLicenses);
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

  const getFieldError = (fieldName: string) => {
    const touched = form.touched as any;
    const errors = form.errors as any;
    return touched[fieldName] && errors[fieldName] ? String(errors[fieldName]) : undefined;
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('HAVE_ANY_ACTIVE_DRIVERS_LICENSE')}
      </h1>

      <div
        style={{
          maxWidth: '100%',
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
          🚗 {t('ADDITIONAL_CDL_LICENSES_HELP_TITLE')}
        </p>
        <p style={{ margin: 0 }}>
          Please add any additional Commercial Driver&apos;s Licenses you hold from other states.
          Include the license number, issuing state, and expiration date for each.
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 0rem' }}>
          <EquipmentCard
            title="ADDITIONAL_CDL_LICENSES"
            emptyStateText="No additional CDL licenses provided"
            emptyStateSubtext="Click 'Add CDL Detail' to get started"
            actions={
              <Button
                size="sm"
                variant="outline"
                icon={<PlusCircle />}
                onClick={addCDLLicense}
                className="ml-2"
              >
                {t('TITLE_ADD_CDL_DETAIL')}
              </Button>
            }
          >
            {form.values.CDL_NUMBER?.value?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {form.values.CDL_NUMBER?.value?.map((entity, i) => {
                  const cdlFormat = getCDLFormat(entity.state || '');

                  return (
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
                          marginBottom: '1rem',
                        }}
                      >
                        <Select
                          name={`CDL_NUMBER.value[${i}].state`}
                          label={t('state_issued')}
                          placeholder={t('SELECT_STATE')}
                          options={responsiveStateList}
                          value={entity.state || ''}
                          onChange={(e) => {
                            form.setFieldValue(`CDL_NUMBER.value[${i}].state`, e.target.value);
                            // Clear license number when state changes
                            form.setFieldValue(`CDL_NUMBER.value[${i}].license_number`, '');
                          }}
                          onBlur={form.handleBlur}
                          required
                          error={getFieldError(`CDL_NUMBER.value[${i}].state`)}
                          helperText="Select the state where this CDL was issued"
                        />
                        <MaskedInput
                          name={`CDL_NUMBER.value[${i}].license_number`}
                          label={t("driver's_license_number")}
                          placeholder={cdlFormat.placeholder}
                          mask={cdlFormat.mask}
                          value={entity.license_number || ''}
                          onChange={handleLicenseNumberChange(i)}
                          onBlur={form.handleBlur}
                          required
                          disabled={!entity.state}
                          error={getFieldError(`CDL_NUMBER.value[${i}].license_number`)}
                          helperText={
                            entity.state ? t(cdlFormat.description) : 'Select state first'
                          }
                        />

                        <Input
                          name={`CDL_NUMBER.value[${i}].date`}
                          label={t('expiration_date')}
                          placeholder={t('expiration_date')}
                          type="date"
                          value={entity.date || ''}
                          onChange={form.handleChange}
                          onBlur={form.handleBlur}
                          required
                          error={getFieldError(`CDL_NUMBER.value[${i}].date`)}
                          helperText="Expiration date must be at least 6 months from today"
                        />
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash />}
                          onClick={() => removeCDLLicense(i)}
                        >
                          {t('REMOVE')}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </EquipmentCard>
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

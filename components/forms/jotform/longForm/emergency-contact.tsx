import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { EmergenyContactDto } from '../../../../models/jot-form/long-form/emergency-contact.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, DhaPhoneInput } from '../../../shared/dha';

export function EmergencyContact() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  const form = useFormik({
    initialValues: new EmergenyContactDto(),
    validationSchema: EmergenyContactDto.yupSchema(),
    onSubmit: (values) => {
      try {
        const { emergency_contact_name, emergency_contact_number, emergency_contact_relationship } =
          values;
        setApplicant({
          ...applicant,
          emergency_contact_name,
          emergency_contact_number,
          emergency_contact_relationship,
        });
        stepNext();
      } catch (error) {
        console.log(error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if any emergency contact field has data
  const hasAnyEmergencyContactData = !!(
    form.values.emergency_contact_name ||
    form.values.emergency_contact_number ||
    form.values.emergency_contact_relationship
  );

  // Check if form is valid
  useEffect(() => {
    const hasNoErrors = Object.keys(form.errors).length === 0;

    if (hasAnyEmergencyContactData) {
      // If any field is filled, all fields are required
      const allFieldsFilled = !!(
        form.values.emergency_contact_name &&
        form.values.emergency_contact_number &&
        form.values.emergency_contact_relationship
      );
      setIsFormValid(hasNoErrors && allFieldsFilled);
    } else {
      // If no fields are filled, form is valid as long as there are no errors
      setIsFormValid(hasNoErrors);
    }
  }, [form.values, form.errors, hasAnyEmergencyContactData]);

  useEffect(() => {
    const { emergency_contact_name, emergency_contact_number, emergency_contact_relationship } =
      applicant;
    form.setValues({
      emergency_contact_name: emergency_contact_name || '',
      emergency_contact_number: emergency_contact_number || '',
      emergency_contact_relationship: emergency_contact_relationship || '',
    });
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

  const emergencyAnyContactNote =
    hasAnyEmergencyContactData && !form.values.emergency_contact_name
      ? 'Name is required when emergency contact info is provided'
      : undefined;

  const emergencyPhoneNumberNote =
    hasAnyEmergencyContactData && !form.values.emergency_contact_number
      ? 'Phone number is required when emergency contact info is provided'
      : undefined;

  const emergencyRelationshipNote =
    hasAnyEmergencyContactData && !form.values.emergency_contact_relationship
      ? 'Relationship is required when emergency contact info is provided'
      : undefined;

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('EMERGENCY_CONTACT_DETAILS')}
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
          🚨 {t('EMERGENCY_CONTACT_HELP_TITLE')}
        </p>
        <p style={{ margin: 0 }}>
          Please provide an emergency contact who can be reached in case of an urgent situation
          while you&apos;re on duty. This information is optional but recommended.
        </p>
      </div>

      {/* Conditional requirement notice */}
      {hasAnyEmergencyContactData && (
        <div
          style={{
            maxWidth: '100%',
            margin: '0 auto 1rem auto',
            padding: '1rem',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            color: '#856404',
            fontSize: '0.95rem',
            lineHeight: '1.5',
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#856404' }}>
            ℹ️ Complete All Fields
          </p>
          <p style={{ margin: 0 }}>
            Since you&apos;ve started entering emergency contact information, please complete all
            fields (name, phone number, and relationship) to proceed.
          </p>
        </div>
      )}

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          {/* Emergency Contact Name - Full width */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Input
              name="emergency_contact_name"
              label={t('EMERGENCY_CONTACT_NAME')}
              placeholder={t('EMERGENCY_CONTACT_NAME')}
              value={form.values.emergency_contact_name || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required={hasAnyEmergencyContactData}
              error={
                form.touched.emergency_contact_name && form.errors.emergency_contact_name
                  ? String(form.errors.emergency_contact_name)
                  : emergencyAnyContactNote
              }
              autoComplete="name"
              helperText={
                hasAnyEmergencyContactData
                  ? 'Required when providing emergency contact'
                  : 'First and last name of your emergency contact (optional)'
              }
            />
          </div>

          {/* Phone Number and Relationship - Side by side on larger screens */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <DhaPhoneInput
              name="emergency_contact_number"
              label={t('PHONE_NUMBER')}
              placeholder="Phone Number"
              value={form.values.emergency_contact_number || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required={hasAnyEmergencyContactData}
              error={emergencyPhoneNumberNote}
              autoComplete="tel"
              helperText={
                hasAnyEmergencyContactData
                  ? 'Required when providing emergency contact'
                  : '10-digit phone number (optional)'
              }
            />

            <Input
              name="emergency_contact_relationship"
              label={t('RELATIONSHIP')}
              placeholder={t('RELATIONSHIP')}
              value={form.values.emergency_contact_relationship || ''}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required={hasAnyEmergencyContactData}
              error={
                form.touched.emergency_contact_relationship &&
                form.errors.emergency_contact_relationship
                  ? String(form.errors.emergency_contact_relationship)
                  : emergencyRelationshipNote
              }
              helperText={
                hasAnyEmergencyContactData
                  ? 'Required when providing emergency contact'
                  : 'e.g., Spouse, Parent, Sibling, Friend (optional)'
              }
            />
          </div>
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

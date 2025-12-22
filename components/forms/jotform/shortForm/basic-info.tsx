import React, { useEffect, useContext, useState } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row, Alert } from 'react-bootstrap';
import styles from '../../../../styles/digitalhiringapp.module.css';
import BaseSelect from '../../base-select';
import { useTranslation } from '../../../../hooks/use-translation';
import { ContactDto } from '../../../../models/jot-form/short-form/contact.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { BooleanTypeExtra } from '../../../../enums/jotform/bool-and-not-sure.enum';
import ApplicantApi from '../../../../pages/api/applicant';
import { LoaderIcon } from '../../../loading/loader-icon';
import { Input, MaskedInput } from '../../../shared/dha';
import { FormActions } from '../form-buttons';
import { normalizePhoneNumber } from '../../../../utils/phone-normalization';

export function BasicInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [emailExistsError, setEmailExistsError] = useState<string | null>(null);

  // Validate email to check if it exists with a different phone number
  const validateEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailExistsError(null);
      return;
    }

    try {
      const applicantApi = new ApplicantApi();
      const existingApplicants = await applicantApi.searchApplicantsByEmail({ email });

      if (existingApplicants && existingApplicants.length > 0) {
        // Check if any of the existing applicants have a different phone number
        const normalizedCurrentPhone = normalizePhoneNumber(applicant.phone);
        const hasDifferentPhone = existingApplicants.some(
          (existingApplicant) =>
            normalizePhoneNumber(existingApplicant.phone) !== normalizedCurrentPhone
        );

        if (hasDifferentPhone) {
          setEmailExistsError(
            'This email is already registered in the system. Please login with the correct phone number or contact Support at info@driverfly.co'
          );
        } else {
          setEmailExistsError(null);
        }
      } else {
        setEmailExistsError(null);
      }
    } catch (error) {
      console.error('Error checking email:', error);
      // Don't block the user if the API call fails
      setEmailExistsError(null);
    }
  };

  const form = useFormik({
    initialValues: {
      ...new ContactDto(),
      authorize_to_communicate: BooleanTypeExtra.YES,
      is_owner_operator: BooleanTypeExtra.NO,
      owner_operator_company_name: '',
      owner_operator_dot_number: '',
    },
    validationSchema: ContactDto.yupSchema(),
    onSubmit: async (values) => {
      try {
        const { email, zip_code, authorize_to_communicate, is_owner_operator, owner_operator_company_name, owner_operator_dot_number } = values;

        setApplicant({
          ...applicant,
          email,
          zip_code,
          authorize_to_communicate,
          is_owner_operator: is_owner_operator === BooleanTypeExtra.YES,
          owner_operator_company_name,
          owner_operator_dot_number,
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
    form.setValues({
      ...form.values,
      email: applicant.email,
      authorize_to_communicate: applicant.authorize_to_communicate || BooleanTypeExtra.YES,
      zip_code: applicant.zip_code,
      is_owner_operator: applicant.is_owner_operator ? BooleanTypeExtra.YES : BooleanTypeExtra.NO,
      owner_operator_company_name: applicant.owner_operator_company_name || '',
      owner_operator_dot_number: applicant.owner_operator_dot_number || '',
    });
  }, []);

  const handleNext = () => {
    // Check if there's an email error before submitting
    if (emailExistsError) {
      return;
    }

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
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('basic_info')}</h1>

      {emailExistsError && (
        <Alert variant="danger" className="mb-4">
          <div className="text-center">
            <i
              className="fa fa-exclamation-triangle mb-3"
              style={{ fontSize: '48px', color: '#dc3545' }}
            />
            <h5 className="mb-3">Email Already Registered</h5>
            <p className="mb-0">{emailExistsError}</p>
          </div>
        </Alert>
      )}

      <Form
        className={`${styles.align__text_left} ${styles.formStep}`}
        onSubmit={form.handleSubmit}
        onReset={form.handleReset}
      >
        <Row className={styles.bold}>
          <div className="col-md-6 my-3">
            <Input
              name="email"
              type="email"
              label={t('email')}
              placeholder={t('email')}
              value={form.values.email}
              onChange={(e) => {
                form.handleChange(e);
                setEmailExistsError(null);
              }}
              onBlur={(e) => {
                form.handleBlur(e);
                validateEmailExists(e.target.value);
              }}
              required
              error={
                emailExistsError ||
                (form.touched.email && form.errors.email ? form.errors.email : undefined)
              }
              autoComplete="email"
            />
          </div>
        </Row>
        <Row className={styles.bold}>
          <div className="col-12 my-3">
            <MaskedInput
              name="zip_code"
              mask="99999"
              maskChar={null}
              label={t('zip_code')}
              placeholder={t('zip_code')}
              value={form.values.zip_code}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={
                form.touched.zip_code && form.errors.zip_code ? form.errors.zip_code : undefined
              }
              autoComplete="postal-code"
            />
          </div>
        </Row>
        <Row className={styles.bold}>
          <div className="col-12 my-3">
            <BaseSelect
              className="w-100"
              required
              labelPrefix="BooleanPreferenceType"
              enumType={BooleanTypeExtra}
              name="is_owner_operator"
              placeholder="CHOOSE"
              label={t('ARE_YOU_AN_OWNER_OPERATOR')}
              formik={form}
            />
          </div>
        </Row>
        {form.values.is_owner_operator === BooleanTypeExtra.YES && (
          <>
            <Row className={styles.bold}>
              <div className="col-12 my-3">
                <Input
                  name="owner_operator_company_name"
                  type="text"
                  label={t('OWNER_OPERATOR_COMPANY_NAME')}
                  placeholder={t('OWNER_OPERATOR_COMPANY_NAME')}
                  value={form.values.owner_operator_company_name}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.owner_operator_company_name && form.errors.owner_operator_company_name ? form.errors.owner_operator_company_name : undefined}
                />
              </div>
            </Row>
            <Row className={styles.bold}>
              <div className="col-12 my-3">
                <Input
                  name="owner_operator_dot_number"
                  type="text"
                  label={t('OWNER_OPERATOR_DOT_NUMBER')}
                  placeholder={t('OWNER_OPERATOR_DOT_NUMBER')}
                  value={form.values.owner_operator_dot_number}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  error={form.touched.owner_operator_dot_number && form.errors.owner_operator_dot_number ? form.errors.owner_operator_dot_number : undefined}
                />
              </div>
            </Row>
          </>
        )}
        <Row className={`${styles.align__text_left} ${styles.bold}`}>
          <BaseSelect
            className="col-12 my-3"
            required
            labelPrefix="BooleanPreferenceType"
            enumType={BooleanTypeExtra}
            name="authorize_to_communicate"
            placeholder="CHOOSE"
            label={t(
              '{company_name}_SMS_EMAIL_AUTHORIZATION_NAUTILIUS',
              { company_name: applicant?.company?.name },
              { translateProps: true }
            )}
            formik={form}
          />
        </Row>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={form.isValid && !form.isValidating && !emailExistsError}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

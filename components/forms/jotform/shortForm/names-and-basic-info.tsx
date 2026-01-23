import React, { useEffect, useContext, useRef, useState } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { Row, Alert } from 'react-bootstrap';
import styles from '../../../../styles/digitalhiringapp.module.css';
import BaseSelect from '../../base-select';
import { useTranslation } from '../../../../hooks/use-translation';
import { NamesAndBasicInfoDto } from '../../../../models/jot-form/short-form/names-and-basic-info.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { BooleanTypeExtra } from '../../../../enums/jotform/bool-and-not-sure.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { HearAboutUsType } from '../../../../enums/jotform/hear-about-type.enum';
import { Input, MaskedInput, Select } from '../../../shared/dha';
import { FormActions } from '../form-buttons';
import ApplicantApi from '../../../../pages/api/applicant';
import { normalizePhoneNumber } from '../../../../utils/phone-normalization';
import { UtmReferral } from '../../../../models/auth/utm-referral.interface';

// Helper function to check if any UTM parameters exist
const hasUtmParameters = (utm?: UtmReferral): boolean => {
  if (!utm) return false;
  return Boolean(
    utm.utm_source ||
    utm.utm_medium ||
    utm.utm_campaign ||
    utm.utm_content ||
    utm.referral_name
  );
};

// Map UTM parameters to HearAboutUsType
const mapUtmToHearAboutType = (utm?: UtmReferral): HearAboutUsType | null => {
  if (!utm) return null;

  // If there's a specific referral name, it's a referral
  if (utm.referral_name) {
    return HearAboutUsType.REFERRAL;
  }

  // Check utm_source and utm_medium for clues
  const source = utm.utm_source?.toLowerCase() || '';
  const medium = utm.utm_medium?.toLowerCase() || '';
  const combined = `${source} ${medium}`;

  // Map based on common patterns
  if (combined.includes('social') || combined.includes('facebook') ||
      combined.includes('twitter') || combined.includes('linkedin') ||
      combined.includes('instagram')) {
    return HearAboutUsType.SOCIAL_MEDIA;
  }

  if (combined.includes('email') || medium.includes('email')) {
    return HearAboutUsType.EMAIL;
  }

  if (combined.includes('job') || combined.includes('board') ||
      combined.includes('indeed') || combined.includes('ziprecruiter')) {
    return HearAboutUsType.JOB_BOARD;
  }

  if (combined.includes('print') || combined.includes('ad') || combined.includes('newspaper')) {
    return HearAboutUsType.PRINT_AD;
  }

  // Default to OTHER if we have UTM parameters but can't determine the specific type
  return HearAboutUsType.OTHER;
};

export function NamesAndBasicInfo() {
  const {
    state: { applicant, applicantExtras, utm, isEditingExistingApplicant },
    method: { setApplicant, setApplicantExtras, stepNext, stepBack },
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
      ...new NamesAndBasicInfoDto(),
      authorize_to_communicate: BooleanTypeExtra.YES,
      is_owner_operator: BooleanTypeExtra.NO,
      owner_operator_company_name: '',
      owner_operator_dot_number: '',
    },
    validationSchema: NamesAndBasicInfoDto.yupSchema(),
    onSubmit: async (values) => {
      try {
        const {
          first_name,
          last_name,
          email,
          zip_code,
          authorize_to_communicate,
          is_owner_operator,
          owner_operator_company_name,
          owner_operator_dot_number,
          HEAR_ABOUT_US,
          REFERAL_NAME,
        } = values;

        // Update applicant with basic info
        setApplicant({
          ...applicant,
          first_name,
          last_name,
          email,
          zip_code,
          authorize_to_communicate,
          is_owner_operator: is_owner_operator === BooleanTypeExtra.YES,
          owner_operator_company_name,
          owner_operator_dot_number,
        });

        // Update applicant extras with hear about info
        const filteredExtras = [
          ...applicantExtras,
          { ...HEAR_ABOUT_US },
          { ...REFERAL_NAME },
        ].filter((v) => !!v?.value);
        setApplicantExtras(filteredExtras);

        stepNext();
      } catch (error) {
        console.log('error', error);
      }
    },
    onReset: (values) => {
      stepBack();
    },
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only update if we have applicant data and haven't initialized yet
    if (!applicant || hasInitialized.current) {
      return;
    }

    const { first_name, last_name, email, zip_code, authorize_to_communicate, is_owner_operator, owner_operator_company_name, owner_operator_dot_number } = applicant;

    // Find existing hear about extras
    const apx = applicantExtras?.find((v) => v.type === ApplicantExtras.HEAR_ABOUT_US);
    const apx_referal_name = applicantExtras?.find((v) => v.type === ApplicantExtras.REFERAL_NAME);

    // Create default hear about objects
    // If UTM parameters exist, automatically set the lead source
    const utmLeadSource = hasUtmParameters(utm) ? mapUtmToHearAboutType(utm) : null;

    const hearAboutObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
      value: utmLeadSource,
    };

    const referalNameObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.REFERAL_NAME),
      value: Boolean(utm?.referral_name) ? utm?.referral_name : null,
    };

    // Prepare the new form values
    const newValues = {
      first_name: first_name || '',
      last_name: last_name || '',
      email: email || '',
      zip_code: zip_code || '',
      authorize_to_communicate: authorize_to_communicate || BooleanTypeExtra.YES,
      is_owner_operator: is_owner_operator ? BooleanTypeExtra.YES : BooleanTypeExtra.NO,
      owner_operator_company_name: owner_operator_company_name || '',
      owner_operator_dot_number: owner_operator_dot_number || '',
      HEAR_ABOUT_US: apx || hearAboutObject,
      REFERAL_NAME: apx_referal_name || referalNameObject,
    };

    // Set values only once when component mounts with data
    form.setValues(newValues);
    hasInitialized.current = true;
  }, [applicant, applicantExtras, utm]);

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
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        Personal Information
      </h1>

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
        <div style={{ maxWidth: '600px', margin: '0' }}>
          {/* Names Section */}
          <Row className={styles.bold}>
            <div className="col-md-6 my-3">
              <Input
                name="first_name"
                label={t('FIRST_NAME')}
                placeholder={t('FIRST_NAME')}
                value={form.values.first_name || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                required
                readOnly={isEditingExistingApplicant}
                error={
                  form.touched.first_name && form.errors.first_name
                    ? String(form.errors.first_name)
                    : undefined
                }
                helperText={isEditingExistingApplicant ? "Locked for returning users" : undefined}
                autoComplete="given-name"
                icon={<span>👤</span>}
                size="large"
              />
            </div>
            <div className="col-md-6 my-3">
              <Input
                name="last_name"
                label={t('LAST_NAME')}
                placeholder={t('LAST_NAME')}
                value={form.values.last_name || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                required
                readOnly={isEditingExistingApplicant}
                error={
                  form.touched.last_name && form.errors.last_name
                    ? String(form.errors.last_name)
                    : undefined
                }
                helperText={isEditingExistingApplicant ? "Locked for returning users" : undefined}
                autoComplete="family-name"
                icon={<span>👤</span>}
                size="large"
              />
            </div>
          </Row>

          {/* Contact Information Section */}
          <Row className={styles.bold}>
            <div className="col-md-6 my-3">
              <Input
                name="email"
                type="email"
                label={t('email')}
                placeholder={t('email')}
                value={form.values.email || ''}
                onChange={(e) => {
                  form.handleChange(e);
                  setEmailExistsError(null);
                }}
                onBlur={(e) => {
                  form.handleBlur(e);
                  validateEmailExists(e.target.value);
                }}
                required
                readOnly={isEditingExistingApplicant}
                error={
                  emailExistsError ||
                  (form.touched.email && form.errors.email ? form.errors.email : undefined)
                }
                helperText={isEditingExistingApplicant ? "Locked for returning users" : undefined}
                autoComplete="email"
                icon={<span>📧</span>}
                size="large"
              />
            </div>
            <div className="col-md-6 my-3">
              <MaskedInput
                name="zip_code"
                mask="99999"
                maskChar={null}
                label={t('zip_code')}
                placeholder={t('zip_code')}
                value={form.values.zip_code || ''}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                required
                disabled={isEditingExistingApplicant}
                error={
                  form.touched.zip_code && form.errors.zip_code ? form.errors.zip_code : undefined
                }
                helperText={isEditingExistingApplicant ? "Locked for returning users" : undefined}
                autoComplete="postal-code"
                icon={<span>📍</span>}
                size="large"
              />
            </div>
          </Row>

          {/* Owner Operator Section - Always editable, even for returning users */}
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
              {isEditingExistingApplicant && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#28a745' }}>
                  <i className="fa fa-info-circle me-1" />
                  You can update your owner operator status
                </div>
              )}
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
                    value={form.values.owner_operator_company_name || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.owner_operator_company_name && form.errors.owner_operator_company_name ? String(form.errors.owner_operator_company_name) : undefined}
                    icon={<span>🏢</span>}
                    size="large"
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
                    value={form.values.owner_operator_dot_number || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.owner_operator_dot_number && form.errors.owner_operator_dot_number ? String(form.errors.owner_operator_dot_number) : undefined}
                    icon={<span>🔢</span>}
                    size="large"
                  />
                </div>
              </Row>
            </>
          )}

          {/* Authorization Section */}
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

          {/* How Did You Hear About Us Section - Hidden when UTM parameters are present */}
          {!hasUtmParameters(utm) && (
            <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
              <h4 className={`${styles.jot_form_headers_font}`}>{t('HOW_DID_YOU_HEAR_ABOUT_US')}</h4>

              <Row className={styles.bold}>
                <div className="col-12 my-3">
                  <Select
                    name="HEAR_ABOUT_US.value"
                    label="Select an option"
                    placeholder="CHOOSE"
                    labelPrefix="HearAboutUsType"
                    enumType={HearAboutUsType}
                    value={form.values?.HEAR_ABOUT_US?.value || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={
                      form.touched?.HEAR_ABOUT_US?.value && form.errors?.HEAR_ABOUT_US?.value
                        ? String(form.errors.HEAR_ABOUT_US.value)
                        : undefined
                    }
                    required
                  />
                </div>

                {form.values?.HEAR_ABOUT_US?.value === HearAboutUsType.REFERRAL && (
                  <div className="col-12 my-3">
                    <Input
                      name="REFERAL_NAME.value"
                      label={t('REFERRAL_NAME')}
                      placeholder={t('REFERRAL_NAME')}
                      value={form.values?.REFERAL_NAME?.value || ''}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      error={
                        form.touched?.REFERAL_NAME?.value && form.errors?.REFERAL_NAME?.value
                          ? String(form.errors.REFERAL_NAME.value)
                          : undefined
                      }
                      required
                      autoComplete="name"
                      helperText="Please provide the name of the person who referred you"
                      icon={<span>👤</span>}
                      size="large"
                    />
                  </div>
                )}
              </Row>
            </div>
          )}
        </div>

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

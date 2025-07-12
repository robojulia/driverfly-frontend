import React, { useEffect, useContext, useRef } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { Row } from 'react-bootstrap';
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

export function NamesAndBasicInfo() {
  const {
    state: { applicant, applicantExtras, utm },
    method: { setApplicant, setApplicantExtras, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      ...new NamesAndBasicInfoDto(),
      authorize_to_communicate: BooleanTypeExtra.YES,
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

    const { first_name, last_name, email, zip_code, authorize_to_communicate } = applicant;

    // Find existing hear about extras
    const apx = applicantExtras?.find((v) => v.type === ApplicantExtras.HEAR_ABOUT_US);
    const apx_referal_name = applicantExtras?.find((v) => v.type === ApplicantExtras.REFERAL_NAME);

    // Create default hear about objects
    const hearAboutObject = {
      ...new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US),
      value: Boolean(utm?.referral_name) ? HearAboutUsType.REFERRAL : null,
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
      HEAR_ABOUT_US: apx || hearAboutObject,
      REFERAL_NAME: apx_referal_name || referalNameObject,
    };

    // Set values only once when component mounts with data
    form.setValues(newValues);
    hasInitialized.current = true;
  }, [applicant, applicantExtras, utm]);

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
        {t('personal_information')}
      </h1>

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
                error={
                  form.touched.first_name && form.errors.first_name
                    ? String(form.errors.first_name)
                    : undefined
                }
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
                error={
                  form.touched.last_name && form.errors.last_name
                    ? String(form.errors.last_name)
                    : undefined
                }
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
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                required
                error={form.touched.email && form.errors.email ? form.errors.email : undefined}
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
                error={
                  form.touched.zip_code && form.errors.zip_code ? form.errors.zip_code : undefined
                }
                autoComplete="postal-code"
                icon={<span>📍</span>}
                size="large"
              />
            </div>
          </Row>

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

          {/* How Did You Hear About Us Section */}
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
                  disabled={Boolean(utm?.referral_name)}
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
                    disabled={Boolean(utm?.referral_name)}
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

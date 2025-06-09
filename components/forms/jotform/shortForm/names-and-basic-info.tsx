import React, { useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { Row } from 'react-bootstrap';
import styles from '../../../../styles/digitalhiringapp.module.css';
import BaseSelect from '../../base-select';
import { useTranslation } from '../../../../hooks/use-translation';
import { NamesAndBasicInfoDto } from '../../../../models/jot-form/short-form/names-and-basic-info.dto';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { BooleanTypeExtra } from '../../../../enums/jotform/bool-and-not-sure.enum';
import { Input, MaskedInput } from '../../../shared/dha';
import { FormActions } from '../form-buttons';

export function NamesAndBasicInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
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
        const { first_name, last_name, email, zip_code, authorize_to_communicate } = values;

        setApplicant({
          ...applicant,
          first_name,
          last_name,
          email,
          zip_code,
          authorize_to_communicate,
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
    const { first_name, last_name, email, zip_code, authorize_to_communicate } = applicant;
    form.setValues({
      first_name: first_name || '',
      last_name: last_name || '',
      email: email || '',
      zip_code: zip_code || '',
      authorize_to_communicate: authorize_to_communicate || BooleanTypeExtra.YES,
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

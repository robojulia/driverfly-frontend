import React, { useEffect, useContext, useState } from 'react';
import { useFormik } from 'formik';
import Form from 'react-bootstrap/Form';
import { Button, Col, Row } from 'react-bootstrap';
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

export function BasicInfo() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: {
      ...new ContactDto(),
      authorize_to_communicate: BooleanTypeExtra.YES,
    },
    validationSchema: ContactDto.yupSchema(),
    onSubmit: async (values) => {
      try {
        const { email, zip_code, authorize_to_communicate } = values;

        setApplicant({
          ...applicant,
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
    form.setValues({
      ...form.values,
      email: applicant.email,
      authorize_to_communicate: applicant.authorize_to_communicate || BooleanTypeExtra.YES,
      zip_code: applicant.zip_code,
    });
  }, []);

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
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('basic_info')}</h1>

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
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              required
              error={form.touched.email && form.errors.email ? form.errors.email : undefined}
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
          isValid={form.isValid && !form.isValidating}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>
    </>
  );
}

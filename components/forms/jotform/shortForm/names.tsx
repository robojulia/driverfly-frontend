import { useContext, useEffect } from 'react';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useTranslation } from '../../../../hooks/use-translation';
import { NamesDto } from '../../../../models/jot-form/short-form/names';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { FormActions } from '../form-buttons';
import { Input } from '../../../shared/dha';

export function Names() {
  const {
    state: { applicant },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const form = useFormik({
    initialValues: new NamesDto(),
    validationSchema: NamesDto.yupSchema(),
    onSubmit: (values) => {
      const { first_name, last_name } = values;
      setApplicant({
        ...applicant,
        first_name,
        last_name,
      });
      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
  });

  useEffect(() => {
    const { first_name, last_name } = applicant;
    form.setValues({
      first_name: first_name || '',
      last_name: last_name || '',
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
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('name')}</h1>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '600px', margin: '0' }}>
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

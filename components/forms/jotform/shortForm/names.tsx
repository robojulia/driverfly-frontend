import { useContext, useEffect } from 'react';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { Button, Row } from 'react-bootstrap';
import BaseInput from '../../base-input';
import { useFormik } from 'formik';
import { useTranslation } from '../../../../hooks/use-translation';
import { NamesDto } from '../../../../models/jot-form/short-form/names';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';

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
      first_name: first_name || null,
      last_name: last_name || null,
    });
  }, [applicant]);

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('name')}</h1>
      <form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <Row className={styles.bold}>
          <BaseInput
            className="col-12 my-3"
            label="FIRST_NAME"
            required
            name="first_name"
            placeholder="FIRST_NAME"
            formik={form}
          />
        </Row>
        <Row className={styles.bold}>
          <BaseInput
            className="col-12 my-3"
            required
            name="last_name"
            label="LAST_NAME"
            placeholder="LAST_NAME"
            formik={form}
          />
        </Row>

        <div className={styles.formActions}>
          <Button variant="outline-primary" type="reset">
            {t('BACK')}
          </Button>
          <Button variant="primary" type="submit" disabled={form.isSubmitting || !form.isValid}>
            {t('NEXT')}
          </Button>
        </div>
      </form>
    </>
  );
}

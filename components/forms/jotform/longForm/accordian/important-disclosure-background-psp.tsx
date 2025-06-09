import { useContext, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import BaseInput from '../../../base-input';
import { useTranslation } from '../../../../../hooks/use-translation';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { AccordianProps } from '../../../../../types/jotform/accordian.type';
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../../models/applicant';
import { SignatureComponent } from '../../../signature';

export function ImportantDisclosureBackgroundPsp({
  form,
  hideSSNInput = false,
  hideSignature = false,
}: AccordianProps & { hideSSNInput?: boolean; hideSignature?: boolean }) {
  const {
    state: { applicant, applicantExtras, company },
  }: JotFormContextType = useContext(JotformContext);
  const { t } = useTranslation();

  const handleSignatureChange = (signature: string | null) => {
    const signatureEntity = new ApplicantExtrasEntity(
      ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND
    );
    signatureEntity.value = signature;
    form.setFieldValue('SIGNATURE_IMPORTANT_BACKGROUND', signatureEntity);
  };

  useEffect(() => {
    if (hideSignature) return;

    const apx_background_date = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE
    );

    const apx_sign_important_background = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND
    );

    const signatureEntity =
      apx_sign_important_background ||
      new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND);

    const emptyBackgroundDate = {
      ...new ApplicantExtrasEntity(ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE),
      value: new Date().toISOString(),
    };

    form.setValues({
      ...form.values,
      SIGNATURE_IMPORTANT_BACKGROUND: signatureEntity,
      IMPORTANT_DISCLOSURE_BACKGROUND_DATE: !!apx_background_date?.type
        ? apx_background_date
        : emptyBackgroundDate,
    });
  }, [applicant]);

  return (
    <>
      <Row>
        <h1 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            '{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </h1>
      </Row>
      <Row>
        <h3 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS')}
        </h3>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('WHEN_SUBMITTED_MAIL_PHONE_COMPUTER')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('NEITHER_EMPLYER_NOR_PROSPECTIVE_SUPPLYING')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('CRASH_OR_SUSPENSION_INVOLVED')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('CANNOT_OBTAIN_BACKGRPUND')}
        </p>
      </Row>
      <Row>
        <h5 className={`${styles.paragraph} ${styles.align__text_left}`}>{t('AUTHORIZATION')}</h5>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('AGREE_WITH_EMPLOYER')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            '{COMPANY_NAME}_AUTHORIZE_COMPANY_TO_ACCESS',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('UNDERSTAND_FMCSA_SAFETY_DATA')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('UNDERSTAND_PSP_VIOLATIONS')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('DISCLOSURE_BACKGROUND')}
        </p>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          <span>
            {' '}
            {t('APPLICANT_NAME')}{' '}
            {t(
              '{APPLICANT_NAME}',
              {
                APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}`,
              },
              { translateProps: true }
            )}
          </span>
        </p>
      </Row>
      <Row>
        {!hideSignature && (
          <Col>
            <h6 className="text-black">{t('SIGNATURE')}</h6>
            <SignatureComponent
              firstName={applicant?.first_name}
              lastName={applicant?.last_name}
              onSignatureChange={handleSignatureChange}
              initialSignature={form.values.SIGNATURE_IMPORTANT_BACKGROUND?.value}
              required
            />
          </Col>
        )}
      </Row>
      <Row className={styles.align__text_left}>
        <BaseInput
          className="col my-3"
          required
          type="date"
          name="IMPORTANT_DISCLOSURE_BACKGROUND_DATE.value"
          placeholder="DATE"
          label="Date"
          formik={form}
          max={new Date().toISOString().split('T')[0]}
        />
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>{t('NOTICE_DISCLOSURE')}</p>
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('EMPLOYEE_DEF_NOTICE_{number}', { number: '49' }, { translateProps: true })}
        </p>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('{license}', { license: 'C.F.R. 383.5.' }, { translateProps: true })}
        </p>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t('LAST_UPDATED_{date}', { date: '12/22/2015' }, { translateProps: true })}
        </p>
      </Row>
    </>
  );
}

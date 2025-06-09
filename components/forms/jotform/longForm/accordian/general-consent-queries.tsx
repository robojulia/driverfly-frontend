import { useContext, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../../../../hooks/use-translation';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { AccordianProps } from '../../../../../types/jotform/accordian.type';
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { ApplicantExtrasEntity } from '../../../../../models/applicant';
import { ShowUsFormattedDateTime } from '../../../../../utils/show-us-formatted-date-time';
import { SignatureComponent } from '../../../signature';

export function GeneralConsentQueries({
  eventKey,
  form,
  hideSSNInput = false,
  hideSignature = false,
}: AccordianProps & { hideSSNInput?: boolean; hideSignature?: boolean }) {
  const {
    state: { applicant, applicantExtras, company },
  }: JotFormContextType = useContext(JotformContext);
  const { t } = useTranslation();

  const handleSignatureChange = (signature: string | null) => {
    const signatureEntity = new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE_GENERAL_CONSENT);
    signatureEntity.value = signature;
    form.setFieldValue('SIGNATURE_GENERAL_CONSENT', signatureEntity);

    if (signature) {
      const generalConsentEntity = new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT);
      generalConsentEntity.value = {
        consentGiven: true,
        consentDate: new Date().toISOString(),
        name: `${applicant?.first_name} ${applicant?.last_name}`,
        employer_name: company?.name ?? applicant?.company?.name,
        cdl_license_number: applicant?.license_number || '',
        expiration_date: new Date().toISOString(),
      };
      form.setFieldValue('GENERAL_CONSENT', generalConsentEntity);
    }
  };

  useEffect(() => {
    if (hideSignature) return;

    const apx_sign = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.SIGNATURE_GENERAL_CONSENT
    );
    const apx_general_consent = applicantExtras?.find(
      (v) => v.type == ApplicantExtras.GENERAL_CONSENT
    );

    const signatureEntity =
      apx_sign || new ApplicantExtrasEntity(ApplicantExtras.SIGNATURE_GENERAL_CONSENT);

    form.setValues({
      ...form.values,
      SIGNATURE_GENERAL_CONSENT: signatureEntity,
      GENERAL_CONSENT: !!apx_general_consent?.type
        ? apx_general_consent
        : new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT),
    });
  }, [applicant]);

  useEffect(() => {
    const signature = form.values.SIGNATURE_GENERAL_CONSENT?.value;
    if (signature && !form.values.GENERAL_CONSENT?.value) {
      const generalConsentEntity = new ApplicantExtrasEntity(ApplicantExtras.GENERAL_CONSENT);
      generalConsentEntity.value = {
        name: `${applicant?.first_name} ${applicant?.last_name}`,
        employer_name: company?.name ?? applicant?.company?.name,
        cdl_license_number: applicant?.license_number || '',
        expiration_date: new Date().toISOString(),
        consentGiven: false,
        consentDate: null,
      };
      form.setFieldValue('GENERAL_CONSENT', generalConsentEntity);
    }
  }, [form.values.SIGNATURE_GENERAL_CONSENT?.value]);

  const apply_date = applicantExtras?.find((v) => v.type == ApplicantExtras.APPLY_DATE);

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
          {t('GENERAL_CONSENT_QUERIES')}
        </h3>
      </Row>
      <Row>
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>{t('INSTRUCTIONS_CFR')}</p>
      </Row>
      <Row className={styles.align__text_left}>
        <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'APPLICANT_FULL_NAME_{NAME}',
            { NAME: `${applicant?.first_name} ${applicant?.last_name}` },
            { translateProps: true }
          )}
        </h6>
      </Row>
      <Row className={styles.align__text_left}>
        <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'APPLICANT_{cdl_number}',
            { cdl_number: applicant?.license_number },
            { translateProps: true }
          )}
        </h6>
      </Row>
      <Row className={styles.align__text_left}>
        <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'APPLICANT_{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </h6>
      </Row>
      <Row className={styles.align__text_left}>
        <h6 className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'APPLICANT_{APPLY_DATE}',
            {
              APPLY_DATE: `${
                apply_date?.value ? ShowUsFormattedDateTime(new Date(apply_date?.value)) : ''
              }`,
            },
            { translateProps: true }
          )}
        </h6>
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            '{APPLICANT_NAME}_CONSENT_TO_CLEARINGHOUSE_1_{COMPANY_NAME}',
            {
              COMPANY_NAME: company?.name ?? applicant?.company?.name,
              APPLICANT_NAME: `${applicant?.first_name} ${applicant?.last_name}`,
            },
            { translateProps: true }
          )}
        </p>
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'CONSENT_TO_CLEARINGHOUSE_2_{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </p>
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'CONSENT_TO_CLEARINGHOUSE_3_{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
        </p>
      </Row>
      <Row className="mt-4">
        <p className={`${styles.paragraph} ${styles.align__text_left}`}>
          {t(
            'CONSENT_TO_CLEARINGHOUSE_4_{COMPANY_NAME}',
            { COMPANY_NAME: company?.name ?? applicant?.company?.name },
            { translateProps: true }
          )}
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
              initialSignature={form.values.SIGNATURE_GENERAL_CONSENT?.value}
              required
            />
          </Col>
        )}
      </Row>
    </>
  );
}

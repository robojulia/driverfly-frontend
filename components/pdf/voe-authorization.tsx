import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CloudArrowDownFill, Eye } from 'react-bootstrap-icons';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer';

import { useTranslation } from '../../hooks/use-translation';
import { ApplicantExtras } from '../../enums/applicants/applicant-extras.enum';
import { ApplicantEmployerEntity, ApplicantEntity } from '../../models/applicant';
import { buildAddress } from '../../utils/common';
import { ShowUsFormattedDateTime } from '../../utils/show-us-formatted-date-time';

export interface VoeAuthorizationProps {
  applicant: ApplicantEntity;
  employer: ApplicantEmployerEntity;
}

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 9.5, lineHeight: 1.35, color: '#111' },
  title: { fontSize: 15, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 10.5, textAlign: 'center', marginBottom: 8 },
  sectionHeading: { fontSize: 11.5, fontWeight: 'bold', marginTop: 8, marginBottom: 3 },
  helper: { fontStyle: 'italic', marginBottom: 5 },
  paragraph: { marginBottom: 5, textAlign: 'justify' },
  field: { marginBottom: 3 },
  label: { fontWeight: 'bold' },
  block: {
    marginTop: 5,
    padding: 6,
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  signatureRow: { flexDirection: 'row', marginTop: 8, marginBottom: 8 },
  signatureCol: { flex: 1 },
  signatureImg: { width: 170, height: 62, objectFit: 'contain' },
  signatureLine: { borderTop: '1px solid #000', width: 200, marginTop: 4, paddingTop: 2 },
  footerNote: {
    marginTop: 10,
    paddingTop: 6,
    borderTop: '1px solid #ccc',
    fontSize: 8,
    color: '#555',
    fontStyle: 'italic',
  },
});

type TFn = (key: string, params?: any, opts?: any) => string;

export interface VoeAuthorizationDocumentProps {
  applicant: ApplicantEntity;
  employer: ApplicantEmployerEntity;
  t: TFn;
}

// Builds the per-employer VOE authorization document. The driver's single
// VOE authorization signature is reused, with this specific employer's details
// filled in so the form can be transmitted to that previous employer. The
// authorization language intentionally still references "all previous employers"
// so the document reflects the single, blanket consent the driver gave at
// signing (FMCSR Part 391.23), rather than implying a per-employer signature.
export function VoeAuthorizationDocument({ applicant, employer, t }: VoeAuthorizationDocumentProps) {
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();

  const signature = applicant?.extras?.find(
    (e) => e?.type === ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION
  );
  const applyDate = applicant?.extras?.find((e) => e?.type === ApplicantExtras.APPLY_DATE);

  const ssnMasked = applicant?.ssn_last4
    ? `XXX-XX-${String(applicant.ssn_last4).slice(-4)}`
    : t('N/A');

  const employerAddress =
    buildAddress(employer) || employer?.address || t('N/A');

  const hiringCompanyName = applicant?.company?.name || t('N/A');
  const hiringCompanyPhone = applicant?.company?.users?.[0]?.contact_number || t('N/A');

  const dateText = applyDate?.value
    ? ShowUsFormattedDateTime(new Date(applyDate.value), true)
    : '';

  return (
    <Document title={`VOE - ${applicantName} - ${employer?.name || ''}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{t('VERIFICATION_OF_EMPLOYMENT')}</Text>
        <Text style={styles.subtitle}>{t('SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST')}</Text>

        <Text style={styles.sectionHeading}>{t('SECTION_I')}</Text>
        <Text style={styles.helper}>{t('TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER')}</Text>

        <Text style={styles.field}>
          <Text style={styles.label}>
            {t('EMPLOYEE_NAME_NAUTILUS_{employee_name}', { employee_name: '' }, { translateProps: true })}
          </Text>
          {applicantName || t('N/A')}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('EMPLOYEE_SSN')} </Text>
          {ssnMasked}
        </Text>

        <Text style={styles.paragraph}>{t('VERIFICATION_OF_EMPLOYMENT_FMCSR_AUTHORIZED')}</Text>
        <Text style={styles.paragraph}>{t('UNDERSTAND_CONSENT_REQUESTED')}</Text>
        <Text style={styles.paragraph}>
          {t('{name}_AUTHORIZE_COMPANY', { name: applicantName }, { translateProps: true })}
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <Text style={styles.label}>{t('SIGNATURE')}</Text>
            {signature?.value ? (
              <Image style={styles.signatureImg} src={signature.value} />
            ) : (
              <Text style={styles.signatureLine}>{t('N/A')}</Text>
            )}
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.label}>{t('DATE')}</Text>
            <Text style={{ marginTop: 4 }}>{dateText || t('N/A')}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>{t('NEW_EMPLOYER')}</Text>
        <View style={styles.block}>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('COMPANY')}: </Text>
            {hiringCompanyName}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('PHONE')}: </Text>
            {hiringCompanyPhone}
          </Text>
        </View>

        <Text style={styles.sectionHeading}>
          {employer?.is_current ? t('CURENNT_COMPANY_DATA') : t('PAST_COMPANY_DATA')}
        </Text>
        <View style={styles.block}>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('NAME')}: </Text>
            {employer?.name || t('N/A')}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('ADDRESS')}: </Text>
            {employerAddress}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('PHONE')}: </Text>
            {employer?.phone || t('N/A')}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('DESIGNATED_EMPLOYER_REPRESENTATIVE')}: </Text>
            {employer?.manager_name || t('N/A')}
          </Text>
          <Text style={styles.field}>
            <Text style={styles.label}>{t('EMAIL')}: </Text>
            {employer?.email || t('N/A')}
          </Text>
        </View>

        <Text style={styles.footerNote}>{t('VOE_SINGLE_SIGNATURE_NOTE')}</Text>
      </Page>
    </Document>
  );
}

export function hasVoeSignature(applicant: ApplicantEntity): boolean {
  return Boolean(
    applicant?.extras?.find((e) => e?.type === ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION)?.value
  );
}

// Renders "View" and "Download" controls that produce a VOE authorization
// document for one specific employer, reusing the driver's single signature.
export function VoeAuthorizationActions({ applicant, employer }: VoeAuthorizationProps) {
  const { t } = useTranslation();
  const [isOpening, setIsOpening] = useState(false);

  const fileName = `VOE_${(applicant?.first_name || '').trim()}_${(applicant?.last_name || '').trim()}_${(employer?.name || 'employer').trim()}.pdf`
    .replace(/\s+/g, '_');

  const handleView = async () => {
    setIsOpening(true);
    try {
      const blob = await pdf(
        <VoeAuthorizationDocument applicant={applicant} employer={employer} t={t} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="d-flex gap-2">
      <Button size="sm" variant="outline-secondary" onClick={handleView} disabled={isOpening}>
        {isOpening ? (
          <span className="spinner-grow spinner-grow-sm" />
        ) : (
          <Eye className="me-1" />
        )}
        {t('VIEW_VOE')}
      </Button>
      <PDFDownloadLink
        document={<VoeAuthorizationDocument applicant={applicant} employer={employer} t={t} />}
        fileName={fileName}
        className="btn btn-sm btn-outline-secondary"
      >
        {({ loading }) => (
          <>
            {loading ? (
              <span className="spinner-grow spinner-grow-sm" />
            ) : (
              <CloudArrowDownFill className="me-1" />
            )}
            {t('DOWNLOAD_VOE')}
          </>
        )}
      </PDFDownloadLink>
    </div>
  );
}

export default VoeAuthorizationActions;

import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { CloudArrowDownFill, Eye, FileEarmarkText } from 'react-bootstrap-icons';
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';
import { ApplicantExtras } from '../../enums/applicants/applicant-extras.enum';
import { ApplicantEntity } from '../../models/applicant';
import { CompanyEntity } from '../../models/company/company.entity';
import { ShowUsFormattedDateTime } from '../../utils/show-us-formatted-date-time';

type TFn = (key: string, params?: any, opts?: any) => string;

const styles = StyleSheet.create({
  page: { paddingVertical: 40, paddingHorizontal: 45, fontSize: 11, lineHeight: 1.4, color: '#000' },
  companyName: { fontSize: 16, textAlign: 'center', fontWeight: 'bold', marginBottom: 6 },
  title: { fontSize: 14, textAlign: 'center', fontWeight: 'bold', marginBottom: 6 },
  subTitle: { fontSize: 11, textAlign: 'center', fontWeight: 'bold', marginBottom: 14 },
  sectionHeading: { fontSize: 13, fontWeight: 'bold', marginTop: 14, marginBottom: 4 },
  paragraph: { marginBottom: 10, textAlign: 'justify' },
  field: { marginBottom: 6 },
  label: { fontWeight: 'bold' },
  signatureBlock: { marginTop: 16, marginBottom: 10 },
  signatureImg: { width: 200, height: 80, objectFit: 'contain', marginTop: 4, alignSelf: 'flex-start' },
  signatureLine: { borderTop: '1px solid #000', width: 200, marginTop: 30, paddingTop: 2 },
  footNote: { marginTop: 14, fontSize: 9, color: '#333' },
});

/** Reads one applicant extra by type, returning its raw value (or undefined). */
function extraValue(applicant: ApplicantEntity, type: ApplicantExtras): string | undefined {
  return applicant?.extras?.find((e) => e?.type === type)?.value as string | undefined;
}

/** A drawn/typed signature is stored as a data-uri image; anything else isn't a signature. */
function isSignatureImage(value?: string): boolean {
  return Boolean(value && `${value}`.startsWith('data:image'));
}

function formatDate(value?: string): string {
  return value ? ShowUsFormattedDateTime(value, true).trim() : '';
}

/** Signature image if one is on file, otherwise a blank ruled line to sign by hand. */
function SignatureField({ value, label }: { value?: string; label: string }) {
  return (
    <View style={styles.signatureBlock} wrap={false}>
      <Text style={styles.label}>{label}</Text>
      {isSignatureImage(value) ? (
        <Image style={styles.signatureImg} src={value} />
      ) : (
        <Text style={styles.signatureLine}> </Text>
      )}
    </View>
  );
}

export interface SignedAgreementDocumentProps {
  applicant: ApplicantEntity;
  t: TFn;
  /** Hiring company; falls back to the relation carried on the applicant. */
  company?: CompanyEntity;
}

/**
 * Verification of Employment — the blanket safety-performance-history release
 * the driver signs once at the end of the digital hiring application (FMCSR
 * Part 391.23). The per-previous-employer transmittal form lives in
 * `voe-authorization.tsx`; this is the signed consent itself.
 */
export function VoeConsentPdf({ applicant, t, company }: SignedAgreementDocumentProps) {
  const hiringCompany = company || applicant?.company;
  const hiringUser = hiringCompany?.users?.[0] || applicant?.company?.users?.[0];
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();
  const ssnMasked = applicant?.ssn_last4 ? `XXX-XX-${String(applicant.ssn_last4).slice(-4)}` : t('N/A');
  const signature =
    extraValue(applicant, ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION) ||
    extraValue(applicant, ApplicantExtras.SIGNATURE);

  return (
    <Document title={`Verification of Employment - ${applicantName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.companyName}>{hiringCompany?.name || ''}</Text>
        <Text style={styles.title}>{t('VERIFICATION_OF_EMPLOYMENT')}</Text>
        <Text style={styles.subTitle}>{t('SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST')}</Text>

        <Text style={styles.sectionHeading} minPresenceAhead={60}>
          {t('SECTION_I')}
        </Text>
        <Text style={styles.paragraph}>{t('TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER')}</Text>

        <Text style={styles.field}>
          <Text style={styles.label}>{t('NAME:')} </Text>
          {applicantName}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('EMPLOYEE_SSN:')} </Text>
          {ssnMasked}
        </Text>

        <Text style={styles.paragraph}>{t('VERIFICATION_OF_EMPLOYMENT_FMCSR_AUTHORIZED')}</Text>
        <Text style={styles.paragraph}>{t('UNDERSTAND_CONSENT_REQUESTED')}</Text>
        <Text style={styles.paragraph}>
          I <Text style={styles.label}>{applicantName} </Text>
          {t('VOE_AUTHORIZE_COMPANY_SUFFIX')}
        </Text>

        <SignatureField value={signature} label={t('SIGNATURE:')} />
        <Text style={styles.field}>
          <Text style={styles.label}>{t('DATE:')} </Text>
          {formatDate(extraValue(applicant, ApplicantExtras.APPLY_DATE))}
        </Text>

        <Text style={styles.sectionHeading} minPresenceAhead={60}>
          {t('VOE_SECTION_I_A')}
        </Text>
        <Text style={styles.field}>{t('VOE_NEW_EMPLOYER_NAME_LABEL')}{hiringCompany?.name || ''}</Text>
        <Text style={styles.field}>{t('VOE_ADDRESS_LABEL')}{hiringCompany?.location || ''}</Text>
        <Text style={styles.field}>
          {t('VOE_PHONE_LABEL')}
          {hiringCompany?.phone || hiringUser?.contact_number || ''}
        </Text>
        <Text style={styles.field}>
          {t('VOE_DER_LABEL')}
          {`${hiringUser?.first_name || ''} ${hiringUser?.last_name || ''}`.trim()}
        </Text>
      </Page>
    </Document>
  );
}

/**
 * Disclosure & Authorization — the applicant's information release consent
 * form (background/reference checks).
 */
export function DisclosureAuthorizationPdf({ applicant, t, company }: SignedAgreementDocumentProps) {
  const companyName = (company || applicant?.company)?.name || '';
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();
  const signature = extraValue(applicant, ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION);
  const date = extraValue(applicant, ApplicantExtras.DISCLOSURE_AND_AUTHORIZATION_DATE);

  return (
    <Document title={`Disclosure and Authorization - ${applicantName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{t('APPLICANT_INFORMATION_RELEASE_CONSENT_FORM')}</Text>

        <Text style={styles.paragraph}>
          {t(
            'I_HEREBT_AUTHORIZE_ANY_PERSONAL',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>

        <Text style={styles.label}>{t('TO_BE_READ_AND_SIGNED_BY_APPLICANT')}</Text>
        <Text style={styles.paragraph}>{t('IT_IS_AGREE_AND_UNDERSTOOD')}</Text>
        <Text style={styles.paragraph}>
          {t(
            '{company_name}_I_HEREBY_AUTHORIZE_AND_REQUEST_FOLLOWING',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>

        <Text style={styles.field}>
          <Text style={styles.label}>{t('NAME:')} </Text>
          {applicantName}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('DATE:')} </Text>
          {formatDate(date)}
        </Text>
        <SignatureField value={signature} label={t('SIGNATURE:')} />
      </Page>
    </Document>
  );
}

/** Important Disclosure — FMCSA Pre-employment Screening Program (PSP) reports. */
export function BackgroundPspDisclosurePdf({ applicant, t, company }: SignedAgreementDocumentProps) {
  const companyName = (company || applicant?.company)?.name || '';
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();
  const signature = extraValue(applicant, ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND);
  const date = extraValue(applicant, ApplicantExtras.IMPORTANT_DISCLOSURE_BACKGROUND_DATE);

  return (
    <Document title={`Important Disclosure - Background PSP - ${applicantName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.title}>{t('IMPORTANT_DISCLOSURE_BACKGROUND_PSP_OS')}</Text>
        <Text style={styles.subTitle}>{t('THE_BELOW_DISCLOSURE_AND_AUTHORIZATION_LANGUAGE')}</Text>

        <Text style={styles.paragraph}>
          {t(
            '{company_name}_IN_CONNECTION_WITH_YOUR_APPLICANT',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>
        <Text style={styles.paragraph}>{t('WHEN_APPLICATION_SUBMITTED')}</Text>
        <Text style={styles.paragraph}>{t('WHEN_SUBMITTED_MAIL_PHONE_COMPUTER')}</Text>
        <Text style={styles.paragraph}>{t('NEITHER_EMPLYER_NOR_PROSPECTIVE_SUPPLYING')}</Text>
        <Text style={styles.paragraph}>{t('CRASH_OR_SUSPENSION_INVOLVED')}</Text>
        <Text style={styles.paragraph}>{t('CANNOT_OBTAIN_BACKGRPUND')}</Text>

        <Text style={styles.sectionHeading} minPresenceAhead={60}>
          {t('AUTHORIZATION')}
        </Text>
        <Text style={styles.paragraph}>{t('AGREE_WITH_EMPLOYER')}</Text>
        <Text style={styles.paragraph}>
          {t(
            '{company_name}_I_AUTHORIZES_PROSPECTIVE_EMPLOYER_TO_ACCESS',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>
        <Text style={styles.paragraph}>{t('I_FURTHER_UNDERSTAND_THAT_NEITHER_THE_PROSOECTIVE')}</Text>
        <Text style={styles.paragraph}>{t('I_UNDERSTAND_THAT_ANY_CRASH_OR_INSPECTION_PSP_REPORT')}</Text>
        <Text style={styles.paragraph}>{t('DISCLOSURE_BACKGROUND')}</Text>

        <Text style={styles.field}>
          <Text style={styles.label}>{t('NAME:')} </Text>
          {applicantName}
        </Text>
        <SignatureField value={signature} label={t('SIGNATURE:')} />
        <Text style={styles.field}>
          <Text style={styles.label}>{t('DATE:')} </Text>
          {formatDate(date)}
        </Text>

        <Text style={styles.footNote}>{t('NOTICE_DISCLOSURE')}</Text>
        <Text style={styles.footNote}>{t('NOTICE_THE_PROSPECTIVE_EMPLOYMENT_CONCEPT')}</Text>
        <Text style={styles.footNote}>{t('C_F_R')}</Text>
        <Text style={styles.footNote}>{t('LAST_UPDATED')}</Text>
      </Page>
    </Document>
  );
}

/** General Consent for limited queries of the FMCSA Drug & Alcohol Clearinghouse. */
export function GeneralConsentPdf({ applicant, t, company }: SignedAgreementDocumentProps) {
  const companyName = (company || applicant?.company)?.name || '';
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();
  const signature = extraValue(applicant, ApplicantExtras.SIGNATURE_GENERAL_CONSENT);
  const date = extraValue(applicant, ApplicantExtras.APPLY_DATE);

  return (
    <Document title={`General Consent for Queries - ${applicantName}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.title}>{t('GENERAL_CONSENT_QUERIES')}</Text>

        <Text style={styles.field}>
          <Text style={styles.label}>{t('NAME:')} </Text>
          {applicantName}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('EMPLOYERS_NAME:')} </Text>
          {companyName}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('CDL_LICENSE_NUMBER:')} </Text>
          {applicant?.license_number || ''}
        </Text>
        <Text style={styles.field}>
          <Text style={styles.label}>{t('EXPIRATION_DATE:')} </Text>
          {applicant?.license_expiry || ''}
        </Text>

        <Text style={[styles.paragraph, { marginTop: 12 }]}>
          {t(
            '{company_name}_{applicant_name}_IN_CONNECTION_WITH_YOUR_APPLICANT',
            { applicant_name: applicantName, company_name: companyName },
            { translateProps: true }
          )}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            '{company_name}_I_UNDERSTAND_THAT_IF_THE_LIMITED_QUERY',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>
        <Text style={styles.paragraph}>
          {t(
            '{company_name}_I_FURTHER_UNDERSTAND_THAT_IF_I_REFUSED_TO_PROVIDE_FOR',
            { company_name: companyName },
            { translateProps: true }
          )}
        </Text>

        <SignatureField value={signature} label={t('EMPLOYEE_SIGNATURE')} />
        <Text style={styles.field}>
          <Text style={styles.label}>{t('DATE_OF_CONSENT:')} </Text>
          {formatDate(date)}
        </Text>

        <Text style={styles.footNote}>{t('INSSTRUCTIONS_SECTION')}</Text>
      </Page>
    </Document>
  );
}

export interface SignedAgreementConfig {
  id: string;
  /** Translation key (falls back to the readable label when untranslated). */
  title: string;
  description: string;
  signatureField: ApplicantExtras;
  fileSlug: string;
  render: (props: SignedAgreementDocumentProps) => JSX.Element;
}

/**
 * The agreements a driver signs on the last step of the digital hiring
 * application, in the same order they are presented there
 * (see `LEGAL_DOCUMENTS` in forms/jotform/longForm/legal-documents).
 */
export const SIGNED_AGREEMENT_PDFS: SignedAgreementConfig[] = [
  {
    id: 'verification-of-employment',
    title: 'Verification of Employment',
    description: 'Safety Performance History Records Request',
    signatureField: ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
    fileSlug: 'Verification_of_Employment',
    render: (props) => <VoeConsentPdf {...props} />,
  },
  {
    id: 'disclosure-authorization',
    title: 'Disclosure & Authorization',
    description: 'Background check authorization and disclosure',
    signatureField: ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
    fileSlug: 'Disclosure_and_Authorization',
    render: (props) => <DisclosureAuthorizationPdf {...props} />,
  },
  {
    id: 'important-disclosure-background',
    title: 'Important Disclosure - Background PSP',
    description: 'Pre-employment Screening Program disclosure',
    signatureField: ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
    fileSlug: 'Important_Disclosure_Background_PSP',
    render: (props) => <BackgroundPspDisclosurePdf {...props} />,
  },
  {
    id: 'general-consent-queries',
    title: 'General Consent for Queries',
    description: 'Drug & Alcohol Clearinghouse consent',
    signatureField: ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
    fileSlug: 'General_Consent_for_Queries',
    render: (props) => <GeneralConsentPdf {...props} />,
  },
];

function buildFileName(applicant: ApplicantEntity, slug: string): string {
  return `${slug}_${(applicant?.first_name || '').trim()}_${(applicant?.last_name || '').trim()}.pdf`.replace(
    /\s+/g,
    '_'
  );
}

/**
 * View / Download controls for one signed agreement. The PDF is always
 * produceable — when no signature is on file the document renders with a blank
 * signature line so it can still be printed and signed by hand.
 */
export function SignedAgreementActions({
  applicant,
  agreement,
}: {
  applicant: ApplicantEntity;
  agreement: SignedAgreementConfig;
}) {
  const { t } = useTranslation();
  const { company } = useAuth();
  const [busy, setBusy] = useState<'view' | 'download' | null>(null);

  // Rendered on demand rather than through PDFDownloadLink: this list sits on
  // the applicant page, so an eager link per agreement would build every PDF on
  // each page load even though most are never opened.
  const buildBlob = () => pdf(agreement.render({ applicant, t, company })).toBlob();

  const handleView = async () => {
    setBusy('view');
    try {
      const url = URL.createObjectURL(await buildBlob());
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(null);
    }
  };

  const handleDownload = async () => {
    setBusy('download');
    try {
      const url = URL.createObjectURL(await buildBlob());
      const link = document.createElement('a');
      link.href = url;
      link.download = buildFileName(applicant, agreement.fileSlug);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="d-flex gap-2">
      <Button size="sm" variant="outline-secondary" onClick={handleView} disabled={!!busy}>
        {busy === 'view' ? (
          <span className="spinner-grow spinner-grow-sm" />
        ) : (
          <Eye className="me-1" />
        )}
        {t('View')}
      </Button>
      <Button size="sm" variant="outline-secondary" onClick={handleDownload} disabled={!!busy}>
        {busy === 'download' ? (
          <span className="spinner-grow spinner-grow-sm" />
        ) : (
          <CloudArrowDownFill className="me-1" />
        )}
        {t('Download PDF')}
      </Button>
    </div>
  );
}

/**
 * Lists every agreement signed at the end of the digital hiring application
 * with per-document View/Download PDF controls, flagging any that the driver
 * has not signed yet so the section is never silently misleading.
 */
export function SignedAgreementsPdfList({ applicant }: { applicant: ApplicantEntity }) {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column" style={{ gap: 12 }}>
      {SIGNED_AGREEMENT_PDFS.map((agreement) => {
        const signed = isSignatureImage(extraValue(applicant, agreement.signatureField));

        return (
          <div
            key={agreement.id}
            className="p-3 border rounded d-flex align-items-center justify-content-between"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileEarmarkText />
              <div>
                <div style={{ fontWeight: 600 }}>
                  {t(agreement.title)}
                  {signed ? (
                    <span className="badge bg-success ms-2">{t('SIGNED')}</span>
                  ) : (
                    <span className="badge bg-secondary ms-2">{t('NOT_SIGNED')}</span>
                  )}
                </div>
                <small className="text-muted">{t(agreement.description)}</small>
              </div>
            </div>
            <SignedAgreementActions applicant={applicant} agreement={agreement} />
          </div>
        );
      })}
    </div>
  );
}

export default SignedAgreementsPdfList;

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
  PDFDownloadLink,
  pdf,
} from '@react-pdf/renderer';

import { useTranslation } from '../../hooks/use-translation';
import { useAuth } from '../../hooks/use-auth';
import { ApplicantExtras } from '../../enums/applicants/applicant-extras.enum';
import { ApplicantEmployerEntity, ApplicantEntity } from '../../models/applicant';
import { CompanyEntity } from '../../models/company/company.entity';
import { UserEntity } from '../../models/user/user.entity';
import { buildAddress } from '../../utils/common';

export interface VoeAuthorizationProps {
  applicant: ApplicantEntity;
  employer: ApplicantEmployerEntity;
}

const styles = StyleSheet.create({
  page: { paddingVertical: 40, paddingHorizontal: 45, fontSize: 11, lineHeight: 1.4, color: '#000' },
  title: { fontSize: 18, textAlign: 'center', fontWeight: 'bold', marginBottom: 16 },
  sectionHeading: { fontSize: 18, fontWeight: 'bold', marginTop: 14, marginBottom: 4 },
  helper: { marginBottom: 8 },
  subHeading: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  paragraph: { marginBottom: 10 },
  field: { marginBottom: 2 },
  fieldSpaced: { marginBottom: 10 },
  label: { fontWeight: 'bold' },
  signatureRow: { flexDirection: 'row', marginTop: 16, marginBottom: 6 },
  signatureCol: { flex: 1 },
  signatureImg: { width: 200, height: 80, objectFit: 'contain', marginTop: 4, alignSelf: 'flex-start' },
  signatureLine: { borderTop: '1px solid #000', width: 180, marginTop: 18, paddingTop: 2 },
  // Section II accident table
  tableHeaderRow: { flexDirection: 'row', marginTop: 4, marginBottom: 2 },
  tableNumberRow: { flexDirection: 'row', marginBottom: 2 },
  colNum: { width: 24 },
  colDate: { flex: 2 },
  colLoc: { flex: 2 },
  colInj: { flex: 2 },
  colFat: { flex: 2 },
  colHaz: { flex: 2 },
  blankLine: { marginBottom: 2 },
});

const DATE_FORMAT_OPTS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

type TFn = (key: string, params?: any, opts?: any) => string;

export interface VoeAuthorizationDocumentProps {
  applicant: ApplicantEntity;
  employer: ApplicantEmployerEntity;
  t: TFn;
  // The hiring company (Section I-A "new employer"). Passed from the logged-in
  // recruiter's auth context, since the applicant payload doesn't always carry
  // its `company` relation. The signed-in user is the designated employer rep.
  company?: CompanyEntity;
  companyUser?: UserEntity;
}

// Builds the per-employer VOE authorization document. The driver's single
// VOE authorization signature is reused, with this specific employer's details
// filled in so the form can be transmitted to that previous employer. The
// authorization language intentionally still references "all previous employers"
// so the document reflects the single, blanket consent the driver gave at
// signing (FMCSR Part 391.23), rather than implying a per-employer signature.
export function VoeAuthorizationDocument({
  applicant,
  employer,
  t,
  company,
  companyUser,
}: VoeAuthorizationDocumentProps) {
  const applicantName = `${applicant?.first_name || ''} ${applicant?.last_name || ''}`.trim();

  // Prefer the handwritten signature the driver drew on their initial hiring
  // application (ApplicantExtras.SIGNATURE). The VOE-specific signature field is
  // frequently the "Use Typed Signature" (Dancing Script) variant, which renders
  // as a generated/"digital" signature rather than the driver's real hand-drawn
  // one. We fall back to the VOE authorization signature only when no application
  // signature is on file. Either way the image is the signature the applicant
  // actually provided — never a default/substituted one.
  const applicationSignature = applicant?.extras?.find(
    (e) => e?.type === ApplicantExtras.SIGNATURE && e?.value
  );
  const voeSignature = applicant?.extras?.find(
    (e) => e?.type === ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION && e?.value
  );
  const signature = applicationSignature || voeSignature;
  const applyDate = applicant?.extras?.find((e) => e?.type === ApplicantExtras.APPLY_DATE);

  const ssnMasked = applicant?.ssn_last4 ? `XX-XXXX-${String(applicant.ssn_last4).slice(-4)}` : '';

  // Section I-A — the hiring company (new/prospective employer) the driver
  // applied to. Prefer the logged-in recruiter's company/user (always loaded),
  // falling back to anything carried on the applicant payload.
  const hiringCompany = company || applicant?.company;
  const hiringUser = companyUser || applicant?.company?.users?.[0];
  const companyDer =
    `${hiringUser?.first_name || ''} ${hiringUser?.last_name || ''}`.trim() ||
    hiringUser?.name ||
    '';
  const newEmployerName = hiringCompany?.name || '';
  const newEmployerAddress = hiringCompany?.location || '';
  const newEmployerPhone = hiringCompany?.phone || hiringUser?.contact_number || '';

  // Section I-B — the previous employer this VOE is being transmitted to.
  const employerAddress = buildAddress(employer) || employer?.address || '';

  const dateText = applyDate?.value
    ? new Date(applyDate.value).toLocaleDateString('en-US', DATE_FORMAT_OPTS)
    : '';

  const blankLine = '__________________________________________________________';

  return (
    <Document title={`VOE - ${applicantName} - ${employer?.name || ''}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>VERIFICATION OF EMPLOYMENT</Text>

        <Text style={styles.sectionHeading}>{t('SECTION_I')}</Text>
        <Text style={styles.helper}>{t('TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER')}</Text>

        <Text style={styles.field}>
          <Text style={styles.label}>{t('VOE_EMPLOYEE_NAME_LABEL')}</Text>
          <Text style={styles.label}>{applicantName}</Text>
        </Text>
        <Text style={styles.fieldSpaced}>
          <Text style={styles.label}>{t('VOE_EMPLOYEE_SS_OR_ID_LABEL')}</Text>
          <Text style={styles.label}>{ssnMasked}</Text>
        </Text>

        <Text style={styles.paragraph}>{t('VERIFICATION_OF_EMPLOYMENT_FMCSR_AUTHORIZED')}</Text>
        <Text style={styles.paragraph}>{t('UNDERSTAND_CONSENT_REQUESTED')}</Text>
        <Text style={styles.paragraph}>
          I <Text style={styles.label}>{applicantName} </Text>
          {t('VOE_AUTHORIZE_COMPANY_SUFFIX')}
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <Text style={styles.label}>{t('SIGNATURE')}</Text>
            {signature?.value ? (
              <Image style={styles.signatureImg} src={signature.value} />
            ) : (
              <Text style={styles.signatureLine}> </Text>
            )}
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.label}>{t('DATE')}</Text>
            <Text style={{ marginTop: 4 }}>{dateText}</Text>
          </View>
        </View>

        {/* I-A: hiring company (the company user's details) */}
        <Text style={styles.subHeading}>{t('VOE_SECTION_I_A')}</Text>
        <Text style={styles.field}>{t('VOE_NEW_EMPLOYER_NAME_LABEL')}{newEmployerName}</Text>
        <Text style={styles.field}>{t('VOE_ADDRESS_LABEL')}{newEmployerAddress}</Text>
        <Text style={styles.field}>{t('VOE_PHONE_LABEL')}{newEmployerPhone}</Text>
        <Text style={styles.field}>{t('VOE_DER_LABEL')}{companyDer}</Text>

        {/* I-B: previous employer this form is transmitted to */}
        <Text style={styles.subHeading}>{t('VOE_SECTION_I_B')}</Text>
        <Text style={styles.field}>
          {employer?.is_current ? t('VOE_CURRENT_COMPANY_NAME_LABEL') : t('VOE_PREVIOUS_COMPANY_NAME_LABEL')}
          {employer?.name || ''}
        </Text>
        <Text style={styles.field}>{t('VOE_ADDRESS_LABEL')}{employerAddress}</Text>
        <Text style={styles.field}>{t('VOE_PHONE_LABEL')}{employer?.phone || ''}</Text>
        <Text style={styles.field}>{t('VOE_DER_IF_KNOWN_LABEL')}{employer?.manager_name || ''}</Text>

        <Text style={styles.sectionHeading}>{t('VOE_SECTION_II_HEADING')}</Text>
        <Text style={styles.helper}>{t('VOE_TO_BE_COMPLETED_BY_PREVIOUS_EMPLOYER')}</Text>
        <Text style={styles.label}>{t('II_A_ACCIDENT_HISTORY')}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.field}>{t('THE_APPLICANT_NAMED_ABOVE')}</Text>
        <Text style={styles.fieldSpaced}>{t('EMPLOYES_AS___________________________')}</Text>
        <Text style={styles.field}>{t('DID_HE/SHE_DRIVE_MOTOR_VEHICLE')}</Text>
        <Text style={styles.field}>{t('REASON_FOR_LEAVING_YOUR_EMPLOY')}</Text>
        <Text style={styles.fieldSpaced}>{t('IF_THERE_IS_NO_SAFETY')}</Text>

        <Text style={styles.paragraph}>{t('VOE_ACCIDENTS_INTRO')}</Text>

        <View style={styles.tableHeaderRow}>
          <Text style={styles.colNum}> </Text>
          <Text style={styles.colDate}>{t('VOE_COL_DATE')}</Text>
          <Text style={styles.colLoc}>{t('VOE_COL_LOCATION')}</Text>
          <Text style={styles.colInj}>{t('VOE_COL_INJURIES')}</Text>
          <Text style={styles.colFat}>{t('VOE_COL_FATALITIES')}</Text>
          <Text style={styles.colHaz}>{t('VOE_COL_HAZMAT')}</Text>
        </View>
        {['1.', '2.', '3.'].map((n) => (
          <View key={n} style={styles.tableNumberRow}>
            <Text style={styles.colNum}>{n}</Text>
            <Text style={styles.colDate}> </Text>
            <Text style={styles.colLoc}> </Text>
            <Text style={styles.colInj}> </Text>
            <Text style={styles.colFat}> </Text>
            <Text style={styles.colHaz}> </Text>
          </View>
        ))}

        <Text style={[styles.paragraph, { marginTop: 8 }]}>{t('VOE_OTHER_ACCIDENTS')}</Text>
        {[0, 1, 2, 3].map((i) => (
          <Text key={`oa-${i}`} style={styles.blankLine}>{blankLine}</Text>
        ))}

        <Text style={[styles.field, { marginTop: 8 }]}>{t('ANY_OTHER_MARK')}</Text>
        {[0, 1, 2].map((i) => (
          <Text key={`rm-${i}`} style={styles.blankLine}>{blankLine}</Text>
        ))}

        <Text style={[styles.subHeading, { fontSize: 11 }]}>{t('II_B')}</Text>
        <Text style={styles.fieldSpaced}>{t('VOE_NAME_OF_PERSON_SECTION_IIA')}</Text>
        <Text style={styles.field}>{t('VOE_TITLE_LABEL')}</Text>
        <Text style={styles.field}>{t('VOE_PHONE_LABEL')}</Text>
        <Text style={styles.field}>{t('DATE')}:</Text>
      </Page>
    </Document>
  );
}

export function hasVoeSignature(applicant: ApplicantEntity): boolean {
  // Gate VOE generation on the driver having completed the VOE authorization
  // consent step. (The signature *image* shown on the form prefers their
  // hand-drawn application signature — see VoeAuthorizationDocument.)
  return Boolean(
    applicant?.extras?.find((e) => e?.type === ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION)?.value
  );
}

// Renders "View" and "Download" controls that produce a VOE authorization
// document for one specific employer, reusing the driver's single signature.
// When `disabled` (e.g. the driver has no VOE signature on file) the controls
// render inert with `disabledReason` surfaced as a tooltip.
export function VoeAuthorizationActions({
  applicant,
  employer,
  disabled = false,
  disabledReason,
}: VoeAuthorizationProps & { disabled?: boolean; disabledReason?: string }) {
  const { t } = useTranslation();
  // The signed-in recruiter is the new (hiring) employer in Section I-A.
  const { user, company } = useAuth();
  const [isOpening, setIsOpening] = useState(false);

  const fileName = `VOE_${(applicant?.first_name || '').trim()}_${(applicant?.last_name || '').trim()}_${(employer?.name || 'employer').trim()}.pdf`
    .replace(/\s+/g, '_');

  if (disabled) {
    return (
      <div className="d-flex gap-2" title={disabledReason}>
        <Button size="sm" variant="outline-secondary" disabled>
          <Eye className="me-1" />
          {t('VIEW_VOE')}
        </Button>
        <Button size="sm" variant="outline-secondary" disabled>
          <CloudArrowDownFill className="me-1" />
          {t('DOWNLOAD_VOE')}
        </Button>
      </div>
    );
  }

  const handleView = async () => {
    setIsOpening(true);
    try {
      const blob = await pdf(
        <VoeAuthorizationDocument
          applicant={applicant}
          employer={employer}
          t={t}
          company={company}
          companyUser={user}
        />
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
        document={
          <VoeAuthorizationDocument
            applicant={applicant}
            employer={employer}
            t={t}
            company={company}
            companyUser={user}
          />
        }
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

// Lists every employer on the applicant with per-employer View/Download VOE
// controls. When the driver has no VOE signature on file the controls are
// shown disabled with an explanatory note, so the section is never silently
// empty.
export function VoeAuthorizationList({ applicant }: { applicant: ApplicantEntity }) {
  const { t } = useTranslation();
  const signed = hasVoeSignature(applicant);
  const employers = (applicant?.employers || []).filter((e) => e?.name);

  if (!employers.length) {
    return <div className="text-muted small">{t('NO_EMPLOYERS_ON_FILE')}</div>;
  }

  return (
    <div className="d-flex flex-column" style={{ gap: 12 }}>
      {!signed && (
        <div className="alert alert-warning py-2 px-3 mb-0 small" role="alert">
          {t('NO_VOE_SIGNATURE_ON_FILE')}
        </div>
      )}
      {employers.map((employer, i) => (
        <div
          key={employer.id || i}
          className="p-3 border rounded d-flex align-items-center justify-content-between"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileEarmarkText />
            <span style={{ fontWeight: 600 }}>{employer.name}</span>
            {employer.is_current && (
              <span className="badge bg-success ms-1">{t('CURRENT')}</span>
            )}
          </div>
          <VoeAuthorizationActions
            applicant={applicant}
            employer={employer}
            disabled={!signed}
            disabledReason={t('NO_VOE_SIGNATURE_ON_FILE')}
          />
        </div>
      ))}
    </div>
  );
}

export default VoeAuthorizationActions;

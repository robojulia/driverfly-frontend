import { NextPageContext } from 'next';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getQuickApplyPages,
  getQuickApplyStyle,
} from '../../../components/forms/jotform/quick-apply-pages';
import { PoweredByLogo } from '../../../components/forms/jotform/powered-by-logo';
import { CompanyLogoUpperRight } from '../../../components/forms/jotform/company-logo-upper-right';
import { ReturningUserBanner } from '../../../components/applicants/returning-user-banner';
import JotformContext from '../../../context/jotform-context';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../models/applicant';
import { CompanyPreferenceEntity } from '../../../models/company/company-preferences.entity';
import { CompanyEntity } from '../../../models/company/company.entity';
import styles from '../../../styles/digitalhiringapp.module.css';
import ApplicantApi from '../../api/applicant';
import CompanyApi from '../../api/company';

export interface QuickApplyProps {
  entity: ApplicantEntity;
  company: CompanyEntity;
  preferences: CompanyPreferenceEntity[];
}
export default function QuickApply({ entity, company, preferences }: QuickApplyProps) {
  const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
  const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>(entity.extras);
  const [isEditingExistingApplicant, setIsEditingExistingApplicant] = useState<boolean>(true); // Quick apply is always editing existing
  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  const [steps, setSteps] = useState<number>(0);
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  // Show welcome back message for returning applicants
  useEffect(() => {
    const companyName = company?.name || 'this company';
    const jobInfo = entity.jobs && entity.jobs.length > 0
      ? ` for ${entity.jobs[0].job?.title || 'a position'}`
      : '';

    toast.info(
      `Welcome back! Continuing your quick application to ${companyName}${jobInfo}.`,
      {
        position: 'top-center',
        autoClose: 5000,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - props intentionally excluded

  return (
    <JotformContext.Provider
      value={{
        state: {
          applicant,
          applicantExtras,
          companyPreferences: preferences,
          steps,
          company,
          isEditingExistingApplicant,
        },
        method: {
          setApplicant,
          updateApplicantExtras,
          setApplicantExtras,
          stepNext,
          stepBack,
          setIsEditingExistingApplicant,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form} style={getQuickApplyStyle(steps)}>
            {/* Show company logo in upper right on all cards except the first one (splash page) */}
            {steps > 0 && <CompanyLogoUpperRight />}
            {/* Show returning user banner on all pages except the first (splash page) */}
            {steps > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <ReturningUserBanner applicant={applicant} companyName={company?.name} />
              </div>
            )}
            {/* uncomment this during development */}
            {/* <BaseInput
              value={steps}
              min={0}
              max={26}
              type="number"
              onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
            {getQuickApplyPages(steps)}
          </div>
          {/* Show "Powered by DriverFly" below the card */}
          <PoweredByLogo />
        </div>
      </div>
    </JotformContext.Provider>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  try {
    const applicant_uuid = String(query?.applicant_uuid);

    if (!!!applicant_uuid) return { notFound: true };

    const applicantApi = new ApplicantApi();
    const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(applicant_uuid, {
      withRelations: [
        'extras',
        'documents',
        'employers',
        'accident_history',
        'moving_violation_history',
      ],
    });

    if (!!!entity) return { notFound: true };

    const companyApi = new CompanyApi();
    const company: CompanyEntity = await companyApi.employer.getById(entity?.company?.id);
    const preferences: CompanyPreferenceEntity[] = await companyApi.preferences.list(company.id);
    entity.company = company;

    return { props: { entity, company, preferences } };
  } catch (error) {
    console.error(
      `form/quick-apply: Exception when attempting to fetch details : ${query}`,
      error.message
    );
    return { notFound: true };
  }
}

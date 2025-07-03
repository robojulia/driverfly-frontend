import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import {
  getFullFormPages,
  getFullFormStyle,
} from '../../../components/forms/jotform/jotform-pages';
import FormProgress from '../../../components/forms/jotform/form-progress';
import { DevPageNavigator } from '../../../components/developer/dev-page-navigator';
import JotformContext from '../../../context/jotform-context';
import { Status } from '../../../enums/status.enum';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../models/applicant';
import { UtmReferral } from '../../../models/auth/utm-referral.interface';
import { CompanyPreferenceEntity } from '../../../models/company/company-preferences.entity';
import { CompanyEntity } from '../../../models/company/company.entity';
import { JobEntity } from '../../../models/job/job.entity';

import styles from '../../../styles/digitalhiringapp.module.css';
import CompanyApi from '../../api/company';
import JobApi from '../../api/job';

export interface FullFormProps {
  employer: CompanyEntity;
  preferences: CompanyPreferenceEntity[];
  utm?: UtmReferral;
  employerJobs?: JobEntity[];
}
export default function FullForm({ employer, preferences, utm, employerJobs }: FullFormProps) {
  const [jobs, setJobs] = useState<JobEntity[]>([]);
  const [companyJobs, setCompanyJobs] = useState<JobEntity[]>(employerJobs);
  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  const [steps, setSteps] = useState<number>(0);
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  // Total number of steps in the form
  const totalSteps = 29; // Based on getFullFormPages in jotform-pages.tsx

  useEffect(() => {
    setApplicant((oldValues) => ({ ...oldValues, company: employer }));
  }, [employer]);

  return (
    <JotformContext.Provider
      value={{
        state: {
          applicant,
          jobs,
          companyJobs,
          applicantExtras,
          companyPreferences: preferences,
          steps,
          utm,
          company: employer,
        },
        method: {
          setApplicant,
          setJobs,
          setCompanyJobs,
          updateApplicantExtras,
          setApplicantExtras,
          setSteps,
          stepNext,
          stepBack,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form} style={getFullFormStyle(steps)}>
            {steps > 0 && steps < totalSteps - 1 && (
              <FormProgress currentStep={steps} totalSteps={totalSteps} />
            )}
            {getFullFormPages(steps)}
          </div>
        </div>
      </div>

      {/* Developer Page Navigator */}
      <DevPageNavigator formType="full" currentStep={steps} totalSteps={totalSteps} />
    </JotformContext.Provider>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  try {
    let slug = String(query?.slug);

    const utm: UtmReferral = {
      utm_source: (query?.utm_source as string) ?? null,
      utm_medium: (query?.utm_medium as string) ?? null,
      utm_campaign: (query?.utm_campaign as string) ?? null,
      utm_content: (query?.utm_content as string) ?? null,
      referral_name: (query?.referral_name as string) ?? null,
    };

    if (!slug) {
      console.error(`form/jotform: Unable to fetch details for companyId: ${query?.slug}`);
      return { notFound: true };
    }

    const companyApi = new CompanyApi();
    const jobApi = new JobApi();
    const employer: CompanyEntity = await companyApi.employer.getBySlug(slug);
    const preferences: CompanyPreferenceEntity[] = await companyApi.preferences.list(employer.id);

    if (employer?.status != Status.ACTIVE) {
      if (employer == null) {
        console.error(`form/jotform: Employer ${query?.slug} not found - does not exist`);
      } else {
        console.error(
          `form/jotform: Employer ${query?.slug} found, but status is not ACTIVE (status = ${employer?.status})`
        );
      }
      return { notFound: true };
    }

    const employerJobs = (await jobApi.search({
      companyId: employer?.id,
      withoutPagination: true,
    })) as JobEntity[];

    return { props: { employer, preferences, utm, employerJobs } };
  } catch (error) {
    console.error(
      `form/jotform: Exception when attempting to fetch details for companyId: ${query?.companyId}`,
      error.message
    );
    return { notFound: true };
  }
}

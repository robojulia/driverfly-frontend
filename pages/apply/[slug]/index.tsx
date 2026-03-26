import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import {
  getFullFormPages,
  getFullFormStyle,
  getTotalSteps,
} from '../../../components/forms/jotform/jotform-pages';
import FormProgress from '../../../components/forms/jotform/form-progress';
import { PoweredByLogo } from '../../../components/forms/jotform/powered-by-logo';
import { CompanyLogoUpperRight } from '../../../components/forms/jotform/company-logo-upper-right';
import JotformContext from '../../../context/jotform-context';
import { Status } from '../../../enums/status.enum';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../models/applicant';
import { TrackingContext } from '../../../models/auth/utm-referral.interface';
import { CompanyPreferenceEntity } from '../../../models/company/company-preferences.entity';
import { CompanyEntity } from '../../../models/company/company.entity';
import { JobEntity } from '../../../models/job/job.entity';
import { useJobAnalytics } from '../../../hooks/use-job-analytics';

import styles from '../../../styles/digitalhiringapp.module.css';
import CompanyApi from '../../api/company';
import JobApi from '../../api/job';

export interface FullFormProps {
  employer: CompanyEntity;
  preferences: CompanyPreferenceEntity[];
  utm?: TrackingContext;
  employerJobs?: JobEntity[];
  directJobId?: number | null;
  directJob?: JobEntity | null;
}
export default function FullForm({
  employer,
  preferences,
  utm,
  employerJobs,
  directJobId,
  directJob,
}: FullFormProps) {
  const { trackApplicationStart } = useJobAnalytics();

  const [jobs, setJobs] = useState<JobEntity[]>(directJob ? [directJob] : []);
  const [companyJobs, setCompanyJobs] = useState<JobEntity[]>(employerJobs);
  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>([]);
  const [directJobState, setDirectJobState] = useState<JobEntity | null>(directJob || null);
  const [isEditingExistingApplicant, setIsEditingExistingApplicant] = useState<boolean>(false);
  const [isPrefilled, setIsPrefilled] = useState<boolean>(false);
  const [isEditingFromSummary, setIsEditingFromSummary] = useState<boolean>(false);

  const isDirectJobApplication = Boolean(directJobId && directJob);

  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  const [steps, setSteps] = useState<number>(0);
  const stepNext = (): void => {
    console.log('🔵 stepNext called');
    console.log('isEditingFromSummary:', isEditingFromSummary);
    console.log('current steps:', steps);

    if (isEditingFromSummary) {
      // If editing from summary, return to summary page and reset flag
      console.log('✅ Navigating back to summary (step -1)');
      setIsEditingFromSummary(false);
      setSteps(-1);
    } else {
      // Normal flow: go to next step
      console.log('➡️ Going to next step:', steps + 1);
      setSteps(steps + 1);
    }
  };
  const stepBack = (): void => {
    if (isEditingFromSummary) {
      // If editing from summary, return to summary page and reset flag
      setIsEditingFromSummary(false);
      setSteps(-1);
    } else {
      // Normal flow: go to previous step
      setSteps(steps - 1);
    }
  };

  // Calculate total steps based on application type
  const totalSteps = getTotalSteps(isDirectJobApplication);

  // Track "Entered the DHA application (FullForm component)" analytics
  useEffect(() => {
    if (isDirectJobApplication && directJob) {
      trackApplicationStart(directJob.id, directJob.company?.id || employer.id, {
        // Don't set source here — let getBaseMetadata() read utm_source from the URL
        // so UTM-tagged links are attributed correctly in analytics
        applicationType: 'full_application',
        applicationSource: 'dha_full_form',
        additional: {
          formType: 'DHA_FullForm',
          isDirectJobApplication: true,
          jobId: directJob.id,
          companyId: directJob.company?.id || employer.id,
          utm,
        },
      });
    } else if (employer?.id) {
      trackApplicationStart(0, employer.id, {
        applicationType: 'full_application',
        applicationSource: 'dha_full_form',
        additional: {
          formType: 'DHA_FullForm',
          isDirectJobApplication: false,
          companyId: employer.id,
          utm,
        },
      });
    }
  }, [isDirectJobApplication, directJob, employer?.id, trackApplicationStart, utm]);

  useEffect(() => {
    setApplicant((oldValues) => ({ ...oldValues, company: employer }));
  }, [employer]);

  // Auto-select the direct job if present
  useEffect(() => {
    if (isDirectJobApplication && directJob) {
      setJobs([directJob]);
    }
  }, [isDirectJobApplication, directJob]);

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
          directJobId,
          directJob: directJobState,
          isDirectJobApplication,
          isEditingExistingApplicant,
          isPrefilled,
          isEditingFromSummary,
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
          setDirectJob: setDirectJobState,
          setIsEditingExistingApplicant,
          setIsPrefilled,
          setIsEditingFromSummary,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form} style={getFullFormStyle(steps, isDirectJobApplication)}>
            {/* Show company logo in upper right on all cards except the first one (splash page) */}
            {steps > 0 && <CompanyLogoUpperRight />}
            {steps > 0 && steps < totalSteps - 1 && (
              <FormProgress currentStep={steps} totalSteps={totalSteps} />
            )}
            {getFullFormPages(steps, isDirectJobApplication, isPrefilled)}
          </div>
        </div>
        {/* Show "Powered by DriverFly" at bottom center of page */}
        <PoweredByLogo />
      </div>

      {/* Developer Page Navigator */}
    </JotformContext.Provider>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  try {
    let slug = String(query?.slug);
    const jobId = query?.jobId ? parseInt(String(query.jobId), 10) : null;

    const utm: TrackingContext = {
      utm: {
        source: (query?.utm_source as string) ?? null,
        medium: (query?.utm_medium as string) ?? null,
        campaign: (query?.utm_campaign as string) ?? null,
        content: (query?.utm_content as string) ?? null,
      },
      referral: {
        name: (query?.referral_name as string) ?? null,
        code: (query?.referral_code as string) ?? null,
      },
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

    // Handle direct job application
    let directJob: JobEntity | null = null;
    if (jobId) {
      try {
        directJob = await jobApi.getById(jobId);

        // Verify that the job belongs to the specified company
        if (!directJob || directJob.company?.id !== employer.id) {
          console.error(
            `form/jotform: Job ${jobId} not found or doesn't belong to company ${employer.name}`
          );
          return { notFound: true };
        }

        // Verify job is active
        if (directJob.status !== Status.ACTIVE) {
          console.error(`form/jotform: Job ${jobId} is not active (status = ${directJob.status})`);
          return { notFound: true };
        }
      } catch (error) {
        console.error(`form/jotform: Error fetching job ${jobId}:`, error.message);
        return { notFound: true };
      }
    }

    return {
      props: {
        employer,
        preferences,
        utm,
        employerJobs,
        directJobId: jobId,
        directJob,
      },
    };
  } catch (error) {
    console.error(
      `form/jotform: Exception when attempting to fetch details for companyId: ${query?.companyId}`,
      error.message
    );
    return { notFound: true };
  }
}

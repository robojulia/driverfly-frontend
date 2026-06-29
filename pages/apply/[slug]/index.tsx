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
  employer?: CompanyEntity | null;
  preferences?: CompanyPreferenceEntity[];
  utm?: TrackingContext;
  employerJobs?: JobEntity[];
  directJobId?: number | null;
  directJob?: JobEntity | null;
  backendError?: boolean;
}

// Shown when the backend can't be reached so drivers get a clear, retryable
// message instead of an endless spinner.
function ApplyUnavailable() {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div
          className={styles.main_form}
          style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}
        >
          <h1 className={styles.jot_form_headers_font} style={{ marginBottom: '1rem' }}>
            We&rsquo;re having trouble loading the application
          </h1>
          <p style={{ marginBottom: '1.5rem' }}>
            This is usually temporary. Please check your connection and try again in a moment.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
      <PoweredByLogo />
    </div>
  );
}

export default function FullForm(props: FullFormProps) {
  // A missing employer means the backend fetch failed or timed out in
  // getServerSideProps — render a friendly, retryable screen rather than hang.
  if (props.backendError || !props.employer) {
    return <ApplyUnavailable />;
  }

  return <FullFormInner {...props} employer={props.employer} />;
}

function FullFormInner({
  employer,
  preferences = [],
  utm,
  employerJobs = [],
  directJobId = null,
  directJob = null,
}: FullFormProps & { employer: CompanyEntity }) {
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

// Cap each server-side backend call so a slow/unreachable backend fails fast
// (and renders the retry screen) instead of hanging the whole page request.
const SSR_FETCH_TIMEOUT_MS = 12000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms fetching ${label}`)), ms)
    ),
  ]);
}

// Distinguish "the backend is down/slow" (retryable) from "this company/job
// genuinely doesn't exist" (a real 404). Only the former should show the retry
// screen; the latter should still 404.
function isBackendUnavailable(error: any): boolean {
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') return true; // axios timeout
  if (typeof error?.message === 'string' && error.message.startsWith('Timed out after')) return true;
  const status = error?.response?.status;
  if (status == null) return true; // no HTTP response => network/DNS/TLS failure
  return status >= 500; // backend error, not a missing record
}

export async function getServerSideProps({ query }: NextPageContext) {
  const slug = query?.slug ? String(query.slug) : '';
  try {
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
    const employer: CompanyEntity = await withTimeout(
      companyApi.employer.getBySlug(slug),
      SSR_FETCH_TIMEOUT_MS,
      'employer'
    );

    // A missing or inactive employer is a genuine 404 — check before any
    // further calls so we don't misclassify it as a backend outage.
    if (employer == null || employer.status != Status.ACTIVE) {
      if (employer == null) {
        console.error(`form/jotform: Employer ${slug} not found - does not exist`);
      } else {
        console.error(
          `form/jotform: Employer ${slug} found, but status is not ACTIVE (status = ${employer.status})`
        );
      }
      return { notFound: true };
    }

    const preferences: CompanyPreferenceEntity[] = await withTimeout(
      companyApi.preferences.list(employer.id),
      SSR_FETCH_TIMEOUT_MS,
      'preferences'
    );

    const employerJobs = (await withTimeout(
      jobApi.search({
        companyId: employer?.id,
        withoutPagination: true,
      }),
      SSR_FETCH_TIMEOUT_MS,
      'employerJobs'
    )) as JobEntity[];

    // Handle direct job application
    let directJob: JobEntity | null = null;
    if (jobId) {
      try {
        directJob = await withTimeout(jobApi.getById(jobId), SSR_FETCH_TIMEOUT_MS, 'directJob');

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
        // Backend failures bubble up to the outer handler (retry screen);
        // anything else here is a genuine job lookup failure (404).
        if (isBackendUnavailable(error)) throw error;
        console.error(`form/jotform: Error fetching job ${jobId}:`, error?.message);
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
    // Backend unreachable/slow => show the retryable screen instead of a
    // misleading "page not found" or an indefinite hang.
    if (isBackendUnavailable(error)) {
      console.error(
        `form/jotform: backend unavailable while loading apply page for slug "${slug}":`,
        error?.message
      );
      return { props: { backendError: true } };
    }
    console.error(
      `form/jotform: Exception when attempting to fetch details for slug "${slug}":`,
      error?.message
    );
    return { notFound: true };
  }
}

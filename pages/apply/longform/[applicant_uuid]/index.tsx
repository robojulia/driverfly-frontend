import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getLongFormPages } from '../../../../components/forms/jotform/jotform-pages';
import { DevPageNavigator } from '../../../../components/developer/dev-page-navigator';
import { PoweredByLogo } from '../../../../components/forms/jotform/powered-by-logo';
import { CompanyLogoUpperRight } from '../../../../components/forms/jotform/company-logo-upper-right';
import JotformContext from '../../../../context/jotform-context';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../../models/applicant';
import { CompanyPreferenceEntity } from '../../../../models/company/company-preferences.entity';
import { JobEntity } from '../../../../models/job/job.entity';
import styles from '../../../../styles/digitalhiringapp.module.css';
import ApplicantApi from '../../../api/applicant';
import FormProgress from '../../../../components/forms/jotform/form-progress';
import { useFormPersistence } from '../../../../hooks/use-form-persistence';
import ProgressSaveIndicator from '../../../../components/forms/jotform/progress-save-indicator';

export interface LongFormProps {
  applicant: ApplicantEntity;
  applicantExtras: ApplicantExtrasEntity[];
  jobs?: JobEntity[];
  companyPreferences?: CompanyPreferenceEntity[];
}

export default function LongForm({
  applicant: initialApplicant,
  applicantExtras: initialApplicantExtras,
  jobs: initialJobs,
  companyPreferences,
}: LongFormProps) {
  const [jobs, setJobs] = useState<JobEntity[]>(initialJobs);
  const [applicant, setApplicant] = useState<ApplicantEntity>(initialApplicant);
  const [applicantExtras, setApplicantExtras] =
    useState<ApplicantExtrasEntity[]>(initialApplicantExtras);
  const [isEditingExistingApplicant, setIsEditingExistingApplicant] = useState<boolean>(true); // Long form is always editing existing
  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  // Initialize step from last_completed_step if available
  const [steps, setSteps] = useState<number>(initialApplicant.last_completed_step ?? 0);
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  // Total number of steps in the long form
  const totalSteps = 20; // Based on getLongFormPages in jotform-pages.tsx

  // Initialize form persistence for browser crash recovery
  const storageKey = `dha-progress-${initialApplicant.uuid_token}`;
  const formData = {
    applicant,
    applicantExtras,
  };

  const { saveToStorage, restoreFromStorage, clearStorage, hasStoredData } = useFormPersistence(
    formData,
    steps,
    {
      storageKey,
      autoSaveInterval: 2000, // Save 2 seconds after changes
      storageType: 'localStorage',
    }
  );

  // Show welcome back message if resuming from saved progress
  useEffect(() => {
    if (initialApplicant.last_completed_step && initialApplicant.last_completed_step > 0) {
      const companyName = initialApplicant.company?.name || 'this company';
      const jobInfo = initialApplicant.jobs && initialApplicant.jobs.length > 0
        ? ` for ${initialApplicant.jobs[0].job?.title || 'a position'}`
        : '';

      toast.info(
        `Welcome back! Continuing your application to ${companyName}${jobInfo}. Resuming from step ${initialApplicant.last_completed_step + 1} of ${totalSteps}`,
        {
          position: 'top-center',
          autoClose: 7000,
        }
      );
    } else {
      // First time accessing this application
      const companyName = initialApplicant.company?.name || 'this company';
      const jobInfo = initialApplicant.jobs && initialApplicant.jobs.length > 0
        ? ` for ${initialApplicant.jobs[0].job?.title || 'a position'}`
        : '';

      toast.info(
        `Welcome back! Continuing your application to ${companyName}${jobInfo}.`,
        {
          position: 'top-center',
          autoClose: 5000,
        }
      );
    }
  }, []); // Only run on mount

  // Restore data on component mount if available
  useEffect(() => {
    if (hasStoredData) {
      const restored = restoreFromStorage();
      if (restored && restored.formData) {
        // Only restore if we have stored data for later steps
        if (restored.currentStep > steps) {
          if (restored.formData.applicant) {
            setApplicant({ ...applicant, ...restored.formData.applicant });
          }
          if (restored.formData.applicantExtras) {
            setApplicantExtras(restored.formData.applicantExtras);
          }
          setSteps(restored.currentStep);

          // Notify user that progress was restored
          const timestamp = new Date(restored.timestamp).toLocaleString();
          toast.info(`Progress restored from ${timestamp}`, {
            position: 'top-center',
            autoClose: 5000,
          });
        }
      }
    }
  }, []); // Only run on mount

  // Clear progress when form is completed (step 20)
  useEffect(() => {
    if (steps >= totalSteps) {
      clearStorage();
    }
  }, [steps, totalSteps, clearStorage]);

  return (
    <JotformContext.Provider
      value={{
        state: {
          applicant,
          jobs,
          applicantExtras,
          companyPreferences,
          steps,
          company: applicant?.company,
          isEditingExistingApplicant,
        },
        method: {
          setApplicant,
          setJobs,
          updateApplicantExtras,
          setApplicantExtras,
          setSteps,
          stepNext,
          stepBack,
          setIsEditingExistingApplicant,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form}>
            <CompanyLogoUpperRight />
            <FormProgress currentStep={steps} totalSteps={totalSteps} />
            <ProgressSaveIndicator showLastSaved={true} />
            {getLongFormPages(steps)}
          </div>
          {/* Show "Powered by DriverFly" below the card */}
          <PoweredByLogo />
        </div>
      </div>

      {/* Developer Page Navigator */}
      <DevPageNavigator formType="long" currentStep={steps} totalSteps={totalSteps} />
    </JotformContext.Provider>
  );
}

export async function getServerSideProps({ query }: NextPageContext) {
  try {
    const { applicant_uuid } = query || {};

    if (!!!applicant_uuid) return { notFound: true };

    const applicantApi = new ApplicantApi();
    const params = {
      withRelations: [
        'extras',
        'documents',
        'employers',
        'accident_history',
        'moving_violation_history',
        'company',
      ],
    };
    const applicant: ApplicantEntity = await applicantApi.fetchByUuidToken(
      String(applicant_uuid),
      params
    );
    console.log('applicant', applicant);

    if (!!!applicant) return { notFound: true };

    // Extract applicant extras and other related data
    const applicantExtras = applicant.extras || [];
    const jobs: JobEntity[] = []; // Initialize empty jobs array for longform
    const companyPreferences: CompanyPreferenceEntity[] = []; // You may want to fetch these based on company

    return {
      props: {
        applicant,
        applicantExtras,
        jobs,
        companyPreferences,
      },
    };
  } catch (error) {
    console.error('error', error.message);
    return { notFound: true };
  }
}

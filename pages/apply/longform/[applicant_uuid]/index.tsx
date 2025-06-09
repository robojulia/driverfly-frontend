import { NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { getLongFormPages } from '../../../../components/forms/jotform/jotform-pages';
import { DevPageNavigator } from '../../../../components/developer/dev-page-navigator';
import JotformContext from '../../../../context/jotform-context';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../../models/applicant';
import { CompanyPreferenceEntity } from '../../../../models/company/company-preferences.entity';
import { JobEntity } from '../../../../models/job/job.entity';
import styles from '../../../../styles/digitalhiringapp.module.css';
import ApplicantApi from '../../../api/applicant';
import FormProgress from '../../../../components/forms/jotform/form-progress';

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
  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  const [steps, setSteps] = useState<number>(0);
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  // Total number of steps in the long form
  const totalSteps = 20; // Based on getLongFormPages in jotform-pages.tsx

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
        },
        method: {
          setApplicant,
          setJobs,
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
          <div className={styles.main_form}>
            <FormProgress currentStep={steps} totalSteps={totalSteps} />
            {getLongFormPages(steps)}
          </div>
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

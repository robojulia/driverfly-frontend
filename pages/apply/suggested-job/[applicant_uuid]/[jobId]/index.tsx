import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getLongFormStyle,
  getSuggestedJobPages,
} from '../../../../../components/forms/jotform/jotform-pages';
import JotformContext from '../../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { ApplicantEntity, ApplicantExtrasEntity } from '../../../../../models/applicant';
import { CompanyEntity } from '../../../../../models/company/company.entity';
import { JobEntity } from '../../../../../models/job/job.entity';
import ApplicantApi from '../../../../api/applicant';
import CompanyApi from '../../../../api/company';
import JobApi from '../../../../api/job';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { DevPageNavigator } from '../../../../../components/developer/dev-page-navigator';

export interface SuggestedJobsProps {
  entity: ApplicantEntity;
  job: JobEntity;
  company: CompanyEntity;
}

export default function SuggestedJobs({ entity, job, company }: SuggestedJobsProps) {
  const [jobs, setJobs] = useState<JobEntity[]>([job]);
  const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
  const [applicantExtras, setApplicantExtras] = useState<ApplicantExtrasEntity[]>(entity.extras);
  const [isEditingExistingApplicant, setIsEditingExistingApplicant] = useState<boolean>(true); // Suggested jobs are always editing existing

  const updateApplicantExtras = (applicantExtrasEntity: ApplicantExtrasEntity) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type != applicantExtrasEntity?.type);
      return !!oldApx ? [...oldApx, { ...applicantExtrasEntity }] : [{ ...applicantExtrasEntity }];
    });

  const [steps, setSteps] = useState<number>(
    entity?.jobs?.some((j) => j?.job?.id == job?.id) ? 4 : 0
  );
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  // Total number of steps in the suggested job form
  const totalSteps = 5; // Based on getSuggestedJobPages in jotform-pages.tsx

  // Show welcome back message for returning applicants
  useEffect(() => {
    const companyName = company?.name || 'this company';
    const jobTitle = job?.title || 'this position';
    const hasAlreadyApplied = entity?.jobs?.some((j) => j?.job?.id == job?.id);

    if (hasAlreadyApplied) {
      toast.info(
        `You've already applied to ${jobTitle} at ${companyName}. You can review and update your application.`,
        {
          position: 'top-center',
          autoClose: 6000,
        }
      );
    } else {
      // Check if they've applied to other jobs at this company
      const otherJobsAtCompany = entity?.jobs?.filter((j) => j?.company?.id === company?.id) || [];
      if (otherJobsAtCompany.length > 0) {
        const previousJob = otherJobsAtCompany[0]?.job?.title || 'another position';
        toast.info(
          `Welcome back! You previously applied to ${previousJob} at ${companyName}. Now applying to ${jobTitle}.`,
          {
            position: 'top-center',
            autoClose: 7000,
          }
        );
      } else {
        // Applied to different company
        const previousCompany = entity?.jobs?.[0]?.company?.name || entity?.company?.name;
        if (previousCompany && previousCompany !== companyName) {
          toast.info(
            `Welcome back! You previously applied to ${previousCompany}. Now applying to ${jobTitle} at ${companyName}.`,
            {
              position: 'top-center',
              autoClose: 7000,
            }
          );
        } else {
          toast.info(
            `Welcome back! Applying to ${jobTitle} at ${companyName}.`,
            {
              position: 'top-center',
              autoClose: 5000,
            }
          );
        }
      }
    }
  }, []); // Only run on mount

  return (
    <JotformContext.Provider
      value={{
        state: {
          applicant,
          applicantExtras,
          steps,
          jobs,
          company,
          isEditingExistingApplicant,
        },
        method: {
          setApplicant,
          updateApplicantExtras,
          stepNext,
          stepBack,
          setJobs,
          setIsEditingExistingApplicant,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form} style={getLongFormStyle(steps)}>
            {/* uncomment this during development */}
            {/* <BaseInput
  					  value={steps}
  					  min={0}
  					  max={26}
              type="number"
						  onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
            {getSuggestedJobPages(steps, job.id)}
          </div>
        </div>
      </div>

      {/* Developer Page Navigator */}
      <DevPageNavigator formType="suggested" currentStep={steps} totalSteps={totalSteps} />
    </JotformContext.Provider>
  );
}

export async function getServerSideProps({ query }) {
  try {
    const { applicant_uuid, jobId } = query || {};

    if (!Boolean(applicant_uuid) || !Boolean(jobId)) return { notFound: true };

    const applicantApi = new ApplicantApi();
    const entity: ApplicantEntity = await applicantApi.fetchByUuidToken(applicant_uuid, {
      withRelations: [
        'jobs',
        'extras',
        'documents',
        'employers',
        'employer.voeData',
        'accident_history',
        'moving_violation_history',
      ],
    });

    const jobApi = new JobApi();
    const job = await jobApi.getById(jobId);

    if (!Boolean(entity) || !Boolean(job)) return { notFound: true };

    const companyApi = new CompanyApi();
    const company: CompanyEntity = await companyApi.employer.getById(job.company?.id);

    delete entity?.id;
    delete entity?.user;
    delete entity?.company;
    delete entity?.uuid_token;
    entity.employers = entity?.employers?.map((employer) => {
      delete employer?.id;
      delete employer?.voeData?.id;
      if (!Boolean(employer?.voeData?.allow_share)) delete employer?.voeData;
      return employer;
    });
    entity.extras = entity.extras
      ?.map(({ type, value }) => ({ type, value }))
      ?.filter(
        ({ type }) =>
          !Boolean([ApplicantExtras.GOOD_FIT, ApplicantExtras.BAD_FIT_REASON].includes(type))
      );

    return { props: { entity, job, company } };
  } catch (error) {
    console.log('error', error.message);

    return { notFound: true };
  }
}

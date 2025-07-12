import { NextPageContext } from 'next';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  getQuickApplyPages,
  getQuickApplyStyle,
} from '../../../components/forms/jotform/quick-apply-pages';
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
            {/* uncomment this during development */}
            {/* <BaseInput
              value={steps}
              min={0}
              max={26}
              type="number"
              onChange={({ target: { value } }) => setSteps(parseInt(value))} /> */}
            {getQuickApplyPages(steps)}
          </div>
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

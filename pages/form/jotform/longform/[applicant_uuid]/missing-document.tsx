import { useEffect, useState } from "react";
import styles from "../../../../../styles/jotform.module.css";
import {
  ApplicantEntity,
  ApplicantExtrasEntity,
} from "../../../../../models/applicant";
import JotformContext from "../../../../../context/jotform-context";
import {
  getLongFormStyle,
  getMissingDocumentsPages,
} from "../../../../../components/forms/jotform/jotform-pages";
import ApplicantApi from "../../../../api/applicant";

export interface LongFormProps {
  entity: ApplicantEntity;
}

export default function LongForm({ entity }: LongFormProps) {
  const [applicant, setApplicant] = useState<ApplicantEntity>(entity);
  const [applicantExtras, setApplicantExtras] = useState<
    ApplicantExtrasEntity[]
  >(entity?.extras);
  const updateApplicantExtras = (
    applicantExtrasEntity: ApplicantExtrasEntity
  ) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v?.type !== applicantExtrasEntity?.type);
      return !!oldApx
        ? [...oldApx, { ...applicantExtrasEntity }]
        : [{ ...applicantExtrasEntity }];
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
          steps,
        },
        method: {
          setApplicant,
          updateApplicantExtras,
          stepNext,
          stepBack,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form} style={getLongFormStyle(steps)}>
            {getMissingDocumentsPages(steps)}
          </div>
        </div>
      </div>
    </JotformContext.Provider>
  );
}

export async function getServerSidePropsForMissingDocuments({ query }) {
  try {
    const { uuid } = query || {};

    if (!!!uuid) return { notFound: true };

    const applicantApi = new ApplicantApi();
    const entity: ApplicantEntity = await applicantApi.getByUuidToken(uuid);

    if (!!!entity) return { notFound: true };

    return { props: { entity } };
  } catch (error) {
    return { notFound: true };
  }
}

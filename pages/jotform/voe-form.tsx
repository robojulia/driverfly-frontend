import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { IntroPage } from "../../components/forms/jotform/voe-forms/voe-intro-page";
import jotformContext from "../../context/jotform-context";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { EmployedByUs } from "../../components/forms/jotform/voe-forms/employed-by-us";
import { AccidentHistory } from "../../components/forms/jotform/voe-forms/accident-history";
import { SubmissionDetails } from "../../components/forms/jotform/voe-forms/submission-details";
import { ApplicantVoeFormEntity } from "../../models/applicant/applicant-voe-form.entity";

const pages = [IntroPage, EmployedByUs, AccidentHistory, SubmissionDetails];

export default function voeForm() {
  const [applicant, setApplicant] = useState<ApplicantEntity>(
    new ApplicantEntity()
  );
  const [applicantExtras, setApplicantExtras] = useState<
    ApplicantExtrasEntity[]
  >([]);
  const updateApplicantExtras = (
    applicantExtrasEntity: ApplicantExtrasEntity
  ) =>
    setApplicantExtras((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type !== applicantExtrasEntity.type);
      return !!oldApx
        ? [...oldApx, { ...applicantExtrasEntity }]
        : [{ ...applicantExtrasEntity }];
    });

  const [applicantVoe, setApplicantVoe] = useState<ApplicantVoeFormEntity[]>(
    []
  );
  const updateApplicantVoe = (applicantVoeEntity: ApplicantVoeFormEntity) =>
    setApplicantVoe((oldApx) => {
      oldApx = oldApx?.filter((v) => v.type !== applicantVoeEntity.type);
      return !!oldApx
        ? [...oldApx, { ...applicantVoeEntity }]
        : [{ ...applicantVoeEntity }];
    });
  const [steps, setSteps] = useState<number>(0);
  const stepNext = (): void => setSteps(steps + 1);
  const stepBack = (): void => setSteps(steps - 1);

  useEffect(() => {
    console.log("applicantextrasvalues", applicantExtras);
  }, []);

  return (
    <jotformContext.Provider
      value={{
        state: {
          applicant,
          applicantExtras,
          applicantVoe,
          steps,
        },
        method: {
          setApplicant,
          updateApplicantExtras,
          updateApplicantVoe,
          setSteps,
          stepNext,
          stepBack,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main__voe_form}>
            <PageControl steps={steps} />
          </div>
        </div>
      </div>
    </jotformContext.Provider>
  );
}

function PageControl({ steps }: { steps: number }): JSX.Element {
  const CurrentPage = pages[steps];
  return <CurrentPage />;
}

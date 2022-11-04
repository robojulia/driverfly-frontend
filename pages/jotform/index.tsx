import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { FirstPage } from "../../components/forms/jotform/shortForm/splash-page";
import { SecondPage } from "../../components/forms/jotform/shortForm/names";
import { ThirdPage } from "../../components/forms/jotform/shortForm/basic-info";
import { FourthPage } from "../../components/forms/jotform/shortForm/cdl-experience";
import { FifthPage } from "../../components/forms/jotform/shortForm/accident-violation";
import { SixthPage } from "../../components/forms/jotform/shortForm/hear-about";
import { SeventhPage } from "../../components/forms/jotform/shortForm/continue-longgorm";

import { DriverApplication } from "../../components/forms/jotform/longForm/driver-application";
import { BackgroundInfo } from "../../components/forms/jotform/longForm/background-info";
import { HighestLevelEducation } from "../../components/forms/jotform/longForm/highest-level-education";
import { DrivingExp } from "../../components/forms/jotform/longForm/driving-experirence";
import { OtherQues } from "../../components/forms/jotform/longForm/other-queues";
import { PhotoUpload } from "../../components/forms/jotform/longForm/driver-photo-upload";
import { MedicalCardUpload } from "../../components/forms/jotform/longForm/medical-card-upload";
import { EmergencyContact } from "../../components/forms/jotform/longForm/emergency-contact";
import { EmploymentHistory } from "../../components/forms/jotform/longForm/employment-history";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { PastEmploymentHistory } from "../../components/forms/jotform/longForm/past-employment-history";
import { Preferences } from "../../components/forms/jotform/longForm/preference";
import { Halfway } from "../../components/forms/jotform/longForm/half-way";
import { WorkedBefore } from "../../components/forms/jotform/longForm/worked-before";
import { AccidentsLast5Years } from "../../components/forms/jotform/longForm/accident-history";
import { DrugTest } from "../../components/forms/jotform/longForm/drug-test";
import { FelonyConviction } from "../../components/forms/jotform/longForm/felony-conviction";
import { UnableForJob } from "../../components/forms/jotform/longForm/unable-for-job";
import { PastSuspensions } from "../../components/forms/jotform/longForm/past-suspension";
import { ViolationsLast3Years } from "../../components/forms/jotform/longForm/violaton-history";
import ApplicantApi from "../api/applicant";
import { AccordianLastPage } from "../../components/forms/jotform/longForm/accordian";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../context/jotform-context";
import { PageProps } from "../../types/jotform/page-props.type";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";

export default function jotFormLongForm() {
  const [steps, setSteps] = useState<number>(0);
  const [applicant, setApplicant] = useState<ApplicantEntity>(
    new ApplicantEntity()
  );

  const [applicantExtras, setApplicantExtras] =
    useState<ApplicantExtrasEntity[]>();
  const updateApplicantExtras = (value: ApplicantExtrasEntity) =>
    setApplicantExtras((oldArray) =>
      !!oldArray ? [...oldArray, { ...value }] : [{ ...value }]
    );

  const onNextClick: PageProps["onNextClick"] = (partialEntity) => {
    setApplicant({ ...applicant, ...partialEntity });
    console.log("valuessssssss 2", applicant);
    setSteps(steps + 1);
  };

  const onBackClick: PageProps["onBackClick"] = () => {
    setSteps(steps - 1);
  };

  useEffect(() => {
    console.log("applicantextrasvalues", applicantExtras);
  }, []);

  const shortFormDataSent: PageProps["shortFormDataSent"] = async (
    params: any
  ) => {
    onNextClick(applicant);

    // try {
    // const applicantApi = new ApplicantApi();
    //   const response = await api.create(applicant);

    //   if (response) setApplicant(response);
    //   setApplicant(response);
    //   onNextClick(applicant);
    //   //   toast.success(t("SUCCESS"));
    // } catch (error) {
    //   toast("kkkk");

    //   console.log(error);
    // }
  };
  const getPageAccordingToStep = (step: number) => {
    return {
      0: pageOne(),
      1: pageTwo(),
      2: pageThree(),
      3: pageFour(),
      4: pageFive(),
      5: pageSix(),
      6: pageSeven(),
      7: pageEight(),
      8: pageNine(),
      9: pageTen(),
      10: pageEleven(),
      11: pageTwelve(),
      12: pageThirteen(),
      13: pageFourteen(),
      14: pageFifteen(),
      15: pageSixteen(),
      16: pageSeventeen(),
      17: pageEighteen(),
      18: pageNineteen(),
      19: pageTwenty(),
      20: pageTwentyOne(),
      21: pageTwentyTwo(),
      22: pageTwentyThree(),
      23: pageTwentyFour(),
      24: pageTwentyFive(),
      25: pageTwentySix(),
      26: pageTwentySeven(),
    }[step];
  };

  return (
    <jotformContext.Provider
      value={{
        state: {
          applicant,
          applicantExtras,
          steps,
        },
        method: {
          setApplicant,
          updateApplicantExtras,
          setSteps,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form}>
            {getPageAccordingToStep(steps)}
          </div>
        </div>
      </div>
    </jotformContext.Provider>
  );
}

const pageOne = () => {
  return <FirstPage />;
};

const pageTwo = () => {
  return <SecondPage />;
};

const pageThree = () => {
  return <ThirdPage />;
};

const pageFour = () => {
  return <FourthPage />;
};

const pageFive = () => {
  return <FifthPage />;
};

const pageSix = () => {
  return <SixthPage />;
};

const pageSeven = () => {
  return <SeventhPage />;
};

const pageEight = () => {
  return <DriverApplication />;
};

const pageNine = () => {
  return <HighestLevelEducation />;
};

const pageTen = () => {
  return <BackgroundInfo />;
};

const pageEleven = () => {
  return <DrivingExp />;
};

const pageTwelve = () => {
  return <OtherQues />;
};

const pageThirteen = () => {
  return <PhotoUpload />;
};

const pageFourteen = () => {
  return <MedicalCardUpload />;
};

const pageFifteen = () => {
  return <EmergencyContact />;
};

const pageSixteen = () => {
  return <EmploymentHistory />;
};

const pageSeventeen = () => {
  return <PastEmploymentHistory />;
};

const pageEighteen = () => {
  return <Preferences />;
};

const pageNineteen = () => {
  return <Halfway />;
};

const pageTwenty = () => {
  return <WorkedBefore />;
};

const pageTwentyOne = () => {
  return <AccidentsLast5Years />;
};

const pageTwentyTwo = () => {
  return <ViolationsLast3Years />;
};

const pageTwentyThree = () => {
  return <PastSuspensions />;
};

const pageTwentyFour = () => {
  return <UnableForJob />;
};

const pageTwentyFive = () => {
  return <FelonyConviction />;
};

const pageTwentySix = () => {
  return <DrugTest />;
};

const pageTwentySeven = () => {
  return <AccordianLastPage />;
};

function t(arg0: string): import("react-toastify").ToastContent {
  throw new Error("Function not implemented.");
}

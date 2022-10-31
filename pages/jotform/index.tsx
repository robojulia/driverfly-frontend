import React, { useEffect, useState } from "react";
import styles from "../../styles/Jotform.module.css";
import { FirstPage } from "../../components/forms/Jotform/shortForm/splashPage01";
import { SecondPage } from "../../components/forms/Jotform/shortForm/names";
import { ThirdPage } from "../../components/forms/Jotform/shortForm/basicInfo";
import { FourthPage } from "../../components/forms/Jotform/shortForm/cdlExperience";
import { FifthPage } from "../../components/forms/Jotform/shortForm/accidentViolation";
import { SixthPage } from "../../components/forms/Jotform/shortForm/hearAbout";
import { SeventhPage } from "../../components/forms/Jotform/shortForm/continueLongForm";

import { DriverApplication } from "../../components/forms/Jotform/longForm/DriverApplication";
import { BackgroundInfo } from "../../components/forms/Jotform/longForm/BackgroundInfo";
import { HighestLevelEducation } from "../../components/forms/Jotform/longForm/HighestLevelEducation";
import { DrivingExp } from "../../components/forms/Jotform/longForm/DrivingExp";
import { OtherQues } from "../../components/forms/Jotform/longForm/OtherQues";
import { PhotoUpload } from "../../components/forms/Jotform/longForm/PhotoUpload";
import { MedicalCardUpload } from "../../components/forms/Jotform/longForm/MedicalCardUpload";
import { EmergencyContact } from "../../components/forms/Jotform/longForm/EmergencyContact";
import { EmploymentHistory } from "../../components/forms/Jotform/longForm/EmploymentHistory";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { PastEmploymentHistory } from "../../components/forms/Jotform/longForm/PastEmployerHistory";
import { Preferences } from "../../components/forms/Jotform/longForm/Preferences";
import { Halfway } from "../../components/forms/Jotform/longForm/Halfway";
import { WorkedBefore } from "../../components/forms/Jotform/longForm/WorkedBefore";
import { AccidentsLast5Years } from "../../components/forms/Jotform/longForm/AccidentsLast5Years";
import { DrugTest } from "../../components/forms/Jotform/longForm/DrugTest";
import { FelonyConviction } from "../../components/forms/Jotform/longForm/FelonyConvictions";
import { UnableForJob } from "../../components/forms/Jotform/longForm/UnableForJob";
import { PastSuspensions } from "../../components/forms/Jotform/longForm/PastSuspensions";
import { ViolationsLast3Years } from "../../components/forms/Jotform/longForm/ViolationsLast3Years";
import ApplicantApi from "../api/applicant";
import { AccordianLastPage } from "../../components/forms/Jotform/longForm/AccordianLastPage";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../context/jotform-context";

export default function jotFormLongForm() {
  const [steps, setSteps] = useState(0);
  const [applicant, setApplicant] = useState(new ApplicantEntity());

  function onNextClick(partialEntity) {
    setApplicant({ ...applicant, ...partialEntity });
    console.log("valuessssssss 2", applicant);
    setSteps(steps + 1);
  }

  function onBackClick() {
    setSteps(steps - 1);
  }

  // useEffect(() => {
  //   toast.success(t("SUCCESS"));
  // }, []);
  async function shortFormDataSent(params: any) {
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
  }
  const getPageAccordingToStep = (step, applicant) => {
    if (step == 0) return pageOne(onNextClick);
    if (step == 1) return pageTwo(onNextClick, onBackClick);
    if (step == 2) return pageThree(onNextClick, onBackClick);
    if (step == 3) return pageFour(onNextClick, onBackClick);
    if (step == 4) return pageFive(onNextClick, onBackClick);
    if (step == 5) return pageSix(onNextClick, onBackClick);
    if (step == 6)
      return pageSeven(onNextClick, onBackClick, shortFormDataSent);
    if (step == 7) return pageEight(onNextClick, applicant);
    if (step == 8) return pageNine(onNextClick, onBackClick, applicant);
    if (step == 9) return pageTen(onNextClick, onBackClick, applicant);
    if (step == 10) return pageEleven(onNextClick, onBackClick, applicant);
    if (step == 11) return pageTwelve(onNextClick, onBackClick, applicant);
    if (step == 12) return pageThirteen(onNextClick, onBackClick, applicant);
    if (step == 13) return pageFourteen(onNextClick, onBackClick, applicant);
    if (step == 14) return pageFifteen(onNextClick, onBackClick, applicant);
    if (step == 15) return pageSixteen(onNextClick, onBackClick, applicant);
    if (step == 16) return pageSeventeen(onNextClick, onBackClick, applicant);
    if (step == 17) return pageEighteen(onNextClick, onBackClick, applicant);
    if (step == 18) return pageNineteen(onNextClick, onBackClick, applicant);
    if (step == 19) return pageTwenty(onNextClick, onBackClick, applicant);
    if (step == 20) return pageTwentyOne(onNextClick, onBackClick, applicant);
    if (step == 21) return pageTwentyTwo(onNextClick, onBackClick, applicant);
    if (step == 22) return pageTwentyThree(onNextClick, onBackClick, applicant);
    if (step == 23) return pageTwentyFour(onNextClick, onBackClick, applicant);
    if (step == 24) return pageTwentyFive(onNextClick, onBackClick, applicant);
    if (step == 25) return pageTwentySix(onNextClick, onBackClick, applicant);
    if (step == 26) return pageTwentySeven(onNextClick, onBackClick, applicant);
    else return <h1>Error</h1>;
  };

  return (
    <jotformContext.Provider
      value={{
        state: {
          applicant,
        },
        method: {
          setApplicant,
        },
      }}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.main_form}>
            {getPageAccordingToStep(steps, applicant)}
          </div>
        </div>
      </div>
    </jotformContext.Provider>
  );
}
const pageOne = (onNextClick) => {
  return <FirstPage onNextClick={onNextClick} />;
};

const pageTwo = (onNextClick, onBackClick) => {
  return (
    <>
      <SecondPage onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageThree = (onNextClick, onBackClick) => {
  return (
    <>
      <ThirdPage onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageFour = (onNextClick, onBackClick) => {
  return (
    <>
      <FourthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageFive = (onNextClick, onBackClick) => {
  return (
    <>
      <FifthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageSix = (onNextClick, onBackClick) => {
  return (
    <>
      <SixthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageSeven = (onNextClick, onBackClick, shortFormDataSent) => {
  return (
    <>
      <SeventhPage onNextClick={shortFormDataSent} />
    </>
  );
};

const pageEight = (onNextClick, applicant) => {
  return (
    <>
      <DriverApplication onNextClick={onNextClick} applicant={applicant} />
    </>
  );
};

const pageNine = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <HighestLevelEducation
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageTen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <BackgroundInfo
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageEleven = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <DrivingExp
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageTwelve = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <OtherQues
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageThirteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <PhotoUpload
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageFourteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <MedicalCardUpload
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageFifteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <EmergencyContact
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};

const pageSixteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <EmploymentHistory
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageSeventeen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <PastEmploymentHistory
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageEighteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <Preferences
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageNineteen = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <Halfway
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageTwenty = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <WorkedBefore
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageTwentyOne = (onNextClick, onBackClick, applicant) => {
  return (
    <>
      <AccidentsLast5Years
        onNextClick={onNextClick}
        onBackClick={onBackClick}
        applicant={applicant}
      />
    </>
  );
};
const pageTwentyTwo = (onNextClick, onBackClick, applicant) => {
  return (
    <ViolationsLast3Years
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      applicant={applicant}
    />
  );
};

const pageTwentyThree = (onNextClick, onBackClick, applicant) => {
  return (
    <PastSuspensions
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      applicant={applicant}
    />
  );
};

const pageTwentyFour = (onNextClick, onBackClick, applicant) => {
  return (
    <UnableForJob
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      applicant={applicant}
    />
  );
};

const pageTwentyFive = (onNextClick, onBackClick, applicant) => {
  return (
    <FelonyConviction
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      applicant={applicant}
    />
  );
};

const pageTwentySix = (onNextClick, onBackClick, applicant) => {
  return (
    <DrugTest
      onNextClick={onNextClick}
      onBackClick={onBackClick}
      applicant={applicant}
    />
  );
};
const pageTwentySeven = (onNextClick, onBackClick, applicant) => {
  return (
    <AccordianLastPage
    // onNextClick={onNextClick}
    // onBackClick={onBackClick}
    // applicant={applicant}
    />
  );
};
function t(arg0: string): import("react-toastify").ToastContent {
  throw new Error("Function not implemented.");
}

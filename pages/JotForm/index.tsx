import React, { useState } from "react";
import styles from "../../styles/JotForm.module.css";
import { FirstPage } from "../../components/forms/Jotform/shortForm/page_01 - SPlashPage";
import { SecondPage } from "../../components/forms/Jotform/shortForm/page_02 - NameFirstAndLast.tsx";
import { ThirdPage } from "../../components/forms/Jotform/shortForm/page_03 - EmailPhZipAuth";
import { FourthPage } from "../../components/forms/Jotform/shortForm/page_04-CdlEx";
import { FifthPage } from "../../components/forms/Jotform/shortForm/page_05-AccidentsViolations";
import { SixthPage } from "../../components/forms/Jotform/shortForm/page_06-HearAboutUs";
import { SeventhPage } from "../../components/forms/Jotform/shortForm/page_07 - ContinueApplication";

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
import ApplicantApi from "../api/applicant";
import { toast } from "react-toastify";

export default function jotFormLongForm() {
  const [steps, setSteps] = useState(0);
  const [applicant, setApplicant] = useState(new ApplicantEntity());

  function onNextClick(partialEntity) {
    setApplicant({ ...applicant, ...partialEntity });
    console.log("valuessssssss 1 partial", partialEntity);

    setSteps(steps + 1);
    console.log("valuessssssss 2", applicant);
  }

  function onBackClick() {
    setSteps(steps - 1);
  }

  async function shortFormDataSent(params: any) {
    try {
      const api = new ApplicantApi();
      const response = await api.create(applicant);

      if (response) setApplicant(response);
      setApplicant(response);
      onNextClick(applicant);
      //   toast.success(t("SUCCESS"));
    } catch (error) {
      toast("kkkk");

      console.log(error);
    }
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
    else return <h1>Error</h1>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.main_form}>
          {getPageAccordingToStep(steps, applicant)}
        </div>
      </div>
    </div>
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

function t(arg0: string): import("react-toastify").ToastContent {
  throw new Error("Function not implemented.");
}

// const CustomButton = ({ label, onClickHandler }) => {
//     return (<button className={styles.customButton} onClick={onClickHandler}>{label}</button>)
// }

// jotFormLongForm.getLayout = function getLayout(page) {
//     return (
//         <>{page}</>
//     )
// }

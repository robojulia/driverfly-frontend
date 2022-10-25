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
import { Halfway } from "../../components/forms/Jotform/longForm/Halfway";
import { WorkedBefore } from "../../components/forms/Jotform/longForm/WorkedBefore";
import { AccidentsLast5Years } from "../../components/forms/Jotform/longForm/AccidentsLast5Years";
import { DrugTest } from "../../components/forms/Jotform/longForm/DrugTest";
import { FelonyConviction } from "../../components/forms/Jotform/longForm/FelonyConvictions";
import { UnableForJob } from "../../components/forms/Jotform/longForm/UnableForJob";
import { PastSuspensions } from "../../components/forms/Jotform/longForm/PastSuspensions";
import { ViolationsLast3Years } from "../../components/forms/Jotform/longForm/ViolationsLast3Years";
export default function jotFormLongForm() {
  const [steps, setSteps] = useState(0);
  const [applicant, setApplicant] = useState(new ApplicantEntity());

  function onNextClick(partialEntity) {
    setApplicant({
      ...applicant,
      ...partialEntity,
    });
    setSteps(steps + 1);
  }

  function onBackClick() {
    setSteps(steps - 1);
  }

  const getPageAccordingToStep = (step) => {
    if (step == 0) return pageOne(onNextClick);
    if (step == 1) return pageTwo(onNextClick, onBackClick);
    if (step == 2) return pageThree(onNextClick, onBackClick);
    if (step == 3) return pageFour(onNextClick, onBackClick);
    if (step == 4) return pageFive(onNextClick, onBackClick);
    if (step == 5) return pageSix(onNextClick, onBackClick);
    if (step == 6) return pageSeven(onNextClick, onBackClick);
    if (step == 7) return pageEight(onNextClick, onBackClick);
    if (step == 8) return pageNine(onNextClick, onBackClick);
    if (step == 9) return pageTen(onNextClick, onBackClick);
    if (step == 10) return pageEleven(onNextClick, onBackClick);
    if (step == 11) return pageTwelve(onNextClick, onBackClick);
    if (step == 12) return pageThirteen(onNextClick, onBackClick);
    if (step == 13) return pageFourteen(onNextClick, onBackClick);
    if (step == 14) return pageFifteen(onNextClick, onBackClick);
    if (step == 15) return pageSixteen(onNextClick, onBackClick);
    if (step == 16) return pageSeventeen(onNextClick, onBackClick);
    if (step == 17) return pageEighteen(onNextClick, onBackClick);
    if (step == 18) return pageNineteen(onNextClick, onBackClick);
    if (step == 19) return pageTwenty(onNextClick, onBackClick);
    if (step == 20) return pageTwentyOne(onNextClick, onBackClick);
    if (step == 21) return pageTwentyTwo(onNextClick, onBackClick);
    if (step == 22) return pageTwentyThree(onNextClick, onBackClick);
    if (step == 23) return pageTwentyFour(onNextClick, onBackClick);
    if (step == 24) return pageTwentyFive(onNextClick, onBackClick);
    if (step == 25) return pageTwentySix(onNextClick, onBackClick);

    else return <h1>Error</h1>;
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.main_form}>
          {getPageAccordingToStep(steps)}

          {/* <button onClick={() => { setSteps(steps + 1) }}>increase</button> */}
        </div>
      </div>
    </div>
  );
}

const pageOne = (onNextClick) => {
  return <FirstPage onNextClick={onNextClick} />
 
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

const pageSeven = (onNextClick, onBackClick) => {
  return (
    <>
      <SeventhPage onNextClick={onNextClick} />
    </>
  );
};

const pageEight = (onNextClick, onBackClick) => {
  return (
    <>
      <DriverApplication onNextClick={onNextClick} />
    </>
  );
};

const pageNine = (onNextClick, onBackClick) => {
  return (
    <>
      <HighestLevelEducation
        onNextClick={onNextClick}
        onBackClick={onBackClick}
      />
    </>
  );
};

const pageTen = (onNextClick, onBackClick) => {
  return (
    <>
      <BackgroundInfo onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageEleven = (onNextClick, onBackClick) => {
  return (
    <>
      <DrivingExp onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageTwelve = (onNextClick, onBackClick) => {
  return (
    <>
      <OtherQues onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageThirteen = (onNextClick, onBackClick) => {
  return (
    <>
      <PhotoUpload onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageFourteen = (onNextClick, onBackClick) => {
  return (
    <>
      <MedicalCardUpload onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageFifteen = (onNextClick, onBackClick) => {
  return (
    <>
      <EmergencyContact onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};

const pageSixteen = (onNextClick, onBackClick) => {
  return (
    <>
      <EmploymentHistory onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageSeventeen = (onNextClick, onBackClick) => {
  return (
    <>
      <PastEmploymentHistory
        onNextClick={onNextClick}
        onBackClick={onBackClick}
      />
    </>
  );
};
const pageEighteen = (onNextClick, onBackClick) => {
  return (
    <>
      <Preferences onNextClick={onNextClick} onBackClick={onBackClick} />
    </>
  );
};
const pageNineteen = (onNextClick, onBackClick) => {
    return (
      <>
        <Halfway onNextClick={onNextClick} onBackClick={onBackClick} />
      </>
    );
  };
const pageTwenty = (onNextClick, onBackClick) => {
    return (
      <>
        <WorkedBefore onNextClick={onNextClick} onBackClick={onBackClick} />
      </>
    );
};
const pageTwentyOne = (onNextClick, onBackClick) => {
    return (
      <>
        <AccidentsLast5Years onNextClick={onNextClick} onBackClick={onBackClick} />
      </>
    );
};
const pageTwentyTwo = (onNextClick, onBackClick) =>{
    return(
        <ViolationsLast3Years onNextClick={ onNextClick } onBackClick={ onBackClick }
        />
    )
}

const pageTwentyThree = (onNextClick, onBackClick) =>{
    return(
        <PastSuspensions onNextClick={ onNextClick } onBackClick={ onBackClick }
        />
    )
}

const pageTwentyFour = (onNextClick, onBackClick) =>{
    return(
        <UnableForJob onNextClick={ onNextClick } onBackClick={ onBackClick }
        />
    )
}

const pageTwentyFive = (onNextClick, onBackClick) =>{
    return(
        <FelonyConviction onNextClick={ onNextClick } onBackClick={ onBackClick }
        />
    )
}

const pageTwentySix = (onNextClick, onBackClick) =>{
    return(
        <DrugTest onNextClick={ onNextClick } onBackClick={ onBackClick }
        />
    )
}

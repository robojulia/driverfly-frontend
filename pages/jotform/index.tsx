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

export default function jotFormLongForm() {
  const [steps, setSteps] = useState<number>(0);
  const [applicant, setApplicant] = useState<ApplicantEntity>(
    new ApplicantEntity()
  );

  const onNextClick: PageProps["onNextClick"] = (partialEntity) => {
    setApplicant({ ...applicant, ...partialEntity });
    console.log("valuessssssss 2", applicant);
    setSteps(steps + 1);
  };

  const onBackClick: PageProps["onBackClick"] = () => {
    setSteps(steps - 1);
  };

  // useEffect(() => {
  //   toast.success(t("SUCCESS"));
  // }, []);
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
      0: pageOne(onNextClick),
      1: pageTwo(onNextClick, onBackClick),
      2: pageThree(onNextClick, onBackClick),
      3: pageFour(onNextClick, onBackClick),
      4: pageFive(onNextClick, onBackClick),
      5: pageSix(onNextClick, onBackClick),
      6: pageSeven(onNextClick, onBackClick, shortFormDataSent),
      7: pageEight(onNextClick),
      8: pageNine(onNextClick, onBackClick),
      9: pageTen(onNextClick, onBackClick),
      10: pageEleven(onNextClick, onBackClick),
      11: pageTwelve(onNextClick, onBackClick),
      12: pageThirteen(onNextClick, onBackClick),
      13: pageFourteen(onNextClick, onBackClick),
      14: pageFifteen(onNextClick, onBackClick),
      15: pageSixteen(onNextClick, onBackClick),
      16: pageSeventeen(onNextClick, onBackClick),
      17: pageEighteen(onNextClick, onBackClick),
      18: pageNineteen(onNextClick, onBackClick),
      19: pageTwenty(onNextClick, onBackClick),
      20: pageTwentyOne(onNextClick, onBackClick),
      21: pageTwentyTwo(onNextClick, onBackClick),
      22: pageTwentyThree(onNextClick, onBackClick),
      23: pageTwentyFour(onNextClick, onBackClick),
      24: pageTwentyFive(onNextClick, onBackClick),
      25: pageTwentySix(onNextClick, onBackClick),
      26: pageTwentySeven(onNextClick, onBackClick),
    }[step];
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
            {getPageAccordingToStep(steps)}
          </div>
        </div>
      </div>
    </jotformContext.Provider>
  );
}

const pageOne = (onNextClick: PageProps["onNextClick"]) => {
  return <FirstPage onNextClick={onNextClick} />;
};

const pageTwo = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <SecondPage onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageThree = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <ThirdPage onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageFour = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <FourthPage onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageFive = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <FifthPage onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageSix = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <SixthPage onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageSeven = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"],
  shortFormDataSent: PageProps["onBackClick"]
) => {
  return <SeventhPage onNextClick={shortFormDataSent} />;
};

const pageEight = (onNextClick: PageProps["onNextClick"]) => {
  return <DriverApplication onNextClick={onNextClick} />;
};

const pageNine = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <HighestLevelEducation
      onNextClick={onNextClick}
      onBackClick={onBackClick}
    />
  );
};

const pageTen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <BackgroundInfo onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageEleven = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <DrivingExp onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageTwelve = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <OtherQues onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageThirteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <PhotoUpload onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageFourteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <MedicalCardUpload onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageFifteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <EmergencyContact onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageSixteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <EmploymentHistory onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageSeventeen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <PastEmploymentHistory
      onNextClick={onNextClick}
      onBackClick={onBackClick}
    />
  );
};

const pageEighteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <Preferences onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageNineteen = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <Halfway onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageTwenty = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <WorkedBefore onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageTwentyOne = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <AccidentsLast5Years onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageTwentyTwo = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <ViolationsLast3Years onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageTwentyThree = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <PastSuspensions onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageTwentyFour = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <UnableForJob onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageTwentyFive = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <FelonyConviction onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

const pageTwentySix = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return <DrugTest onNextClick={onNextClick} onBackClick={onBackClick} />;
};

const pageTwentySeven = (
  onNextClick: PageProps["onNextClick"],
  onBackClick: PageProps["onBackClick"]
) => {
  return (
    <AccordianLastPage onNextClick={onNextClick} onBackClick={onBackClick} />
  );
};

function t(arg0: string): import("react-toastify").ToastContent {
  throw new Error("Function not implemented.");
}

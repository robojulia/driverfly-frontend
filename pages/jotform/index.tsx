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
import { PageProps } from "../../types/jotform/page-props.type";

export default function jotFormLongForm() {

    const [steps, setSteps] = useState<number>(0);
    const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());

    const onNextClick: PageProps["onNextClick"] = (partialEntity) => {
        setApplicant({ ...applicant, ...partialEntity });
        console.log("valuessssssss 2", applicant);
        setSteps(steps + 1);
    }

    const onBackClick: PageProps["onBackClick"] = () => {
        setSteps(steps - 1);
    }

    // useEffect(() => {
    //   toast.success(t("SUCCESS"));
    // }, []);
    const shortFormDataSent: PageProps["shortFormDataSent"] = async (params: any) => {
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

    const getPageAccordingToStep = (step: number, applicant: ApplicantEntity) => {
        return {
            0: pageOne(onNextClick),
            1: pageTwo(onNextClick, onBackClick),
            2: pageThree(onNextClick, onBackClick),
            3: pageFour(onNextClick, onBackClick),
            4: pageFive(onNextClick, onBackClick),
            5: pageSix(onNextClick, onBackClick),
            6: pageSeven(onNextClick, onBackClick, shortFormDataSent),
            7: pageEight(onNextClick, applicant),
            8: pageNine(onNextClick, onBackClick, applicant),
            9: pageTen(onNextClick, onBackClick, applicant),
            10: pageEleven(onNextClick, onBackClick, applicant),
            11: pageTwelve(onNextClick, onBackClick, applicant),
            12: pageThirteen(onNextClick, onBackClick, applicant),
            13: pageFourteen(onNextClick, onBackClick, applicant),
            14: pageFifteen(onNextClick, onBackClick, applicant),
            15: pageSixteen(onNextClick, onBackClick, applicant),
            16: pageSeventeen(onNextClick, onBackClick, applicant),
            17: pageEighteen(onNextClick, onBackClick, applicant),
            18: pageNineteen(onNextClick, onBackClick, applicant),
            19: pageTwenty(onNextClick, onBackClick, applicant),
            20: pageTwentyOne(onNextClick, onBackClick, applicant),
            21: pageTwentyTwo(onNextClick, onBackClick, applicant),
            22: pageTwentyThree(onNextClick, onBackClick, applicant),
            23: pageTwentyFour(onNextClick, onBackClick, applicant),
            24: pageTwentyFive(onNextClick, onBackClick, applicant),
            25: pageTwentySix(onNextClick, onBackClick, applicant),
            26: pageTwentySeven(onNextClick, onBackClick, applicant),
        }[step]
    }

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


const pageOne = (onNextClick: PageProps["onNextClick"]) => {
    return <FirstPage onNextClick={onNextClick} />;
};

const pageTwo = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"]) => {
    return (
        <SecondPage onNextClick={onNextClick} onBackClick={onBackClick} />
    );
};

const pageThree = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"]) => {
    return (
        <ThirdPage onNextClick={onNextClick} onBackClick={onBackClick} />
    );
};

const pageFour = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"]) => {
    return (
        <FourthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    );
};

const pageFive = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"]) => {
    return (
        <FifthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    );
};

const pageSix = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"]) => {
    return (
        <SixthPage onNextClick={onNextClick} onBackClick={onBackClick} />
    );
};

const pageSeven = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], shortFormDataSent: PageProps["onBackClick"]) => {
    return (
        <SeventhPage onNextClick={shortFormDataSent} />
    );
};

const pageEight = (onNextClick: PageProps["onNextClick"], applicant: ApplicantEntity) => {
    return (
        <DriverApplication onNextClick={onNextClick} applicant={applicant} />
    );
};

const pageNine = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <HighestLevelEducation
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <BackgroundInfo
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageEleven = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <DrivingExp
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwelve = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <OtherQues
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageThirteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <PhotoUpload
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageFourteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <MedicalCardUpload
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageFifteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <EmergencyContact
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageSixteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <EmploymentHistory
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageSeventeen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <PastEmploymentHistory
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageEighteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <Preferences
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageNineteen = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <Halfway
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwenty = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <WorkedBefore
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentyOne = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <AccidentsLast5Years
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentyTwo = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <ViolationsLast3Years
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentyThree = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <PastSuspensions
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentyFour = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <UnableForJob
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentyFive = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <FelonyConviction
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentySix = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
    return (
        <DrugTest
            onNextClick={onNextClick}
            onBackClick={onBackClick}
            applicant={applicant}
        />
    );
};

const pageTwentySeven = (onNextClick: PageProps["onNextClick"], onBackClick: PageProps["onBackClick"], applicant: ApplicantEntity) => {
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

import React, { useEffect, useState } from "react";
import styles from "../../styles/jotform.module.css";
import { SplashPage } from "../../components/forms/jotform/shortForm/splash-page";
import { Names } from "../../components/forms/jotform/shortForm/names";
import { BasicInfo } from "../../components/forms/jotform/shortForm/basic-info";
import { CdlExperience } from "../../components/forms/jotform/shortForm/cdl-experience";
import { AccidentViolation } from "../../components/forms/jotform/shortForm/accident-violation";
import { HearAbout } from "../../components/forms/jotform/shortForm/hear-about";
import { ContinueLongForm } from "../../components/forms/jotform/shortForm/continue-longform";

import { DriverApplication } from "../../components/forms/jotform/longForm/driver-application";
import { BackgroundInfo } from "../../components/forms/jotform/longForm/background-info";
import { HighestLevelEducation } from "../../components/forms/jotform/longForm/highest-level-education";
import { DrivingExperience } from "../../components/forms/jotform/longForm/driving-experirence";
import { OtherQueues } from "../../components/forms/jotform/longForm/other-queues";
import { DriverLicense } from "../../components/forms/jotform/longForm/driver-license";
import { MedicalCard } from "../../components/forms/jotform/longForm/medical-card";
import { EmergencyContact } from "../../components/forms/jotform/longForm/emergency-contact";
import { EmploymentHistory } from "../../components/forms/jotform/longForm/employment-history";
import { ApplicantEntity } from "../../models/applicant/applicant.entity";
import { PastEmploymentHistory } from "../../components/forms/jotform/longForm/past-employment-history";
import { Preferences } from "../../components/forms/jotform/longForm/preference";
import { HalfWay } from "../../components/forms/jotform/longForm/half-way";
import { WorkedBefore } from "../../components/forms/jotform/longForm/worked-before";
import { AccidentHistory } from "../../components/forms/jotform/longForm/accident-history";
import { DrugTest } from "../../components/forms/jotform/longForm/drug-test";
import { FelonyConviction } from "../../components/forms/jotform/longForm/felony-conviction";
import { UnableForJob } from "../../components/forms/jotform/longForm/unable-for-job";
import { PastSuspension } from "../../components/forms/jotform/longForm/past-suspension";
import { ViolationHistory } from "../../components/forms/jotform/longForm/violaton-history";
import { AccordianPage } from "../../components/forms/jotform/longForm/accordian";
import "react-toastify/dist/ReactToastify.css";
import jotformContext from "../../context/jotform-context";
import { PageProps } from "../../types/jotform/page-props.type";
import { ApplicantExtrasEntity } from "../../models/applicant/applicant-extras.entity";

export default function jotFormLongForm() {
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

	const [steps, setSteps] = useState<number>(12);
	const stepNext = (): void => setSteps(steps + 1);
	const stepBack = (): void => setSteps(steps - 1);

	useEffect(() => {
		console.log("applicantextrasvalues", applicantExtras);
	}, []);

	const shortFormDataSent: PageProps["shortFormDataSent"] = async (
		params: any
	) => {
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
					stepNext,
					stepBack,
				},
			}}
		>
			<div className={styles.container}>
				<div className={styles.main}>
					<div className={styles.main_form} style={{ border: '1px solid red' }}>
						{getPageAccordingToStep(steps)}
					</div>
				</div>
				{/* <input style={{border: '2px solid',zIndex:'999', marginLeft: '100px', background: 'red' }} type="number" onChange={(e) => setSteps(parseInt(e.target.value))} /> */}
			</div>
		</jotformContext.Provider>
	);
}

const pageOne = () => {
	return <SplashPage />;
};

const pageTwo = () => {
	return <Names />;
};

const pageThree = () => {
	return <BasicInfo />;
};

const pageFour = () => {
	return <CdlExperience />;
};

const pageFive = () => {
	return <AccidentViolation />;
};

const pageSix = () => {
	return <HearAbout />;
};

const pageSeven = () => {
	return <ContinueLongForm />;
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
	return <DrivingExperience />;
};

const pageTwelve = () => {
	return <OtherQueues />;
};

const pageThirteen = () => {
	return <DriverLicense />;
};

const pageFourteen = () => {
	return <MedicalCard />;
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
	return <HalfWay />;
};

const pageTwenty = () => {
	return <WorkedBefore />;
};

const pageTwentyOne = () => {
	return <AccidentHistory />;
};

const pageTwentyTwo = () => {
	return <ViolationHistory />;
};

const pageTwentyThree = () => {
	return <PastSuspension />;
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
	return <AccordianPage />;
};

function t(arg0: string): import("react-toastify").ToastContent {
	throw new Error("Function not implemented.");
}

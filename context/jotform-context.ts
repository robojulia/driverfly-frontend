import { createContext } from "react";
import { ApplicantEmployerEntity } from "../models/applicant";
import { ApplicantExtrasEntity } from "../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";
import { JobEntity } from "../models/job/job.entity";

export type JotFormContextType = {
	state: {
		applicant?: ApplicantEntity;
		jobs?: JobEntity[];
		applicantExtras?: ApplicantExtrasEntity[];
		steps?: number;
	};
	method: {
		setApplicant?: (e?: any) => void;
		setJobs?: (e?: any) => void;
		updateApplicantExtras?: (e?: any) => void;
		setApplicantExtras?: (e?: any) => void;
		stepNext?: () => void;
		stepBack?: () => void;
	};
};

const JotformContext = createContext<JotFormContextType>({
	state: {
		applicant: null,
		applicantExtras: [],
		steps: 0,
	},
	method: {
		setApplicant: (e?: any) => { },
		setApplicantExtras: (e?: any) => { },
		updateApplicantExtras: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
	},
});
export default JotformContext;

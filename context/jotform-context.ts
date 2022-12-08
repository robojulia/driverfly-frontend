import { createContext } from "react";
import { ApplicantExtrasEntity } from "../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";

export type JotFormContextType = {
	state: {
		applicant: ApplicantEntity;
		applicantExtras: ApplicantExtrasEntity[];
		steps: number;
	};
	method: {
		setApplicant: (e?: any) => void;
		updateApplicantExtras: (e?: any) => void;
		stepNext: () => void;
		stepBack: () => void;
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
		updateApplicantExtras: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
	},
});
export default JotformContext;

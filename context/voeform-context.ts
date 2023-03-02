import { createContext } from "react";
import { ApplicantEmployerEntity, ApplicantEntity, ApplicantVoeFormEntity } from "../models/applicant";

export type VoeFormContextType = {
	state: {
		applicant: ApplicantEntity;
		employer: ApplicantEmployerEntity;
		applicantVoe: ApplicantVoeFormEntity[];
		steps: number;
	};
	method: {
		updateApplicantVoe: (e?: any) => void;
		stepNext: () => void;
		stepBack: () => void;
		jumpToStep: (step: number) => void;
	};
};

const VoeFormContext = createContext<VoeFormContextType>({
	state: {
		applicant: null,
		employer: null,
		applicantVoe: [],
		steps: 0,
	},
	method: {
		updateApplicantVoe: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
		jumpToStep: (step: number) => { },
	},
});
export default VoeFormContext;

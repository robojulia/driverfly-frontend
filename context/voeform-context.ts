import { createContext } from "react";
import { ApplicantEntity, ApplicantVoeFormEntity } from "../models/applicant";

type VoeFormContextType = {
	state: {
		applicant: ApplicantEntity;
		applicantVoe: ApplicantVoeFormEntity[];
		steps: number;
	};
	method: {
		updateApplicantVoe: (e?: any) => void;
		stepNext: () => void;
		stepBack: () => void;
	};
};

const VoeFormContext = createContext<VoeFormContextType>({
	state: {
		applicant: null,
		applicantVoe: [],
		steps: 0,
	},
	method: {
		updateApplicantVoe: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
	},
});
export default VoeFormContext;

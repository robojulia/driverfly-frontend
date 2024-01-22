import { createContext } from "react";
import { ApplicantEmployerEntity, ApplicantEntity, ApplicantVoeEntity } from "../models/applicant";

export type VoeFormContextType = {
	state: {
		applicant: ApplicantEntity;
		employer: ApplicantEmployerEntity;
		voe: ApplicantVoeEntity;
		steps: number;
	};
	method: {
		updateVoe: (e?: any) => void;
		stepNext: () => void;
		stepBack: () => void;
		jumpToStep: (step: number) => void;
	};
};

const VoeFormContext = createContext<VoeFormContextType>({
	state: {
		applicant: new ApplicantEntity(),
		employer: new ApplicantEmployerEntity(),
		voe: new ApplicantVoeEntity(),
		steps: 0,
	},
	method: {
		updateVoe: (e?: any) => { },
		stepNext: () => { },
		stepBack: () => { },
		jumpToStep: (step: number) => { },
	},
});
export default VoeFormContext;

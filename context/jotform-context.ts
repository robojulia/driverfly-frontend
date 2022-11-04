import { createContext } from "react";
import { ApplicantExtrasEntity } from "../models/applicant/applicant-extras.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";

type jotFormContextType = {
    state: {
        applicant: ApplicantEntity;
        applicantExtras: ApplicantExtrasEntity[];
        steps: number;
    };
    method: {
        setApplicant: (e?: any) => void;
        updateApplicantExtras: (e?: any) => void;
        setSteps: (e?: any) => void;
    };
};

const jotformContext = createContext<jotFormContextType>({
    state: {
        applicant: null,
        applicantExtras: [],
        steps: 0
    },
    method: {
        setApplicant: (e?: any) => { },
        updateApplicantExtras: (e?: any) => { },
        setSteps: (e?: any) => { },
    },
});
export default jotformContext;

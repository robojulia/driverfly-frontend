import { createContext } from "react";
import { ApplicantExtrasEntity } from "../models/applicant/applicant-extras.entity";
import { ApplicantVoeFormEntity } from "../models/applicant/applicant-voe-form.entity";
import { ApplicantEntity } from "../models/applicant/applicant.entity";

type jotFormContextType = {
  state: {
    applicant: ApplicantEntity;
    applicantExtras: ApplicantExtrasEntity[];
    applicantVoe: ApplicantVoeFormEntity[];
    steps: number;
  };
  method: {
    setApplicant: (e?: any) => void;
    updateApplicantExtras: (e?: any) => void;
    updateApplicantVoe: (e?: any) => void;
    setSteps: (e?: any) => void;
    stepNext: () => void;
    stepBack: () => void;
  };
};

const jotformContext = createContext<jotFormContextType>({
  state: {
    applicant: null,
    applicantExtras: [],
    applicantVoe: [],
    steps: 0,
  },
  method: {
    setApplicant: (e?: any) => {},
    updateApplicantExtras: (e?: any) => {},
    updateApplicantVoe: (e?: any) => {},
    setSteps: (e?: any) => {},
    stepNext: () => {},
    stepBack: () => {},
  },
});
export default jotformContext;

import { createContext } from "react";
import { ApplicantVoeFormEntity } from "../models/applicant/applicant-voe-form.entity";

type voeFormContextType = {
  state: {
    applicantVoe: ApplicantVoeFormEntity[];
    steps: number;
  };
  method: {
    updateApplicantVoe: (e?: any) => void;
    stepNext: () => void;
    stepBack: () => void;
  };
};

const jotformContext = createContext<voeFormContextType>({
  state: {
    applicantVoe: [],
    steps: 0,
  },
  method: {
    updateApplicantVoe: (e?: any) => {},
    stepNext: () => {},
    stepBack: () => {},
  },
});
export default jotformContext;

import { createContext } from "react";
import { ApplicantVoeFormEntity } from "../models/applicant/applicant-voe-form.entity";

type voeFormContextType = {
  state: {
    applicantVoe: ApplicantVoeFormEntity[];
    uuidVoeToken: any;
    steps: number;
  };
  method: {
    updateApplicantVoe: (e?: any) => void;
    updateUuidVoeToken: (e?: any) => void;
    stepNext: () => void;
    stepBack: () => void;
  };
};

const jotformContext = createContext<voeFormContextType>({
  state: {
    applicantVoe: [],
    uuidVoeToken: '',
    steps: 0,
  },
  method: {
    updateApplicantVoe: (e?: any) => {},
    updateUuidVoeToken: (e?: any) => {},
    stepNext: () => {},
    stepBack: () => {},
  },
});
export default jotformContext;

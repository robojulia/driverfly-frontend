import { createContext } from "react";
import { ApplicantEntity } from "../models/applicant/applicant.entity";

type jotFormContextType = {
  state: {
    applicant?: ApplicantEntity;
  };
  method: {
    setApplicant: (e?: any) => void;
  };
};

const jotformContext = createContext<jotFormContextType>({
  state: {
    applicant: null,
  },
  method: {
    setApplicant: (e?: any) => {},
  },
});
export default jotformContext;

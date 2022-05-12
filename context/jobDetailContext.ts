import { bool } from "prop-types";
import { createContext } from "react";

const jobDetailContext = createContext({
  state: {
    showApplyModal: bool,
  },
  method: {
    handleCloseApplyModal: () => { },
    handleShowApplyModal: () => { },
  },
})
export default jobDetailContext

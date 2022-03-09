import { createContext } from "react";

const jobContext = createContext({
  jobs: [],
  applyFilters: () => {}
})
export default jobContext

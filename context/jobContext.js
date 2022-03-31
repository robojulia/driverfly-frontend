import { createContext } from "react";

const jobContext = createContext({
  jobs: [],
  filters: {},
  applyFilters: () => {}
})
export default jobContext

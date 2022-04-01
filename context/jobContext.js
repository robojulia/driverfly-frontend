import { createContext } from "react";

const jobContext = createContext({
  state: {
    jobs: [],
    filters: {},
  },
  method: {
    handleChange: () => { },
    setFilters: () => { },
    applyFilters: () => { }
  },
})
export default jobContext

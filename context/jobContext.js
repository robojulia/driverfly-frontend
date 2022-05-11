import { createContext } from "react";

const jobContext = createContext({
  state: {
    jobs: [],
    pagingMeta: {},
    filters: {},
  },
  method: {
    handleChange: () => { },
    handlePaging: () => { },
    setFilters: () => { },
    applyFilters: () => { }
  },
})
export default jobContext

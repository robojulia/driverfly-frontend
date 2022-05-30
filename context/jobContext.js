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
    setFiltersByKeyValue: () => { },
    applyFilters: () => { }
  },
})
export default jobContext

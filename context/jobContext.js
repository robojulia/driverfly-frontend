import { number } from "prop-types";
import { createContext } from "react";

const jobContext = createContext({
  state: {
    jobs: [],
    pagingMeta: {},
    filters: {},
    location: {},
    range: number,
  },
  method: {
    handleChange: () => { },
    handlePaging: () => { },
    setFilters: () => { },
    setLocation: () => { },
    setrange: () => { },
    setFiltersByKeyValue: () => { },
    applyFilters: () => { }
  },
})
export default jobContext

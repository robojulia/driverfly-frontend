import { createContext } from "react";

const schoolContext = createContext({
  state: {
    schools: [],
    filters: {},
  },
  method: {
    setFilters: () => { },
    applyFilters: () => { }
  },
})
export default schoolContext

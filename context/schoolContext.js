import { createContext } from "react";

const schoolContext = createContext({
    state: {
        schools: [],
        filters: {},
    },
    method: {
        handleChange: () => { },
        setFilters: () => { },
        applyFilters: () => { }
    },
})
export default schoolContext

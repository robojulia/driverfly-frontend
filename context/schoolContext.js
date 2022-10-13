import { createContext } from "react";

const schoolContext = createContext({
    state: {
        schools: [],
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
export default schoolContext

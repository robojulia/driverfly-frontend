import { createContext } from "react";

type authContextType = {
    state: {
        jobs?: any[],
        pagingMeta: {},
        filters?: any,
        location?: any,
        range?: number,
        searchQuery?: string
    },
    method: {
        handleChange: (e?: any) => void,
        handlePaging: (e?: any) => void,
        setFilters: (e?: any) => void,
        setSearchQuery: (e?: any) => void,
        setLocation: (e?: any) => void,
        setRange: (e?: any) => void,
        setFiltersByKeyValue: (key?: any, value?: any) => void,
        applyFilters: () => void,
        handleReset: () => void,
    }
};

const jobContext = createContext<authContextType>({
    state: {
        jobs: [],
        pagingMeta: {},
        filters: {},
        location: {},
        range: null,
        searchQuery: '',
    },
    method: {
        handleChange: (e?: any) => { },
        handlePaging: (e?: any) => { },
        setFilters: (e?: any) => { },
        setSearchQuery: (e?: any) => { },
        setLocation: (e?: any) => { },
        setRange: (e?: any) => { },
        setFiltersByKeyValue: (key?: any, value?: any) => { },
        applyFilters: () => { },
        handleReset: () => { }
    },
})
export default jobContext

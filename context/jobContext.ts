import { createContext } from "react";

const jobContext = createContext<{
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
    setrange: (e?: any) => void,
    setFiltersByKeyValue: (key?: any, value?: any) => void,
    applyFilters: () => void,
    handleReset: () => void,
  }
}>({
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
    handlePaging: () => { },
    setFilters: (e?: any) => { },
    setSearchQuery: (e?: any) => { },
    setLocation: (e?: any) => { },
    setrange: () => { },
    setFiltersByKeyValue: (e?: any) => { },
    applyFilters: () => { },
    handleReset: () => { }
  },
})
export default jobContext

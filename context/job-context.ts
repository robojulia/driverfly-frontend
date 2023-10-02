import { createContext } from "react";
import { JobEntity } from "../models/job/job.entity";
import { JobSearchLocation, SearchJobsDto } from "../models/job/search-jobs-dto";
import { pagingMetaInitialValues } from "../utils/job-filter";
import { PagingMeta } from "../types/pagination.type";

type JobContextType = {
    state: {
        jobs?: JobEntity[],
        pagingMeta: PagingMeta,
        filters?: SearchJobsDto,
        location?: JobSearchLocation,
        range?: string,
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
        applyFilters: () => Promise<void>,
        handleReset: () => void,
    }
};

const JobContext = createContext<JobContextType>({
    state: {
        jobs: [],
        pagingMeta: pagingMetaInitialValues(),
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
        applyFilters: async () => { },
        handleReset: () => { }
    },
})
export default JobContext

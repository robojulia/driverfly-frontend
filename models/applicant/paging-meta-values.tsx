import { PagingMetaDto } from "../../types/pagination.type";

export const pagingsMetaInitialValues = (): PagingMetaDto => ({
    currentPage: 1,
    totalRecords: 0,
    recordsPerPage: 20,
})



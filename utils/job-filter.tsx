import { PagingMeta } from "../types/pagination.type"

export const pagingMetaInitialValues = (): PagingMeta => ({
    currentPage: 1,
    itemCount: 0,
    itemsPerPage: 0,
    totalItems: 0,
    totalPages: 1
})

export const filtersInitialsValues = () => ({
    location: null,
    page: 1
})




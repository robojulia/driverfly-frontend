export type PagingMetaProps = {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export const pagingMetaInitialValues = () => ({
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




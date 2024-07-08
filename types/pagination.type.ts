export type Pagination<T> = {
    items: T[],
    meta: PagingMeta,
}

export type PagingMeta = {
    currentPage: number;
    itemCount: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}


export type PagingMetaDto = {
    currentPage: number;
    totalRecords: number;
    recordsPerPage: number;
}
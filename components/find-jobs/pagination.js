import { useContext, useEffect, useState } from "react"
import jobContext from "../../context/job-context"
import { useTranslation } from "../../hooks/use-translation"


export default function Pagination() {

    const { state, method } = useContext(jobContext)
    const { pagingMeta, filters } = state
    const { setFilters, applyFilters } = method
    const { t } = useTranslation();

    const pagingValues = {
        current: parseInt(pagingMeta.currentPage),
        previous: parseInt(pagingMeta.currentPage) - 1,
        next: parseInt(pagingMeta.currentPage) + 1,
    }
    const [pageIndex, setPageIndex] = useState([])

    useEffect(() => { setPageIndex(pagingValues) }, [pagingMeta])

    const handlePaging = (page) => {
        setFilters({
            ...filters,
            page: parseInt(page)
        })
    }

    return (
        <>
            <div className="filter-outer mt-5">

                {
                    pagingMeta.totalPages !== 0 &&

                    <ul className="pagination ">
                        {
                            pageIndex.current > 2 &&
                            <>
                                <li onClick={() => { handlePaging(1) }}>
                                    <span className="next page-numbers " role="button" >
                                        {t('FIRST_PAGE')}
                                    </span>
                                </li>
                            </>
                        }

                        {
                            pageIndex.current > 1 &&
                            <li onClick={() => { handlePaging(pageIndex.previous) }} >
                                <span className="page-numbers " role="button" >
                                    {pageIndex.previous}
                                </span>
                            </li>
                        }

                        {
                            <li >
                                <span className="page-numbers current active" role="button" >
                                    {pageIndex.current}
                                </span>
                            </li>
                        }

                        {
                            pageIndex.current < pagingMeta.totalPages &&
                            <li onClick={() => { handlePaging(pageIndex.next) }} >
                                <span className="page-numbers " role="button" >
                                    {pageIndex.next}
                                </span>
                            </li>
                        }

                        {
                            pageIndex.current < pagingMeta.totalPages &&
                            <li onClick={() => { handlePaging(pagingMeta.totalPages) }}>
                                <span className="next page-numbers " role="button" >
                                    {t('LAST_PAGE')}
                                </span>
                            </li>
                        }
                    </ul>
                }
            </div>

        </>
    )
}


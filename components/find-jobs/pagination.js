import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { useTranslation } from "../../hooks/useTranslation"


export default function Pagination() {

    const { state, method } = useContext(jobContext)
    const { pagingMeta, filters } = state
    const { setFilters, applyFilters } = method
    const { t } = useTranslation();

    const currentPageIndex = parseInt(pagingMeta.currentPage)
    const previousPageIndex = currentPageIndex - 1
    const nextPageIndex = currentPageIndex + 1

    const handlePaging = async (page) => {
        await setFilters({
            ...filters,
            page: parseInt(page)
        }, applyFilters())
    }

    return (
        <>
            <div className="filter-outer mt-5">

                {
                    pagingMeta.totalPages !== 0 &&

                    <ul className="pagination ">
                        {
                            currentPageIndex > 1 &&
                            <>
                                <li onClick={() => { handlePaging(1) }}>
                                    <span className="next page-numbers " role="button" >
                                        {t('FIRST_PAGE')}
                                    </span>
                                </li>
                            </>
                        }

                        {
                            currentPageIndex > 1 &&
                            <li onClick={() => { handlePaging(previousPageIndex) }} >
                                <span className="page-numbers " role="button" >
                                    {previousPageIndex}
                                </span>
                            </li>
                        }

                        {
                            <li >
                                <span className="page-numbers current active" role="button" >
                                    {currentPageIndex}
                                </span>
                            </li>
                        }

                        {
                            currentPageIndex < pagingMeta.totalPages &&
                            <li onClick={() => { handlePaging(nextPageIndex) }} >
                                <span className="page-numbers " role="button" >
                                    {nextPageIndex}
                                </span>
                            </li>
                        }

                        {
                            currentPageIndex < pagingMeta.totalPages &&
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


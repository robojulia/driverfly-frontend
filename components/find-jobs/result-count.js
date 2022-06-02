import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { useTranslation } from "../../hooks/useTranslation"


export default function ResultCount() {

    const { state, method } = useContext(jobContext)
    const { pagingMeta } = state
    const { t } = useTranslation();

    return (
        <>
            <div className="results-count mt-4 ">
                {t('SHOWING')} {
                    pagingMeta.itemCount !== 0 &&
                    <>
                        <span className="first">
                            {((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + 1}
                        </span> – <span className="last">
                            {(((pagingMeta.currentPage - 1) * pagingMeta.itemsPerPage) + pagingMeta.itemCount)}
                        </span> {t('OF')}
                    </>
                } {pagingMeta.totalItems} {t('RESULT')}
            </div>
        </>
    )
}


import { useContext } from "react"
import JobContext from "../../context/job-context"
import { useTranslation } from "../../hooks/use-translation"


export default function ResultCount() {

    const { state } = useContext(JobContext)
    const { pagingMeta } = state
    const { t } = useTranslation();

    return (
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
    )
}


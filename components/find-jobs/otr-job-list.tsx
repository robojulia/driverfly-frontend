import Link from 'next/link'
import { useEffect, useState } from "react"
import timeSince from "../../utils/timeSince"
import { useTranslation } from "../../hooks/use-translation"
import CompanyPhoto from '../jobs/company-photo'
import { CurrencyDollar } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common'
import { JobGeography } from '../../enums/jobs/job-geography.enum'
import JobApi from '../../pages/api/job'
import { Pagination, PagingMeta } from '../../types/pagination.type'
import { JobEntity } from '../../models/job/job.entity'
import { useEffectAsync } from '../../utils/react'

export default function OtrJobsList() {

    const { t } = useTranslation();
    const jobApi = new JobApi();

    const [otrJobs, setOtrJobs] = useState([])
    const [pagingMeta, setPagingMeta] = useState<PagingMeta>({
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 1
    })

    const currentPageIndex = (pagingMeta.currentPage)
    const previousPageIndex = currentPageIndex - 1
    const nextPageIndex = currentPageIndex + 1

    const fetchOtrJobs = async (page = 1) => {
        await jobApi.search({ areas_covered: JobGeography.OTR, page })
            .then(({ items, meta }: Pagination<JobEntity>) => {
                setOtrJobs(items)
                setPagingMeta(meta)
            })
            .catch((e) => { console.error('exception is here: ', e.response) })
    }

    useEffectAsync(async () => await fetchOtrJobs(), [])

    return (
        <>
            <h4>{t('OTR_JOBS_FROM_US')}</h4>

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

            <div className="filter-outer mt-5">
                {otrJobs.length > 0 && otrJobs.map(job => (
                    <div key={job.id} className="media align-items-center shadow-sm">

                        <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
                        <div className="media-body">
                            <Link href={`/dashboard/driver/jobs/${job.id}`}>
                                <a className='text-decoration-none '>
                                    <h4 className="mt-0">
                                        {job.title}
                                    </h4>
                                </a>
                            </Link>
                            <div className="job-date-author">
                                {
                                    job.created_at &&
                                    <>
                                        {t('posted')} {timeSince(job.created_at)} {t('ago')}
                                    </>
                                } {
                                    job?.company?.name &&
                                    <>
                                        {t('by')} <span role="button" className="employer text-theme">{job.company?.name}</span>
                                    </>
                                }
                            </div>
                            <div className="job-metas text-secondary text-secondary">
                                <div className="job-location">
                                    {
                                        job.location &&
                                        <>
                                            <p>
                                                <span className='mr-4'>
                                                    {buildAddress(job.location || {}, { street: false, zip_code: false })}
                                                </span></p>
                                        </>
                                    }
                                    <p>
                                        < CurrencyDollar className='mr-1' />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t("per_week")} </p>
                                </div>
                                <div className="job-location">

                                    <strong className="text-secondary">{job.description_short}</strong>
                                </div>
                            </div>

                        </div>
                        <Link href={`/dashboard/driver/jobs/${job.id}`}>
                            <button type="button" className="theme-primary-btn-outline">{t('view_job')}</button>
                        </Link>

                    </div>
                ))}

                <div className="filter-outer mt-5">

                    {
                        pagingMeta.totalPages !== 0 &&

                        <ul className="pagination ">
                            {
                                currentPageIndex > 1 &&
                                <>
                                    <li onClick={() => { fetchOtrJobs(1) }}>
                                        <span className="next page-numbers " role="button" >
                                            {t('FIRST_PAGE')}
                                        </span>
                                    </li>
                                </>
                            }

                            {
                                currentPageIndex > 1 &&
                                <li onClick={() => { fetchOtrJobs(previousPageIndex) }} >
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
                                <li onClick={() => { fetchOtrJobs(nextPageIndex) }} >
                                    <span className="page-numbers " role="button" >
                                        {nextPageIndex}
                                    </span>
                                </li>
                            }

                            {
                                currentPageIndex < pagingMeta.totalPages &&
                                <li onClick={() => { fetchOtrJobs(pagingMeta.totalPages) }}>
                                    <span className="next page-numbers " role="button" >
                                        {t('LAST_PAGE')}
                                    </span>
                                </li>
                            }
                        </ul>
                    }
                </div>
            </div>

        </>
    )
}


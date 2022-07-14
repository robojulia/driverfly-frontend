import Link from 'next/link'
import { useEffect, useState } from "react"
import timeSince from "../../utils/timeSince"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from '../jobs/company-photo'
import { GeoAltFill, CurrencyDollar } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common'
import { JobGeography } from '../../enums/jobs/job-geography.enum'
import JobApi from '../../pages/api/job'


export default function OtrJobsList() {

    const { t } = useTranslation();
    const jobApi = new JobApi();

    const [otrJobs, setOtrJobs] = useState([])
    const [otrPagingMeta, setOtrPagingMeta] = useState({
        currentPage: 1,
        itemCount: 0,
        itemsPerPage: 0,
        totalItems: 0,
        totalPages: 1
    })

    const currentPageIndex = parseInt(otrPagingMeta.currentPage)
    const previousPageIndex = currentPageIndex - 1
    const nextPageIndex = currentPageIndex + 1

    const fetchOtrJobs = async (page = 1) => {
        await jobApi.search({ areas_covered: JobGeography.OTR, page: parseInt(page) })
            .then(({ items, meta }) => {
                setOtrJobs(items)
                setOtrPagingMeta(meta)
            })
            .catch((e) => { console.error('exception is here: ', e.response) })
    }

    useEffect(async () => { await fetchOtrJobs() }, [])

    return (
        <>
            <h4>{t('OTR_JOBS_FROM_US')}</h4>

            <div className="results-count mt-4 ">
                {t('SHOWING')} {
                    otrPagingMeta.itemCount !== 0 &&
                    <>
                        <span className="first">
                            {((otrPagingMeta.currentPage - 1) * otrPagingMeta.itemsPerPage) + 1}
                        </span> – <span className="last">
                            {(((otrPagingMeta.currentPage - 1) * otrPagingMeta.itemsPerPage) + otrPagingMeta.itemCount)}
                        </span> {t('OF')}
                    </>
                } {otrPagingMeta.totalItems} {t('RESULT')}
            </div>

            <div className="filter-outer mt-5">
                {otrJobs.length > 0 && otrJobs.map(job => (
                    <div key={job.id} className="media align-items-center shadow-sm">

                        <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
                        <div className="media-body">
                            <Link href={`/dashboard/driver/find-jobs/${job.id}`}>
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
                                                {/* < GeoAltFill className='mr-1' /> */}
                                                <span className='mr-4'>
                                                    {buildAddress(job.location || {},{ street: false, zip_code: false})}
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
                        <Link href={`/dashboard/driver/find-jobs/${job.id}`}>
                            <button type="button" className="theme-primary-btn-outline">{t('view_job')}</button>
                        </Link>

                    </div>
                ))}

                <div className="filter-outer mt-5">

                    {
                        otrPagingMeta.totalPages !== 0 &&

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
                                currentPageIndex < otrPagingMeta.totalPages &&
                                <li onClick={() => { fetchOtrJobs(nextPageIndex) }} >
                                    <span className="page-numbers " role="button" >
                                        {nextPageIndex}
                                    </span>
                                </li>
                            }

                            {
                                currentPageIndex < otrPagingMeta.totalPages &&
                                <li onClick={() => { fetchOtrJobs(otrPagingMeta.totalPages) }}>
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


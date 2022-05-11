import Link from 'next/link'
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import timeSince from "../../utils/timeSince"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from '../jobs/company-photo'
import { GeoAltFill, CurrencyDollar } from 'react-bootstrap-icons';


export default function JobsList() {

  const { state, method } = useContext(jobContext)
  const { jobs, pagingMeta, filters } = state
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
        {jobs.length > 0 && jobs.map(job => (
          <div key={job.id} className="media align-items-center shadow-sm">
           
            <CompanyPhoto className="d-flex mr-4 truck-img" company={job.company} />
            <div className="media-body">
              <h4 className="mt-0">{job.title}
                <span
                  className=""
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Tooltip on top">
                 
                </span>
              </h4>
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
                     < GeoAltFill className='mr-1' />
                        <span className='mr-4'>
                          <>
                            {job.location.street || t('no_street')}, {job.location.city || t('no_city')}, {job.location.state || t('no_state')}, {job.location.zip_code || t('no_zip')}
                          </>
                        </span></p>
                    </>
                  }
                  <p>
                   < CurrencyDollar className='mr-1' />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} per week </p>
                </div>
                <div className="job-location">
                
                  <strong className="text-secondary">{job.description_short}</strong>
                </div>
              </div>

            </div>
            <Link href={`/jobs/${job.id}`}>
              <button type="button" className="btn btn-outline-danger">{t('browse_job')}</button>
            </Link>

          </div>
        ))}

        {
          pagingMeta.totalPages !== 0 &&

          <ul className="pagination ">
            {
              currentPageIndex > 1 &&
              <>
                <li onClick={() => { handlePaging(1) }}>
                  <span className="next page-numbers " role="button" >
                    First
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
                <span className="page-numbers " role="button" value={parseInt(pagingMeta.page) + 1}>
                  {nextPageIndex}
                </span>
              </li>
            }

            {
              nextPageIndex < pagingMeta.totalPages &&
              <li onClick={() => { handlePaging(pagingMeta.totalPages) }}>
                <span className="next page-numbers " role="button" >
                  Last
                </span>
              </li>
            }
          </ul>
        }
      </div>

    </>
  )
}


import Link from 'next/link'
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import timeSince from "../../utils/timeSince"
import { useTranslation } from "../../hooks/useTranslation"
import CompanyPhoto from '../jobs/company-photo'
import { GeoAltFill, CurrencyDollar } from 'react-bootstrap-icons';
import { buildAddress } from '../../utils/common'
import Pagination from '../find-jobs/pagination'


export default function JobsList() {

  const { state, method } = useContext(jobContext)
  const { jobs } = state
  const { t } = useTranslation();

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
                          {buildAddress(job.location || {})}
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
            <Link href={`/jobs/${job.id}`}>
              <button type="button" className="btn btn-outline-danger">{t('browse_job')}</button>
            </Link>

          </div>
        ))}

        <Pagination />

        <div className="jumbotron mt-4">
          <p className="lead">
            {t('CANT_FIND_WHAT_YOU_WANT')}
          </p>
        </div>
      </div>

    </>
  )
}


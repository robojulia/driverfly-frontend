import Link from 'next/link';
import React from 'react'
import { StarFill, GeoAlt, CalendarDate, CurrencyDollar } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { buildAddress } from '../../utils/common';
import timeSince from '../../utils/timeSince';
export default function CompanyJob({ jobs }) {

  const { t } = useTranslation();


  return (
    <div>
      {
        jobs &&
        jobs.slice(0, 2).map((job, index) => (
          <div key={index} className="media mt-2 shadow-sm">
            <Link href={`/jobs/${job.id}/${job.slug}`}>
              <div className="media-body" role='button'>
                <h4 className="mt-0 text-dark">
                  {job.title}
                </h4>
                <div className="job-metas">
                  <div className="job-location">
                    <span className='text-muted align-middle'>
                      {
                        job.location &&
                        <>
                          {buildAddress(job.location, { street: false, zip_code: false })}
                        </>
                      }
                    </span>
                    <span className='text-muted ml-5 align-middle'>
                      <CalendarDate color="#C5C5C5" className='mr-2' />
                      {
                        job.created_at &&
                        <>
                          {t('posted')} {timeSince(job.created_at)} {t('ago')}
                        </>
                      }
                    </span>
                    <span className='text-muted d-block'>
                      <p>< CurrencyDollar className="mr-1" />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      }
    </div>
  )
}



import React from 'react'
import { StarFill, GeoAlt, CalendarDate, Cash, Star, GeoAltFill } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/useTranslation';
import { buildAddress } from '../../utils/common';
import timeSince from '../../utils/timeSince';
export default function CompanyJob({ jobs }) {

  const { t } = useTranslation();


  return (
    <div>
      {
        jobs &&
        jobs.slice(0, 2).map((job, index) => (
          <div key={index} className="media  shadow-sm">
            <div className="media-body">
              {/* <span className="urgent">URGENT</span> */}
              {/* <h6>FUll Time(W2)</h6> */}
              <h4 className="mt-0 text-dark">{job.title}  <StarFill color='#febe42' /><span className="d-block" data-toggle="tooltip"
                data-placement="top" title="Tooltip on top"> <i className="fa fa-star" aria-hidden="true"></i> </span></h4>
              <div className="job-metas">
                <div className="job-location">
                  <span className='text-muted align-middle'>
                    <GeoAlt color="#C5C5C5" className='mr-2' />
                    {
                      job.location &&
                      <p className="pr-4">
                        <GeoAltFill className="mr-1" />
                        {buildAddress(job.location)}
                      </p>
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

                    {/* <Cash color="#C5C5C5" className='mr-2' /> */}
                  </span>
                </div>
                <div className='position-absolute top-50 end-0 translate-middle'>
                  <div className='p-2 rounded-circle' style={{ border: '1px solid #2da2af' }} >
                    <Star color='#2da2af' size={50} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))
      }
    </div>
  )
}



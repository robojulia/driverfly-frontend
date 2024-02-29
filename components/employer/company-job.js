import Link from 'next/link';
import React from 'react'
import { StarFill, GeoAlt, CalendarDate, CurrencyDollar } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { buildAddress } from '../../utils/common';
import timeSince from '../../utils/timeSince';
import { useRouter } from 'next/router';
import CompanyPhoto from '../jobs/company-photo';
export default function CompanyJob({ jobs }) {

  const { t } = useTranslation();
  const router = useRouter();

  const USdateFormatter = (date) =>{
    const formattedDate = new Date(date);
    return (formattedDate.getMonth() + 1 + '/' + formattedDate.getDate() + '/' + formattedDate.getFullYear());
  }

  return (
    <div>
      {
        jobs ?
          jobs?.slice(0, 3)?.map((job, index) => (
            <div key={index} className="media mt-2 shadow-sm">
              <div className="col-md-3  col-lg-3 col-sm-3 text-center  bg-white rounded">
                <CompanyPhoto
                  className="img-fluid rounded-start"
                  company={job?.company}
                />
              </div>
              <div className="media-body" role='button'>
                <h3 className="mt-0" style={{ color: "#212529", fontWeight: "600", fontSize: '23px' }}>
                  {job.title}
                </h3>
                <div className="job-metas">
                  <div className="job-location">
                    <p className='pr-4 text-justify'>
                      {job?.description.slice(0,170)}
                    </p>
                    {/* <span className='text-muted align-middle'>
                      {
                        job.location &&
                        <>
                          {buildAddress(job.location, { street: false, zip_code: false })}
                        </>
                      }
                    </span> */}
                    <span className='d-flex align-items-center'>
                      <CalendarDate color="#979797" className='mr-2' />
                      {
                        job.created_at &&
                        <span style={{ color: "#979797" }}>
                          {t('DATE_POSTED')} {USdateFormatter(job.created_at.split("T")[0].split("-").join("/"))}
                        </span>
                      }
                    </span>
                    {/* <span className='text-muted d-block'>
                      <p>< CurrencyDollar className="mr-1" />{job.min_weekly_pay ? job.min_weekly_pay : 0} - {job.max_weekly_pay ? job.max_weekly_pay : 0} {t('per week')}</p>
                    </span> */}
                  </div>
                </div>
              </div>
              <button type="button" className="apply_job_btn" onClick={() => router.push(`/jobs/${job.id}/${job.slug}`)}>
                {t("view_job")}
              </button>
            </div>
          )) : <div className='d-flex justify-content-center'>
            <h5 className='text-secondary'>{t("NO_JOBS_FOUND")}</h5>
          </div>
      }
    </div>
  )
}



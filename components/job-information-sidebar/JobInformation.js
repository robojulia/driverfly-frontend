import { useTranslation } from "../../hooks/useTranslation";
import { JobGeography } from "../../enums/jobs/job-geography.enum"
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { JobSchedule } from "../../enums/jobs/job-schedule.enum";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { MvrType } from "../../enums/users/mvr-type.enum";
import timeSince from "../../utils/timeSince";
import ShowEnumFromString from "../../components/enum-filters/show-enum-from-string"
import { useContext } from "react"
import jobDetailContext from "../../context/jobDetailContext";
import { ArrowRight, CurrencyDollar, GeoAltFill,FileEarmarkZip, Facebook } from 'react-bootstrap-icons';

export default function JonInformation({ job }) {

  const { t } = useTranslation();
  const { state, method } = useContext(jobDetailContext)
  const { handleShowApplyModal } = method

  return (
    <>
      <div className="sidebar">
        <h3>{t('job_information')}</h3>
        <div className="sidebar-inner">
          <ul className="list">
            <li>
              <div className="icon">
                < CurrencyDollar />
              </div>
              <div className="details">
                <div className="text">{t('offered_salary')}</div>
                <div className="value"><CurrencyDollar /><span className="price-text">{job.min_weekly_pay}</span> - <CurrencyDollar /><span className="price-text">{job.max_weekly_pay}</span> {t('per_week')}</div>
              </div>
            </li>
            <li>
              <div className="icon">
                < GeoAltFill />
              </div>
              <div className="details">
                <div className="text">{t('areas_covered')}</div>
                <div className="value">
                  <ShowEnumFromString str={job.geography} enumArray={JobGeography} />
                </div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('employment_type')}</div>
                <div className="value">
                  <ShowEnumFromString str={job.employment_type} enumArray={JobEmploymentType} />
                </div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('delivery_type')}</div>
                <ShowEnumFromString str={job.delivery_type} enumArray={JobDeliveryType} />
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('equipment_type')}</div>
                <ShowEnumFromString str={job.equipment_type} enumArray={JobEquipmentType} />
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-solid fa-clock" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">{t('schedule')}</div>
                <ShowEnumFromString str={job.schedule} enumArray={JobSchedule} />
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('pay_method')}</div>
                <ShowEnumFromString str={job.pay_method} enumArray={JobPayMethod} />
              </div>
            </li>

            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('mvr_requirements')}</div>
                <ul>
                  {job.mvr_requirements &&
                    job.mvr_requirements.map((item, index) => {
                      return <li key={index}>
                        <div className="row">
                          <div className="col-md-12">
                            {t(MvrType[item.type].toLowerCase())}
                          </div>
                          <div className="col-md-6">
                            {`${t("max_count")} ${item.max_count} `}
                          </div>
                          <div className="col-md-6">
                            {`${t("max")} ${t("years")} ${item.max_years} `}
                          </div>
                        </div>
                      </li>
                    })
                  }
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="job-detail-statistic">
          <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              < FileEarmarkZip />
            </div>
            <span className="text"><span className="number">{timeSince(job.created_at)}</span> {t('ago')}</span>
          </div>

        </div>
        <button type="button" className="btn btn-danger" onClick={handleShowApplyModal}>
          {t('apply_now')}
          <ArrowRight />
        </button>
        <div className="socials-apply clearfix">
          <div className="title">{t('apply_with')}</div>
          <div className="inner">
            <div className="facebook-apply-btn-wrapper">
              <a className="facebook-apply-btn" href="#" data-job_id="5363"><Facebook /> Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import { useTranslation } from "react-i18next";
import { JobGeography } from "../../enums/jobs/job-geography.enum"
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { JobSchedule } from "../../enums/jobs/job-schedule.enum";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { MvrType } from "../../enums/drivers/mvr-type.enum";
import timeSince from "../../utils/timeSince";

export default function JonInformation({ job }) {

  const { t } = useTranslation();

  const enumMap = (str, separator, EnumType) => {
    if (!str) {
      return
    }
    str = `${str}`
    const arr = str.split(separator)
    return arr.map(item => {
      return t(EnumType[item].toLowerCase())
    }).join(', ')
  }

  return (
    <>
      <div className="sidebar">
        <h3>Job Information</h3>
        <div className="sidebar-inner">
          <ul className="list">
            <li>
              <div className="icon">
                <i className="fa fa-usd" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Offered Salary</div>
                <div className="value">$<span className="price-text">{job.min_weekly_pay}</span> - $<span className="price-text">{job.max_weekly_pay}</span> per week</div>
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-map-marker" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Areas Covered</div>
                <div className="value">
                  {job.geography && enumMap(job.geography, ",", JobGeography)}
                </div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Employment Type</div>
                <div className="value">
                  {job.employment_type && enumMap(job.employment_type, ",", JobEmploymentType)}
                </div>
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Type of Delivery</div>
                {job.delivery_type && enumMap(job.delivery_type, ",", JobDeliveryType)}
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Equipment Type</div>
                {job.equipment_type && enumMap(job.equipment_type, ",", JobEquipmentType)}
              </div>
            </li>
            <li>
              <div className="icon">
                <i className="fa fa-solid fa-clock" aria-hidden="true"></i>
              </div>
              <div className="details">
                <div className="text">Schedule</div>
                {job.schedule && enumMap(job.schedule, ",", JobSchedule)}
              </div>
            </li>
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">Pay Method</div>
                {job.pay_method && enumMap(job.pay_method, ",", JobPayMethod)}
              </div>
            </li>

            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">MVR Requirements</div>
                <ul>
                  {job.mvr_requirements &&
                    job.mvr_requirements.map(item => {
                      return <li>
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
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">{timeSince(job.created_at)}</span> ago</span>
          </div>

          {/* <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">143</span> Views</span>
          </div> */}

          {/* <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              <i className="fa fa-file-archive-o" aria-hidden="true"></i>
            </div>
            <span className="text"><span className="number">2</span> Applicants</span>
          </div> */}
        </div>
        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal"> Apply Now <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
        <div className="socials-apply clearfix">
          <div className="title">OR apply with</div>
          <div className="inner">
            <div className="facebook-apply-btn-wrapper">
              <a className="facebook-apply-btn" href="#" data-job_id="5363"><i className="fa fa-facebook"></i> Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
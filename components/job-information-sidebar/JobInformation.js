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
import { ArrowRight, CurrencyDollar, GeoAltFill, FileEarmarkZip, Facebook } from 'react-bootstrap-icons';
import { JobPayFrequency } from "../../enums/jobs/job-pay-frequency.enum";
import { JobTeamDriver } from "../../enums/jobs/job-team-driver.enum";
import { JobBenefits } from "../../enums/jobs/job-benefits.enum";
import { DriverLicenseType } from "../../enums/users/driver-license-type.enum";
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum";
import { VehicleTransmissionType } from "../../enums/vehicles/vehicle-transmission-type.enum";

export default function JonInformation({ job }) {

  const { t } = useTranslation();
  const { state, method } = useContext(jobDetailContext)
  const { handleShowApplyModal } = method

  return (
    <>
      <div className="sidebar">
        <h3>{t('job_information')}</h3>

        <div className="job-detail-statistic">
          <div className="statistic-item flex-middle">
            <div className="icon text-theme">
              < FileEarmarkZip />
            </div>
            <span className="text"><span className="number">{timeSince(job.created_at)}</span> {t('ago')}</span>
          </div>
        </div>

        <div className="sidebar-inner">
          <ul className="list">

            {/* OFFERED_SALARY START */}
            <li>
              <div className="icon">
                < CurrencyDollar />
              </div>
              <div className="details">
                <div className="text">{t('OFFERED_SALARY')}</div>
                <div className="value"><CurrencyDollar /><span className="price-text">{job.min_weekly_pay}</span> - <CurrencyDollar /><span className="price-text">{job.max_weekly_pay}</span> {t('per_week')}</div>
              </div>
            </li>

            {/* AREAS_COVERED START */}
            <li>
              <div className="icon">
                < GeoAltFill />
              </div>
              <div className="details">
                <div className="text">{t('AREAS_COVERED')}</div>
                <div className="value">
                  <ShowEnumFromString labelPrefix='JobGeography' str={job.geography} enumArray={JobGeography} />
                </div>
              </div>
            </li>

            {/* EMPLOYMENT_TYPE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('EMPLOYMENT_TYPE')}</div>
                <div className="value">
                  <ShowEnumFromString labelPrefix="JobEmploymentType" str={job.employment_type} enumArray={JobEmploymentType} />
                </div>
              </div>
            </li>

            {/* PAY_FREQUENCY START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('PAY_FREQUENCY')}</div>
                <div className="value">
                  <ShowEnumFromString labelPrefix="JobPayFrequency" str={job.pay_frequency} enumArray={JobPayFrequency} />
                </div>
              </div>
            </li>

            {/* DELIVERY_TYPE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('DELIVERY_TYPE')}</div>
                <ShowEnumFromString labelPrefix="JobDeliveryType" str={job.delivery_type} enumArray={JobDeliveryType} />
              </div>
            </li>

            {/* EQUIPMENT_TYPE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('EQUIPMENT_TYPE')}</div>
                <ShowEnumFromString labelPrefix="JobEquipmentType" str={job.equipment_type} enumArray={JobEquipmentType} />
              </div>
            </li>

            {/* SCHEDULE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('SCHEDULE')}</div>
                <ShowEnumFromString labelPrefix="JobSchedule" str={job.schedule} enumArray={JobSchedule} />
              </div>
            </li>

            {/* TEAM_DRIVERS START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('TEAM_DRIVERS')}</div>
                <ShowEnumFromString labelPrefix="JobTeamDriver" str={job.team_drivers} enumArray={JobTeamDriver} />
              </div>
            </li>

            {/* PAY_METHOD START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('PAY_METHOD')}</div>
                <ShowEnumFromString labelPrefix="JobPayMethod" str={job.pay_method} enumArray={JobPayMethod} />
              </div>
            </li>

            {/* cdl_class START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('cdl_class')}</div>
                <ShowEnumFromString labelPrefix="DriverLicenseType" str={job.cdl_class} enumArray={DriverLicenseType} />
              </div>
            </li>

            {/* TRANSMISSION_TYPE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('TRANSMISSION_TYPE')}</div>
                <ShowEnumFromString labelPrefix="VehicleTransmissionType" str={job.transmission_type_experience} enumArray={VehicleTransmissionType} />
              </div>
            </li>

            {/* ENDORSEMENTS START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('ENDORSEMENTS')}</div>
                <ShowEnumFromString labelPrefix="DriverEndorsement" str={job.required_endorsement} enumArray={DriverEndorsement} />
              </div>
            </li>

            {/* MIN_YEARS_EXPERIENCE START */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('MIN_YEARS_EXPERIENCE')}</div>
                <span>{job.min_years_experience}</span>
              </div>
            </li>


            {/* MVR_REQUIREMENTS */}
            <li>
              <div className="icon">
              </div>
              <div className="details">
                <div className="text">{t('MVR_REQUIREMENTS')}</div>
                <ul>
                  {job.mvr_requirements &&
                    job.mvr_requirements.map((item, index) => {
                      return <li key={index}>
                        <div className="row">
                          <div className="col-md-12">
                            {t(MvrType[item.type].toLowerCase())}
                          </div>
                          <div className="col-md-6">
                            {`${t('{val1}_{val2}', { val1: 'MAX', val2: 'COUNT' }, { translateProps: true })} ${item.max_count} `}
                          </div>
                          <div className="col-md-6">
                            {`${t('{val1}_{val2}', { val1: 'MAX', val2: 'YEARS' }, { translateProps: true })} ${item.max_years} `}
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


        {/* <div className="socials-apply clearfix">
          <div className="title">{t('apply_with')}</div>
          <div className="inner">
            <div className="facebook-apply-btn-wrapper">
              <a className="facebook-apply-btn" href="#" data-job_id="5363"><Facebook /> {t('FACEBOOK')}</a>
            </div>
          </div>
        </div> */}

      </div>
    </>
  )
}
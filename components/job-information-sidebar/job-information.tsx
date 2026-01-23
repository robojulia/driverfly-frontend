import { useContext } from "react";
import { BlockquoteLeft, CalendarRange, CashCoin, ClockFill, CollectionFill, CurrencyDollar, ExplicitFill, GearFill, GearWideConnected, GeoAltFill, Joystick, PersonBadgeFill, PersonWorkspace, Truck, Wallet2 } from 'react-bootstrap-icons';
import jobDetailContext from "../../context/job-detail-context";
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum";
import { MvrType } from "../../enums/users/mvr-type.enum";
import { useTranslation } from "../../hooks/use-translation";
import { JobDetailProps } from "../../types/job/job-detail-props.type";
import ShowEnumFromString from "../enum-filters/show-enum-from-string";
import ShowFormattedDate from "../jobs/show-formatted-date";

export default function JonInformation({ job }: JobDetailProps) {

    const { t } = useTranslation();
    const { method } = useContext(jobDetailContext)
    const { handleShowApplyModal } = method

    return (
        <>
            <div className="sidebar p-4  m-1 mb-5 shadow-lg single-job-items rounded">
                <h3 className="border-bottom py-2">{t('job_information')}</h3>
                <div className="sidebar-inner pt-1">
                    <ul className="list p-0">
                        {/* DATE POSTED START */}
                        <li>
                            <div className="icon">
                                < CalendarRange />
                            </div>
                            <div className="details">
                                <div className="text">{t('POSTED')}</div>
                                <div className="value text-muted">
                                    <ShowFormattedDate date={job.created_at} />
                                </div>
                            </div>
                        </li>
                        
                         <li>
                            <div className="icon">
                                < CalendarRange />
                            </div>
                            <div className="details">
                                <div className="text">{t('EXPIRATION')}</div>
                                <div className="value text-muted">
                                    <ShowFormattedDate date={job.expiry_date} />
                                </div>
                            </div>
                        </li>

                        {/* OFFERED_SALARY START */}
                        <li>
                            <div className="icon">
                                < CurrencyDollar />
                            </div>
                            <div className="details">
                                <div className="text">{t('OFFERED_SALARY')}</div>
                                <div className="value text-muted"><CurrencyDollar /><span className="price-text">{job.min_weekly_pay || 0}</span> - <CurrencyDollar /><span className="price-text">{job.max_weekly_pay || 0}</span> {t('per_week')}</div>
                            </div>
                        </li>

                        {/* AREAS_COVERED START */}
                        <li>
                            <div className="icon">
                                < GeoAltFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('AREAS_COVERED')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix='JobGeography' value={job.geography} />
                                </div>
                            </div>
                        </li>

                        {/* EMPLOYMENT_TYPE START */}
                        <li>
                            <div className="icon">
                                <PersonWorkspace />
                            </div>
                            <div className="details">
                                <div className="text">{t('EMPLOYMENT_TYPE')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobEmploymentType" value={job.employment_type} />
                                </div>
                            </div>
                        </li>

                        {/* PAY_FREQUENCY START */}
                        <li>
                            <div className="icon">
                                <Wallet2 />
                            </div>
                            <div className="details">
                                <div className="text">{t('PAY_FREQUENCY')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobPayFrequency" value={job.pay_frequency} />
                                </div>
                            </div>
                        </li>

                        {/* DELIVERY_TYPE START */}
                        <li>
                            <div className="icon">
                                <Truck />
                            </div>
                            <div className="details">
                                <div className="text">{t('DELIVERY_TYPE')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobDeliveryType" value={job.delivery_type} />
                                </div>
                            </div>
                        </li>

                        {/* EQUIPMENT_TYPE START */}
                        <li>
                            <div className="icon">
                                <GearFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('EQUIPMENT_TYPE')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobEquipmentType" value={job.equipment_type} />
                                </div>
                            </div>
                        </li>

                        {/* SCHEDULE START */}
                        <li>
                            <div className="icon">
                                <ClockFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('SCHEDULE')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobSchedule" value={job.schedule} />
                                </div>
                            </div>
                        </li>

                        {/* TEAM_DRIVERS START */}
                        <li>
                            <div className="icon">
                                <PersonBadgeFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('TEAM_DRIVERS')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobTeamDriver" value={job.team_drivers} />
                                </div>
                            </div>
                        </li>

                        {/* PAY_METHOD START */}
                        <li>
                            <div className="icon">
                                <CashCoin />
                            </div>
                            <div className="details">
                                <div className="text">{t('PAY_METHOD')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="JobPayMethod" value={job.pay_method} />
                                </div>
                                {/* Pay method specific details */}
                                {job.pay_method === JobPayMethod.RATE_PER_MILE && (job.min_rate || job.max_rate) && (
                                    <div className="value text-muted mt-1">
                                        <small>
                                            <CurrencyDollar />{job.min_rate || 0} - <CurrencyDollar />{job.max_rate || 0} {t('per_mile')}
                                            {(job.min_miles || job.max_miles) && (
                                                <span> ({job.min_miles || 0} - {job.max_miles || 0} {t('miles_per_week')})</span>
                                            )}
                                        </small>
                                    </div>
                                )}
                                {job.pay_method === JobPayMethod.HOURLY && (job.min_rate || job.max_rate) && (
                                    <div className="value text-muted mt-1">
                                        <small>
                                            <CurrencyDollar />{job.min_rate || 0} - <CurrencyDollar />{job.max_rate || 0} {t('per_hour')}
                                            {(job.min_hours || job.max_hours) && (
                                                <span> ({job.min_hours || 0} - {job.max_hours || 0} {t('hours_per_week')})</span>
                                            )}
                                        </small>
                                    </div>
                                )}
                                {job.pay_method === JobPayMethod.SALARY && (job.min_salary || job.max_salary) && (
                                    <div className="value text-muted mt-1">
                                        <small>
                                            <CurrencyDollar />{(job.min_salary || 0).toLocaleString()} - <CurrencyDollar />{(job.max_salary || 0).toLocaleString()} {t('per_year')}
                                        </small>
                                    </div>
                                )}
                                {(job.pay_method === JobPayMethod.PERCENT_PER_MOVE || job.pay_method === JobPayMethod.PERCENT_PER_WEIGHT) && (job.min_percent || job.max_percent) && (
                                    <div className="value text-muted mt-1">
                                        <small>
                                            {job.min_percent || 0}% - {job.max_percent || 0}%
                                        </small>
                                    </div>
                                )}
                            </div>
                        </li>

                        {/* cdl_class START */}
                        <li>
                            <div className="icon">
                                <BlockquoteLeft />
                            </div>
                            <div className="details">
                                <div className="text">{t('MINIMUM_CDL_CLASS')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="DriverLicenseType" value={job.cdl_class} />
                                </div>
                            </div>
                        </li>

                        {/* TRANSMISSION_TYPE START */}
                        <li>
                            <div className="icon">
                                <Joystick />
                            </div>
                            <div className="details">
                                <div className="text">{t('TRANSMISSION_TYPE')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="VehicleTransmissionType" value={job.transmission_type_experience} />
                                </div>
                            </div>
                        </li>

                        {/* ENDORSEMENTS START */}
                        <li>
                            <div className="icon">
                                <CollectionFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('ENDORSEMENTS')}</div>
                                <div className="value text-muted">
                                    <ShowEnumFromString labelPrefix="DriverEndorsement" value={job.required_endorsement} />
                                </div>
                            </div>
                        </li>

                        {/* MIN_YEARS_EXPERIENCE START */}
                        <li>
                            <div className="icon">
                                <ExplicitFill />
                            </div>
                            <div className="details">
                                <div className="text">{t('MIN_YEARS_EXPERIENCE')}</div>
                                <div className="value text-muted">{job.min_years_experience}</div>
                            </div>
                        </li>


                        {/* MVR_REQUIREMENTS */}
                        <li>
                            <div className="icon">
                                <GearWideConnected />
                            </div>
                            <div className="details">
                                <div className="text">{t('MVR_REQUIREMENTS')}</div>
                                <ul>
                                    {job.mvr_requirements &&
                                        job.mvr_requirements.map((item, index) => {
                                            return <li key={index}>
                                                <div className="row value text-muted">
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
            </div>
        </>
    )
}
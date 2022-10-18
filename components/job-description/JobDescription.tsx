import { JobBenefits } from "../../enums/jobs/job-benefits.enum";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../hooks/useTranslation";
import ShowEnumFromString from "../enum-filters/show-enum-from-string";
import ShowFormattedDate from "../jobs/show-formatted-date";
import { buildAddress } from "../../utils/common";
import { JobDetailProps } from "../../types/job/job-detail-props.type";

export default function JobDescription({ job }:JobDetailProps) {
    const { t } = useTranslation();

    return (
        <>
            <div className="job-deatails-inner shadow-lg single-job-items p-4 m-1 mb-5">
                <div className=" p-3 mb-5  rounded">
                    <h3 className="border-bottom py-1 mb-4">{t('job_description')}</h3>
                    <p>{job.description_short}</p>
                    <p>{job.description}</p>
                </div>
                {job.benefits.length > 0 && <div className=" p-3 mb-5  rounded mt-3">
                    <h3 className="border-bottom py-1 mb-4">{t('BENEFITS')}</h3>
                    <p>
                        <ShowEnumFromString labelPrefix="JobBenefits" str={job.benefits} enumArray={JobBenefits} />
                        , {job.benefits_other}
                    </p>
                </div>}
                { (job.required_skills.length > 0 || job.required_skills_other) &&  <div className=" p-3 mb-5  rounded mt-3">
                    <h3 className="border-bottom py-1 mb-4">{t('REQUIRED_SKILLS')}</h3>
                    <ul className="p-0">
                        {job.required_skills &&
                            job.required_skills.map((item, index) => (
                                <li className="row px-0" key={index}>
                                    <div className="col-md-3">
                                        <ShowEnumFromString labelPrefix="JobEquipmentType" str={item.type} enumArray={JobEquipmentType} />
                                    </div>
                                    <div className="col-md-3">
                                        {`${item.years} ${t('YEARS')} `}
                                    </div>
                                </li>
                            ))
                        }
                        <li className="row px-0">
                            <div className="col-md-3">
                                {job.required_skills_other ? t('OTHER_SKILLS') : ''}
                            </div>
                            <div className="col-md-6">
                                {job.required_skills_other}
                            </div>
                        </li>
                    </ul>
                </div>}
                {job.is_orientation_needed &&
                    <div className=" p-3 mb-5  rounded mt-3">
                        <h3 className="border-bottom py-1 mb-4">{t('ORIENTATION')}</h3>
                        <ul className="p-0">
                            <li className="row px-0">
                                <div className="col-md-3 font-weight-bold">
                                    { t('START_DATE') }
                                </div>
                                <div className="col-md-6">
                                    <ShowFormattedDate
                                        hideTime
                                        date={job.orientation_start_at} />
                                </div>
                            </li>
                            <li className="row px-0">
                                <div className="col-md-3 font-weight-bold">
                                    { t('END_DATE') }
                                </div>
                                <div className="col-md-6">
                                    <ShowFormattedDate
                                        hideTime
                                        date={job.orientation_end_at} />
                                </div>
                            </li>
                            <li className="row px-0">
                                <div className="col-md-3 font-weight-bold">
                                    { t('location') }
                                </div>
                                <div className="col-md-6">
                                    {buildAddress(job.orientation_location)}
                                </div>
                            </li>
                        </ul>

                    </div>
                }
            </div>

        </>
    )
}
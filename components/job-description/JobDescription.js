import { JobBenefits } from "../../enums/jobs/job-benefits.enum";
import { JobEquipmentType } from "../../enums/jobs/job-equipment-type.enum";
import { useTranslation } from "../../hooks/useTranslation";
import ShowEnumFromString from "../enum-filters/show-enum-from-string";

export default function JobDescription({ job }) {
    const { t } = useTranslation();

    return (
        <>
            <div className="job-deatails-inner">
                <div className="shadow-sm p-3 mb-5 bg-white rounded">
                    <h3>{t('job_description')}</h3>
                    <p>{job.description_short}</p>
                    <p>{job.description}</p>
                </div>
                <div className="shadow-sm p-3 mb-5 bg-white rounded mt-3">
                    <h3 className="mt-5">{t('BENEFITS')}</h3>
                    <p>
                        <ShowEnumFromString labelPrefix="JobBenefits" str={job.benefits} enumArray={JobBenefits} />
                        , {job.benefits_other}
                    </p>
                </div>
                <div className="shadow-sm p-3 mb-5 bg-white rounded mt-3">
                    <h3 className="mt-5">{t('REQUIRED_SKILLS')}</h3>
                    <ul>
                        {job.required_skills &&
                            job.required_skills.map((item, index) => (
                                <li className="row" key={index}>
                                    <div className="col-md-3">
                                        <ShowEnumFromString labelPrefix="JobEquipmentType" str={item.type} enumArray={JobEquipmentType} />
                                    </div>
                                    <div className="col-md-3">
                                        {`${item.years} ${t('YEARS')} `}
                                    </div>
                                </li>
                            ))
                        }
                        <li className="row">
                            <div className="col-md-3">
                                {t('OTHER')}
                            </div>
                            <div className="col-md-6">
                                {job.required_skills_other}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"

export default function EmploymentType() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("employment_type")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="employment_type"
          labelPrefix="JobEmploymentType"
          enums={JobEmploymentType} />
      </FindJobFilterAccordion>
    </>
  )
}
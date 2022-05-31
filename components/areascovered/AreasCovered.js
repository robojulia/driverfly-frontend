import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobGeography } from "../../enums/jobs/job-geography.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"

export default function AreasCovered() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("areas_covered")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="areas_covered"
          labelPrefix="JobGeography"
          enums={JobGeography} />
      </FindJobFilterAccordion>
    </>
  )
}
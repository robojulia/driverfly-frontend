import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { MvrType } from "../../enums/users/mvr-type.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"

export default function MvrRequirement() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("mvr_requirements")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="mvr_requirements"
          labelPrefix="MvrType"
          enums={MvrType} />
      </FindJobFilterAccordion>
    </>
  )
}
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"

export default function PayStructure() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (

    <>
      <FindJobFilterAccordion header={t("pay_structure")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="pay_structure"
          labelPrefix="JobPayMethod"
          enums={JobPayMethod} />
      </FindJobFilterAccordion>
    </>
  )
}
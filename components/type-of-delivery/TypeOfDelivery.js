import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"

export default function TypeOfDelivery() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>

      <FindJobFilterAccordion header={t("TYPE_OF_DELIVERY")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="delivery_type"
          labelPrefix="JobDeliveryType"
          enums={JobDeliveryType} />
      </FindJobFilterAccordion>
    </>
  )
}
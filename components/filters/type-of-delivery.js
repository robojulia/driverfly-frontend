import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function TypeOfDelivery(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>

      <FindJobFilterAccordion {...props} header={t("TYPE_OF_DELIVERY")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="delivery_type"
          labelPrefix="JobDeliveryType"
          enums={JobDeliveryType} />
      </FindJobFilterAccordion>
    </>
  )
}
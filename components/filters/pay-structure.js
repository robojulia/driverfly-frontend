import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function PayStructure(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion {...props} header={t("pay_structure")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="pay_structure"
          labelPrefix="JobPayMethod"
          enums={JobPayMethod} />
      </FindJobFilterAccordion>
    </>
  )
}
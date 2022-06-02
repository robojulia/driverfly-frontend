import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function SpecialEndorsementsRequired(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion {...props} header={t("special_endorsements_required")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="endoresements_type"
          labelPrefix="DriverEndorsement"
          enums={DriverEndorsement} />
      </FindJobFilterAccordion>
    </>
  )
}
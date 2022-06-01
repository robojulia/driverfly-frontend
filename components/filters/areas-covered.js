import { JobGeography } from "../../enums/jobs/job-geography.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";

export default function AreasCovered(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>
      <FindJobFilterAccordion header={t("areas_covered")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="areas_covered"
          labelPrefix="JobGeography"
          enums={JobGeography} />
      </FindJobFilterAccordion>
    </>
  )
}
import moment from "moment"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { JobDatePosted } from "../../enums/jobs/job-date-posted.enum"
import ViewMoreRadioFilter from "./view-more-radio-filter";


export default function DatePosted(props) {

  const { t, state, method } = props
  const { handleChange } = method

  function changeHandler(e) {
    if (e.target.value == JobDatePosted.LAST_HOUR) {
      e.target.value = moment.utc().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == JobDatePosted.LAST_24_HOURS) {
      e.target.value = moment.utc().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == JobDatePosted.LAST_7_DAYS) {
      e.target.value = moment.utc().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == JobDatePosted.LAST_14_DAYS) {
      e.target.value = moment.utc().subtract(14, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == JobDatePosted.LAST_30_DAYS) {
      e.target.value = moment.utc().subtract(30, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else {
      e.target.value = ""
    }
    handleChange(e)
  }

  return (
    <>
      <FindJobFilterAccordion header={t("POST_DATE")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={changeHandler}
          name="date_created"
          labelPrefix="JobDatePosted"
          enums={JobDatePosted} />
      </FindJobFilterAccordion>
    </>
  )
}
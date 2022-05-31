import { useContext } from "react"
import jobContext from "../../context/jobContext"
import moment from "moment"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import { JobDatePosted } from "../../enums/jobs/job-date-posted.enum"
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter";

export default function DatePosted() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
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
          handleChange={changeHandler}
          name="date_created"
          labelPrefix="JobDatePosted"
          enums={JobDatePosted} />
      </FindJobFilterAccordion>
    </>
  )
}
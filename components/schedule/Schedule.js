import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobSchedule } from "../../enums/jobs/job-schedule.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";
import ViewMoreRadioFilter from "../find-jobs/filters/view-more-radio-filter"


export default function Schedule() {
  const { state, method } = useContext(jobContext)
  const { handleChange } = method
  const { t } = useTranslation();

  return (
    <>

      <FindJobFilterAccordion header={t("schedule")}>
        <ViewMoreRadioFilter
          handleChange={handleChange}
          name="schedule"
          labelPrefix="JobSchedule"
          enums={JobSchedule} />
      </FindJobFilterAccordion>
    </>
  )
}
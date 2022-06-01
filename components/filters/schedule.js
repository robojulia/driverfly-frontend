import { JobSchedule } from "../../enums/jobs/job-schedule.enum"
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import ViewMoreRadioFilter from "./view-more-radio-filter";


export default function Schedule(props) {

  const { t, state, method } = props
  const { handleChange } = method

  return (
    <>

      <FindJobFilterAccordion header={t("schedule")}>
        <ViewMoreRadioFilter
          {...props}
          handleChange={handleChange}
          name="schedule"
          labelPrefix="JobSchedule"
          enums={JobSchedule} />
      </FindJobFilterAccordion>
    </>
  )
}
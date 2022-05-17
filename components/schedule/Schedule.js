import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { JobSchedule } from "../../enums/jobs/job-schedule.enum"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";


export default function Schedule() {
  const { state, method } = useContext(jobContext)
  const { handleChange } = method
  const { t } = useTranslation();

  return (
    <>

      <FindJobFilterAccordion header={t("schedule")}>
        <EnumFilterByKeyValue
          translate={true}
          withAll={true}
          enumArray={JobSchedule}
          name="schedule"
          handleChange={handleChange}
        />
      </FindJobFilterAccordion>
     </>
  )
}
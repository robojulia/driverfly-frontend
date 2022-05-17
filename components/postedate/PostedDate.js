
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import moment from "moment"
import { Accordion } from 'react-bootstrap';
import FindJobFilterAccordion from "../find-jobs-accordion/find-job-filter-accordion"
import { useTranslation } from "../../hooks/useTranslation";


export default function DatePosted() {
  const { t } = useTranslation();
  const { state, method } = useContext(jobContext)
  const { handleChange } = method
  const { filters } = state

  function changeHandler(e) {
    if (e.target.value == "lasthour") {
      e.target.value = moment.utc().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lasttwentyfour") {
      e.target.value = moment.utc().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastseven") {
      e.target.value = moment.utc().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastfourteen") {
      e.target.value = moment.utc().subtract(14, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastthirty") {
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
        <div onChange={changeHandler} className="App">
          <div className="topping pt-2">
            <input
              defaultChecked={(!filters.date_created) || (filters.date_created == "")}
              type="radio"
              id="all"
              name="date_created"
              value="" />All
          </div>
          <div className="topping pt-2">
            <input type="radio" id="lasthour" name="date_created" value="lasthour" />Last Hour
          </div>
          <div className="topping pt-2">
            <input type="radio" id="lasttwentyfour" name="date_created" value="lasttwentyfour" />Last 24 Hour
          </div>
          <div className="topping pt-2">
            <input type="radio" id="lastseven" name="date_created" value="lastseven" />Last 7 days
          </div>
          <div className="topping pt-2">
            <input type="radio" id="lastfourteen" name="date_created" value="lastfourteen" /> Last 14 days
          </div>
          <div className="topping pt-2">
            <input type="radio" id="lastthirty" name="date_created" value="lastthirty" />Last 30 days
          </div>
        </div>
      </FindJobFilterAccordion>
    </>
  )
}
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { JobSchedule } from "../../enums/jobs/job-schedule.enum"

export default function Schedule() {
  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseSchedule" aria-expanded="true"
              aria-controls="collapseSchedule">Schedule <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseSchedule" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={JobSchedule}
                name="schedule"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
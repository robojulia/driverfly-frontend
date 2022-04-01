import { useRouter } from "next/router"
import { updateQueryStringParameter } from "../../logics/utils"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { job_type } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function JobType() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method


  return (
    <>
      <div className="card">
        <div className="card-header" id="headingThree">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseThree" aria-expanded="true"
              aria-controls="collapseThree">Job Type <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseThree" className="collapse show "
          aria-labelledby="headingThree" data-parent="#accordionExample">
          <div className="card-body">
            <div className="custom-control custom-checkbox p-0">
              <div className="App">
                <EnumFilterByKeyValue
                  withAll={true}
                  enumArray={job_type}
                  name="job_type"
                  handleChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import { useRouter } from "next/router"
import { updateQueryStringParameter } from "../../logics/utils"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { job_type } from "../../enums/jobs/job-fields"

export default function JobType() {

  const { filters, applyFilters } = useContext(jobContext)
  const handleChange = (e) => {
    filters.job_type = e.target.value
    applyFilters()
  }

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
                <div class="topping ">
                  <input
                    onChange={handleChange}
                    type="radio"
                    name="job_type"
                    value="" /> Any
                </div>
                {Object.keys(job_type).map((key) => {
                  return (
                    <>
                      <div class="topping pt-2">
                        <input
                          onChange={handleChange}
                          type="radio"
                          name="job_type"
                          value={key} /> {job_type[key]}
                      </div>
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
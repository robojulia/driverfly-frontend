import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { employment_type } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { JobEmploymentType } from "../../enums/jobs/job-employment-type.enum";

export default function EmploymentType() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseEmployment" aria-expanded="true"
              aria-controls="collapseEmployment">Employment Type <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseEmployment" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={JobEmploymentType}
                name="employment_type"
                handleChange={handleChange}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
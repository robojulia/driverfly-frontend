import { deleteKey, updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { areas_covered } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function AreasCovered() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingNine">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseNine" aria-expanded="true"
              aria-controls="collapseNine">Areas Covered<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseNine" className="collapse show"
          aria-labelledby="headingNine" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                withAll={true}
                enumArray={areas_covered}
                name="areas_covered"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
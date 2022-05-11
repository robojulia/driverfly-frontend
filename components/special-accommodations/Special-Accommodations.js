import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { special_accommodations } from "../../enums/jobs/job-fields"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function SpecialAccommodations() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingfivety">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsefivety" aria-expanded="true"
              aria-controls="collapsefivety">Special Accommodations<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsefivety" className="collapse show"
          aria-labelledby="headingfivety" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                withAll={true}
                enumArray={special_accommodations}
                name="special_accommodations"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
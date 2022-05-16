import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobPayMethod } from "../../enums/jobs/job-pay-method.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { ChevronDown } from "react-bootstrap-icons"

export default function PayStructure() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (

    <>
      <div className="card">
        <div className="card-header" id="headingFour">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseFour" aria-expanded="true"
              aria-controls="collapseFour">Pay Structure <ChevronDown /></a>
          </h4>
        </div>
        <div id="collapseFour" className="collapse show"
          aria-labelledby="headingFour" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={JobPayMethod}
                name="pay_structure"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
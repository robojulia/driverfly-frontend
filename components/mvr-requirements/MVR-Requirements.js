import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { MvrType } from "../../enums/users/mvr-type.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { ChevronDown } from "react-bootstrap-icons"

export default function MvrRequirement() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingseventy">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsesedventy" aria-expanded="true"
              aria-controls="collapsesedventy">MVR Requirements < ChevronDown /></a>
          </h4>
        </div>
        <div id="collapsesedventy" className="collapse show"
          aria-labelledby="headingseventy" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={MvrType}
                name="mvr_requirements"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
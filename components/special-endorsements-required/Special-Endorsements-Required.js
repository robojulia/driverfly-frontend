import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { DriverEndorsement } from "../../enums/drivers/driver-endorsement.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"

export default function SpecialEndorsementsRequired() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingsixty">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsesixty" aria-expanded="true"
              aria-controls="collapsesixty">Special Endorsements Required<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsesixty" className="collapse show"
          aria-labelledby="headingsixty" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={DriverEndorsement}
                name="endoresements_type"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { JobDeliveryType } from "../../enums/jobs/job-delivery-type.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { ChevronDown } from "react-bootstrap-icons"


export default function TypeOfDelivery() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseTypeofDelivery" aria-expanded="true"
              aria-controls="collapseTypeofDelivery">Type of Delivery < ChevronDown/></a>
          </h4>
        </div>
        <div id="collapseTypeofDelivery" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={JobDeliveryType}
                name="delivery_type"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
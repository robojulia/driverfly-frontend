import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { delivery_type } from "../../enums/jobs/job-fields"

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
              aria-controls="collapseTypeofDelivery">Type of Delivery <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseTypeofDelivery" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <div class="topping ">
                <input
                  onChange={handleChange}
                  type="radio"
                  name="delivery_type"
                  value="" /> Any
              </div>
              {Object.keys(delivery_type).map((key) => {
                return (
                  <>
                    <div class="topping pt-2">
                      <input
                        onChange={handleChange}
                        type="radio"
                        name="delivery_type"
                        value={key} /> {delivery_type[key]}
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
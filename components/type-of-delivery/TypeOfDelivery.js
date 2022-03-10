import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function TypeOfDelivery () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    if (e.target.checked) {
      const a = updateQueryStringParameter( window.location.href, 'delivery_type[]', e.target.value )
      router.replace( a )
      ctx.applyFilters()
    }
  }

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
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="checkbox" id="touch" name="areas" value="touch" />Touch (1)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id=">notouch" name="areas" value="no-touch" />No Touch (1)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="Drop-and-hook" name="areas" value="drop-and-hook" />Drop-and-hook (6)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="Dedicated" name="areas" value="dedicated-lanes" />Dedicated Lanes (1)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
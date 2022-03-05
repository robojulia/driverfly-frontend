import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
export default function TypeOfDelivery () {
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-delivery-type', e.target.value )
    router.replace( a )
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
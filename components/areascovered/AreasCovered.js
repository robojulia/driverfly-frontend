import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
export default function AreasCovered () {
const router = useRouter()
function changeHandler ( e ) {
  const a = updateQueryStringParameter( window.location.href, 'filter-area', e.target.value )
  router.replace( a )
}

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
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="checkbox" id="Local" name="areas" value="local" /> Local(5)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="Regional" name="areas" value="regional" /> Regional(7)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="ort" name="areas" value="otr" /> OTR (12)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="crossBorder" name="areas" value="crossborder" />  CrossBorder (1)
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}
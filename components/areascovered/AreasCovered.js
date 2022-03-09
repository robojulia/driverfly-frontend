import { deleteKey, updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function AreasCovered () {
const router = useRouter()
const ctx = useContext( jobContext )
function changeHandler ( e ) {
  // if its not checked, add it to the query string
  if (e.target.checked) {
    const a = updateQueryStringParameter( window.location.href, 'areas_covered[]', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }
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
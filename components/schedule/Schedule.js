import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"

export default function Schedule () {
const router = useRouter()
const ctx = useContext( jobContext )
function changeHandler ( e ) {
  const a = updateQueryStringParameter( window.location.href, 'schedule', e.target.value )
  router.replace( a )
  ctx.applyFilters()
}

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseSchedule" aria-expanded="true"
              aria-controls="collapseSchedule">Schedule <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseSchedule" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
          <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="radio" id="multipleweeks" name="areas" value="multipleweeks" />Multiple weeks on the road (6)
              </div>
              <div className="topping pt-2">
                <input type="radio" id="mostweekends" name="areas" value="mostweekends" />Most weekends off (2)
              </div>
              <div className="topping pt-2">
                <input type="radio" id="Weekendsoff" name="areas" value="weekendsoff" />Weekends off (7)
              </div>
              <div className="topping pt-2">
                <input type="radio" id="Other" name="areas" value="other" />Other (12)
              </div>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}
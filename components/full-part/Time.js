import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function FullParty () {
  const ctx = useContext( jobContext )
const router = useRouter()

  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-job-type', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }
  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseFullPart" aria-expanded="true"
              aria-controls="collapseFullPart">Full-time/Part-time <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseFullPart" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="radio" id="part-time" name="time" value="part-time" />Part-time (1)
              </div>
              <div className="topping pt-2">
                <input type="radio" id="full-time" name="time" value="full-time" />Full-time (29)
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
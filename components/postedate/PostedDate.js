
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function DatePosted () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-date-posted', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }
  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseSix" aria-expanded="true"
              aria-controls="collapseSix">Date Posted <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseSix" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="radio" id="lasthour" name="topping" value="lasthour" />Last Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lasttwentyfour" name="topping" value="lasttwentyfour" />Last 24 Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastseven" name="topping" value="lastseven" />Last 7 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastfourteen" name="topping" value="lastfourteen" /> Last 14 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastthirty" name="topping" value="lastthirty" />Last 30 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="all" name="topping" value="all" />All
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
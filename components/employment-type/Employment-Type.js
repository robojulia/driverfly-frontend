import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function EmploymentType () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'employment_type', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }
  return (
    <>
      <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseEmployment" aria-expanded="true"
              aria-controls="collapseEmployment">Employment Type <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseEmployment" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="radio" id="lasthour" name="areas" value="W-2" />W-2 (18)
              </div>
              <div className="topping pt-2">
                <input type="radio" id="hour" name="areas" value="1099" />1099 (12)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
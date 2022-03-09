import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function SpecialEndorsementsRequired () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    if (e.target.checked) {
      const a = updateQueryStringParameter( window.location.href, 'endoresements_type[]', e.target.value )
      router.replace( a )
      ctx.applyFilters()
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingsixty">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsesixty" aria-expanded="true"
              aria-controls="collapsesixty">Special Endorsements Required<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsesixty" className="collapse show"
          aria-labelledby="headingsixty" data-parent="#accordionExample">
          <div onChange={changeHandler} className="card-body">
            <div className="topping pt-2 ">
              <input type="checkbox" id="twic" name="topping" value="twic" />TWIC (4)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="hazardos" name="topping" value="hazardos" />(H) Hazardous Materials (HAZMAT) (2)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="tank" name="topping" value="tank" />(N) Tank Vehicle(Tanker) (1)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="tankcombo" name="topping" value="tankcombo" />(X) Tanker/HAZMAT Combo (2)
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
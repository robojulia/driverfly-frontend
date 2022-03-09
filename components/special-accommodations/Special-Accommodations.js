import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
export default function SpecialAccommodations () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    if (e.target.checked) {
      const a = updateQueryStringParameter( window.location.href, 'filter-accommodation-type[]', e.target.value )
      router.replace( a )
      ctx.applyFilters()
    }
  }
  return (
    <>
      <div className="card">
        <div className="card-header" id="headingfivety">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsefivety" aria-expanded="true"
              aria-controls="collapsefivety">Special Accommodations<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsefivety" className="collapse show"
          aria-labelledby="headingfivety" data-parent="#accordionExample">
          <div onChange={changeHandler} className="card-body">
            <div className="topping pt-2 ">
              <input type="checkbox" id="candidatesfelonies" name="topping" value="candidatesfelonies" />Open to candidates with past felonies (6)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="candidatesmisdemeanors" name="topping" value="candidatesmisdemeanors" />Open to candidates with past misdemeanors (6)
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
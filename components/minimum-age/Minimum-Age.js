import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"

export default function MinimumAge () {
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-age', e.target.value )
    router.replace( a )
  }

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingfourty">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsefourty" aria-expanded="true"
              aria-controls="collapsefourty">Minimum Age<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsefourty" className="collapse show"
          aria-labelledby="headingfourty" data-parent="#accordionExample">
          <div onChange={changeHandler} className="card-body">
            <div className="topping pt-2 ">
              <input type="checkbox" id="eighteen" name="eighteen" value="18" />18 (1)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="twentythree" name="topping" value="23" />23 (28)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="twentyfour" name="topping" value="24" />24 (1)
            </div>'


          </div>
        </div>
      </div>
    </>
  )
}
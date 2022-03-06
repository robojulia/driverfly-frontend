import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
export default function MvrRequirement () {
  const router = useRouter()
  function changeHandler ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'filter-mvr', e.target.value )
    router.replace( a )
  }

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingseventy">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsesedventy" aria-expanded="true"
              aria-controls="collapsesedventy">MVR Requirements<i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapsesedventy" className="collapse show"
          aria-labelledby="headingseventy" data-parent="#accordionExample">
          <div onChange={changeHandler} className="card-body">
            <div className="topping pt-2 ">
              <input type="checkbox" id="clearmvr" name="topping" value="clearmvr" />Clean MVR Only (19)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="moving" name="topping" value="moving" />Moving Violation Okay (2)
            </div>
            <div className="topping pt-2 ">
              <input type="checkbox" id="fault" name="topping" value="fault" />Non "At Fault" Accident Okay (8)
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
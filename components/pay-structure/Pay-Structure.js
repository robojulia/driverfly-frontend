import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"

export default function PayStructure () {
  const ctx = useContext( jobContext )
  const router = useRouter()
  function changeHandler ( e ) {
    if (e.target.checked) {
      const a = updateQueryStringParameter( window.location.href, 'pay_structure[]', e.target.value )
      router.replace( a )
      ctx.applyFilters()
    }
  }
  return (
    
    <>
      <div className="card">
        <div className="card-header" id="headingFour">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseFour" aria-expanded="true"
              aria-controls="collapseFour">Pay Structure <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseFour" className="collapse show"
          aria-labelledby="headingFour" data-parent="#accordionExample">
          <div className="card-body">
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input type="checkbox" id="permile" name="topping" value="Rate per mile" />Rate per mile (8)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="percentage" name="topping" value="Percent per move" />Percent per move (5)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="hourly" name="topping" value="Hourly" />Hourly (3)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="setweekly" name="topping" value="Set Weekly" />Set Weekly (6)
              </div>
              <div className="topping pt-2">
                <input type="checkbox" id="salaried" name="topping" value="Salaried" />Salaried (2)
              </div>
              <div className="topping pt-2 ">
                <input type="checkbox" id="perweight" name="topping" value="Percent weight" />Percent weight (1)
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
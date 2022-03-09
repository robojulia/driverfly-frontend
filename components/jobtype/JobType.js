import { useRouter } from "next/router"
import { updateQueryStringParameter } from "../../logics/utils"
import { useContext } from "react"
import jobContext from "../../context/jobContext"

export default function JobType () {
  const ctx = useContext( jobContext )
  const router = useRouter()

  function handleChange ( e ) {
    const a = updateQueryStringParameter( window.location.href, 'job_type', e.target.value )
    router.replace( a )
    ctx.applyFilters()
  }

  return (
    <>
      <div className="card">
        <div className="card-header" id="headingThree">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseThree" aria-expanded="true"
              aria-controls="collapseThree">Job Type <i
                className="fa fa-angle-down"></i></a>
          </h4>
        </div>
        <div id="collapseThree" className="collapse show "
          aria-labelledby="headingThree" data-parent="#accordionExample">
          <div className="card-body">
            <div className="custom-control custom-checkbox p-0">
              <div onChange={handleChange} className="App">
                <div className="topping">
                  <input type="radio" id="solo" name="jobtype" value="solor" />Solo(27)
                </div>
                <div className="topping pt-2">
                  <input type="radio" id="teamdrivers" name="jobtype" value="teamdrivers" />Team Drivers(2)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
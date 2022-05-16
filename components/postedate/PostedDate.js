
import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import moment from "moment"
import { Accordion } from 'react-bootstrap';

export default function DatePosted() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method
  const { filters } = state

  function changeHandler(e) {
    if (e.target.value == "lasthour") {
      e.target.value = moment.utc().subtract(1, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lasttwentyfour") {
      e.target.value = moment.utc().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastseven") {
      e.target.value = moment.utc().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastfourteen") {
      e.target.value = moment.utc().subtract(14, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else if (e.target.value == "lastthirty") {
      e.target.value = moment.utc().subtract(30, "days").format("YYYY-MM-DD HH:mm:ss")
    }
    else {
      e.target.value = ""
    }
    handleChange(e)
  }

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header> <span className="btn-3 btn-link">Date Posted</span></Accordion.Header>
          <Accordion.Body>
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input
                  defaultChecked={(!filters.date_created) || (filters.date_created == "")}
                  type="radio"
                  id="all"
                  name="date_created"
                  value="" />All
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lasthour" name="date_created" value="lasthour" />Last Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lasttwentyfour" name="date_created" value="lasttwentyfour" />Last 24 Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastseven" name="date_created" value="lastseven" />Last 7 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastfourteen" name="date_created" value="lastfourteen" /> Last 14 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastthirty" name="date_created" value="lastthirty" />Last 30 days
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <div className="card">
        <div className="card-header" id="headingSix">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseSix" aria-expanded="true"
              aria-controls="collapseSix">Date Posted < ChevronDown /></a>
          </h4>
        </div>
        <div id="collapseSix" className="collapse show" aria-labelledby="headingSix"
          data-parent="#accordionExample">
          <div className="card-body">
            <div onChange={changeHandler} className="App">
              <div className="topping pt-2">
                <input
                  defaultChecked={(!filters.date_created) || (filters.date_created == "")}
                  type="radio"
                  id="all"
                  name="date_created"
                  value="" />All
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lasthour" name="date_created" value="lasthour" />Last Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lasttwentyfour" name="date_created" value="lasttwentyfour" />Last 24 Hour
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastseven" name="date_created" value="lastseven" />Last 7 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastfourteen" name="date_created" value="lastfourteen" /> Last 14 days
              </div>
              <div className="topping pt-2">
                <input type="radio" id="lastthirty" name="date_created" value="lastthirty" />Last 30 days
              </div>
            </div>

          </div>
        </div>
      </div> */}
    </>
  )
}
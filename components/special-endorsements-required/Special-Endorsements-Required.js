import { updateQueryStringParameter } from "../../logics/utils"
import { useRouter } from "next/router"
import { useContext } from "react"
import jobContext from "../../context/jobContext"
import { DriverEndorsement } from "../../enums/users/driver-endorsement.enum"
import EnumFilterByKeyValue from "../enum-filters/enum-filter-by-key-value"
import { Accordion } from 'react-bootstrap';

export default function SpecialEndorsementsRequired() {

  const { state, method } = useContext(jobContext)
  const { handleChange } = method

  return (
    <>
     <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header> <span className="btn-3 btn-link"> Special Endorsements Required</span> </Accordion.Header>
          <Accordion.Body>
          <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={DriverEndorsement}
                name="endoresements_type"
                handleChange={handleChange}
              />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <div className="card">
        <div className="card-header" id="headingsixty">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapsesixty" aria-expanded="true"
              aria-controls="collapsesixty">Special Endorsements Required <ChevronDown/></a>
          </h4>
        </div>
        <div id="collapsesixty" className="collapse show"
          aria-labelledby="headingsixty" data-parent="#accordionExample">
          <div className="card-body">
            <div className="App">
              <EnumFilterByKeyValue
                translate={true}
                withAll={true}
                enumArray={DriverEndorsement}
                name="endoresements_type"
                handleChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
}
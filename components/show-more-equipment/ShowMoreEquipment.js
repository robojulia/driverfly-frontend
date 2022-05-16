import { ChevronDown } from 'react-bootstrap-icons'
import Read from '../equipment-show-more/readmore'
import { Accordion } from 'react-bootstrap';


export default function ShowMoreEquipment() {
  return (
    <>

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header> <span className="btn-3 btn-link"> Equipment Type</span></Accordion.Header>
          <Accordion.Body>
            < Read />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* <div className="card">
        <div className="card-header" id="headingsee">
          <h4 className="clearfix mb-0">
            <a className="btn-3 btn-link" data-toggle="collapse"
              data-target="#collapseseemore" aria-expanded="true"
              aria-controls="collapseseemore">Equipment Type< ChevronDown /></a>
          </h4>
        </div>
        <div id="collapseseemore" className="collapse show"
          aria-labelledby="headingsee" data-parent="#accordionExample">
          <div className="card-body">
            < Read />
          </div>
        </div>
      </div> */}
    </>
  )
}
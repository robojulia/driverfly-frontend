
import { Accordion } from 'react-bootstrap';


export default function FindJobFilterAccordion(props) {

  return (
    <>

      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header> <span className="btn-3 btn-link">{props.header}</span></Accordion.Header>
          <Accordion.Body>
            {props.children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  )
}
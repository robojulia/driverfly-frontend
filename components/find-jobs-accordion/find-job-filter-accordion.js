
import { Accordion } from 'react-bootstrap';


export default function FindJobFilterAccordion(props) {

  return (
    <>
      <Accordion defaultActiveKey={props.open == true ? 1 : 0}>
        <Accordion.Item eventKey={1}>
          <Accordion.Header> <span className="btn-3 btn-link">{props.header}</span></Accordion.Header>
          <Accordion.Body>
            {props.children}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

    </>
  )
}
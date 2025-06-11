import React from 'react';
import { Accordion } from "react-bootstrap";

export default class extends React.Component {
    static displayName = 'CDLInfo';
    
    render() {
        return (
            <div>
                <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header> <span className="btn-link"> Things to Consider </span></Accordion.Header>
                        <Accordion.Body>
                            <p>Before getting your CDL, make sure to read the FMCSA&apos;s instructions and download your state&apos;s manual about
                            the process. Also, decide which type of vehicle and which class you would like your license for, as well as whether
                            or not you want any endorsements.</p>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header> <span className="btn-link"> Getting Your CDL </span></Accordion.Header>
                        <Accordion.Body>
                            <p>To get your CDL, you must first get a Commerical Learners Permit (CLP). This requires passing knowledge tests
                            and providing the necessary documentation, which may include your driving record, medicals, or proof of residency.
                            The documents you&apos;ll need will depend on the type of license you&apos;re trying to get and the state you&apos;re in.</p>
                            <p>Afterwards, you must do Entry-Level Driver Training with a training provider registered on the FMCSA&apos;s Training Provider
                            Registry. You can search for a provider with the tool below.</p>
                            <p>Once you&apos;ve completed your training, you must take the Skills Test. After passing the skills test, bring your documentation
                            to the counter to be processed. You will then be given or mail your license, depending on your state.</p>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header> <span className="btn-link"> Grants </span></Accordion.Header>
                        <Accordion.Body>
                            <h6>Veterans</h6>
                            <p>If you or a family member is a veteran, the GI bill may be able to help cover some or all of your CDL training costs.
                            Learn more about the bill <a target='blank' href='https://www.va.gov/education/about-gi-bill-benefits/'>here.</a></p>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }
}

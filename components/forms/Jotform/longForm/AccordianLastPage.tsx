import { useFormik } from "formik";
import React from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import styles from "../../../../styles/jotform.module.css";
import Accordion from "react-bootstrap/Accordion";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";



export interface BackgroundInfoProps {
//   onNextClick: (any) => void;
//   onBackClick: () => void;
}

export function AccordianLastPage() {
  const { t } = useTranslation();
  let padRef = React.useRef<SignatureCanvas>(null);
  const clear = () => {
    padRef.current?.clear();
  };
  return (
    <Form>
      <h1>Accordian1</h1>
      <Accordion className="col-12">
        <Accordion.Item eventKey="0">
          <Accordion.Header>VERIFICATION OF EMPLOYMENT</Accordion.Header>
          <Accordion.Body>
            <h2>VERIFICATION OF EMPLOYMENT</h2>
            <h6>SAFETY PERFORMANCE HISTORY RECORDS REQUEST</h6>
            <h3>Section I.</h3>
            <p className={styles.paragraph}>
              To be completed by the new employer, signed by the employee, and
              transmitted to the previous employer:
            </p>
            <h6>Employee Name: Suvineet Singh</h6>
            <BaseInput
              className="col-8"
              name="BUSINESS_TAX_NUMBER"
              label="Employee SS or Business Tax ID Number:"
            />
            <p className={styles.paragraph}>
              I hereby authorize release of information from my Department of
              Transportation regulated drug and alcohol testing records by my
              previous employer(s), listed in Section I-B, to the employer
              listed in Section I-A. This release is in accordance with DOT
              Regulation 49 CFR Part 40, Section 40.25. I understand that
              information to be released in Section II-B by my previous
              employer(s), is limited to the following DOT-regulated testing
              items:
            </p>
            <p className={styles.paragraph}>
              {" "}
              1. Alcohol tests with a result of 0.04 or higher;
            </p>
            <p className={styles.paragraph}>
              {" "}
              2. Verified positive drug tests;
            </p>
            <p className={styles.paragraph}> 3. Refusals to be tested;</p>
            <p className={styles.paragraph}>
              {" "}
              4. Other violations of DOT agency drug and alcohol testing
              regulations;
            </p>
            <p className={styles.paragraph}>
              {" "}
              5. Information obtained from previous employers of a drug and
              alcohol rule violation;
            </p>
            <p className={styles.paragraph}>
              {" "}
              6. Documentation, if any, of completion of the return-to-duty
              process following a rule violation.
            </p>
            <Row>
              <Col>
                <h6>Signature</h6>
                <SignaturePad
                  className
                  ref={padRef}
                  canvasProps={{
                    width: 600,
                    height: 200,
                    style: { border: "1px solid black" },
                    className: "sigCanvas",
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <button onClick={clear}>Clear</button>
              </Col>
            </Row>
            <Row>
              <h4>I-A</h4>
              <p className={styles.paragraph}>New Employer Name: Nautilus Trucking</p>
              <p className={styles.paragraph}>Address: 323 MLK BLVD, Newark</p>
              <p className={styles.paragraph}>Phone #: (551) 430-1998</p>
              <p className={styles.paragraph}>Fax #: </p>
              <p className={styles.paragraph}>Designated Employer Representative: Ansu Priyadarshi</p>
            </Row>
            <Row>
              <h6>Please note the following employers will be contacted roughly 24 hours from the time this application is filled for a Verification of Employment.
                This will include the information listed above along with any accident records. </h6>

            </Row>
            <Row>
              <h4>I-B</h4>
              <p className={styles.paragraph}>Current Company Name:</p>
              <p className={styles.paragraph}>Address:</p>
              <p className={styles.paragraph}>Phone #:</p>
              <p className={styles.paragraph}>Fax #: </p>
              <p className={styles.paragraph}>Designated Employer Representative (if known):</p>
            </Row>
            <Row>
              <h6>Please note the following fields will be answered by the employers you authorized above. </h6>

            </Row>
            <Row>
              <Col>
              <h3>Section II</h3>
              </Col>
            </Row>
            <Row>
              <p className={styles.paragraph}>To be completed by the previous employer and transmitted by mail or fax to the new employer:</p>
            </Row>
            <Row>
              <Col>
                <h4>II-A. Accident History</h4>
              </Col>
            </Row>
            <Row>
                  <p className={styles.paragraph}>The applicant named above was employed by us. Yes__ No__</p>
            </Row>
            <Row>
                  <p className={styles.paragraph}>Employed as __________________________ from (m/y) ______________________ to (m/y) ______________________</p>
            </Row>
            <Row>
                  <p className={styles.paragraph}>1. Did he/she drive motor vehicle for you? Yes__ No__. If yes, what type? Straight Truck__ Tractor-Semitrailer__ Bus__ Cargo Tank__ Doubles/Triples__ Other (Specify) _________________________</p>
            </Row>
            <Row>
                  <p className={styles.paragraph}>2. Reason for leaving your employ: Discharged__ Resignation__ Lay Off__ Military Duty___</p>
            </Row>
            <Row>
                  <p className={styles.paragraph}>If there is no safety performance history to report, check here ___, sign below and return.</p>
            </Row>
            <Row>
                  <p className={styles.paragraph}>The applicant named above was employed by us. Yes__ No__</p>
            </Row>
            

          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Accordion Item #2</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row className="mt-2">
        <Col>
          <Button className="float-right" type="reset">
            {t("BACK")}
          </Button>
        </Col>

        <Col>
          <Button className="float-left" type="submit">
            {t("SUBMIT")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

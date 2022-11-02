import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import BaseInput from "../../base-input";
import styles from "../../../../styles/jotform.module.css";
import Accordion from "react-bootstrap/Accordion";
import SignaturePad from "react-signature-canvas";
import SignatureCanvas from "react-signature-canvas";

import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface AccordianLastPageProps extends PageProps {}

export function AccordianLastPage(props: AccordianLastPageProps) {
  const {
    state: { applicant },
  } = useContext(jotformContext);

  // useEffect(() => {
  //   const { email, phone, zip_code, options } = applicant;
  //   form.setValues({
  //     email: email || null,
  //     phone: phone || null,
  //     zip_code: zip_code || null,
  //     options: options || null,
  //   });
  // }, [applicant]);
  const { t } = useTranslation();
  let padRef = React.useRef<SignatureCanvas>(null);
  const clear = () => {
    padRef.current?.clear();
  };
  const form = useFormik({
    initialValues: {
      //   manual_qualification: null,
      //   endorsements_twic: null,
    },
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
  return (
    <Form>
      <h1>{t("FORMS_TO_SIGNUP")}</h1>
      <h6>{t("PLEASE_CLICK_EACH_ARROW")}</h6>
      <Accordion className="col-12">
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("VERIFICATION_OF_EMPLOYMENT")}</Accordion.Header>
          <Accordion.Body>
            <h2>{t("VERIFICATION_OF_EMPLOYMENT")}</h2>
            <h6>{t("SAFETY_PERFORMANCE_HISTORY_RECORDS_REQUEST")}</h6>
            <Row className={styles.align__text_left}>
              <h3>{t("SECTION_I")}</h3>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {t("TO_BE_COMPLETED_BY_THE_NEW_EMPLOYER")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <h6>{t("EMPLOYEE_NAME_SUVINEET_SINGH")}</h6>
            </Row>
            <Row className={styles.align__text_left}>
              <Col>
                <BaseInput
                  className="col-6 mb-3 mt-3"
                  name="BUSINESS_TAX_NUMBER"
                  label="EMPLOYEE_SS_OR_BUSINESS"
                />
              </Col>
            </Row>

            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {t("I_HEREBY_AUTHORIZE_RELEASE_OF_BUSINESS")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {" "}
                {t("ALCOHOL_TESTS_WITH_A_RESULT")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {" "}
                {t("VERIFY_POSITIVE_DRUG_TESTS")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}> {t("REFUSALS_TO_BE_TESTED")}</p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {" "}
                {t("OTHER_VIOLATIONS_OF_DOT")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {" "}
                {t("INFORMATION_OBTAINED_FROM_PREVIOUS")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <p className={styles.paragraph}>
                {" "}
                {t("DOCUMENTATION_IF_ANY_OF_COMPLETION")}
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <Col>
                <h6>Signature</h6>
                <SignaturePad
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
            <Row className={styles.align__text_left}>
              <Col>
                <button onClick={clear}>{t("CLEAR")}</button>
              </Col>
            </Row>
            <Row className={styles.align__text_left}>
              <h4 className="mt-3">I-A</h4>
              <p className={styles.paragraph}>
                {t("NEW_EMPLOYER_NAME_NAUTTLUS")}
              </p>
              <p className={styles.paragraph}>{t("ADDRESS_MLK_BLVD")}</p>
              <p className={styles.paragraph}>{t("PHONE_#_(551)_430-1998")}</p>
              <p className={styles.paragraph}>Fax #: </p>
              <p className={styles.paragraph}>{t("DESIGNATED_EMPLOYER")}</p>
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
              <h6>{t("PLEASE_NOTE_THE_FOLLOWING_EMPLOYERS")} </h6>
            </Row>
            <Row className={styles.align__text_left}>
              <h4 className="mt-3">I-B</h4>
              <p className={styles.paragraph}>{t("CURRENT_COMPANY_NAME")}</p>
              <p className={styles.paragraph}>{t("ADDRESS:")}</p>
              <p className={styles.paragraph}>{t("PHONE_#_:")}</p>
              <p className={styles.paragraph}>{t("FAX_#_:")}</p>
              <p className={styles.paragraph}>
                {t("DESIGNATED_EMPLOYER_REPRESENTATIVE")}{" "}
              </p>
            </Row>
            <Row className={`${styles.align__text_left} ${styles.highlight}`}>
              <h6>{t("PLEASE_NOTE_THE_FOLLOWING")} </h6>
            </Row>
            <Row className={styles.blur}>
              <Row className={styles.align__text_left}>
                <Col>
                  <h3 className="mt-3">{t("SECTION_II")}</h3>
                </Col>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>{t("TO_BE_COMPLETED")}</p>
              </Row>
              <Row className={styles.align__text_left}>
                <Col>
                  <h4>{t("II_A_ACCIDENT_HISTORY")}</h4>
                </Col>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("THE_APPLICANT_NAMED_ABOVE")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("EMPLOYES_AS___________________________")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("DID_HE/SHE_DRIVE_MOTOR_VEHICLE")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("REASON_FOR_LEAVING_YOUR_EMPLOY")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>{t("IF_THERE_IS_NO_SAFETY")}</p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("THE_APPLICANT_NAMED_ABOVE_WAS")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {t("ACCIDENTAL_COMPLETE_THE_FOLLOWING")}
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  {" "}
                  Date Location # Injuries # Fatalities Hazmat Spill
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>1.</p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>2.</p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>3.</p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  Please provide information concerning any other accidents
                  involving the applicant that were reported to government
                  agencies or insurers or retained under internal company
                  policies:
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>Any other remarks:</p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  __________________________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <Col>
                  <h4>II-B. Drug and Alcohol History</h4>
                </Col>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  In the two years prior to the date of the employee’s signature
                  (in Section I), for DOT-regulated testing ~
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  1. Did the employee have alcohol tests with a result of 0.04
                  or higher? YES ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  2. Did the employee have verified positive drug tests? YES
                  ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  3. Did the employee refuse to be tested? YES ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  4. Did the employee have other violations of DOT agency drug
                  and alcohol testing regulations? YES ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  5. Did a previous employer report a drug and alcohol rule
                  violation to you? YES ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  6. If you answered “yes” to any of the above items, did the
                  employee complete the return-to-duty process? N/A ____ YES
                  ____ NO ____
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  NOTE: If you answered “yes” to item 5, you must provide the
                  previous employer’s report. If you answered “yes” to item 6,
                  you must also transmit the appropriate return-to-duty
                  documentation (e.g., SAP report(s), follow-up testing record).
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <Col>
                  <h4>II-C</h4>
                </Col>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  Name of person providing information in Section II-A & II-B:
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  _______________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  Title: ___________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  Phone #: ________________________________________
                </p>
              </Row>
              <Row className={styles.align__text_left}>
                <p className={styles.paragraph}>
                  Date: ___________________________________________
                </p>
              </Row>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>
            DISCLOSURE AND AUTHORIZATION REGARDING BACKGROUND INVESTIGATION FOR
            EMPLOYMENT PURPOSES.{" "}
          </Accordion.Header>
          <Accordion.Body>
            <Row className="mb-3">
              <h1>Nautilus Trucking</h1>
            </Row>
            <Row>
              <h3>
                DISCLOSURE AND AUTHORIZATION REGARDING BACKGROUND INVESTIGATION
                FOR EMPLOYMENT PURPOSES
              </h3>
            </Row>
            <Row className="mt-3 mb-3">
              <h6>DISCLOSURE</h6>
            </Row>
            <Row>
              <p className={styles.paragraph}>
                Nautilus Trucking (the “Company”) may request from a consumer
                reporting agency and for employment-related purposes, a
                “consumer report(s)” (commonly known as “background reports”)
                containing background information about you in connection with
                your employment, or application for employment, or engagement
                for services (including independent contractor or volunteer
                assignments, as applicable).
              </p>
            </Row>
            <Row>
              <p className={styles.paragraph}>
                The background report(s) may contain information concerning your
                character, general reputation, personal characteristics, mode of
                living, or credit standing. The types of background information
                that may be obtained include, but are not limited to: criminal
                history; litigation history; motor vehicle record and accident
                history; social security number verification; address and alias
                history; credit history; verification of your education,
                employment and earnings history; professional licensing,
                credential and certification checks; drug/alcohol testing
                results and history; military service; and other information.
              </p>
            </Row>
            <Row>
              <h6>AUTHORIZATION</h6>
            </Row>
            <Row>
              <p className={styles.paragraph}>
                I hereby authorize Nautilus Trucking to obtain the consumer
                reports described above about me.
              </p>
            </Row>
            <Row>
              <p className={styles.paragraph}>Applicant Name: Suvineet Singh</p>
            </Row>
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
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-3 mt-3 mb-3"
                required
                type="date"
                name="date"
                placeholder="DATE"
                label="Date"
                // formik={form}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP
            ONLINE SERVICE
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <h1>Nautilus Trucking</h1>
            </Row>
            <Row>
              <h3>
                IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP
                ONLINE SERVICE
              </h3>
            </Row>
            <Row>
              <h5>
                THE BELOW DISCLOSURE AND AUTHORIZATION LANGUAGE IS FOR MANDATORY
                USE BY ALL ACCOUNT HOLDERS
              </h5>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                In connection with your application for employment with Nautilus
                Trucking (“Prospective Employer”), Prospective Employer, its
                employees, agents or contractors may obtain one or more reports
                regarding your driving, and safety inspection history from the
                Federal Motor Carrier Safety Administration (FMCSA).
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                When the application for employment is submitted in person, if
                the Prospective Employer uses any information it obtains from
                FMCSA in a decision to not hire you or to make any other adverse
                employment decision regarding you, the Prospective Employer will
                provide you with a copy of the report upon which its decision
                was based and a written summary of your rights under the Fair
                Credit Reporting Act before taking any final adverse action. If
                any final adverse action is taken against you based upon your
                driving history or safety report, the Prospective Employer will
                notify you that the action has been taken and that the action
                was based in part or in whole on this report.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                When the application for employment is submitted by mail,
                telephone, computer, or other similar means, if the Prospective
                Employer uses any information it obtains from FMCSA in a
                decision to not hire you or to make any other adverse employment
                decision regarding you, the Prospective Employer must provide
                you within three business days of taking adverse action oral,
                written or electronic notification: that adverse action has been
                taken based in whole or in part on information obtained from
                FMCSA; the name, address, and the toll free telephone number of
                FMCSA; that the FMCSA did not make the decision to take the
                adverse action and is unable to provide you the specific reasons
                why the adverse action was taken; and that you may, upon
                providing proper identification, request a free copy of the
                report and may dispute with the FMCSA the accuracy or
                completeness of any information or report. If you request a copy
                of a driver’s record from the Prospective Employer who procured
                the report, then, within 3 business days of receiving your
                request, together with proper identification, the Prospective
                Employer must send or provide to you a copy of your report and a
                summary of your rights under the Fair Credit Reporting Act.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                Neither the Prospective Employer nor the FMCSA contractor
                supplying the crash and safety information has the capability to
                correct any safety data that appears to be incorrect. You may
                challenge the accuracy of the data by submitting a request to
                https://dataqs.fmcsa.dot.gov. If you challenge crash or
                inspection information reported by a State, FMCSA cannot change
                or correct this data. Your request will be forwarded by the
                DataQs system to the appropriate State for adjudication.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                Any crash or inspection in which you were involved will display
                on your PSP report. Since the PSP report does not report, or
                assign, or imply fault, it will include all Commercial Motor
                Vehicle (CMV) crashes where you were a driver or co-driver and
                where those crashes were reported to FMCSA, regardless of fault.
                Similarly, all inspections, with or without violations, appear
                on the PSP report. State citations associated with Federal Motor
                Carrier Safety Regulations (FMCSR) violations that have been
                adjudicated by a court of law will also appear, and remain, on a
                PSP report.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                The Prospective Employer cannot obtain background reports from
                FMCSA without your authorization.
              </p>
            </Row>
            <Row>
              <h5 className={`${styles.paragraph} ${styles.align__text_left}`}>
                AUTHORIZATION
              </h5>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                If you agree that the Prospective Employer may obtain such
                background reports, please read the following and sign below:
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                I authorize Nautilus Trucking (“Prospective Employer”) to access
                the FMCSA Pre-Employment Screening Program (PSP) system to seek
                information regarding my commercial driving safety record and
                information regarding my safety inspection history. I understand
                that I am authorizing the release of safety performance
                information including crash data from the previous five (5)
                years and inspection history from the previous three (3) years.
                I understand and acknowledge that this release of information
                may assist the Prospective Employer to decide regarding my
                suitability as an employee.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                I further understand that neither the Prospective Employer nor
                the FMCSA contractor supplying the crash and safety information
                has the capability to correct any safety data that appears to be
                incorrect. I understand I may challenge the accuracy of the data
                by submitting a request to https://dataqs.fmcsa.dot.gov. If I
                challenge crash or inspection information reported by a State,
                FMCSA cannot change or correct this data. I understand my
                request will be forwarded by the DataQs system to the
                appropriate State for adjudication.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                I understand that any crash or inspection in which I was
                involved will display on my PSP report. Since the PSP report
                does not report, or assign, or imply fault, I acknowledge it
                will include all CMV crashes where I was a driver or co-driver
                and where those crashes were reported to FMCSA, regardless of
                fault. Similarly, I understand all inspections, with or without
                violations, will appear on my PSP report, and State citations
                associated with FMCSR violations that have been adjudicated by a
                court of law will also appear, and remain, on my PSP report.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                I have read the above Disclosure Regarding Background Reports
                provided to me by Prospective Employer and I understand that if
                I sign this Disclosure and Authorization, Prospective Employer
                may obtain a report of my crash and inspection history. I hereby
                authorize Prospective Employer and its employees, authorized
                agents, and/or affiliates to obtain the information authorized
                above.
              </p>
            </Row>
            <Row>
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                Applicant Name: SUVINEET SINGH
              </p>
            </Row>
            <Row className={styles.align__text_left}>
              <Col>
                <h6>Signature</h6>
                <SignaturePad
                  className
                  ref={padRef}
                  canvasProps={{
                    width: 700,
                    height: 200,
                    style: { border: "1px solid black" },
                    className: "sigCanvas",
                  }}
                />
              </Col>
            </Row>
            <Row className={styles.align__text_left}>
              <Col>
                <button onClick={clear}>Clear</button>
              </Col>
            </Row>
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-3 mt-3 mb-3"
                required
                type="date"
                name="date"
                placeholder="DATE"
                label="Date"
                // formik={form}
              />
            </Row>
            <Row className="mt-4">
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                NOTICE: This form is made available to monthly account holders
                by NIC on behalf of the U.S. Department of Transportation,
                Federal Motor Carrier Safety Administration (FMCSA). Account
                holders are required by federal law to obtain an Applicant’s
                written or electronic consent prior to accessing the Applicant’s
                PSP report. Further, account holders are required by FMCSA to
                use the language contained in this Disclosure and Authorization
                form to obtain an Applicant’s consent. The language must be used
                in whole, exactly as provided. Further, the language on this
                form must exist as one stand-alone document. The language may
                NOT be included with other consent forms or any other language.
              </p>
            </Row>
            <Row className="mt-4">
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                NOTICE: The prospective employment concept referenced in this
                form contemplates the definition of “employee” contained at 49
                C.F.R. 383.5. LAST UPDATED 12/22/2015
              </p>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            GENERAL CONSENT FOR LIMITED QUERIES OF THE FMCSA DRUG AND ALCOHOL
            CLEARINGHOUSE
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <h1>Nautilus Trucking</h1>
            </Row>
            <Row>
              <h3>
                GENERAL CONSENT FOR LIMITED QUERIES OF THE FMCSA DRUG AND
                ALCOHOL CLEARINGHOUSE
              </h3>
            </Row>

            <Row>
              <p className={styles.paragraph}>
                Instructions: Section 382.703(a) of the Title 49 CFR, states “No
                employer may query the Clearinghouse to determine whether a
                record exists for any particular driver without first obtaining
                that driver’s written or electronic consent.” The type of
                consent required depends on the type of query. For a limited
                query, a general consent is required. This will be obtained
                outside the Clearinghouse. Employers may obtain a multi-year
                general consent from the driver for limited queries. For a full
                query, the driver must provide specific consent to the employer
                prior to each full query. This consent must be provided
                electronically within the Clearinghouse.
              </p>
            </Row>
            <Row>
              <BaseInput
                className="col-6 mt-3"
                name="name"
                placeholder="FULL NAME"
                formik={form}
              />
            </Row>

            <Row>
              <BaseInput
                className="col-6 mt-3"
                name="Employer's Name"
                placeholder="EMPLOYER's NAME"
                formik={form}
              />
            </Row>
            <Row>
              <BaseInput
                className="col-6 mt-3"
                name="cdl_license_number"
                placeholder="CDL LICENSE NUMBER"
                formik={form}
              />
            </Row>
            <Row>
              <BaseInput
                className="col-6 mt-3"
                name="expiration_date"
                type="date"
                placeholder="EXPIRATION DATE"
                formik={form}
              />
            </Row>
            <Row className="mt-4">
              <p className={`${styles.paragraph} ${styles.align__text_left}`}>
                I Suvineet Singh, hereby provide consent to Nautilus Trucking to
                conduct a limited query of the FMCSA Commercial Driver’s License
                Drug and Alcohol Clearinghouse (Clearinghouse) to determine
                whether drug or alcohol violation information about me exists in
                the Clearinghouse. My consent is for unlimited number of limited
                queries for my employment application processing and the
                duration of my employment with Nautilus Trucking. I understand
                that if the limited query conducted by Nautilus Trucking
                indicates that drug or alcohol violation information about me
                exists in the Clearinghouse, FMCSA will not disclose that
                information to Nautilus Trucking without first obtaining
                additional specific consent from me. I further understand that
                if I refuse to provide consent for Nautilus Trucking to conduct
                a limited query of the Clearinghouse, Nautilus Trucking must
                prohibit me from performing safety-sensitive functions,
                including driving a commercial motor vehicle, as required by
                FMCSA’s drug and alcohol program regulations.
              </p>
            </Row>
            <Row className={styles.align__text_left}>
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
            <Row className={styles.align__text_left}>
              <Col>
                <button onClick={clear}>Clear</button>
              </Col>
            </Row>
            <Row className={styles.align__text_left}>
              <BaseInput
                className="col-3 mt-3 mb-3"
                required
                type="date"
                name="date"
                placeholder="DATE"
                label="Date"
                // formik={form}
              />
            </Row>
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

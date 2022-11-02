import React, { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import { States } from "../../../../enums/users/us-states.enum";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";

export interface OtherQuesProps extends PageProps {}

// export function OtherQues(props: OtherQuesProps) {
//   useEffect(() => {
//     if (props.applicant && !form.dirty) form.setValues(props.applicant);
//   }, [props.applicant]);
//   const { t } = useTranslation();
//   const form = useFormik({
//     initialValues: {
//       manual_qualification: null,
//       endorsements_twic: null,
//     },
//     onSubmit: (values) => {
//       props.onNextClick(values);
//     },
//     onReset: (values) => {
//       props.onBackClick();
//     },
//   });
//   return (
//     <>
//       <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
//         <Row>
//           <BaseSelect
//             className="col-6 mb-3"
//             options={["Yes", "No"]}
//             name="manual_qualification"
//             placeholder="CHOOSE"
//             label="Are you qualified to drive a manual transmission per your CDL in case requires it?"
//             formik={form}
//           />
//         </Row>

//         <Row>
//           <BaseSelect
//             className="col-6 mb-3"
//             label="DRIVER_ENDORSEMENT"
//             placeholder="CHOOSE"
//             name="driver_endorsement"
//             required
//             labelPrefix="DriverEndorsement"
//             enumType={DriverEndorsement}
//             formik={form}
//           />
//         </Row>
//         <Row>
//           <p className={styles.paragraph__left}>
//             Tell us upto 3 Equipment Experience(optional)
//           </p>
//         </Row>
//         <Row>
//           <p className={styles.paragraph__left}>
//             Fill in as many of the following as relevant.
//           </p>
//         </Row>
//         <Row>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               name="cdl_number_1"
//               placeholder="CDL NUMBER 1"
//               label="CDL NUMBER"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseSelect
//               className="col-12 mt-3"
//               options={[
//                 "Alabama",
//                 "Alaska",
//                 "Nebraska",
//                 "California",
//                 "New Jersey",
//               ]}
//               name="state_1"
//               placeholder="ISSUANCE_STATE"
//               label="CHOOSE"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               type="date"
//               name="date_1"
//               placeholder="expiration_date"
//               label="DATE"
//               formik={form}
//             />
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               name="cdl_number_2"
//               placeholder="CDL NUMBER 2"
//               label="CDL NUMBER"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseSelect
//               className="col-12 mt-3"
//               options={[
//                 "Alabama",
//                 "Alaska",
//                 "Nebraska",
//                 "California",
//                 "New Jersey",
//               ]}
//               name="state_2"
//               placeholder="State of Issuance"
//               label="CHOOSE"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               type="date"
//               name="date_2"
//               placeholder="expiration_date"
//               label="DATE"
//               formik={form}
//             />
//           </Col>
//         </Row>

//         <Row>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               name="cdl_number_3"
//               placeholder="CDL NUMBER 3"
//               label="CDL NUMBER"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseSelect
//               className="col-12 mt-3"
//               options={[
//                 "Alabama",
//                 "Alaska",
//                 "Nebraska",
//                 "California",
//                 "New Jersey",
//               ]}
//               name="state_3"
//               placeholder="State of Issuance"
//               label="CHOOSE"
//               formik={form}
//             />
//           </Col>
//           <Col>
//             <BaseInput
//               className="col-12 mt-3"
//               type="date"
//               name="date_3"
//               placeholder="expiration_date"
//               label="DATE"
//               formik={form}
//             />
//           </Col>
//         </Row>

//         <Row className="mt-5">
//             <Col>
//               <Button className="float-right" type="reset">
//                 {t("BACK")}
//               </Button>
//             </Col>

//             <Col>
//               <Button className="float-left" type="submit">
//                 {t("NEXT")}
//               </Button>
//             </Col>
//         </Row>
//       </Form>
//     </>
//   );
// }
export function OtherQues({ onNextClick, onBackClick }: OtherQuesProps) {
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
  const form = useFormik({
    initialValues: {
      manual_qualification: null,
      endorsements_twic: null,
    },
    onSubmit: (values) => {
      onNextClick(values);
    },
    onReset: (values) => {
      onBackClick();
    },
  });
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
      <Row>
        <BaseSelect
          className="col-6 mb-3"
          options={["Yes", "No"]}
          name="manual_qualification"
          placeholder="CHOOSE"
          label="QUALIFIED_TO_MANUAL_DRIVING"
          formik={form}
        />
      </Row>

      <Row>
        <BaseSelect
          className="col-6 mb-3"
          label="ENDORSEMENT"
          placeholder="CHOOSE"
          name="driver_endorsement"
          labelPrefix="DriverEndorsement"
          enumType={DriverEndorsement}
          formik={form}
        />
      </Row>
      <Row>
        <p className={styles.paragraph__left}>
          {t("THREE_EQUIPMENT_EXPERIMENT")}
        </p>
      </Row>
      <Row>
        <p className={styles.paragraph__left}>{t("FILL_FOLLOWING_RELEVENT")}</p>
      </Row>
      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="cdl_number_1"
            placeholder="CDL_NUMBER_1"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_1"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_1"
            placeholder="expiration_date"
            label="DATE"
            formik={form}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="cdl_number_2"
            placeholder="CDL_NUMBER_2"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_2"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_2"
            placeholder="expiration_date"
            label="DATE"
            formik={form}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            name="cdl_number_3"
            placeholder="CDL_NUMBER_3"
            label="CDL_NUMBER"
            formik={form}
          />
        </Col>
        <Col>
          <BaseSelect
            className="col-12 mt-3"
            enumType={States}
            name="state_3"
            placeholder="ISSUANCE_STATE"
            label="CHOOSE"
            formik={form}
          />
        </Col>
        <Col>
          <BaseInput
            className="col-12 mt-3"
            type="date"
            name="date_3"
            placeholder="expiration_date"
            label="DATE"
            formik={form}
          />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Button className="float-right" type="reset">
            {t("BACK")}
          </Button>
        </Col>

        <Col>
          <Button className="float-left" type="submit">
            {t("NEXT")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

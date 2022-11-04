import React, { useContext, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import styles from "../../../../styles/jotform.module.css";
import * as yup from "yup";
import { Button, Col, Row } from "react-bootstrap";
import BaseInput from "../../base-input";
import BaseInputPhone from "../../base-input-phone";
import BaseSelect from "../../base-select";
import { useFormik } from "formik";
import { useTranslation } from "../../../../hooks/use-translation";
import { EducationLevel } from "../../../../enums/users/education-level.enum";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { HighestLevelEducationDto } from "../../../../models/jot-form/long-form/highest-level-education.dto";

// export interface HighestLevelEducationProps {
//   onNextClick: (any) => void;
//   onBackClick: () => void;
//   applicant: any;
// }

// export function HighestLevelEducation(props: HighestLevelEducationProps) {
//   useEffect(() => {
//     if (props.applicant && !form.dirty) form.setValues(props.applicant);
//   }, [props.applicant]);
//   const { t } = useTranslation();
//   const form = useFormik({
//     initialValues: {
//       options: null,
//     },
//     validationSchema: yup.object({
//       options: yup.string().required().nullable(),
//     }),
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
//             className="col-6"
//             required
//             options={[
//               "N/A",
//               "Some Schooling",
//               "GED",
//               "High School Diploma",
//               "Bachelors",
//               "Masters",
//             ]}
//             name="options"
//             placeholder="Click to choose"
//             label="Highest Level of Education"
//             formik={form}
//           />
//         </Row>

//         <Row className="mt-3">
//           <Col>
//             <Button className="float-right" type="reset">
//               {t("BACK")}
//             </Button>
//           </Col>

//           <Col>
//             <Button className="float-left" type="submit">
//               {t("NEXT")}
//             </Button>
//           </Col>
//         </Row>
//       </Form>
//     </>
//   );
// }
// export interface HighestLevelEducationProps {
//   onNextClick: (any) => void;
//   onBackClick: () => void;

export interface HighestLevelEducationProps extends PageProps {}

export function HighestLevelEducation() {
  const {
    state: { applicant, steps },
    method: { setApplicant, setSteps },
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
    initialValues: new HighestLevelEducationDto(),
    validationSchema: HighestLevelEducationDto.yupSchema(),
    onSubmit: (values) => {
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <h6 className={styles.carrierName__smaller}>
            {t("TELL_ABOUT_YOUR_EDUCATION")}
          </h6>
        </Row>
        <Row className={styles.align__text_left}>
          <BaseSelect
            className="col-6"
            required
            enumType={EducationLevel}
            name="education_level"
            placeholder="CHOOSE"
            label="EDUCATION_HIGHEST_LEVEL"
            labelPrefix="EducationLevel"
            formik={form}
          />
        </Row>

        <Row className="mt-3">
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
    </>
  );
}

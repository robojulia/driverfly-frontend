import { useFormik } from "formik";
import React, { useContext, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import { useTranslation } from "../../../../hooks/use-translation";
import * as yup from "yup";
import BaseCheck from "../../base-check";
import BaseInput from "../../base-input";
import { PageProps } from "../../../../types/jotform/page-props.type";
import jotformContext from "../../../../context/jotform-context";
import { AccidentHistoryDto } from "../../../../models/jot-form/voe-form/accident-history.dto";
// import { WorkedBeforeDto } from "../../../../models/jot-form/long-form/worked-before.dto";
import { ApplicantExtras } from "../../../../enums/applicants/applicant-extras.enum";
import { ApplicantExtrasEntity } from "../../../../models/applicant/applicant-extras.entity";
import styles from "../../../../styles/jotform.module.css";
import { ReasonsForLeavingEmployment } from "../../../../enums/users/reasons-for-leaving-employment";
import BaseSelect from "../../base-select";
import BaseTextArea from "../../base-text-area";

export interface AccidentHistoryProps extends PageProps {}

export function AccidentHistory() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, updateApplicantExtras, setSteps },
  } = useContext(jotformContext);

  const { t } = useTranslation();
  const form = useFormik({
    initialValues: new AccidentHistoryDto(),
    validationSchema: AccidentHistoryDto.yupSchema(),
    onSubmit: (values) => {
      const{TYPE_OF_VEHICLE} = values
      updateApplicantExtras(TYPE_OF_VEHICLE)
      updateApplicantExtras(TYPE_OF_VEHICLE)
      setSteps(steps + 1);
    },
    onReset: (values) => {
      setSteps(steps - 1);
    },
  });

  useEffect(() => {
    const apx = applicantExtras?.find(
      (v) => v.type === ApplicantExtras.TYPE_OF_VEHICLE
    );
    form.setValues({
      ...form.values,
      TYPE_OF_VEHICLE: !!apx?.type
        ? apx
        : new ApplicantExtrasEntity(ApplicantExtras.TYPE_OF_VEHICLE),
      type_of_vehicle: !!apx?.value,
    });
  }, [applicantExtras]);

  useEffect(() => {
    console.log("values", form.values);
    console.log("error", form.errors);
  }, [form.values, form.errors]);

  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
            <h4 className={ styles.carrierName__smaller }>
                {t("ACCIDENT_HISTORY")}
            </h4>
        </Row>
        <Row>
            <Col>
            <BaseInput
                className="col-9 mt-3" 
                name="was_employed_as"
                label={t("was_employed_as")}
                placeholder= {t("POSITION")}/>
            </Col>
            <Col>
            <BaseInput
                className="col-9 mt-3" 
                name="start_date"
                label={t("START_DATE")}
                type="date"
                placeholder= {t("mm/yy")}/>
            </Col>
            <Col>
            <BaseInput
                className="col-9 mt-3" 
                name="end_date"
                type="date"
                label={t("END_DATE")}
                placeholder= {t("mm/yy")}/>
            </Col>
        </Row>

        <Row className={`${styles.paragraph} ${ styles.align__text_left }`}>
        <BaseCheck
          className="float-left col-6 mt-3"
          name="type_of_vehicle"
          label={t("VOE_DRIVER_QUES")}
          formik={form}
        />
      </Row>
      {form.values.type_of_vehicle ? (
        <Row className={ styles.align__text_left }>
          <BaseTextArea
            className="float-left mt-3"
            name="TYPE_OF_VEHICLE.value"
            label={t("TYPE_OF_VEHICLE")}
            formik={ form }
          />
        </Row>
      ) :null}

      <Row>
        <BaseCheck
          className="float-left col-6 mt-3"
          name="safety_performance_history.value"
          label={t("SAFETY_PERFORMANCE_REPORT")}
          formik={ form }
        />
      </Row>
      {form.values?.safety_performance_history?.valueOf ? (
        <>
          <Row>
            <BaseCheck
              className="float-left col-6 mt-3"
              name="accident_register_data"
              label={t("ACCIDENT_REGISTER_DATA")}
              formik={ form }
            />
          </Row>
          {form.values.accident_register_data ? (
            <>
              <Row>
                <p className={ `${styles.paragraph } ${ styles.align__text_left }`}>
                  {t("VOE_ACCIDENT_NOTE")}
                </p>
              </Row>
              <Row>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="first_date"
                    type="date"
                    label={t("DATE")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="first_location"
                    label={t("LOCATION")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="first_injuries"
                    label={t("#INJURIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="first_fatalities"
                    label={t("#FATALITIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="first_spill"
                    label={t("#HAZMAT_SPILLS")}
                    />
                  </Col>
              </Row>

              <Row>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="second_date"
                    type="date"
                    label={t("DATE")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="second_location"
                    label={t("LOCATION")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="second_injuries"
                    label={t("#INJURIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="second_fatalities"
                    label={t("#FATALITIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="second_spill"
                    label={t("#HAZMAT_SPILLS")}
                    />
                  </Col>
              </Row>

              <Row>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="third_date"
                    type="date"
                    label={t("DATE")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="third_location"
                    label={t("LOCATION")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="third_injuries"
                    label={t("#INJURIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="third_fatalities"
                    label={t("#FATALITIES")}
                    />
                  </Col>
                  <Col>
                    <BaseInput
                    className="col-9 mt-3" 
                    name="third_spill"
                    label={t("#HAZMAT_SPILLS")}
                    />
                  </Col>
              </Row>

              <Row className={ styles.align__text_left }>
                <BaseTextArea
                  className="float-left col-6 mt-3"
                  name="other_reported_accidents"
                  label={t("OTHER_GOV_REPORTED_ACCIDENTS")}
                  formik={ form }
                 />
              </Row>
            </>
          ) : null}
        </>
      ) : null}


      <Row className={styles.align__text_left}>
      <BaseSelect
            className="col-4 mt-3"
            required
            enumType={ReasonsForLeavingEmployment}
            name="reasons_for_leaving_employment"
            placeholder={t("CHOOSE")}
            label={t("REASONS_FOR_LEAVING_EMPLOYMENT")}
            formik={form}
          />
      </Row>
      <Row className="mt-5">
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

import React, { useEffect } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { VehicleRouteType } from "../../../../enums/vehicles/vehicle-routes.enum";
import { useTranslation } from "../../../../hooks/useTranslation";
import BaseCheckList from "../../BaseCheckList";
import { useFormik } from "formik";
import { OtherRequirement } from "../../../../enums/users/other-requirements.enum";
export interface PreferenceProps {
  onNextClick: (any) => void;
  onBackClick: () => void;
  applicant: any;
}

export function Preferences(props: PreferenceProps) {
  useEffect(() => {
    if (props.applicant && !form.dirty) form.setValues(props.applicant);
  }, [props.applicant]);
  const { t } = useTranslation();
  const form = useFormik({
    initialValues: {
      routes_open_to: null,
      other_requirements: null,
    },
    onSubmit: (values) => {
      props.onNextClick(values);
    },
    onReset: (values) => {
      props.onBackClick();
    },
  });
  return (
    <>
      <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
        <Row>
          <Col>
            <BaseCheckList
              className="col-12"
              labelKey="ROUTES_OPEN_TO"
              name="routes_open_to"
              labelPrefix="JobEquipmentType"
              enumType={VehicleRouteType}
              formik={form}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseCheckList
              className="col-12"
              labelKey="ROUTES_OPEN_TO"
              name="routes_open_to"
              labelPrefix="JobEquipmentType"
              enumType={VehicleRouteType}
              formik={form}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseCheckList
              className="col-12"
              label="OTHER_REQUIREMENTS"
              name="other_requirements"
              labelPrefix="OtherRequirementType"
              enumType={OtherRequirement}
              formik={form}
            />
          </Col>
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
    </>
  );
}

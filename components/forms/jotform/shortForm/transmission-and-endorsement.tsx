import * as yup from "yup";
import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useFormik } from "formik";
import styles from "../../../../styles/digitalhiringapp.module.css";
import BaseSelect from "../../base-select";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import JotformContext, {
    JotFormContextType,
} from "../../../../context/jotform-context";
import BaseCheckList from "../../base-check-list";
import { BooleanType } from "../../../../enums/jotform/boolean-type.enum";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";

export function TransmissionAndEndorsement() {
    const {
        state: { applicant },
        method: { setApplicant, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {
            qualified_for_manual_transmission: null,
            endorsements: [],
        },
        validationSchema: yup.object({
            qualified_for_manual_transmission: yup.string().optional().nullable(),
            endorsements: yup
                .array((yup.string() as any).enum(DriverEndorsement))
                .optional()
                .nullable(),
        }),
        onSubmit: ({ endorsements, qualified_for_manual_transmission }) => {
            setApplicant({
                ...applicant,
                endorsements,
                transmission_type:
                    qualified_for_manual_transmission == BooleanType.YES
                        ? [VehicleTransmissionType.MANUAL]
                        : [],
            });
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffect(() => {
        const { endorsements, transmission_type } = applicant;

        form.setValues({
            ...form.values,
            qualified_for_manual_transmission: transmission_type?.includes(
                VehicleTransmissionType.MANUAL
            )
                ? BooleanType.YES
                : BooleanType.NO,
            endorsements: endorsements || [],
        });
    }, [applicant]);

    return (
        <>
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("TRANSMISSION_AND_ENDORSEMENT")}</h1>

        <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
            <Row>
                <BaseSelect
                    className={`${styles.bold} col-12 my-3`}
                    labelPrefix="BooleanType"
                    enumType={BooleanType}
                    name="qualified_for_manual_transmission"
                    placeholder="CHOOSE"
                    label="QUALIFIED_TO_MANUAL_DRIVING"
                    formik={form}
                />
                <p className="text-black mt-2 mb-2">
                    <strong>{t("PLEASE_SELECT_ENDORSEMENT")}</strong>
                </p>
                <BaseCheckList
                    className="col-12 text-black"
                    label="ENDORSEMENTS"
                    name="endorsements"
                    labelPrefix="DriverEndorsement"
                    enumType={DriverEndorsement}
                    formik={form}
                    cols="2"
                />
            </Row>
            <Row className="mt-4">
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

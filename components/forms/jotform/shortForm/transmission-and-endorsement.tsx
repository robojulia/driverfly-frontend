import * as yup from "yup";
import { useContext, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col, Row, Table } from "react-bootstrap";
import { useFormik } from "formik";
import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import JotformContext, {
    JotFormContextType,
} from "../../../../context/jotform-context";
import BaseCheckList from "../../base-check-list";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";
import { LicenseRestrictions } from "../../../../enums/applicants/applicant-license-restrictions-type.enum";
import BaseInput from "../../base-input";

export function TransmissionAndEndorsement() {
    const {
        state: { applicant },
        method: { setApplicant, stepNext, stepBack },
    }: JotFormContextType = useContext(JotformContext);

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {
            endorsements: [],
            transmission_type: [],
            license_restrictions: [],
            license_restrictions_other: null,
            endorsements_other: null,
        },
        validationSchema: yup.object({
            transmission_type: yup
                .array((yup.string() as any).enum(VehicleTransmissionType))
                .nullable(),
            endorsements: yup
                .array((yup.string() as any).enum(DriverEndorsement))
                .optional()
                .nullable(),
            license_restrictions: yup
                .array((yup.string() as any).enum(LicenseRestrictions))
                .nullable(),
            license_restrictions_other: yup
                .string().trim()
                .when("license_restrictions", {
                    is: v => v && v?.includes(LicenseRestrictions.OTHER),
                    then: yup.string()?.trim()?.required(),
                })
                .nullable(),
            endorsements_other: yup
                .string()
                .trim()
                .when("endorsements", {
                    is: v => v && v.includes(DriverEndorsement.OTHER),
                    then: yup.string().trim().required(),
                })
                .nullable(),
        }),
        onSubmit: ({ endorsements, endorsements_other, transmission_type, license_restrictions, license_restrictions_other }) => {
            setApplicant({
                ...applicant,
                endorsements,
                endorsements_other,
                transmission_type,
                license_restrictions,
                license_restrictions_other
            });
            stepNext();
        },
        onReset: (values) => {
            stepBack();
        },
    });

    useEffect(() => {
        const { endorsements, transmission_type, license_restrictions, license_restrictions_other, endorsements_other } = applicant;

        form.setValues({
            ...form.values,
            transmission_type,
            license_restrictions,
            license_restrictions_other,
            endorsements: endorsements || [],
            endorsements_other,
        });
    }, [applicant]);

    return (
        <>
            <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("TRANSMISSION_AND_ENDORSEMENT")}</h1>

            <Form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                <Row>
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
                    {form.values?.endorsements?.includes(
                        DriverEndorsement.OTHER
                    ) && (
                            <BaseInput
                                className="col-12"
                                label="OTHER_ENDORSEMENTS"
                                required
                                name="endorsements_other"
                                displayPlaceholder
                                formik={form}
                            />
                        )}
                    <BaseCheckList
                        className="col-12"
                        label="TRANSMISSION_EXPERIENCE"
                        name="transmission_type"
                        labelPrefix="VehicleTransmissionType"
                        enumType={VehicleTransmissionType}
                        formik={form}
                        cols="2"
                    />
                    <BaseCheckList
                        className="col-12 p-1 "
                        label="License_Restrictions"
                        name="license_restrictions"
                        labelPrefix="LicenseRestrictions"
                        enumType={LicenseRestrictions}
                        formik={form}
                        cols="2"
                    />
                    {form.values?.license_restrictions?.includes(
                        LicenseRestrictions.OTHER
                    ) && (
                            <BaseInput
                                className="col-12"
                                label="OTHER_LICENSE_RESTRICTIONS"
                                required
                                name="license_restrictions_other"
                                displayPlaceholder
                                formik={form}
                            />
                        )}
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

import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import { toast, ToastContainer } from "react-toastify";

import { useRouter } from "next/router";

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import React, { useState } from "react";
import ApplicantApi from "../../../api/applicant";
import { t } from "i18next";
import { Card, Col, Row } from "react-bootstrap";
import { CardBody, CardHeader } from "reactstrap";

import ViewDetails from "../../../../components/viewDetails/viewDetails";
import { useEffectAsync } from "../../../../utils/react";

import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

export default function Applicant() {
    const router = useRouter();

    let { id } = router.query;

    /**
     * @type {ApplicantEntity}
     */
    const APPLICANT_PROTO = {};

    const [ applicant, setApplicant ] = useState(APPLICANT_PROTO);

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const data = await api.company.getById(id);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("APPLICANT") }));
                return;
            }

            console.log(data);

            setApplicant(data);
        }
    }, [ id ]);



    return (
        <>
            <ToastContainer />
            <div>
                <h2>
                    <span style={{cursor: "pointer"}} onClick={router.back}>
                         <ArrowBackIosNew />
                         {t("GO_BACK")}
                    </span>
                </h2>
                <div className="container-fluid mt-2">
                    <Row>
                        <Col>
                            <Card>
                                <CardHeader>
                                     <strong>{applicant?.first_name} {applicant?.last_name}</strong>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="4" className="px-2">
                                            <ViewDetails
                                                obj={{
                                                    PHONE: applicant.phone,
                                                    EMAIL: applicant.email,
                                                    STREET: applicant.street,
                                                    CITY: applicant.city,
                                                    STATE_AND_ZIP: `${applicant.user?.state || ""} ${applicant.user?.zip_code || ""}`.trim()
                                                }}
                                                 />
                                        </Col>
                                        <Col md="4" className="px-2">
                                            <ViewDetails
                                                obj={{
                                                    driver_license_number: applicant.license_number,
                                                    expiration_date: applicant.license_expiry,
                                                    state_issued: applicant.license_state,
                                                    cdl_class_type: applicant.license_type ? t(`DriverLicenseType.${applicant.license_type}`) : null,
                                                    years_cdl_experience: applicant.years_cdl_experience,
                                                    equipment_experience: {
                                                        default: t("NONE"),
                                                        items: applicant.experiences?.map(v => ({
                                                            type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                            years: v.years
                                                        }))
                                                    },
                                                    owner_operator: { text: applicant.owner_operator, default: t("UNKNOWN") },
                                                    equipment_owned: {
                                                        show: applicant.owner_operator || false,
                                                        default: t("NONE"),
                                                        items: applicant.equipment?.map(v => ({
                                                            type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                                            quantity: v.quantity
                                                        }))
                                                    }
                                                }}
                                                 />
                                        </Col>
                                        <Col md="4" className="px-2">
                                            <ViewDetails
                                                obj={{
                                                    transmission_type: applicant.transmission_type,
                                                    ENDORSEMENTS: applicant.endorsements,
                                                    above_21: applicant.above_21,
                                                    highest_degree: applicant.highest_degree ? t(`DriverDegree.${applicant.highest_degree}`) : null,
                                                    emergency_contact: applicant.emergency_contact_name,
                                                    phone: applicant.emergency_contact_phone,
                                                    relationship: applicant.emergency_contact_relationship,
                                                    AUTHORIZED_TO_WORK_IN_THE_US: {
                                                        default: t("UNKNOWN"),
                                                        text: applicant.authorized_to_work_in_us
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="4">
                            <Card>
                                <CardHeader>{t("WORK_HISTORY")}</CardHeader>
                                <CardBody>
                                    <ViewDetails
                                        obj={{
                                            last_employer: null,
                                            date_employed: null,
                                            title: null,
                                            company_address: null,
                                            company_phone: null,
                                            can_contact: false,
                                            subject_to_fmcsa: true,
                                            safety_sensitive: true
                                        }}
                                        />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="8">
                            <Card>
                                <CardHeader>{t("SAFETY_BACKGROUND")}</CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="6">
                                            <ViewDetails
                                                obj={{
                                                    can_pass_drug_test: applicant.can_pass_drug_test,
                                                    past_duis: applicant.past_duis,
                                                    past_dui_years: applicant.past_dui_years,
                                                    criminal_history: applicant.criminal_history,
                                                    accidents: applicant.accidents,
                                                    accident_details: applicant.accident_details
                                                }}
                                                />
                                        </Col>
                                        <Col md="6">
                                            <ViewDetails
                                                obj={{
                                                    license_revoked: applicant.license_revoked,
                                                    violations: applicant.violations,
                                                    tickets: applicant.tickets,
                                                    failed_drug_test: applicant.failed_drug_test
                                                }}
                                                />
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </div>        </>
    );
}

Applicant.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

/**

 */
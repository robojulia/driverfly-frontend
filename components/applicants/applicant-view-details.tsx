import { Col, Row } from 'react-bootstrap';
import { useTranslation } from '../../hooks/useTranslation';
import React from 'react';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { calculateAge } from '../../utils/date';
import ViewCard from '../viewDetails/viewCard';
import ViewDetails from '../viewDetails/viewDetails';
import { ViewApplicantDetailProps } from '../../types/applicant/view-application-detail-props.type';


export default function ViewApplicantDetail({ applicant, protectedFields }: ViewApplicantDetailProps) {

    const { t } = useTranslation();
    
    return (
            <ViewCard title={`${applicant?.first_name} ${applicant?.last_name}`}>
                <Row>
                    <Col md="4" className="px-2">
                        <ViewDetails
                            default={t("NOT_ANSWERED")}
                            obj={{
                                ASSIGNED_TO: applicant.assignedUser?.name || t("NONE"),
                                PHONE: applicant.phone,
                                EMAIL: applicant.email,
                                STREET: applicant.street,
                                CITY: applicant.city,
                                STATE_AND_ZIP: `${applicant?.state || ""} ${applicant?.zip_code || ""}`.trim()
                            }}
                        />
                    </Col>
                    <Col md="4" className="px-2">
                        <ViewDetails
                            default={t("NOT_ANSWERED")}
                            obj={{
                                driver_license_number: protectedFields?.license_number ? applicant.license_number : t("HIDDEN"),
                                expiration_date: applicant.license_expiry,
                                state_issued: applicant.license_state,
                                cdl_class_type: applicant.license_type ? t(`DriverLicenseType.${applicant.license_type}`) : null,
                                years_cdl_experience: applicant.years_cdl_experience,
                                OWNER_OPERATOR: { text: applicant.is_owner_operator, default: t("UNKNOWN") },
                                AUTHORIZED_TO_WORK_IN_THE_US: applicant.authorized_to_work_in_us,
                                PREFERRED_LOCATION: applicant.preferred_location?.map(v => t(`JobGeography.${v}`))

                            }}
                        />
                    </Col>
                    <Col md="4" className="px-2">
                        <ViewDetails
                            default={t("NOT_ANSWERED")}
                            obj={{
                                transmission_type: applicant.transmission_type?.map(v => t(`VehicleTransmissionType.${v}`)),
                                ENDORSEMENTS: applicant.endorsements?.map(v => t(`DriverEndorsement.${v}`)),
                                above_21: applicant.birthdate ? calculateAge(applicant.birthdate) >= 21 : null,
                                highest_degree: applicant.highest_degree ? t(`EducationLevel.${applicant.highest_degree}`) : null,
                                emergency_contact: applicant.emergency_contact_name,
                                phone: applicant.emergency_contact_number,
                                relationship: applicant.emergency_contact_relationship,
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col md="6">
                        <ViewDetails
                            default={t("NONE")}
                            obj={{
                                equipment_experience: {
                                    items: applicant.equipment_experience?.map(v => ({
                                        type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                        years: v.years
                                    }))
                                },
                            }}
                        />
                    </Col>
                    <Col md="6">
                        {
                            applicant.is_owner_operator &&
                            <ViewDetails
                                default={t("NONE")}
                                obj={{
                                    equipment_owned: {
                                        show: applicant.is_owner_operator || false,
                                        items: applicant.equipment_owned?.map(v => ({
                                            type: v.type == JobEquipmentType.OTHER ? v.type_other : t(`JobEquipmentType.${v.type}`),
                                            quantity: v.quantity
                                        }))
                                    }
                                }}
                            />
                        }

                    </Col>
                </Row>
            </ViewCard>
    )
}

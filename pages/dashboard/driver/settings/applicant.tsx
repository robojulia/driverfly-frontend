import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import BaseInputPhone from "../../../../components/forms/base-input-phone";

import { ApplicantDocumentType } from "../../../../enums/applicants/applicant-document-type.enum";
import { LicenseRestrictions } from "../../../../enums/applicants/applicant-license-restrictions-type.enum";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";
import { ApplicantEmployerEntity } from "../../../../models/applicant/applicant-employer.entity";
import { ApplicantEquipmentEntity } from "../../../../models/applicant/applicant-equipment.entity";
import { ApplicantExperienceEntity } from "../../../../models/applicant/applicant-experience.entity";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../../../models/documents/document.entity";


import ApplicantApi from "../../../api/applicant";

import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { ChevronUp, DashCircle, PlusCircle, XCircle } from "react-bootstrap-icons";
import BaseCheck from "../../../../components/forms/base-check";
import BaseCheckList from "../../../../components/forms/base-check-list";
import BaseInput from "../../../../components/forms/base-input";
import BaseSelect from "../../../../components/forms/base-select";
import BaseTextArea from "../../../../components/forms/base-text-area";
import FileInput from "../../../../components/forms/file-input";
import StateSelect from "../../../../components/forms/state-select";
import ViewCard from "../../../../components/view-details/view-card";

import { useTranslation } from "../../../../hooks/use-translation";
import { useUnsavedChangesWarning } from "../../../../hooks/use-unsaved-changes-warning";

import { useFormik } from "formik";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { useEffectAsync } from "../../../../utils/react";

export default function Applicant() {
    const { t } = useTranslation();
    const api = new ApplicantApi();

    const [applicant, setApplicant] = useState<ApplicantEntity>()

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchema(),
        onSubmit: async (values) => {
            if ("jobs" in values)
                delete values.jobs;

            try {
                values = await api.me.update(values);
                setApplicant(values)

                toast.success(t("successfully_saved_information"));
                // Reset dirty state after successful save to prevent unsaved changes warning
                form.resetForm({ values });

                // router.push(`/dashboard/driver/settings/applicant`);
            } catch (e) {
                console.error("Unable to save applicant info", e);
                toast.error(t("unable_to_save_information"));
            }
        }
    });

    useEffectAsync(async () => {
        const data = await api.me.get();

        data.equipment_experience.forEach((equipmentExp) => {
            if (!Number.isInteger(equipmentExp)) {
                equipmentExp.months = Math.round((equipmentExp.years % 1) * 12);
                equipmentExp.years = Math.floor(equipmentExp.years);
            }
        });

        form.setValues({
            ...form.values,
            ...data,
        });
        setApplicant(data)
    }, []);

    const today = new Date()
    const OldThan18Year = new Date((today.getFullYear() - 18), today.getMonth(), today.getDate()).toISOString().split("T")[0]

    // Warn user about unsaved changes when navigating away
    const unsavedChangesWarning = useUnsavedChangesWarning({
        isDirty: form.dirty,
        shouldWarn: !form.isSubmitting,
    });

    return (<>
        {unsavedChangesWarning}
        <ToastContainer />
        <form onSubmit={form.handleSubmit}>
            <Row>
                <Col xs="8">
                    <Alert variant="info">
                        {t("APPLICANT_INFO_DESCRIPTION")}
                    </Alert>
                </Col>
                <Col xs="4">
                    <div style={{ float: "right" }}>
                        <Button variant="primary" type="submit" disabled={form.isSubmitting || !form.isValid || form.isValidating}>{t("SAVE")}</Button>
                        {/* <ApplicantResume
                            className={' ml-1'}
                            applicant={applicant}
                            disabled={form.isSubmitting || !form.isValid || form.isValidating} /> */}
                    </div>
                </Col>
            </Row>
            <Row className="mt-2">
                <Col>
                    <ViewCard title="BASIC_DETAILS">
                        <Row>
                            <Col md="4" className="px-2">
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="FIRST_NAME"
                                    required
                                    readOnly
                                    name="first_name"
                                    placeholder="FIRST_NAME"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="LAST_NAME"
                                    required
                                    readOnly
                                    name="last_name"
                                    placeholder="LAST_NAME"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="BIRTHDATE"
                                    type="date"
                                    name="birthdate"
                                    placeholder="MM/DD/YYYY"
                                    formik={form}
                                    max={OldThan18Year}
                                />

                                <BaseInputPhone
                                    className="col-12 p-1 "
                                    label="PHONE"
                                    name="phone"
                                    readOnly
                                    placeholder={t("PHONE")}
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="EMAIL"
                                    required
                                    readOnly
                                    type="email"
                                    name="email"
                                    placeholder="EMAIL"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="STREET"
                                    name="street"
                                    placeholder="STREET"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="CITY"
                                    name="city"
                                    placeholder="CITY"
                                    formik={form}
                                />
                                <Row>
                                    <StateSelect
                                        className="col-12 pl-3 pr-3 p-1"
                                        label="STATE"
                                        name="state"
                                        placeholder="STATE"
                                        formik={form}
                                    />
                                    <BaseInput
                                        className="col-12 pl-3 pr-3 p-1"
                                        label="ZIP_CODE"
                                        name="zip_code"
                                        placeholder="ZIP_CODE"
                                        formik={form}
                                    />
                                </Row>
                            </Col>
                            <Col md="4" className="px-2">
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="driver_license_number"
                                    name="license_number"
                                    placeholder="driver_license_number"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="LICENSE_EXPIRY"
                                    name="license_expiry"
                                    type="date"
                                    placeholder="expiration_date"
                                    formik={form}
                                />
                                <Row>
                                    <StateSelect
                                        className="col-6 pl-3"
                                        label="state_issued"
                                        name="license_state"
                                        placeholder="state_issued"
                                        formik={form}
                                    />
                                    <BaseSelect
                                        className="col-6 pl-3"
                                        label="CDL_CLASS"
                                        name="license_type"
                                        displayPlaceholder
                                        labelPrefix="DriverLicenseType"
                                        enumType={DriverLicenseType}
                                        formik={form}
                                    />
                                </Row>
                                <BaseInput
                                    className="col-12 p-1 "
                                    label="years_cdl_experience"
                                    name="years_cdl_experience"
                                    type="number"
                                    placeholder="years_cdl_experience"
                                    formik={form}
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
                                <BaseCheck
                                    className="col-12 p-1  mt-2"
                                    label="OWNER_OPERATOR"
                                    name="is_owner_operator"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 p-1  mt-2"
                                    label="AUTHORIZED_TO_WORK_IN_THE_US"
                                    name="authorized_to_work_in_us"
                                    formik={form}
                                />
                                <BaseCheckList
                                    className="col-12 mt-2 preferred_location"
                                    label="PREFERRED_LOCATION"
                                    name="preferred_location"
                                    formik={form}
                                    labelPrefix="JobGeography"
                                    enumType={JobGeography}
                                />
                            </Col>
                            <Col md="4" className="px-2">
                                <BaseCheckList
                                    className="col-12 p-1 "
                                    label="TRANSMISSION_EXPERIENCE"
                                    name="transmission_type"
                                    labelPrefix="VehicleTransmissionType"
                                    enumType={VehicleTransmissionType}
                                    formik={form}
                                    cols="2"
                                />
                                <BaseCheckList
                                    className="col-12 p-1 "
                                    label="ENDORSEMENTS"
                                    name="endorsements"
                                    labelPrefix="DriverEndorsement"
                                    enumType={DriverEndorsement}
                                    formik={form}
                                    cols="2"
                                />
                                <BaseSelect
                                    className="col-12 p-1 "
                                    label="HIGHEST_DEGREE"
                                    name="highest_degree"
                                    placeholder="HIGHEST_DEGREE"
                                    formik={form}
                                    labelPrefix="EducationLevel"
                                    enumType={EducationLevel}
                                />
                                <Col xs="12" className='mt-2 p-0'>
                                    <ViewCard title="EMERGENCY_CONTACT">
                                        <BaseInput
                                            className="col-12 p-1 "
                                            name={`emergency_contact_name`}
                                            label="NAME"
                                            placeholder="FULL_NAME"
                                            formik={form}
                                        />


                                        <BaseInputPhone
                                            className="col-12 p-1 "
                                            name={`emergency_contact_number`}
                                            label="PHONE"
                                            placeholder="PHONE"
                                            formik={form}
                                        />
                                        <BaseInput
                                            className="col-12 p-1 "
                                            name={`emergency_contact_relationship`}
                                            label="RELATIONSHIP"
                                            placeholder="RELATIONSHIP"
                                            formik={form}
                                        />

                                    </ViewCard>
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6" className="p-0 mt-2">
                                <Col xs="12" className="p-2">
                                    <ViewCard
                                        title="equipment_experience"
                                        actions={<Button size='sm' onClick={() => form.setValues({
                                            ...form.values,
                                            equipment_experience: [
                                                ...(form.values.equipment_experience || []),
                                                new ApplicantExperienceEntity()
                                            ]
                                        })}><PlusCircle /> {t("ADD")}</Button>}
                                    >
                                        {
                                            form.values.equipment_experience?.length > 0 &&
                                            <>
                                                {form.values
                                                    .equipment_experience
                                                    .map((entity, i) => (
                                                        <Row key={i}>
                                                            <Col xs="12" className='d-sm-flex'>
                                                                <Col className="col-lg-4 col-4 d-inline-block"><strong>{t("TYPE")}</strong></Col>
                                                                <Col className="col-lg-4 col-4 d-inline-block"><strong>{t("YEARS")}</strong></Col>
                                                                <Col className="col-lg-4 col-4 d-inline-block"><strong>{t("MONTHS")}</strong></Col>
                                                            </Col>
                                                            <Col xs="4">
                                                                <BaseSelect
                                                                    name={`equipment_experience[${i}].type`}
                                                                    placeholder="TYPE"
                                                                    labelPrefix="JobEquipmentType"
                                                                    enumType={JobEquipmentType}
                                                                    formik={form}
                                                                />
                                                            </Col>
                                                            <Col xs="4">
                                                                <BaseInput
                                                                    name={`equipment_experience[${i}].years`}
                                                                    placeholder="YEARS"
                                                                    type="int"
                                                                    min="1"
                                                                    formik={form}
                                                                />
                                                            </Col>
                                                            <Col xs="3">
                                                                <BaseInput
                                                                    name={`equipment_experience[${i}].months`}
                                                                    placeholder="MONTHS"
                                                                    type="int"
                                                                    min="0"
                                                                    max="11"
                                                                    formik={form}
                                                                />
                                                            </Col>
                                                            {
                                                                entity.type == JobEquipmentType.OTHER &&
                                                                <Col xs="11">
                                                                    <BaseInput
                                                                        name={`equipment_experience[${i}].type_other`}
                                                                        placeholder="TYPE"
                                                                        formik={form}
                                                                    />
                                                                </Col>
                                                            }
                                                            <Col xs="1" className="p-0 mt-2">
                                                                <a href="#" onClick={() => form.setValues({
                                                                    ...form.values,
                                                                    equipment_experience: form.values.equipment_experience.filter((v, idx) => i != idx)
                                                                })}><DashCircle color="red" /></a>
                                                            </Col>
                                                            <Col xs="12">
                                                                <hr />
                                                            </Col>

                                                        </Row>
                                                    ))}
                                            </>
                                        }
                                    </ViewCard>
                                </Col>
                            </Col>
                            <Col md="6" className="p-2">
                                {
                                    form.values.is_owner_operator &&
                                    <Col xs="12" className="p-0">
                                        <ViewCard
                                            title="EQUIPMENT_OWNED"
                                            actions={<Button size='sm' onClick={() => form.setValues({
                                                ...form.values,
                                                equipment_owned: [
                                                    ...form.values.equipment_owned,
                                                    new ApplicantEquipmentEntity()
                                                ]
                                            })}><PlusCircle /> {t("ADD")}</Button>}
                                        >
                                            {
                                                form.values.equipment_owned.length > 0 &&
                                                <>
                                                    <Row className='d-sm-none d-md-flex'>
                                                        <Col><strong>{t("TYPE")}</strong></Col>
                                                        <Col><strong>{t("QUANTITY")}</strong></Col>
                                                    </Row>
                                                    {form.values
                                                        .equipment_owned
                                                        .map((entity, i) => (
                                                            <Row key={i}>
                                                                <Col xs="6">
                                                                    <BaseSelect
                                                                        name={`equipment_owned[${i}].type`}
                                                                        placeholder="TYPE"
                                                                        labelPrefix="JobEquipmentType"
                                                                        enumType={JobEquipmentType}
                                                                        formik={form}
                                                                    />
                                                                </Col>
                                                                <Col xs="5">
                                                                    <BaseInput
                                                                        name={`equipment_owned[${i}].quantity`}
                                                                        placeholder="QUANTITY"
                                                                        type="int"
                                                                        min="1"
                                                                        formik={form}
                                                                    />
                                                                </Col>
                                                                {
                                                                    entity.type == JobEquipmentType.OTHER &&
                                                                    <Col xs="11">
                                                                        <BaseInput
                                                                            name={`equipment_owned[${i}].type_other`}
                                                                            placeholder="TYPE"
                                                                            formik={form}
                                                                        />
                                                                    </Col>
                                                                }
                                                                <Col xs="1" className="p-0 mt-2">
                                                                    <a href="#" onClick={() => form.setValues({
                                                                        ...form.values,
                                                                        equipment_owned: form.values.equipment_owned.filter((v, idx) => i != idx)
                                                                    })}><DashCircle color="red" /></a>
                                                                </Col>
                                                                <Col xs="12">
                                                                    <hr />
                                                                </Col>

                                                            </Row>
                                                        ))}
                                                </>
                                            }
                                        </ViewCard>
                                    </Col>
                                }
                            </Col>

                        </Row>
                    </ViewCard>
                </Col>
            </Row>
            <Row>
                <Col md="4">
                    <ViewCard
                        title="WORK_HISTORY"
                        actions={<Button size='sm' onClick={() => form.setValues({
                            ...form.values,
                            employers: [
                                ...(form.values.employers || []),
                                new ApplicantEmployerEntity()
                            ]
                        })}><PlusCircle /> {t("ADD")}</Button>}
                    >
                        {!form.values.employers?.length &&
                            t("NONE")
                        }
                        {form.values.employers?.map((e, i) => {

                            const meta = form.getFieldMeta(`employers[${i}]`);

                            const hasError = Object.keys(e || {}).some(v => form.getFieldMeta(`employers[${i}].${v}`).error);
                            return (
                                <Accordion
                                    key={i}
                                    defaultExpanded={i == 0 || !meta.touched || hasError}
                                    expanded={hasError || undefined}
                                >
                                    <AccordionSummary
                                        expandIcon={<ChevronUp />}
                                    >
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="danger"
                                            onClick={v => form.setValues({
                                                ...form.values,
                                                employers: form.values.employers.filter((v, idx) => idx != i),
                                            })}
                                        >
                                            <XCircle /> {t("REMOVE")}
                                        </Button>
                                        <span style={{ marginLeft: "10px" }} >{e.name || t("NEW_EMPLOYER")}</span>

                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Row>
                                            <BaseInput
                                                className="col-12 p-1 "
                                                name={`employers[${i}].name`}
                                                label="NAME"
                                                required
                                                placeholder="COMPANY_NAME"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6 p-1"
                                                name={`employers[${i}].start_at`}
                                                label="DATES_EMPLOYED"
                                                max={new Date().toISOString().split("T")[0]}
                                                type="date"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6 p-1"
                                                name={`employers[${i}].end_at`}
                                                label="THROUGH_OPTIONAL"
                                                type="date"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12 p-1 "
                                                name={`employers[${i}].title`}
                                                label="TITLE"
                                                placeholder="TITLE"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12 p-1 "
                                                name={`employers[${i}].street`}
                                                label="STREET"
                                                placeholder="STREET"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12 p-1 "
                                                name={`employers[${i}].city`}
                                                label="CITY"
                                                placeholder="CITY"
                                                formik={form}
                                            />
                                            <StateSelect
                                                className="col-6 p-1"
                                                name={`employers[${i}].state`}
                                                label="STATE"
                                                placeholder="STATE"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6 p-1"
                                                name={`employers[${i}].zip_code`}
                                                label="ZIP_CODE"
                                                placeholder="ZIP_CODE"
                                                formik={form}
                                            />

                                            <BaseInputPhone
                                                className="col-12 p-1 "
                                                name={`employers[${i}].phone`}
                                                label="PHONE"
                                                placeholder="PHONE"
                                                formik={form}
                                            />
                                            <BaseCheck
                                                className="col-12 p-1  mt-2"
                                                name={`employers[${i}].can_contact`}
                                                label="MAY_CONTACT_COMPANY"
                                                formik={form}
                                            />
                                            <BaseCheck
                                                className="col-12 p-1  mt-2"
                                                name={`employers[${i}].is_subject_to_fmcsrs`}
                                                label="SUBJECT_TO_FMCSRS"
                                                formik={form}
                                            />
                                            <BaseCheck
                                                className="col-12 p-1  mt-2"
                                                name={`employers[${i}].is_subject_to_drug_tests`}
                                                label="JOB_DESIGNATED_AS_SATEFY_SENSITIVE"
                                                formik={form}
                                            />
                                        </Row>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        })}
                    </ViewCard>
                </Col>
                <Col md="8">
                    <ViewCard title="SAFETY_BACKGROUND">
                        <Row>
                            <Col md="6">
                                <BaseCheck
                                    className="col-12 p-1 mt-2"
                                    label="CAN_PASS_DRUG_TEST"
                                    name="can_pass_drug_test"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 p-1 mt-2"
                                    label="HAS_DUIS"
                                    name="has_past_dui"
                                    formik={form}
                                />
                                {
                                    form.values.has_past_dui &&
                                    <Col xs="12" className='mt-2 p-0'>
                                        <ViewCard
                                            title="PAST_DUIS"
                                            actions={<Button size='sm' onClick={() => form.setValues({
                                                ...form.values,
                                                dui_years: [
                                                    ...(form.values.dui_years || []),
                                                    ""
                                                ]
                                            })}><PlusCircle /> {t("ADD")}</Button>}
                                        >
                                            {
                                                form.values.dui_years?.length > 0 &&

                                                <Table striped>
                                                    <thead>
                                                        <tr>
                                                            <th colSpan={2}>{t("YEAR")}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {form.values
                                                            .dui_years
                                                            .map((entity, i) => (
                                                                <tr key={i}>
                                                                    <td className='w-100'>
                                                                        <BaseInput
                                                                            name={`dui_years[${i}]`}
                                                                            placeholder="YEAR"
                                                                            type="int"
                                                                            required
                                                                            value={entity}
                                                                            min={new Date().getFullYear() - 5}
                                                                            max={new Date().getFullYear()}
                                                                            formik={form}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <a href="#" onClick={() => form.setValues({
                                                                            ...form.values,
                                                                            dui_years: form.values.dui_years.filter((v, idx) => i != idx)
                                                                        })}><DashCircle color="red" /></a>
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </Table>
                                            }
                                        </ViewCard>
                                    </Col>
                                }
                                <BaseTextArea
                                    className="col-12 p-1  mt-2"
                                    label="criminal_history_last_3_years"
                                    name="criminal_history"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 p-1  mt-2"
                                    label="accidents_last_5_years"
                                    name="accident_count"
                                    type="int"
                                    min="0"
                                    formik={form}
                                />
                                {
                                    form.values.accident_count > 0 &&
                                    <BaseTextArea
                                        className="col-12 mt-2 p-0"
                                        label="accident_details"
                                        name="accident_details"
                                        formik={form}
                                    />
                                }
                            </Col>
                            <Col md="6">
                                <Row className="m-lg-0 m-0">
                                    <BaseCheck
                                        className="col-12 p-1 mt-2"
                                        label="has_had_license_revoked"
                                        name="license_revoked"
                                        formik={form}
                                    />
                                    {
                                        form.values.license_revoked &&
                                        <BaseTextArea
                                            className="col-12 p-1  mt-2"
                                            label="details"
                                            name="license_revoked_details"
                                            formik={form}
                                        />
                                    }
                                    <BaseCheck
                                        className="col-12 p-1  mt-2"
                                        label="has_had_psp_violations"
                                        name="psp_violations"
                                        formik={form}
                                    />
                                    {
                                        form.values.psp_violations &&
                                        <BaseTextArea
                                            className="col-12 p-1  mt-2"
                                            label="details"
                                            name="violations_details"
                                            formik={form}
                                        />
                                    }
                                    <BaseCheck
                                        className="col-12 p-1  mt-2"
                                        label="has_had_tickets_last_5_years"
                                        name="tickets"
                                        formik={form}
                                    />
                                    {
                                        form.values.tickets &&
                                        <>
                                            <BaseInput
                                                className="col-12 p-1  mt-2"
                                                label="COUNT"
                                                name="tickets_count"
                                                type="int"
                                                min="0"
                                                formik={form}
                                            />
                                            <BaseTextArea
                                                className="col-12 p-1  mt-2"
                                                label="details"
                                                name="tickets_details"
                                                formik={form}
                                            />
                                        </>
                                    }
                                    <BaseCheck
                                        className="col-12 p-1  mt-2"
                                        label="HAS_HAD_INFRACTIONS_LAST_5_YEARS"
                                        name="infractions"
                                        formik={form}
                                    />
                                    {
                                        form.values.infractions &&
                                        <>
                                            <BaseInput
                                                className="col-12 p-1  mt-2"
                                                label="COUNT"
                                                name="infractions_count"
                                                type="int"
                                                min="0"
                                                formik={form}
                                            />
                                            <BaseTextArea
                                                className="col-12 p-1  mt-2"
                                                label="details"
                                                name="infractions_details"
                                                formik={form}
                                            />
                                        </>
                                    }
                                    <BaseCheck
                                        className="col-12 p-1  mt-2"
                                        label="HAS_HAD_MOVING_VIOLATIONS_LAST_3_YEARS"
                                        name="moving_violations"
                                        formik={form}
                                    />
                                    {
                                        form.values.moving_violations &&
                                        <>
                                            <BaseInput
                                                className="col-12 p-1  mt-2"
                                                label="COUNT"
                                                name="moving_violations_count"
                                                type="int"
                                                min="0"
                                                formik={form}
                                            />
                                            <BaseTextArea
                                                className="col-12 p-1  mt-2"
                                                label="details"
                                                name="moving_violations_details"
                                                formik={form}
                                            />
                                        </>
                                    }
                                    <BaseCheck
                                        className="col-12 p-1  mt-2"
                                        label="has_had_positive_drug_test"
                                        name="positive_drug_test"
                                        formik={form}
                                    />
                                    {
                                        form.values.positive_drug_test &&
                                        <BaseTextArea
                                            className="col-12 p-1  mt-2"
                                            label="details"
                                            name="positive_drug_test_details"
                                            formik={form}
                                        />
                                    }
                                </Row>
                            </Col>
                        </Row>
                    </ViewCard>
                </Col>
            </Row>
            <Row>
                <Col className="col-md-12 col-lg-8">
                    <ViewCard
                        title="UPLOADED_DOCUMENTS"
                        actions={<Button size='sm'
                            disabled={form.values.documents?.length == Object.keys(ApplicantDocumentType).length}
                            onClick={() => form.setValues({
                                ...form.values,
                                documents: [
                                    ...(form.values.documents || []),
                                    new DocumentEntity()
                                ]
                            })}><PlusCircle /> {t("ADD")}</Button>}
                    >
                        {!form.values.documents?.length &&
                            t("NONE")
                        }
                        {
                            form.values.documents?.length > 0 &&
                            <>
                                <Row className="p-1">
                                    {form.values
                                        .documents
                                        .map((entity, i) => (
                                            <Row key={i} className="my-2 pr-0">
                                                <Col md="5" className="pr-0">
                                                    {t("DOCUMENT")}
                                                    <BaseSelect
                                                        name={`documents[${i}].type`}
                                                        required
                                                        placeholder="TYPE"
                                                        labelPrefix="ApplicantDocumentType"
                                                        enumType={ApplicantDocumentType}
                                                        formik={form}
                                                    />
                                                </Col>
                                                <Col md="6" className="pr-0">
                                                    {t("TYPE")}
                                                    <FileInput
                                                        name={`documents[${i}]`}
                                                        required
                                                        accept="application/pdf"
                                                        allowedSizeInByte={3145728}
                                                        formik={form}
                                                    />
                                                </Col>

                                                <div className="col-md-1 mt-lg-4 mt-md-4 mt-2 text-right p-0">
                                                    <a href="#" onClick={() => form.setValues({
                                                        ...form.values,
                                                        documents: form.values.documents.filter((v, idx) => i != idx)
                                                    })}><DashCircle color="red" /></a>
                                                </div>

                                                <Col xs="12">
                                                    <hr />
                                                </Col>
                                            </Row>
                                        ))}
                                </Row>

                            </>
                        }
                    </ViewCard>
                </Col>
            </Row>
        </form>
    </>);
}

Applicant.getLayout = function (page) {
    return (
        <FullLayout>{page}</FullLayout>
    );
};
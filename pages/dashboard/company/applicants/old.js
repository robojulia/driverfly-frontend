import { Plus, ArrowsExpand, ChevronUp, Pencil, PlusCircle, DashCircle, XCircle, BookmarkCheck, BookmarkDash } from 'react-bootstrap-icons';
import { toast } from "react-toastify";

import { useRouter } from "next/router";
import Link from 'next/link';

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import React, { useEffect, useState } from "react";
import ApplicantApi from "../../../api/applicant";
import DocumentApi from "../../../api/document";
import JobApi from "../../../api/job";
import { Button, ButtonGroup, Col, Row, Table } from "react-bootstrap";
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import ViewDetails from "../../../../components/viewDetails/viewDetails";
import { useEffectAsync } from "../../../../utils/react";

import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

import { calculateAge, dateRange } from "../../../../utils/date";
import { buildAddress } from "../../../../utils/common";
import { ApplicantStatus } from "../../../../enums/applicants/applicant-status.enum";
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { VehicleTransmissionType } from '../../../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../../../enums/users/driver-endorsement.enum';
import { EducationLevel } from "../../../../enums/users/education-level.enum";

import ShowEnumFromString from "../../../../components/enum-filters/show-enum-from-string";
import ViewTable from "../../../../components/viewDetails/viewTable";
import ViewPdf from "../../../../components/viewDetails/viewPdf";
import ViewCard from "../../../../components/viewDetails/viewCard";
import { useTranslation } from "../../../../hooks/useTranslation";

import { useFormik } from "formik";
import * as yup from "yup";
import * as yupUtils from "../../../../utils/yup";
import ViewModal from "../../../../components/viewDetails/viewModal";
import BaseTextArea from "../../../../components/forms/BaseTextArea";
import { DocumentEntity } from "../../../../models/documents/document.entity";

import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";
import useAuth from '../../../../hooks/useAuth';
import BaseInput from '../../../../components/forms/BaseInput';
import BaseSelect from '../../../../components/forms/BaseSelect';
import StateSelect from '../../../../components/forms/StateSelect';
import BaseCheck from "../../../../components/forms/BaseCheck";
import BaseCheckList from '../../../../components/forms/BaseCheckList';
import FileInput from "../../../../components/forms/FileInput";
import { ApplicantEquipmentEntity } from '../../../../models/applicant/applicant-equipment.entity';
import { ApplicantExperienceEntity } from '../../../../models/applicant/applicant-experience.entity';
import { ApplicantEmployerEntity } from '../../../../models/applicant/applicant-employer.entity';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantJobEntity } from '../../../../models/applicant/applicant-job.entity';
import BaseInputPhone from "../../../../components/forms/BaseInputPhone";


const ViewModes = {
    EDIT: "edit",
    VIEW: "view"
};

export default function Applicant() {
    const router = useRouter();

    let { t } = useTranslation();

    let { id, viewMode } = router.query;

    if (isNaN(parseInt(id))) id = null; // create mode

    if (!id) viewMode = ViewModes.EDIT;
    else if (viewMode?.toLowerCase() !== ViewModes.EDIT || (applicant && applicant.company?.id !== user.company?.id)) {
        viewMode = ViewModes.VIEW;
    }
    else {
        viewMode = ViewModes.EDIT
    }

    const [applicant, setApplicant] = useState(new ApplicantEntity());

    let { authCheck, hasPermission } = useAuth();

    const user = authCheck();

    const protectedFields = {
        license_number: hasPermission("CanViewApplicant.license_number"),
        social_security_number: hasPermission("CanViewApplicant.social_security_number"),
    };

    useEffectAsync(async () => {
        if (id) {
            const api = new ApplicantApi();

            const data = await api.getById(id);

            if (!data) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("APPLICANT") }));
                return;
            }

            setApplicant(data);
        }
    }, [id, viewMode]);

    const canEdit = applicant.id && hasPermission("CanUpdateApplicant");

    const backPath =
        viewMode === ViewModes.VIEW || !id
            ? "/dashboard/company/applicants"
            : `/dashboard/company/applicants/${id}`;

    const title =
        t(viewMode === ViewModes.VIEW
            ? "VIEW_{name}"
            : `${!id ? "CREATE" : "EDIT"}_{name}`,
            { name: "APPLICANT" }, { translateProps: true });

    return (
        <>
            <ChildPageLayout backPath={backPath} title={title}>
                {viewMode === ViewModes.VIEW && <View applicant={applicant} setApplicant={setApplicant} t={t} canEdit={canEdit} router={router} />}
                {viewMode === ViewModes.EDIT && <Edit applicant={applicant} t={t} router={router} />}
            </ChildPageLayout>
        </>
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
 * Renders the page in VIEW only mode (default)
 * @param {object} props
 * @param {ApplicantEntity} props.applicant
 * @param {React.Dispatch<React.SetStateAction<ApplicantEntity>>} props.setApplicant
 * @param {(string, object) => string} props.t
 * @param {boolean} props.canEdit
 * @param {import('next/router').NextRouter} props.router
 */
function View(props) {
    const { applicant, setApplicant, t, canEdit, router } = props;

    const [pdf, setPdf] = useState({});

    const viewDocumentClick = async (id, name) => {
        const api = new DocumentApi();

        const document = await api.getSignedUrl(id);

        if (document) {
            setPdf({
                name: `${t(name)} (${document.name})`,
                url: document.path
            });
        }
    }

    const addNoteForm = useFormik({
        initialValues: {
            text: null
        },
        validationSchema: yup.object({
            text: yup.string().required().nullable()
        }),
        onSubmit: async (values) => {
            const api = new ApplicantApi();

            const note = await api.notes.create(applicant.id, { text: values.text });

            addNoteForm.setValues({
                text: null
            });
            setAddNoteVisible(false);
            setApplicant({
                ...applicant,
                notes: [
                    ...applicant.notes,
                    note
                ]
            });
        }
    });

    const [addNoteVisible, setAddNoteVisible] = useState(false);

    const addNoteClick = () => {
        setAddNoteVisible(true);
    }

    const onEditClick = async () => {

        await router.push(router.asPath + `?viewMode=${ViewModes.EDIT}`);

    };

    const onAssignClick = async () => {
        const api = new ApplicantApi();


        setApplicant(await api.assign(applicant.id));
    }

    const onUnassignClick = async() => {
        const api = new ApplicantApi();


        setApplicant(await api.unassign(applicant.id));
    };

    return (<>
        {canEdit &&
            <Row>
                <Col>
                    <div style={{ float: "right", marginBottom: "10px" }}>
                        <ButtonGroup size="sm">
                            <Button type="button" className='theme-general-btn' variant='' onClick={onAssignClick}>
                                <BookmarkCheck /> {t("ASSIGN_TO_ME")}
                            </Button>
                            {
                                applicant?.assignedUser &&
                                <Button type="button" variant='danger' onClick={onUnassignClick}>
                                    <BookmarkDash /> {t("UNASSIGN")}
                                </Button>
                            }
                            <Button type="button" onClick={onEditClick}>
                                <Pencil /> {t("EDIT")}
                            </Button>
                        </ButtonGroup>

                    </div>
                </Col>
            </Row>
        }
        <Row>
            <Col>
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
                                    driver_license_number: applicant.license_number,
                                    expiration_date: applicant.license_expiry,
                                    state_issued: applicant.license_state,
                                    cdl_class_type: applicant.license_type ? t(`DriverLicenseType.${applicant.license_type}`) : null,
                                    years_cdl_experience: applicant.years_cdl_experience,
                                    OWNER_OPERATOR: { text: applicant.is_owner_operator, default: t("UNKNOWN") },
                                    AUTHORIZED_TO_WORK_IN_THE_US: applicant.authorized_to_work_in_us,
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
            </Col>
        </Row>
        <Row>
            <Col md="4">
                <ViewCard title="WORK_HISTORY">
                    {!applicant.employers?.length &&
                        t("NONE")
                    }
                    {applicant.employers?.map((e, i) => (
                        <Accordion
                            defaultExpanded={i === 0}
                        >
                            <AccordionSummary
                                expandIcon={<ArrowsExpand />}
                            >
                                {e.name || t("UNKNOWN")}
                            </AccordionSummary>
                            <AccordionDetails>
                                <ViewDetails
                                    key={i}
                                    default={t("NOT_ANSWERED")}
                                    obj={{
                                        NAME: e.name,
                                        DATES_EMPLOYED: dateRange(e.start_at, e.end_at, t("PRESENT")),
                                        TITLE: e.title,
                                        ADDRESS: buildAddress(e),
                                        PHONE: e.phone,
                                        MAY_CONTACT_COMPANY: e.can_contact,
                                        SUBJECT_TO_FMCSRS: e.is_subject_to_fmcsrs,
                                        JOB_DESIGNATED_AS_SATEFY_SENSITIVE: e.is_subject_to_drug_tests
                                    }}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </ViewCard>
            </Col>
            <Col md="8">
                <ViewCard title="SAFETY_BACKGROUND">
                    <Row>
                        <Col md="6">
                            <ViewDetails
                                default={t("NOT_ANSWERED")}
                                obj={{
                                    CAN_PASS_DRUG_TEST: applicant.can_pass_drug_test,
                                    HAS_DUIS: applicant.has_past_dui,
                                    years_of_past_duis: {
                                        show: !!applicant.has_past_dui,
                                        text: applicant.dui_years
                                    },
                                    criminal_history_last_3_years: applicant.criminal_history,
                                    accidents_last_5_years: applicant.accident_count,
                                    accident_details: {
                                        show: applicant.accident_count > 0,
                                        text: applicant.accident_details
                                    }
                                }}
                            />
                        </Col>
                        <Col md="6">
                            <ViewDetails
                                default={t("NOT_ANSWERED")}
                                obj={{
                                    has_had_license_revoked: applicant.license_revoked,
                                    license_revoked_details: {
                                        label: "details",
                                        show: !!applicant.license_revoked,
                                        text: applicant.license_revoked_details
                                    },
                                    has_had_psp_violations: applicant.psp_violations,
                                    violations_details: {
                                        label: "details",
                                        show: !!applicant.psp_violations,
                                        text: applicant.psp_violations_details
                                    },
                                    has_had_tickets_last_5_years: applicant.tickets,
                                    tickets_details: {
                                        label: "details",
                                        show: !!applicant.tickets,
                                        text: applicant.tickets_details
                                    },
                                    has_had_positive_drug_test: applicant.positive_drug_test,
                                    failed_drug_test_details: {
                                        label: "details",
                                        show: !!applicant.positive_drug_test,
                                        text: applicant.positive_drug_test_details
                                    },
                                }}
                            />
                        </Col>
                    </Row>
                </ViewCard>
            </Col>
        </Row>
        <Row>
            <Col md="6">
                <ViewCard title="JOBS_APPLIED_TO_WITH_YOU">
                    <ViewTable
                        type="JOBS"
                        headers={{
                            title: "JOB",
                            status: "STATUS",
                            date_applied: "DATE_APPLIED"
                        }}
                        items={applicant?.jobs?.map(aJob => ({
                            title: <Link href={`/jobs/${aJob.job.id}`}><a>{aJob.job.title}</a></Link>,
                            status: <ShowEnumFromString skipLowerCase popover={true} str={aJob.status} labelPrefix="ApplicantStatus" enumArray={ApplicantStatus} />,
                            date_applied: new Date(aJob.created_at).toDateString()
                        }))}
                    />
                </ViewCard>
            </Col>
            {applicant &&
                <Col md="6">
                    <ViewCard title={t("CONSIDER_{name}_FOR", { name: applicant?.first_name })}>
                        <ViewTable
                            type="OTHER_ROLES"
                            headers={{
                                role: "ROLE",
                                consider: null
                            }}
                            items={[]}
                        />
                    </ViewCard>
                </Col>
            }
        </Row>
        <Row>
            <Col md="12">
                <ViewCard title="UPLOADED_DOCUMENTS">
                    <ViewTable
                        type="DOCUMENTS"
                        headers={{
                            type: "TYPE",
                            document: "DOCUMENT",
                            date_added: "DATE_ADDED"
                        }}
                        items={
                            applicant?.documents?.map(document => ({
                                type: t(`ApplicantDocumentType.${document.type}`),
                                document: <a onClick={() => viewDocumentClick(document.id, document.name)} href="#">{document.name}</a>,
                                date_added: new Date(document.created_at).toDateString()
                            }))}
                    />
                </ViewCard>
            </Col>
            <Col md="12">
                <ViewCard title="NOTES">
                    <ViewTable
                        type="NOTES"
                        headers={{
                            notes: "NOTES",
                            user: "USER",
                            date: "DATE",
                            add: <a href="#" onClick={addNoteClick}><Plus /></a>
                        }}
                        items={applicant?.notes?.map(v => ({
                            notes: v.text,
                            user: `${v.user.first_name} ${v.user.last_name}`,
                            date: new Date(v.created_at).toDateString()
                        }))}
                    />

                </ViewCard>
            </Col>
        </Row>
        <ViewPdf {...pdf} onCloseClick={() => setPdf({})} />
        <ViewModal title={t("ADD_{name}", { name: t("NOTE") })} show={addNoteVisible} onCloseClick={() => setAddNoteVisible(false)}>
            <form onSubmit={addNoteForm.handleSubmit}>
                <Row>
                    <Col>
                        <BaseTextArea
                            label={t("NOTE")}
                            name="text"
                            placeholder={t("NOTES")}
                            required
                            touched={addNoteForm.touched.text}
                            error={addNoteForm.errors.text}
                            onChange={addNoteForm.handleChange}
                            handleBlur={addNoteForm.handleBlur}
                        />
                    </Col>
                </Row>
                <Row className="mt-1">
                    <Col xs="2" className="offset-10">
                        <Button type="submit">{t("SAVE")}</Button>
                    </Col>
                </Row>

            </form>

        </ViewModal>
    </>);

}

/**
 * Renders the page in VIEW only mode (default)
 * @param {object} props
 * @param {ApplicantEntity} props.applicant
 * @param {(string, object) => string} props.t
 * @param {import('next/router').NextRouter} props.router
 */
function Edit(props) {
    const { applicant, t, router } = props;

    const form = useFormik({
        initialValues: new ApplicantEntity(),
        // initialValues: applicant,
        validationSchema: ApplicantEntity.yupSchema(),
        onSubmit: async (values) => {
            const api = new ApplicantApi();

            const jobs = values.jobs || [];
            if ("jobs" in values)
                delete values.jobs;

            try {
                if (values.id) {
                    values = await api.update(values.id, values);
                }
                else {
                    values = await api.create(values);
                }

                for (let i = 0; i < applicant.jobs?.length; i++) {
                    let job = applicant.jobs[i];

                    if (!jobs.some(v => v.job?.id === job.job.id)) {
                        await api.jobs.remove(values.id, job.job.id);
                    }
                }

                for (let i = 0; i < jobs.length; i++) {
                    let job = jobs[i];

                    if (job.id) {
                        await api.jobs.update(values.id, job.job.id, job);
                    }
                    else {
                        await api.jobs.create(values.id, job.job.id, job);
                    }
                }

                router.push(`/dashboard/company/applicants/${values.id}`);
            } catch (e) {
                console.error("Unable to save applicant info", e);
                if(e?.response?.data?.email == "ALREADY_EXISTS"){
                    toast.error(t("EMAIL_ALREADY_EXISTS"));
                }
                else{
                    toast.error(t("unable_to_save_information"));

                }
            }
        }
    });

    useEffect(() => {
        form.setValues({
            ...form.values,
            ...applicant,
            // equipment_experience: applicant.equipment_experience || [],
            // equipment_owned: applicant.equipment_owned || [],
            // transmission_type: applicant.transmission_type || [],
            // endorsements: applicant.endorsements || [],
            // dui_years: applicant.dui_years || [],
            // documents: applicant.documents || [],
            // is_owner_operator: applicant.is_owner_operator === true,
            // can_pass_drug_test: applicant.can_pass_drug_test === true,
            // authorized_to_work_in_us: applicant.authorized_to_work_in_us === true,
            // has_past_dui: applicant.has_past_dui === true,
            // license_revoked: applicant.license_revoked === true,
            // psp_violations: applicant.psp_violations === true,
            // tickets: applicant.tickets === true,
            // positive_drug_test: applicant.positive_drug_test === true,
        });
    }, [applicant]);

    const [jobs, setJobs] = useState([]);
    useEffect(async () => {
        const api = new JobApi();

        const data = await api.list();

        setJobs(data);
    }, []);

    return (<>
        <form onSubmit={form.handleSubmit}>
            <Row>
                <Col>
                    <div style={{ float: "right"}}>
                        <Button type="submit">{t("SAVE")}</Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ViewCard title="BASIC_DETAILS">
                        <Row>
                            <Col md="4" className="px-2">
                                <BaseInput
                                    className="col-12"
                                    label="FIRST_NAME"
                                    required
                                    name="first_name"
                                    placeholder="FIRST_NAME"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="LAST_NAME"
                                    required
                                    name="last_name"
                                    placeholder="LAST_NAME"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="BIRTHDATE"
                                    type="date"
                                    name="birthdate"
                                    placeholder="MM/DD/YYYY"
                                    formik={form}
                                />

                                <BaseInputPhone
                                    className="col-12"
                                    label="PHONE"
                                    type="tel"
                                    name="phone"
                                    placeholder="PHONE"
                                    value={form.values.phone}
                                    touched={form.touched.phone}
                                    error={form.errors.phone}
                                    onChange={(value, country, e, formattedValue) => { form.setFieldValue('phone', formattedValue) }}
                                    handleBlur={(event, data) => { form.setFieldValue('phone', event.target.value) }}
                                    onKeyDown={(event) => { form.setFieldValue('phone', event.target.value) }}
                                />
                                {/* <BaseInput
                                    className="col-12"
                                    label="PHONE"
                                    type="tel"
                                    name="phone"
                                    placeholder="PHONE"
                                    formik={form}
                                /> */}
                                <BaseInput
                                    className="col-12"
                                    label="EMAIL"
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="EMAIL"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="STREET"
                                    name="street"
                                    placeholder="STREET"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="CITY"
                                    name="city"
                                    placeholder="CITY"
                                    formik={form}
                                />
                                <Row className='px-3'>
                                    <StateSelect
                                        className="col-6"
                                        label="STATE"
                                        name="state"
                                        placeholder="STATE"
                                        formik={form}
                                    />
                                    <BaseInput
                                        className="col-6"
                                        label="ZIP_CODE"
                                        name="zip_code"
                                        placeholder="ZIP_CODE"
                                        formik={form}
                                    />
                                </Row>
                            </Col>
                            <Col md="4" className="px-2">
                                <BaseInput
                                    className="col-12"
                                    label="driver_license_number"
                                    name="license_number"
                                    placeholder="driver_license_number"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="expiration_date"
                                    name="license_expiry"
                                    type="date"
                                    placeholder="expiration_date"
                                    formik={form}
                                />
                                <Row className="px-3">
                                    <StateSelect
                                        className="col-6"
                                        label="state_issued"
                                        name="license_state"
                                        placeholder="state_issued"
                                        formik={form}
                                    />
                                    <BaseSelect
                                        className="col-6"
                                        label="CDL_CLASS"
                                        name="license_type"
                                        placeholder
                                        labelPrefix="DriverLicenseType"
                                        enumType={DriverLicenseType}
                                        formik={form}
                                    />
                                </Row>
                                <BaseInput
                                    className="col-12"
                                    label="years_cdl_experience"
                                    name="years_cdl_experience"
                                    type="number"
                                    placeholder="years_cdl_experience"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 mt-2"
                                    label="OWNER_OPERATOR"
                                    name="is_owner_operator"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 mt-2"
                                    label="AUTHORIZED_TO_WORK_IN_THE_US"
                                    name="authorized_to_work_in_us"
                                    formik={form}
                                />
                            </Col>
                            <Col md="4" className="px-2">
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
                                    className="col-12"
                                    label="ENDORSEMENTS"
                                    name="endorsements"
                                    labelPrefix="DriverEndorsement"
                                    enumType={DriverEndorsement}
                                    formik={form}
                                    cols="2"
                                />
                                <BaseSelect
                                    className="col-12"
                                    label="HIGHEST_DEGREE"
                                    name="highest_degree"
                                    placeholder="HIGHEST_DEGREE"
                                    formik={form}
                                    labelPrefix="EducationLevel"
                                    enumType={EducationLevel}
                                />
                                <Col xs="12" className='mt-2'>
                                    <ViewCard title="EMERGENCY_CONTACT">
                                        <BaseInput
                                            className="col-12"
                                            name={`emergency_contact_name`}
                                            label="NAME"
                                            placeholder="FULL_NAME"
                                            formik={form}
                                        />

                                        <BaseInputPhone
                                            className="col-12"
                                            name={`emergency_contact_number`}
                                            label="PHONE"
                                            type="tel"
                                            placeholder="PHONE"
                                            value={form.values.emergency_contact_number}
                                            touched={form.touched.emergency_contact_number}
                                            error={form.errors.emergency_contact_number}
                                            onChange={(value, country, e, formattedValue) => { form.setFieldValue('emergency_contact_number', formattedValue) }}
                                            handleBlur={(event, data) => { form.setFieldValue('emergency_contact_number', event.target.value) }}
                                            onKeyDown={(event) => { form.setFieldValue('emergency_contact_number', event.target.value) }}
                                        />
                                        {/* <BaseInput
                                            className="col-12"
                                            name={`emergency_contact_number`}
                                            label="PHONE"
                                            type="tel"
                                            placeholder="PHONE"
                                            formik={form}
                                        /> */}
                                        <BaseInput
                                            className="col-12"
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
                            <Col md="6">
                                <Col xs="12"  className='p-2 mt-2' >
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
                                                <Row className='d-sm-none d-md-flex'>
                                                    <Col><strong>{t("TYPE")}</strong></Col>
                                                    <Col><strong>{t("YEARS")}</strong></Col>
                                                </Row>
                                                {form.values
                                                    .equipment_experience
                                                    .map((entity, i) => (
                                                        <Row key={i}>
                                                            <Col xs="12" className='d-sm-flex d-md-none'>
                                                                <Col><strong>{t("TYPE")}</strong></Col>
                                                                <Col><strong>{t("YEARS")}</strong></Col>
                                                            </Col>
                                                            <Col xs="6">
                                                                <BaseSelect
                                                                    name={`equipment_experience[${i}].type`}
                                                                    placeholder="TYPE"
                                                                    labelPrefix="JobEquipmentType"
                                                                    enumType={JobEquipmentType}
                                                                    formik={form}
                                                                />
                                                            </Col>
                                                            <Col xs="5">
                                                                <BaseInput
                                                                    name={`equipment_experience[${i}].years`}
                                                                    placeholder="YEARS"
                                                                    type="int"
                                                                    min="1"
                                                                    formik={form}
                                                                />
                                                            </Col>
                                                            {
                                                                entity.type === JobEquipmentType.OTHER &&
                                                                <Col xs="11">
                                                                    <BaseInput
                                                                        name={`equipment_experience[${i}].type_other`}
                                                                        placeholder="TYPE"
                                                                        formik={form}
                                                                    />
                                                                </Col>
                                                            }
                                                            <Col xs="1">
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
                            <Col md="6" className='px-2'>
                                {
                                    form.values.is_owner_operator &&
                                    <Col xs="12" className='mt-3'>
                                        <ViewCard
                                            title="equipment_owned"
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
                                                                <Col xs="12" className='d-sm-flex d-md-none'>
                                                                    <Col><strong>{t("TYPE")}</strong></Col>
                                                                    <Col><strong>{t("QUANTITY")}</strong></Col>
                                                                </Col>
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
                                                                    entity.type === JobEquipmentType.OTHER &&
                                                                    <Col xs="11">
                                                                        <BaseInput
                                                                            name={`equipment_owned[${i}].type_other`}
                                                                            placeholder="TYPE"
                                                                            formik={form}
                                                                        />
                                                                    </Col>
                                                                }
                                                                <Col xs="1">
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
                                    defaultExpanded={i === 0 || !meta.touched || hasError}
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
                                                employers: form.values.employers.filter((v, idx) => idx !== i),
                                            })}
                                        >
                                            <XCircle /> {t("REMOVE")}
                                        </Button>
                                        <span style={{ marginLeft: "10px" }} >{e.name || t("NEW_EMPLOYER")}</span>

                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Row>
                                            <BaseInput
                                                className="col-12"
                                                name={`employers[${i}].name`}
                                                label="NAME"
                                                required
                                                placeholder="COMPANY_NAME"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6"
                                                name={`employers[${i}].start_at`}
                                                label="DATES_EMPLOYED"
                                                type="date"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6"
                                                name={`employers[${i}].end_at`}
                                                label="THROUGH_OPTIONAL"
                                                type="date"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12"
                                                name={`employers[${i}].title`}
                                                label="TITLE"
                                                placeholder="TITLE"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12"
                                                name={`employers[${i}].street`}
                                                label="STREET"
                                                placeholder="STREET"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-12"
                                                name={`employers[${i}].city`}
                                                label="CITY"
                                                placeholder="CITY"
                                                formik={form}
                                            />
                                            <StateSelect
                                                className="col-6"
                                                name={`employers[${i}].state`}
                                                label="STATE"
                                                placeholder="STATE"
                                                formik={form}
                                            />
                                            <BaseInput
                                                className="col-6"
                                                name={`employers[${i}].zip_code`}
                                                label="ZIP_CODE"
                                                placeholder="ZIP_CODE"
                                                formik={form}
                                            />
                                            <BaseInputPhone
                                                className="col-12"
                                                name={`employers[${i}].phone`}
                                                label="PHONE"
                                                type="tel"
                                                placeholder="PHONE"
                                                value={form.values.employers[i].phone}
                                                onChange={(value, country, e, formattedValue) => { form.setFieldValue('`employers[${i}].phone`', formattedValue) }}
                                                handleBlur={(event, data) => { form.setFieldValue('`employers[${i}].phone`', event.target.value) }}
                                                onKeyDown={(event) => { form.setFieldValue('`employers[${i}].phone`', event.target.value) }}
                                            />
                                            {/* <BaseInput
                                                className="col-12"
                                                name={`employers[${i}].phone`}
                                                label="PHONE"
                                                type="tel"
                                                placeholder="PHONE"
                                                formik={form}
                                            /> */}
                                            <BaseCheck
                                                className="col-12 mt-2"
                                                name={`employers[${i}].can_contact`}
                                                label="MAY_CONTACT_COMPANY"
                                                formik={form}
                                            />
                                            <BaseCheck
                                                className="col-12 mt-2"
                                                name={`employers[${i}].is_subject_to_fmcsrs`}
                                                label="SUBJECT_TO_FMCSRS"
                                                formik={form}
                                            />
                                            <BaseCheck
                                                className="col-12 mt-2"
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
                                    className="col-12 mt-2"
                                    label="CAN_PASS_DRUG_TEST"
                                    name="can_pass_drug_test"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12 mt-2"
                                    label="HAS_DUIS"
                                    name="has_past_dui"
                                    formik={form}
                                />
                                {
                                    form.values.has_past_dui &&
                                    <Col xs="12" className='mt-2'>
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
                                    className="col-12 mt-2"
                                    label="criminal_history_last_3_years"
                                    name="criminal_history"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12 mt-2"
                                    label="accidents_last_5_years"
                                    name="accident_count"
                                    type="int"
                                    min="0"
                                    formik={form}
                                />
                                {
                                    form.values.accident_count > 0 &&
                                    <BaseTextArea
                                        className="col-12 mt-2"
                                        label="accident_details"
                                        name="accident_details"
                                        formik={form}
                                    />
                                }
                            </Col>
                            <Col md="6">
                                <Row>
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        label="has_had_license_revoked"
                                        name="license_revoked"
                                        formik={form}
                                    />
                                    {
                                        form.values.license_revoked &&
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            label="details"
                                            name="license_revoked_details"
                                            formik={form}
                                        />
                                    }
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        label="has_had_psp_violations"
                                        name="psp_violations"
                                        formik={form}
                                    />
                                    {
                                        form.values.psp_violations &&
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            label="details"
                                            name="violations_details"
                                            formik={form}
                                        />
                                    }
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        label="has_had_tickets_last_5_years"
                                        name="tickets"
                                        formik={form}
                                    />
                                    {
                                        form.values.tickets &&
                                        <BaseTextArea
                                            className="col-12 mt-2"
                                            label="details"
                                            name="tickets_details"
                                            formik={form}
                                        />
                                    }
                                    <BaseCheck
                                        className="col-12 mt-2"
                                        label="has_had_positive_drug_test"
                                        name="positive_drug_test"
                                        formik={form}
                                    />
                                    {
                                        form.values.positive_drug_test &&
                                        <BaseTextArea
                                            className="col-12 mt-2"
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
                <Col md="5">
                    <ViewCard
                        title="UPLOADED_DOCUMENTS"
                        actions={<Button size='sm'
                            disabled={form.values.documents?.length === Object.keys(ApplicantDocumentType).length}
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

                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>{t("TYPE")}</th>
                                        <th>{t("DOCUMENT")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.values
                                        .documents
                                        .map((entity, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <BaseSelect
                                                        name={`documents[${i}].type`}
                                                        required
                                                        placeholder="TYPE"
                                                        labelPrefix="ApplicantDocumentType"
                                                        enumType={ApplicantDocumentType}
                                                        readOnly={!!entity.id && !entity.file_base64}
                                                        formik={form}
                                                    />
                                                </td>
                                                <td>
                                                    <FileInput
                                                        name={`documents[${i}]`}
                                                        required
                                                        accept="application/pdf"
                                                        formik={form}
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" onClick={() => form.setValues({
                                                        ...form.values,
                                                        documents: form.values.documents.filter((v, idx) => i != idx)
                                                    })}><DashCircle color="red" /></a>
                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        }
                    </ViewCard>
                </Col>
                <Col md="7">
                    <ViewCard
                        title="JOBS_APPLIED_TO_WITH_YOU"
                        actions={<Button size='sm'
                            onClick={() => form.setValues({
                                ...form.values,
                                jobs: [
                                    ...(form.values.jobs || []),
                                    new ApplicantJobEntity()
                                ]
                            })}><PlusCircle /> {t("ADD")}</Button>}
                    >
                        {!form.values.jobs?.length &&
                            t("NONE")
                        }
                        {
                            form.values.jobs?.length > 0 &&

                            <Table striped>
                                <thead>
                                    <tr>
                                        <th>{t("JOB")}*</th>
                                        <th>{t("STATUS")}*</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {form.values
                                        .jobs
                                        .map((entity, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {entity.id
                                                        ? entity.job.title
                                                        : <BaseSelect
                                                            name={`jobs[${i}].job.id`}
                                                            required
                                                            placeholder="JOB"
                                                            options={jobs}
                                                            labelKey="title"
                                                            valueKey="id"
                                                            formik={form}
                                                        />
                                                    }
                                                </td>
                                                <td>
                                                    <BaseSelect
                                                        name={`jobs[${i}].status`}
                                                        required
                                                        placeholder="STATUS"
                                                        labelPrefix="ApplicantStatus"
                                                        enumType={ApplicantStatus}
                                                        formik={form}
                                                    />
                                                </td>
                                                <td>
                                                    <a href="#" onClick={() => form.setValues({
                                                        ...form.values,
                                                        jobs: form.values.jobs.filter((v, idx) => i != idx)
                                                    })}><DashCircle color="red" /></a>
                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </Table>
                        }
                    </ViewCard>
                </Col>
            </Row>
        </form>
    </>);

}

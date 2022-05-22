
import { Row, Button, Col, ButtonGroup, InputGroup } from "react-bootstrap";
import { PlusCircle, DashCircle } from "react-bootstrap-icons";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import useAuth from '../../../../hooks/useAuth';
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useEffect } from "react";

import { useTranslation } from "../../../../hooks/useTranslation";
import { useFormik } from "formik";

import LocationApi from "../../../api/location";
import VehicleApi from "../../../api/vehicle";

import BaseInput from "../../../../components/forms/BaseInput";
import BaseSelect from "../../../../components/forms/BaseSelect";
import BaseCheck from "../../../../components/forms/BaseCheck";
import BaseCheckList from "../../../../components/forms/BaseCheckList";
import BaseTextArea from "../../../../components/forms/BaseTextArea";
import BaseRange from "../../../../components/forms/BaseRange";

import { useRouter } from "next/router"

import { counts, years } from "../../../../utils/jobs";

import { EducationLevel } from "../../../../enums/users/education-level.enum";
import { DriverLicenseType } from "../../../../enums/users/driver-license-type.enum";
import { DriverEndorsement } from "../../../../enums/users/driver-endorsement.enum";
import { MvrType } from "../../../../enums/users/mvr-type.enum"
import { CriminalHistoryType } from "../../../../enums/users/criminal-history-type.enum"

import { VehicleType } from "../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTransmissionType } from "../../../../enums/vehicles/vehicle-transmission-type.enum";

import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { JobEquipmentType } from "../../../../enums/jobs/job-equipment-type.enum";
import { JobTeamDriver } from "../../../../enums/jobs/job-team-driver.enum";
import { JobSchedule } from "../../../../enums/jobs/job-schedule.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { JobDeliveryType } from "../../../../enums/jobs/job-delivery-type.enum";
import { JobPayMethod } from "../../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../../enums/jobs/job-benefits.enum";
import { JobPayFrequency } from "../../../../enums/jobs/job-pay-frequency.enum";


import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";

import "../../../../utils/yup"

import JobApi from "../../../api/job";
import { JobEntity } from "../../../../models/job/job.entity";
import ViewModal from "../../../../components/viewDetails/viewModal";
import { VehicleForm } from "../../../../components/forms/company/VehicleForm";
import ViewCard from "../../../../components/viewDetails/viewCard";
import { VehicleEntity } from "../../../../models/company/vehicle.entity";
import { LocationForm } from "../../../../components/forms/company/LocationForm";

export default function Job() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/jobs";

    if (isNaN(parseInt(id))) id = null; // create mode

    // validate that this is a company profile
    const { authCompany } = useRedirect();
    authCompany();

    const { authCheck } = useAuth();
    const user = authCheck();

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: new JobEntity(),
        validationSchema: JobEntity.yupSchema(),
        onSubmit: async (data) => {
            data.min_weekly_pay = parseFloat(data.min_weekly_pay)
            data.max_weekly_pay = parseFloat(data.max_weekly_pay)
            data.min_rate = parseFloat(data.min_rate)
            data.max_rate = parseFloat(data.max_rate)
            data.min_miles = parseFloat(data.min_miles)
            data.max_miles = parseFloat(data.max_miles)
            data.min_salary = parseFloat(data.min_salary)
            data.max_salary = parseFloat(data.max_salary)
            try {
                const jobApi = await new JobApi();

                let job = null;
                if (id) {
                    job = await jobApi.update(id, data);
                }
                else {
                    job = await jobApi.create(data);
                }

                toast.success(t("successfully_saved_information"));
                // setTimeout(
                //     () => Router.push(backPath),
                //     2000);
            }
            catch (e) {
                console.error("Unable to save job", e);
                toast.error(t("unable_to_save_information"));
            }

        }
    });

    const [locations, set_locations] = useState([]);
    const [vehicles, set_vehicles] = useState([]);

    useEffect(async () => {
        if (id) {
            const jobApi = new JobApi();

            const job = await jobApi.getById(id);
            console.log(job);

            form.setValues({
                title: job.title,
                location: {
                    id: job.location?.id,
                    street: null,
                    city: null,
                    state: null,
                    zip_code: null,
                },
                description: job.description,
                description_short: job.description_short,
                drivers_needed: job.drivers_needed,
                expiry_date: (job.expiry_date || "").split("T")[0] || null,
                geography: job.geography || JobGeography.LOCAL,
                schedule: job.schedule,
                schedule_other: job.schedule_other,
                employment_type: job.employment_type,
                equipment_type: job.equipment_type || [],
                equipment_type_other: job.equipment_type_other,
                delivery_type: job.delivery_type || [],
                team_drivers: job.team_drivers,
                pay_method: job.pay_method,
                min_salary: job.min_salary,
                max_salary: job.max_salary,
                min_rate: job.min_rate,
                max_rate: job.max_rate,
                min_hours: job.min_hours,
                max_hours: job.max_hours,
                min_percent: job.min_percent,
                max_percent: job.max_percent,
                min_miles: job.min_miles,
                max_miles: job.max_miles,
                min_weekly_pay: job.min_weekly_pay,
                max_weekly_pay: job.max_weekly_pay,
                benefits: job.benefits || [],
                benefits_other: job.benefits_other,
                vehicles: job.vehicles?.map(v => ({
                    id: v.id,
                    type: null,
                    type_other: null,
                    transmission_type: null,
                    make: null,
                    model: null,
                    year: null,
                    photo: null
                })) || [],
                cdl_class: job.cdl_class || [],
                min_years_experience: job.min_years_experience,
                min_degree: job.min_degree,
                required_skills: job.required_skills || [],
                required_skills_other: job.required_skills_other,
                required_equipment: job.required_equipment || [],
                required_endorsement: job.required_endorsement || [],
                transmission_type_experience: job.transmission_type_experience || [],
                max_applicant_radius: job.max_applicant_radius,
                must_pass_drug_test: job.must_pass_drug_test,
                must_have_clean_mvr: job.must_have_clean_mvr,
                mvr_requirements: job.mvr_requirements || [],
                accept_sap_graduates: job.accept_sap_graduates,
                must_have_clean_criminal_history: job.must_have_clean_criminal_history,
                criminal_history: job.criminal_history || [],
                max_accidents: job.max_accidents,
                safety_requirements_other: job.safety_requirements_other,
                pay_frequency: job.pay_frequency,

            });
        }
        {
            const locationApi = new LocationApi();
            set_locations(await locationApi.list());
        }
        {
            const vehicleApi = new VehicleApi();
            set_vehicles(await vehicleApi.list());
        }

    }, [id]);

    /// custom PayMethod logic

    function handlePayMethodUpdate(e) {
        const { name, value } = e.target;
        let min_miles = getOrCurrent("min_miles");
        let max_miles = getOrCurrent("max_miles");
        let min_percent = getOrCurrent("min_percent");
        let max_percent = getOrCurrent("max_percent");
        let min_hours = getOrCurrent("min_hours");
        let max_hours = getOrCurrent("max_hours");
        let min_rate = getOrCurrent("min_rate");
        let max_rate = getOrCurrent("max_rate");
        let min_salary = getOrCurrent("min_salary");
        let max_salary = getOrCurrent("max_salary");
        let min_weekly_pay = getOrCurrent("min_weekly_pay");
        let max_weekly_pay = getOrCurrent("max_weekly_pay");

        switch (form.values.pay_method) {
            case JobPayMethod.RATE_PER_MILE:
                /**
                    -if rate per mile		
                        Min Rate Per Mi	
                        Max Rate Per Mi	
                        Avg mi per week	
                        Estimated maximum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                        Estimated minimum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                */
                min_percent = null;
                max_percent = null;
                min_hours = null;
                max_hours = null;
                min_salary = null;
                max_salary = null;
                min_weekly_pay = (min_miles >= 0 && min_rate >= 0 ? (min_miles * min_rate).toFixed(2) : min_weekly_pay);
                max_weekly_pay = (max_miles >= 0 && max_rate >= 0 ? (max_miles * max_rate).toFixed(2) : max_weekly_pay);
                break;
            case JobPayMethod.PERCENT_PER_MOVE:
            case JobPayMethod.PERCENT_PER_WEIGHT:
                /*
                -if % per move		
                    Min % per move	
                    Max % per move	
                    Estimated maximum weekly pay	(manual entry)
                    Estimated minimum weekly pay	(manual entry)
                -if % weight		
                    Min % per weight	
                    Max % per weight	
                    Estimated maximum weekly pay	(manual entry)
                    Estimated minimum weekly pay	(manual entry)
                */
                // noop
                min_miles = null;
                max_miles = null;
                min_hours = null;
                max_hours = null;
                min_rate = null;
                max_rate = null;
                min_salary = null;
                max_salary = null;
                break;
            case JobPayMethod.HOURLY:
                /*
                -if hourly		
                    Min $ per hr	
                    Max $ per hr	
                    Avg hrs per week	
                    Estimated maximum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                    Estimated minimum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                */
                min_miles = null;
                max_miles = null;
                min_percent = null;
                max_percent = null;
                min_salary = null;
                max_salary = null;
                min_weekly_pay = (min_hours >= 0 && min_rate >= 0 ? (min_hours * min_rate).toFixed(2) : min_weekly_pay);
                max_weekly_pay = (max_hours >= 0 && max_rate >= 0 ? (max_hours * max_rate).toFixed(2) : max_weekly_pay);
                break;
            case JobPayMethod.SET_WEEKLY:
                /*
                -if set weekly		
                    Estimated maximum weekly pay	(manual entry)
                    Estimated minimum weekly pay	(manual entry)
                */
                min_miles = null;
                max_miles = null;
                min_percent = null;
                max_percent = null;
                min_hours = null;
                max_hours = null;
                min_rate = null;
                max_rate = null;
                min_salary = null;
                max_salary = null;
                break;
            case JobPayMethod.SALARY:
                /*
                -if salaried		
                    Min annual salary	
                    Max annual salary	
                    Estimated maximum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                    Estimated minimum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                */
                min_miles = null;
                max_miles = null;
                min_percent = null;
                max_percent = null;
                min_hours = null;
                max_hours = null;
                min_rate = null;
                max_rate = null;
                min_weekly_pay = min_salary >= 0 ? (min_salary / 52).toFixed(2) : min_weekly_pay;
                max_weekly_pay = max_salary >= 0 ? (max_salary / 52).toFixed(2) : min_weekly_pay;
                break;
        }

        form.setValues({
            ...form.values,
            min_miles: min_miles,
            max_miles: max_miles,
            min_salary: min_salary,
            max_salary: max_salary,
            min_rate: min_rate,
            max_rate: max_rate,
            min_hours: min_hours,
            max_hours: max_hours,
            min_percent: min_percent,
            max_percent: max_percent,
            min_weekly_pay: min_weekly_pay,
            max_weekly_pay: max_weekly_pay
        });

        function getOrCurrent(field) {
            return name === field ? +value : form.values[field];
        }
    }

    function addRequiredSkills(e) {
        e.preventDefault();
        form.setValues({
            ...form.values,
            required_skills: [
                ...form.values.required_skills,
                {
                    type: null,
                    years: null
                }
            ],
        });
    }

    function removeRequiredSkill(e) {
        e.preventDefault();

        const { name } = e.target;
        form.setValues({
            ...form.values,
            required_skills: form.values.required_skills.filter((v, i) => i != name),
        });
    }

    function addRequiredEquipment(e) {
        e.preventDefault();
        form.setValues({
            ...form.values,
            required_equipment: [
                ...form.values.required_equipment,
                {
                    type: null,
                    quantity: null
                }
            ],
        });
    }

    function removeRequiredEquipment(e) {
        e.preventDefault();

        const { name } = e.target;
        form.setValues({
            ...form.values,
            required_equipment: form.values.required_equipment.filter((v, i) => i != name),
        });
    }

    function addMvrRequirement(e) {
        e.preventDefault();
        form.setValues({
            ...form.values,
            mvr_requirements: [
                ...form.values.mvr_requirements,
                {
                    type: null,
                    max_count: 0,
                    max_years: 0
                }
            ],
        });
    }

    function removeMvrRequirement(e) {
        e.preventDefault();

        const { name } = e.target;
        form.setValues({
            ...form.values,
            mvr_requirements: form.values.mvr_requirements.filter((v, i) => i != name),
        });
    }

    function addCriminalHistoryRequirement(e) {
        e.preventDefault();
        form.setValues({
            ...form.values,
            criminal_history: [
                ...form.values.criminal_history,
                {
                    type: null,
                    max_count: 0,
                    max_years: 0
                }
            ],
        });
    }

    function removeCriminalHistoryRequirement(e) {
        e.preventDefault();

        const { name } = e.target;
        form.setValues({
            ...form.values,
            criminal_history: form.values.criminal_history.filter((v, i) => i != name),
        });
    }

    const maxRadius = {
        [JobGeography.LOCAL]: 100,
        [JobGeography.REGIONAL]: 1000,
        [JobGeography.OTR]: 3000
    };

    /**
     * 
     * @param {React.ChangeEvent<HTMLSelectElement>} e 
     */
    const onGeographyChange = (e) => {
        const { name, value } = e.target;

        form.setValues({
            ...form.values,
            geography: value,
            max_applicant_radius: maxRadius[value]
        })

    }

    const [ createVehicle, setCreateVehicle ] = useState(false);

    const onVehicleAdded = (vehicle) => {
        form.setFieldValue(`vehicles.${createVehicle}.id`, vehicle.id);
        set_vehicles([
            ...vehicles,
            vehicle
        ]);
        setCreateVehicle(false);
    }

    const [ createLocation, setCreateLocation ] = useState(false);

    const onLocationAdded = (location) => {
        form.setFieldValue(`location.id`, location.id);
        set_locations([
            ...locations,
            location
        ]);
        setCreateLocation(false);
    }

    return (

        <>
            <ChildPageLayout
                title={id ? "EDIT_JOB" : "CREATE_JOB"}
                backPath={backPath}
            >
                <form onSubmit={form.handleSubmit} >
                    <div className="col-12 border-0 text-end">
                        <div className="col">
                            <button type="submit" className={`btn btn-primary`} >
                                {t(id ? "UPDATE" : "CREATE")}
                            </button>
                        </div>
                    </div>
                    <Row className="mt-1">
                        <Col lg="6" xl="4">
                            <ViewCard
                                title="basic_details"
                                >
                                <BaseInput
                                    className="col-12"
                                    label="title"
                                    required
                                    name="title"
                                    placeholder="title"
                                    formik={form}
                                    />
                                <BaseSelect
                                    className="col-12"
                                    label="location"
                                    name="location.id"
                                    required
                                    placeholder="SELECT_LOCATION"
                                    formik={form}
                                    valueKey="id"
                                    labelKey="street"
                                    options={locations}
                                    append={<Button variant="outline-secondary" onClick={() => setCreateLocation(true)}><PlusCircle /> {t("CREATE")}</Button>}
                                    />
                                <BaseInput
                                    className="col-12"
                                    label="expiration_date"
                                    name="expiry_date"
                                    placeholder="expiration_date"
                                    type="date"
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="drivers_needed"
                                    name="drivers_needed"
                                    placeholder="drivers_needed"
                                    type="int"
                                    min="0"
                                    formik={form}
                                />
                                <BaseSelect
                                    className="col-12"
                                    label="GEOGRAPHY"
                                    name="geography"
                                    required
                                    formik={form}
                                    onChange={onGeographyChange}
                                    labelPrefix="JobGeography"
                                    enumType={JobGeography}
                                />
                                <BaseRange
                                    className="col-12"
                                    label="max_applicant_radius"
                                    name="max_applicant_radius"
                                    required
                                    min={1}
                                    max={maxRadius[form.values.geography]}
                                    formik={form}
                                />
                                <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                    <BaseSelect
                                        className={`col-${form.values.schedule === JobSchedule.OTHER ? 6 : 12}`}
                                        label="schedule"
                                        name="schedule"
                                        required
                                        placeholder="schedule"
                                        labelPrefix="JobSchedule"
                                        enumType={JobSchedule}
                                        formik={form}
                                    />
                                    {
                                        form.values.schedule === JobSchedule.OTHER &&
                                        <BaseInput
                                            className="col-6"
                                            label="other_schedule"
                                            required
                                            name="schedule_other"
                                            placeholder="schedule"
                                            formik={form}
                                        />
                                    }
                                </Row>
                                <BaseSelect
                                    className="col-12"
                                    label="employment_type"
                                    name="employment_type"
                                    required
                                    placeholder="employment_type"
                                    labelPrefix="JobEmploymentType"
                                    enumType={JobEmploymentType}
                                    formik={form}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label="equipment_type"
                                    name="equipment_type"
                                    placeholder="equipment_type"
                                    cols={2}
                                    labelPrefix="JobEquipmentType"
                                    enumType={JobEquipmentType}
                                    formik={form}
                                />
                                {
                                    form.values.equipment_type.includes(JobSchedule.OTHER) &&
                                    <BaseInput
                                        className="col-12"
                                        required
                                        label="other_equipment_type"
                                        name="equipment_type_other"
                                        placeholder="equipment_type"
                                        formik={form}
                                    />
                                }
                                <BaseCheckList
                                    className="col-12"
                                    label="delivery_type"
                                    name="delivery_type"
                                    required
                                    placeholder="delivery_type"
                                    cols={2}
                                    labelPrefix="JobDeliveryType"
                                    enumType={JobDeliveryType}
                                    formik={form}
                                />
                                <BaseSelect
                                    className="col-12"
                                    label="team_drivers"
                                    name="team_drivers"
                                    required
                                    placeholder="team_drivers"
                                    labelPrefix="JobTeamDriver"
                                    enumType={JobTeamDriver}
                                    formik={form}
                                />
                            </ViewCard>
                        </Col>
                        <Col lg="6" xl="4">
                            <ViewCard
                                title="benefits"
                                >
                                <BaseSelect
                                    className="col-12"
                                    label="pay_method"
                                    name="pay_method"
                                    required
                                    placeholder="pay_method"
                                    labelPrefix="JobPayMethod"
                                    enumType={JobPayMethod}
                                    formik={form}
                                />
                                {
                                    (form.values.pay_method === JobPayMethod.PERCENT_PER_MOVE ||
                                        form.values.pay_method === JobPayMethod.PERCENT_PER_WEIGHT) &&
                                    <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="min_percent"
                                            name="min_percent"
                                            required
                                            placeholder="min_percent"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="max_percent"
                                            name="max_percent"
                                            required
                                            placeholder="max_percent"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                    </Row>
                                }
                                {
                                    form.values.pay_method === JobPayMethod.RATE_PER_MILE &&
                                    <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="min_miles"
                                            name="min_miles"
                                            required
                                            placeholder="min_miles"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="max_miles"
                                            name="max_miles"
                                            required
                                            placeholder="max_miles"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                    </Row>
                                }
                                {
                                    form.values.pay_method === JobPayMethod.HOURLY &&
                                    <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="min_hours"
                                            name="min_hours"
                                            required
                                            placeholder="min_hours"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="max_hours"
                                            name="max_hours"
                                            required
                                            placeholder="max_hours"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                    </Row>
                                }
                                {
                                    (form.values.pay_method === JobPayMethod.RATE_PER_MILE ||
                                        form.values.pay_method === JobPayMethod.HOURLY) &&
                                    <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="min_rate"
                                            name="min_rate"
                                            required
                                            placeholder="min_rate"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="max_rate"
                                            name="max_rate"
                                            required
                                            placeholder="max_rate"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                    </Row>
                                }
                                {
                                    (form.values.pay_method === JobPayMethod.SALARY) &&
                                    <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="min_salary"
                                            name="min_salary"
                                            required
                                            placeholder="min_salary"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                        <BaseInput
                                            step={0.01}
                                            min={0}
                                            className="col-6"
                                            label="max_salary"
                                            name="max_salary"
                                            placeholder="max_salary"
                                            type="number"
                                            onChange={handlePayMethodUpdate}
                                            formik={form}
                                        />
                                    </Row>
                                }
                                <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                                    <BaseInput
                                        step={0.01}
                                        min={0}
                                        className="col-6"
                                        label="min_weekly"
                                        name="min_weekly_pay"
                                        required
                                        placeholder="min_weekly"
                                        type="number"
                                        formik={form}
                                    />
                                    <BaseInput
                                        step={0.01}
                                        min={0}
                                        className="col-6"
                                        label="max_weekly"
                                        name="max_weekly_pay"
                                        required
                                        placeholder="max_weekly"
                                        type="number"
                                        formik={form}
                                    />
                                </Row>
                                {/* todo: add job pay information */}
                                <BaseCheckList
                                    className="col-12"
                                    label="benefits"
                                    name="benefits"
                                    placeholder="benefits"
                                    cols={2}
                                    labelPrefix="JobBenefits"
                                    enumType={JobBenefits}
                                    formik={form}
                                />
                                {
                                    form.values.benefits.includes(JobBenefits.OTHER) &&
                                    <BaseInput
                                        className="col-12"
                                        label="additional_benefits"
                                        name="benefits_other"
                                        required
                                        placeholder="benefits"
                                        formik={form}
                                    />
                                }
                            </ViewCard>
                        </Col>
                        <Col lg="12" xl="4">
                            <ViewCard
                                title="vehicle_info"
                                actions={
                                    (
                                        <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => form.setFieldValue("vehicles", [
                                        ...(form.values.vehicles || []),
                                        new VehicleEntity()
                                    ])}>
                                        <PlusCircle /> {t("ADD")}
                                    </Button>
                                )}
                                >
                                {
                                    form.values.vehicles?.length > 0 && 
                                    form.values.vehicles.map((v, i) => (
                                    <Row key={i} className="mt-1">
                                        <BaseSelect
                                            className="col-12"
                                            name={`vehicles.${i}.id`}
                                            placeholder="SELECT_VEHICLE"
                                            options={vehicles}
                                            valueKey="id"
                                            createLabel={veh => {
                                                const { type, type_other, make, model, transmission_type, year } = veh;
                                                let label = type === VehicleType.OTHER ? type_other : t(type);

                                                if (make) label += ` / ${make}`;

                                                if (model) label += ` / ${model}`;

                                                if (transmission_type) label += ` / ${t(transmission_type)}`;

                                                if (year) label += ` / ${year}`;
                                                return label; //`${()} / ${veh.make} / ${veh.model} / ${t(veh.transmission_type)} / ${veh.year}`
                                            }}
                                            formik={form}
                                            prepend={<>
                                                <InputGroup.Text>{i + 1}</InputGroup.Text>
                                                </>}
                                            append={<>
                                            <Button variant="outline-secondary" onClick={() => setCreateVehicle(i)}><PlusCircle /> {t("CREATE")}</Button>
                                            <Button variant="outline-danger" onClick={() => form.setFieldValue("vehicles", form.values.vehicles.filter((v, idx) => i != idx))}><DashCircle /></Button>
                                            </>}
                                            />
                                    </Row>))
                                }

                            </ViewCard>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <BaseTextArea
                            className="col-md-5 offset-md-1"
                            label="description"
                            name="description"
                            required
                            rows="3"
                            maxLength={250}
                            placeholder="description"
                            formik={form}
                        />
                        <BaseTextArea
                            className="col-md-5"
                            label={`${t("sms_summary")} (${t("max_100_characters")})`}
                            name="description_short"
                            required
                            rows="3"
                            maxLength="100"
                            placeholder="sms_summary"
                            formik={form}
                        />
                    </Row>
                    <hr />
                    <div className="row">
                        <ViewCard
                            title="requirements"
                            >
                            <Row>
                            <div className="col-md-6">
                                <BaseCheckList
                                    className="col-12"
                                    label="cdl_class"
                                    name="cdl_class"
                                    cols={2}
                                    labelPrefix="DriverLicenseType"
                                    enumType={DriverLicenseType}
                                    formik={form}
                                />
                                <BaseInput
                                    className="col-12"
                                    label="min_years_experience"
                                    name="min_years_experience"
                                    placeholder="min_years_experience"
                                    min="0"
                                    type="int"
                                    formik={form}
                                />
                                <BaseSelect
                                    className="col-12"
                                    label="min_degree"
                                    name="min_degree"
                                    placeholder="min_degree"
                                    labelPrefix="EducationLevel"
                                    enumType={EducationLevel}
                                    formik={form}
                                />
                                <div className="col-12">
                                    <label>{t("required_skills")}:</label>
                                    {form.touched.required_skills && typeof form.errors.required_skills === "string" ? <span className="text-danger small">{form.errors.required_skills}</span> : null}
                                    {form.values.required_skills.map((v, i) => {
                                        return (
                                            <Row key={i}>
                                                <BaseSelect
                                                    className="col-5"
                                                    label="type"
                                                    placeholder="type"
                                                    name={`required_skills.${i}.type`}
                                                    required
                                                    labelPrefix="JobEquipmentType"
                                                    enumType={JobEquipmentType}
                                                    formik={form}
                                                />
                                                <BaseInput
                                                    className="col-5"
                                                    label="years"
                                                    placeholder="years"
                                                    name={`required_skills.${i}.years`}
                                                    required
                                                    min="1"
                                                    type="int"
                                                    formik={form}
                                                />
                                                <div className="col-2 mt-4">
                                                    <button className="btn btn-yellow" name={i} onClick={removeRequiredSkill}>x</button>
                                                </div>
                                            </Row>);
                                    })}
                                    <div className="col-6 offset-6 text-end mt-2">
                                        <button className="btn btn-yellow" onClick={addRequiredSkills}>+ {t("more")}</button>
                                    </div>
                                </div>
                                <BaseTextArea
                                    className="col-12"
                                    label="other_required_skills"
                                    name="required_skills_other"
                                    placeholder="other_required_skills"
                                    rows="1"
                                    formik={form}
                                />
                                {
                                    form.values.employment_type === JobEmploymentType.OWNER_OPERATOR &&
                                    <div className="col-12">
                                        <label>{t("required_equipment")}:</label>
                                        {form.touched.required_equipment && typeof form.errors.required_equipment === "string" ? <span className="text-danger small">{form.errors.required_equipment}</span> : null}
                                        {form.values.required_equipment.map((v, i) => {
                                            const get = function (part, field) {
                                                if (part.required_equipment && part.required_equipment[i])
                                                    return part.required_equipment[i][field];
                                            }
                                            return (
                                                <Row key={i}>
                                                    <BaseSelect
                                                        className="col-5"
                                                        label="type"
                                                        placeholder="type"
                                                        name={`required_equipment.${i}.type`}
                                                        required
                                                        labelPrefix="JobEquipmentType"
                                                        enumType={JobEquipmentType}
                                                        formik={form}
                                                    />
                                                    <BaseInput
                                                        className="col-5"
                                                        label="quantity"
                                                        placeholder="quantity"
                                                        name={`required_equipment.${i}.quantity`}
                                                        required
                                                        min="1"
                                                        type="int"
                                                        formik={form}
                                                    />
                                                    <div className="col-2 mt-4">
                                                        <button className="btn btn-yellow" name={i} onClick={removeRequiredEquipment}>x</button>
                                                    </div>
                                                </Row>);
                                        })}
                                        <div className="col-6 offset-6 text-end mt-2">
                                            <button className="btn btn-yellow" onClick={addRequiredEquipment}>+ {t("more")}</button>
                                        </div>
                                    </div>
                                }
                                <BaseCheckList
                                    className="col-12"
                                    label="special_endorsements"
                                    name="required_endorsement"
                                    cols={2}
                                    labelPrefix="DriverEndorsement"
                                    enumType={DriverEndorsement}
                                    formik={form}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label="transmission_type"
                                    name="transmission_type_experience"
                                    cols={2}
                                    labelPrefix="VehicleTransmissionType"
                                    enumType={VehicleTransmissionType}
                                    formik={form}
                                />
                            </div>
                            
                            <div className="col-md-6">
                            <BaseSelect
                                className="col-12 mb-2"
                                label={t("pay_frequency")}
                                name="pay_frequency"
                                placeholder={t("pay_frequency")}
                                cols={2}
                                value={form.values.pay_frequency}
                                onChange={form.handleChange}
                                handleBlur={form.handleBlur}
                                touched={form.touched.pay_frequency}
                                error={form.errors.pay_frequency}
                                labelPrefix="JobPayFrequency"
                                enumType={JobPayFrequency}
                            />
                                <BaseCheck
                                    className="col-12"
                                    label="must_pass_drug_test"
                                    name="must_pass_drug_test"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12"
                                    label="must_have_clean_mvr"
                                    name="must_have_clean_mvr"
                                    formik={form}
                                />
                                {
                                    !form.values.must_have_clean_mvr &&
                                    <div className="col-12">
                                        <label>{t("mvr_requirements")}:</label>
                                        {form.touched.mvr_requirements && typeof form.errors.mvr_requirements === "string" ? <span className="text-danger small">{form.errors.mvr_requirements}</span> : null}
                                        {form.values.mvr_requirements.map((v, i) => {
                                            return (
                                                <div key={i} className="row">
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="max"
                                                        name={`mvr_requirements.${i}.max_count`}
                                                        required
                                                        value={v.max_count}
                                                        options={counts}
                                                        formik={form}
                                                    />
                                                    <BaseSelect
                                                        className="col-4"
                                                        label="type"
                                                        placeholder="type"
                                                        name={`mvr_requirements.${i}.type`}
                                                        required
                                                        labelPrefix="MvrType"
                                                        enumType={MvrType}
                                                        formik={form}
                                                    />
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="within"
                                                        name={`mvr_requirements.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={years}
                                                        formik={form}
                                                    />
                                                    <div className="col-2 mt-4">
                                                        <button className="btn btn-yellow" name={i} onClick={removeMvrRequirement}>x</button>
                                                    </div>
                                                </div>);
                                        })}
                                        <div className="col-6 offset-6 text-end mt-2">
                                            <button className="btn btn-yellow" onClick={addMvrRequirement}>+ {t("more")}</button>
                                        </div>
                                    </div>
                                }
                                <BaseCheck
                                    className="col-12"
                                    label="accept_sap_graduates"
                                    name="accept_sap_graduates"
                                    formik={form}
                                />
                                <BaseCheck
                                    className="col-12"
                                    label="no_criminal_history"
                                    name="must_have_clean_criminal_history"
                                    formik={form}
                                />
                                {
                                    !form.values.must_have_clean_criminal_history &&
                                    <div className="col-12">
                                        <label>{t("criminal_history")}:</label>
                                        {form.touched.criminal_history && typeof form.errors.criminal_history === "string" ? <span className="text-danger small">{form.errors.criminal_history}</span> : null}
                                        {form.values.criminal_history.map((v, i) => {
                                            const get = function (part, field) {
                                                if (part.criminal_history && part.criminal_history[i])
                                                    return part.criminal_history[i][field];
                                            }
                                            return (
                                                <div key={i} className="row">
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="max"
                                                        name={`criminal_history.${i}.max_count`}
                                                        required
                                                        options={counts}
                                                        formik={form}
                                                    />
                                                    <BaseSelect
                                                        className="col-4"
                                                        label="type"
                                                        placeholder="type"
                                                        name={`criminal_history.${i}.type`}
                                                        required
                                                        labelPrefix="CriminalHistoryType"
                                                        enumType={CriminalHistoryType}
                                                        formik={form}
                                                    />
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="within"
                                                        name={`criminal_history.${i}.max_years`}
                                                        required
                                                        options={years}
                                                        formik={form}
                                                    />
                                                    <div className="col-2 mt-4">
                                                        <button className="btn btn-yellow" name={i} onClick={removeCriminalHistoryRequirement}>x</button>
                                                    </div>
                                                </div>);
                                        })}
                                        <div className="col-6 offset-6 text-end mt-2">
                                            <button className="btn btn-yellow" onClick={addCriminalHistoryRequirement}>+ {t("more")}</button>
                                        </div>
                                    </div>
                                }
                                <BaseInput
                                    className="col-12"
                                    label="accidents_last_5_years"
                                    placeholder="count"
                                    name="max_accidents"
                                    min="0"
                                    type="int"
                                    formik={form}
                                />
                                <BaseTextArea
                                    className="col-12"
                                    label="other_safety_requirements"
                                    name="safety_requirements_other"
                                    placeholder="other_safety_requirements"
                                    rows="1"
                                    formik={form}
                                />
                            </div>
                            </Row>
                        </ViewCard>
                    </div>
                </form>

            </ChildPageLayout>
            <ViewModal
                title="CREATE_VEHICLE"
                show={typeof createVehicle === "number"}
                onCloseClick={() => setCreateVehicle(false)}
                >
                <VehicleForm
                    onSaveComplete={onVehicleAdded}
                />
            </ViewModal>
            <ViewModal
                title="CREATE_LOCATION"
                show={createLocation}
                onCloseClick={() => setCreateLocation(false)}
                >
                <LocationForm
                    onSaveComplete={onLocationAdded}
                />
            </ViewModal>
        </>
    )
};

Job.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
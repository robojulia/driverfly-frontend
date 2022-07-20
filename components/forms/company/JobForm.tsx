import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/useTranslation";
import { useEffectAsync } from "../../../utils/react";
import { useAuth } from "../../../hooks/useAuth";

import { BaseFormProps } from "./BaseFormProps";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { counts, year2Only, year3Only, year5Only, years } from "../../../utils/jobs";

import { DashCircle, PlusCircle } from "react-bootstrap-icons";

import { Button, Col, InputGroup, Row } from "react-bootstrap";
import EntityForm from "../../layouts/page/EntityForm";
import ViewCard from "../../viewDetails/viewCard";
import ViewModal from "../../viewDetails/viewModal";
import { VehicleForm } from "./VehicleForm";
import { LocationForm } from "./LocationForm";
import BaseInput from "../BaseInput";
import BaseSelect from "../BaseSelect";
import BaseCheckList from "../BaseCheckList";
import BaseTextArea from "../BaseTextArea";
import BaseCheck from "../BaseCheck";
import BaseRange from "../BaseRange";

import JobApi from "../../../pages/api/job";
import LocationApi from "../../../pages/api/location";
import VehicleApi from "../../../pages/api/vehicle";

import { JobEntity } from "../../../models/job/job.entity";
import { LocationEntity } from "../../../models/company/location.entity";
import { VehicleEntity } from "../../../models/company/vehicle.entity";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../../enums/jobs/job-employment-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { JobDeliveryType } from "../../../enums/jobs/job-delivery-type.enum";
import { JobTeamDriver } from "../../../enums/jobs/job-team-driver.enum";
import { JobPayFrequency } from "../../../enums/jobs/job-pay-frequency.enum";
import { JobPayMethod } from "../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../enums/jobs/job-benefits.enum";
import { VehicleType } from "../../../enums/vehicles/vehicle-type.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { JobDrugTestType } from "../../../enums/jobs/job-drug-test-type.enum";
import { CriminalHistoryType } from "../../../enums/users/criminal-history-type.enum";
import { MvrType } from "../../../enums/users/mvr-type.enum";
import { buildAddress } from "../../../utils/common";

export interface JobFormProps extends BaseFormProps<JobEntity> {

}

export function JobForm(props: JobFormProps) {
    const { t } = useTranslation();
    const { user, hasPermission } = useAuth();

    let { className, entity, onSaveComplete, onSaveError } = props;

    const form = useFormik({
        initialValues: new JobEntity(),
        validationSchema: JobEntity.yupSchema(),
        onSubmit: async (data) => {
            try {
                const jobApi = new JobApi();

                let job = null;
                if (entity?.id) {
                    job = await jobApi.update(entity.id, data);
                }
                else {
                    job = await jobApi.create(data);
                }

                toast.success(t("Forms.SUCCESS_{action}_{name}", { action: !!entity?.id ? "Forms.UPDATED" : "Forms.CREATED", name: "JOB" }, { translateProps: true }));
                if (onSaveComplete) onSaveComplete(job);
            }
            catch (e) {
                console.error("Unable to save job", e);
                globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast,
                    defaultMessage: t("Forms.FAIL_{action}_{name}", { action: !!entity?.id ? "Forms.UPDATED" : "Forms.CREATED", name: "JOB" }, { translateProps: true })});
                if (onSaveError) onSaveError(e);
            }
        }
    });

    useEffect(() => {
        if (entity)
            form.setValues(entity);
    }, [ entity ]);

    const [locations, setLocations ] = useState<LocationEntity[]>([]);
    const [vehicles, setVehicles ] = useState<VehicleEntity[]>([]);

    useEffectAsync(async () => {
        {
            const locationApi = new LocationApi();
            setLocations(await locationApi.list());
        }
        {
            const vehicleApi = new VehicleApi();
            setVehicles(await vehicleApi.list());
        }
    }, [ user ]);

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
                min_weekly_pay = (min_miles >= 0 && min_rate >= 0 ? parseFloat((min_miles * min_rate).toFixed(2)) : min_weekly_pay);
                max_weekly_pay = (max_miles >= 0 && max_rate >= 0 ? parseFloat((max_miles * max_rate).toFixed(2)) : max_weekly_pay);
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
                min_weekly_pay = (min_hours >= 0 && min_rate >= 0 ? parseFloat((min_hours * min_rate).toFixed(2)) : min_weekly_pay);
                max_weekly_pay = (max_hours >= 0 && max_rate >= 0 ? parseFloat((max_hours * max_rate).toFixed(2)) : max_weekly_pay);
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
                min_weekly_pay = min_salary >= 0 ? parseFloat((min_salary / 52).toFixed(2)) : min_weekly_pay;
                max_weekly_pay = max_salary >= 0 ? parseFloat((max_salary / 52).toFixed(2)) : min_weekly_pay;
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
            const v = name === field ? value : form.values[field];
            if (v != null && v != "") return parseFloat(v);
            // return v;
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
        [JobGeography.REGIONAL]: 1500,
        [JobGeography.OTR]: 3000
    };

    const onGeographyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        form.setValues({
            ...form.values,
            geography: value as JobGeography,
            max_applicant_radius: maxRadius[value]
        })

    }

    const [createVehicle, setCreateVehicle] = useState<boolean|number>(false);

    const onVehicleAdded = (vehicle: VehicleEntity) => {
        form.setFieldValue(`vehicles.${createVehicle}.id`, vehicle.id);
        setVehicles([
            ...vehicles,
            vehicle
        ]);
        setCreateVehicle(false);
    }

    const [createLocation, setCreateLocation] = useState(false);

    const onLocationAdded = (location: LocationEntity) => {
        form.setFieldValue(`location.id`, location.id);
        setLocations([
            ...locations,
            location
        ]);
        setCreateLocation(false);
    }

    return (
        <>
        <EntityForm
            className={className}
            onSubmit={form.handleSubmit}
            id={entity?.id}
            formik={form}
            >
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
                            placeholder="LOCATION"
                            formik={form}
                            valueKey="id"
                            createLabel={v => buildAddress(v)}
                            options={locations}
                            append={<Button variant="outline-secondary create_btn" disabled={!hasPermission("CanCreateLocation")} onClick={() => setCreateLocation(true)}><PlusCircle /> {t("CREATE")}</Button>}
                        />
                        <BaseInput
                            className="col-12"
                            label="expiration_date"
                            name="expiry_date"
                            placeholder="expiration_date"
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
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
                            placeholder="GEOGRAPHY"
                            name="geography"
                            required
                            formik={form}
                            onChange={onGeographyChange}
                            labelPrefix="JobGeography"
                            enumType={JobGeography}
                        />
                        {
                            form.values.geography &&
                            <BaseRange
                                className="col-12"
                                label="max_applicant_radius"
                                name="max_applicant_radius"
                                valueSuffix="mi"
                                required
                                min={1}
                                max={maxRadius[form.values.geography]}
                                formik={form}
                            />
                        }
                        <Row style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                            <BaseSelect
                                className={`col-${form.values.schedule === JobSchedule.OTHER ? 6 : 12}`}
                                label="SCHEDULE"
                                name="schedule"
                                required
                                placeholder="SCHEDULE"
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
                            label="EMPLOYMENT_TYPE"
                            name="employment_type"
                            required
                            placeholder
                            labelPrefix="JobEmploymentType"
                            enumType={JobEmploymentType}
                            formik={form}
                        />
                        <BaseCheckList
                            className="col-12"
                            label="EQUIPMENT_TYPE"
                            name="equipment_type"
                            cols={2}
                            labelPrefix="JobEquipmentType"
                            enumType={JobEquipmentType}
                            formik={form}
                        />
                        {
                            form.values.equipment_type.includes(JobEquipmentType.OTHER) &&
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
                            label="DELIVERY_TYPE"
                            name="delivery_type"
                            cols={2}
                            labelPrefix="JobDeliveryType"
                            enumType={JobDeliveryType}
                            formik={form}
                        />
                        <BaseSelect
                            className="col-12"
                            label="TEAM_DRIVERS"
                            name="team_drivers"
                            labelPrefix="JobTeamDriver"
                            enumType={JobTeamDriver}
                            formik={form}
                        />
                    </ViewCard>
                </Col>
                <Col lg="6" xl="4">
                    <ViewCard
                        title="BENEFITS"
                    >
                        <BaseSelect
                            className="col-12 mb-2"
                            label="PAY_FREQUENCY"
                            name="pay_frequency"
                            placeholder="PAY_FREQUENCY"
                            formik={form}
                            labelPrefix="JobPayFrequency"
                            enumType={JobPayFrequency}
                        />
                        <BaseSelect
                            className="col-12"
                            label="PAY_METHOD"
                            name="pay_method"
                            required
                            placeholder="PAY_METHOD"
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
                            label="BENEFITS"
                            name="benefits"
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
                                        placeholder="VEHICLE"
                                        options={vehicles}
                                        valueKey="id"
                                        createLabel={veh => {
                                            const { type, type_other, make, model, transmission_type, year } = veh;
                                            let label = type === VehicleType.OTHER ? type_other : t("VehicleType." + type);

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
                                            <Button variant="outline-secondary create_btn" disabled={!hasPermission("CanCreateVehicle")} onClick={() => setCreateVehicle(i)}><PlusCircle /> {t("CREATE")}</Button>
                                            <Button variant="outline-danger close_btn" onClick={() => form.setFieldValue("vehicles", form.values.vehicles.filter((v, idx) => i != idx))}><DashCircle /></Button>
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
                    className="col-md-12"
                    label="description"
                    name="description"
                    required
                    rows={3}
                    maxLength={1500}
                    placeholder="description"
                    formik={form}
                />
                {/* <BaseTextArea
                    className="col-md-5"
                    label={`${t("sms_summary")} (${t("max_100_characters")})`}
                    name="description_short"
                    required
                    rows="3"
                    maxLength="100"
                    placeholder="sms_summary"
                    formik={form}
                /> */}
            </Row>
            <hr />
            <div className="row px-3">
                <ViewCard
                    title="requirements"
                >
                    <Row>
                        <div className="col-md-6">
                            <BaseSelect
                                className="col-12"
                                label="MINIMUM_CDL_CLASS"
                                name="cdl_class"
                                placeholder="MINIMUM_CDL_CLASS"
                                labelPrefix="DriverLicenseType"
                                enumType={DriverLicenseType}
                                formik={form}
                            />
                            <BaseInput
                                className="col-12"
                                label="MIN_YEARS_EXPERIENCE"
                                name="min_years_experience"
                                placeholder
                                step={0.01}
                                min={0}
                                type="number"
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
                                <label>{t("REQUIRED_SKILLS")}:</label>
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
                                                <button className="btn btn-yellow" name={i.toString()} onClick={removeRequiredSkill}>x</button>
                                            </div>
                                        </Row>);
                                })}
                                <div className="col-6 offset-6 text-end mt-2 p-0">
                                    <button className="btn btn-yellow" onClick={addRequiredSkills}>+ {t("more")}</button>
                                </div>
                            </div>
                            <BaseTextArea
                                className="col-12"
                                label="other_required_skills"
                                name="required_skills_other"
                                placeholder="other_required_skills"
                                rows={1}
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
                                                    <button className="btn btn-yellow" name={i.toString()} onClick={removeRequiredEquipment}>x</button>
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

                            <BaseCheck
                                className="col-12"
                                label="must_pass_drug_test"
                                name="must_pass_drug_test"
                                formik={form}
                            />
                            <BaseCheckList
                                className="col-12"
                                label="drug_test_type"
                                name="drug_test_type"
                                cols={2}
                                labelPrefix="JobDrugTestType"
                                enumType={JobDrugTestType}
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
                                    <label>{t("MVR_REQUIREMENTS")}:</label>
                                    {form.touched.mvr_requirements && typeof form.errors.mvr_requirements === "string" ? <span className="text-danger small">{form.errors.mvr_requirements}</span> : null}
                                    {form.values.mvr_requirements.map((v, i) => {
                                        return (
                                            <div key={i} className="row">
                                                <BaseSelect
                                                    className="col-3"
                                                    label="MAX"
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
                                                {
                                                    form.values.mvr_requirements[i].type === MvrType.DUI &&
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="within"
                                                        name={`mvr_requirements.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={year2Only}
                                                        formik={form}
                                                    />
                                                }
                                                {
                                                    form.values.mvr_requirements[i].type === MvrType.MOVING_VIOLATION_NOT_AT_FAULT &&
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="within"
                                                        name={`mvr_requirements.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={year3Only}
                                                        formik={form}
                                                    />
                                                }
                                                {
                                                    (form.values.mvr_requirements[i].type === MvrType.INFRACTIONS ||
                                                        form.values.mvr_requirements[i].type === MvrType.TICKETS) &&
                                                    <BaseSelect
                                                        className="col-3"
                                                        label="within"
                                                        name={`mvr_requirements.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={year5Only}
                                                        formik={form}
                                                    />
                                                }
                                                <div className="col-2 mt-4">
                                                    <button className="btn btn-yellow" name={i.toString()} onClick={removeMvrRequirement}>x</button>
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
                                                    <button className="btn btn-yellow" name={i.toString()} onClick={removeCriminalHistoryRequirement}>x</button>
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
                                label="MAX_MOVING_VIOLATIONS"
                                placeholder="count"
                                name="max_moving_violations"
                                min="0"
                                type="int"
                                formik={form}
                            />
                            <BaseTextArea
                                className="col-12"
                                label="other_safety_requirements"
                                name="safety_requirements_other"
                                placeholder="other_safety_requirements"
                                rows={1}
                                formik={form}
                            />
                        </div>
                    </Row>
                </ViewCard>
            </div>

        </EntityForm>
        <ViewModal
            title={t("CREATE_{name}", { name: "VEHICLE" }, { translateProps: true })}
            show={typeof createVehicle === "number"}
            onCloseClick={() => setCreateVehicle(false)}
        >
            <VehicleForm
                onSaveComplete={onVehicleAdded}
            />
        </ViewModal>
        <ViewModal
            title={t("CREATE_{name}", { name: "TERMINAL" }, { translateProps: true })}
            show={createLocation}
            onCloseClick={() => setCreateLocation(false)}
        >
            <LocationForm
                onSaveComplete={onLocationAdded}
            />
        </ViewModal>
        </>
    );

}
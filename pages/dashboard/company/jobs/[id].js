
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import useAuth from '../../../../hooks/useAuth';
import Router from 'next/router';
import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRef, useEffect } from "react";

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";

import CompanyApi from "../../../api/company";
import LocationApi from "../../../api/location";
import VehicleApi from "../../../api/vehicle";

import BaseInput from "../../../../components/forms/BaseInput";
import BaseSelect from "../../../../components/forms/BaseSelect";
import BaseCheck from "../../../../components/forms/BaseCheck";
import BaseCheckList from "../../../../components/forms/BaseCheckList";
import BaseTextArea from "../../../../components/forms/BaseTextArea";
import BaseRange from "../../../../components/forms/BaseRange";
import BaseFile from "../../../../components/forms/BaseFile";
import stateList from "../../../../utils/stateList";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

import { useRouter } from "next/router"


import { getBase64 } from "../../../../utils/file";

import { counts, years } from "../../../../utils/jobs";

import { preventNegative, positiveInt } from "../../../../utils/input";

import { DriverDegree } from "../../../../enums/drivers/driver-degree.enum";
import { DriverLicenseType } from "../../../../enums/drivers/driver-license-type.enum";
import { DriverEndorsement } from "../../../../enums/drivers/driver-endorsement.enum";
import { MvrType } from "../../../../enums/drivers/mvr-type.enum"
import { CriminalHistoryType } from "../../../../enums/drivers/criminal-history-type.enum"

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

import "../../../../utils/yup"

import JobApi from "../../../api/job";

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
        initialValues: {
            title: null,
            location: {
                id: null,
                street: null,
                city: null,
                state: null,
                zip_code: null,
            },
            description: null,
            description_short: null,
            drivers_needed: null,
            expiry_date: null,
            geography: [],
            schedule: null,
            schedule_other: null,
            employment_type: null,
            equipment_type: [],
            equipment_type_other: null,
            delivery_type: [],
            team_drivers: null,
            pay_method: null,
            min_salary: null,
            max_salary: null,
            min_rate: null,
            max_rate: null,
            min_hours: null,
            max_hours: null,
            min_percent: null,
            max_percent: null,
            min_miles: null,
            max_miles: null,
            min_weekly_pay: null,
            max_weekly_pay: null,
            benefits: [],
            benefits_other: null,
            vehicles: [],
            cdl_class: [],
            min_years_experience: null,
            min_degree: null,
            required_skills: [],
            required_skills_other: null,
            required_equipment: [],
            required_endorsement: [],
            transmission_type_experience: [],
            max_applicant_radius: 10,
            must_pass_drug_test: true,
            must_have_clean_mvr: true,
            mvr_requirements: [],
            accept_sap_graduates: false,
            must_have_clean_criminal_history: true,
            criminal_history: [],
            max_accidents: null,
            safety_requirements_other: null
        },
        validationSchema: yup.object({
            title: yup.string().required(t("this_field_is_required")).nullable(),
            location: yup.object({
                id: yup.number().nullable(),
                street: yup.string()
                    .when("id", {
                        is: v => !!!v,
                        then: yup.string().required(t("this_field_is_required")).nullable()
                    }).nullable(),
                city: yup.string()
                    .when("id", {
                        is: v => !!!v,
                        then: yup.string().required(t("this_field_is_required")).nullable()
                    }).nullable(),
                state: yup.string()
                    .when("id", {
                        is: v => !!!v,
                        then: yup.string().required(t("this_field_is_required")).nullable()
                    }).nullable(),
                zip_code: yup.string()
                    .when("id", {
                        is: v => !!!v,
                        then: yup.string().required(t("this_field_is_required")).nullable()
                    }).nullable(),
            }),
            description: yup.string().required(t("this_field_is_required")).nullable(),
            description_short: yup.string().required(t("this_field_is_required")).nullable(),
            drivers_needed: yup.number().min(0).nullable(),
            expiry_date: yup.date().nullable(),
            geography: yup.array(
                yup.string().enum(JobGeography)
            ).min(1, t("this_field_is_required")),
            schedule: yup.string().enum(JobSchedule).required(t("this_field_is_required")).nullable(),
            schedule_other: yup.string().when("schedule", {
                is: v => v === JobSchedule.OTHER,
                then: yup.string().required(t("this_field_is_required")).nullable()
            }).nullable(),
            employment_type: yup.string().enum(JobEmploymentType).required(t("this_field_is_required")).nullable(),
            equipment_type: yup.array(
                yup.string().enum(JobEquipmentType)
            ),
            equipment_type_other: yup.string().when("equipment_type", {
                is: a => a.includes(JobEquipmentType.OTHER),
                then: yup.string().required(t("this_field_is_required")).nullable()
            }).nullable(),
            delivery_type: yup.array(
                yup.string().enum(JobDeliveryType)
            ).min(1, t("this_field_is_required")),
            team_drivers: yup.string().enum(JobTeamDriver).required(t("this_field_is_required")).nullable(),
            pay_method: //yup.array(
                yup.string().enum(JobPayMethod).required(t("this_field_is_required")).nullable(),
            //),
            min_salary: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.SALARY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            max_salary: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.SALARY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            min_rate: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE || v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            max_rate: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE || v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            min_hours: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            max_hours: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.HOURLY,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            min_percent: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.PERCENT_PER_MOVE || v === JobPayMethod.PERCENT_PER_WEIGHT,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            max_percent: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.PERCENT_PER_MOVE || v === JobPayMethod.PERCENT_PER_WEIGHT,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            min_miles: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            max_miles: yup.number().when("pay_method", {
                is: v => v === JobPayMethod.RATE_PER_MILE,
                then: yup.number().min(0).required(t("this_field_is_required")).nullable()
            }).nullable(),
            min_weekly_pay: yup.number().min(0).required(t("this_field_is_required")).nullable(),
            max_weekly_pay: yup.number().min(0).required(t("this_field_is_required")).nullable(),
            benefits: yup.array(
                yup.string().enum(JobBenefits)
            ),
            benefits_other: yup.string().when("benefits", {
                is: v => v.includes(JobBenefits.OTHER),
                then: yup.string().required(t("this_field_is_required")).nullable()
            }).nullable(),
            vehicles: yup.array(yup.object({
                id: yup.number().nullable(),
                type: yup.string().when("id", {
                    is: v => !v,
                    then: yup.string().required(t("this_field_is_required")).enum(VehicleType).nullable()
                }).nullable(),
                type_other: yup.string().when(["id", "type"], {
                    is: (id, type) => !id && type === VehicleType.OTHER,
                    then: yup.string().required(t("this_field_is_required")).nullable()
                }).nullable(),
                transmission_type: yup.string().nullable(),
                make: yup.string().when("id", {
                    is: v => !v,
                    then: yup.string().required(t("this_field_is_required")).nullable()
                }).nullable(),
                model: yup.string().when("id", {
                    is: v => !v,
                    then: yup.string().required(t("this_field_is_required")).nullable()
                }).nullable(),
                year: yup.number().when("id", {
                    is: v => !v,
                    then: yup.number().required(t("this_field_is_required")).min(1900).nullable()
                }).nullable(),
                photo: yup.object({
                    name: yup.string().nullable(),
                    path: yup.string().nullable()
                }).nullable()
            })).nullable(),
            cdl_class: yup.array(
                yup
                    .string()
                    .enum(DriverLicenseType)
            ),
            min_years_experience: yup.number().min(0).nullable(),
            min_degree: yup.string().enum(DriverDegree).nullable(),
            required_skills: yup.array(yup.object({
                type: yup.string().required(t("this_field_is_required")).nullable(),
                years: yup.number().min(1).required(t("this_field_is_required")).nullable(),
            })).unique(t("{name}_must_be_unique_in_list", { name: t("type") }), "type", v => v.type),
            required_skills_other: yup.string().nullable(),
            required_equipment: yup.array(yup.object({
                type: yup.string().required(t("this_field_is_required")).nullable(),
                quantity: yup.number().min(1).required(t("this_field_is_required")).nullable(),
            })).unique(t("{name}_must_be_unique_in_list", { name: t("type") }), "type", v => v.type),
            required_endorsement: yup.array(
                yup.string().enum(DriverEndorsement)
            ),
            transmission_type_expereince: yup.array(
                yup.string().enum(VehicleTransmissionType)
            ),
            max_applicant_radius: yup.number().min(1).nullable(),
            must_pass_drug_test: yup.boolean().default(true),
            must_have_clean_mvr: yup.boolean().default(true),
            mvr_requirements: yup.array(yup.object({
                type: yup.string().enum(MvrType).required(t("this_field_is_required")).nullable(),
                max_count: yup.number().required(t("this_field_is_required")).nullable(),
                max_years: yup.number().required(t("this_field_is_required")).nullable(),
            })).unique(t("{name}_must_be_unique_in_list", { name: t("type") }), "type", v => v.type),
            accept_sap_graduates: yup.boolean().default(false),
            must_have_clean_criminal_history: yup.boolean().default(true),
            criminal_history: yup.array(yup.object({
                type: yup.string().enum(CriminalHistoryType).required(t("this_field_is_required")).nullable(),
                max_count: yup.number().required(t("this_field_is_required")).nullable(),
                max_years: yup.number().required(t("this_field_is_required")).nullable(),
            })).unique(t("{name}_must_be_unique_in_list", { name: t("type") }), "type", v => v.type),
            max_accidents: yup.number().min(0).nullable(),
            safety_requirements_other: yup.string().nullable()
        }),
        onSubmit: async (data) => {
            data.min_weekly_pay = parseFloat(data.min_weekly_pay)
            data.max_weekly_pay = parseFloat(data.max_weekly_pay)

            try {
                // create the location (if new)
                if (!data.location.id) {
                    // create new location
                    const locationApi = new LocationApi();
                    const location = await locationApi.create(data.location);

                    set_locations([
                        ...locations,
                        location
                    ]);

                    form.setFieldValue("location", {
                        id: location.id,
                        street: null,
                        city: null,
                        state: null,
                        zip_code: null,
                    });

                    data.location = { id: location.id };
                }

                if (data.vehicles.length > 0) {
                    const vehicleApi = new VehicleApi();
                    for (let i = 0; i < data.vehicles.length; i++) {
                        let vehicle = data.vehicles[i];

                        if (!vehicle.id) {
                            vehicle = await vehicleApi.create(vehicle);

                            data.vehicles[i] = { id: vehicle.id };

                            set_vehicles([
                                ...vehicles,
                                vehicle
                            ]);
                        }
                    }

                    form.setFieldValue(`vehicles`, data.vehicles);
                }

                // iterate through vehicles, create new where needed
                const jobApi = await new JobApi();

                let job = null;
                if (id) {
                    job = await jobApi.update(id, data);
                }
                else {
                    job = await jobApi.create(data);
                }

                toast.success(t("successfully_saved_information"));
                setTimeout(
                    () => Router.push(backPath),
                    2000);
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
                geography: job.geography || [],
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
                safety_requirements_other: job.safety_requirements_other
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

    }, [ id ]);

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

    function addVehicle(e) {
        e.preventDefault();
        form.setValues({
            ...form.values,
            vehicles: [
                ...form.values.vehicles,
                {
                    id: null,
                    type: null,
                    type_other: null,
                    transmission_type: null,
                    make: null,
                    model: null,
                    year: null,
                    photo: null
                }
            ],
        });
    }

    function removeVehicle(e) {
        e.preventDefault();

        const { name } = e.target;

        form.setValues({
            ...form.values,
            vehicles: form.values.vehicles.filter((v, i) => i != name),
        });
    }

    function changeVehicle(e) {
        e.preventDefault();
        const { name, value } = e.target;

        const [veh, idx, id] = name.split(".");

        form.setValues({
            ...form.values,
            vehicles: form.values.vehicles.map((v, i) => {
                if (i == idx) {
                    if (!!value) {
                        return {
                            id: value,
                            type: null,
                            type_other: null,
                            transmission_type: null,
                            make: null,
                            model: null,
                            year: null,
                            photo: null,
                        };
                    }
                    else {
                        return {
                            ...v,
                            id: null,
                        };
                    }
                }

                return v;
            })
        });
    }

    const [pdfModel, set_pdfModel] = useState({
        name: null,
        url: null,
    });

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const uploadHandler = async (e) => {
        const { target: { name, files } } = e;

        let photo = null;
        if (files && files[0]) {
            const file = files[0];

            photo = {
                visibility: "PUBLIC",
                name: file.name,
                mime_type: file.type,
                path: URL.createObjectURL(file),
                file_base64: await getBase64(file)
            };
        }

        form.setFieldValue(name, photo);

    }

    const viewHandler = async (e) => {
        const { target: { name } } = e;

        const file = form.getFieldMeta(name).value;
        console.log(file);

        let url = file.path;

        set_pdfModel({
            name: file.name,
            url: url
        });
    }

    const hideModelHandler = (e) => {
        set_pdfModel({
            name: null, url: null
        });
    }

    /**
     * 
     * @param {React.ChangeEvent<HTMLSelectElement | HTMLInputElement} e 
     */
    const onIntChange = (e) => {
        let { name, value } = e.target;

        console.log(name, value, typeof value);

        if (typeof value === "string") {
            value = parseInt(value);
            console.log("new value:", value, typeof value);
            if (isNaN(value)) value = null;
        }

        form.setFieldValue(name, value);
    }

    const onFloatChange = (e) => {
        let { name, value } = e.target;

        if (typeof value === "string") {
            value = parseFloat(value);
            if (isNaN(value)) value = null;
        }

        form.setFieldValue(name, value);
    }

    const handleBack = (e) => {
        e.preventDefault();
        router.push(backPath);

    }
    return (

        <>

            <ToastContainer />
            <div>
                <h2>
                    <span style={{cursor: "pointer"}} onClick={handleBack}><ArrowBackIosNewIcon /></span>
                    {t(id ? "EDIT_JOB" : "CREATE_JOB")}
                </h2>
                <div className='container-fluid'>
                    <div className="modal-header border-0 add_job__container">
                    </div>
                    <form className="modal-body" onSubmit={form.handleSubmit} >
                        <div className="row">
                            <BaseInput
                                className="col-md-6"
                                label={t("title")}
                                required
                                name="title"
                                placeholder={t("title")}
                                value={form.values.title}
                                touched={form.touched.title}
                                error={form.errors.title}
                                onChange={form.handleChange}
                                handleBlur={form.handleBlur}
                            />
                        </div>
                        <div className="row mt-1">
                            <div className="col-md-4">
                                <h3>{t("basic_details")}</h3>
                                <BaseSelect
                                    className="col-12"
                                    label={t("location")}
                                    name="location.id"
                                    required
                                    placeholder={t("new_location")}
                                    value={form.values.location.id}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.location?.id}
                                    error={form.errors.location?.id}
                                    valueKey="id"
                                    labelKey="street"
                                    options={locations}
                                />
                                {(
                                    !!!form.values.location.id &&
                                    <>
                                        <BaseInput
                                            className="col-12"
                                            label={t("street")}
                                            name="location.street"
                                            required
                                            placeholder={t("street")}
                                            value={form.values.location.street}
                                            touched={form.touched.location?.street}
                                            error={form.errors.location?.street}
                                            onChange={form.handleChange}
                                            handleBlur={form.handleBlur}
                                        />
                                        <BaseInput
                                            className="col-12"
                                            label={t("city")}
                                            name="location.city"
                                            required
                                            placeholder={t("city")}
                                            value={form.values.location.city}
                                            touched={form.touched.location?.city}
                                            error={form.errors.location?.city}
                                            onChange={form.handleChange}
                                            handleBlur={form.handleBlur}
                                        />
                                        <div className="row">
                                            <BaseSelect
                                                className="col-7"
                                                label={t("state")}
                                                name="location.state"
                                                required
                                                placeholder={t("state")}
                                                value={form.values.location.state}
                                                onChange={form.handleChange}
                                                handleBlur={form.handleBlur}
                                                touched={form.touched.location?.state}
                                                error={form.errors.location?.state}
                                                valueKey="value"
                                                labelKey="label"
                                                options={stateList}
                                            />
                                            <BaseInput
                                                className="col-5"
                                                label={t("zip_code")}
                                                name="location.zip_code"
                                                required
                                                placeholder={t("zip_code")}
                                                value={form.values.location.zip_code}
                                                touched={form.touched.location?.zip_code}
                                                error={form.errors.location?.zip_code}
                                                onChange={form.handleChange}
                                                handleBlur={form.handleBlur}
                                            />
                                        </div>
                                    </>
                                )}
                                <BaseInput
                                    className="col-12"
                                    label={t("expiration_date")}
                                    name="expiry_date"
                                    placeholder={t("expiration_date")}
                                    type="date"
                                    value={form.values.expiry_date}
                                    touched={form.touched.expiry_date}
                                    error={form.errors.expiry_date}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                />
                                <BaseInput
                                    className="col-12"
                                    label={t("drivers_needed")}
                                    name="drivers_needed"
                                    placeholder={t("drivers_needed")}
                                    type="number"
                                    value={form.values.drivers_needed}
                                    touched={form.touched.drivers_needed}
                                    error={form.errors.drivers_needed}
                                    onKeyDown={preventNegative}
                                    onChange={onIntChange}
                                    handleBlur={form.handleBlur}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label={t("geography")}
                                    name="geography"
                                    required
                                    cols={3}
                                    value={form.values.geography}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.geography}
                                    error={form.errors.geography}
                                    valueKey="key"
                                    labelKey="label"
                                    labelPrefix="JobGeography"
                                    enumType={JobGeography}
                                />
                                <div className="row">
                                    <BaseSelect
                                        className={`col-${form.values.schedule === JobSchedule.OTHER ? 6 : 12}`}
                                        label={t("schedule")}
                                        name="schedule"
                                        required
                                        placeholder={t("schedule")}
                                        value={form.values.schedule}
                                        touched={form.touched.schedule}
                                        error={form.errors.schedule}
                                        onChange={form.handleChange}
                                        handleBlur={form.handleBlur}
                                        labelPrefix="JobSchedule"
                                        enumType={JobSchedule}
                                    />
                                    {
                                        form.values.schedule === JobSchedule.OTHER &&
                                        <BaseInput
                                            className="col-6"
                                            label={t("other_schedule")}
                                            required
                                            name="schedule_other"
                                            placeholder={t("schedule")}
                                            value={form.values.schedule_other}
                                            touched={form.touched.schedule_other}
                                            error={form.errors.schedule_other}
                                            onChange={form.handleChange}
                                            handleBlur={form.handleBlur}
                                        />
                                    }
                                </div>
                                <BaseSelect
                                    className="col-12"
                                    label={t("employment_type")}
                                    name="employment_type"
                                    required
                                    placeholder={t("employment_type")}
                                    value={form.values.employment_type}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.employment_type}
                                    error={form.errors.employment_type}
                                    labelPrefix="JobEmploymentType"
                                    enumType={JobEmploymentType}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label={t("equipment_type")}
                                    name="equipment_type"
                                    placeholder={t("equipment_type")}
                                    cols={2}
                                    value={form.values.equipment_type}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.equipment_type}
                                    error={form.errors.equipment_type}
                                    labelPrefix="JobEquipmentType"
                                    enumType={JobEquipmentType}
                                />
                                {
                                    form.values.equipment_type.includes(JobSchedule.OTHER) &&
                                    <BaseInput
                                        className="col-12"
                                        required
                                        label={t("other_equipment_type")}
                                        name="equipment_type_other"
                                        placeholder={t("equipment_type")}
                                        value={form.values.equipment_type_other}
                                        touched={form.touched.equipment_type_other}
                                        error={form.errors.equipment_type_other}
                                        onChange={form.handleChange}
                                        handleBlur={form.handleBlur}
                                    />
                                }
                                <BaseCheckList
                                    className="col-12"
                                    label={t("delivery_type")}
                                    name="delivery_type"
                                    required
                                    placeholder={t("delivery_type")}
                                    cols={2}
                                    value={form.values.delivery_type}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.delivery_type}
                                    error={form.errors.delivery_type}
                                    labelPrefix="JobDeliveryType"
                                    enumType={JobDeliveryType}
                                />
                                <BaseSelect
                                    className="col-12"
                                    label={t("team_drivers")}
                                    name="team_drivers"
                                    required
                                    placeholder={t("team_drivers")}
                                    value={form.values.team_drivers}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.team_drivers}
                                    error={form.errors.team_drivers}
                                    labelPrefix="JobTeamDriver"
                                    enumType={JobTeamDriver}
                                />
                            </div>
                            <div className="col-md-4">
                                <h3>{t("benefits")}</h3>
                                <BaseSelect
                                    className="col-12"
                                    label={t("pay_method")}
                                    name="pay_method"
                                    required
                                    placeholder={t("pay_method")}
                                    value={form.values.pay_method}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.pay_method}
                                    error={form.errors.pay_method}
                                    labelPrefix="JobPayMethod"
                                    enumType={JobPayMethod}
                                />
                                {
                                    (form.values.pay_method === JobPayMethod.PERCENT_PER_MOVE ||
                                        form.values.pay_method === JobPayMethod.PERCENT_PER_WEIGHT) &&
                                    <div className="row">
                                        <BaseInput
                                            className="col-6"
                                            label={t("min_percent")}
                                            name="min_percent"
                                            required
                                            placeholder={t("min_percent")}
                                            type="number"
                                            value={form.values.min_percent}
                                            onKeyDown={preventNegative}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.min_percent}
                                            error={form.errors.min_percent}
                                        />
                                        <BaseInput
                                            className="col-6"
                                            label={t("max_percent")}
                                            name="max_percent"
                                            required
                                            placeholder={t("max_percent")}
                                            type="number"
                                            value={form.values.max_percent}
                                            onKeyDown={preventNegative}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.max_percent}
                                            error={form.errors.max_percent}
                                        />
                                    </div>
                                }
                                {
                                    form.values.pay_method === JobPayMethod.RATE_PER_MILE &&
                                    <div className="row">
                                        <BaseInput
                                            className="col-6"
                                            label={t("min_miles")}
                                            name="min_miles"
                                            required
                                            placeholder={t("min_miles")}
                                            type="number"
                                            value={form.values.min_miles}
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.min_miles}
                                            error={form.errors.min_miles}
                                        />
                                        <BaseInput
                                            className="col-6"
                                            label={t("max_miles")}
                                            name="max_miles"
                                            required
                                            placeholder={t("max_miles")}
                                            type="number"
                                            value={form.values.max_miles}
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.max_miles}
                                            error={form.errors.max_miles}
                                        />
                                    </div>
                                }
                                {
                                    form.values.pay_method === JobPayMethod.HOURLY &&
                                    <div className="row">
                                        <BaseInput
                                            className="col-6"
                                            label={t("min_hours")}
                                            name="min_hours"
                                            required
                                            placeholder={t("min_hours")}
                                            value={form.values.min_hours}
                                            type="number"
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.min_hours}
                                            error={form.errors.min_hours}
                                        />
                                        <BaseInput
                                            className="col-6"
                                            label={t("max_hours")}
                                            name="max_hours"
                                            required
                                            placeholder={t("max_hours")}
                                            type="number"
                                            value={form.values.max_hours}
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.max_hours}
                                            error={form.errors.max_hours}
                                        />
                                    </div>
                                }
                                {
                                    (form.values.pay_method === JobPayMethod.RATE_PER_MILE ||
                                        form.values.pay_method === JobPayMethod.HOURLY) &&
                                    <div className="row">
                                        <BaseInput
                                            className="col-6"
                                            label={t("min_rate")}
                                            name="min_rate"
                                            required
                                            placeholder={t("min_rate")}
                                            type="number"
                                            value={form.values.min_rate}
                                            onKeyDown={preventNegative}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.min_rate}
                                            error={form.errors.min_rate}
                                        />
                                        <BaseInput
                                            className="col-6"
                                            label={t("max_rate")}
                                            name="max_rate"
                                            required
                                            placeholder={t("max_rate")}
                                            type="number"
                                            value={form.values.max_rate}
                                            onKeyDown={preventNegative}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.max_rate}
                                            error={form.errors.max_rate}
                                        />
                                    </div>
                                }
                                {
                                    (form.values.pay_method === JobPayMethod.SALARY) &&
                                    <div className="row">
                                        <BaseInput
                                            className="col-6"
                                            label={t("min_salary")}
                                            name="min_salary"
                                            required
                                            placeholder={t("min_salary")}
                                            type="number"
                                            value={form.values.min_salary}
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.min_salary}
                                            error={form.errors.min_salary}
                                        />
                                        <BaseInput
                                            className="col-6"
                                            label={t("max_salary")}
                                            name="max_salary"
                                            placeholder={t("max_salary")}
                                            type="number"
                                            value={form.values.max_salary}
                                            onKeyDown={positiveInt}
                                            onChange={handlePayMethodUpdate}
                                            handleBlur={form.handleBlur}
                                            touched={form.touched.max_salary}
                                            error={form.errors.max_salary}
                                        />
                                    </div>
                                }
                                <div className="row">
                                    <BaseInput
                                        className="col-6"
                                        label={t("min_weekly")}
                                        name="min_weekly_pay"
                                        required
                                        placeholder={t("min_weekly")}
                                        type="number"
                                        value={form.values.min_weekly_pay}
                                        onKeyDown={preventNegative}
                                        onChange={form.handleChange}
                                        handleBlur={form.handleBlur}
                                        touched={form.touched.min_weekly_pay}
                                        error={form.errors.min_weekly_pay}
                                    />
                                    <BaseInput
                                        className="col-6"
                                        label={t("max_weekly")}
                                        name="max_weekly_pay"
                                        required
                                        placeholder={t("max_weekly")}
                                        type="number"
                                        value={form.values.max_weekly_pay}
                                        onKeyDown={preventNegative}
                                        onChange={form.handleChange}
                                        handleBlur={form.handleBlur}
                                        touched={form.touched.max_weekly_pay}
                                        error={form.errors.max_weekly_pay}
                                    />
                                </div>
                                {/* todo: add job pay information */}
                                <BaseCheckList
                                    className="col-12"
                                    label={t("benefits")}
                                    name="benefits"
                                    placeholder={t("benefits")}
                                    cols={2}
                                    value={form.values.benefits}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.benefits}
                                    error={form.errors.benefits}
                                    labelPrefix="JobBenefits"
                                    enumType={JobBenefits}
                                />
                                {
                                    form.values.benefits.includes(JobBenefits.OTHER) &&
                                    <BaseInput
                                        className="col-12"
                                        label={t("additional_benefits")}
                                        name="benefits_other"
                                        required
                                        placeholder={t("benefits")}
                                        value={form.values.benefits_other}
                                        touched={form.touched.benefits_other}
                                        error={form.errors.benefits_other}
                                        onChange={form.handleChange}
                                        handleBlur={form.handleBlur}
                                    />
                                }
                            </div>
                            <div className="col-md-4">
                                <h3>{t("vehicle_info")}</h3>
                                {form.touched.vehicles && typeof form.errors.vehicles === "string" ? <span className="text-danger small">{form.errors.vehicles}</span> : null}
                                {form.values.vehicles.map((v, i) => {
                                    const get = function (part, field) {
                                        if (part.vehicles && part.vehicles[i])
                                            return part.vehicles[i][field];
                                    }
                                    const basePath = `vehicles.${i}`;
                                    return (
                                        <div key={i} className="row">
                                            <BaseSelect
                                                className="col-10"
                                                label={`${t("vehicle")} ${i + 1}`}
                                                name={`${basePath}.id`}
                                                placeholder={t("new_vehicle")}
                                                value={v.id}
                                                onChange={changeVehicle}
                                                handleBlur={form.handleBlur}
                                                touched={get(form.touched, "id")}
                                                error={get(form.errors, "id")}
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
                                            />
                                            <div className="col-2 mt-4">
                                                <button className="btn btn-yellow" name={i} onClick={removeVehicle}>x</button>
                                            </div>
                                            {
                                                !!!v.id &&
                                                <>
                                                    <BaseSelect
                                                        className={`col-${v.type === VehicleType.OTHER ? 6 : 12}`}
                                                        label={t("type")}
                                                        name={`${basePath}.type`}
                                                        required
                                                        placeholder={t("type")}
                                                        value={v.type}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "type")}
                                                        error={get(form.errors, "type")}
                                                        labelPrefix="VehicleType"
                                                        enumType={VehicleType}
                                                    />
                                                    {
                                                        v.type === VehicleType.OTHER &&
                                                        <BaseInput
                                                            className="col-6"
                                                            label={t("other")}
                                                            name={`${basePath}.type_other`}
                                                            required
                                                            placeholder={t("type")}
                                                            value={v.type_other}
                                                            onChange={form.handleChange}
                                                            handleBlur={form.handleBlur}
                                                            touched={get(form.touched, "type_other")}
                                                            error={get(form.errors, "type_other")}
                                                        />
                                                    }
                                                    <BaseInput
                                                        className="col-6"
                                                        label={t("make")}
                                                        name={`${basePath}.make`}
                                                        required
                                                        placeholder={t("make")}
                                                        value={v.make}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "make")}
                                                        error={get(form.errors, "make")}
                                                    />
                                                    <BaseInput
                                                        className="col-6"
                                                        label={t("model")}
                                                        name={`${basePath}.model`}
                                                        required
                                                        placeholder={t("model")}
                                                        value={v.model}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "model")}
                                                        error={get(form.errors, "model")}
                                                    />
                                                    <BaseSelect
                                                        className={`col-6`}
                                                        label={t("transmission")}
                                                        name={`${basePath}.transmission_type`}
                                                        placeholder={t("transmission_type")}
                                                        value={v.transmission_type}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "transmission_type")}
                                                        error={get(form.errors, "transmission_type")}
                                                        enumType={VehicleTransmissionType}
                                                    />
                                                    <BaseInput
                                                        className="col-6"
                                                        label={t("year")}
                                                        name={`${basePath}.year`}
                                                        required
                                                        placeholder={t("year")}
                                                        value={v.year}
                                                        type="number"
                                                        onKeyDown={preventNegative}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "year")}
                                                        error={get(form.errors, "year")}
                                                    />
                                                    <BaseFile
                                                        className="col-6"
                                                        label={t("photo")}
                                                        name={`${basePath}.photo`}
                                                        accept="image/*"
                                                        value={v.photo}
                                                        onChange={uploadHandler}
                                                        onView={viewHandler}
                                                        onDelete={uploadHandler}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "photo")}
                                                        error={get(form.errors, "photo")}
                                                    />
                                                </>
                                            }
                                        </div>
                                    )
                                })}
                                <div className="col-6 offset-6 text-end mt-2">
                                    <button className="btn btn-yellow" onClick={addVehicle}>+ {t("more")}</button>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <BaseTextArea
                                className="col-md-5 offset-md-1"
                                label={t("description")}
                                name="description"
                                required
                                rows="3"
                                placeholder={t("description")}
                                value={form.values.description}
                                touched={form.touched.description}
                                error={form.errors.description}
                                onChange={form.handleChange}
                                handleBlur={form.handleBlur}
                            />
                            <BaseTextArea
                                className="col-md-5"
                                label={`${t("sms_summary")} (${t("max_100_characters")})`}
                                name="description_short"
                                required
                                rows="3"
                                maxLength="100"
                                placeholder={t("sms_summary")}
                                value={form.values.description_short}
                                touched={form.touched.description_short}
                                error={form.errors.description_short}
                                onChange={form.handleChange}
                                handleBlur={form.handleBlur}
                            />
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-12">
                                <h3>{t("requirements")}</h3>
                            </div>
                            <div className="col-md-6">
                                <BaseRange
                                    className="col-12"
                                    label={t("max_applicant_radius")}
                                    name="max_applicant_radius"
                                    required
                                    min={1}
                                    max={100}
                                    value={form.values.max_applicant_radius}
                                    onChange={onIntChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.max_applicant_radius}
                                    error={form.errors.max_applicant_radius}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label={t("cdl_class")}
                                    name="cdl_class"
                                    cols={2}
                                    value={form.values.cdl_class}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.cdl_class}
                                    error={form.errors.cdl_class}
                                    labelPrefix="DriverLicenseType"
                                    enumType={DriverLicenseType}
                                />
                                <BaseInput
                                    className="col-12"
                                    label={t("min_years_experience")}
                                    name="min_years_experience"
                                    placeholder={t("min_years_experience")}
                                    value={form.values.min_years_experience}
                                    min="0"
                                    type="number"
                                    onKeyDown={preventNegative}
                                    onChange={onIntChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.min_years_experience}
                                    error={form.errors.min_years_experience}
                                />
                                <BaseSelect
                                    className="col-12"
                                    label={t("min_degree")}
                                    name="min_degree"
                                    placeholder={t("min_degree")}
                                    value={form.values.min_degree}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.min_degree}
                                    error={form.errors.min_degree}
                                    labelPrefix="DriverDegree"
                                    enumType={DriverDegree}
                                />
                                <div className="col-12">
                                    <label>{t("required_skills")}:</label>
                                    {form.touched.required_skills && typeof form.errors.required_skills === "string" ? <span className="text-danger small">{form.errors.required_skills}</span> : null}
                                    {form.values.required_skills.map((v, i) => {
                                        const get = function (part, field) {
                                            if (part.required_skills && part.required_skills[i])
                                                return part.required_skills[i][field];
                                        }
                                        return (
                                            <div key={i} className="row">
                                                <BaseSelect
                                                    className="col-5"
                                                    label={t("type")}
                                                    placeholder={t("type")}
                                                    name={`required_skills.${i}.type`}
                                                    required
                                                    value={v.type}
                                                    onChange={form.handleChange}
                                                    handleBlur={form.handleBlur}
                                                    touched={get(form.touched, "type")}
                                                    error={get(form.errors, "type")}
                                                    labelPrefix="JobEquipmentType"
                                                    enumType={JobEquipmentType}
                                                />
                                                <BaseInput
                                                    className="col-5"
                                                    label={t("years")}
                                                    placeholder={t("years")}
                                                    name={`required_skills.${i}.years`}
                                                    required
                                                    value={v.years}
                                                    min="1"
                                                    type="number"
                                                    onKeyDown={positiveInt}
                                                    onChange={onIntChange}
                                                    handleBlur={form.handleBlur}
                                                    touched={get(form.touched, "years")}
                                                    error={get(form.errors, "years")}
                                                />
                                                <div className="col-2 mt-4">
                                                    <button className="btn btn-yellow" name={i} onClick={removeRequiredSkill}>x</button>
                                                </div>
                                            </div>);
                                    })}
                                    <div className="col-6 offset-6 text-end mt-2">
                                        <button className="btn btn-yellow" onClick={addRequiredSkills}>+ {t("more")}</button>
                                    </div>
                                </div>
                                <BaseTextArea
                                    className="col-12"
                                    label={t("other_required_skills")}
                                    name="required_skills_other"
                                    placeholder={t("other_required_skills")}
                                    value={form.values.required_skills_other}
                                    rows="1"
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.required_skills_other}
                                    error={form.errors.required_skills_other}
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
                                                <div key={i} className="row">
                                                    <BaseSelect
                                                        className="col-5"
                                                        label={t("type")}
                                                        placeholder={t("type")}
                                                        name={`required_equipment.${i}.type`}
                                                        required
                                                        value={v.type}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "type")}
                                                        error={get(form.errors, "type")}
                                                        labelPrefix="JobEquipmentType"
                                                        enumType={JobEquipmentType}
                                                    />
                                                    <BaseInput
                                                        className="col-5"
                                                        label={t("quantity")}
                                                        placeholder={t("quantity")}
                                                        name={`required_equipment.${i}.quantity`}
                                                        required
                                                        value={v.quantity}
                                                        min="1"
                                                        type="number"
                                                        onKeyDown={positiveInt}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "quantity")}
                                                        error={get(form.errors, "quantity")}
                                                    />
                                                    <div className="col-2 mt-4">
                                                        <button className="btn btn-yellow" name={i} onClick={removeRequiredEquipment}>x</button>
                                                    </div>
                                                </div>);
                                        })}
                                        <div className="col-6 offset-6 text-end mt-2">
                                            <button className="btn btn-yellow" onClick={addRequiredEquipment}>+ {t("more")}</button>
                                        </div>
                                    </div>
                                }
                                <BaseCheckList
                                    className="col-12"
                                    label={t("special_endorsements")}
                                    name="required_endorsement"
                                    cols={2}
                                    value={form.values.required_endorsement}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.required_endorsement}
                                    error={form.errors.required_endorsement}
                                    labelPrefix="DriverEndorsement"
                                    enumType={DriverEndorsement}
                                />
                                <BaseCheckList
                                    className="col-12"
                                    label={t("transmission_type")}
                                    name="transmission_type_experience"
                                    cols={2}
                                    value={form.values.transmission_type_experience}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.transmission_type_experience}
                                    error={form.errors.transmission_type_experience}
                                    labelPrefix="VehicleTransmissionType"
                                    enumType={VehicleTransmissionType}
                                />
                            </div>
                            <div className="col-md-6">
                                <BaseCheck
                                    className="col-12"
                                    label={t("must_pass_drug_test")}
                                    name="must_pass_drug_test"
                                    checked={form.values.must_pass_drug_test}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.must_pass_drug_test}
                                    error={form.errors.must_pass_drug_test}
                                />
                                <BaseCheck
                                    className="col-12"
                                    label={t("must_have_clean_mvr")}
                                    name="must_have_clean_mvr"
                                    checked={form.values.must_have_clean_mvr}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.must_have_clean_mvr}
                                    error={form.errors.must_have_clean_mvr}
                                />
                                {
                                    !form.values.must_have_clean_mvr &&
                                    <div className="col-12">
                                        <label>{t("mvr_requirements")}:</label>
                                        {form.touched.mvr_requirements && typeof form.errors.mvr_requirements === "string" ? <span className="text-danger small">{form.errors.mvr_requirements}</span> : null}
                                        {form.values.mvr_requirements.map((v, i) => {
                                            const get = function (part, field) {
                                                if (part.mvr_requirements && part.mvr_requirements[i])
                                                    return part.mvr_requirements[i][field];
                                            }
                                            return (
                                                <div key={i} className="row">
                                                    <BaseSelect
                                                        className="col-3"
                                                        label={t("max")}
                                                        name={`mvr_requirements.${i}.max_count`}
                                                        required
                                                        value={v.max_count}
                                                        options={counts}
                                                        onKeyDown={positiveInt}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "max_count")}
                                                        error={get(form.errors, "max_count")}
                                                    />
                                                    <BaseSelect
                                                        className="col-4"
                                                        label={t("type")}
                                                        placeholder={t("type")}
                                                        name={`mvr_requirements.${i}.type`}
                                                        required
                                                        value={v.type}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "type")}
                                                        error={get(form.errors, "type")}
                                                        labelPrefix="MvrType"
                                                        enumType={MvrType}
                                                    />
                                                    <BaseSelect
                                                        className="col-3"
                                                        label={t("within")}
                                                        name={`mvr_requirements.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={years}
                                                        onKeyDown={positiveInt}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "max_years")}
                                                        error={get(form.errors, "max_years")}
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
                                    label={t("accept_sap_graduates")}
                                    name="accept_sap_graduates"
                                    value={form.values.accept_sap_graduates}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.accept_sap_graduates}
                                    error={form.errors.accept_sap_graduates}
                                />
                                <BaseCheck
                                    className="col-12"
                                    label={t("no_criminal_history")}
                                    name="must_have_clean_criminal_history"
                                    checked={form.values.must_have_clean_criminal_history}
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.must_have_clean_criminal_history}
                                    error={form.errors.must_have_clean_criminal_history}
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
                                                        label={t("max")}
                                                        name={`criminal_history.${i}.max_count`}
                                                        required
                                                        value={v.max_count}
                                                        options={counts}
                                                        onKeyDown={positiveInt}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "max_count")}
                                                        error={get(form.errors, "max_count")}
                                                    />
                                                    <BaseSelect
                                                        className="col-4"
                                                        label={t("type")}
                                                        placeholder={t("type")}
                                                        name={`criminal_history.${i}.type`}
                                                        required
                                                        value={v.type}
                                                        onChange={form.handleChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "type")}
                                                        error={get(form.errors, "type")}
                                                        labelPrefix="CriminalHistoryType"
                                                        enumType={CriminalHistoryType}
                                                    />
                                                    <BaseSelect
                                                        className="col-3"
                                                        label={t("within")}
                                                        name={`criminal_history.${i}.max_years`}
                                                        required
                                                        value={v.max_years}
                                                        options={years}
                                                        onKeyDown={positiveInt}
                                                        onChange={onIntChange}
                                                        handleBlur={form.handleBlur}
                                                        touched={get(form.touched, "max_years")}
                                                        error={get(form.errors, "max_years")}
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
                                    label={t("accidents_last_5_years")}
                                    placeholder={t("count")}
                                    name={`max_accidents`}
                                    value={form.values.max_accidents}
                                    min="0"
                                    type="number"
                                    onKeyDown={positiveInt}
                                    onChange={onIntChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.max_accidents}
                                    error={form.errors.max_accidents}
                                />
                                <BaseTextArea
                                    className="col-12"
                                    label={t("other_safety_requirements")}
                                    name="safety_requirements_other"
                                    placeholder={t("other_safety_requirements")}
                                    value={form.values.safety_requirements_other}
                                    rows="1"
                                    onChange={form.handleChange}
                                    handleBlur={form.handleBlur}
                                    touched={form.touched.safety_requirements_other}
                                    error={form.errors.safety_requirements_other}
                                />
                            </div>
                        </div>
                        <div className="col-12 border-0 text-end">
                            <div className="col">
                                <button type="submit" className={`btn btn-primary`} >
                                    {t("update")}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <Modal show={!!pdfModel.name} onHide={() => hideModelHandler()}>
                <Modal.Header>{pdfModel.name}</Modal.Header>

                <Modal.Body>
                    {(
                        pdfModel.name &&
                        <img src={pdfModel.url} />
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => hideModelHandler()}>{t("close")}</Button>
                </Modal.Footer>

            </Modal>
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
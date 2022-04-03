import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css';

import useAuth from "../../../hooks/useAuth"
import useRedirect from '../../../hooks/useRedirect';

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useEffect, useState } from 'react';

import { jobBenefits, jobGeography, jobPayMethod, jobTeamDriver, jobType } from '../../../utils/jobs';
import stateList from "../../../utils/stateList";

import { preventNegative } from '../../../utils/input';

import { useTranslation } from 'react-i18next';
import { useFormik } from "formik"
import * as yup from "yup"

import UserApi from "../../api/user";
import DriverApi from "../../api/driver";
import BaseInput from "../../../components/forms/BaseInput";
import BaseSelect from "../../../components/forms/BaseSelect";
import BaseCheck from "../../../components/forms/BaseCheck";
import BaseCheckList from "../../../components/forms/BaseCheckList";

export default function MyAccount() {

    const { t } = useTranslation();

    const { authDriver } = useRedirect();
    authDriver();
  
    const { authCheck, setAuth } = useAuth();

    const user = authCheck();

    const driverApi = new DriverApi();
    const userApi = new UserApi();

    const contactPreferences = [
        {
            label: t("never"),
            value: "NEVER"
        },
        {
            label: t("always"),
            value: "ALWAYS"
        },
        {
            label: t("depending_on_company"),
            value: "ASK"
        },
    ];

    const contactForm = useFormik({
        initialValues: {
            user: {
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                contact_number: user.contact_number || "",
                cell_number: user.cell_number || "",
                email: user.email || ""
            },
            driver: {
                birthdate: "",
                street: "",
                city: "",
                state: "",
                zip_code: ""
            },
            preferences: {
                COMMUNICATION: {
                    PREFERRED_METHOD: [ "TEXT", "CALL" ],
                    PREFERRED_HOURS: "",
                    RECEIVE_SUGGESTED_JOBS: true,
                    RECEIVE_NEWSLETTER: true,
                    RECEIVE_DRIVERFLY: true,
                },
                SHARING: {
                    MVR: "NEVER",
                    DRIVERS_LICENSE: "NEVER",
                    MEDICAL_CARD: "NEVER",
                    CONTACT_PAST_EMPLOYERS: "NEVER",
                },
                MATCHING: {
                    GEOGRAPHY: jobBenefits.map(v => v.key),
                    PREFERRED_SCHEDULE: "",
                    JOB_TYPE: jobType.map(v => v.key),
                    TEAM_DRIVER: "NO_TEAM_DRIVER",
                    MIN_PAY: "",
                    PAY_METHOD: jobPayMethod.map(v => v.key),
                    BENEFITS: jobBenefits.map(v => v.key)
                }
            }
        },
        validationSchema: yup.object({
            user: yup.object({
                first_name: yup.string().required(t("this_field_is_required")).nullable(),
                last_name: yup.string().required(t("this_field_is_required")).nullable(),
                contact_number: yup.string().nullable(),
                cell_number: yup.string().nullable(),
                email: yup.string().required(t("this_field_is_required")).nullable(),
            }),
            driver: yup.object({
                birthdate: yup.string().nullable(),
                street: yup.string().nullable(),
                city: yup.string().nullable(),
                state: yup.string().nullable(),
                zip_code: yup.string().nullable()
            }),
        }),
        onSubmit: async (values) => {
            try {
                const [ newUser, newDriver ] = await Promise.all([
                    userApi.putUser(user.id, {
                        ...values.user,
                        name: `${values.user.first_name} ${values.user.last_name}`
                    }),
                    driverApi.postDriver({
                        ...values.driver,
                        birthdate: values.driver.birthdate ? new Date(values.driver.birthdate) : null
                    }),
                ]);
        
                setAuth({
                    ...user,
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    name: newUser.name,
                    contact_number: newUser.contact_number,
                    cell_number: newUser.cell_number,
                    email: newUser.email
                });
                toast.success(t("successfully_saved_information"));
            }
            catch (e) {
                console.error("Unable to save contact information", e);
                toast.error(t("unable_to_save_information"));
            }

        }
    });

    useEffect(async () => {
        await Promise.all([
            driverApi.getDriver("drivers")
            .catch(error => {
                console.error("unable to fetch driver info", error);
                throw error;
            }),
            driverApi.getPreferences()
            .catch(error => {
                console.error("unable to fetch driver preference info", error);
                throw error;
            })
        ])
        .then(values => {
            const [ driver, preferences ] = values;

            const preferencesData = {
                ...contactForm.values.preferences
            };

            preferences.forEach(v => {
                let { category, label, value } = v;

                value = value || "";

                if (category === "COMMUNICATION") {
                    if (label === "PREFERRED_METHOD") {
                        value = value ? value.split(",") : [];
                    }
                    else if (label === "RECEIVE_SUGGESTED_JOBS" ||
                        label === "RECEIVE_NEWSLETTER" ||
                        label === "RECEIVE_DRIVERFLY") {
                        value = value == "true";
                    }
                }
                else if (category === "MATCHING") {
                    if (label === "GEOGRAPHY" ||
                        label === "JOB_TYPE" ||
                        label === "PAY_METHOD" ||
                        label === "BENEFITS") {
                        value = value ? value.split(",") : [];
                    }
                }

                if (category in preferencesData && label in preferencesData[category])
                    preferencesData[category][label] = value;
            });

            contactForm.setValues({
                ...contactForm.values,
                driver: {
                    ...contactForm.values.driver,
                    birthdate: (driver.birthdate || "").split("T")[0],
                    street: driver.street || "",
                    city: driver.city || "",
                    state: driver.state || "",
                    zip_code: driver.zip_code || ""
                },
                preferences: {
                    ...preferencesData
                }
            });
        });
    }, [ ]);

    async function handlePreferenceChange(e) {
        let { name, value, type, checked } = e.target;

        const [ category, label ] = name.split(".").slice(1);

        const currentValue = contactForm.values.preferences[category][label];

        let newValue = null;

        let dbValue = null;

        if (category === "COMMUNICATION") {
            if (label === "PREFERRED_METHOD") {
                if (!checked) {
                    newValue = currentValue.filter(v => v != value);
                }
                else if (!currentValue.includes(value)) {
                    newValue = currentValue.slice();
                    newValue.push(value);
                }
                else return;

                dbValue = newValue.join(",");
            }
            else if (label === "RECEIVE_SUGGESTED_JOBS"
            || label === "RECEIVE_NEWSLETTER"
            || label === "RECEIVE_DRIVERFLY") {
                newValue = checked;// ? (value === "true") : currentValue;

                if (newValue === currentValue) return;
                dbValue = newValue.toString();
            }
            else {
                if (value === currentValue) return;
                newValue = dbValue = value;
            }
        }
        else if (category === "MATCHING") {
            if (label === "GEOGRAPHY" ||
                label === "JOB_TYPE" ||
                label === "PAY_METHOD" ||
                label === "BENEFITS") {
                if (!checked) {
                    newValue = currentValue.filter(v => v != value);
                }
                else if (!currentValue.includes(value)) {
                    newValue = currentValue.slice();
                    newValue.push(value);
                }
                else return;
                dbValue = newValue.join(",");
            }
            else {
                if (value === currentValue) return;
                newValue = dbValue = value;
            }
        }
        else {
            if (value === currentValue) return;
            newValue = dbValue = value;
        }

        console.log("new preference value", newValue);

        if (type != "text" && type != "number")
            await updateDriverPreferenceAsync(category, label, dbValue);

        contactForm.setFieldValue(name, newValue);
    }

    async function handlePreferenceBlur(e) {
        let { name, value } = e.target;

        const [ category, label ] = name.split(".").slice(1);

        await updateDriverPreferenceAsync(category, label, value);

        contactForm.setFieldValue(name, value);
    }

    async function updateDriverPreferenceAsync(category, label, value) {
        try {
            await driverApi.postPreference({
                category: category,
                label: label,
                value: value === "" ? null : value
            });
        }
        catch (e) {
            console.error("Unable to save driver preferences", e);
            toast.error(t("unable_to_save_information"));
        }
    }
  
    return (
        <>
            <ToastContainer />
            <h2 className='mb-3'>{t("my_account")}</h2>
            <div className={style.account_container}>
                <div>
                    <div className='container-fluid'>
                        <form className="modal-body" onSubmit={contactForm.handleSubmit} >
                            <h3>{t("contact_details")}</h3>
                            <div className="row">
                                <BaseInput
                                    className="col-md-4 mt-3"
                                    label={t("first_name")}
                                    name="user.first_name"
                                    placeholder={t("first_name")}
                                    value={contactForm.values.user.first_name}
                                    touched={contactForm.touched.user?.first_name}
                                    error={contactForm.errors.user?.first_name}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                />
                                <BaseInput
                                    className="col-md-4 mt-3"
                                    label={t("last_name")}
                                    name="user.last_name"
                                    placeholder={t("last_name")}
                                    value={contactForm.values.user.last_name}
                                    touched={contactForm.touched.user?.last_name}
                                    error={contactForm.errors.user?.last_name}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                />
                                <BaseInput
                                    className="col-md-4 mt-3"
                                    label={t("birthdate")}
                                    name="driver.birthdate"
                                    placeholder={t("birthdate")}
                                    type="date"
                                    value={contactForm.values.driver.birthdate}
                                    touched={contactForm.touched.driver?.birthdate}
                                    error={contactForm.errors.driver?.birthdate}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                />
                            </div>
                            <div className='row'>
                                <BaseInput
                                    className="col-md-6 mt-3"
                                    label={t("phone")}
                                    name="user.contact_number"
                                    placeholder={t("phone")}
                                    type="tel"
                                    value={contactForm.values.user.contact_number}
                                    touched={contactForm.touched.user?.contact_number}
                                    error={contactForm.errors.user?.contact_number}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                                <BaseInput
                                    className="col-md-6 mt-3"
                                    label={t("phone_cell")}
                                    name="user.cell_number"
                                    placeholder={t("phone_cell")}
                                    type="tel"
                                    value={contactForm.values.user.cell_number}
                                    touched={contactForm.touched.user?.cell_number}
                                    error={contactForm.errors.user?.cell_number}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                            </div>
                            <div className='row'>
                                <BaseInput
                                    className="col-md-12 mt-3"
                                    label={t("email")}
                                    name="user.email"
                                    placeholder={t("email")}
                                    type="email"
                                    readOnly={true}
                                    value={contactForm.values.user.email}
                                    touched={contactForm.touched.user?.email}
                                    error={contactForm.errors.user?.email}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                            </div>
                            <div className='row'>
                                <BaseInput
                                    className="col-md-12 mt-3"
                                    label={t("street")}
                                    name="driver.street"
                                    placeholder={t("street")}
                                    value={contactForm.values.driver.street}
                                    touched={contactForm.touched.driver?.street}
                                    error={contactForm.errors.driver?.street}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                            </div>
                            <div className='row'>
                                <BaseInput
                                    className="col-md-5 mt-3"
                                    label={t("city")}
                                    name="driver.city"
                                    placeholder={t("city")}
                                    value={contactForm.values.driver.city}
                                    touched={contactForm.touched.driver?.city}
                                    error={contactForm.errors.driver?.city}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                                <BaseSelect
                                    className="col-md-4 mt-3"
                                    label={t("state")}
                                    name="driver.state"
                                    placeholder={t("state")}
                                    value={contactForm.values.driver.state}
                                    touched={contactForm.touched.driver?.state}
                                    error={contactForm.errors.driver?.state}
                                    onChange={contactForm.handleChange}
                                    options={stateList}
                                    />
                                <BaseInput
                                    className="col-md-3 mt-3"
                                    label={t("zip_code")}
                                    name="driver.zip_code"
                                    placeholder={t("zip_code")}
                                    value={contactForm.values.driver.zip_code}
                                    touched={contactForm.touched.driver?.zip_code}
                                    error={contactForm.errors.driver?.zip_code}
                                    onChange={contactForm.handleChange}
                                    handleBlur={contactForm.handleBlur}
                                    />
                            </div>
                            <div className='row'>
                                <div className="col text-end">
                                    <button
                                        type="submit" className={style.update_btn} >
                                        {t("update")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={style.info}>
                <div className='row'>
                    <div className="col-sm-6">
                        <div className='row'>
                            <h3>{t("communication_preferences")}:</h3>
                            <BaseCheck
                                className="col-md-12 mt-3"
                                label={t("communication_preferences_receive_driverfly")}
                                name="preferences.COMMUNICATION.RECEIVE_DRIVERFLY"
                                checked={contactForm.values.preferences.COMMUNICATION.RECEIVE_DRIVERFLY}
                                touched={contactForm.touched.preferences?.COMMUNICATION?.RECEIVE_DRIVERFLY}
                                error={contactForm.errors.preferences?.COMMUNICATION?.RECEIVE_DRIVERFLY}
                                onChange={handlePreferenceChange}
                                />
                            <BaseCheckList
                                className="col-md-12 mt-3"
                                label={t("communication_preferences_preferred_method")}
                                options={[{
                                    label: t("call"),
                                    value: "CALL"
                                }, {
                                    label: t("text"),
                                    value: "TEXT"
                                }]}
                                value={contactForm.values.preferences.COMMUNICATION.PREFERRED_METHOD}
                                name="preferences.COMMUNICATION.PREFERRED_METHOD"
                                touched={contactForm.touched.preferences?.COMMUNICATION?.PREFERRED_METHOD}
                                error={contactForm.errors.preferences?.COMMUNICATION?.PREFERRED_METHOD}
                                onChange={handlePreferenceChange}
                                />
                            <BaseInput
                                className="col-md-12 mt-3"
                                label={t("preferred_hours")}
                                name="preferences.COMMUNICATION.PREFERRED_HOURS"
                                placeholder={t("preferred_hours")}
                                value={contactForm.values.preferences.COMMUNICATION.PREFERRED_HOURS}
                                touched={contactForm.touched.preferences?.COMMUNICATION?.PREFERRED_HOURS}
                                error={contactForm.errors.preferences?.COMMUNICATION?.PREFERRED_HOURS}
                                onChange={handlePreferenceChange}
                                handleBlur={handlePreferenceBlur}
                                />
                            <BaseCheck
                                className="col-md-12 mt-3"
                                label={t("receive_suggested_job_feeds")}
                                name="preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS"
                                checked={contactForm.values.preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS}
                                touched={contactForm.touched.preferences?.COMMUNICATION?.RECEIVE_SUGGESTED_JOBS}
                                error={contactForm.errors.preferences?.COMMUNICATION?.RECEIVE_SUGGESTED_JOBS}
                                onChange={handlePreferenceChange}
                                />
                            <BaseCheck
                                className="col-md-12 mt-3"
                                label={t("receive_newsletters")}
                                name="preferences.COMMUNICATION.RECEIVE_NEWSLETTER"
                                checked={contactForm.values.preferences.COMMUNICATION.RECEIVE_NEWSLETTER}
                                touched={contactForm.touched.preferences?.COMMUNICATION?.RECEIVE_NEWSLETTER}
                                error={contactForm.errors.preferences?.COMMUNICATION?.RECEIVE_NEWSLETTER}
                                onChange={handlePreferenceChange}
                                />
                        </div>
                        <div className='row mt-3'>
                            <h3>{t("sharing_preferences")}:</h3>
                            <div className='row'>
                                <BaseSelect
                                    className="col-md-12 mt-3"
                                    label={t("share_my_mvr")}
                                    name="preferences.SHARING.MVR"
                                    value={contactForm.values.preferences.SHARING.MVR}
                                    touched={contactForm.touched.preferences?.SHARING?.MVR}
                                    error={contactForm.errors.preferences?.SHARING?.MVR}
                                    onChange={handlePreferenceChange}
                                    options={contactPreferences}
                                    />
                                <BaseSelect
                                    className="col-md-12 mt-3"
                                    label={t("share_my_drivers_license")}
                                    name="preferences.SHARING.DRIVERS_LICENSE"
                                    value={contactForm.values.preferences.SHARING.DRIVERS_LICENSE}
                                    touched={contactForm.touched.preferences?.SHARING?.DRIVERS_LICENSE}
                                    error={contactForm.errors.preferences?.SHARING?.DRIVERS_LICENSE}
                                    onChange={handlePreferenceChange}
                                    options={contactPreferences}
                                    />
                                <BaseSelect
                                    className="col-md-12 mt-3"
                                    label={t("share_my_medical_card")}
                                    name="preferences.SHARING.MEDICAL_CARD"
                                    value={contactForm.values.preferences.SHARING.MEDICAL_CARD}
                                    touched={contactForm.touched.preferences?.SHARING?.MEDICAL_CARD}
                                    error={contactForm.errors.preferences?.SHARING?.MEDICAL_CARD}
                                    onChange={handlePreferenceChange}
                                    options={contactPreferences}
                                    />
                                <BaseSelect
                                    className="col-md-12 mt-3"
                                    label={t("authorize_companies_contact_past_employers")}
                                    name="preferences.SHARING.CONTACT_PAST_EMPLOYERS"
                                    value={contactForm.values.preferences.SHARING.CONTACT_PAST_EMPLOYERS}
                                    touched={contactForm.touched.preferences?.SHARING?.CONTACT_PAST_EMPLOYERS}
                                    error={contactForm.errors.preferences?.SHARING?.CONTACT_PAST_EMPLOYERS}
                                    onChange={handlePreferenceChange}
                                    options={contactPreferences}
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h3>{t("matching_preferences")}:</h3>

                        <BaseCheckList
                            className="col-md-12 mt-3"
                            label={t("geography")}
                            options={jobGeography.map(v => ({
                                label: t(v.label),
                                value: v.key
                            }))}
                            value={contactForm.values.preferences.MATCHING.GEOGRAPHY}
                            name="preferences.MATCHING.GEOGRAPHY"
                            touched={contactForm.touched.preferences?.MATCHING?.GEOGRAPHY}
                            error={contactForm.errors.preferences?.MATCHING?.GEOGRAPHY}
                            onChange={handlePreferenceChange}
                            />
                        <BaseInput
                            className="col-md-12 mt-3"
                            label={t("preferred_schedule")}
                            name="preferences.MATCHING.PREFERRED_SCHEDULE"
                            placeholder={t("preferred_schedule")}
                            value={contactForm.values.preferences.MATCHING.PREFERRED_SCHEDULE}
                            touched={contactForm.touched.preferences?.MATCHING?.PREFERRED_SCHEDULE}
                            error={contactForm.errors.preferences?.MATCHING?.PREFERRED_SCHEDULE}
                            onChange={handlePreferenceChange}
                            handleBlur={handlePreferenceBlur}
                            />
                        <BaseCheckList
                            className="col-md-12 mt-3"
                            label={t("job_type")}
                            cols={2}
                            options={jobType.map(v => ({
                                label: t(v.label),
                                value: v.key
                            }))}
                            value={contactForm.values.preferences.MATCHING.JOB_TYPE}
                            name="preferences.MATCHING.JOB_TYPE"
                            touched={contactForm.touched.preferences?.MATCHING?.JOB_TYPE}
                            error={contactForm.errors.preferences?.MATCHING?.JOB_TYPE}
                            onChange={handlePreferenceChange}
                            />
                        <BaseSelect
                            className="col-md-12 mt-3"
                            label={t("team_drivers")}
                            name="preferences.MATCHING.TEAM_DRIVER"
                            value={contactForm.values.preferences.MATCHING.TEAM_DRIVER}
                            touched={contactForm.touched.preferences?.MATCHING?.TEAM_DRIVER}
                            error={contactForm.errors.preferences?.MATCHING?.TEAM_DRIVER}
                            onChange={handlePreferenceChange}
                            options={jobTeamDriver.map(v => ({
                                value: v.key,
                                label: t(v.label)
                            }))}
                            />
                        <BaseInput
                            className="col-md-12 mt-3"
                            label={t("min_pay_per_week")}
                            name="preferences.MATCHING.MIN_PAY"
                            placeholder={t("min_pay_per_week")}
                            type="number"
                            min={0}
                            value={contactForm.values.preferences.MATCHING.MIN_PAY}
                            touched={contactForm.touched.preferences?.MATCHING?.MIN_PAY}
                            error={contactForm.errors.preferences?.MATCHING?.MIN_PAY}
                            onChange={handlePreferenceChange}
                            handleBlur={handlePreferenceBlur}
                            onKeyDown={preventNegative}
                            />
                        <BaseCheckList
                            className="col-md-12 mt-3"
                            label={t("pay_method")}
                            cols={2}
                            options={jobPayMethod.map(v => ({
                                label: t(v.label),
                                value: v.key
                            }))}
                            value={contactForm.values.preferences.MATCHING.PAY_METHOD}
                            name="preferences.MATCHING.PAY_METHOD"
                            touched={contactForm.touched.preferences?.MATCHING?.PAY_METHOD}
                            error={contactForm.errors.preferences?.MATCHING?.PAY_METHOD}
                            onChange={handlePreferenceChange}
                            />
                        <BaseCheckList
                            className="col-md-12 mt-3"
                            label={t("required_benefits")}
                            cols={2}
                            options={jobBenefits.map(v => ({
                                label: t(v.label),
                                value: v.key
                            }))}
                            value={contactForm.values.preferences.MATCHING.BENEFITS}
                            name="preferences.MATCHING.BENEFITS"
                            touched={contactForm.touched.preferences?.MATCHING?.BENEFITS}
                            error={contactForm.errors.preferences?.MATCHING?.BENEFITS}
                            onChange={handlePreferenceChange}
                            />
                    </div>
                </div>
            </div>
            <span>{t("delete_account_paragraph", { email: "support@driverfly.co"})} </span>

        </>
    )
};


MyAccount.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

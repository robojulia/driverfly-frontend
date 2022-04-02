import { Container } from 'reactstrap';
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css';

import useAuth from "../../../hooks/useAuth"
import useRedirect from '../../../hooks/useRedirect';

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { jobBenefits, jobGeography, jobPayMethod, jobTeamDriver, jobType } from '../../../utils/jobs';
import stateList from "../../../utils/stateList";

import { preventNegative } from '../../../utils/input';

import { useTranslation } from 'react-i18next';

export default function MyAccount() {

    const { t } = useTranslation();

    const { authDriver } = useRedirect();
    authDriver();
  
    const { authCheck, setAuth } = useAuth();

    const user = authCheck();

    //const [ isFetching, setIsFetching ] = useState(true);

    const [ formState, setFormState ] = useState({
        user: {
            name: user.name || "",
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
    });

    function onUserChange(e) {
        const { name, value } = e.target;

        setFormState({
            ...formState,
            user: {
                ...formState.user,
                [name]: value
            },
        })
    }

    function onDriverChange(e) {
        const { name, value } = e.target;

        setFormState({
            ...formState,
            driver: {
                ...formState.driver,
                [name]: value
            },
        })
    }

    useEffect(async () => {
        let source = axios.CancelToken.source();

        await Promise.all([
            axios.get(`${process.env.BASE_URL_API}/drivers/`, {
                cancelToken: source.token,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(response => {
                const { data: driver } = response;
                return driver;
            })
            .catch(error => {
                console.error("unable to fetch driver info", error);
                throw error;
            }),
            axios.get(`${process.env.BASE_URL_API}/drivers/preferences`, {
                cancelToken: source.token,
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(response => {
                const { data: preferences } = response;
                return preferences;
            })
            .catch(error => {
                console.error("unable to fetch driver info", error);
                throw error;
            })
        ])
        .then(values => {
            const [ driver, preferences ] = values;

            const newState = {
                user: {
                    ...formState.user
                },
                driver: {
                    ...formState.driver,
                    birthdate: (driver.birthdate || "").split("T")[0],
                    street: driver.street || "",
                    city: driver.city || "",
                    state: driver.state || "",
                    zip_code: driver.zip_code || ""
                },
                preferences: {
                    ...formState.preferences
                }
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

                if (category in newState.preferences && label in newState.preferences[category])
                    newState.preferences[category][label] = value;
            });

            setFormState(newState);
        });

        return function () {
            source.cancel("Cancelling server calls");
        };

    }, [ ]);

    function onContactSubmit(e) {
        e.preventDefault();
        if (!formState.user.name) {
            toast.error(t("name_is_required"));
            return;
        }

        if (!formState.user.email) {
            toast.error(t("email_is_required"));
            return;
        }


        Promise.all([
            axios.put(`${process.env.BASE_URL_API}/user/${user.id}`, {
                ...formState.user
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(response => {
                const { data: { user } } = response;
                return user;
            })
            .catch(error => {
                console.error("unable to save user info", error);
                throw error;
            }),
            axios.post(`${process.env.BASE_URL_API}/drivers/`, {
                ...formState.driver,
                birthdate: formState.driver.birthdate ? new Date(formState.driver.birthdate) : null
            }, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            .then(response => {
                console.log(response.data);
                const { data: { user } } = response;
            })
            .catch(error => {
                console.error("unable to save driver info", error);
                throw error;
            })
        ])
        .then(values => {
            const [ newUser, newDriver ] = values;
            setAuth({
                ...user,
                name: newUser.name,
                contact_number: newUser.contact_number,
                cell_number: newUser.cell_number,
                email: newUser.email
            });
            toast.success("Info saved successfully");
        })

    }

    function onPreferenceChange(e) {
        let { name, value } = e.target;

        const [ category, label ] = name.split(".");

        const newState = {
            ...formState,
        };

        const { preferences } = newState;
        const currentValue = preferences[category][label];

        let newValue = null;

        let dbValue = null;

        if (category === "COMMUNICATION") {
            if (label === "PREFERRED_METHOD") {
                if (!e.target.checked) {
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
                newValue = e.target.checked;// ? (value === "true") : currentValue;

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
                if (!e.target.checked) {
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

        preferences[category][label] = newValue;

        if (e.target.type != "text" && e.target.type != "number")
            updateDriverPreference(category, label, dbValue);

        setFormState(newState);

        //alert(`${name} = ${value}`);
    }

    function onPreferenceBlur(e) {
        let { name, value } = e.target;

        const [ category, label ] = name.split(".");

        updateDriverPreference(category, label, value);
    }

    function updateDriverPreference(category, label, value) {
        axios.post(`${process.env.BASE_URL_API}/drivers/preferences`, {
            category, label, value: value === "" ? null : value
        }, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        .then(response => {
            //toast.success("Successfully saved your preference");
        })
        .catch(error => {
            toast.error(t("unable_to_save"));
            // preferences[category][label] = value;
            // setFormState(newState);
        });
    }
  
    return (
        <>
            <ToastContainer />
            <h2 className='mb-3'>{t("account_settings")}</h2>
            <div className={style.account_container}>
                <div>
                    <div className='container-fluid'>
                        <form className="modal-body" onSubmit={e => onContactSubmit(e)} >
                            <h3>{t("contact_details")}</h3>
                            <div className="row">
                                <div className="col-sm-6 mt-3">
                                    <label>{t("name")}</label>
                                    <input name="name" type="text" className="form-control" placeholder={t("name")} onChange={e => onUserChange(e)} value={formState.user.name} />
                                </div>
                                <div className="col-sm-6 mt-3">
                                    <label>{t("birthdate")}</label>
                                    <input name="birthdate" type="date" className="form-control" placeholder={t("birthdate")} onChange={e => onDriverChange(e)} value={formState.driver.birthdate} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-6 mt-3">
                                    <label>{t("phone")}</label>
                                    <input name="contact_number" type="text" className="form-control" placeholder={t("phone")} onChange={e => onUserChange(e)} value={formState.user.contact_number} />
                                </div>
                                <div className="col-sm-6 mt-3">
                                    <label>{t("phone_cell")}</label>
                                    <input name="cell_number" type="text" className="form-control" placeholder={t("phone_cell")} onChange={e => onUserChange(e)} value={formState.user.cell_number} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-12 mt-3">
                                    <label>{t("email")}</label>
                                    <input name="email" readOnly={true} type="email" className="form-control" placeholder={t("email")} value={formState.user.email} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-12 mt-3">
                                    <label>{t("street")}</label>
                                    <input type="text" name="street" className="form-control" placeholder={t("street")} onChange={e => onDriverChange(e)} value={formState.driver.street} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-5 mt-3">
                                    <label for="addressCity">{t("city")}</label>
                                    <input id="addressCity" type="text" name="city" className="form-control" placeholder={t("city")} onChange={e => onDriverChange(e)} value={formState.driver.city} />
                                </div>
                                <div className="col-4 mt-3">
                                    <label for="addressState">{t("state")}</label>
                                    <select id="addressState" name="state" className="form-control form-select" onChange={e => onDriverChange(e)} value={formState.driver.state}>
                                        <option value="">{t("state")}</option>
                                        {stateList.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div class="col-3 mt-3">
                                    <label>{t("zip_code")}</label>
                                    <input type="text" name="zip_code" className="form-control" placeholder={t("zip_code")} onChange={e => onDriverChange(e)} value={formState.driver.zip_code} />
                                </div>
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
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_DRIVERFLY} name="COMMUNICATION.RECEIVE_DRIVERFLY" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">{t("communication_preferences_receive_driverfly")}</label>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <span className={style.lable}>{t("communication_preferences_preferred_method")}:</span>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label">{t("call")}</label>
                                    <input class="form-check-input" type="checkbox" name="COMMUNICATION.PREFERRED_METHOD" value="CALL" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.PREFERRED_METHOD.includes("CALL")} />
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" >{t("text")}</label>
                                    <input class="form-check-input" type="checkbox" name="COMMUNICATION.PREFERRED_METHOD" value="TEXT" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.PREFERRED_METHOD.includes("TEXT")} />
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <label>{t("preferred_hours")}:</label>
                                <input type="text" className="form-control" placeholder={t("preferred_hours")} name="COMMUNICATION.PREFERRED_HOURS" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.COMMUNICATION.PREFERRED_HOURS} />
                            </div>
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS} name="COMMUNICATION.RECEIVE_SUGGESTED_JOBS" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">{t("receive_suggested_job_feeds")}</label>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_NEWSLETTER} name="COMMUNICATION.RECEIVE_NEWSLETTER" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">{t("receive_newsletters")}</label>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <h3>{t("sharing_preferences")}:</h3>
                            <div className='row'>
                                <div className='col-12 mt-3'>
                                    <span className={style.lable}>{t("share_my_mvr")}:</span>
                                    <select class="form-control form-select" name="SHARING.MVR" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.MVR}>
                                        <option value="NEVER">{t("never")}</option>
                                        <option value="ALWAYS">{t("always")}</option>
                                        <option value="ASK">{t("depending_on_company")}</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>{t("share_my_drivers_license")}:</span>
                                    <select class="form-control form-select" name="SHARING.DRIVERS_LICENSE" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.DRIVERS_LICENSE}>
                                        <option value="NEVER">{t("never")}</option>
                                        <option value="ALWAYS">{t("always")}</option>
                                        <option value="ASK">{t("depending_on_company")}</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>{t("share_my_medical_card")}:</span>
                                    <select class="form-control form-select" name="SHARING.MEDICAL_CARD" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.MEDICAL_CARD}>
                                        <option value="NEVER">{t("never")}</option>
                                        <option value="ALWAYS">{t("always")}</option>
                                        <option value="ASK">{t("depending_on_company")}</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>{t("authorize_companies_contact_past_employers")}:</span>
                                    <select class="form-control form-select" name="SHARING.CONTACT_PAST_EMPLOYERS" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.CONTACT_PAST_EMPLOYERS}>
                                        <option value="NEVER">{t("never")}</option>
                                        <option value="ALWAYS">{t("always")}</option>
                                        <option value="ASK">{t("depending_on_company")}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h3>{t("matching_preferences")}:</h3>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>{t("geography")}:</span>
                            {jobGeography.map(v => (
                                <div key={v.key} className="form-check form-check-inline">
                                    <label className="form-check-label">{t(v.label)}</label>
                                    <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.GEOGRAPHY" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.GEOGRAPHY.includes(v.key)} />
                                </div>
                            ))}
                        </div>
                        <div className="col-12 mt-3">
                            <label>{t("preferred_schedule")}:</label>
                            <input type="text" className="form-control" placeholder={t("preferred_schedule")} name="MATCHING.PREFERRED_SCHEDULE" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.PREFERRED_SCHEDULE} />
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>Job Type:</span>
                            <div className='row mt-1'>
                                {jobType.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{t(v.label)}</label>
                                            <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.JOB_TYPE" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.JOB_TYPE.includes(v.key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>{t("team_drivers")}:</span>
                            <select class="form-control form-select" name="MATCHING.TEAM_DRIVER" onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.TEAM_DRIVER}>
                                {jobTeamDriver.map(v => (<option key={v.key} value={v.key}>{t(v.label)}</option>))}
                            </select>
                        </div>
                        <div className="col-12 mt-3">
                            <label>{t("min_pay_per_week")}:</label>
                            <input type="number" min={0} className="form-control" placeholder={t("min_pay_per_week")} name="MATCHING.MIN_PAY" onKeyDown={e => preventNegative(e)} onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.MIN_PAY} />
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>{t("pay_method")}:</span>
                            <div className="row mt-1">
                                {jobPayMethod.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{t(v.label)}</label>
                                            <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes(v.key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>{t("required_benefits")}:</span>
                            <div className="row mt-1">
                                {jobBenefits.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{t(v.label)}</label>
                                            <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.BENEFITS" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.BENEFITS.includes(v.key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* <div className="col-sm-6 mt-3 text-lg-center" style={{ display: "none" }}>
                        <h2 className='my-4'>Points</h2>
                        <span>1300</span>
                        <span className={style.earn_btn}>Earn More</span>
                    </div> */}
                </div>
            </div>
            <span>If you would like to delete your account, please contact our support team at <a href="mailto:support@driverfly.co">support@driverfly.co</a></span>

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

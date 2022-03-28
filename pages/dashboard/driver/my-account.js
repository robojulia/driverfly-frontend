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

import { jobBenefits, jobGeography, jobPayMethod, jobType } from '../../../utils/jobs';
import stateList from "../../../utils/stateList";



export default function MyAccount() {

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

            console.log(preferences);

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
            toast.error("User name is required");
            return;
        }

        if (!formState.user.email) {
            toast.error("User email is required");
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
            toast.error("Unable to save your preference");
            // preferences[category][label] = value;
            // setFormState(newState);
        });
    }
  
    return (
        <>
            <ToastContainer />
            <h2 className='mb-3'>Account Settings</h2>
            <div className={style.account_container}>
                <div>
                    <div className='container-fluid'>
                        <form className="modal-body" onSubmit={e => onContactSubmit(e)} >
                            <h3>Contact Details</h3>
                            <div className="row">
                                <div className="col-sm-6 mt-3">
                                    <label>Name</label>
                                    <input name="name" type="text" className="form-control" placeholder="Name" onChange={e => onUserChange(e)} value={formState.user.name} />
                                </div>
                                <div className="col-sm-6 mt-3">
                                    <label>Birthdate</label>
                                    <input name="birthdate" type="date" className="form-control" placeholder="Birthdate" onChange={e => onDriverChange(e)} value={formState.driver.birthdate} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-6 mt-3">
                                    <label>Phone</label>
                                    <input name="contact_number" type="text" className="form-control" placeholder="Phone" onChange={e => onUserChange(e)} value={formState.user.contact_number} />
                                </div>
                                <div className="col-sm-6 mt-3">
                                    <label>Cell</label>
                                    <input name="cell_number" type="text" className="form-control" placeholder="Cell" onChange={e => onUserChange(e)} value={formState.user.cell_number} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-12 mt-3">
                                    <label>Email</label>
                                    <input name="email" readOnly={true} type="email" className="form-control" placeholder="E-mail" value={formState.user.email} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-sm-12 mt-3">
                                    <label>Street</label>
                                    <input type="text" name="street" className="form-control" placeholder="Street" onChange={e => onDriverChange(e)} value={formState.driver.street} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-5 mt-3">
                                    <label for="addressCity">City</label>
                                    <input id="addressCity" type="text" name="city" className="form-control" placeholder="City" onChange={e => onDriverChange(e)} value={formState.driver.city} />
                                </div>
                                <div className="col-4 mt-3">
                                    <label for="addressState">State</label>
                                    <select id="addressState" name="state" className="form-control form-select" onChange={e => onDriverChange(e)} value={formState.driver.state}>
                                        <option value="">Choose State</option>
                                        {stateList.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div class="col-3 mt-3">
                                    <label>Zip</label>
                                    <input type="text" name="zip_code" className="form-control" placeholder="Zip" onChange={e => onDriverChange(e)} value={formState.driver.zip_code} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col text-end">
                                    <button
                                        type="submit" className={style.update_btn} >
                                        Update
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
                            <h3>Communication Preferences:</h3>
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_DRIVERFLY} name="COMMUNICATION.RECEIVE_DRIVERFLY" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">Consent to receive text messages from DriverFly &amp; any third parties of DriverFly</label>
                                </div>
                            </div>
                            <div className='col-12 mt-3'>
                                <span className={style.lable}>Preferred method:</span>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label">Call</label>
                                    <input class="form-check-input" type="checkbox" name="COMMUNICATION.PREFERRED_METHOD" value="CALL" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.PREFERRED_METHOD.includes("CALL")} />
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" >Text</label>
                                    <input class="form-check-input" type="checkbox" name="COMMUNICATION.PREFERRED_METHOD" value="TEXT" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.PREFERRED_METHOD.includes("TEXT")} />
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <label>Preferred hours:</label>
                                <input type="text" className="form-control" placeholder="Preferred hours" name="COMMUNICATION.PREFERRED_HOURS" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.COMMUNICATION.PREFERRED_HOURS} />
                            </div>
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS} name="COMMUNICATION.RECEIVE_SUGGESTED_JOBS" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">Receive suggested job feeds?</label>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <div class="form-check form-switch">
                                    <input checked={formState.preferences.COMMUNICATION.RECEIVE_NEWSLETTER} name="COMMUNICATION.RECEIVE_NEWSLETTER" class="form-check-input" type="checkbox" role="switch" onClick={( e ) => onPreferenceChange(e)} />
                                    <label class="form-check-label">Receive newsletters?</label>
                                </div>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <h3>Sharing Preferences:</h3>
                            <div className='row'>
                                <div className='col-12 mt-3'>
                                    <span className={style.lable}>Share my MVR:</span>
                                    <select class="form-control form-select" name="SHARING.MVR" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.MVR}>
                                        <option value="NEVER">Never</option>
                                        <option value="ALWAYS">Always</option>
                                        <option value="ASK">Depending on company</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>Share copy of my Drivers License</span>
                                    <select class="form-control form-select" name="SHARING.DRIVERS_LICENSE" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.DRIVERS_LICENSE}>
                                        <option value="NEVER">Never</option>
                                        <option value="ALWAYS">Always</option>
                                        <option value="ASK">Depending on company</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>Share copy of my Medical Card:</span>
                                    <select class="form-control form-select" name="SHARING.MEDICAL_CARD" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.MEDICAL_CARD}>
                                        <option value="NEVER">Never</option>
                                        <option value="ALWAYS">Always</option>
                                        <option value="ASK">Depending on company</option>
                                    </select>
                                </div>
                                <div className="col-12 mt-3">
                                    <span className={style.lable}>Authorize companies to contact my past employers:</span>
                                    <select class="form-control form-select" name="SHARING.CONTACT_PAST_EMPLOYERS" onChange={e => onPreferenceChange(e)} value={formState.preferences.SHARING.CONTACT_PAST_EMPLOYERS}>
                                        <option value="NEVER">Never</option>
                                        <option value="ALWAYS">Always</option>
                                        <option value="ASK">Depending on company</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <h3>Matching Preferences:</h3>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>Geography:</span>
                            {jobGeography.map(v => (
                                <div key={v.key} className="form-check form-check-inline">
                                    <label className="form-check-label">{v.label}</label>
                                    <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.GEOGRAPHY" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.GEOGRAPHY.includes(v.key)} />
                                </div>
                            ))}
                        </div>
                        <div className="col-12 mt-3">
                            <label>Preferred Schedule:</label>
                            <input type="text" className="form-control" placeholder="Preferred Schedule" name="MATCHING.PREFERRED_SCHEDULE" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.PREFERRED_SCHEDULE} />
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>Job Type:</span>
                            <div className='row mt-1'>
                                {jobType.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{v.label}</label>
                                            <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.JOB_TYPE" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.JOB_TYPE.includes(v.key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <label>Min Pay (per week):</label>
                            <input type="number" className="form-control" placeholder="Minimum pay" name="MATCHING.MIN_PAY" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.MIN_PAY} />
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>Pay Method:</span>
                            <div className="row mt-1">
                                {jobPayMethod.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{v.label}</label>
                                            <input className="form-check-input" type="checkbox" value={v.key} name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes(v.key)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 mt-3">
                            <span className={style.lable}>Required Benefits:</span>
                            <div className="row mt-1">
                                {jobBenefits.map(v => (
                                    <div key={v.key} className='col-6'>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label">{v.label}</label>
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

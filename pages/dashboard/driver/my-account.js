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



export default function MyAccount() {

    const { authDriver } = useRedirect();
    authDriver();
  
    const { authCheck, setAuth } = useAuth();

    const user = authCheck();

    //const [ isFetching, setIsFetching ] = useState(true);

    const stateList = [
        {
            value: "AL",
            label: "Alabama"
        },
        {
            value: "AK",
            label: "Alaska"
        },
        {
            value: "AZ",
            label: "Arizona"
        },
        {
            value: "AR",
            label: "Arkansas"
        },
        {
            value: "CA",
            label: "California"
        },
        {
            value: "CO",
            label: "Colorado"
        },
        {
            value: "CT",
            label: "Connecticut"
        },
        {
            value: "DE",
            label: "Delaware"
        },
        {
            value: "FL",
            label: "Florida"
        },
        {
            value: "GA",
            label: "Georgia"
        },
        {
            value: "HI",
            label: "Hawaii"
        },
        {
            value: "ID",
            label: "Idaho"
        },
        {
            value: "IL",
            label: "Illinois"
        },
        {
            value: "IN",
            label: "Indiana"
        },
        {
            value: "IA",
            label: "Iowa"
        },
        {
            value: "KS",
            label: "Kansas"
        },
        {
            value: "KY",
            label: "Kentucky"
        },
        {
            value: "LA",
            label: "Louisiana"
        },
        {
            value: "ME",
            label: "Maine"
        },
        {
            value: "MD",
            label: "Maryland"
        },
        {
            value: "MA",
            label: "Massachusettes"
        },
        {
            value: "MI",
            label: "Michigan"
        },
        {
            value: "MN",
            label: "Minnesota"
        },
        {
            value: "MS",
            label: "Mississippi"
        },
        {
            value: "MO",
            label: "Missouri"
        },
        {
            value: "MT",
            label: "Montana"
        },
        {
            value: "NE",
            label: "Nebraska"
        },
        {
            value: "NV",
            label: "Nevada"
        },
        {
            value: "NH",
            label: "New Hampshire"
        },
        {
            value: "NJ",
            label: "New Jersey"
        },
        {
            value: "NM",
            label: "New Mexico"
        },
        {
            value: "NY",
            label: "New York"
        },
        {
            value: "NC",
            label: "North Carolina"
        },
        {
            value: "ND",
            label: "North Dakota"
        },
        {
            value: "OH",
            label: "Ohio"
        },
        {
            value: "OK",
            label: "Oklahoma"
        },
        {
            value: "OR",
            label: "Oregon"
        },
        {
            value: "PA",
            label: "Pennsylvania"
        },
        {
            value: "RI",
            label: "Rhode Island"
        },
        {
            value: "SC",
            label: "South Carolina"
        },
        {
            value: "SD",
            label: "South Dakota"
        },
        {
            value: "TN",
            label: "Tennessee"
        },
        {
            value: "TX",
            label: "Texas"
        },
        {
            value: "UT",
            label: "Utah"
        },
        {
            value: "VT",
            label: "Vermont"
        },
        {
            value: "VA",
            label: "Virginia"
        },
        {
            value: "WA",
            label: "Washington"
        },
        {
            value: "WV",
            label: "West Virginia"
        },
        {
            value: "WI",
            label: "Wisconsin"
        },
        {
            value: "WY",
            label: "Wyoming"
        },
    ];

    const [ formState, setFormState ] = useState({
        user: {
            name: user.name || "",
            phone: user.contact_number || "",
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
            },
            SHARING: {
                MVR: "NEVER",
                DRIVERS_LICENSE: "NEVER",
                MEDICAL_CARD: "NEVER",
                CONTACT_PAST_EMPLOYERS: "NEVER",
            },
            MATCHING: {
                GEOGRAPHY: [ "OTR", "REGIONAL" ],
                PREFERRED_SCHEDULE: "",
                JOB_TYPE: [ "W2", "CONTRACT" ],
                MIN_PAY: "",
                PAY_METHOD: [ "RATE_PER_MILE", "PERCENT_PER_MOVE", "HOURLY", "SET_WEEKLY", "SALARY", "PERCENT_WEIGHT" ],
                BENEFITS: []
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

                if (category === "COMMUNICATION") {
                    if (label === "PREFERRED_METHOD") {
                        value = value.split(",");
                    }
                    else if (label === "RECEIVE_SUGGESTED_JOBS") {
                        value = value == "true";
                    }
                    else if (label === "RECEIVE_NEWSLETTER") {
                        value = value == "true";
                    }
                }
                else if (category === "MATCHING") {
                    if (label === "GEOGRAPHY") {
                        value = value.split(",");
                    }
                    else if (label === "JOB_TYPE") {
                        value = value.split(",");
                    }
                    else if (label === "PAY_METHOD") {
                        value = value.split(",");
                    }
                    else if (label === "BENEFITS") {
                        value = value.split(",");
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
                phone: newUser.phone,
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
            || label === "RECEIVE_NEWSLETTER") {
                newValue = e.target.checked ? (value === "true") : currentValue;

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
            toast.success("Successfully saved your preference");
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
                                    <input name="phone" type="text" className="form-control" placeholder="Phone" onChange={e => onUserChange(e)} value={formState.user.phone} />
                                </div>
                                <div className="col-sm-6 mt-3">
                                    <label>Email</label>
                                    <input name="email" type="email" className="form-control" placeholder="E-mail" onChange={e => onUserChange(e)} value={formState.user.email} />
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
                        <h3>Communication Preferences:</h3>
                        <div className='row'>
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
                                <label>Preferred hours</label>
                                <input type="text" className="form-control" placeholder="Preferred hours" name="COMMUNICATION.PREFERRED_HOURS" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.COMMUNICATION.PREFERRED_HOURS} />
                            </div>
                            <div className="col-12 mt-3">
                                <span className={style.lable}>Receive suggested job feeds? </span>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label">Yes</label>
                                    <input class="form-check-input" type="radio" value="true" name="COMMUNICATION.RECEIVE_SUGGESTED_JOBS" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS} />
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" >No</label>
                                    <input class="form-check-input" type="radio" value="false" name="COMMUNICATION.RECEIVE_SUGGESTED_JOBS" onChange={e => onPreferenceChange(e)} checked={!formState.preferences.COMMUNICATION.RECEIVE_SUGGESTED_JOBS} />
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <span className={style.lable}>Receive newsletters?</span>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label">Yes</label>
                                    <input class="form-check-input" type="radio" value="true" name="COMMUNICATION.RECEIVE_NEWSLETTER" onChange={e => onPreferenceChange(e)} checked={formState.preferences.COMMUNICATION.RECEIVE_NEWSLETTER} />
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" >No</label>
                                    <input class="form-check-input" type="radio" value="false" name="COMMUNICATION.RECEIVE_NEWSLETTER" onChange={e => onPreferenceChange(e)} checked={!formState.preferences.COMMUNICATION.RECEIVE_NEWSLETTER} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 mt-3 text-lg-center" style={{ display: "none" }}>
                        <h2 className='my-4'>Points</h2>
                        <span>1300</span>
                        <span className={style.earn_btn}>Earn More</span>
                    </div>
                </div>
           


            <div className='row'>
                <div className="col-sm-6 mt-3">
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
                <div className="col-sm-6 mt-3">
                    <h3>Matching Preferences</h3>
                    <div className="col-12 mt-3">
                        <span className={style.lable}>Geography:</span>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">OTR</label>
                            <input className="form-check-input" type="checkbox" value="OTR" name="MATCHING.GEOGRAPHY" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.GEOGRAPHY.includes("OTR")} />
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label" >Regional</label>
                            <input className="form-check-input" type="checkbox" value="REGIONAL" name="MATCHING.GEOGRAPHY" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.GEOGRAPHY.includes("REGIONAL")} />
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <label>Preferred Schedule:</label>
                        <input type="text" className="form-control" placeholder="Preferred Schedule" name="MATCHING.PREFERRED_SCHEDULE" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.PREFERRED_SCHEDULE} />
                    </div>
                    <div className="col-12 mt-3">
                        <span className={style.lable}>Type:</span>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label">W2</label>
                            <input className="form-check-input" type="checkbox" value="W2" name="MATCHING.JOB_TYPE" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.JOB_TYPE.includes("W2")} />
                        </div>
                        <div className="form-check form-check-inline">
                            <label className="form-check-label" >1099:</label>
                            <input className="form-check-input" type="checkbox" value="CONTRACT" name="MATCHING.JOB_TYPE" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.JOB_TYPE.includes("CONTRACT")} />
                        </div>
                    </div>
                    <div className="col-12 mt-3">
                        <label>Min Pay:</label>
                        <input type="text" className="form-control" placeholder="Minimum pay" name="MATCHING.MIN_PAY" onBlur={e => onPreferenceBlur(e)} onChange={e => onPreferenceChange(e)} value={formState.preferences.MATCHING.MIN_PAY} />
                    </div>
                    <div className="col-12 mt-3">
                        <span className={style.lable}>Pay Method:</span>
                        <div className="row mt-1">
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Rate per mile</label>
                                    <input className="form-check-input" type="checkbox" value="RATE_PER_MILE" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("RATE_PER_MILE")} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Percent per move</label>
                                    <input className="form-check-input" type="checkbox" value="PERCENT_PER_MOVE" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("PERCENT_PER_MOVE")} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Hourly</label>
                                    <input className="form-check-input" type="checkbox" value="HOURLY" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("HOURLY")} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Set weekly</label>
                                    <input className="form-check-input" type="checkbox" value="SET_WEEKLY" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("SET_WEEKLY")} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Salary</label>
                                    <input className="form-check-input" type="checkbox" value="SALARY" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("SALARY")} />
                                </div>
                            </div>
                            <div className='col-6'>
                                <div className="form-check">
                                    <label className="form-check-label">Percent weight</label>
                                    <input className="form-check-input" type="checkbox" value="PERCENT_WEIGHT" name="MATCHING.PAY_METHOD" onChange={e => onPreferenceChange(e)} checked={formState.preferences.MATCHING.PAY_METHOD.includes("PERCENT_WEIGHT")} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-3" style={{ display: "none" }}>
                        <span className={style.lable}>Required Benefits:</span>
                        <input className="form-check-input" type="checkbox" />
                    </div>
                </div>
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

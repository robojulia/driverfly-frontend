
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import useRedirect from '../../../hooks/useRedirect';
import useAuth from '../../../hooks/useAuth';
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router';
import Link from "next/link";
import Select from 'react-select'


const options = [
    { value: 'internal', label: 'Internal' },
    { value: 'external url', label: 'External URL' },
    { value: 'by email', label: 'By Email' }
]

export default function NewJobs() {
    const router = useRouter();
    const { authCompany } = useRedirect();
    const [qualifications, setQualifications] = useState( [] )

    authCompany()

    const { authCheck, setAuth } = useAuth();
    const user = authCheck();
    console.log('user', user);


    const [color, setColor] = useState('red')
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)

    const [inputValues, setInputValue] = useState({
        title: user.title,
        company: user.company,
        location: user.location,
        state: user.state,
        country: user.country,
        expiry_date: user.expiry_date,
        zipcode: user.zipcode,

    })

    const [serverValidation, setServerValidation] = useState([])

    const [validation, setValidation] = useState()


    const handleChange = (event) => {
        const { name, value } = event.target
        setInputValue((preValue) => {
            return {
                ...preValue,
                [name]: value,
            }
        })
    }

    const profileHandler = async (e) => {
        e.preventDefault();
        let errors = {}
        setServerValidation('')

        //Title validation

        if (!inputValues.title) {
            errors.title = "Title is required"
        }

        //company validation
        if (!inputValues.company) {
            errors.company = "Company is required"
        }


        //category validation
        if (!inputValues.category) {
            errors.category = "Category is required"
        }

        //State validation

        if (!inputValues.location) {
            errors.location = "Location is required"
        }
        //Country validation

        if (!inputValues.country) {
            errors.country = "Country is required"
        }

        //Zipcode validation

        if (!inputValues.zipcode) {
            errors.zipcode = "Zipcode is required"
        }


        //expiry_date validation

        if (!inputValues.expiry_date) {
            errors.expiry_date = "expiry_date is required"
        }


        // if (!inputValues.confirmPassword) {
        //   errors.confirmPassword = "Password confirmation is required"
        // } else if (inputValues.confirmPassword !== inputValues.password) {
        //   errors.confirmPassword = "Password does not match confirmation password"
        // }


        setValidation(errors)

        if (Object.keys(errors).length == 0) {

            setSaveButtonDisabled(true)
            inputValues.name = `${inputValues.title} ${inputValues.company}`

            const headers = {
                'Authorization': `Bearer ${user.token}`,
                "content-type": "application/json; charset=utf-8"
            };

            await axios.put(
                `${process.env.BASE_URL_API}/user/}`,
                { user: { ...inputValues } },
                { headers }
            )
                .then(data => {
                    console.log("handle success", data.data.user)
                    setValidation({})
                    user.title = data.data.user.title
                    user.company = data.data.user.company
                    user.location = data.data.user.location
                    user.state = data.data.user.state
                    user.country = data.data.user.country
                    user.expiry_date = data.data.user.expiry_date
                    user.zipcode = data.data.user.zipcode
                    setAuth(user)
                    setColor("green")
                    setServerValidation('Updated successfully!')
                    toast.success("Updated Successfully! ", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setQualifications([])
                    setResume(null)
                    setCommercial_driving_license(null)
                    setMedical_card(null)
                    document.getElementById("myForm").reset();

                    setTimeout(() => {
                        setServerValidation('')
                    }, 5000);
                })
                .catch(function (error) {
                    console.log("handle error success", error.response)
                    if (error.response) {
                        if (error.response.data.message) {
                            setServerValidation(error.response.data.message)
                        } else if (error.response.data.errors) {
                            setColor("red")
                            console.log('here')
                            console.log(error.response.data.errors.user)
                            if (error.response.data.errors.user) {
                                setServerValidation(error.response.data.errors.user)
                            } else {
                                setServerValidation(error.response.data.errors.username)
                            }

                        } else if (error.response.data.err) {
                            setColor("green")
                            setServerValidation('Profile Updated')
                        }
                    } else {
                        setServerValidation('Something went south')
                    }
                }).then(function () {
                    console.log("always executed")
                    setSaveButtonDisabled(false)
                })
        }

    }


    return (

        <>

            <ToastContainer />
            <div>

                <Row>
                    <h1>Add New Jobs</h1>
                </Row>
                <div className='container-fluid'>
                    <div className="modal-header border-0 add_job__container">
                    </div>
                    <form className="modal-body" id="myForm" >
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Expiry Date</label>
                                <input onChange={(e) => handleChange(e)} name="expiry_date" value={inputValues.expiry_date} type="date" className="form-control" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.expiry_date}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Application Deadline Date</label>
                                <input onChange={(e) => handleChange(e)} name="application_deadline_date" value={inputValues.application_deadline_date} type="date" className="form-control" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.application_deadline_date}</p>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-12 mt-3">
                <label>Job Apply Type</label>
                <Select
                  placeholder="Select your Qualifications..."
                  // onChange={( s ) => setQualifications( s.map( i => i.value ) )}
                  value={options}
                  onChange={(v) => setQualifications(v)}
                  isMulti options={options} />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.options}</p>
              </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Job Apply Email</label>
                                <input onChange={(e) => handleChange(e)} name="email" value={inputValues.email} type="text" className="form-control" placeholder="Email" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Min. Salary</label>
                                <input onChange={(e) => handleChange(e)} name="min_salary" value={inputValues.min_salary} type="number" className="form-control" placeholder="Min Salary" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.min_salary}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Max. Salary</label>
                                <input onChange={(e) => handleChange(e)} name="max_salary" value={inputValues.max_salary} type="number" className="form-control" placeholder="Max Salary" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.max_salary}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Salary Type</label>
                                <select name="salary_type" id="salary_type" className="w-100 select_pading" >
                                    <option value="monthly">Monthly</option>
                                    <option value="weekly">weekly</option>
                                    <option value="daily">Daily</option>
                                    <option value="Hourly">Hourly</option>
                                    <option value="Yearly">Yearly</option>
                                </select>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.salary_type}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Posted By</label>
                                <input onChange={(e) => handleChange(e)} name="posted_by" value={inputValues.posted_by} type="text" className="form-control" placeholder="Posted By" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.posted_by}</p>
                            </div>


                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Featured</label>
                                <input onChange={(e) => handleChange(e)} name="featured" value={inputValues.featured} type="checkbox" className="job_check_box" id="featured" value="featured" />
                                <label className="ml-4" for="featured"> Featured jobs will be sticky during searches, and can be styled differently.</label><br></br>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.featured}</p>

                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Urgent Job</label>
                                <input onChange={(e) => handleChange(e)} name="urgent_job" value={inputValues.urgent_job} type="checkbox" className="job_check_box" id="urgent_job" value="urgent job" />
                                <label className="ml-4" for="urgent_job">  Urgent jobs will be sticky during searches, and can be styled differently.</label><br></br>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.urgent_job}</p>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Filled</label>
                                <input onChange={(e) => handleChange(e)} name="filled" value={inputValues.filled} type="checkbox" className="job_check_box" id="filled" value="filled job" />
                                <label className="ml-4" for="filled">  Filled listings will no longer accept applications.</label><br></br>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.filled}</p>

                            </div>
                        </div>
                        <div className="row">

                            <div className="col-12 mt-3">
                                <label>Posted By</label>
                                <input onChange={(e) => handleChange(e)} name="posted_by" value={inputValues.posted_by} type="text" className="form-control" placeholder="Posted By" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.posted_by}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Areas Covered</label>
                                <input name="area_covered" type="checkbox" className="job_check_box" id="area_covered" value="Area Covered" />
                                <label className="ml-4" for="area_covered"> Local</label><br></br>
                                <input name="area_covered" type="checkbox" className="job_check_box" id="area_covered" value=" Regional" />
                                <label className="ml-4" for="area_covered"> Regional</label><br></br>
                                <input name="area_covered" type="checkbox" className="job_check_box" id="area_covered" value=" OTR" />
                                <label className="ml-4" for="area_covered"> OTR</label><br></br>
                                <input name="area_covered" type="checkbox" className="job_check_box" id="area_covered" value=" Cross Border" />
                                <label className="ml-4" for="area_covered"> Cross Border</label><br></br>

                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Full-time/Part-time</label>
                                <select name="full_part_time" id="full_part_time" className="w-100 select_pading" >
                                    <option value="part-time">Part-time</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="full-time_part-time">Either Full-time or Part-time</option>

                                </select>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.full_part_time}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Employment Type</label>
                                <select name="employment_type" id="employment_type" className="w-100 select_pading" >
                                    <option value="w-2">W-2</option>
                                    <option value="1999">1999</option>
                                </select>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.employment_type}</p>
                            </div>


                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Type of Delivery</label>
                                <input name="type_of_delivery" type="checkbox" className="job_check_box" id="type_of_delivery" value="Touch" />
                                <label className="ml-4" for="type_of_delivery"> Touch</label><br></br>
                                <input name="type_of_delivery" type="checkbox" className="job_check_box" id="type_of_delivery" value="  No Touch" />
                                <label className="ml-4" for="type_of_delivery"> No Touch</label><br></br>
                                <input name="type_of_delivery" type="checkbox" className="job_check_box" id="type_of_delivery" value="  Drop-and-hook" />
                                <label className="ml-4" for="type_of_delivery"> Drop-and-hook</label><br></br>
                                <input name="type_of_delivery" type="checkbox" className="job_check_box" id="type_of_delivery" value=" Dedicated Lanes" />
                                <label className="ml-4" for="type_of_delivery">Dedicated Lanes</label><br></br>

                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Accepting Drivers From...</label>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="Anywhere in the US" />
                                <label className="ml-4" for="accepting_drivers_from"> Anywhere in the US</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="  Alabama" />
                                <label className="ml-4" for="accepting_drivers_from">  Alabama</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value=" Alaska" />
                                <label className="ml-4" for="accepting_drivers_from">  Alaska</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="Arizona" />
                                <label className="ml-4" for="accepting_drivers_from">Arizona</label><br></br>

                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="Anywhere in the US" />
                                <label className="ml-4" for="accepting_drivers_from"> Anywhere in the US</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="  Alabama" />
                                <label className="ml-4" for="accepting_drivers_from">  Alabama</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value=" Alaska" />
                                <label className="ml-4" for="accepting_drivers_from">  Alaska</label><br></br>
                                <input name="accepting_drivers_from" type="checkbox" className="job_check_box" id="accepting_drivers_from" value="Arizona" />
                                <label className="ml-4" for="accepting_drivers_from">Arizona</label><br></br>

                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Equipment Type</label>
                                <input name="equipment_type" type="checkbox" className="job_check_box" id="equipment_type" value=" Tractor trailer" />
                                <label className="ml-4" for="equipment_type">  Tractor trailer</label><br></br>
                             </div>
                         </div>
                         <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Schedule</label>
                                <input name="schedule" type="radio" className="job_check_box" id="schedule" value=" Multiple weeks on the road" />
                                <label className="ml-4" for="schedule"> Multiple weeks on the road</label><br></br>
                                <input name="schedule" type="radio" className="job_check_box" id="schedule" value=" Multiple weeks on the road" />
                                <label className="ml-4" for="schedule"> Multiple weeks on the road</label><br></br>
                             </div>
                         </div>
                         <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Pay Structure</label>
                                <input name="pay_structure" type="checkbox" className="job_check_box" id="pay_structure" value="Rate per mile" />
                                <label className="ml-4" for="pay_structure"> Rate per mile</label><br></br>
                                <input name="pay_structure" type="checkbox" className="job_check_box" id="pay_structure" value="Percent per move" />
                                <label className="ml-4" for="pay_structure">Percent per move</label><br></br>
                            </div>

                        </div>

                        <div className="border-0 mt-5">
                            {serverValidation instanceof Array ? serverValidation.map((inValid) => {
                                return (
                                    <div style={{ fontStyle: "italic", color: color }}>{inValid}</div>
                                )

                            }) : <div style={{ fontStyle: "italic", color: color }}>{serverValidation}</div>}

                            <button disabled={saveButtonDisabled}
                                type="submit"
                                onClick={profileHandler}
                                className="btn btn-primary  m-auto p-lg-3 p-5">
                                Submit
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </>
    )
};

NewJobs.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

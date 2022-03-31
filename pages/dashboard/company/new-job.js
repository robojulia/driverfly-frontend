
import { Row, Col, Table, Card, CardTitle, CardBody } from "reactstrap";
import { Checkbox } from 'pretty-checkbox-react';
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
import { apply_type } from '../../../enums/jobs/job-fields'
import { salary_type } from '../../../enums/jobs/job-fields'
import { job_type } from '../../../enums/jobs/job-fields'
import { delivery_type } from '../../../enums/jobs/job-fields'
import { mvr_requirement } from '../../../enums/jobs/job-fields'
import { areas_covered } from '../../../enums/jobs/job-fields'
import { accepting_drivers_from } from '../../../enums/jobs/job-fields'
import { equipment_type } from '../../../enums/jobs/job-fields'
import { schedule } from '../../../enums/jobs/job-fields'
import { pay_structure } from '../../../enums/jobs/job-fields'
import { special_accommodations } from '../../../enums/jobs/job-fields'
import { special_endorsements_required } from '../../../enums/jobs/job-fields'
import { useRef, useEffect } from "react";


import { Check } from "react-feather";


export default function NewJobs() {

    const { authCompany } = useRedirect();
    authCompany()

    const editorRef = useRef()
    const [editorLoaded, setEditorLoaded] = useState(false)
    const { CKEditor, ClassicEditor } = editorRef.current || {}

    useEffect(() => {
        editorRef.current = {
            CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, //Added .CKEditor
            ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
        }
        setEditorLoaded(true)
    }, []);
    const [CKData, setCKData] = useState('');


    const router = useRouter();

    const [ApplyType, setApplyType] = useState([])
    const apply_type_options = []
    for (const [key, itemVal] of Object.entries(apply_type)) {
        apply_type_options.push({
            value: itemVal, label: itemVal
        })
    }

    const [SalaryType, setSalaryType] = useState([])
    const salary_type_options = []
    for (const [key, itemVal] of Object.entries(salary_type)) {
        salary_type_options.push({
            value: itemVal, label: itemVal
        })
    }

    const [JobType, setJobType] = useState([])
    const job_type_options = []
    for (const [key, itemVal] of Object.entries(job_type)) {
        job_type_options.push({
            value: itemVal, label: itemVal
        })
    }
    const [MvrRequirement, setMvrRequirement] = useState([])
    const mvr_requirement_options = []
    for (const [key, itemVal] of Object.entries(mvr_requirement)) {
        mvr_requirement_options.push({
            value: itemVal, label: itemVal
        })
    }

    const { authCheck, setAuth } = useAuth();
    const user = authCheck();
    console.log('user', user);
    const company = {};
    console.log('company', company);


    const [color, setColor] = useState('red')
    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)

    const [inputValues, setInputValue] = useState({
        title: company.title,
        description: company.description,
        location: company.location,
        expiry_date: company.expiry_dates,
        application_deadline_date: company.application_deadline_date,
        email: company.email,
        min_salary: company.min_salary,
        max_salary: company.max_salary,
        featured: company.featured,
        posted_by: company.posted_by,

        urgent_job: company.urgent_job,
        filled: company.filled,
        area_covered: company.area_covered,
        min_rate_per_mile: parseInt(company.min_rate_per_mile) ?? 0,
        max_rate_per_mile: parseInt(company.max_rate_per_mile) ?? 0,
        ApplyType: company.ApplyType,
        areas_covered: company.areas_covered,

    })

    const [serverValidation, setServerValidation] = useState([])

    const [validation, setValidation] = useState()


    const handleChange = (event) => {
        let { name, value } = event.target

        if (name == "min_rate_per_mile" || name == 'max_rate_per_mile') {
            value = parseInt(value)
        }

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

        //location validation
        if (!inputValues.location) {
            errors.location = "location is required"
        }

        console.log('CKData.length', CKData)
        //Description validation
        inputValues.description = CKData
        if (!inputValues.description) {
            errors.description = "Description is required"
        }

        //expiry date validation
        if (!inputValues.expiry_date) {
            errors.expiry_date = "Expiry Date is required"
        }

        //application_deadline_date validation
        if (!inputValues.application_deadline_date) {
            errors.application_deadline_date = "Application Deadline Date is required"
        }

        //email validation
        if (!inputValues.email) {
            errors.email = "Email is required"
        }


        //min_salary validation
        if (!inputValues.min_salary) {
            errors.min_salary = "Min Salary is required"
        }

        //max_salary validation
        if (!inputValues.max_salary) {
            errors.max_salary = "Max Salary is required"
        }

        //posted_by validation

        if (!inputValues.posted_by) {
            errors.posted_by = "Posted By is required"
        }
        //featured validation

        if (!inputValues.featured) {
            errors.featured = "Featured is required"
        }

        //Urgent Job validation

        if (!inputValues.urgent_job) {
            errors.urgent_job = "Urgent Job is required"
        }

        //Fill Job validation

        if (!inputValues.filled) {
            errors.filled = "Fill is required"
        }

        // //area_covered validation

        // if (!inputValues.area_covered) {
        //     errors.area_covered = "Area Covered is required"
        // }

        //Max Rate Per Mile ($) validation

        if (!inputValues.max_rate_per_mile) {
            errors.max_rate_per_mile = "Max Rate Per Mile ($) is required"
        }

        //Min Rate Per Mile ($) validation

        if (!inputValues.min_rate_per_mile) {
            errors.min_rate_per_mile = "Min Rate Per Mile ($) is required"
        }
        //ApplyType validation

        // if (!inputValues.ApplyType) {
        //     errors.ApplyType = "ApplyType is required"
        // }

        // //Areas Covered validation

        // if (!inputValues.areas_covered) {
        //     errors.areas_covered = " Areas Covered is required"
        // }

        //Delivery Type validation

        if (!inputValues.delivery_type) {
            errors.delivery_type = " Delivery Type is required"
        }

        //schedule validation

        if (!inputValues.schedule) {
            errors.schedule = " Schedule is required"
        }

        //accepting_drivers_from validation

        if (!inputValues.accepting_drivers_from) {
            errors.accepting_drivers_from = " Accepting Drivers From is required"
        }

        //equipment_type validation

        if (!inputValues.equipment_type) {
            errors.equipment_type = " Equipment Type is required"
        }


        //Pay Structure validation

        // if (!inputValues.pay_structure) {
        //     errors.pay_structure = " Pay Structure is required"
        // }

        // if (!inputValues.confirmPassword) {
        //   errors.confirmPassword = "Password confirmation is required"
        // } else if (inputValues.confirmPassword !== inputValues.password) {
        //   errors.confirmPassword = "Password does not match confirmation password"
        // }


        setValidation(errors)
        console.log("errors", errors)
        if (Object.keys(errors).length == 0) {

            setSaveButtonDisabled(true)

            const headers = {
                'Authorization': `Bearer ${user.token}`,
                "content-type": "application/json; charset=utf-8"
            };

            await axios.post(
                `${process.env.BASE_URL_API}/jobs`,

                { ...inputValues },

                { headers }
            )
                .then(data => {
                    console.log("handle success", data.data)
                    setValidation({})
                    setColor("green")
                    setServerValidation('Updated successfully!')
                    toast.success("Job Created Successfully! ", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setApplyType([])
                    setSalaryType([])
                    setJobType([])
                    DeliveryType([])
                    MvrRequirement([])

                    document.getElementById("myForm").reset();

                    setTimeout(() => {
                        setServerValidation('')
                    }, 5000);
                })
                .catch(function (error) {
                    console.log("handle error success", error)
                    setServerValidation('Something went south')
                    toast.warning("Something went south ", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

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
                                <label>Title</label>
                                <input onChange={(e) => handleChange(e)} name="title" value={inputValues.title} type="text" className="form-control " id="title" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.title}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Location</label>
                                <input onChange={(e) => handleChange(e)} name="location" value={inputValues.location} type="text" className="form-control " id="location" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.location}</p>
                            </div>
                        </div>
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
                            <div className=" col-lg-6 col-12 mt-3">
                                <label>Job Apply Type</label>
                                <Select className="job__select" onChange={(e) => handleChange(e)} value={inputValues.ApplyType} name="ApplyType"
                                    placeholder="Select your ApplyType..."
                                    value={ApplyType}
                                    onChange={(v) => setApplyType(v)}
                                    isMulti options={apply_type_options} />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.ApplyType}</p>

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
                                <input onChange={(e) => handleChange(e)} name="min_salary" value={parseInt(inputValues.min_salary)} type="number" className="form-control" placeholder="Min Salary" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.min_salary}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Max. Salary</label>
                                <input onChange={(e) => handleChange(e)} name="max_salary" value={parseInt(inputValues.max_salary)} type="number" className="form-control" placeholder="Max Salary" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.max_salary}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Salary Type</label>
                                <Select className="job__select"
                                    placeholder="Select your ApplyType..."
                                    value={SalaryType}
                                    onChange={(v) => setSalaryType(v)}
                                    isMulti options={salary_type_options} />
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
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Areas Covered</label>
                                {
                                    areas_covered &&
                                    Object.entries(areas_covered).map((val) => {
                                        return (<div ><input type="checkbox" value={val[1]} /><span className="job_check_box"  >{val[1]} </span></div>)
                                    })

                                }

                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Full-time/Part-time</label>
                                <Select className="job__select"
                                    placeholder="Select Job Type..."
                                    value={JobType}
                                    onChange={(v) => setJobType(v)}
                                    isMulti options={job_type_options} />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.job_type}</p>
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

                                {
                                    delivery_type &&
                                    Object.entries(delivery_type).map((val) => {
                                        return (<div><input onChange={(e) => handleChange(e)} name="delivery_type" value={inputValues.delivery_type} type="checkbox" value={val[1]} /><span className="job_check_box"  >{val[1]} </span></div>)
                                    })
                                }
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.delivery_type}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Schedule</label>
                                {
                                    schedule &&
                                    Object.entries(schedule).map((val) => {
                                        return (<div><input onChange={(e) => handleChange(e)} name="schedule" value={inputValues.schedule} type="radio" value={val[1]} /><span className="job_check_box"  >{val[1]} </span></div>)
                                    })
                                }
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.schedule}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Accepting Drivers From...</label>
                                {
                                    accepting_drivers_from &&
                                    Object.entries(accepting_drivers_from).map((val) => {
                                        return (<div><input onChange={(e) => handleChange(e)} name="accepting_drivers_from" value={inputValues.accepting_drivers_from} type="checkbox" value={val[1]} /><span className="job_check_box"  >{val[1]} </span></div>)
                                    })
                                }
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.accepting_drivers_from}</p>
                            </div>


                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Equipment Type</label>
                                {
                                    equipment_type &&
                                    Object.entries(equipment_type).map((val) => {
                                        return (<div><input onChange={(e) => handleChange(e)} name="equipment_type" value={inputValues.equipment_type} type="checkbox" value={val[1]} /> <span className="job_check_box"  >{val[1]} </span></div>)
                                    })
                                }
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.equipment_type}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100">Pay Structure</label>
                                {
                                    pay_structure &&
                                    Object.entries(pay_structure).map((val) => {
                                        return (<div><input onChange={(e) => handleChange(e)} name="pay_structure" value={inputValues.pay_structure} type="checkbox" value={val[1]} /><span className="job_check_box"  >{val[1]} </span></div>)
                                    })
                                }
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.pay_structure}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Minimum Age</label>
                                <select class="form-select select" aria-label="Default select example">
                                    <option selected> Select Age</option>
                                    <option value="18">18</option>
                                    <option value="19">19</option>
                                    <option value="20">20</option>
                                    <option value="18">21</option>
                                    <option value="19">22</option>
                                    <option value="20">23</option>
                                    <option value="18">24</option>
                                </select>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.minimum_age}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Max Rate Per Mile ($)</label>
                                <input onChange={(e) => handleChange(e)} name="max_rate_per_mile" value={inputValues.max_rate_per_mile} type="number" className="form-control" placeholder="e.g. 0.60" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.max_rate_per_mile}</p>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Min Rate Per Mile ($)</label>
                                <input onChange={(e) => handleChange(e)} name="min_rate_per_mile" value={inputValues.min_rate_per_mile} type="number" className="form-control" placeholder="e.g. 0.50" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.min_rate_per_mile}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label className="w-100"> Mvr Requirement</label>
                                <Select className="job__select"
                                    placeholder="Select Mvr Requirement"
                                    value={MvrRequirement}
                                    onChange={(v) => setMvrRequirement(v)}
                                    isMulti options={mvr_requirement_options} />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.MvrRequirement}</p>

                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-12 col-12 mt-3">
                                <label>WYS</label>
                                {editorLoaded ? <CKEditor
                                    editor={ClassicEditor}
                                    data={CKData}
                                    onReady={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        // console.log('Editor is ready to use!', editor);
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData()
                                        setCKData(data);
                                    }}
                                /> : <p>Loading Editor...</p>}
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.description}</p>

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
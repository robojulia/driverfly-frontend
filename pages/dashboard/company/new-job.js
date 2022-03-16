
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


export default function NewJobs() {
    const router = useRouter();
    const { authCompany } = useRedirect();

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
        city: user.city,
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


        //City validation

        if (!inputValues.city) {
            errors.city = "City is required"
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
                    user.city = data.data.user.city
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
                    <div className="modal-header border-0">
                    </div>
                    <form className="modal-body" >
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Title</label>
                                <input onChange={(e) => handleChange(e)} name="title" value={inputValues.title} type="text" className="form-control" placeholder="Title" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.title}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Company</label>
                                <input onChange={(e) => handleChange(e)} name="company" value={inputValues.company} type="text" className="form-control" placeholder="Company" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.company}</p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Category</label>
                                <input onChange={(e) => handleChange(e)} name="title" value={inputValues.category} value={user.category} className="form-control" placeholder="Category" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.category}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Location</label>
                                <input type="number" onChange={(e) => handleChange(e)} name="location" value={inputValues.location} className="form-control" placeholder="Location" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.location}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Country</label>
                                <input onChange={(e) => handleChange(e)} name="country" value={inputValues.country} type="text" className="form-control" placeholder="Country" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.country}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>State</label>
                                <input onChange={(e) => handleChange(e)} name="state" value={inputValues.state} type="text" className="form-control" placeholder="State" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.state}</p>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>City</label>
                                <input onChange={(e) => handleChange(e)} name="city" value={inputValues.city} type="text" className="form-control" placeholder="City" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.city}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>Zipcode</label>
                                <input onChange={(e) => handleChange(e)} name="zipcode" value={inputValues.zipcode} type="text" className="form-control" placeholder="Zipcode" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.zipcode}</p>
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

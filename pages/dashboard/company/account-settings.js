import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import useAuth from '../../../hooks/useAuth';

export default function AccountSettings() {
    const { authCheck, setAuth } = useAuth();
    const user = authCheck();
    console.log('user', user);
    // if (!user) {
    //     Router.push('/login')
    // }

    const [color, setColor] = useState('red')

    const [inputValues, setInputValue] = useState({
        company_name: null,
        email: null,
        address: null,
        city: null,
        state: null,
        code: null,
        about: null,
        location: null,
       
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
  // if (!inputValues.confirmPassword) {
        //   errors.confirmPassword = "Password confirmation is required"
        // } else if (inputValues.confirmPassword !== inputValues.password) {
        //   errors.confirmPassword = "Password does not match confirmation password"
        // }







    const profileHandler = async (e) => {
        e.preventDefault();
        let errors = {}

        //First Name validation

        if (!inputValues.first_name) {
            errors.company_name = "Company Name is required"
        }

        //email validation

        if (!inputValues.email) {
            errors.email = "Email is required"
        }

        //contact_number validation
        if (!inputValues.address) {
            errors.address = "Address is required"
        }

        //City validation

        if (!inputValues.city) {
            errors.city = "City is required"
        }

        //State validation

        if (!inputValues.state) {
            errors.state = "State is required"
        }

          //Postalcode validation

          if (!inputValues.code) {
            errors.code = "Postalcode is required"
        }
 
        //About validation

        if (!inputValues.about) {
            errors.about = "About is required"
        }

          //Location validation

          if (!inputValues.location) {
            errors.location = "Location is required"
        }

      

        


        setValidation(errors)

        // Call API of signup
        if (Object.keys(errors).length == 0) {
            console.log('you can proceed with the API')

            await axios.put(`${process.env.BASE_URL_API}/users/${user.id}`, inputValues)
                .then(data => {
                    console.log("handle success", data.data)

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
                            setServerValidation('User registered successfully')
                            setTimeout(() => {
                                Router.push('/login')
                            }, 3000);
                        }

                    }
                }).then(function () {
                    console.log("always executed")
                })
        }

    }
    return (
        <>

            <div>

                <Row>
                    <h1>Account Settings</h1>
                </Row>
                <div className='container-fluid'>
                    <div className="modal-header border-0">
                    </div>
                    <form className="modal-body">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <label>Company Name</label>
                                <input onChange={(e) => handleChange(e)} name="company_name" value={inputValues.company_name} type="text" className="form-control" placeholder=" Company Name" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.company_name}</p>
                            </div>
                            <div className="col-lg-6 col-12">
                                <label>Email</label>
                                <input onChange={(e) => handleChange(e)} name="email" value={inputValues.email}  type="text" className="form-control" placeholder="Email" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Address</label>
                                <input  onChange={(e) => handleChange(e)} name="address" value={inputValues.address} type="text" className="form-control" placeholder="Address" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.address}</p>
                            </div>

                            <div className="col-lg-6 col-12 mt-3">
                                <label>City</label>
                                <input  onChange={(e) => handleChange(e)}  value={inputValues.city} type="text" className="form-control" placeholder="City" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.city}</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>State</label>
                                <input type="text" onChange={(e) => handleChange(e)} name="state" value={inputValues.state}  className="form-control" placeholder="State" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.state}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Postal Code</label>
                                <input type="number" onChange={(e) => handleChange(e)} name="code" value={inputValues.code}  className="form-control" placeholder="Postal Code" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.code}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>About Company</label>
                                <textarea  onChange={(e) => handleChange(e)} name="about" value={inputValues.about} className="form-control" placeholder="About"></textarea>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.about}</p>
                            </div>
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Company Location</label>
                                <input type="text" name="location" className="form-control" placeholder="Company Location" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.location}</p>
                            </div>
                        </div>

                        <div className="modal-footer border-0 mt-5">
                            <button type="submit" onClick={profileHandler}  className="btn btn-primary w-25 m-auto p-lg-3 p-5">Save</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
};

AccountSettings.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

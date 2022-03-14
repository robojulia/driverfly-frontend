import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../hooks/useAuth';
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react'
import useRedirect from '../../../hooks/useRedirect';

export default function AccountSettings() {

    const { authCompany } = useRedirect();

    authCompany()

    const { authCheck, setAuth } = useAuth();
    const user = authCheck();
    console.log('user', user);


    const [color, setColor] = useState('red')

    const [inputValues, setInputValue] = useState({


        name: user.name,
        address: user.address,
        // company_name: user.company_name,
        // about: user.about,
        // location: user.location,


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

        //First Name validation

        if (!inputValues.name) {
            errors.name = "Name is required"
        }

        //contact_number validation
        if (!inputValues.address) {
            errors.address = "Address is required"
        }

        //Company Name validation

        // if (!inputValues.company_name) {
        //     errors.company_name = "Company Name is required"
        // }


        //About validation

        // if (!inputValues.about) {
        //     errors.about = "About is required"
        // }

        //Location validation

        // if (!inputValues.location) {
        //     errors.location = "Location is required"
        // }






        setValidation(errors)

        // Call API of signup
        if (Object.keys(errors).length == 0) {

            const headers = {
                'Authorization': `Bearer ${user.token}`,
                // 'token': `${user.token}`,
                "content-type": "application/json; charset=utf-8"
            };

            await axios.put(
                `${process.env.BASE_URL_API}/companies/user/`,
                { ...inputValues },
                { headers }
            )
                .then(data => {
                    console.log("handle success", data.data.user)
                    setValidation({})
                    user.name = data.data.user.name
                    user.address = data.data.user.address

                    console.log('before setAuth', user)
                    setAuth(user)
                    console.log('after setAuth', authCheck())
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
                    <h1>Company Profile</h1>
                </Row>
                <div className='container-fluid'>
                    <div className="modal-header border-0">
                    </div>
                    <form className="modal-body">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <label>Name</label>
                                <input onChange={(e) => handleChange(e)} name="name" value={inputValues.name} type="text" className="form-control" placeholder=" Company Name" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.name}</p>
                            </div>
                            <div className="col-lg-6 col-12 ">
                                <label>Address</label>
                                <input onChange={(e) => handleChange(e)} name="address" value={inputValues.address} type="text" className="form-control" placeholder="Address" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.address}</p>
                            </div>

                        </div>
                        {/* <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>Company Name</label>
                                <input onChange={(e) => handleChange(e)} name="company_name" value={inputValues.company_name} type="text" className="form-control" placeholder=" Company Name" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.company_name}</p>
                            </div> */}

                            {/* <div className="col-lg-6 col-12 mt-3">
                                <label>Company Location</label>
                                <input type="text" onChange={(e) => handleChange(e)} name="location" value={inputValues.location} className="form-control" placeholder="Company Location" />
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.location}</p>
                            </div>
                        </div> */}
                        {/* <div className="row">
                            <div className="col-lg-6 col-12 mt-3">
                                <label>About Company</label>
                                <textarea onChange={(e) => handleChange(e)} name="about" value={inputValues.about} className="form-control" placeholder="About"></textarea>
                                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.about}</p>
                            </div>
                        </div> */}
                        <div className="border-0 mt-5">
                            <button type="submit" onClick={profileHandler} className="btn btn-primary  p-lg-3 p-5">Update</button>
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

import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../hooks/useAuth';
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react'
import useRedirect from '../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function AccountSettings() {

  const { authCompany } = useRedirect();

  authCompany()

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();
  console.log('user', user);


  const [color, setColor] = useState('red')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false)

  const [inputValues, setInputValue] = useState({
    name: user.name,
    first_name: user.first_name,
    last_name: user.last_name,
    contact_number: user.contact_number,
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

    //First Name validation

    if (!inputValues.first_name) {
      errors.first_name = "First Name is required"
    }

    //last_name validation
    if (!inputValues.last_name) {
      errors.last_name = "Last Name is required"
    }


    //contact_number validation
    if (!inputValues.contact_number) {
      errors.contact_number = "Contact number is required"
    }

    //State validation

    if (!inputValues.state) {
      errors.state = "State is required"
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
      inputValues.name = `${inputValues.first_name} ${inputValues.last_name}`

      const headers = {
        'Authorization': `Bearer ${user.token}`,
        "content-type": "application/json; charset=utf-8"
      };

      await axios.put(
        `${process.env.BASE_URL_API}/user/${user.id}`,
        { user: { ...inputValues } },
        { headers }
      )
        .then(data => {
          console.log("handle success", data.data.user)
          setValidation({})
          user.name = data.data.user.name
          user.first_name = data.data.user.first_name
          user.last_name = data.data.user.last_name
          user.contact_number = data.data.user.contact_number
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
          <h1>Company Settings</h1>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body" >
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>First Name</label>
                <input onChange={(e) => handleChange(e)} name="first_name" value={inputValues.first_name} type="text" className="form-control" placeholder="First Name" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.first_name}</p>
              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Last Name</label>
                <input onChange={(e) => handleChange(e)} name="last_name" value={inputValues.last_name} type="text" className="form-control" placeholder="Last Name" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.last_name}</p>
              </div>
            </div>
            <div className='row'>
              <div className="col-lg-6 col-12 mt-3">
                <label>Email</label>
                <input type="email" value={user.email} className="form-control" placeholder="E-mail" disabled />
              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Contact Number</label>
                <input type="number" onChange={(e) => handleChange(e)} name="contact_number" value={inputValues.contact_number} className="form-control" placeholder="Contact Number" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.contact_number}</p>
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

AccountSettings.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

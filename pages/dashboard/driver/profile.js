import LogoutButton from '../../../components/buttons/Logout';
import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import useAuth from '../../../hooks/useAuth';
import Router from 'next/router';
import axios from 'axios';
import { useState } from 'react'
import useRedirect from '../../../hooks/useRedirect';

export default function Profile() {

  const { authDriver } = useRedirect();

  authDriver()

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();
  console.log('user', user);
  if (!user) {
    Router.push('/login')
  }

  const [color, setColor] = useState('red')

  const [inputValues, setInputValue] = useState({
    first_name: null,
    last_name: null,
    email: null,
    contact_number: null,
    state: null,
    country: null,
    city: null,
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

    if (!inputValues.first_name) {
      errors.first_name = "First Name is required"
    }

    //last_name validation
    if (!inputValues.last_name) {
      errors.last_name = "Last Name is required"
    }

    //email validation

    if (!inputValues.email) {
      errors.email = "Email is required"
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
        < div className='row'>
          <h1>Profile</h1>
        </div>
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
                <input type="email" onChange={(e) => handleChange(e)} name="email" value={inputValues.email} className="form-control" placeholder="E-mail" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
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

              <button type="submit" onClick={profileHandler} className="btn btn-primary  m-auto p-lg-3 p-5">Submit</button>
            </div>

          </form>
        </div>


      </div>
    </>
  )
};

Profile.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

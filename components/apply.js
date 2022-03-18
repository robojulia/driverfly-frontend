import { useState } from 'react'
import { useRouter } from "next/router"
import axios from "axios"
import useAuth from '../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify'

export default function JobApply() {

  const { authCheck } = useAuth();
  const user = authCheck()

  console.log('user auth', user)

  const router = useRouter()

  const [inputValues, setInputValues] = useState({
    userId: user.id ?? null,
    first_name: user.first_name ?? "",
    last_name: user.last_name ?? "",
    phone: user.contact_number ?? "",
    email: user.email ?? "",
    qualifications: user.qualifications ?? "",
    voilations: user.voilations ?? "",
    // resume: "",
    // commercial_driving_license: "",
    // medical_card: "",
    cdl_experience: user.cdl_experience ?? "",
  })

  const inputDisabled = {
    first_name: user.first_name ? true : false,
    first_name: user.first_name ? true : false,
    last_name: user.last_name ? true : false,
    phone: user.contact_number ? true : false,
    email: user.email ? true : false,
    qualifications: user.qualifications ? true : false,
    voilations: user.voilations ? true : false,
    resume: user.resume ? true : false,
    commercial_driving_license: user.commercial_driving_license ? true : false,
    medical_card: user.medical_card ? true : false,
    cdl_experience: user.cdl_experience ? true : false,
  }
  console.log('inputDisabled', inputDisabled)

  const [resume, setResume] = useState(null)
  const [commercial_driving_license, setCommercial_driving_license] = useState(null)
  const [medical_card, setMedical_card] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setInputValues(preValue => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }

  function Upload(event) {
    if (event.target.files && event.target.files[0]) {
      const t = event.target.name
      const file = event.target.files[0]
      if (t == "cv") {
        setResume(file)
        console.log(file)
      }
      if (t == "card") {
        setMedical_card(file)
      }
      if (t == "license") {
        setCommercial_driving_license(file)
      }
    }
  }


  const [validation, setValidation] = useState()

  const submitHandler = async (e) => {
    e.preventDefault()
    let errors = {}
    if (!inputValues.first_name) {
      errors.first_name = "First Name is required"
    }
    if (!inputValues.last_name) {
      errors.last_name = "Last Name is required"
    }

    if (!inputValues.phone) {
      errors.phone = "phone is required"
    }

    if (!inputValues.email) {
      errors.email = "email is required"
    }


    if (!inputValues.qualifications) {
      errors.qualifications = "qualifications is required"
    }

    if (!inputValues.voilations) {
      errors.voilations = "voilations is required"
    }

    if (!resume) {
      errors.resume = "CV is required"
    }

    if (!commercial_driving_license) {
      errors.commercial_driving_license = "Lisense is required"
    }

    if (!medical_card) {
      errors.medical_card = "medical_card is required"
    }

    if (!inputValues.cdl_experience) {
      errors.cdl_experience = "cdl_experience is required"
    }

    // if ( !inputValues.resume ) {
    //   errors.resume = "CV File is required"
    // }

    // if ( !inputValues.medical_card ) {
    //   errors.medical_card = "Card is required"
    // }

    // if ( !inputValues.commercial_driving_license ) {
    //   errors.commercial_driving_license = "Liscense is required"
    // }


    setValidation(errors)

    if (Object.keys(errors).length == 0) {
      const drug_test = e.target.drugTest.value
      const driverfly_account = e.target.createAccount.checked ? 1 : 0
      // TODO api call to apply for job
      // console.log(`${process.env.BASE_URL_API}/jobs/apply/${router.query.id}`);
      const reqBody = {
        ...inputValues,
        drug_test,
        driverfly_account
      }
      const formData = new FormData()
      // const formData = serialize(reqBody)
      for (const key in reqBody) {
        formData.set(key, reqBody[key])
      }
      formData.append("resume", resume)
      formData.append("commercial_driving_license", commercial_driving_license)
      formData.append("medical_card", medical_card)

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`)
      }

      const headers = {
        'Authorization': `Bearer ${user.token}`,
        "content-type": "application/json; charset=utf-8"
      };

      await axios.post(`http://localhost:4000/api/jobs/apply/${router.query.id}`,
        formData,
        { headers }
      )
        .then(data => {
          console.log("handle success", data)
          if (data.status == 201) {
            const closeButton = document.getElementsByClassName('close')
            closeButton[0].click()
          }
          alert("Your application has been submitted successfully")

        })
        .catch(function (error) {
          console.log("handle error", error)
        }).then(function () {
          console.log("always executed")
        })
    }

  }

  return (
    <>
      <ToastContainer />
      <div className="modal fade p-0" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title font-weight-normal" id="exampleModalLabel">Apply for this job</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={submitHandler} className="modal-body">
              {/* <div>{inputValues}</div> */}
              <div className="row">
                {/* First Name */}
                <div className="col-lg-6 col-12">
                  <label>*First Name</label>
                  <input disabled={inputDisabled.first_name}
                    onChange={(e) => handleChange(e)}
                    value={inputValues.first_name}
                    name="first_name"
                    type="text"
                    className="form-control"
                    placeholder="First Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.first_name}</p>
                </div>
                {/* Last Name */}
                <div className="col-lg-6 col-12">
                  <label>*Last Name</label>
                  <input disabled={inputDisabled.last_name}
                    onChange={(e) => handleChange(e)}
                    value={inputValues.last_name}
                    name="last_name"
                    type="text"
                    className="form-control"
                    placeholder="Last Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.last_name}</p>
                </div>
                <div className="col-12">
                  <label>*Phone</label>
                  <input disabled={inputDisabled.phone}
                    onChange={(e) => handleChange(e)}
                    value={inputValues.phone}
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="Phone" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.phone}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-3">
                  <label>*Email</label>
                  <input disabled={inputDisabled.email}
                    onChange={(e) => handleChange(e)}
                    value={inputValues.email}
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="E-mail" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-3">
                  <label>* Qualifications</label>
                  <textarea disabled={inputDisabled.qualifications}
                    onChange={(e) => handleChange(e)}
                    value={inputValues.qualifications}
                    name="qualifications"
                    className="form-control"
                    id="validationTextarea"
                    placeholder="Qualifications"></textarea>
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.qualifications}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your CV</label>
                  <input onChange={Upload} name="cv" type="file" className="form-control mt-lg-4 mt-0" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.resume}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your Commercial Driver’s License</label>
                  <input onChange={Upload} name="license" type="file" className="form-control" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.commercial_driving_license}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your Medical card</label>
                  <input onChange={Upload} name="card" type="file" className="form-control mt-lg-4 mt-0" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.medical_card}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Years of CDL Driving Experience</label>
                  <select onChange={(e) => handleChange(e)} value={inputValues.cdl_experience} name="cdl_experience" className="form-select" aria-label="Default select example">
                    <option >Select CDL Driving Experience</option>
                    <option value="1-5 Months" selected={user?.cdl_experience == "1-5 Months" ? "selected" : ''}>
                      1-5 Months
                    </option>
                    <option value="6-11 Months" selected={user?.cdl_experience == "1-5 Months" ? "selected" : ''}>
                      6-11 Months
                    </option>
                    <option value="1 Year" selected={user?.cdl_experience == "1 Year" ? "selected" : ''}>
                      1 Year
                    </option>
                    <option value="2 Years" selected={user?.cdl_experience == "2 Years" ? "selected" : ''}>
                      2 Years
                    </option>
                    <option value="3 Years" selected={user?.cdl_experience == "3 Years" ? "selected" : ''}>
                      3 Years
                    </option>
                    <option value="4 Years" selected={user?.cdl_experience == "4 Years" ? "selected" : ''}>
                      4 Years
                    </option>
                    <option value="5+ Years" selected={user?.cdl_experience == "5+ Years" ? "selected" : ''}>
                      5+ Years
                    </option>
                  </select>
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.cdl_experience}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Number of moving violations in the last 3 years</label>
                  <select onChange={(e) => handleChange(e)} value={inputValues.voilations} name="voilations" className="form-select" aria-label="Default select example">
                    <option selected>Select One</option>
                    <option value="1">0</option>
                    <option value="2">1</option>
                    <option value="3">2</option>
                    <option value="1">3</option>
                    <option value="2">4</option>
                    <option value="3">5</option>
                    <option value="1">6</option>
                    <option value="2">7</option>
                    <option value="3">8</option>
                    <option value="2">9</option>
                    <option value="3">10+</option>
                  </select>
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.voilations}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Can you pass a drug & alcohol test</label>
                  <div className="form-check">
                    <input value='1' class="form-check-input" type="radio" name="drugTest" id="flexRadioDefault1" checked />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input value='0' className="form-check-input" type="radio" name="drugTest" id="flexRadioDefault2" />
                    <label className="form-check-label" for="flexRadioDefault2">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="row my-lg-4">
                <div className="col-12 mt-3">
                  <label>Create a DriverFly account?</label>
                  <div className="form-check ">
                    <input onChange={(e) => handleChange(e)} name="createAccount" className="form-check-input" type="checkbox" value="1" />
                    <label className="form-check-label" htmlfor="inlineCheckbox2">Yes</label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className=" col-12">
                  <p>By clicking the submit button below, I hereby agree to and accept the <br /> <a href="#"> terms and conditions</a></p>
                </div>
              </div>
              {/* </form> */}
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary w-100 p-lg-3 p-5">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
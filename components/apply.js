import { useState } from 'react'

export default function JobApply () {


  const [inputValues, setInputValues] = useState( {
    fullName: "",
    phoneNumber: "",
    email: "",
    qualification: "",
    violationYears: "",
    cvFile: "",
    licenseFile: "",
    cardFile: "",
    experience: "",
  } )

  const handleChange = e => {
    const { name, value } = e.target
    setInputValues( preValue => {
      return {
        ...preValue,
        [name]: value
      }
    } )
  }

  function Upload ( event ) {
    if ( event.target.files && event.target.files[0] ) {
      const t = event.target.name
      const file = event.target.files[0]
      if ( t == "cv" ) {
        setInputValues( preValue => {
          return {
            ...preValue,
            cvFile: URL.createObjectURL( file )
          }
        } )
      }
      if ( t == "card" ) {
        setInputValues( preValue => {
          return {
            ...preValue,
            cardFile: URL.createObjectURL( file )
          }
        } )
      }
      if ( t == "license" ) {
        setInputValues( preValue => {
          return {
            ...preValue,
            licenseFile: URL.createObjectURL( file )
          }
        } )
      }
    }
  }


  const [validation, setValidation] = useState()

  const submitHandler = e => {
    e.preventDefault()
    let errors = {}
    if ( !inputValues.fullName ) {
      errors.fullName = "Name is required"
    }

    if ( !inputValues.phoneNumber ) {
      errors.phoneNumber = "phoneNumber is required"
    }

    if ( !inputValues.email ) {
      errors.email = "email is required"
    }


    if ( !inputValues.qualification ) {
      errors.qualification = "qualification is required"
    }

    if ( !inputValues.violationYears ) {
      errors.violationYears = "violationYears is required"
    }

    if ( !inputValues.cvFile ) {
      errors.cvFile = "CV is required"
    }

    if ( !inputValues.licenseFile ) {
      errors.licenseFile = "Lisense is required"
    }

    if ( !inputValues.cardFile ) {
      errors.cardFile = "cardFile is required"
    }

    if ( !inputValues.experience ) {
      errors.experience = "experience is required"
    }

    if ( !inputValues.experience ) {
      errors.experience = "experience is required"
    }

    if ( !inputValues.cvFile ) {
      errors.cvFile = "CV File is required"
    }

    if ( !inputValues.cardFile ) {
      errors.cardFile = "Card is required"
    }

    if ( !inputValues.licenseFile ) {
      errors.licenseFile = "Liscense is required"
    }


    setValidation( errors )

    if ( Object.keys( errors ).length == 0 ) {
      console.log( "here we go" )
      // TODO api call to apply for job
      const canClearDrugTest = e.target.drugTest.value
      const createAccount = e.target.createAccount.checked
      console.log({
        ...inputValues,
        canClearDrugTest,
        createAccount
      });
    }

  }

  return (
    <>
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
                <div className="col-lg-6 col-12">
                  <label>*Fullname</label>
                  <input onChange={( e ) => handleChange( e )} value={inputValues.fullName} name="fullName" type="text" className="form-control" placeholder="Full Name" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.fullName}</p>
                </div>
                <div className="col-lg-6 col-12">
                  <label>*Phone</label>
                  <input onChange={( e ) => handleChange( e )} value={inputValues.phoneNumber} type="text" name="phoneNumber" className="form-control" placeholder="Phone" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.phoneNumber}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-3">
                  <label>*Email</label>
                  <input onChange={( e ) => handleChange( e )} value={inputValues.email} type="email" name="email" className="form-control" placeholder="E-mail" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.email}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-3">
                  <label>* Qualifications</label>
                  <textarea onChange={( e ) => handleChange( e )} value={inputValues.qualification} name="qualification" className="form-control" id="validationTextarea" placeholder="Qualifications"></textarea>
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.qualification}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your CV</label>
                  <input onChange={Upload} name="cv" type="file" className="form-control mt-lg-4 mt-0" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.cvFile}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your Commercial Driver’s License</label>
                  <input onChange={Upload} name="license" type="file" className="form-control" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.licenseFile}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>Upload your Medical card</label>
                  <input onChange={Upload} name="card" type="file" className="form-control mt-lg-4 mt-0" />
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.cardFile}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Years of CDL driving experience</label>
                  <select onChange={( e ) => handleChange( e )} value={inputValues.experience} name="experience" className="form-select" aria-label="Default select example">
                    <option selected>Select CDL Driving Experience</option>
                    <option value="1">1-5 Months</option>
                    <option value="2">6-11 Months</option>
                    <option value="3">1 Year</option>
                    <option value="1">2 Years</option>
                    <option value="2">3 Years</option>
                    <option value="3">4 Years</option>
                    <option value="1">5+ Years</option>
                  </select>
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.experience}</p>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Number of moving violations in the last 3 years</label>
                  <select onChange={( e ) => handleChange( e )} value={inputValues.violationYears} name="violationYears" className="form-select" aria-label="Default select example">
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
                  <p style={{ fontStyle: "italic", color: "red" }}>{validation?.violationYears}</p>
                </div>
                <div className="col-lg-6 col-12 mt-3">
                  <label>* Can you pass a drug & alcohol test</label>
                  <div class="form-check">
                    <input value='yes' class="form-check-input" type="radio" name="drugTest" id="flexRadioDefault1" checked />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Yes
                    </label>
                  </div>
                  <div class="form-check">
                    <input value='no' class="form-check-input" type="radio" name="drugTest" id="flexRadioDefault2" />
                    <label class="form-check-label" for="flexRadioDefault2">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="row my-lg-4">
                <div className="col-12 mt-3">
                  <label>Create a DriverFly account?</label>
                  <div className="form-check ">
                    <input onChange={( e ) => handleChange( e )} name="createAccount" className="form-check-input" type="checkbox" value="option2" />
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
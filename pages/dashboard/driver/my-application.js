import axios from "axios"
import { useFormik } from "formik"
import * as yup from "yup"
import BaseInput from "../../../components/BaseInput"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useAuth from "../../../hooks/useAuth"
import style from '../../../public/dashboard/styles/css/Driver/my-account.module.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useState } from "react"
import moment from "moment";





export default function MyApplication () {
  const { authCheck } = useAuth()
  const user = authCheck()


  const driverDegree = [
    "HIGH_SCHOOL",
    "ASSOCIATE",
    "BACHELOR",
    "MASTER",
    "DOCTORAL"
  ]

  const cdl_classes = [
    "CDL_CLASS_A",
    "CDL_CLASS_B",
    "CDL_CLASS_C"
  ]

  const acc_form = useFormik( {
    initialValues: {
      // name: '',
      license_number: '',
      age_limit: '',
      // phone: '',
      license_expiry: '',
      highest_degree: '',
      // email: '',
      license_state: '',
      street: '',
      cdl_class: '',
      emergency_contact_number: '',
      city: '',
      years_cdl_experience: '',
      // phoneNumber: '',
      zip_code: '',
      equipment_type: '',
      equipment_experience: '',
      emergency_contact_relationship: '',
    },
    validationSchema: yup.object( {
      // name: yup.string().required( 'Name is required' ),
      license_number: yup.string().required( 'Driver licence is required' ),
      // phone: yup.string().required( 'Phone is required' ),
      license_expiry: yup.string().required( 'Exp date is required' ),
      highest_degree: yup.string().required( 'High degree is required' ),
      // email: yup.string().required( 'Email is required' ).email( "Enter valid email" ),
      license_state: yup.string().required( 'license_state is required' ),
      street: yup.string().required( 'Street is required' ),
      cdl_class: yup.string().required( 'Cdl class is required' ),
      emergency_contact_number: yup.string().required( 'Emergency contact is required' ),
      city: yup.string().required( 'City is required' ),
      years_cdl_experience: yup.string().required( 'Cdl exp is required' ),
      // phoneNumber: yup.string().required( 'Phone number is required' ),
      zip_code: yup.string().required( 'Zip Code is required' ),
      equipment_type: yup.string().required( 'Equipment type is required' ),
      equipment_experience: yup.string(),
      emergency_contact_relationship: yup.string().required( 'emergency_contact_relationship is required' ),
    } ),
    onSubmit: async ( values ) => {
      try {
        const resp = await axios.post( `${process.env.BASE_URL_API}/drivers`, values, {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        } )
        if ( resp.status === 201 ) {
          toast.success( "Uploaded successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          } )
        }
      } catch ( error ) {
        toast.error( "Some Error occured", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } )
      }
    }
  } )


  const [name, setName] = useState( "" )
  const [startDate, setStartDate] = useState( "" )
  const [endDate, setEndDate] = useState( "" )
  const [title, setTitle] = useState( "" )
  const [phone, setPhone] = useState( "" )
  const [can_contact, set_can_contact] = useState( false )
  const [is_subject_to_fmcsrs, set_is_subject_to_fmcsrs] = useState( false )
  const [is_subject_to_drug_tests, set_is_subject_to_drug_tests] = useState( false )

  const [can_pass_drug_test, set_can_pass_drug_test] = useState( false )
  const [has_past_dui, set_has_past_dui] = useState( false )
  const [dui_start_years, set_dui_start_years] = useState( "" )
  const [dui_end_years, set_dui_end_years] = useState( "" )
  const [accident_count, set_accident_count] = useState( 0 )
  const [accident_details, set_accident_details] = useState( "" )
  const [criminal_history, set_criminal_history] = useState( "" )


  const [revoked, setRevoked] = useState(false)
  const [violations, setViolations] = useState(false)
  const [ticketsDetails, set_ticketsDetails] = useState( "" )
  const [drugTestDetails, set_drugTestDetails] = useState( "" )

  useEffect( async () => {
    const { data } = await axios.get( `${process.env.BASE_URL_API}/drivers`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    } )
    if ( !data ) {
      toast.error( "Data could not fetched", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      } )
      return
    }
    console.log( data )
    acc_form.setValues( {
      license_number: data.license_number,
      license_expiry: moment(data.license_expiry).format("YYYY-MM-DD"),
      highest_degree: data.highest_degree,
      license_state: data.license_state,
      street: data.street,
      cdl_class: data.cdl_class,
      emergency_contact_number: data.emergency_contact_number,
      city: data.city,
      years_cdl_experience: data.years_cdl_experience,
      zip_code: data.zip_code,
      equipment_type: data.equipment_type,
      equipment_experience: data.equipment_experience,
      emergency_contact_relationship: data.emergency_contact_relationship,
    } )


    const employer = data.employers[0]
    if ( employer ) {
      setName( employer.name )
      setStartDate( employer.start_at )
      setEndDate( employer.end_at )
      setTitle( employer.title )
      setPhone( employer.phone )
      set_can_contact( employer.can_contact )
      set_is_subject_to_fmcsrs( employer.is_subject_to_fmcsrs )
      set_is_subject_to_drug_tests( employer.is_subject_to_drug_tests )
    }

    set_can_pass_drug_test( data.can_pass_drug_test )
    set_has_past_dui( data.has_past_dui )
    set_dui_start_years( data.dui_years[0] )
    set_dui_end_years( data.dui_years[1] )
    set_accident_count( data.accident_count )
    set_accident_details( data.accident_details )
    set_criminal_history( data.criminal_history )



    const safety_details = data.safety_questions[0]
    if ( safety_details ) {
      set_ticketsDetails( safety_details.details )

    }

  }, [] )



  const postSecondForm = async ( e ) => {
    e.preventDefault()
    const employers = [
      {
        name,
        startDate,
        endDate,
        title,
        phone,
        can_contact,
        is_subject_to_drug_tests,
        is_subject_to_fmcsrs,
      }
    ]

    const safety_questions = [
      {
        type: "LICENSE_REVOKED",
        details: "",
        response: revoked,
      },
      {
        type: "VIOLATIONS_PSP",
        details: "",
        response: violations,
      },
      {
        type: "TICKETS",
        response: false,
        details: ticketsDetails,
      },
      {
        type: "POSITIVE_DRUG_TEST",
        response: false,
        details: drugTestDetails,
      },
    ]
    console.log(safety_questions)
    try {
      const a = {
        employers,
        can_pass_drug_test,
        has_past_dui,
        dui_years: dui_start_years + ", " + dui_end_years,
        accident_count,
        accident_details,
        criminal_history,
        safety_questions
      }
      const resp = await axios.post( `${process.env.BASE_URL_API}/drivers`, a, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      } )
      if ( resp.status === 201 ) {
        toast.success( "Uploaded successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        } )
      }
    } catch ( error ) {
      toast.error( "Error occured", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      } )
    }
  }



  return (
    <>
      <ToastContainer />
      <div className={style.application_container}>

        <div>
          <div className='container-fluid'>
            <form className="modal-body" onSubmit={acc_form.handleSubmit}>
              <h2>Account Settings</h2>
              <div className="row">
                {/* name */}
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="Name:"
                  placeholder="Name"
                  name="name"
                  value={acc_form.values.name}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                  touched={acc_form.touched.name}
                  error={acc_form.errors.name}
                /> */}
                {/* Drivers License */}
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Drivers License Number:"
                  placeholder="Drivers License Number"
                  name="license_number"
                  value={acc_form.values.license_number}
                  touched={acc_form.touched.license_number}
                  error={acc_form.errors.license_number}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                {/* age limit */}
                <div className="col-lg-4 col-12 mt-3">
                  <div class="form-check form-switch mt-5">
                    <label class="form-check-label" for="age_limit">Above 21?</label>
                    <input class="form-check-input" type="checkbox" onChange={acc_form.handleChange} value={acc_form.values.age_limit} role="switch" id="age_limit" />
                  </div>
                </div>
              </div>
              <div className='row'>
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="Phone:"
                  placeholder="Phone"
                  name="phone"
                  value={acc_form.values.phone}
                  touched={acc_form.touched.phone}
                  error={acc_form.errors.phone}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                /> */}
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Expiration Date:"
                  placeholder="Expiration Date"
                  name="license_expiry"
                  type="date"
                  value={acc_form.values.license_expiry}
                  touched={acc_form.touched.license_expiry}
                  error={acc_form.errors.license_expiry}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="Highest Degree:"
                  placeholder="Highest Degree"
                  name="highest_degree"
                  value={acc_form.values.highest_degree}
                  touched={acc_form.touched.highest_degree}
                  error={acc_form.errors.highest_degree}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                /> */}
                <div className="col-lg-4 col-12 mt-3">
                  <span className={style.lable}>Highest Degree:</span>
                  <select class="form-select" name="highest_degree" aria-label="Default select example"
                    selected={acc_form.values.highest_degree}
                  >
                    <option selected>Highest Degree:</option>
                    {driverDegree.map( ( degree, index ) => {
                      return ( <option selected={acc_form.values.highest_degree === degree} value={degree} key={index}>{degree}</option>
                      )
                    } )}
                  </select>
                </div>
              </div>
              <div className='row'>
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="Email:"
                  placeholder="Email"
                  name="email"
                  value={acc_form.values.email}
                  touched={acc_form.touched.email}
                  error={acc_form.errors.email}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                /> */}
                <BaseInput
                  className="col-lg-4 col-12"
                  label="license_state Issued:"
                  placeholder="license_state Issued"
                  name="license_state"
                  value={acc_form.values.license_state}
                  touched={acc_form.touched.license_state}
                  error={acc_form.errors.license_state}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>


              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Street:"
                  placeholder="Street"
                  name="street"
                  value={acc_form.values.street}
                  touched={acc_form.touched.street}
                  error={acc_form.errors.street}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="CDL Class Type:"
                  placeholder="CDL Class Type"
                  name="cdl_class"
                  value={acc_form.values.cdl_class}
                  touched={acc_form.touched.cdl_class}
                  error={acc_form.errors.cdl_class}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                /> */}
                <div className="col-lg-4 col-12 mt-3">
                  <span className={style.lable}>CDL Class Type:</span>
                  <select class="form-select" name="cdl_class" aria-label="Default select example"
                    selected={acc_form.values.cdl_class}
                  >
                    <option selected>CDL Class Type:</option>
                    {cdl_classes.map( ( degree, index ) => {
                      return ( <option selected={acc_form.values.cdl_class === degree} value={degree} key={index}>{degree}</option>
                      )
                    } )}
                  </select>
                </div>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Emergency Contact:"
                  placeholder="Emergency Contact"
                  name="emergency_contact_number"
                  value={acc_form.values.emergency_contact_number}
                  touched={acc_form.touched.emergency_contact_number}
                  error={acc_form.errors.emergency_contact_number}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />

              </div>

              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="City:"
                  placeholder="City"
                  name="city"
                  value={acc_form.values.city}
                  touched={acc_form.touched.city}
                  error={acc_form.errors.city}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Years of CDL Experience:"
                  placeholder="Years of CDL Experience"
                  name="years_cdl_experience"
                  type="number"
                  value={acc_form.values.years_cdl_experience}
                  touched={acc_form.touched.years_cdl_experience}
                  error={acc_form.errors.years_cdl_experience}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                {/* <BaseInput
                  className="col-lg-4 col-12"
                  label="Phone Number:"
                  placeholder="Phone Number"
                  name="phoneNumber"
                  value={acc_form.values.phoneNumber}
                  touched={acc_form.touched.phoneNumber}
                  error={acc_form.errors.phoneNumber}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                /> */}
              </div>
              <div className='row'>
                <BaseInput
                  className="col-lg-4 col-12"
                  label="State and Zip:"
                  placeholder="State and Zip"
                  name="zip_code"
                  value={acc_form.values.zip_code}
                  touched={acc_form.touched.zip_code}
                  error={acc_form.errors.zip_code}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Equipment Type:"
                  placeholder="Equipment Type"
                  name="equipment_type"
                  value={acc_form.values.equipment_type}
                  touched={acc_form.touched.equipment_type}
                  error={acc_form.errors.equipment_type}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <div className="col-lg-2 col-12 mt-3">
                  <span className={style.lable}>Years Experience</span>
                  <select class="form-select" name="equipment_experience" aria-label="Default select example">
                    <option selected>Years Experience</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>

                <BaseInput
                  className="col-lg-4 col-12"
                  label="Relationship:"
                  placeholder="Relationship"
                  name="emergency_contact_relationship"
                  value={acc_form.values.emergency_contact_relationship}
                  touched={acc_form.touched.emergency_contact_relationship}
                  error={acc_form.errors.emergency_contact_relationship}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
              </div>
              <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                <button type="submit" className={`  ${style.update_btn}`} >
                  Update
                </button>
              </div>




            </form>
          </div>
          <hr />

          <div className='container-fluid'>
            <form onSubmit={postSecondForm} className="row">
              <div className="col-lg-4 col-12 mt-3">
                <h2>Past Employment</h2>
                {/* Last employer */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Last Employer:</label>
                  <input onChange={( e ) => setName( e.target.value )} value={name} name="last_emp" type="text" className="form-control" placeholder="Last Employer:" />
                </div>
                {/* Date employed */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Date Employed:</label>
                  <div className="d-flex align-items-center">
                    <input onChange={( e ) => setStartDate( e.target.value )} value={startDate} name="sta_date" type="date" className="form-control" /> <h2 className="mx-2">to</h2>
                    <input onChange={( e ) => setEndDate( e.target.value )} value={endDate} name="sta_date" type="date" className="form-control" />
                  </div>
                </div>
                {/* position title */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Position Title:</label>
                  <input onChange={( e ) => setTitle( e.target.value )} value={title} type="text" name="position_title" className="form-control" placeholder="Position Title:" />
                </div>
                {/* company address */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Company Address:</label>
                  <input type="text" name="company_address" className="form-control" placeholder="Company Address:" />
                </div>
                {/* company phone */}
                <div className="col-lg-11 col-12 mt-3">
                  <label>Company Phone:</label>
                  <input onChange={( e ) => setPhone( e.target.value )} value={phone} type="text" name="phone" className="form-control" placeholder="Company Phone:" />
                </div>
                {/* authorize */}
                <div className="col-lg-11 col-12 mt-3">
                  <div class="form-check form-switch">
                    <label class="form-check-label" for="authorize">Do you authorize prospective employers to contact this company?</label>
                    <input class="form-check-input" type="checkbox" role="switch" id="authorize" checked={can_contact} onClick={( e ) => set_can_contact( e.target.checked )} />
                  </div>
                </div>
                {/* FMCSRs */}
                <div className="col-lg-11 col-12 mt-3">
                  <div class="form-check form-switch">
                    <label class="form-check-label" for="FMCSRs">Were you subject to the FMCSRs?</label>
                    <input checked={is_subject_to_fmcsrs} onClick={( e ) => set_is_subject_to_fmcsrs( e.target.checked )} class="form-check-input" type="checkbox" role="switch" id="FMCSRs" />
                  </div>
                </div>
                {/* is_subject_to_drug_tests */}
                <div className="col-lg-11 col-12 mt-3">
                  <div class="form-check form-switch">
                    <label class="form-check-label" for="is_subject_to_drug_tests">Was your job designated as a safety-sensitive function in any DOT- regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40?</label>
                    <input checked={is_subject_to_drug_tests} onClick={( e ) => set_is_subject_to_drug_tests( e.target.checked )} class="form-check-input" type="checkbox" role="switch" id="is_subject_to_drug_tests" />
                  </div>
                </div>

              </div>

              {/* Safety column */}
              <div className="col-lg-8 col-12 mt-3">
                <h2>Safety Background</h2>
                <div className="row">
                  {/* col-1 */}
                  <div className="col-lg-6 col-12">
                    {/* drug test */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="drug_test">Can I pass a drug test?</label>
                        <input checked={can_pass_drug_test} onClick={( e ) => set_can_pass_drug_test( e.target.checked )} class="form-check-input" type="checkbox" role="switch" id="drug_test" />
                      </div>
                    </div>
                    {/* DUI? */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="DUI">Past DUI’s:</label>
                        <input checked={has_past_dui} onClick={( e ) => set_has_past_dui( e.target.checked )} class="form-check-input" type="checkbox" role="switch" id="DUI" />
                      </div>
                    </div>
                    {/* PUI Date */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Year(s) of Past DUI’s:</label>
                      <div className="d-flex align-items-center">
                        <input type="text" placeholder="Start Year" name="dui_start_years" className="form-control" onChange={( e ) => set_dui_start_years( e.target.value )} value={dui_start_years} />
                        <span className="mx-1"> - </span>
                        <input type="input" placeholder="End Year" name="years_past_dui" className="form-control" onChange={( e ) => set_dui_end_years( e.target.value )} value={dui_end_years} />
                      </div>
                    </div>
                    {/* criminal history */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Criminal History in last 3 years?</label>
                      <input type="text" name="criminal_history" className="form-control" placeholder="Criminal History in last 3 years?" onChange={( e ) => set_criminal_history( e.target.value )} value={criminal_history} />
                    </div>
                    {/* accidents */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label>Accidents within the last 5 years:</label>
                      <input type="number" name="academy_year" className="form-control" placeholder="Accidents within the last 5 years:" onChange={( e ) => set_accident_count( e.target.value )} value={accident_count} />
                    </div>
                    {/* accident details */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Accidents details:</label>
                      <textarea class="form-control mt-4 " name="accident_detail" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => set_accident_details( e.target.value )} value={accident_details}></textarea>
                    </div>
                  </div>
                  {/* col-2 */}
                  <div className="col-lg-6 col-12">
                    {/* license */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="licence">Has any of your license, permit or privilege to operate a CMV ever been suspended or revoked? If so, please explain:</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="licence" checked={revoked} onClick={( e ) => setRevoked( e.target.checked )} />
                      </div>
                    </div>
                    {/* violation */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="violation">Do you have any violation on you PSP from previous three years? If so please explain:</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="violation" checked={violations} onClick={( e ) => setViolations( e.target.checked )}/>
                      </div>
                    </div>
                    {/* 5 years tickets */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Have you had any tickets in the previous 5 years? If so, please explain:</label>
                      <textarea class="form-control" name="any_tickets" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => set_ticketsDetails( e.target.value )} value={ticketsDetails}></textarea>
                    </div>
                    {/* refused */}
                    <div className="col-lg-11 col-12 mt-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Have you ever refused to be tested or had a positive drug/alcohol test? if so, explain here:</label>
                      <textarea class="form-control" name="refused" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => set_drugTestDetails( e.target.value )} value={drugTestDetails}></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-12 mt-4 border-0 text-end">
                <button
                  type="submit" className={`  ${style.update_btn}`} >

                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
};


MyApplication.getLayout = function getLayout ( page ) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

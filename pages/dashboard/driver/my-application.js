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
import { random } from "lodash"
import moment from "moment"





export default function MyApplication () {
  const { authCheck } = useAuth()
  const user = authCheck()

  const randomId = () => Date.now() + "-" + random( 0, 200 )

  const driverDegree = [
    {
      label: "High School",
      value: "HIGH_SCHOOL"
    },
    {
      label: "Bachelor",
      value: "BACHELOR"
    },
    {
      label: "Master",
      value: "MASTER"
    },
    {
      label: "Associate",
      value: "ASSOCIATE"
    },
    {
      label: "Doctoral",
      value: "DOCTORAL"
    }
  ]

  const cdl_classes = [
    {
      label: "CDL Class A",
      value: "CDL_CLASS_A"
    },
    {
      label: "CDL Class B",
      value: "CDL_CLASS_B"
    },
    {
      label: "CDL Class C",
      value: "CDL_CLASS_C"
    }
  ]
  // {
  //   id: Date.now(),
  //   years: 0,
  //   type: ""
  // }
  const [equipments, set_equipments] = useState( [] )

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
      state: '',
      emergency_contact_relationship: '',
    },
    validationSchema: yup.object( {
      // name: yup.string(),
      license_number: yup.string(),
      // phone: yup.string(),
      license_expiry: yup.string(),
      highest_degree: yup.string(),
      // email: yup.string(),
      license_state: yup.string(),
      street: yup.string(),
      cdl_class: yup.string(),
      emergency_contact_number: yup.string(),
      city: yup.string(),
      years_cdl_experience: yup.number(),
      // phoneNumber: yup.string(),
      zip_code: yup.string(),
      state: yup.string(),
      emergency_contact_relationship: yup.string(),
    } ),
    onSubmit: async ( values ) => {
      const data = {
        ...values,
        equipment_experience: equipments.map( eq => ( {
          years: eq.years,
          type: eq.type
        } ) ),
      }
      try {
        const resp = await axios.post( `${process.env.BASE_URL_API}/drivers`, data, {
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

  const [birthDate, set_birthDate] = useState( "" )

  const [pastEmployers, set_pastEmployers] = useState( [] )

  const setCompanyName = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, name: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyStartDate = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, start_at: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyEndDate = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, end_at: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyTitle = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, title: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyPhone = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, phone: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyCanContact = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, can_contact: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyIsSubjectToFmcsrs = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, is_subject_to_fmcsrs: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyIsSubjectToDrugTests = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, is_subject_to_drug_tests: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyStreet = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, street: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyCity = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, city: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyState = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, state: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }
  const setCompanyZipCode = ( id, value ) => {
    const newArr = pastEmployers.map( emp => {
      if ( emp.id === id ) {
        return { ...emp, zip_code: value }
      }
      return emp
    } )
    set_pastEmployers( newArr )
  }

  // const [name, setName] = useState( "" )
  // const [startDate, setStartDate] = useState( "" )
  // const [endDate, setEndDate] = useState( "" )
  // const [title, setTitle] = useState( "" )
  // const [phone, setPhone] = useState( "" )
  // const [can_contact, set_can_contact] = useState( false )
  // const [is_subject_to_fmcsrs, set_is_subject_to_fmcsrs] = useState( false )
  // const [is_subject_to_drug_tests, set_is_subject_to_drug_tests] = useState( false )

  // // company address
  // const [companyStreet, set_companyStreet] = useState( "" )
  // const [companyCity, set_companyCity] = useState( "" )
  // const [companyState, set_companyState] = useState( "" )
  // const [companyZip, set_companyZip] = useState( "" )

  const [can_pass_drug_test, set_can_pass_drug_test] = useState( false )
  const [has_past_dui, set_has_past_dui] = useState( false )
  const [dui_past_year1, set_dui_past_year1] = useState( "" )
  const [dui_past_year2, set_dui_past_year2] = useState( "" )
  const [accident_count, set_accident_count] = useState( 0 )
  const [accident_details, set_accident_details] = useState( "" )
  const [criminal_history, set_criminal_history] = useState( "" )


  const [revoked, setRevoked] = useState( false )
  const [revokedDetails, setRevokedDetails] = useState( "" )

  const [violations, setViolations] = useState( false )
  const [violationsDetails, setViolationsDetails] = useState( "" )

  const [tickets, set_tickets] = useState( false )
  const [ticketsDetails, set_ticketsDetails] = useState( "" )

  const [drugTest, set_drugTest] = useState( false )
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

    const equipmentsFetched = data.equipment_experience.map( eq => ( {
      years: eq.years,
      id: randomId(),
      type: eq.type
    } ) )

    set_birthDate( data.birthdate )
    set_equipments( equipmentsFetched )
    console.log( data )
    acc_form.setValues( {
      license_number: data.license_number,
      license_expiry: moment( data.license_expiry ).format( "YYYY-MM-DD" ),
      highest_degree: data.highest_degree,
      license_state: data.license_state,
      street: data.street,
      cdl_class: data.cdl_class,
      emergency_contact_number: data.emergency_contact_number,
      city: data.city,
      years_cdl_experience: data.years_cdl_experience,
      zip_code: data.zip_code,
      state: data.state,
      equipment_experience: data.equipment_experience,
      emergency_contact_relationship: data.emergency_contact_relationship,
    } )

    let pastEmployersFetched = []
      if ( data.employers.length ) {
      pastEmployersFetched = data.employers.map( emp => ( {
        id: randomId(),
        name: emp.name,
        start_at: moment( emp.start_at ).format( "YYYY-MM-DD" ),
        end_at: moment( emp.end_at ).format( "YYYY-MM-DD" ),
        title: emp.title,
        phone: emp.phone,
        can_contact: emp.can_contact,
        is_subject_to_fmcsrs: emp.is_subject_to_fmcsrs,
        is_subject_to_drug_tests: emp.is_subject_to_drug_tests,
        street: emp.street,
        city: emp.city,
        state: emp.state,
        zip_code: emp.zip_code,
      } ) )
    }else {
      pastEmployersFetched = [{
        id: randomId(),
        name: "",
        start_at: "",
        end_at: "",
        title: "",
        phone: "",
        can_contact: false,
        is_subject_to_fmcsrs: false,
        is_subject_to_drug_tests: false,
        street: "",
        city: "",
        state: "",
        zip_code: "",
      }]
    }

    // set past employers
    set_pastEmployers( pastEmployersFetched )

    set_can_pass_drug_test( data.can_pass_drug_test )
    set_has_past_dui( data.has_past_dui )
    set_dui_past_year1( data.dui_years[0] )
    set_dui_past_year2( data.dui_years[1] )
    set_accident_count( data.accident_count )
    set_accident_details( data.accident_details )
    set_criminal_history( data.criminal_history )


    const revokedFetched = data.safety_questions.find( q => q.type === "LICENSE_REVOKED" )
    if ( revokedFetched ) {
      setRevoked( revokedFetched.response )
      setRevokedDetails( revokedFetched.details )
    }
    const violationsFetched = data.safety_questions.find( q => q.type === "VIOLATIONS_PSP" )
    if ( violationsFetched ) {
      setRevoked( violationsFetched.response )
      setRevokedDetails( violationsFetched.details )
    }
    const tickets = data.safety_questions.find( q => q.type === "TICKETS" )
    if ( tickets ) {
      setRevoked( tickets.response )
      setRevokedDetails( tickets.details )
    }
    const drugsFetched = data.safety_questions.find( q => q.type === "POSITIVE_DRUG_TEST" )
    if ( drugsFetched ) {
      setRevoked( drugsFetched.response )
      setRevokedDetails( drugsFetched.details )
    }



    const safety_details = data.safety_questions[0]
    if ( safety_details ) {
      set_ticketsDetails( safety_details.details )

    }

  }, [] )

  const is21 = () => {
    if ( moment().diff( birthDate, "years" ) >= 21 ) {
      return true
    }
    return false
  }


  const setEquipmentExperience = ( id, value ) => {
    const newArr = equipments.map( eq => {
      if ( eq.id === id ) {
        return { ...eq, years: value }
      }
      return eq
    } )
    set_equipments( newArr )
  }

  const setEquipmentType = ( id, value ) => {
    const newArr = equipments.map( eq => {
      if ( eq.id === id ) {
        return { ...eq, type: value }
      }
      return eq
    } )
    set_equipments( newArr )
  }

  const postSecondForm = async ( e ) => {
    e.preventDefault()
    const employers = pastEmployers.map( emp => {
      return {
        name: emp.name,
        start_at: emp.start_at,
        end_at: emp.end_at,
        title: emp.title,
        phone: emp.phone,
        can_contact: emp.can_contact,
        is_subject_to_fmcsrs: emp.is_subject_to_fmcsrs,
        is_subject_to_drug_tests: emp.is_subject_to_drug_tests,
        street: emp.street,
        city: emp.city,
        state: emp.state,
        zip_code: emp.zip_code,
      }
    } )


    const safety_questions = [
      {
        type: "LICENSE_REVOKED",
        details: revokedDetails,
        response: revoked,
      },
      {
        type: "VIOLATIONS_PSP",
        details: violationsDetails,
        response: violations,
      },
      {
        type: "TICKETS",
        response: tickets,
        details: ticketsDetails,
      },
      {
        type: "POSITIVE_DRUG_TEST",
        response: drugTest,
        details: drugTestDetails,
      },
    ]
    const dui_years = [
      dui_past_year1,
      dui_past_year2,
    ]
    try {
      const a = {
        employers,
        can_pass_drug_test,
        has_past_dui,
        dui_years,
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

  const addEquipment = () => {
    set_equipments( [...equipments, { type: "", years: 0, id: randomId() }] )
  }

  const addPastEmployer = () => {
    set_pastEmployers( [...pastEmployers, {
      id: randomId(),
      name: "",
      start_at: "",
      end_at: "",
      title: "",
      phone: "",
      can_contact: false,
      is_subject_to_fmcsrs: false,
      is_subject_to_drug_tests: false,
      street: "",
      city: "",
      state: "",
      zip_code: "",
    }] )
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
                    <input class="form-check-input" type="checkbox" disabled checked={is21()} role="switch" id="age_limit" />
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
                      return ( <option selected={acc_form.values.highest_degree === degree.value} value={degree.value} key={index}>{degree.label}</option>
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
                    {cdl_classes.map( ( cdl, index ) => {
                      return (
                        <option selected={acc_form.values.cdl_class === cdl.value} value={cdl.value} key={index}>{cdl.label}</option>
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
                  label="State:"
                  placeholder="State"
                  name="state"
                  value={acc_form.values.state}
                  touched={acc_form.touched.state}
                  error={acc_form.errors.state}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />
                <BaseInput
                  className="col-lg-4 col-12"
                  label="Zip:"
                  placeholder="Zip"
                  name="zip_code"
                  value={acc_form.values.zip_code}
                  touched={acc_form.touched.zip_code}
                  error={acc_form.errors.zip_code}
                  onChange={acc_form.handleChange}
                  handleBlur={acc_form.handleBlur}
                />

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
                <div className="col-lg-8 col-12">
                  <span>Equipments</span> <br />
                  {equipments.map( ( eq ) => {
                    return (
                      <div key={eq.id}>
                        <BaseInput
                          className="col-lg-8 col-12"
                          label="Equipment Type:"
                          placeholder="Equipment Type"
                          value={eq.type}
                          onChange={( e ) => setEquipmentType( eq.id, e.target.value )}
                          name="equipment_type"
                        />
                        <BaseInput
                          className="col-lg-8 col-12"
                          label="Years Experience:"
                          type="number"
                          onChange={( e ) => setEquipmentExperience( eq.id, e.target.value )}
                          value={eq.years}
                          placeholder="Years Experience"
                        />
                      </div>
                    )
                  } )}
                  <span className="btn btn-success col-4 mt-2" onClick={addEquipment}>+ more</span>
                </div>

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
                {
                  pastEmployers.map( ( past ) => {
                    return (
                      <div key={past.id}>
                        {/* Last employer */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Last Employer:</label>
                          <input value={past.name} name="last_emp" type="text" className="form-control" placeholder="Last Employer:" onChange={( e ) => setCompanyName( past.id, e.target.value )}/>
                        </div>
                        {/* Date employed */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Date Employed:</label>
                          <div className="d-flex align-items-center">
                            <input onChange={( e ) => setCompanyStartDate(past.id, e.target.value )} value={past.start_at} name="sta_date" type="date" className="form-control" /> <h2 className="mx-2">to</h2>
                            <input onChange={( e ) => setCompanyEndDate( past.id, e.target.value )} value={past.end_at} name="sta_date" type="date" className="form-control" />
                          </div>
                        </div>
                        {/* position title */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Position Title:</label>
                          <input  onChange={( e ) => setCompanyTitle(past.id, e.target.value )} value={past.title} type="text" name="position_title" className="form-control" placeholder="Position Title:" />
                        </div>
                        {/* company address */}
                        <h5 className="my-2">Company Address</h5>
                        {/* company street */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Street:</label>
                          <input type="text" name="companyStreet" className="form-control" placeholder="Company Street:" value={past.street}  onChange={( e ) => setCompanyStreet(past.id, e.target.value )} />
                        </div>
                        {/* company city */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>City:</label>
                          <input type="text" name="companyCity" className="form-control" placeholder="Company City:" value={past.city} onChange={( e ) => setCompanyCity(past.id, e.target.value )} />
                        </div>
                        {/* company state */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>State:</label>
                          <input type="text" name="companyState" className="form-control" placeholder="Company State:" value={past.state}  onChange={( e ) => setCompanyState(past.id, e.target.value )}/>
                        </div>
                        {/* company zip */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Company Zip:</label>
                          <input type="text" name="companyZip" className="form-control" placeholder="Company Zip:" value={past.zip_code} onChange={( e ) => setCompanyZipCode(past.id, e.target.value )}/>
                        </div>
                        {/* company phone */}
                        <div className="col-lg-11 col-12 mt-3">
                          <label>Company Phone:</label>
                          <input value={past.phone} type="text" name="phone" className="form-control" placeholder="Company Phone:"  onChange={( e ) => setCompanyPhone(past.id, e.target.value )}/>
                        </div>
                        {/* authorize */}
                        <div className="col-lg-11 col-12 mt-3">
                          <div class="form-check form-switch">
                            <label class="form-check-label" for="authorize">Do you authorize prospective employers to contact this company?</label>
                            {/* onClick={( e ) => set_can_contact( e.target.checked )} */}
                            <input class="form-check-input" type="checkbox" role="switch" id="authorize" checked={past.can_contact}  onClick={( e ) => setCompanyCanContact(past.id, e.target.checked )}/>
                          </div>
                        </div>
                        {/* FMCSRs */}
                        <div className="col-lg-11 col-12 mt-3">
                          <div class="form-check form-switch">
                            <label class="form-check-label" for="FMCSRs">Were you subject to the FMCSRs?</label>
                            <input checked={past.is_subject_to_fmcsrs} class="form-check-input" type="checkbox" role="switch" id="FMCSRs" onClick={( e ) => setCompanyIsSubjectToFmcsrs(past.id, e.target.checked )}/>
                          </div>
                        </div>
                        {/* is_subject_to_drug_tests */}
                        <div className="col-lg-11 col-12 mt-3">
                          <div class="form-check form-switch">
                            <label class="form-check-label" for="is_subject_to_drug_tests">Was your job designated as a safety-sensitive function in any DOT- regulated mode subject to the drug and alcohol testing requirements of 49 CFR Part 40?</label>
                            <input checked={past.is_subject_to_drug_tests} class="form-check-input" type="checkbox" role="switch" id="is_subject_to_drug_tests" onClick={( e ) => setCompanyIsSubjectToDrugTests(past.id, e.target.checked )}/>
                          </div>
                        </div>

                      </div>
                    )
                  } )
                }
                {
                  pastEmployers.length < 3 &&
                  <div className="col-lg-11 col-12 mt-3">
                    <span className="btn btn-success" onClick={addPastEmployer}>+{3 - pastEmployers.length} more jobs</span>
                  </div>
                    
                }
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
                        <input type="text" placeholder="Year" name="dui_start_years" className="form-control mx-1" onChange={( e ) => set_dui_past_year1( e.target.value )} value={dui_past_year1} />
                        <input type="text" placeholder="Year" name="dui_start_years" className="form-control mx-1" onChange={( e ) => set_dui_past_year2( e.target.value )} value={dui_past_year2} />
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
                    {/* revoked details */}
                    {
                      revoked && (
                        <div className="col-lg-11 col-12 mt-3">
                          <label for="exampleFormControlTextarea1" class="form-label">Details:</label>
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => setRevokedDetails( e.target.value )} value={revokedDetails} />
                        </div>
                      )
                    }
                    {/* violation */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="violation">Do you have any violation on you PSP from previous three years? If so please explain:</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="violation" checked={violations} onClick={( e ) => setViolations( e.target.checked )} />
                      </div>
                    </div>
                    {/* violation details */}
                    {
                      violations && (
                        <div className="col-lg-11 col-12 mt-3">
                          <label for="exampleFormControlTextarea1" class="form-label">Violation Details:</label>
                          <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => setViolationsDetails( e.target.value )} value={violationsDetails} />
                        </div>
                      )
                    }
                    {/* 5 years tickets */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="violation">Have you had any tickets in the previous 5 years?</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="violation" checked={tickets} onClick={( e ) => set_tickets( e.target.checked )} />
                      </div>
                    </div>
                    {/* 5 years tickets details*/}
                    {
                      tickets && (
                        <div className="col-lg-11 col-12 mt-3">
                          <label for="exampleFormControlTextarea1" class="form-label">If so, please explain:</label>
                          <textarea class="form-control" name="any_tickets" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => set_ticketsDetails( e.target.value )} value={ticketsDetails}></textarea>
                        </div>
                      )
                    }

                    {/* drug test */}
                    <div className="col-lg-11 col-12 mt-3">
                      <div class="form-check form-switch">
                        <label class="form-check-label" for="violation">Have you ever refused to be tested or had a positive drug/alcohol test?</label>
                        <input class="form-check-input" type="checkbox" role="switch" id="violation" checked={drugTest} onClick={( e ) => set_drugTest( e.target.checked )} />
                      </div>
                    </div>

                    {/* drug test details */}
                    {
                      drugTest && (
                        <div className="col-lg-11 col-12 mt-3">
                          <label for="exampleFormControlTextarea1" class="form-label">if so, explain here:</label>
                          <textarea class="form-control" name="refused" id="exampleFormControlTextarea1" rows="3" onChange={( e ) => set_drugTestDetails( e.target.value )} value={drugTestDetails}></textarea>
                        </div>
                      )
                    }
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

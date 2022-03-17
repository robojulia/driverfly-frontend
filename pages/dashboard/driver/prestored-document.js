import { Row } from "reactstrap"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useRedirect from '../../../hooks/useRedirect'
import Select from 'react-select'
import axios from "axios"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useStorage from "../../../hooks/useStorage"
import useAuth from "../../../hooks/useAuth"


export default function PrestoresDocuments () {

  const localStorage = useStorage()
  const [myUser, setUser] = useState( null )

  useEffect( async () => {
    // set token
    const user = JSON.parse( localStorage.getItem( 'user' ) )
    setUser( user )
  } ,[])

  const [qualifications, setQualifications] = useState( [] )

  const [resume, setResume] = useState( null )
  const [commercial_driving_license, setCommercial_driving_license] = useState( null )
  const [medical_card, setMedical_card] = useState( null )
  const [validation, setValidation] = useState()

  const qualificationOptions = [
    { value: "high-school-diploma", label: "High School Diploma" },
    { value: "certificate-sub-bachelor", label: "Certificate (Sub-bachelor or vocational)" },
    { value: "diploma-sub-bachelor", label: "Diploma (Sub-bachelor or vocational)" },
    { value: "associate-degree", label: "Associate Degree" },
    { value: "bachelor-degree", label: "Bachelor's Degree" },
    { value: "first-professional-degree", label: "First Professional Degree" },
    { value: "post-bachelor-diploma/certificate", label: "Post-bachelor's Diploma/Certificate" },
    { value: "master-degree", label: "Master's Degree" },
    { value: "certificate-advanced-study", label: "Certificate of Advanced Study" },
    { value: "education-specialist-degree", label: "Education Specialist Degree" },
    { value: "doctorate", label: "Doctorate" }
  ]

  const { setAuth } = useAuth()

  function Upload ( event ) {
    if ( event.target.files && event.target.files[0] ) {
      const t = event.target.name
      const file = event.target.files[0]
      if ( t == "cv" ) {
        setResume( file )
      }
      if ( t == "card" ) {
        setMedical_card( file )
      }
      if ( t == "license" ) {
        setCommercial_driving_license( file )
      }
    }
  }

  const { authDriver } = useRedirect()
  authDriver()


  const submitHandler = async ( e ) => {
    e.preventDefault()
    let errors = []
    if ( qualifications.length < 1 ) {
      errors.qualifications = "Please select at least one qualification"
    }
    if ( !resume ) {
      errors.resume = "Please upload your resume"
    }
    if ( !commercial_driving_license ) {
      errors.commercial_driving_license = "Please upload your commercial driving license"
    }
    if ( !medical_card ) {
      errors.medical_card = "Please upload your medical card"
    }

    setValidation( errors )

    if ( Object.keys( errors ).length == 0 ) {
      const formData = new FormData()
      formData.set( "qualifications", qualifications.map( q => q.value ) )
      formData.append( "resume", resume )
      formData.append( "commercial_driving_license", commercial_driving_license )
      formData.append( "medical_card", medical_card )
      // for ( let [key, value] of formData.entries() ) {
      //   console.dir( `${key}: ${value}` )
      // }
      const resp = await axios.post( `${process.env.BASE_URL_API}/user/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${myUser.token}`
        }
      } )
      const user = {
        ...JSON.parse( localStorage.getItem( 'user' ) ),
        commercial_driving_license: resp.data.commercial_driving_license,
        qualifications: resp.data.qualifications,
        medical_card: resp.data.medical_card,
        resume: resp.data.resume,
        
      }
      setAuth(user)
      toast.success( "Documents uploaded successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      } )

      // setQualifications([])
      // setResume(null)
      // setCommercial_driving_license(null)
      // setMedical_card(null)
      // document.getElementById("myForm").reset();

    }
  }

  // const handleChange = (value) => {

  // }

  return (
    <>
      <ToastContainer />
      <div>
        {/***Top Cards***/}
        <Row>
          <h1>Prestored Document</h1>
        </Row>
        {myUser && <a href={"http://localhost:4000/"+myUser.resume} download> Resume </a>} <br />
        {myUser && <a href={"http://localhost:4000/"+myUser.commercial_driving_license} download> License </a>} <br />
        {myUser && <a href={"http://localhost:4000/"+myUser.medical_card} download> Medical Card </a>} <br />

        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form onSubmit={submitHandler} className="modal-body" id="myForm">
            {/* <div>{inputValues}</div> */}
            <div className="row">
              {/* First Name */}
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <label>* Qualifications</label>
                <Select
                  placeholder="Select your Qualifications..."
                  // onChange={( s ) => setQualifications( s.map( i => i.value ) )}
                  value={qualifications}
                  onChange={( v ) => setQualifications( v )}
                  isMulti options={qualificationOptions} />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.qualifications}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your CV</label>
                <input name="cv" onChange={Upload} type="file" className="form-control  " />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.resume}</p>
              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your Commercial Driver’s License</label>
                <input onChange={Upload} name="license" type="file" className="form-control" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.commercial_driving_license}</p>
              </div>
            </div>
            <div className="row">
              <div className="col col-12 mt-3">
                <label>Upload your Medical card</label>
                <input onChange={Upload} name="card" type="file" className="form-control " />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.medical_card}</p>
              </div>
            </div>
            <div className="modal-footer border-0 mt-5">
              <button type="submit" className="btn btn-primary w-25 m-auto p-lg-3 p-5">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};

PrestoresDocuments.getLayout = function getLayout ( page ) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

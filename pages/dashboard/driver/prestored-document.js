import { Row } from "reactstrap"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useRedirect from '../../../hooks/useRedirect'
import Select from 'react-select'
import axios from "axios"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify'
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"
import "bootstrap/dist/css/bootstrap.min.css"
import 'react-toastify/dist/ReactToastify.css'
import useStorage from "../../../hooks/useStorage"
import useAuth from "../../../hooks/useAuth"
import { Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { Worker } from '@react-pdf-viewer/core'


export default function PrestoresDocuments () {

  const localStorage = useStorage()
  const [myUser, setUser] = useState( null )
  const [showModal, setShowModal] = useState( false )
  const [viewPDF, setViewPDF] = useState( "" )

  useEffect( async () => {
    // set token
    const user = JSON.parse( localStorage.getItem( 'user' ) )
    setUser( user )
  }, [] )

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

  const openModal = (str) => {
    let txt;
    if (str == "resume") {
      txt = "Resume"
    }
    if (str == "card") {
      txt = "Medical Card"
    }
    if (str == "license") {
      txt = "Commercial Driving License"
    }
    setViewPDF(txt)
    setShowModal( true )
  }

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
      setAuth( user )
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

  return (
    <>
      <ToastContainer />
      <div>
        {/***Top Cards***/}
        <Row>
          <h1>Prestored Document</h1>
        </Row>
        {myUser && <Button className="mx-1" variant="info" onClick={() => openModal("resume")}>View Resume</Button>}
        {myUser && <Button variant="info" className="mx-1" onClick={() => openModal("license")}>View License</Button>}
        {myUser && <Button variant="info" className="mx-1" onClick={() => openModal("card")}>View Medical Card</Button>}


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
                <input name="cv" onChange={Upload} type="file" className="form-control file_field  " />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.resume}</p>
              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your Commercial Driver’s License</label>
                <input onChange={Upload} name="license" type="file" className="form-control file_field" />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.commercial_driving_license}</p>
              </div>
            </div>
            <div className="row">
              <div className="col col-12 mt-3">
                <label>Upload your Medical card</label>
                <input onChange={Upload} name="card" type="file" className="form-control file_field " />
                <p style={{ fontStyle: "italic", color: "red" }}>{validation?.medical_card}</p>
              </div>
            </div>
            <div className="border-0 mt-5">
              <button type="submit" className="btn btn-primary  p-lg-3 p-5">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal( false )}>
        <Modal.Header>{viewPDF}</Modal.Header>
        <Modal.Body>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
            <div style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '750px',
            }}>
              {/* <<Viewer fileUrl={"http://localhost:4000/"+myUser.medical_card} /> */}
              <Viewer fileUrl="/resume.pdf" />
            </div>
          </Worker>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal( false )}>Close</Button>
        </Modal.Footer>
      </Modal>
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

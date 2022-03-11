import { Row } from "reactstrap"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useRedirect from '../../../hooks/useRedirect'
import Select from 'react-select'
import { useFormik } from "formik"
import { useState } from "react"


export default function PrestoresDocuments () {
  const [qualifications, setQualifications] = useState( [] )

  const [resume, setResume] = useState( null )
  const [commercial_driving_license, setCommercial_driving_license] = useState( null )
  const [medical_card, setMedical_card] = useState( null )
  const [validation, setValidation] = useState()

  const qualificationOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

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


  const submitHandler = ( e ) => {
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
      formData.set("qualifications", qualifications)
      formData.append( "resume", resume )
      formData.append( "commercial_driving_license", commercial_driving_license )
      formData.append( "medical_card", medical_card )
      for ( let [key, value] of formData.entries() ) {
        console.dir( `${key}: ${value}` )
      }
      // TODO make api call here
    }
  }
  

  return (
    <>
      <div>
        {/***Top Cards***/}
        <Row>
          <h1>Prestored Document</h1>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form onSubmit={submitHandler} className="modal-body">
            {/* <div>{inputValues}</div> */}
            <div className="row">
              {/* First Name */}
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <label>* Qualifications</label>
                <Select
                  placeholder="Select your Qualifications..."
                  onChange={( s ) => setQualifications( s.map( i => i.value ) )}
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

import { useFormik } from "formik"
import { Row } from "reactstrap"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import * as yup from "yup"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from "../../../hooks/useAuth"
import useStorage from "../../../hooks/useStorage"



export default function DriverIntakeInfo () {

  const localStorage = useStorage()

  const experienceValues = [
    {
      value: "1-5-months",
      label: "1-5 Months"
    },
    {
      value: "6-11-months",
      label: "6-11 Months"
    },
    {
      value: "1-year",
      label: "1 Year"
    },
    {
      value: "2-year",
      label: "2 Years"
    },
    {
      value: "3-year",
      label: "3 Years"
    },
    {
      value: "4-year",
      label: "4 Years"
    },
    {
      value: "plus-5-year",
      label: "+5 Years"
    },
  ]

  const formik = useFormik( {
    initialValues: {
      // first_name: "",
      // last_name: "",
      // phone: "",
      // email: "",
      cdl_experience: "",
      voilations: "",
      drugTest: 0,
    },
    validationSchema: yup.object( {
      // first_name: yup.string().required( "Required" ),
      // last_name: yup.string().required( "Required" ),
      // email: yup.string().email( "Invalid email address" ).required( "Required" ),
      // phone: yup.string().required( "Required" ),
      cdl_experience: yup.string().required( "Required" ),
      voilations: yup.string().required( "Required" ),
      drugTest: yup.number().optional()
    } ),
    onSubmit: async ( values ) => {
      const token = JSON.parse(localStorage.getItem('user')).token
      const id = JSON.parse(localStorage.getItem('user')).id
      await axios.put( `${process.env.BASE_URL_API}/user/${id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      } )
      window.document.getElementById("my-form").reset()
      toast.success( "Driver Intake Information Updated Successfully", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      } )
    }
  } )

  return (
    <>
      <ToastContainer />

      <div>
        <Row>
          <h1>Information</h1>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form onSubmit={formik.handleSubmit} className="modal-body" id="my-form">
            {/* <div className="row">
              <div className="col-lg-6 col-12">
                <label>*First Name</label>
                <input
                  name="first_name" type="text" className="form-control" placeholder="First Name"
                  onChange={formik.handleChange}
                  value={formik.values.first_name}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.first_name && formik.errors.first_name ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.first_name}</p> : null}

              </div>
              <div className="col-lg-6 col-12">
                <label>*Last Name</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.last_name}
                  onBlur={formik.handleBlur}
                  name="last_name" type="text" className="form-control" placeholder="Last Name" />
                {formik.touched.last_name && formik.errors.last_name ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.last_name}</p> : null}

              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <label>*Email</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onBlur={formik.handleBlur}
                  type="email" name="email" className="form-control" placeholder="E-mail" />
                {formik.touched.email && formik.errors.email ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.email}</p> : null}
              </div>
              <div className="col-6">
                <label>*Phone</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  onBlur={formik.handleBlur}
                  type="text" name="phone" className="form-control" placeholder="Phone" />
                {formik.touched.phone && formik.errors.phone ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.phone}</p> : null}
              </div>
            </div>
            <div className="row">
              <div className="col-12 mt-3">
                <label>* Qualifications</label>
                <textarea name="qualifications" className="form-control" id="validationTextarea" placeholder="Qualifications"></textarea>

              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your CV</label>
                <input name="cv" type="file" className="form-control  " />

              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>Upload your Commercial Driver’s License</label>
                <input name="license" type="file" className="form-control" />

              </div>
            </div>
            <div className="row">
            <div className="col-lg-6 col-12 mt-3">
            <label>Upload your Medical card</label>
            <input name="card" type="file" className="form-control " />
            </div>
             */}
            <div className="row">
              <div className="col-lg-6 col-12 mt-3">
                <label>* Years of CDL driving cdl_experience</label>
                <select
                  onChange={formik.handleChange}
                  value={formik.values.cdl_experience}
                  onBlur={formik.handleBlur}
                  name="cdl_experience" className="form-select" aria-label="Default select example">
                  <option selected>Select CDL Driving cdl_experience</option>
                  {experienceValues.map( ( item, index ) => ( <option key={index} value={item.value}>{item.label}</option> ) )}
                </select>
                {formik.touched.cdl_experience && formik.errors.cdl_experience ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.cdl_experience}</p> : null}
              </div>
              <div className="col-lg-6 col-12 mt-3">
                <label>* Number of moving violations in the last 3 years</label>
                <select
                  onChange={formik.handleChange}
                  value={formik.values.voilations}
                  onBlur={formik.handleBlur}
                  name="voilations" className="form-select" aria-label="Default select example">
                  <option selected>Select One</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>d-flex align-items-center
                </select>
                {formik.touched.voilations && formik.errors.voilations ? <p style={{ fontStyle: "italic", color: "red", fontSize: '13px' }}>{formik.errors.voilations}</p> : null}

              </div>
              <div className="col-lg-6 col-12 mt-3" onChange={formik.handleChange}
                value={formik.values.drugTest}
                onBlur={formik.handleBlur} >
                <label>* Can you pass a drug & alcohol test</label>
                <div className="form-check">
                  <input value='1' className="form-check-input" type="radio" name="drugTest" id="flexRadioDefault1" checked={formik.values.drugTest == 1} />
                  <label className="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input value='0' className="form-check-input" type="radio" name="drugTest" id="flexRadioDefault2" checked={formik.values.drugTest == 0} />
                  <label className="form-check-label" for="flexRadioDefault2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className=" border-0 mt-5">
              <button type="submit" className="btn btn-primary p-lg-3 p-5">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
};

DriverIntakeInfo.getLayout = function getLayout ( page ) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

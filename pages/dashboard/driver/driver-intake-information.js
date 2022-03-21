import { useFormik } from "formik"
import { Row } from "reactstrap"
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import * as yup from "yup"
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useAuth from "../../../hooks/useAuth"
import useStorage from "../../../hooks/useStorage"
import useRedirect from '../../../hooks/useRedirect';



export default function DriverIntakeInfo() {

  const { authDriver } = useRedirect();
  authDriver()

  const { authCheck, setAuth } = useAuth()
  const user = authCheck()
  console.log('user', user)

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      cdl_experience: user.cdl_experience ?? "",
      voilations: user.voilations ?? "",
      drug_test: parseInt(user.drug_test) ?? 0,
    },
    validationSchema: yup.object({
      cdl_experience: yup.string().required("Required"),
      voilations: yup.string().required("Required"),
      drug_test: yup.bool()
    }),
    onSubmit: async (values) => {
      values.drug_test = parseInt(values.drug_test)
      await axios.put(`${process.env.BASE_URL_API}/user/${user.id}`, values, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(data => {
          console.log("handle success", data.data)
          user.cdl_experience = data.data.user.cdl_experience
          user.voilations = data.data.user.voilations
          user.drug_test = data.data.user.drug_test
          setAuth(user)
          toast.success("Driver Intake Information Updated Successfully ", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.document.getElementById("my-form").reset()
          }, 5000);
        })
        .catch(function (error) {
          console.log("handle error success", error)
          toast.error("Something Went South!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }).then(function () {
          console.log("always executed")
        })
    }
  })

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
            {/* 
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
                <label>* Years of CDL Driving Experience</label>
                <select
                  onChange={formik.handleChange}
                  value={formik.values.cdl_experience}
                  onBlur={formik.handleBlur}
                  name="cdl_experience" className="form-select" aria-label="Default select example">
                  <option >Select CDL Driving Experience</option>
                  {experienceValues.map((item, index) => (<option key={index} value={item.value}>{item.label}</option>))}
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
                  <option >Select One</option>
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
                value={formik.values.drug_test}
                onBlur={formik.handleBlur} >
                <label>* Can you pass a drug & alcohol test</label>
                <div className="form-check">
                  <input value='1' className="form-check-input" type="radio" name="drug_test" id="flexRadioDefault1" checked={formik.values.drug_test == 1} />
                  <label className="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div className="form-check">
                  <input value='0' className="form-check-input" type="radio" name="drug_test" id="flexRadioDefault2" checked={formik.values.drug_test == 0} />
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

DriverIntakeInfo.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

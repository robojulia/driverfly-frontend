import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import axios from "axios"
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Spinner from 'react-bootstrap/Spinner'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useAuth from "../../../hooks/useAuth"


export default function PrestoresDocuments() {

  const { authCheck } = useAuth()
  const user = authCheck()

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const [showModal, setShowModal] = useState(false)
  const [pdfModalTxt, set_pdfModalTxt] = useState("")
  const [pdfModalURL, set_pdfModalURL] = useState("")

  const [isUploading, set_isUploading] = useState(false)


  const [resume, setResume] = useState(null)
  const [canViewResume, setCanViewResume] = useState(false)
  const [license, set_license] = useState(null)
  const [canViewLicense, setCanViewLicense] = useState(false)
  const [medical_card, set_medical_card] = useState(null)
  const [canViewMedicalCard, setCanViewMedicalCard] = useState(false)
  const [mvr, set_mvr] = useState(null)
  const [canViewMvr, setCanViewMvr] = useState(false)

  function upload(event, type) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      if (type === 'DRIVER_LICENSE') {
        set_license(file)
      }
      if (type === 'MEDICAL_CARD') {
        set_medical_card(file)
      }
      if (type === 'RESUME') {
        setResume(file)
      }
      if (type === 'MVR') {
        set_mvr(file)
      }
    }
  }

  const [fetchedData, set_fetchedData] = useState([])

  useEffect(async () => {
    const { data } = await axios.get(`${process.env.BASE_URL_API}/user/uploaded/documents`, {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
    set_fetchedData(data)

    const file_RESUME = data.find((item) => item.type === "RESUME")
    if (file_RESUME) {
      setCanViewResume(true)
    }

    const file_MEDICAL_CARD = data.find((item) => item.type === "MEDICAL_CARD")
    if (file_MEDICAL_CARD) {
      setCanViewMedicalCard(true)
    }

    const file_DRIVER_LICENSE = data.find((item) => item.type === "DRIVER_LICENSE")
    if (file_DRIVER_LICENSE) {
      setCanViewLicense(true)
    }

    const file_MVR = data.find((item) => item.type === "MVR")
    if (file_MVR) {
      setCanViewMvr(true)
    }



  }, [])


  const viewFile = (str) => {
    let txt
    let url
    if (str == "RESUME") {
      const file = fetchedData.find((item) => item.type === "RESUME")
      url = file ? file.path : ""
      txt = "Resume"
    }
    if (str == "MEDICAL_CARD") {
      const file = fetchedData.find((item) => item.type === "MEDICAL_CARD")
      url = file ? file.path : ""
      txt = "Medical Card"
    }
    if (str == "DRIVER_LICENSE") {
      const file = fetchedData.find((item) => item.type === "DRIVER_LICENSE")
      url = file ? file.path : ""
      txt = "Driver's License"
    }
    if (str == "MVR") {
      const file = fetchedData.find((item) => item.type === "MVR")
      url = file ? file.path : ""
      txt = "Motor Vehicle Record"
    }
    set_pdfModalTxt(txt)
    set_pdfModalURL(url)
    setShowModal(true)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (resume) {
      formData.append('resume', resume)
    }
    if (license) {
      formData.append('commercial_driving_license', license)
    }
    if (medical_card) {
      formData.append('medical_card', medical_card)
    }
    if (mvr) {
      formData.append('mvr_record', mvr)
    }
    // make sure user can not make api call with empty form data
    if (resume || license || medical_card || mvr) {
      try {
        set_isUploading(true)
        const resp = await axios.post(`${process.env.BASE_URL_API}/user/documents`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          }
        })
        if (resp.status === 201) {
          toast.success("Documents uploaded successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          })
        }
      } catch (error) {
        toast.error("Something Went Wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
      setTimeout(() => {
        set_isUploading(false)
      }, 3000)
    } else {
      toast.error("Select atleast one file to upload", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }

  return (
    <>
      <ToastContainer />
      <div>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form onSubmit={submitHandler} className="modal-body" id="myForm">
            <div className="row my_docs_section ">
              <div className="row">
                <h2 className="col-lg-8 col-12">My Documents</h2>
              </div>
              {/* Driver's License */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>Driver's License</h3>
                {
                  canViewLicense &&
                  <Button className="applied" onClick={() => viewFile("DRIVER_LICENSE")}>View</Button>
                }
                <input type="file" class="custom-file-input" onChange={(event) => upload(event, "DRIVER_LICENSE")} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              {/* Medical Card */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>Medical Card</h3>
                {
                  canViewMedicalCard &&
                  <Button className="applied" onClick={() => viewFile("MEDICAL_CARD")}>View</Button>
                }
                <input type="file" class="custom-file-input" onChange={(event) => upload(event, "MEDICAL_CARD")} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>
            </div>

            <div className="row mt-5 my_docs_section ">
              {/* Resume */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>Resume</h3>
                {
                  canViewResume &&
                  <Button className="applied" onClick={() => viewFile("RESUME")}>View</Button>
                }
                <input type="file" class="custom-file-input" onChange={(event) => upload(event, "RESUME")} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              {/* MVR */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>Motor Vehicle Record (MVR)</h3>
                {
                  canViewMvr &&
                  <Button className="applied" onClick={() => viewFile("MVR")}>View</Button>
                }
                <input type="file" class="custom-file-input" onChange={(event) => upload(event, "MVR")} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              <div className='col-md-12 mt-5'>
                <button type="submit" disabled={isUploading} className="btn btn-success col-lg-4 col-12">
                  {isUploading ?
                    (<div class="spinner-border" role="status" />)
                    : (<span>Save</span>)
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header>{pdfModalTxt}</Modal.Header>

        <Modal.Body>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
            <div style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '800px',

            }}>
              {/* <<Viewer fileUrl={"http://localhost:4000/"+myUser.medical_card} />np */}
              <Viewer defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} renderLoader={() => (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )} fileUrl={pdfModalURL} />
              {/* )} fileUrl="/resume.pdf" /> */}
            </div>
          </Worker>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>

      </Modal>
    </>
  )
};

PrestoresDocuments.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Spinner from 'react-bootstrap/Spinner'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FullLayout from "../../../components/dashboard/layouts/FullLayout"
import useAuth from "../../../hooks/useAuth"
import useRedirect from '../../../hooks/useRedirect';
import { useTranslation } from 'react-i18next'
import { useFormik } from "formik"
import UserApi from "../../api/user";

export default function PrestoresDocuments() {
  const { authDriver } = useRedirect();
  authDriver();

  const { t } = useTranslation();

  const { authCheck } = useAuth()
  const user = authCheck()

  const defaultLayoutPluginInstance = defaultLayoutPlugin()

  const api = new UserApi();

  const form = useFormik({
    initialValues: {
      DRIVER_LICENSE: {
        id: null,
        documentable_id: null,
        documentable_type: null,
        type: "DRIVER_LICENSE",
        name: null,
        path: null,
        description: null,
        file: null,
      },
      MEDICAL_CARD: {
        id: null,
        documentable_id: null,
        documentable_type: null,
        type: "MEDICAL_CARD",
        name: null,
        path: null,
        description: null,
        file: null,
      },
      RESUME: {
        id: null,
        documentable_id: null,
        documentable_type: null,
        type: "RESUME",
        name: null,
        path: null,
        description: null,
        file: null,
      },
      MVR: {
        id: null,
        documentable_id: null,
        documentable_type: null,
        type: "MVR",
        name: null,
        path: null,
        description: null,
        file: null,
      }
    },
    onSubmit: async (values) => {

      const actions = [];
      const formData = new FormData()
      let hasFormData = false;

      Object.values(values).forEach(v => {
        // delete action
        if (v.id && !v.path) {
          actions.push(
            api
              .deleteDocument(v.type)
            );
          v.id = null;
        }
        // upsert action
        else if (v.file) {
          switch (v.type) {
            case "DRIVER_LICENSE":
              formData.append('commercial_driving_license', v.file);
              break;
            case "MEDICAL_CARD":
              formData.append('medical_card', v.file);
              break;
            case "RESUME":
              formData.append('resume', v.file);
              break;
            case "MVR":
              formData.append('mvr_record', v.file);
              break;
          }

          hasFormData = true;
        }
      });

      if (hasFormData) {
        actions.push(
          api
            .postDocuments(formData)
            .then(v => {
              const newData = transformDocumentData(v);
              values = {
                ...values,
                ...newData
              };
            })
        );
      }

      if (actions.length > 0) {
        try {
          await Promise.all(actions);

          form.setValues({
            ...form.values,
            ...values
          });

          toast.success(t("successfully_saved_information"));
        }
        catch (e) {
          console.error("Unable to save information", e);
          toast.error(t("unable_to_save_information"));
        }
      }
    }
  });

  const transformDocumentData = (data) => {
    const formData = {};
    data.forEach(v => {
      if (v.type in form.values) {
        formData[v.type] = {
          ...v,
          file: null,
        };
      }
      else {
        console.warn(`Unknown document type detected: ${v.type}`);
      }
    });

    return formData;
  }

  useEffect(async () => {
    const data = await api.getDocuments();

    const formData = transformDocumentData(data);

    form.setValues({
      ...form.values,
      ...formData
    });
  }, []);

  const [ pdfModel, set_pdfModel ] = useState({
    name: null,
    url: null,
  });

  const uploadHandler = (e) => {
    const { target: { name, files } } = e;

    if (files && files[0]) {
      const file = files[0];

      form.setValues({
        ...form.values,
        [name]: {
          ...form.values[name],
          name: file.name,
          path: URL.createObjectURL(file),
          file: file,
        }
      });
    }

  }

  const viewHandler = (e) => {
    const { target: { name } } = e;

    const file = form.values[name];

    set_pdfModel({
      name: file.name,
      url: file.path
    });
  }

  const hideModelHandler = (e) => {
    set_pdfModel({
      name: null, url: null
    });
  }

  const deleteHandler = (e) => {
    const { target: { name } } = e;

    form.setValues(
      {
        ...form.values,
        [name]: {
          ...form.values[name],
          name: null,
          path: null,
          description: null,
          file: null,
        }
      }
    );

  }

  return (
    <>
      <ToastContainer />
      <div>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form onSubmit={form.handleSubmit} className="modal-body" id="myForm">
            <div className="row my_docs_section ">
              <div className="row">
                <h2 className="col-lg-8 col-12">{t("my_docs")}</h2>
              </div>
              {/* Driver's License */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>{t("drivers_license")}</h3>
                {
                  !!form.values.DRIVER_LICENSE.path &&
                  <>
                    <Button name="DRIVER_LICENSE" disabled={form.isSubmitting} className="applied" onClick={e => viewHandler(e)}>{t("view")}</Button>
                    <Button name="DRIVER_LICENSE" disabled={form.isSubmitting} className="btn_danger" onClick={e => deleteHandler(e)}>{t("delete")}</Button>
                  </>
                }
                <input
                  disabled={form.isSubmitting}
                  type="file"
                  accept="application/pdf"
                  class="custom-file-input"
                  name="DRIVER_LICENSE"
                  onChange={e => uploadHandler(e)} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              {/* Medical Card */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>{t("medical_card")}</h3>
                {
                  !!form.values.MEDICAL_CARD.path &&
                  <>
                    <Button name="MEDICAL_CARD" disabled={form.isSubmitting} className="applied" onClick={e => viewHandler(e)}>{t("view")}</Button>
                    <Button name="MEDICAL_CARD" disabled={form.isSubmitting} className="btn_danger" onClick={e => deleteHandler(e)}>{t("delete")}</Button>
                  </>
                }
                <input
                  disabled={form.isSubmitting}
                  name="MEDICAL_CARD"
                  type="file"
                  accept="application/pdf"
                  class="custom-file-input"
                  onChange={e => uploadHandler(e)} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>
            </div>

            <div className="row mt-5 my_docs_section ">
              {/* Resume */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>{t("resume")}</h3>
                {
                  !!form.values.RESUME.path &&
                  <>
                    <Button name="RESUME" disabled={form.isSubmitting} className="applied" onClick={e => viewHandler(e)}>{t("view")}</Button>
                    <Button name="RESUME" disabled={form.isSubmitting} className="btn_danger" onClick={e => deleteHandler(e)}>{t("delete")}</Button>
                  </>
                }
                <input
                  disabled={form.isSubmitting}
                  name="RESUME"
                  type="file"
                  accept="application/pdf"
                  class="custom-file-input"
                  onChange={e => uploadHandler(e)} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              {/* MVR */}
              <div className="col-lg-6 col-12 mt-5">
                <h3>{t("motor_vehicle_record")}</h3>
                {
                  !!form.values.MVR.path &&
                  <>
                    <Button disabled={form.isSubmitting} name="MVR" className="applied" onClick={e => viewHandler(e)}>{t("view")}</Button>
                    <Button disabled={form.isSubmitting} name="MVR" className="btn_danger" onClick={e => deleteHandler(e)}>{t("delete")}</Button>
                  </>
                }
                <input
                  disabled={form.isSubmitting}
                  name="MVR"
                  type="file"
                  accept="application/pdf"
                  class="custom-file-input"
                  onChange={e => uploadHandler(e)} />
                {/* <Link href="#">
                  <Button className="approved"> View Past Records</Button>
                </Link> */}
              </div>

              <div className='col-md-12 mt-5'>
                <button type="submit" disabled={form.isSubmitting} className="btn btn-success col-lg-4 col-12">
                  {form.isSubmitting ?
                    (<div class="spinner-border" role="status" />)
                    : (<span>{t("save")}</span>)
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>


      <Modal show={!!pdfModel.name} onHide={() => hideModelHandler()}>
        <Modal.Header>{pdfModel.name}</Modal.Header>

        <Modal.Body>
          {(
            pdfModel.name &&
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.13.216/build/pdf.worker.min.js">
            <div style={{
              border: '1px solid rgba(0, 0, 0, 0.3)',
              height: '800px',
            }}>
              {/* <<Viewer fileUrl={"http://localhost:4000/"+myUser.medical_card} />np */}
              <Viewer defaultScale={SpecialZoomLevel.PageWidth} plugins={[defaultLayoutPluginInstance]} renderLoader={() => (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">{t("loading")}...</span>
                </Spinner>
              )} fileUrl={pdfModel.url} />
              {/* )} fileUrl="/resume.pdf" /> */}
            </div>
          </Worker>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => hideModelHandler()}>{t("close")}</Button>
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

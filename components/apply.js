import { useEffect, useState } from 'react'
import { useRouter } from "next/router"
import axios from "axios"
import useAuth from '../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify'
import { useFormik } from "formik"
import * as yup from "yup"
import { Trans, useTranslation } from "../hooks/useTranslation"
import BaseApi from '../pages/api/_baseApi'
import JobApi from '../pages/api/job'
import UserApi from '../pages/api/user'
import BaseInput from './forms/BaseInput'
import BaseTextArea from './forms/BaseTextArea'
import BaseSelect from './forms/BaseSelect'
import { preventNegative } from "../utils/input"
import BaseCheck from './forms/BaseCheck'
import Link from 'next/link'
import { Col, Row } from 'react-bootstrap'
import { DriverDegree } from '../enums/drivers/driver-degree.enum'
import { getBase64 } from '../utils/file'
import { JobApplicantDocumentType } from '../enums/application/job-application-document-type.enum'
// import { SpecialZoomLevel, Viewer, Worker } from '@react-pdf-viewer/core'
// import '@react-pdf-viewer/core/lib/styles/index.css'
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
// import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import Spinner from 'react-bootstrap/Spinner'
import ViewFileButton from './buttons/ViewFileButton'

export default function JobApply({ job }) {

  const { authCheck } = useAuth();
  const user = authCheck()
  // console.log("user", user);
  const router = useRouter()
  const { t } = useTranslation();
  const jobApi = new JobApi();
  const baseApi = new BaseApi();
  const userApi = new UserApi();

  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const [pdfModel, set_pdfModel] = useState({
    name: null,
    url: null,
  })

  const apply_form = useFormik({
    initialValues: {
      userId: user.id ?? null,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      contact_number: user.contact_number ?? "",
      email: user.email ?? "",
      highest_degree: "",
      voilations: 0,
      cdl_experience: 0,
      drug_test: false,

      /* //To Do - Either will be able to create new account or not
      createAccount: false,
      password: null,
      confirmPassword: null,
      */

      [JobApplicantDocumentType.DRIVER_LICENSE]: null,
      [JobApplicantDocumentType.MEDICAL_CARD]: null,
      [JobApplicantDocumentType.RESUME]: null,
      [JobApplicantDocumentType.MVR]: null,
      [JobApplicantDocumentType.DRIVER_LICENSE + "_old"]: null,
      [JobApplicantDocumentType.MEDICAL_CARD + "_old"]: null,
      [JobApplicantDocumentType.RESUME + "_old"]: null,
      [JobApplicantDocumentType.MVR + "_old"]: null,
    },
    validationSchema: yup.object({
      first_name: yup.string().required(t("{name}_field_is_required", { name: t('first_name') })).nullable(),
      last_name: yup.string().required(t("{name}_field_is_required", { name: t('last_name') })).nullable(),
      contact_number: yup.string().required(t("{name}_field_is_required", { name: t('contact_number') })).nullable(),
      email: yup.string().required(t("{name}_field_is_required", { name: t('email') })).nullable(),
      highest_degree: yup.string().required(t("{name}_field_is_required", { name: t('highest_degree') })).nullable(),
      voilations: yup.number().min(0).nullable(),
      cdl_experience: yup.number().min(0).nullable(),

      /* //To Do - Either will be able to create new account or not
      password: yup.string().when("createAccount", {
        is: true,
        then: yup.string().required(t("{name}_field_is_required", { name: t('cdl_experience') })).nullable()
      }).nullable(),
      confirmPassword: yup.string().when("createAccount", {
        is: true,
        then: yup.string().test({
          test: (value, context) => {
            const password = context.resolve(yup.ref("password"));
            if (value === password) return true;

            return context.createError({
              path: context.path,
              message: t("PASSWORDS_DO_NOT_MATCH")
            });
          }
        }).nullable(),
      }).nullable(),
      */

      [JobApplicantDocumentType.DRIVER_LICENSE]: yup.object({}).nullable(),
      [JobApplicantDocumentType.MEDICAL_CARD]: yup.object({}).nullable(),
      [JobApplicantDocumentType.RESUME]: yup.object({}).nullable(),
      [JobApplicantDocumentType.MVR]: yup.object({}).nullable(),

    }),
    onSubmit: async (values) => {
      console.log("apply_form.values", values)
      const documents = Object.values(JobApplicantDocumentType).map(t => {
        if (values[t]?.file_base64) {
          return ({
            type: t,
            name: values[t].name,
            mime_type: values[t].mime_type,
            file_base64: values[t].file_base64
          })
        }
      }).filter(v => v)

      const userDto = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: user.email || values.email,
        phone: values.contact_number,
        highest_degree: values.highest_degree,
        accident_count: parseInt(values.voilations),
        years_cdl_experience: parseInt(values.cdl_experience),
        can_pass_drug_test: values.drug_test,

        documents: documents,
      }

      await jobApi.applyForJob(job.id, userDto)
        .then(data => {
          if (data.status == 201) {
            closeModal()
            toast.success(t('job_applied_success_message'))
          }
        })
        .catch(function (error) {
          closeModal()
          // console.log("error?.response", error?.response);
          if (error?.response?.data?.job == "INVALID_JOB_SPECIFIED") {
            toast.error(t('INVALID_JOB_SPECIFIED'))
          } else if (error?.response?.data?.email == "ALREADY_EXISTS") {
            toast.error(t('USER_ALREADY_EXISTS'))
          } else if (error?.response?.data?.email == "USER_INVALID") {
            toast.error(t('USER_INACTIVE'))
          } else if (error?.response?.data?.job == "ALREADY_EXISTS") {
            toast.error(t('ALREADY_APPLIED'))
          } else if (error?.response?.data?.resume == "UNRECOGNIZED_DOCUMENT_TYPE" ||
            error?.response?.data?.drivers_license == "UNRECOGNIZED_DOCUMENT_TYPE" ||
            error?.response?.data?.medical_card == "UNRECOGNIZED_DOCUMENT_TYPE" ||
            error?.response?.data?.mvr == "UNRECOGNIZED_DOCUMENT_TYPE") {
            toast.error(t('UNRECOGNIZED_DOCUMENT_TYPE'))
          } else {
            toast.error(t('ERROR_MESSAGE_DEFAULT'))
          }
        })
    }
  });

  const closeModal = () => { document.getElementsByClassName('close')[0].click() }

  const handleFileChange = async (e) => {
    const { target: { name, files } } = e
    if (files && files[0]) {
      const file = files[0]
      Promise
        .resolve(getBase64(file))
        .then(file_base64 => ({
          name: file.name,
          mime_type: file.type,
          path: URL.createObjectURL(file),
          file_base64: file_base64
        })).then((pdfFile) => {
          apply_form.setFieldValue(name, pdfFile)
        })
    }
  }

  const updateDriverData = async () => {
    await baseApi.get(`drivers`)
      .then(async ({ data: driver }) => {
        if (driver) {
          apply_form.setValues({
            ...apply_form.values,
            cdl_experience: driver.years_cdl_experience || 0,
            highest_degree: driver.highest_degree || "",
            drug_test: driver.can_pass_drug_test || false,
            voilations: driver.accident_count || 0,
          })
          await userApi.getDocuments()
            .then(data => {
              data.forEach(v => {
                if (v.type in apply_form.values) {
                  apply_form.setFieldValue([v.type + "_old"], {
                    ...v,
                    file: null,
                  })
                }
                else {
                  console.warn(`Unknown document type detected: ${v.type}`);
                }
              })
            })
            // .then(() => { console.log("apply_form.values", apply_form.values) })
            .catch(e => {
              // console.log(e.response)
            })
        }
      })
      .catch(e => {
        // console.log(e.response)
      })
  }

  const viewHandler = async (e) => {
    const name = e.target.getAttribute("data-name")
    const file = apply_form.values[name]
    if (!file || !file.id) {
      toast.error(t('no_file_found'))
      return
    }
    let url;
    if (file.id) {
      const entity = await userApi.getDocumentUrl(file);
      url = entity.path;
    }
    else {
      url = file.path;
    }
    if (!url) {
      return
    }
    set_pdfModel({
      name: file.name,
      url: url
    })
  }

  const hideModelHandler = (e) => {
    set_pdfModel({
      name: null, url: null
    });
  }

  useEffect(async () => {
    updateDriverData()
  }, [])

  useEffect(async () => {
    // console.log("apply_form", apply_form.values)
  }, [apply_form])

  return (
    <>

      <div className="modal fade p-0" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <form onSubmit={apply_form.handleSubmit}>
              <div className="modal-header border-0">
                <h4 className="modal-title font-weight-normal px-3 pt-3" id="exampleModalLabel">
                  {t('apply_for_this_job')}
                </h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className='modal-body px-5'>
                <Row>
                  <Col lg={6}>
                    <BaseInput
                      className=" col-12 mt-3"
                      label={t("first_name")}
                      placeholder={t("first_name")}
                      name="first_name"
                      value={apply_form.values.first_name}
                      touched={apply_form.touched.first_name}
                      error={apply_form.errors.first_name}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                  <Col lg={6}>
                    <BaseInput
                      className=" col-12 mt-3"
                      label={t("last_name")}
                      placeholder={t("last_name")}
                      name="last_name"
                      value={apply_form.values.last_name}
                      touched={apply_form.touched.last_name}
                      error={apply_form.errors.last_name}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <BaseInput
                      readOnly={user?.email ? true : false}
                      type="email"
                      className=" col-12 mt-3"
                      label={t("email")}
                      placeholder={t("email")}
                      name="email"
                      value={apply_form.values.email}
                      touched={apply_form.touched.email}
                      error={apply_form.errors.email}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                  <Col lg={6}>
                    <BaseInput
                      className=" col-12 mt-3"
                      label={t("contact_number")}
                      placeholder={t("contact_number")}
                      name="contact_number"
                      value={apply_form.values.contact_number}
                      touched={apply_form.touched.contact_number}
                      error={apply_form.errors.contact_number}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <BaseSelect
                      className="col-12 mt-3"
                      label={t("highest_degree")}
                      placeholder={t("highest_degree")}
                      name="highest_degree"
                      value={apply_form.values.highest_degree}
                      touched={apply_form.touched.highest_degree}
                      error={apply_form.errors.highest_degree}
                      enumType={DriverDegree}
                      labelPrefix="DriverDegree"
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                </Row>
                {/* Files Start */}
                <Row>
                  <Col lg={6}>
                    <BaseInput
                      type="file"
                      accept="application/pdf"
                      className="col-12 mt-3"
                      label={t(JobApplicantDocumentType.DRIVER_LICENSE)}
                      name={JobApplicantDocumentType.DRIVER_LICENSE}
                      onChange={handleFileChange}
                    />
                    {/* {
                      user &&
                      apply_form.values[JobApplicantDocumentType.DRIVER_LICENSE + "_old"] &&
                      <span className='col-12'>
                        <ViewFileButton
                          data_name={JobApplicantDocumentType.DRIVER_LICENSE + "_old"}
                          onClick={viewHandler}
                          label={t("VIEW_{name}", { name: t('OLD_DOCUMENT') })}
                          className='btn btn-link' />
                      </span>
                    } */}
                  </Col>
                  <Col lg={6}>
                    <BaseInput
                      type="file"
                      accept="application/pdf"
                      className=" col-12 mt-3 mt-3"
                      label={t(JobApplicantDocumentType.MEDICAL_CARD)}
                      name={JobApplicantDocumentType.MEDICAL_CARD}
                      onChange={handleFileChange}
                    />
                    {/* {
                      user &&
                      apply_form.values[JobApplicantDocumentType.MEDICAL_CARD + "_old"] &&
                      <span className='col-12'>
                        <ViewFileButton
                          data_name={JobApplicantDocumentType.MEDICAL_CARD + "_old"}
                          onClick={viewHandler}
                          label={t("VIEW_{name}", { name: t('OLD_DOCUMENT') })}
                          className='btn btn-link' />
                      </span>
                    } */}
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <BaseInput
                      type="file"
                      accept="application/pdf"
                      className=" col-12 mt-3 mt-3"
                      label={t(JobApplicantDocumentType.RESUME)}
                      name={JobApplicantDocumentType.RESUME}
                      onChange={handleFileChange}
                    />
                    {/* {
                      user &&
                      apply_form.values[JobApplicantDocumentType.RESUME + "_old"] &&
                      <span className='col-12'>
                        <ViewFileButton
                          data_name={JobApplicantDocumentType.RESUME + "_old"}
                          onClick={viewHandler}
                          label={t("VIEW_{name}", { name: t('OLD_DOCUMENT') })}
                          className='btn btn-link' />
                      </span>
                    } */}
                  </Col>
                  <Col lg={6}>
                    <BaseInput
                      type="file"
                      accept="application/pdf"
                      className=" col-12 mt-3 mt-3"
                      label={t(JobApplicantDocumentType.MVR)}
                      name={JobApplicantDocumentType.MVR}
                      onChange={handleFileChange}
                    />
                    {/* {
                      user &&
                      apply_form.values[JobApplicantDocumentType.MVR + "_old"] &&
                      <span className='col-12'>
                        <ViewFileButton
                          data_name={JobApplicantDocumentType.MVR + "_old"}
                          onClick={viewHandler}
                          label={t("VIEW_{name}", { name: t('OLD_DOCUMENT') })}
                          className='btn btn-link' />
                      </span>
                    } */}
                  </Col>
                </Row>
                {/* Files End */}

                <Row>
                  <Col lg={6}>
                    <BaseInput
                      className=" col-12 mt-3"
                      label={t("years_cdl_driving_experience")}
                      placeholder={t("years_cdl_driving_experience")}
                      name="cdl_experience"
                      type="number"
                      min={0}
                      value={apply_form.values.cdl_experience}
                      touched={apply_form.touched.cdl_experience}
                      error={apply_form.errors.cdl_experience}
                      onKeyDown={preventNegative}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                  <Col lg={6}>
                    <BaseInput
                      className=" col-12 mt-3"
                      label={t("voilations_in_last_3_years")}
                      placeholder={t("voilations_in_last_3_years")}
                      name="voilations"
                      type="number"
                      min={0}
                      value={apply_form.values.voilations}
                      touched={apply_form.touched.voilations}
                      error={apply_form.errors.voilations}
                      onKeyDown={preventNegative}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <BaseCheck
                      className="col-12 mt-4"
                      label={t("can_pass_drug_and_alcohol_test")}
                      name="drug_test"
                      checked={apply_form.values.drug_test}
                      onChange={apply_form.handleChange}
                      handleBlur={apply_form.handleBlur}
                      touched={apply_form.touched.drug_test}
                      error={apply_form.errors.drug_test}
                    />
                  </Col>
                </Row>

                {/* //To Do - Either will be able to create new account or not
                {
                  !user &&
                  <>
                    <Row>
                      <BaseCheck
                        className="col-12 mt-2"
                        label={t("create_driverfly_account")}
                        name="createAccount"
                        checked={apply_form.values.createAccount}
                        onChange={apply_form.handleChange}
                        handleBlur={apply_form.handleBlur}
                        touched={apply_form.touched.createAccount}
                        error={apply_form.errors.createAccount}
                      />
                      {
                        apply_form.values.createAccount &&
                        <>
                          <BaseInput
                            className="col-6 mt-1"
                            label={t("PASSWORD")}
                            required
                            type="password"
                            name="password"
                            placeholder={t("PASSWORD")}
                            value={apply_form.values.password}
                            touched={apply_form.touched.password}
                            error={apply_form.errors.password}
                            onChange={apply_form.handleChange}
                            handleBlur={apply_form.handleBlur}
                          />
                          <BaseInput
                            className="col-6 mt-1"
                            label={t("CONFIRM_PASSWORD")}
                            required
                            type="password"
                            name="confirmPassword"
                            placeholder={t("CONFIRM_PASSWORD")}
                            value={apply_form.values.confirmPassword}
                            touched={apply_form.touched.confirmPassword}
                            error={apply_form.errors.confirmPassword}
                            onChange={apply_form.handleChange}
                            handleBlur={apply_form.handleBlur}
                          />
                        </>
                      }
                    </Row>
                  </>
                }
                 */}

                <Row>
                  <div className=" col-12">
                    <p className='mx-3 mt-5'>{t('i_accept_{terms_and_condition}', { terms_and_condition: t('terms_and_condition') })}</p>
                  </div>
                </Row>
              </div>
              <div className="modal-footer mb-3">
                <button type="submit" className="btn btn-primary w-100 p-lg-3 p-5">{t('submit')}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <Modal show={!!pdfModel.name} onHide={() => hideModelHandler()}>
        <Modal.Header>
          {pdfModel.name}
          <Button variant="secondary" onClick={() => hideModelHandler()}>{t("close")}</Button>
        </Modal.Header>

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

      </Modal> */}

    </>
  )
}
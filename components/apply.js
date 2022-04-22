import { useState } from 'react'
import { useRouter } from "next/router"
import axios from "axios"
import useAuth from '../hooks/useAuth'
import { ToastContainer, toast } from 'react-toastify'
import { useFormik } from "formik"
import * as yup from "yup"
import { Trans, useTranslation } from "react-i18next"
import BaseApi from '../pages/api/_baseApi'
import JobApi from '../pages/api/job'
import BaseInput from './forms/BaseInput'
import BaseTextArea from './forms/BaseTextArea'
import BaseSelect from './forms/BaseSelect'
import { preventNegative } from "../utils/input"
import BaseCheck from './forms/BaseCheck'
import Link from 'next/link'
import { Row } from 'react-bootstrap'


export default function JobApply({ job }) {

  const { authCheck } = useAuth();
  const user = authCheck()
  console.log("user", user);
  const router = useRouter()
  const { t } = useTranslation();
  const jobApi = new JobApi();
  const baseApi = new BaseApi();

  const apply_form = useFormik({
    initialValues: {
      userId: user.id ?? null,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      contact_number: user.contact_number ?? "",
      email: user.email ?? "",
      qualifications: user.qualification ?? "",
      voilations: user.voilations ?? "",
      cdl_experience: user.cdl_experience ?? "",
      drug_test: user.drug_test ?? false,
      createAccount: false,
      password: null,
      confirmPassword: null,
    },
    validationSchema: yup.object({
      first_name: yup.string().required(t("{name}_field_is_required", { name: t('first_name') })).nullable(),
      last_name: yup.string().required(t("{name}_field_is_required", { name: t('last_name') })).nullable(),
      contact_number: yup.string().required(t("{name}_field_is_required", { name: t('contact_number') })).nullable(),
      email: yup.string().required(t("{name}_field_is_required", { name: t('email') })).nullable(),
      qualifications: yup.string().required(t("{name}_field_is_required", { name: t('qualifications') })).nullable(),
      voilations: yup.string().required(t("{name}_field_is_required", { name: t('voilations') })).nullable(),
      cdl_experience: yup.string().required(t("{name}_field_is_required", { name: t('cdl_experience') })).nullable(),
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
    }),
    onSubmit: async (values) => {
      const userDto = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: user.email || values.email,
        phone: values.contact_number,
        qualifications: values.qualifications,
        violations_count: parseInt(values.voilations),
        years_cdl_experience: parseInt(values.cdl_experience),
        drug_test: values.drug_test,
        createAccount: values.createAccount,
        password: values.password,
      };

      // const formData = new FormData()
      // formData.set('first_name', values.first_name)
      // formData.set('last_name', values.last_name)
      // formData.set('email', user.email || values.email)
      // formData.set('phone', values.contact_number)
      // formData.set('qualifications', values.qualifications)
      // formData.set('violations_count', parseInt(values.voilations))
      // formData.set('years_cdl_experience', parseInt(values.cdl_experience))
      // formData.set('drug_test', values.drug_test)
      // formData.set('createAccount', values.createAccount)
      // formData.set('password', values.password)

      // formData.append("resume", resume)
      // formData.append("commercial_driving_license", commercial_driving_license)
      // formData.append("medical_card", medical_card)


      await jobApi.applyForJob(job.id, userDto)
        .then(data => {
          if (data.status == 201) {
            closeModal()
            toast.success(t('job_applied_success_message'))
          }
        })
        .catch(function (error) {
          // console.log("error?.response", error?.response);
          if (error?.response?.data?.job == "INVALID_JOB_SPECIFIED") {
            toast.error(t('INVALID_JOB_SPECIFIED'))
          } else if (error?.response?.data?.email == "ALREADY_EXISTS") {
            toast.error(t('USER_ALREADY_EXISTS'))
          } else if (error?.response?.data?.email == "USER_INVALID") {
            toast.error(t('USER_INACTIVE'))
          } else if (error?.response?.data?.email == "ALREADY_APPLIED") {
            toast.error(t('ALREADY_APPLIED'))
          } else {
            toast.error(t('ERROR_MESSAGE_DEFAULT'))
          }
          closeModal()
        })
    }
  });

  const closeModal = () => {
    const closeButton = document.getElementsByClassName('close')
    closeButton[0].click()
  }

  const [resume, setResume] = useState(null)
  const [commercial_driving_license, setCommercial_driving_license] = useState(null)
  const [medical_card, setMedical_card] = useState(null)

  const handleChange = e => {
    const { name, value } = e.target
    setInputValues(preValue => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }

  function Upload(event) {
    if (event.target.files && event.target.files[0]) {
      const t = event.target.name
      const file = event.target.files[0]
      if (t == "cv") {
        setResume(file)
        console.log(file)
      }
      if (t == "card") {
        setMedical_card(file)
      }
      if (t == "license") {
        setCommercial_driving_license(file)
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <div className="modal fade p-0" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  <BaseInput
                    className="col-lg-6 col-12 mt-3"
                    label={t("first_name")}
                    placeholder={t("first_name")}
                    name="first_name"
                    value={apply_form.values.first_name}
                    touched={apply_form.touched.first_name}
                    error={apply_form.errors.first_name}
                    onChange={apply_form.handleChange}
                    handleBlur={apply_form.handleBlur}
                  />
                  <BaseInput
                    className="col-lg-6 col-12 mt-3"
                    label={t("last_name")}
                    placeholder={t("last_name")}
                    name="last_name"
                    value={apply_form.values.last_name}
                    touched={apply_form.touched.last_name}
                    error={apply_form.errors.last_name}
                    onChange={apply_form.handleChange}
                    handleBlur={apply_form.handleBlur}
                  />
                </Row>
                <Row>
                  <BaseInput
                    readOnly={user?.email ? true : false}
                    type="email"
                    className="col-lg-6 col-12 mt-3"
                    label={t("email")}
                    placeholder={t("email")}
                    name="email"
                    value={apply_form.values.email}
                    touched={apply_form.touched.email}
                    error={apply_form.errors.email}
                    onChange={apply_form.handleChange}
                    handleBlur={apply_form.handleBlur}
                  />
                  <BaseInput
                    className="col-lg-6 col-12 mt-3"
                    label={t("contact_number")}
                    placeholder={t("contact_number")}
                    name="contact_number"
                    value={apply_form.values.contact_number}
                    touched={apply_form.touched.contact_number}
                    error={apply_form.errors.contact_number}
                    onChange={apply_form.handleChange}
                    handleBlur={apply_form.handleBlur}
                  />
                </Row>
                <Row>
                  <BaseTextArea
                    className="col-12 mt-3"
                    label={t("qualifications")}
                    name="qualifications"
                    // required
                    rows="3"
                    placeholder={t("qualifications")}
                    value={apply_form.values.qualifications}
                    touched={apply_form.touched.qualifications}
                    error={apply_form.errors.qualifications}
                    onChange={apply_form.handleChange}
                    handleBlur={apply_form.handleBlur}
                  />
                </Row>
                {/* Files Start */}
                {/* <Row>
                  <div className="col-lg-6 col-12 mt-3 mt-3">
                    <label>Upload your CV</label>
                    <input onChange={Upload} name="cv" type="file" className="form-control mt-lg-4 mt-0" />
                    <p style={{ fontStyle: "italic", color: "red" }}>{validation?.resume}</p>
                  </div>
                  <div className="col-lg-6 col-12 mt-3 mt-3">
                    <label>Upload your Commercial Driver’s License</label>
                    <input onChange={Upload} name="license" type="file" className="form-control" />
                    <p style={{ fontStyle: "italic", color: "red" }}>{validation?.commercial_driving_license}</p>
                  </div>
                </Row>
                <Row>
                  <div className="col-lg-6 col-12 mt-3 mt-3">
                    <label>Upload your Medical card</label>
                    <input onChange={Upload} name="card" type="file" className="form-control mt-lg-4 mt-0" />
                    <p style={{ fontStyle: "italic", color: "red" }}>{validation?.medical_card}</p>
                  </div>
                </Row> */}
                {/* Files End */}
                <Row>
                  <BaseInput
                    className="col-lg-6 col-12 mt-3"
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
                  <BaseInput
                    className="col-lg-6 col-12 mt-3"
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
                </Row>
                <Row>
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
                </Row>
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
    </>
  )
}
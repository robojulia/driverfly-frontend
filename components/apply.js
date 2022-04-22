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
  // console.log("user", user);
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
      DRIVER_LICENSE: {
        type: "DRIVER_LICENSE",
        file: null,
      },
      MEDICAL_CARD: {
        type: "MEDICAL_CARD",
        file: null,
      },
      RESUME: {
        type: "RESUME",
        file: null,
      },
      MVR: {
        type: "MVR",
        file: null,
      },
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

      DRIVER_LICENSE: yup.object({
        file: yup.mixed()
          .test({
            test: (value, context) => {
              if (!value) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_field_is_required", { name: t('drivers_license') })
                })
              }
              if (!(["application/pdf"].includes(value.type))) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_file_must_be_{file}", {
                    name: t('drivers_license'),
                    file: t('pdf'),
                  })
                });
              }
              return true
            }
          }),
      }),

      MEDICAL_CARD: yup.object({
        file: yup.mixed()
          .test({
            test: (value, context) => {
              if (!value) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_field_is_required", { name: t('medical_card') })
                })
              }
              if (!(["application/pdf"].includes(value.type))) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_file_must_be_{file}", {
                    name: t('medical_card'),
                    file: t('pdf'),
                  })
                });
              }
              return true
            }
          }),
      }),

      RESUME: yup.object({
        file: yup.mixed()
          .test({
            test: (value, context) => {
              if (!value) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_field_is_required", { name: t('resume') })
                })
              }
              if (!(["application/pdf"].includes(value.type))) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_file_must_be_{file}", {
                    name: t('resume'),
                    file: t('pdf'),
                  })
                });
              }
              return true
            }
          }),
      }),

      MVR: yup.object({
        file: yup.mixed()
          .test({
            test: (value, context) => {
              if (!value) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_field_is_required", { name: t('motor_vehicle_record') })
                })
              }
              if (!(["application/pdf"].includes(value.type))) {
                return context.createError({
                  path: context.path,
                  message: t("{name}_file_must_be_{file}", {
                    name: t('motor_vehicle_record'),
                    file: t('pdf'),
                  })
                });
              }
              return true
            }
          }),
      }),

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

      const formData = new FormData()
      formData.set('first_name', values.first_name)
      formData.set('last_name', values.last_name)
      formData.set('email', user.email || values.email)
      formData.set('phone', values.contact_number)
      formData.set('qualifications', values.qualifications)
      formData.set('violations_count', parseInt(values.voilations))
      formData.set('years_cdl_experience', parseInt(values.cdl_experience))
      formData.set('drug_test', values.drug_test)
      formData.set('createAccount', values.createAccount)
      formData.set('password', values.password)
      Object.values(values).forEach(v => {
        if (v && v.file) {
          console.log("v", v);
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
        }
      });

      // await baseApi.post(`jobs/${job.id}/apply`, formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
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

  const handleFileChange = (e) => {
    const { target: { name, files } } = e;

    if (files && files[0]) {
      const file = files[0];
      // console.log("file", file);

      apply_form.setValues({
        ...apply_form.values,
        [name]: {
          ...apply_form.values[name],
          file: file,
        }
      });
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
                <Row>
                  <BaseInput
                    type="file"
                    accept="application/pdf"
                    className="col-lg-6 col-12 mt-3 mt-3"
                    label={t("drivers_license")}
                    placeholder={t("drivers_license")}
                    name="DRIVER_LICENSE"
                    value={apply_form.values?.DRIVER_LICENSE?.file}
                    touched={apply_form.touched.DRIVER_LICENSE?.file}
                    error={apply_form.errors?.DRIVER_LICENSE?.file}
                    onChange={handleFileChange}
                  />
                  <BaseInput
                    type="file"
                    accept="application/pdf"
                    className="col-lg-6 col-12 mt-3 mt-3"
                    label={t("medical_card")}
                    placeholder={t("medical_card")}
                    name="MEDICAL_CARD"
                    value={apply_form.values.MEDICAL_CARD?.file}
                    touched={apply_form.touched.MEDICAL_CARD?.file}
                    error={apply_form.errors?.MEDICAL_CARD?.file}
                    onChange={handleFileChange}
                  />
                </Row>
                <Row>
                  <BaseInput
                    type="file"
                    accept="application/pdf"
                    className="col-lg-6 col-12 mt-3 mt-3"
                    label={t("resume")}
                    placeholder={t("resume")}
                    name="RESUME"
                    value={apply_form.values?.RESUME?.file}
                    touched={apply_form.touched.RESUME?.file}
                    error={apply_form.errors?.RESUME?.file}
                    onChange={handleFileChange}
                  />
                  <BaseInput
                    type="file"
                    accept="application/pdf"
                    className="col-lg-6 col-12 mt-3 mt-3"
                    label={t("motor_vehicle_record")}
                    placeholder={t("motor_vehicle_record")}
                    name="MVR"
                    value={apply_form.values.MVR?.file}
                    touched={apply_form.touched.MVR?.file}
                    error={apply_form.errors?.MVR?.file}
                    onChange={handleFileChange}
                  />
                </Row>
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
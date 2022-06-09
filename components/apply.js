import { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth'
import { toast } from 'react-toastify'
import { useFormik } from "formik"
import { useTranslation } from "../hooks/useTranslation"
import JobApi from '../pages/api/job'
import BaseInput from './forms/BaseInput'
import BaseSelect from './forms/BaseSelect'
import FileInput from "./forms/FileInput";
import { preventNegative } from "../utils/input"
import BaseCheck from './forms/BaseCheck'
import { Col, Row, Table } from 'react-bootstrap'
import { EducationLevel } from '../enums/users/education-level.enum'
import Button from "react-bootstrap/Button"

import { ApplicantEntity } from '../models/applicant/applicant.entity'
import ApplicantApi from '../pages/api/applicant'

import ViewModal from "./viewDetails/viewModal";
import { globalAjaxExceptionHandler } from "../utils/ajax";
import ViewCard from './viewDetails/viewCard'
import { ApplicantDocumentType } from '../enums/applicants/applicant-document-type.enum'
import { DocumentEntity } from '../models/documents/document.entity'
import { PlusCircle, DashCircle } from 'react-bootstrap-icons'
import BaseInputPhone from './forms/BaseInputPhone'

export default function JobApply({ job }) {

  const { authCheck } = useAuth();
  const user = authCheck()
  const { t } = useTranslation();

  const jobApi = new JobApi();

  const apply_form = useFormik({
    initialValues: new ApplicantEntity(),
    validationSchema: ApplicantEntity.yupSchema(),
    onSubmit: async (dto) => {
      console.log("apply_form.values", dto)


      try {
        const applicant = await jobApi.apply(job.id, dto);

        toast.success(t('job_applied_success_message'))
        setViewForm(false);
      }
      catch (e) {
        globalAjaxExceptionHandler(e, { formik: apply_form, toast: toast, t: t });
      }
    }
  });

  useEffect(async () => {
    const api = new ApplicantApi();
    try {
      const applicant = await api.getByUserId();
      apply_form.setValues({
        ...apply_form.values,
        ...applicant,
      });
    }
    catch (e) {
      if (e.response?.status === 401) {
        // swallow the error here if it's a 401
        // this is a mixed public & private page
        return;
      }
      throw e;
    }

  }, [])

  const [ viewForm, setViewForm ] = useState(false);
  const onApplyClick = (e) => {
    setViewForm(!viewForm);
  }

  const onCloseClick = (e) => {
    setViewForm(false);
  }

  // uncomment this to go into form debugging mode
  // useEffect(async () => {
  //   console.log("apply_form", apply_form.values)
  // }, [apply_form])

  return (
    <>
      <div className="ort-btn mt-lg-4 mt-0">
        <button type="button" className="btn btn-danger" onClick={onApplyClick}> {t('apply_now')} <i className="fa fa-long-arrow-right pl-1" aria-hidden="true"></i></button>
      </div>

      <ViewModal
        show={viewForm}
        closeText="CANCEL"
        onCloseClick={onCloseClick}
        title="apply_for_this_job"
        footer={<button type="submit" className="btn btn-primary w-100 p-lg-3 p-5" onClick={apply_form.handleSubmit}>{t('submit')}</button>}
      >
        <form onSubmit={apply_form.handleSubmit}>
          {typeof apply_form.errors.job === "string" &&
            <Row>
              <span className='text-danger'>{apply_form.errors.job}</span>
            </Row>
          }
          <Row>
            <BaseInput
                className=" col-6 mt-3"
                label="first_name"
                placeholder="first_name"
                name="first_name"
                formik={apply_form}
              />
            <BaseInput
                className="col-6 mt-3"
                label="last_name"
                placeholder="last_name"
                name="last_name"
                formik={apply_form}
              />
          </Row>
          <Row>
            <BaseInput
              readOnly={user?.email ? true : false}
              type="email"
              className=" col-6 mt-3"
              label="email"
              placeholder="email"
              name="email"
              formik={apply_form}
            />
            <BaseInputPhone
              className=" col-6 mt-3"
              label="contact_number"
              placeholder="contact_number"
              name="phone"
              formik={apply_form}
            />
          </Row>
          <Row>
            <BaseSelect
                className="col-12 mt-3"
                label="highest_degree"
                placeholder="highest_degree"
                name="highest_degree"
                enumType={EducationLevel}
                labelPrefix="EducationLevel"
                formik={apply_form}
              />
          </Row>
          {/* Files Start */}
          <Row>
            <Col sm="12" className="mt-3">
              <ViewCard
                title="DOCUMENTS"
                actions={<Button size='sm'
                    disabled={apply_form.values.documents?.length === Object.keys(ApplicantDocumentType).length}
                    onClick={() => apply_form.setValues({
                        ...apply_form.values,
                        documents: [
                            ...(apply_form.values.documents || []),
                            new DocumentEntity()
                        ]
                    })}><PlusCircle /> {t("ADD")}</Button>}
            >
                {!apply_form.values.documents?.length &&
                    t("NONE")
                }
                {
                    apply_form.values.documents?.length > 0 &&

                    <Table striped>
                        <thead>
                            <tr>
                                <th>{t("TYPE")}</th>
                                <th>{t("DOCUMENT")}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {apply_form.values
                                .documents
                                .map((entity, i) => (
                                    <tr key={i}>
                                        <td>
                                            <BaseSelect
                                                name={`documents[${i}].type`}
                                                required
                                                placeholder="TYPE"
                                                labelPrefix="ApplicantDocumentType"
                                                enumType={ApplicantDocumentType}
                                                readOnly={!!entity.id && !entity.file_base64}
                                                formik={apply_form}
                                            />
                                        </td>
                                        <td>
                                            <FileInput
                                                name={`documents[${i}]`}
                                                required
                                                accept="application/pdf"
                                                formik={apply_form}
                                            />
                                        </td>
                                        <td>
                                            <a href="" onClick={() => apply_form.setValues({
                                                ...apply_form.values,
                                                documents: apply_form.values.documents.filter((v, idx) => i != idx)
                                            })}><DashCircle color="red" /></a>
                                        </td>

                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                }
            </ViewCard>
            </Col>
          </Row>
          {/* Files End */}

          <Row>
            <BaseInput
                className=" col-6 mt-3"
                label="years_cdl_driving_experience"
                placeholder="years_cdl_driving_experience"
                name="years_cdl_experience"
                type="int"
                min={0}
                formik={apply_form}
              />
            <BaseInput
              className=" col-6 mt-3"
              label={t("voilations_in_last_3_years")}
              placeholder={t("voilations_in_last_3_years")}
              name="accident_count"
              type="int"
              min={0}
              formik={apply_form}
              />
          </Row>

          <Row>
            <BaseCheck
                className="col-6 mt-4"
                label="can_pass_drug_and_alcohol_test"
                name="can_pass_drug_test"
                formik={apply_form}
                />
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
        </form>


      </ViewModal>

    </>
  )
}
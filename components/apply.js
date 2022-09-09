import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
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
import UserApi from '../pages/api/user';
import { UserPreferenceCategory } from '../enums/users/user-preference-category.enum';
import { SharePreference } from '../enums/users/share-preference.enum';

import ViewModal from "./viewDetails/viewModal";
import { globalAjaxExceptionHandler } from "../utils/ajax";
import ViewCard from './viewDetails/viewCard'
import { ApplicantDocumentType } from '../enums/applicants/applicant-document-type.enum'
import { DocumentEntity } from '../models/documents/document.entity'
import { PlusCircle, DashCircle, ArrowRight, Star } from 'react-bootstrap-icons'
import BaseInputPhone from './forms/BaseInputPhone'
import { DriverLicenseType } from "../enums/users/driver-license-type.enum";

export default function JobApply({ job, setEncourageModal }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const jobApi = new JobApi();

    const apply_form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchema(),
        onSubmit: async (dto, { resetForm }) => {
            try {
                const applicant = await jobApi.apply(job.id, dto);

                toast.success(t('job_applied_success_message'))
                setViewForm(false);
                resetForm()
                setEncourageModal(true)
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: apply_form, toast: toast, t: t });
                if (e.response?.data?.message == "ApplicantJobService.APPLICANT_ALREADY_APPLIED") setViewForm(false)
            }
        }
    });

    useEffect(async () => {
        if (user && user.id) {
            const api = new ApplicantApi();
            const userApi = new UserApi();
            try {
                if (!user.company) {
                    const applicant = await api.getByUserId();
                    if (applicant) {
                        const preferences = await userApi.preferences.list(user.id, { category: UserPreferenceCategory.SHARING });

                        if (preferences.length > 0) {
                            applicant.documents = applicant.documents.filter(
                                (document) => !preferences.some(
                                    (preference) => preference.label === document.type && preference.value === SharePreference.NEVER
                                )
                            );
                        } else applicant.documents = applicant.documents?.filter((document) => document.type === ApplicantDocumentType.RESUME);

                        apply_form.setValues({
                            ...apply_form.values,
                            ...applicant,
                        });
                    }
                }
            }
            catch (e) {
                if (e.response?.status === 401) {
                    // swallow the error here if it's a 401
                    // this is a mixed public & private page
                    return;
                }
                throw e;
            }
        }
    }, [])

    const [viewForm, setViewForm] = useState(false);
    const onApplyClick = (e) => {
        setViewForm(!viewForm);
    }

    const onCloseClick = (e) => {
        setViewForm(false);
    }

    if (apply_form.errors && Object.keys(apply_form.errors).length > 0)
        console.error(apply_form.errors);


    // uncomment this to go into form debugging mode
    // useEffect(async () => {
    //   console.log("apply_form", apply_form.values)
    // }, [apply_form])

    return (
        <>

            <div className="ort-btn mt-lg-4 mt-0">
                <button type="button" className="btn theme-primary-btn" onClick={onApplyClick}> {t('APPLY_NOW')}<ArrowRight /></button>
                {/* <button type="button" className="btn theme-general-btn"> <Star /> {t('shortlist')} </button> */}
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
                            required
                            formik={apply_form}
                        />
                        <BaseInput
                            className="col-6 mt-3"
                            label="last_name"
                            placeholder="last_name"
                            name="last_name"
                            required
                            formik={apply_form}
                        />
                    </Row>
                    <Row>
                        <BaseInput
                            readOnly={user && !user.company ? true : false}
                            type="email"
                            className=" col-6 mt-3"
                            label="email"
                            placeholder="email"
                            name="email"
                                formik={user?.company ? null : apply_form}
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
                        {user !== null ?
                            <BaseSelect
                                className="col-12 mt-3"
                                label="highest_degree"
                                placeholder="highest_degree"
                                name="highest_degree"
                                enumType={EducationLevel}
                                labelPrefix="EducationLevel"
                                formik={apply_form}
                            /> : <BaseSelect
                                className="col-12 mt-3"
                                label="CDL_CLASS"
                                name="license_type"
                                placeholder="DriverLicenseType.NONE"
                                labelPrefix="DriverLicenseType"
                                required
                                enumType={DriverLicenseType}
                                formik={apply_form}
                            />}
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
                                                            <button onClick={() => apply_form.setValues({
                                                                ...apply_form.values,
                                                                documents: apply_form.values.documents.filter((v, idx) => i != idx)
                                                            })}><DashCircle color="red" /></button>
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
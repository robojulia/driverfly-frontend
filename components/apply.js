import { PlusCircle, DashCircle, ArrowRight, Star } from 'react-bootstrap-icons'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from "formik"
import { Col, Row, Table } from 'react-bootstrap'
import Button from "react-bootstrap/Button"
import { useTranslation } from "../hooks/use-translation"
import JobApi from '../pages/api/job'
import BaseInput from './forms/base-input'
import BaseSelect from './forms/base-select'
import FileInput from "./forms/file-input";
import BaseCheck from './forms/base-check'
import { EducationLevel } from '../enums/users/education-level.enum'
import { useAuth } from '../hooks/use-auth'
import { ApplicantEntity } from '../models/applicant/applicant.entity'
import ApplicantApi from '../pages/api/applicant'
import UserApi from '../pages/api/user';
import { UserPreferenceCategory } from '../enums/users/user-preference-category.enum';
import { SharePreference } from '../enums/users/share-preference.enum';
import ViewModal from "./view-details/view-modal";
import { globalAjaxExceptionHandler } from "../utils/ajax";
import ViewCard from './view-details/view-card'
import { ApplicantDocumentType } from '../enums/applicants/applicant-document-type.enum'
import { DocumentEntity } from '../models/documents/document.entity'
import BaseInputPhone from './forms/base-input-phone'
import { DriverLicenseType } from "../enums/users/driver-license-type.enum";
import { LoaderIcon } from './loading/loader-icon'

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
                // resetForm()
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
                    applicant.documents = applicant.documents.filter(v => Object.values(ApplicantDocumentType).includes(v.type))

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

    useEffect(() => {
        console.error(apply_form.errors);
    }, [apply_form.errors])

    return (
        <>

            <div className="ort-btn mt-lg-4 mt-0">
                <button type="button" className="btn theme-primary-btn" onClick={onApplyClick}> {t('APPLY_NOW')}<ArrowRight /></button>
            </div>

            <ViewModal
                show={viewForm}
                closeText="CANCEL"
                onCloseClick={onCloseClick}
                title="apply_for_this_job"
                footer={
                    <button
                        disabled={!!apply_form.isSubmitting || !!!apply_form.isValid || !!apply_form.isValidating}
                        type="submit"
                        className="btn btn-primary w-100 p-lg-3 p-5"
                        onClick={apply_form.handleSubmit}>
                        <LoaderIcon isLoading={!!apply_form.isSubmitting} /> {t('submit')}
                    </button>
                }
            >
                <form onSubmit={apply_form.handleSubmit}>
                    {typeof apply_form.errors.job === "string" &&
                        <Row>
                            <span className='text-danger'>{apply_form.errors.job}</span>
                        </Row>
                    }
                    <Row>
                        <BaseInput
                            className=" col-md-6 mt-3"
                            label="first_name"
                            placeholder="first_name"
                            name="first_name"
                            required
                            formik={apply_form}
                        />
                        <BaseInput
                            className="col-md-6 mt-3"
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
                            className=" col-md-6 mt-3"
                            label="email"
                            placeholder="email"
                            name="email"
                            formik={user?.company ? null : apply_form}
                        />
                        <BaseInputPhone
                            className=" col-md-6 mt-3"
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
                                // placeholder="DriverLicenseType.NONE"
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
                                    <>
                                        <Row className="p-1">
                                            {
                                                apply_form.values
                                                    .documents
                                                    .map((entity, i) => (
                                                        <Row key={i} className="pr-0">
                                                            <Col className='my-2 pr-0'>
                                                                <BaseSelect
                                                                    name={`documents[${i}].type`}
                                                                    required
                                                                    placeholder="TYPE"
                                                                    labelPrefix="ApplicantDocumentType"
                                                                    enumType={ApplicantDocumentType}
                                                                    readOnly={!!entity.id && !entity.file_base64}
                                                                    formik={apply_form}
                                                                />
                                                            </Col>
                                                            <Col md="6" className="pr-0 my-2">
                                                                <FileInput
                                                                    allowedSizeInByte={3145728}
                                                                    name={`documents[${i}]`}
                                                                    required
                                                                    accept="application/pdf"
                                                                    formik={apply_form}
                                                                />
                                                            </Col>
                                                            <div className="col-md-1 mt-lg-3 mt-md-3 mt-1 text-right p-0">
                                                                <button onClick={() => apply_form.setValues({
                                                                    ...apply_form.values,
                                                                    documents: apply_form.values.documents.filter((v, idx) => i != idx)
                                                                })}><DashCircle color="red" /></button>
                                                            </div>
                                                        </Row>
                                                    ))}
                                        </Row>

                                    </>
                                }
                            </ViewCard>
                        </Col>
                    </Row>
                    {/* Files End */}

                    <Row>
                        <BaseInput
                            className=" col-md-6 mt-3"
                            label="years_cdl_driving_experience"
                            placeholder="years_cdl_driving_experience"
                            name="years_cdl_experience"
                            type="int"
                            min={0}
                            formik={apply_form}
                        />
                        <BaseInput
                            className=" col-md-6 mt-3"
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
                            className="col-md-6 mt-4"
                            label="can_pass_drug_and_alcohol_test"
                            name="can_pass_drug_test"
                            formik={apply_form}
                        />
                    </Row>
                    <Row>
                        <div className=" col-12 p-0">
                            <p className='mx-3 mt-5'>{t('i_accept_{terms_and_condition}', { terms_and_condition: t('terms_and_condition') })}</p>
                        </div>
                    </Row>
                </form>


            </ViewModal >

        </>
    )
}
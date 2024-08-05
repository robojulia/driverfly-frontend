import { useFormik } from "formik"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { ArrowRight, DashCircle, PlusCircle } from 'react-bootstrap-icons'
import Button from "react-bootstrap/Button"
import { toast } from 'react-toastify'
import { ApplicantDocumentType } from '../enums/applicants/applicant-document-type.enum'
import { ApplicantExtras } from "../enums/applicants/applicant-extras.enum"
import { BooleanTypeExtra } from "../enums/jotform/bool-and-not-sure.enum"
import { HearAboutUsType } from "../enums/jotform/hear-about-type.enum"
import { DriverLicenseType } from "../enums/users/driver-license-type.enum"
import { EducationLevel } from '../enums/users/education-level.enum'
import { SharePreference } from '../enums/users/share-preference.enum'
import { UserPreferenceCategory } from '../enums/users/user-preference-category.enum'
import { useAuth } from '../hooks/use-auth'
import { useTranslation } from "../hooks/use-translation"
import { ApplicantExtrasEntity, ApplicantJobEntity } from "../models/applicant"
import { ApplicantEntity } from '../models/applicant/applicant.entity'
import { DocumentEntity } from '../models/documents/document.entity'
import ApplicantApi from '../pages/api/applicant'
import JobApi from '../pages/api/job'
import UserApi from '../pages/api/user'
import { globalAjaxExceptionHandler } from "../utils/ajax"
import { useEffectAsync } from '../utils/react'
import BaseCheck from './forms/base-check'
import BaseInput from './forms/base-input'
import BaseInputPhone from './forms/base-input-phone'
import BaseSelect from './forms/base-select'
import FileInput from "./forms/file-input"
import { LoaderIcon } from './loading/loader-icon'
import ViewCard from './view-details/view-card'
import ViewModal from "./view-details/view-modal"

export default function JobApply({ job, setEncourageModal }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const jobApi = new JobApi();
    const applicantApi = new ApplicantApi();
    const userApi = new UserApi();

    const [showModal, setShowModal] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [applicant, setApplicant] = useState<ApplicantEntity>();

    const apply_form = useFormik({
        initialValues: new ApplicantEntity(),
        validationSchema: ApplicantEntity.yupSchemaForApplyForm(),
        onSubmit: async (dto, { resetForm }) => {
            dto.years_cdl_experience = Number(dto.years_cdl_experience);
            dto.moving_violations_count = Number(dto.moving_violations_count);
            dto.accident_count = Number(dto.accident_count);
            dto.extras = [...dto.extras, { ...new ApplicantExtrasEntity(ApplicantExtras.HEAR_ABOUT_US), value: HearAboutUsType.JOB_BOARD }]

            try {
                const response = await jobApi.apply(job.id, dto);
                setApplicant(response)
                toast.success(t('job_applied_success_message'))
                setShowForm(false);
                // resetForm()
                // setEncourageModal(true)
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: apply_form, toast: toast, t: t });
                if (e.response?.data?.message == "ApplicantJobService.APPLICANT_ALREADY_APPLIED") setShowModal(false)
            }
        }
    });

    useEffectAsync(async () => {
        let data = new ApplicantEntity();
        if (user && user.id) {
            try {
                if (!user.company) {
                    data = await applicantApi.me.get();
                    data.documents = data.documents?.filter(v => Object.values(ApplicantDocumentType).includes(v.type as ApplicantDocumentType))
                    if (data) {
                        const preferences = await userApi.preferences.list(user.id, { category: UserPreferenceCategory.SHARING });
                        if (preferences?.length > 0) {
                            data.documents = applicant.documents.filter(
                                (document) => !preferences.some(
                                    (preference) => preference.label == document.type && preference.value == SharePreference.NEVER
                                )
                            );
                        } else data.documents = data.documents?.filter((document) => document.type == ApplicantDocumentType.RESUME_OPTIONAL);
                    }
                    setApplicant(data);
                }
            }
            catch (e) {
                if (e.response?.status == 401) {
                    return;
                }
                throw e;
            }
        } else {
            data.years_cdl_experience = 0;
            data.moving_violations_count = 0;
            data.accident_count = 0;
        }

        apply_form.setValues({
            ...apply_form.values,
            ...data,
        });
    }, [showModal])

    const onApplyClick = (): void => {
        setShowModal(true);
    }

    const onCloseClick = () => {
        // apply_form.resetForm()
        setShowModal(false);
        setShowForm(true);
        setEncourageModal(true)
    }


    useEffect(() => {
        console.log("values", apply_form.values);
        console.log("errors", apply_form.errors);
    }, [apply_form.values, apply_form.errors])

    return (
        <>
            {applicant?.jobs?.length > 0 && applicant?.jobs?.some((item) => item?.job?.id == job?.id) ?
                <div className="ort-btn mt-lg-4 mt-0">
                    <button type="button" className="btn theme-primary-btn" disabled={true}> {t('APPLIED')}</button>
                </div>
                :
                <div className="ort-btn mt-lg-4 mt-0">
                    <button type="button" className="btn theme-primary-btn" onClick={onApplyClick}> {t('APPLY_NOW')}<ArrowRight /></button>
                </div>
            }

            <ViewModal
                size={"xl"}
                show={showModal}
                closeText="CANCEL"
                onCloseClick={onCloseClick}
                title="apply_for_this_job"
                footer={
                    showForm &&
                    <button
                        disabled={!!apply_form.isSubmitting || !!!apply_form.isValid || !!apply_form.isValidating}
                        type="submit"
                        className="btn btn-primary w-100 p-lg-3 p-5"
                        onClick={() => apply_form.handleSubmit()}>
                        <LoaderIcon isLoading={!!apply_form.isSubmitting} /> {t('submit')}
                    </button>
                }
            >
                {showForm
                    ? <form onSubmit={apply_form.handleSubmit}>
                        {/* {typeof apply_form.errors.job == "string" &&
                        <Row>
                            <span className='text-danger'>{apply_form.errors.job}</span>
                        </Row>
                    } */}
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
                                required
                                className=" col-md-6 mt-3"
                                label="contact_number"
                                placeholder="contact_number"
                                name="phone"
                                formik={apply_form}
                            />
                        </Row>
                        <Row>
                            <BaseSelect
                                className="col-6 mt-3"
                                label="highest_degree"
                                placeholder="highest_degree"
                                name="highest_degree"
                                enumType={EducationLevel}
                                labelPrefix="EducationLevel"
                                formik={apply_form}
                            />
                            <BaseInput
                                className="col-6 mt-3 no-arrow"
                                name="zip_code"
                                type="number"
                                label="zip_code"
                                placeholder="zip_code"
                                formik={apply_form}
                            />
                        </Row>
                        <Row className="mt-3">
                            <BaseSelect
                                className="col-6 "
                                label="CDL_CLASS"
                                name="license_type"
                                // placeholder="DriverLicenseType.NONE"
                                labelPrefix="DriverLicenseType"
                                enumType={DriverLicenseType}
                                formik={apply_form}
                                onChange={(e) => {
                                    apply_form.handleChange(e)
                                    if (![DriverLicenseType.CDL_CLASS_A, DriverLicenseType.CDL_CLASS_B].includes(apply_form.values?.license_type)) {
                                        apply_form.setFieldValue("years_cdl_experience", 0)
                                    }
                                }}
                            />
                            {!!apply_form.values.license_type && apply_form.values.license_type !== DriverLicenseType.NO_CDL && (
                                <>
                                    <BaseInput
                                        className="col-6"
                                        type="number"
                                        step={0.1}
                                        min={0}
                                        name="years_cdl_experience"
                                        label="years_cdl_experience"
                                        placeholder="PLACEHOLDER_FOR_DIGITS"
                                        required
                                        formik={apply_form}
                                    />
                                </>
                            )}
                        </Row>
                        {[DriverLicenseType.CDL_CLASS_A, DriverLicenseType.CDL_CLASS_B].includes(apply_form.values?.license_type) && (
                            <Row className="mt-3 ">
                                <BaseCheck
                                    className="my-3"
                                    name="is_owner_operator"
                                    label="is_owner_operator_question"
                                    formik={apply_form}
                                />
                            </Row>
                        )}
                        {/* Files Start */}
                        <Row>
                            <Col sm="12" className="mt-3">
                                <ViewCard
                                    title="DOCUMENTS"
                                    actions={<Button size='sm'
                                        disabled={apply_form.values.documents?.length == Object.keys(ApplicantDocumentType)?.length}
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
                                                                        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
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
                                className="col mt-3"
                                required
                                name="moving_violations_count"
                                type="number"
                                step={1}
                                min={0}
                                label="voilations_in_last_3_years"
                                placeholder="PLACEHOLDER_FOR_DIGITS"
                                formik={apply_form}
                            />
                            <BaseInput
                                className="col mt-3"
                                required
                                name="accident_count"
                                type="number"
                                step={1}
                                min={0}
                                label="accidents_last_5_years"
                                placeholder="PLACEHOLDER_FOR_DIGITS"
                                formik={apply_form}
                            />
                        </Row>

                        <Row>
                            <BaseCheck
                                className="col-md-6 mt-3 mb-1"
                                label="can_pass_drug_and_alcohol_test"
                                name="can_pass_drug_test"
                                formik={apply_form}
                            />
                        </Row>
                        <Row >
                            <p className={`form-text text-muted`}>
                                {t("{company_name}_DRUG_TEST_DOT", { company_name: job?.company?.name }, { translateProps: true })}
                            </p>
                        </Row>
                        <Row>
                            <BaseSelect
                                className="col-12 mt-3"
                                required
                                labelPrefix="BooleanPreferenceType"
                                enumType={BooleanTypeExtra}
                                name={`authorize_to_communicate`}
                                placeholder="CHOOSE"
                                label={t("{company_name}_SMS_EMAIL_AUTHORIZATION_NAUTILIUS", { company_name: job?.company?.name }, { translateProps: true })}
                                formik={apply_form}
                            />
                        </Row>
                        <Row>
                            <div className="font-weight-bold col-12 p-0">
                                <p className='mx-3 mt-5'>{t('i_accept_{terms_and_condition}', { terms_and_condition: t('terms_and_condition') })}</p>
                            </div>
                        </Row>
                    </form>
                    : <Row>
                        <p>
                            {!user?.id ? (<>

                                {t('QUICK_APPLY_MESSAGE_{JOB}_{COMPANY}', { JOB: job.title, COMPANY: job.company.name })}
                                <Link href={`/form/digitalhiringapp/quick-apply/${applicant.uuid_token}`} >{t('COMPLETE_APPLICATION')}</Link>
                            </>
                            ) : t("job_applied_success_message")}

                        </p>
                    </Row>
                }
            </ViewModal >
        </>
    )
}
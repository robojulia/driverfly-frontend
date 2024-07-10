import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import EntityForm from "../../layouts/page/entity-form";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

import ApplicantApi from "../../../pages/api/applicant";
import JobApi from "../../../pages/api/job";

import { ApplicantEmployerEntity } from "../../../models/applicant/applicant-employer.entity";
import { ApplicantJobEntity } from "../../../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { JobEntity } from "../../../models/job/job.entity";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { Status } from "../../../enums/status.enum";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { HireApplicantDto } from "../../../models/applicant/hire-applicant.dto";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { UserEntity } from "../../../models/user/user.entity";
import EmployeeApi from "../../../pages/api/employee";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import UserApi from "../../../pages/api/user";
import { focusOnErrorField } from "../../../utils/form-error";
import ViewModal from "../../view-details/view-modal";
import { ReferralSourceForm } from "../admin/referral-source-form";
import { ApplicantBasicDetails } from "./applicant-basic-details-form";
import { JobForm } from "./job-form";
import { HireApplicantForm } from "./hire-applicant-form";
import React from "react";

export interface EditApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function EditApplicantForm(props: EditApplicantFormProps) {
	let { className, entity } = props;
	let { user } = useAuth();
	const { t } = useTranslation();
	const router = useRouter();
	const current_date = new Date();

	const applicantApi = new ApplicantApi();
	const referralSourceApi = new ReferralSourceApi();

	const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);
	const [referralSources, setReferralSources] = useState<
		ReferralSourceEntity[]
	>([]);
	const [curentCompanyCheck, setCurentCompanyCheck] = useState<ApplicantEmployerEntity>();
	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [jobHired, setJobHired] = useState<ApplicantJobEntity>(null);
	const [createJob, setCreateJob] = useState<boolean>(false);
	const [canCreateReferral, setCanCreateReferral] = useState<boolean>();
	const [createReferral, setCreateReferral] = useState<boolean>(false);
	const [hasCriminalHistory, setHasCriminalHistory] = useState<boolean>();

	const form = useFormik({
		initialValues: new ApplicantEntity(),
		validationSchema: ApplicantEntity.yupSchemaForApplicantForm(),
		onSubmit: async (values) => {
			values.extras = values.extras?.filter(
				(v) => v.value != undefined || v.value != null
			);
			const jobs = values.jobs || [];
			if ("jobs" in values) delete values.jobs;
			if (values.accident_count === undefined) {
				values.accident_count = 0
			}

			if (values.moving_violations_count === undefined) {
				values.moving_violations_count = 0
			}

			try {
				if (entity?.id) {
					values = await applicantApi.update(entity.id, {
						...values,
						documents: [
							...values.documents,
							...entity.documents?.filter(
								(v) =>
									!Object.values(ApplicantDocumentType).includes(
										v.type as ApplicantDocumentType
									)
							),
						]?.filter((v) => !!v),
					} as ApplicantEntity);
				} else {

					values = await applicantApi.create(values);
				}

				for (let i = 0; i < entity?.jobs?.length; i++) {
					let job = entity?.jobs[i];

					if (!jobs.some((v) => v.job?.id == job.job.id)) {
						await applicantApi.jobs.remove(values.id, job.job.id);
					}
				}

				for (let i = 0; i < jobs.length; i++) {
					let job = jobs[i];

					if (job.id) {
						await applicantApi.jobs.update(values.id, job.job.id, job);
					} else {
						await applicantApi.jobs.create(values.id, job.job.id, job);
					}
				}

				formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
				// if (onSaveComplete) onSaveComplete(values);
			} catch (e) {
				console.error("Unable to save applicant info", e);
				if (
					!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
				)
					formFailed(t, entity?.id ? "update" : "create", "APPLICANT");

				// if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffectAsync(async () => {
		const api = new JobApi();
		const jobs = await api.list();
		setJobs(jobs);
	}, [user]);





	useEffectAsync(async () => {
		// console.log("entity", entity);
		setCanCreateReferral(!!!entity?.referralSource?.id && !!user?.company_admin)
		let extras: ApplicantExtrasEntity[] = entity?.extras || [];

		extras = extras.filter(Boolean);
		if (!extras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME))
			extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.BUSINESS_NAME,
			});
		if (!extras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER))
			extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.DOT_NUMBER,
			});
		if (!extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER))
			extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.CDL_NUMBER,
			});

		if (!!entity?.id) {
			setHasCriminalHistory(!!entity.criminal_history)
			form.setValues(
				{
					...entity,
					documents: entity?.documents?.filter((v) =>
						Object.values(ApplicantDocumentType).includes(
							v.type as ApplicantDocumentType
						)
					),
					extras,
				});
		} else {
			await form.setValues(
				{
					...new ApplicantEntity(),
					type: ApplicantType.COMPANY,
					extras
					// extras: extras.map(({ id, type, value }) => ({ ...new ApplicantExtrasEntity(type, id), value })),
				});
		}

	}, [entity]);

	useEffect(() => {
		setJobHired(
			form.values?.jobs?.find((j) => j?.status?.startsWith("COMPLETED")) ?? null
		);
	}, [form.values?.jobs]);

	const routeToEmployees = () =>
		router.push("/dashboard/company/compliance/employee-directory");

	const hireApplicantForm = useFormik({
		initialValues: new HireApplicantDto(),
		validationSchema: HireApplicantDto.yupSchema(),
		validateOnMount: false,
		onSubmit: async (values, { resetForm }) => {
			try {
				const employeeApi = new EmployeeApi();
				await employeeApi.hire(values);
				resetForm();
				toast.success(t("STATUS_UPDATED_SUCCESSFULLY"))
				setTimeout(() => {
					routeToEmployees();
				}, 1000);
			} catch (e) {
				globalAjaxExceptionHandler(e, {
					formik: hireApplicantForm,
					t: t,
					toast: toast,
				});
			}
		},
	});

	const onJobAdded = (job: JobEntity) => {
		setJobs([...jobs, job]);
		setCreateJob(false);
	};

	useEffectAsync(async () => {
		const userApi = new UserApi();
		const data = await userApi.list();
		setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
	}, []);


	useEffect(() => {
		const currentCompanyExists = form.values?.employers?.find((e) => e.is_current);
		setCurentCompanyCheck(currentCompanyExists)
	}, [form.values])


	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);

	useEffect(() => focusOnErrorField(form), [form.submitCount])

	return (
		// <EntityForm
		// 	id={entity?.id}
		// 	hideActionButton={true}
		// 	className={className}
		// 	actions={[
		// 		{
		// 			label: "HIRE",
		// 			className: "btn theme-primary-btn",
		// 			hide: !Boolean(form.values?.id) || Boolean(entity?.is_hired),
		// 			disabled: form.isSubmitting,
		// 			onClick: () =>
		// 				hireApplicantForm.setValues({ applicantId: entity?.id }),
		// 		},
		// 	]}
		// >
		<React.Fragment>
			<HireApplicantForm props={props} />
			<ApplicantBasicDetails props={props} />
		</React.Fragment>


		// 	<ViewModal
		// 		title={t("HIRE")}
		// 		show={Boolean(hireApplicantForm.values?.applicantId)}
		// 		onCloseClick={() => hireApplicantForm.resetForm()}
		// 		size="sm"
		// 	>
		// 		<EntityForm
		// 			onSubmit={hireApplicantForm.handleSubmit}
		// 			formik={hireApplicantForm}
		// 			canSubmit={hireApplicantForm.isValid}
		// 			submitLabel="HIRE"
		// 		>
		// 			<Row className="py-3 px-5">
		// 				<Col>
		// 					<BaseSelect
		// 						name={`jobId`}
		// 						readOnly={Boolean(entity?.is_hired)}
		// 						required
		// 						placeholder={t(
		// 							"SELECT_{name}",
		// 							{ name: "JOB" },
		// 							{ translateProps: true }
		// 						)}
		// 						options={jobs}
		// 						labelKey="title"
		// 						label="JOB"
		// 						valueKey="id"
		// 						formik={hireApplicantForm}
		// 					/>
		// 					<button
		// 						disabled={Boolean(entity?.is_hired)}
		// 						type="button"
		// 						onClick={() => setCreateJob(true)}
		// 						className="my-2 btn btn-link"
		// 					>
		// 						{t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
		// 					</button>
		// 				</Col>
		// 			</Row>
		// 		</EntityForm>
		// 	</ViewModal>
		// 	<ViewModal
		// 		title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
		// 		show={createJob}
		// 		onCloseClick={() => setCreateJob(false)}
		// 	>
		// 		<JobForm onSaveComplete={onJobAdded} />
		// 	</ViewModal>
		// </EntityForm>
	);
}

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
	ChevronUp,
	DashCircle,
	PlusCircle,
	XCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import EntityForm from "../../layouts/page/entity-form";
import ViewCard from "../../view-details/view-card";
import BaseCheck from "../base-check";
import BaseCheckList from "../base-check-list";
import BaseInput from "../base-input";
import BaseInputPhone from "../base-input-phone";
import BaseSelect from "../base-select";
import BaseTextArea from "../base-text-area";
import FileInput from "../file-input";
import StateSelect from "../state-select";
import { BaseFormProps } from "./base-form-props";

import ApplicantApi from "../../../pages/api/applicant";
import JobApi from "../../../pages/api/job";

import { ApplicantEmployerEntity } from "../../../models/applicant/applicant-employer.entity";
import { ApplicantEquipmentEntity } from "../../../models/applicant/applicant-equipment.entity";
import { ApplicantExperienceEntity } from "../../../models/applicant/applicant-experience.entity";
import { ApplicantJobEntity } from "../../../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { DocumentEntity } from "../../../models/documents/document.entity";
import { JobEntity } from "../../../models/job/job.entity";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../enums/jobs/job-schedule.enum";
import { Status } from "../../../enums/status.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantAccidentEntity } from "../../../models/applicant/applicant-accidentr.entity";
import { ApplicantMovingViolationEntity } from "../../../models/applicant/applicant-moving-violation.entity";
import { HireApplicantDto } from "../../../models/applicant/hire-applicant.dto";
import { CdlExtras } from "../../../models/jot-form/long-form/cdl-object/index.dto";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { UserEntity } from "../../../models/user/user.entity";
import EmployeeApi from "../../../pages/api/employee";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import UserApi from "../../../pages/api/user";
import { buildReferral } from "../../../utils/common";
import { focusOnErrorField } from "../../../utils/form-error";
import ViewSuggestedJobs from "../../applicants/view-suggested-jobs";
import ViewModal from "../../view-details/view-modal";
import { ReferralSourceForm } from "../admin/referral-source-form";
import { JobForm } from "./job-form";
import ShowFormattedDate from "../../jobs/show-formatted-date";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantForm(props: ApplicantFormProps) {
	let { className, entity, onSaveComplete, onSaveError } = props;
	let { user, isSuperAdmin, isCompanyAdmin, company } = useAuth();
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
			console.log("submitted ", values);

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

			if (values.all_violations_count === undefined) {
				values.all_violations_count = 0
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
				if (onSaveComplete) onSaveComplete(values);
			} catch (e) {
				console.error("Unable to save applicant info", e);
				if (
					!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
				)
					formFailed(t, entity?.id ? "update" : "create", "APPLICANT");

				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffectAsync(async () => {
		// setProtectedFields({
		// 	license_number: hasPermission("CanViewApplicant.license_number"),
		// 	social_security_number: hasPermission(
		// 		"CanViewApplicant.social_security_number"
		// 	),
		// });

		const api = new JobApi();
		const jobs = await api.list();

		setJobs(jobs);

		const ref_list = await referralSourceApi.list();
		setReferralSources(ref_list);
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
				// formSuccess(t, "STATUS_UPDATED_SUCCESSFULLY", "STATUS");
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

	const onReferralAdded = (referral: ReferralSourceEntity) => {
		form.setFieldValue(`referralSource.id`, referral.id);
		setReferralSources([...referralSources, referral]);
		setCreateReferral(false);
	};

	useEffectAsync(async () => {
		const userApi = new UserApi();
		const data = await userApi.list();
		setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
	}, []);

	const currentCompanyCheckBox = (employerId) => {
		return curentCompanyCheck?.is_current ? (Boolean(employerId?.id !== curentCompanyCheck?.id)) : false
	}

	useEffect(() => {
		const currentCompanyExists = form.values?.employers?.find((e) => e.is_current);
		setCurentCompanyCheck(currentCompanyExists)
		form?.values?.employers?.forEach(employer => {
			if (employer?.is_current) {
				employer.end_at = null;
			}
		});
	}, [form.values])

	const today = new Date();
	const OldThan18Year = new Date(
		today.getFullYear() - 18,
		today.getMonth(),
		today.getDate()
	)
		.toLocaleString("en-US", { timeZone: "America/New_York" })
		.split("T")[0];

	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);



	useEffect(() => focusOnErrorField(form), [form.submitCount])

	return (
		<EntityForm
			id={entity?.id}
			formik={form}
			onSubmit={form.handleSubmit}
			forbidSubmit={Boolean(entity?.is_hired)}
			className={className}
			actions={[
				{
					label: "HIRE",
					className: "btn theme-primary-btn",
					hide: !Boolean(form.values?.id) || Boolean(entity?.is_hired),
					disabled: form.isSubmitting,
					onClick: () =>
						hireApplicantForm.setValues({ applicantId: entity?.id }),
				},
			]}
		>
			<Row>
				<Col className="p-0 px-lg-2 mt-3">
					<ViewCard title="BASIC_DETAILS">
						<Row className="mb-2">
							<Col md="4" className="px-2">
								<BaseSelect
									className="col-12 my-2"
									readOnly={
										Boolean(isSuperAdmin) ||
										Boolean(isCompanyAdmin) ||
										Boolean(entity?.is_hired)
									}
									label="ASSIGNED_RECRUITER"
									name="assignedUserId"
									displayPlaceholder
									options={companyUsers}
									valueKey="id"
									createLabel={(c) => `${c.name} (#${c.id}) `}
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="FIRST_NAME"
									required
									name="first_name"
									placeholder="ENTER_FIRST_NAME"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="LAST_NAME"
									required
									name="last_name"
									placeholder="ENTER_LAST_NAME"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="BIRTHDATE"
									type="date"
									name="birthdate"
									placeholder="MM/DD/YYYY"
									formik={form}
									max={OldThan18Year}
								/>
								<BaseInputPhone
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="PHONE"
									name="phone"
									required
									placeholder="ENTER_PHONE"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="EMAIL"
									type="email"
									name="email"
									placeholder="ENTER_EMAIL"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="ADDRESS_LINE_1"
									name="address_1"
									placeholder="ENTER_ADDRESS_LINE1"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="ADDRESS_LINE_2"
									name="address_2"
									placeholder="ENTER_ADDRESS_LINE2"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="CITY"
									name="city"
									placeholder="ENTER_CITY"
									formik={form}
								/>
								<Row className="px-3">
									<StateSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="STATE"
										name="state"
										placeholder="SELECT_STATE"
										formik={form}
									/>
									<BaseInput
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="ZIP_CODE"
										name="zip_code"
										placeholder="ENTER_ZIP_CODE"
										formik={form}
									/>
									<BaseCheck
										readOnly
										className="col-12 my-2"
										disabled
										label="AUTOMATED_RECRUITING_LEAD"
										name={`is_automated_recruiting_lead`}
										formik={form}
									/>
									<BaseSelect
										readOnly={Boolean(entity?.is_hired)}
										className="col-12 p-0 px-lg-2"
										label="LEAD_TYPE"
										name="type"
										formik={form}
										displayPlaceholder
										enumType={ApplicantType}
										labelPrefix="ApplicantType"
									/>
									<BaseSelect
										readOnly={Boolean(entity?.is_hired)}
										className="col-12 p-0 px-lg-2"
										label="REFERRAL_SOURCE"
										name="referralSource.id"
										displayPlaceholder
										formik={form}
										placeholder="SELECT_REFERREL_SOURCE"
										valueKey="id"
										createLabel={(v) => buildReferral(v)}
										options={(!!referralSources?.length) ? referralSources.filter(v => v.status == Status.ACTIVE || v.id == entity?.referralSource?.id) : referralSources}
										append={
											!entity?.is_hired &&
											<Button
												variant="btn create_btn"
												onClick={() => setCreateReferral(true)}
											>
												<PlusCircle /> {t("CREATE")}
											</Button>
										}
									/>
								</Row>
							</Col>
							<Col md="4" className="px-2">
								<BaseInput
									readOnly={Boolean(entity?.is_hired)}
									className="col-12"
									label="driver's_license_number"
									name="license_number"
									placeholder="ENTER_DRIVER_LICENSE"
									formik={form}
								/>
								<Row className="px-3">
									<BaseInput
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="expiration_date"
										name="license_expiry"
										min={
											new Date(
												current_date.getFullYear(),
												current_date.getMonth() + 6,
												current_date.getDate()
											)
												.toLocaleString("en-US", {
													timeZone: "America/New_York",
												})
												.split("T")[0]
										}
										type="date"
										placeholder="expiration_date"
										formik={form}
									/>
									<StateSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="state_issued"
										name="license_state"
										placeholder="SELECT_ISSUE_STATE"
										formik={form}
									/>
								</Row>
								<Row className="">
									{form.values?.extras
										?.find((v) => v.type == ApplicantExtras.CDL_NUMBER)
										?.value?.map((entity, i) => (
											<div key={i} className={`my-1`}>
												<div className="Row horizontalRow"></div>
												<div className=" d-flex justify-content-start align-items-end">
													<BaseInput
														name={`extras[${form.values?.extras?.findIndex(
															(v) => v.type == ApplicantExtras.CDL_NUMBER
														)}].value[${i}].license_number`}
														className="col-11"
														placeholder="ENTER_ADDITIONAL_LICENSE"
														label="ADDTIONAL_LICENSE_NUMBER"
														required
														formik={form}
														readOnly={Boolean(entity?.is_hired)}
													/>
													<div>
														<a
															href="#"
															onClick={() => {
																const extras = form.values?.extras || [];
																form.setValues({
																	...form.values,
																	extras: extras?.map((item) =>
																		item.type == ApplicantExtras.CDL_NUMBER ?
																			{
																				...item,
																				value: [
																					...item?.value?.filter((val, index) => index !== i)
																				]
																			}
																			: item

																	)
																})
															}
															}
														>
															<DashCircle color="red" />
														</a>
													</div>

												</div>
												<Row className="px-3">
													<BaseInput
														readOnly={Boolean(entity?.is_hired)}
														className="col-6"
														type="date"
														name={`extras[${form.values?.extras?.findIndex(
															(v) => v.type == ApplicantExtras.CDL_NUMBER
														)}].value[${i}].date`}
														placeholder="expiration_date"
														label="expiration_date"
														required
														formik={form}
													/>
													<StateSelect
														readOnly={Boolean(entity?.is_hired)}
														className="col-6"
														name={`extras[${form.values?.extras?.findIndex(
															(v) => v.type == ApplicantExtras.CDL_NUMBER
														)}].value[${i}].state`}
														placeholder="SELECT_ISSUE_STATE"
														label="state_issued"
														required
														formik={form}
													/>
												</Row>
												{/* <Button
														className="rounded-lg"
														variant="outline-danger close_btn w-25 mx-auto my-2"
														onClick={() =>
															form.setValues({
																...form.values,
																extras: [...form.values?.extras?.map((item) => {
																	if (item.type == ApplicantExtras.CDL_NUMBER) {
																		return {
																			...item,
																			value: item.value?.filter(
																				(v, idx) => i != idx
																			),
																		};
																	}
																	return item;
																})]

																// ...form.values?.extras.find(v => v.type == ApplicantExtras.CDL_NUMBER).value,
																// value: form.values?.extras?.find(v => v.type == ApplicantExtras.CDL_NUMBER)?.value?.filter(
																//     (v, idx) => i != idx
																// ),
																// }
															})
														}
													>
														<DashCircle /></Button> */}

											</div>
										))}
									{
										!Boolean(entity?.is_hired) &&
										<Row className="my-3 px-4">
											<Button
												className="ml-3 float-end"
												size="sm"
												onClick={() => {
													const extras = form.values?.extras || [];
													form.setValues({
														...form.values,
														extras: extras?.map((item) =>
															item.type == ApplicantExtras.CDL_NUMBER
																? {
																	...item,
																	value: [
																		...(item.value || []),
																		new CdlExtras(),
																	],
																}
																: item
														),
													});
												}}
											>
												<PlusCircle /> {t("ADD_ANOTHER_LICENSE")}
											</Button>
										</Row>
									}
								</Row>

								<div className="Row horizontalRow"></div>
								<Row className="px-3">
									<BaseSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										required={Boolean(form.values?.license_number)}
										label="CDL_TYPE"
										name="license_type"
										displayPlaceholder
										placeholder="SELECT_CDL_TYPE"
										labelPrefix="DriverLicenseType"
										enumType={DriverLicenseType}
										formik={form}
									/>
									<BaseInput
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="years_cdl_experience"
										name="years_cdl_experience"
										type="number"
										placeholder="ENTER_YEARS_OF_CDL"
										formik={form}
									/>
								</Row>
								<BaseCheck
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="OWNER_OPERATOR"
									name="is_owner_operator"
									formik={form}
								/>
								{Boolean(form.values.is_owner_operator) && (
									<>
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-12"
											label="BUSINESS_NAME"
											name={`extras[${form.values?.extras?.findIndex(
												(v) => v.type == ApplicantExtras.BUSINESS_NAME
											)}].value`}
											formik={form}
										/>
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-12"
											name={`extras[${form.values?.extras?.findIndex(
												(v) => v.type == ApplicantExtras.DOT_NUMBER
											)}].value`}
											label="DOT_NUMBER"
											formik={form}
										/>
									</>
								)}
								<BaseCheck
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="AUTHORIZED_TO_WORK_IN_THE_US"
									name="authorized_to_work_in_us"
									formik={form}
								/>
								<BaseCheckList
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="PREFERRED_LOCATION"
									name="preferred_location"
									formik={form}
									labelPrefix="JobGeography"
									enumType={JobGeography}
								/>
								<BaseCheckList
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="ROUTE_TYPE"
									name={`routes`}
									formik={form}
									labelPrefix="JobSchedule"
									enumType={JobSchedule}
								/>

								{form.values?.id && (
									<BaseSelect
										className="col-12 mt-2"
										readOnly={Boolean(entity?.is_hired)}
										name={`current_application_status`}
										required
										placeholder="APPLICANT_CURRENT_STATUS"
										label="APPLICANT_CURRENT_STATUS"
										labelPrefix="ApplicantStatus"
										enumType={ApplicantStatus}
										formik={form}
									/>
								)}
								{form.values?.current_application_status && (
									<div className="col-12 mt-2">
										<label>{t("REMARKS")}</label>
										<BaseTextArea
											readOnly={Boolean(entity?.is_hired)}
											name="remarks"
											placeholder="Add a remark"
											formik={form}
										/>
									</div>
								)}
							</Col>
							<Col md="4" className="px-2">
								<BaseCheckList
									className="col-12"
									disabled={Boolean(entity?.is_hired)}
									label="TRANSMISSION_EXPERIENCE"
									name="transmission_type"
									labelPrefix="VehicleTransmissionType"
									enumType={VehicleTransmissionType}
									formik={form}
									cols="2"
								/>
								<BaseCheckList
									className="col-12"
									disabled={Boolean(entity?.is_hired)}
									label="ENDORSEMENTS"
									name="endorsements"
									labelPrefix="DriverEndorsement"
									enumType={DriverEndorsement}
									formik={form}
									cols="2"
								/>
								{form.values?.endorsements?.includes(
									DriverEndorsement.OTHER
								) && (
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-12"
											label="OTHER_ENDORSEMENTS"
											required
											name="endorsements_other"
											displayPlaceholder
											formik={form}
										/>
									)}
								<BaseSelect
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="HIGHEST_DEGREE"
									name="highest_degree"
									placeholder="SELECT_HIGHEST_DEGREE"
									formik={form}
									labelPrefix="EducationLevel"
									enumType={EducationLevel}
								/>
								<BaseCheckList
									disabled={Boolean(entity?.is_hired)}
									className="col-12 p-1 "
									label="License_Restrictions"
									name="license_restrictions"
									labelPrefix="LicenseRestrictions"
									enumType={LicenseRestrictions}
									formik={form}
									cols="2"
								/>
								{form.values?.license_restrictions?.includes(
									LicenseRestrictions.OTHER
								) && (
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-12"
											label="OTHER_LICENSE_RESTRICTIONS"
											required
											name="license_restrictions_other"
											displayPlaceholder
											formik={form}
										/>
									)}

								<Col xs="12" className="mt-2">
									<ViewCard title="EMERGENCY_CONTACT">
										<BaseInput
											className="col-12"
											readOnly={Boolean(entity?.is_hired)}
											name={`emergency_contact_name`}
											label="NAME"
											placeholder="ENTER_EMERGENCY_CONTACT"
											formik={form}
										/>

										<BaseInputPhone
											className="col-12"
											readOnly={Boolean(entity?.is_hired)}
											name={`emergency_contact_number`}
											label="PHONE"
											placeholder="PHONE"
											formik={form}
										/>
										<BaseInput
											className="col-12"
											readOnly={Boolean(entity?.is_hired)}
											name={`emergency_contact_relationship`}
											label="RELATIONSHIP"
											placeholder="ENTER_EMERGENCY_CONTACT_RELATIONSHIP"
											formik={form}
										/>
									</ViewCard>
								</Col>
							</Col>
						</Row>
					</ViewCard>
				</Col>
			</Row>
			{Boolean(entity?.id) && (
				<Row className="mt-2">
					<ViewSuggestedJobs applicant={entity} />
				</Row>
			)}
			<Row>
				<Col md="6" className="p-2 mt-2">
					<ViewCard
						title="equipment_experience"
						actions={
							<Button
								disabled={Boolean(entity?.is_hired)}
								size="sm"
								onClick={() =>
									form.setValues({
										...form.values,
										equipment_experience: [
											...(form.values?.equipment_experience || []),
											new ApplicantExperienceEntity(),
										],
									})
								}
							>
								<PlusCircle /> {t("ADD")}
							</Button>
						}
					>
						{form.values?.equipment_experience?.length > 0 && (
							<>
								{form.values?.equipment_experience?.map((entity, i) => (
									<Row key={i}>
										<div className="col-md-6 mt-2">
											<Col className="p-0  ">
												<strong>{t("TYPE")}</strong>
												<span className="p-0 text-danger">*</span>
											</Col>
											<BaseSelect
												readOnly={Boolean(props?.entity?.is_hired)}
												name={`equipment_experience[${i}].type`}
												placeholder="SELECT_EQUIPMENT_TYPE"
												required
												labelPrefix="JobEquipmentType"
												enumType={JobEquipmentType}
												formik={form}
												onChange={({ target: { value } }) => {
													form.setFieldValue(`equipment_experience[${i}].type`, value)
													if (value == JobEquipmentType.OTHER) {
														form.setFieldValue(`equipment_experience[${i}].type_other`, t(`JobEquipmentType.OTHER`))
													} else {
														form.setFieldValue(`equipment_experience[${i}].type_other`, (``))
													}
												}}
											/>
										</div>
										<div className="col-md-5 mt-2">
											<Col className="p-0">
												<strong>{t("YEARS")}</strong>
											</Col>
											<BaseInput
												readOnly={Boolean(props?.entity?.is_hired)}
												name={`equipment_experience[${i}].years`}
												placeholder="ENTER_YEARS_OF_EXPERIENCE"
												type="int"
												min="1"
												formik={form}
											/>
										</div>
										<div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
											<Col className="mt-4"></Col>
											<a
												href="#"
												onClick={() =>
													form.setValues({
														...form.values,
														equipment_experience:
															form.values?.equipment_experience?.filter(
																(v, idx) => i != idx
															),
													})
												}
											>
												<DashCircle color="red" />
											</a>
										</div>
										{entity.type == JobEquipmentType.OTHER && (
											<Col md="11">
												<BaseInput
													readOnly={Boolean(props?.entity?.is_hired)}
													className="my-2"
													name={`equipment_experience[${i}].type_other`}
													placeholder="TYPE"
													formik={form}
												/>
											</Col>
										)}
										<div className="12">
											<hr />
										</div>
									</Row>
								))}
							</>
						)}
					</ViewCard>
				</Col>
				<Col md="6" className="p-2 mt-2">
					{form.values?.is_owner_operator && (
						<ViewCard
							title="EQUIPMENT_OWNED"
							actions={
								<Button
									disabled={Boolean(entity?.is_hired)}
									size="sm"
									onClick={() =>
										form.setValues({
											...form.values,
											equipment_owned: [
												...form.values?.equipment_owned,
												new ApplicantEquipmentEntity(),
											],
										})
									}
								>
									<PlusCircle /> {t("ADD")}
								</Button>
							}
						>
							{form.values?.equipment_owned?.length > 0 && (
								<>
									<Row className="d-sm-none d-md-flex">
										<Col>
											<strong>{t("TYPE")}</strong>
											<span className="p-0 text-danger">*</span>
										</Col>
										<Col>
											<strong>{t("QUANTITY")}</strong>
											<span className="p-0 text-danger">*</span>
										</Col>
									</Row>
									{form.values?.equipment_owned?.map((entity, i) => (
										<Row key={i}>
											<Col xs="12" className="d-sm-flex d-md-none">
												<Col>
													<strong>{t("TYPE")}</strong>
												</Col>
												<Col>
													<strong>{t("QUANTITY")}</strong>
												</Col>
											</Col>
											<Col xs="6">
												<BaseSelect
													readOnly={Boolean(props?.entity?.is_hired)}
													name={`equipment_owned[${i}].type`}
													placeholder="TYPE"
													labelPrefix="JobEquipmentType"
													enumType={JobEquipmentType}
													formik={form}
												/>
											</Col>
											<Col xs="5">
												<BaseInput
													readOnly={Boolean(props?.entity?.is_hired)}
													name={`equipment_owned[${i}].quantity`}
													placeholder="QUANTITY"
													type="int"
													min="1"
													required
													formik={form}
												/>
											</Col>
											<Col xs="1">
												<a
													href="#"
													onClick={() =>
														form.setValues({
															...form.values,
															equipment_owned:
																form.values?.equipment_owned?.filter(
																	(v, idx) => i != idx
																),
														})
													}
												>
													<DashCircle color="red" />
												</a>
											</Col>
											{entity.type == JobEquipmentType.OTHER && (
												<Col xs="11" className="mt-3">
													<BaseInput
														readOnly={Boolean(props?.entity?.is_hired)}
														name={`equipment_owned[${i}].type_other`}
														placeholder="TYPE"
														formik={form}
														required
													/>
												</Col>
											)}
											<Col xs="12">
												<hr />
											</Col>
										</Row>
									))}
								</>
							)}
						</ViewCard>
					)}
				</Col>
			</Row>
			<Row>
				<Col md="6" className="p-0 px-lg-2">
					<ViewCard
						title="WORK_HISTORY"
						actions={
							<Button
								disabled={Boolean(entity?.is_hired)}
								size="sm"
								onClick={() =>
									form.setValues({
										...form.values,
										employers: [
											new ApplicantEmployerEntity(),
											...(form.values?.employers || []),
										],
									})
								}
							>
								<PlusCircle /> {t("ADD")}
							</Button>
						}
					>
						{!form.values?.employers?.length && <>{t("NONE")}</>}
						{form.values?.employers?.length > 0 && (
							<>
								{form.values?.employers?.map((e, i) => {
									const meta = form.getFieldMeta(`employers[${i}]`);
									const hasError = Object.keys(e || {}).some(
										(v) => form.getFieldMeta(`employers[${i}].${v}`).error
									);
									return (
										<Accordion
											key={i}
											defaultExpanded={i == 0 || !meta.touched || hasError}
											expanded={hasError || undefined}
										>
											<AccordionSummary expandIcon={<ChevronUp />}>
												<Button
													disabled={Boolean(entity?.is_hired)}
													type="button"
													size="sm"
													variant="danger"
													onClick={(v) =>
														form.setValues({
															...form.values,
															employers: form.values?.employers?.filter(
																(v, idx) => idx != i
															),
														})
													}
												>
													<XCircle /> {t("REMOVE")}
												</Button>
												<span style={{ marginLeft: "10px" }}>
													{e.name || t("NEW_EMPLOYER")}
												</span>
											</AccordionSummary>
											<AccordionDetails>
												<Row>
													<BaseInput
														readOnly={Boolean(entity?.is_hired)}
														className="col-12 mt-2"
														name={`employers[${i}].name`}
														label="NAME"
														required
														placeholder="ENTER_COMPANY_NAME"
														formik={form}
													/>
													<BaseInput
														className="col-12 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														label="EMAIL"
														type="email"
														name={`employers[${i}].email`}
														placeholder="ENTER_EMAIL"
														formik={form}
													/>
													<BaseInput
														readOnly={Boolean(entity?.is_hired)}
														className="col-6 mt-2"
														name={`employers[${i}].start_at`}
														label="DATES_EMPLOYED"
														type="date"
														max={new Date().toISOString().split("T")[0]}
														formik={form}
													/>
													{
														((curentCompanyCheck?.id != form.values?.employers[i]?.id) || !form.values?.employers[i]?.is_current) && <BaseInput
															className="col-6 mt-2"
															readOnly={Boolean(entity?.is_hired)}
															required
															name={`employers[${i}].end_at`}
															label="THROUGH"
															type="date"
															formik={form}
														/>
													}
													<BaseInput
														className="col-12 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].title`}
														label="TITLE"
														placeholder="ENTER_JOB_TITLE"
														formik={form}
													/>
													<BaseInput
														className="col-md-6 mt-2"
														name={`employers[${i}].manager_name`}
														required
														label="MANAGER_OR_REPRESENTATIVE"
														placeholder="ENTER_MANAGER"
														formik={form}
													/>
													<BaseInput
														className="col-6 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].city`}
														label="CITY"
														placeholder="ENTER_CITY"
														formik={form}
													/>
													<StateSelect
														className="col-6 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].state`}
														label="STATE"
														placeholder="SELECT_STATE"
														formik={form}
													/>
													<BaseInput
														className="col-6 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].zip_code`}
														label="ZIP_CODE"
														placeholder="ENTER_ZIP_CODE"
														formik={form}
													/>
													<BaseInput
														className="col-md-6 mt-2"
														required
														name={`employers[${i}].address`}
														placeholder="ENTER_ADDRESS_LINE1"
														label="ADDRESS_LINE_1"
														formik={form}
													/>
													<BaseInput
														className="col-md-6 mt-2"
														name={`employers[${i}].address_2`}
														placeholder="ENTER_ADDRESS_LINE2"
														label="ADDRESS_LINE_2"
														formik={form}
													/>
													<BaseInputPhone
														className="col-12 mt-2"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].phone`}
														label="PHONE"
														placeholder="ENTER_PHONE"
														formik={form}
													/>
													{
														(!form.values.employers?.some(v => v.is_current) || form.values.employers?.indexOf(form.values.employers?.find(v => v.is_current)) == i) &&
														<BaseCheck
															className="col-12 mt-2"
															disabled={currentCompanyCheckBox(form.values?.employers[i])}
															name={`employers[${i}].is_current`}
															label="CURRENT_COMPANY"
															formik={form}
														/>
													}
													<BaseCheck
														className="col-12 mt-2"
														disabled={Boolean(entity?.is_hired)}
														name={`employers[${i}].can_contact`}
														label="MAY_CONTACT_COMPANY"
														formik={form}
													/>
													<BaseCheck
														className="col-12 mt-2"
														disabled={Boolean(entity?.is_hired)}
														name={`employers[${i}].is_subject_to_fmcsrs`}
														label="SUBJECT_TO_FMCSRS"
														formik={form}
													/>
													<BaseCheck
														className="col-12 mt-2"
														disabled={Boolean(entity?.is_hired)}
														name={`employers[${i}].is_subject_to_drug_tests`}
														label="JOB_DESIGNATED_AS_SATEFY_SENSITIVE"
														formik={form}
													/>
												</Row>
											</AccordionDetails>
										</Accordion>
									);
								})}
							</>
						)}
					</ViewCard>
				</Col>
				<Col md="6" className="p-0 px-lg-2">
					<ViewCard title="ALREADY_WORKED_TO_COMPANY">
						<Row>
							<Col>
								<BaseCheck
									disabled={Boolean(entity?.is_hired)}
									className="my-3 col float-left p-0"
									name={`already_applied_to_company`}
									label="APPLIED_HERE_BEFORE"
									onChange={({ target: { value } }) => {
										form.setFieldValue(
											`already_applied_to_company`,
											value
										);
										if (!value) {
											form.setFieldValue(`already_worked_to_company`, false);
											form.setFieldValue(`already_worked_start_date`, null);
											form.setFieldValue(`already_worked_end_date`, null);
										};
									}}
									formik={form}
								/>
							</Col>
						</Row>

						{Boolean(form.values?.already_applied_to_company) && (
							<>
								<Row>
									<Col>
										<BaseCheck
											formik={form}
											disabled={Boolean(entity?.is_hired)}
											className="my-3 col float-left p-0"
											name="already_worked_to_company"
											label="WORKED_HERE_BEFORE"
											onChange={({ target: { value } }) => {
												form.setFieldValue(`already_worked_to_company`, value);
												if (!value) {
													form.setFieldValue(`already_worked_start_date`, null);
													form.setFieldValue(`already_worked_end_date`, null);
												}
											}}
										/>
									</Col>
								</Row>
								{form.values.already_worked_to_company && (
									<Row>
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-md-6 my-3 font-weight-bold"
											type="date"
											name={`already_worked_start_date`}
											placeholder="DATE"
											label="FROM"
											max={
												new Date(
													new Date().getFullYear(),
													new Date().getMonth(),
													new Date().getDate()
												)
													.toISOString()
													.split("T")[0]
											}
											formik={form}
										/>
										<BaseInput
											readOnly={Boolean(entity?.is_hired)}
											className="col-md-6 my-3 font-weight-bold"
											type="date"
											name={`already_worked_end_date`}
											placeholder="DATE"
											label="TO"
											max={
												new Date(
													new Date().getFullYear(),
													new Date().getMonth(),
													new Date().getDate()
												)
													.toISOString()
													.split("T")[0]
											}
											formik={form}
										/>
									</Row>
								)}
							</>
						)}
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col md="12" className="p-0 px-lg-2">
					<ViewCard title="SAFETY_BACKGROUND">
						<Row>
							<Col md="6">
								<BaseCheck
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="CAN_PASS_DRUG_TEST"
									name="can_pass_drug_test"
									formik={form}
								/>
								<BaseCheck
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="HAS_DUIS"
									name="has_past_dui"
									formik={form}
								/>
								{form.values?.has_past_dui && (
									<Col xs="12" className="mt-2">
										<ViewCard
											title="PAST_DUIS"
											actions={
												<Button
													disabled={Boolean(entity?.is_hired)}
													size="sm"
													onClick={() =>
														form.setValues({
															...form.values,
															dui_years: [...(form.values?.dui_years || []), ""],
														})
													}
												>
													<PlusCircle /> {t("ADD")}
												</Button>
											}
										>
											{form.values?.dui_years?.length > 0 && (
												<Table striped>
													<thead>
														<tr>
															<th colSpan={2}>{t("YEAR")}</th>
														</tr>
													</thead>
													<tbody>
														{form.values?.dui_years?.map((entity, i) => (
															<tr key={i}>
																<td className="w-100">
																	<BaseInput
																		name={`dui_years[${i}]`}
																		readOnly={Boolean(props?.entity?.is_hired)}
																		placeholder="ENTER_PAST_DUIS"
																		type="int"
																		required
																		min={1900}
																		max="9999"
																		// max={new Date().getFullYear()}
																		onChange={({ target: { value } }) => {
																			if (!/^\d{0,4}$/.test(value)) value = value.slice(0, 4);

																			form.setFieldValue(`dui_years[${i}]`, value)
																		}}
																		formik={form}
																	/>
																</td>
																<td>
																	<a
																		href="#"
																		onClick={() =>
																			form.setValues({
																				...form.values,
																				dui_years: form.values?.dui_years?.filter(
																					(v, idx) => i != idx
																				),
																			})
																		}
																	>
																		<DashCircle color="red" />
																	</a>
																</td>
															</tr>
														))}
													</tbody>
												</Table>
											)}
										</ViewCard>
									</Col>
								)}
								<BaseCheck
									className="col-12 mt-2"
									disabled={Boolean(entity?.is_hired)}
									label="FELONY_MISDEMANOR_CONVICTIONS"
									checked={hasCriminalHistory}
									onChange={({ target: { value } }) => {
										setHasCriminalHistory(!!value);
										if (!value) {
											form.setFieldValue("criminal_history", null);
										}
									}}
								/>
								{hasCriminalHistory &&
									<BaseTextArea
										className="col-12 mt-2"
										readOnly={Boolean(entity?.is_hired)}
										label="PAST_CONVICTION"
										name="criminal_history"
										formik={form}
									/>
								}

								{/* Accident sectiion */}
								<BaseInput
									className="col-12 mt-2"
									readOnly={Boolean(entity?.is_hired)}
									label="accidents_last_5_years"
									name="accident_count"
									type="int"
									min="0"
									formik={form}
									placeholder="ENTER_NO_OF_ACCIDENTS"
								/>
								{form.values.accident_count > 0 && (
									<div className="col-12 mt-2">
										<ViewCard
											title="ACCIDENT_DEAILS"
											actions={
												!entity?.is_hired &&
												form?.values?.accident_count > 0 &&
												form?.values?.accident_count >
												(
													form.values.accident_history || []
												)?.length && (
													<Button
														className="w-100 py-2"
														size="sm"
														onClick={() => {
															form.setValues({
																...form.values,
																accident_history: [
																	...(form.values?.accident_history || []), { ...new ApplicantAccidentEntity() }
																],
															});
														}}
													>
														<PlusCircle /> {t("ADD")}
													</Button>
												)
											}
										>
											<BaseTextArea
												// className="col-12 mt-2"
												readOnly={Boolean(entity?.is_hired)}
												label="accident_details"
												name="accident_details"
												formik={form}
											/>
											{form.values?.accident_history?.map((accident_details_ex, i) => (
												<Row className="pl-0 single-past-employer-items my-1" key={i}>
													<div className="col-md-12 mt-2">
														<Row className={""}>
															<BaseInput
																className="col-md-6 my-3"
																name={`accident_history[${i}].date_of_accident`}
																label="DATE"
																type="date"
																formik={form}
																required
																max={new Date().toISOString().split("T")[0]}
															/>
															<BaseInput
																className="col-md-6 my-3"
																name={`accident_history[${i}].nature_of_accident`}
																label="LABEL_ACCIDENT_NATURE"
																formik={form}
																required
															/>
															<BaseInput
																className="col-md-6 my-3"
																name={`accident_history[${i}].location_of_accident`}
																label="LABEL_ACCIDENT_LOCATION"
																formik={form}
																required
															/>
															<BaseInput
																className="col-md-6 my-3"
																name={`accident_history[${i}].number_of_fatalaties`}
																label="LABEL_ACCIDENT_FATALITIES"
																formik={form}
																required
															/>
															<BaseInput
																className="col-md-6 mt-2"
																name={`accident_history[${i}].number_of_injured`}
																label="LABEL_ACCIDENT_INJURED"
																formik={form}
																required
															/>
															<BaseCheck
																className="col-md-6 mt-5"
																name={`accident_history[${i}].dot_recordable`}
																label="LABEL_ACCIDENT_DOT"
																formik={form}
															/>

															<BaseCheck
																className="col-md-12 mt-4"
																name={`accident_history[${i}].at_fault`}
																label="LABEL_ACCIDENT_FAULT"
																formik={form}
															/>
															<Button
																className="rounded-lg"
																variant="outline-danger close_btn w-25 mx-auto my-2"
																onClick={() =>
																	form.setFieldValue(
																		"accident_history", [...form.values?.accident_history?.filter((ex, indx) => indx !== i)]
																	)
																}
															>
																<DashCircle />
															</Button>
															<div
																className="Row"
																style={{
																	height: "1px",
																	borderBottom: "solid 1px #8d8c8c",
																	marginTop: "15px",
																	width: "80%",
																	marginLeft: "10%",
																}}
															></div>
														</Row>
													</div>
												</Row>
											))}
										</ViewCard>
									</div>
								)}

								{/* Violation sectiion */}
								<BaseInput
									className="col my-3"
									readOnly={Boolean(entity?.is_hired)}
									label="voilations_in_last_3_years"
									name="moving_violations_count"
									type="number"
									step={1}
									min={0}
									placeholder="ENTER_NO_OF_VIOLATIONS"
									formik={form}
								/>
								{form.values.moving_violations_count > 0 && (
									<div className="col-12 mt-2">
										<ViewCard
											title="VIOLATION_DETAILS"
											actions={
												!entity?.is_hired &&
												form?.values?.moving_violations_count > 0 &&
												form?.values?.moving_violations_count >
												(
													form.values.moving_violation_history || []
												)?.length && (
													<Button
														className="w-100 py-2"
														size="sm"
														onClick={() => {
															form.setValues({
																...form.values,
																moving_violation_history: [
																	...(form.values?.moving_violation_history || []), { ...new ApplicantMovingViolationEntity() }
																],
															});
														}}
													>
														<PlusCircle /> {t("ADD")}
													</Button>
												)
											}
										>
											<BaseTextArea
												// className="col-12 mt-2"
												readOnly={Boolean(entity?.is_hired)}
												label="VIOLATION_DETAILS"
												name="moving_violations_details"
												formik={form}
											/>
											{form.values?.moving_violation_history?.map((entity, i) => (
												<Row key={i} className="single-past-employer-items my-3 ">
													<div className="col-md-12 mt-2">
														<Row className={""}>
															<BaseInput
																className="col-md-6 mt-3"
																name={`moving_violation_history[${i}].date_of_violation`}
																label="VIOLATION_DATE"
																type="date"
																formik={form}
																max={new Date().toISOString().split("T")[0]}
																required
															/>
															<BaseInput
																className="col-md-6 mt-3"
																name={`moving_violation_history[${i}].location`}
																label="location"
																formik={form}
																required
															/>

															<BaseInput
																className="col-md-6 mt-3"
																name={`moving_violation_history[${i}].charge`}
																label="CHARGE"
																formik={form}
																required
															/>
															<BaseInput
																className="col-md-6 mt-3"
																name={`moving_violation_history[${i}].penalty`}
																label="PENALTY"
																formik={form}
																required
															/>
															<Button
																className="rounded-lg"
																variant="outline-danger close_btn w-25 mx-auto my-2"
																onClick={() =>
																	form.setFieldValue(
																		"moving_violation_history", [...form.values?.moving_violation_history?.filter((ex, indx) => indx !== i)]
																	)
																}
															>
																<DashCircle />
															</Button>
															<div
																className="Row"
																style={{
																	height: "1px",
																	borderBottom: "solid 1px #8d8c8c",
																	marginTop: "15px",
																	width: "80%",
																	marginLeft: "10%",
																}}
															></div>
														</Row>
													</div>
												</Row>
											))}
										</ViewCard>
									</div>
								)}

								{/* All  Violation sectiion */}
								<BaseInput
									className="col my-3"
									readOnly={Boolean(entity?.is_hired)}
									label="ALL_VIOLATION_IN_LAST_3_YEARS"
									name="all_violations_count"
									type="number"
									step={1}
									min={0}
									placeholder="ENTER_NO_OF_VIOLATIONS"
									formik={form}
								/>
								{form.values.all_violations_count > 0 && (
									<div className="col-12 mt-2">
										<ViewCard title="VIOLATION_DETAILS">
											<BaseTextArea
												// className="col-12 mt-2"
												readOnly={Boolean(entity?.is_hired)}
												label="VIOLATION_DETAILS"
												name="all_violations_details"
												formik={form}
											/>
										</ViewCard>
									</div>
								)}
							</Col>
							<Col md="6">
								<Row>
									<BaseCheck
										className="col-12 mt-2"
										disabled={Boolean(entity?.is_hired)}
										label="has_had_license_revoked"
										name="license_revoked"
										formik={form}
									/>
									{form.values?.license_revoked && (
										<BaseTextArea
											className="col-12 mt-2"
											readOnly={Boolean(entity?.is_hired)}
											label="details"
											name="license_revoked_details"
											formik={form}
										/>
									)}
									<BaseCheck
										className="col-12 mt-2"
										disabled={Boolean(entity?.is_hired)}
										label="has_had_psp_violations"
										name="psp_violations"
										formik={form}
									/>
									{form.values?.psp_violations && (
										<BaseTextArea
											className="col-12 mt-2"
											readOnly={Boolean(entity?.is_hired)}
											label="details"
											name="psp_violations_details"
											formik={form}
										/>
									)}
									{/* <BaseCheck
										className="col-12 mt-2"
										disabled={Boolean(entity?.is_hired)}
										label="has_had_tickets_last_5_years"
										name="tickets"
										formik={form}
									/> */}
									{form.values?.tickets && (
										<BaseTextArea
											className="col-12 mt-2"
											readOnly={Boolean(entity?.is_hired)}
											label="details"
											name="tickets_details"
											formik={form}
										/>
									)}
									<BaseCheck
										className="col-12 mt-2"
										disabled={Boolean(entity?.is_hired)}
										label="has_had_positive_drug_test"
										name="positive_drug_test"
										formik={form}
									/>
									{form.values?.positive_drug_test && (
										<BaseTextArea
											className="col-12 mt-2"
											readOnly={Boolean(entity?.is_hired)}
											label="details"
											name="positive_drug_test_details"
											formik={form}
										/>
									)}
								</Row>
							</Col>
						</Row>
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col md="12" className="p-0 px-lg-2">
					<ViewCard
						title="UPLOADED_DOCUMENTS"
						actions={
							<Button
								size="sm"
								onClick={() =>
									form.setValues({
										...form.values,
										documents: [
											...(form.values?.documents || []),
											new DocumentEntity(),
										],
									})
								}
							>
								<PlusCircle /> {t("ADD")}
							</Button>
						}
					>
						{!form.values?.documents?.length && <>{t("NONE")}</>}
						{form.values?.documents?.length > 0 && (
							<Table striped>
								<thead>
									<tr>
										<th>{t("DOCUMENT_NAME")}</th>
										<th>{t("DOCUMENT")}</th>
										<th className="text-center">{t("upload_date")}</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{form.values?.documents?.map((entity, i) => (
										<tr key={i}>
											<td>
												<BaseInput
													name={`documents[${i}].type`}
													required
													placeholder="DOCUMENT_NAME"
													readOnly={
														Boolean(!!entity?.id && !entity?.file_base64) ||
														Boolean(props?.entity?.is_hired)
													}
													formik={form}
												/>
											</td>
											<td>
												<FileInput
													name={`documents[${i}]`}
													readOnly={Boolean(props?.entity?.is_hired)}
													required
													accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
													allowedSizeInByte={3145728}
													formik={form}
												/>
											</td>
											<td className="text-center">
												{form?.values?.documents[i]?.created_at ? <ShowFormattedDate date={form?.values?.documents[i]?.created_at} /> : (<span className="text-danger font-italic">{t(`NOT_AVAILABLE`)}</span>)}
											</td>
											<td>
												<a
													href="#"
													onClick={() =>
														form.setValues({
															...form.values,
															documents: form.values?.documents?.filter(
																(v, idx) => i != idx
															),
														})
													}
												>
													<DashCircle color="red" />
												</a>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col md="12" className="p-0 px-lg-2">
					<ViewCard
						title="JOBS_APPLIED_TO_WITH_YOU"
						actions={
							<Button
								disabled={Boolean(entity?.is_hired)}
								size="sm"
								onClick={() =>
									form.setValues({
										...form.values,
										jobs: [
											...(form.values?.jobs || []),
											new ApplicantJobEntity(),
										],
									})
								}
							>
								<PlusCircle /> {t("ADD")}
							</Button>
						}
					>
						{!form.values?.jobs?.length && <>{t("NONE")}</>}
						{form.values?.jobs?.length > 0 && (
							<Table striped>
								<thead>
									<tr>
										<th>{t("JOB")}*</th>
										<th>{t("APPLICATION_STATUS")}*</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{form.values?.jobs?.map((entity, i) => {
										const hideStatus =
											jobHired && jobHired?.job?.id != entity?.job?.id
												? [
													ApplicantStatus.COMPLETED_EMPLOYED,
													ApplicantStatus.COMPLETED_PROMOTED_TO_ROLE,
													ApplicantStatus.COMPLETED_TRANSFERED_TO_ROLE,
												]
												: [];
										return (
											<tr key={i}>
												<td>
													{entity?.id ? (
														entity?.job?.title
													) : (
														<BaseSelect
															name={`jobs[${i}].job.id`}
															readOnly={Boolean(props?.entity?.is_hired)}
															required
															placeholder="SELECT_JOB"
															options={jobs}
															labelKey="title"
															valueKey="id"
															formik={form}
														/>
													)}
												</td>
												<td>
													<BaseSelect
														name={`jobs[${i}].status`}
														readOnly={Boolean(props?.entity?.is_hired)}
														required
														placeholder="SELECT_STATUS"
														labelPrefix="ApplicantStatus"
														hideOptions={hideStatus}
														enumType={ApplicantStatus}
														formik={form}
													/>
												</td>
												<td>
													<a
														href="#"
														onClick={() =>
															form.setValues({
																...form.values,
																jobs: form.values?.jobs?.filter(
																	(v, idx) => i != idx
																),
															})
														}
													>
														<DashCircle color="red" />
													</a>
												</td>
											</tr>
										);
									})}
								</tbody>
							</Table>
						)}
					</ViewCard>
				</Col>
			</Row>

			<ViewModal
				title={t(
					"CREATE_{name}",
					{ name: "REFERRAL_SOURCE" },
					{ translateProps: true }
				)}
				show={createReferral}
				onCloseClick={() => setCreateReferral(false)}
			>
				<ReferralSourceForm onSaveComplete={onReferralAdded} />
			</ViewModal>

			<ViewModal
				title={t("HIRE")}
				show={Boolean(hireApplicantForm.values?.applicantId)}
				onCloseClick={() => hireApplicantForm.resetForm()}
				size="sm"
			>
				<EntityForm
					onSubmit={hireApplicantForm.handleSubmit}
					formik={hireApplicantForm}
					canSubmit={hireApplicantForm.isValid}
					submitLabel="HIRE"
				>
					<Row className="py-3 px-5">
						<Col>
							<BaseSelect
								name={`jobId`}
								readOnly={Boolean(entity?.is_hired)}
								required
								placeholder={t(
									"SELECT_{name}",
									{ name: "JOB" },
									{ translateProps: true }
								)}
								options={jobs}
								labelKey="title"
								label="JOB"
								valueKey="id"
								formik={hireApplicantForm}
							/>
							<button
								disabled={Boolean(entity?.is_hired)}
								type="button"
								onClick={() => setCreateJob(true)}
								className="my-2 btn btn-link"
							>
								{t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
							</button>
						</Col>
					</Row>
				</EntityForm>
			</ViewModal>
			<ViewModal
				title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
				show={createJob}
				onCloseClick={() => setCreateJob(false)}
			>
				<JobForm onSaveComplete={onJobAdded} />
			</ViewModal>
		</EntityForm>
	);
}

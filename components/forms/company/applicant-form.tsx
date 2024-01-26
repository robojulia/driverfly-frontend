import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
	ChevronUp,
	DashCircle,
	PlusCircle,
	XCircle,
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
import { HireApplicantDto } from "../../../models/applicant/hire-applicant.dto";
import { CdlExtras } from "../../../models/jot-form/long-form/cdl-object/index.dto";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { UserEntity } from "../../../models/user/user.entity";
import EmployeeApi from "../../../pages/api/employee";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import UserApi from "../../../pages/api/user";
import { buildReferral } from "../../../utils/common";
import ViewModal from "../../view-details/view-modal";
import { ReferralSourceForm } from "../admin/referral-source-form";
import { JobForm } from "./job-form";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantForm(props: ApplicantFormProps) {
	let { className, entity, onSaveComplete, onSaveError } = props;
	let { user, hasPermission, isSuperAdmin, isCompanyAdmin } = useAuth();
	const { t } = useTranslation();
	const router = useRouter();
	const current_date = new Date();

	const applicantApi = new ApplicantApi();
	const referralSourceApi = new ReferralSourceApi();

	const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);

	const [referralSources, setReferralSources] = useState<ReferralSourceEntity[]>([])

	const [protectedFields, setProtectedFields] = useState({
		license_number: false,
		social_security_number: false,
	});
	const [isWorkedBefore, setIsWorkedBefore] = useState<boolean>(false);

	const form = useFormik({
		initialValues: new ApplicantEntity(),
		validationSchema: ApplicantEntity.yupSchema(),
		onSubmit: async (values) => {
			values.extras = values.extras?.filter(
				(v) => v.value != undefined || v.value != null
			);
			const jobs = values.jobs || [];
			if ("jobs" in values) delete values.jobs;

			console.log(
				values,
				"Values in Formik +++++++++++++++++++++++++++++++++++++++"
			);
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
					let job = entity.jobs[i];

					if (!jobs.some((v) => v.job?.id === job.job.id)) {
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

	const [jobs, setJobs] = useState<JobEntity[]>([]);

	useEffectAsync(async () => {
		setProtectedFields({
			license_number: hasPermission("CanViewApplicant.license_number"),
			social_security_number: hasPermission(
				"CanViewApplicant.social_security_number"
			),
		});

		const api = new JobApi();
		const jobs = await api.list();

		setJobs(jobs);

		const ref_list = await referralSourceApi.list();
		setReferralSources(ref_list);

	}, [user]);

	useEffect(() => {
		// console.log("entity", entity);

		form.setValues(() => {
			let values: ApplicantEntity;
			let extras: ApplicantExtrasEntity[] = entity?.extras ?? [];

			if (
				!extras?.find(
					(v) => v.type == ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
				)
			)
				extras?.push({
					...new ApplicantExtrasEntity(),
					type: ApplicantExtras.ALREADY_APPLIED_TO_COMPANY,
					value: 0,
				});

			if (
				!extras?.find(
					(v) => v.type == ApplicantExtras.ALREADY_WORKED_TO_COMPANY
				)
			) {
				setIsWorkedBefore(false);
				extras?.push({
					...new ApplicantExtrasEntity(),
					type: ApplicantExtras.ALREADY_WORKED_TO_COMPANY,
				});
			} else {
				setIsWorkedBefore(true);
			}

			extras = extras.filter(Boolean);
			if (!extras?.find((v) => v.type == ApplicantExtras.ROUTES)) extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.ROUTES,
			});
			if (!extras?.find((v) => v.type == ApplicantExtras.BUSINESS_NAME)) extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.BUSINESS_NAME,
			});
			if (!extras?.find((v) => v.type == ApplicantExtras.DOT_NUMBER)) extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.DOT_NUMBER,
			});
			if (!extras?.find((v) => v.type == ApplicantExtras.AUTOMATED_RECRUITING_LEAD)) extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.AUTOMATED_RECRUITING_LEAD,
			});
			if (!extras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER)) extras?.push({
				...new ApplicantExtrasEntity(),
				type: ApplicantExtras.CDL_NUMBER,
			});
			if (!!entity?.id) {
				values = {
					...entity,
					documents: entity.documents?.filter((v) =>
						Object.values(ApplicantDocumentType).includes(
							v.type as ApplicantDocumentType
						)
					),
					extras,
				};
			} else {
				values = {
					...new ApplicantEntity(),
					extras,
				};
			}
			return values;
		});
	}, [entity]);

	const [jobHired, setJobHired] = useState<ApplicantJobEntity>(null);

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
				formSuccess(t, "hired", "STATUS");
				routeToEmployees();
			} catch (e) {
				globalAjaxExceptionHandler(e, {
					formik: hireApplicantForm,
					t: t,
					toast: toast,
				});
			}
		},
	});

	const [createJob, setCreateJob] = useState<boolean>(false);

	const onJobAdded = (job: JobEntity) => {
		setJobs([...jobs, job]);
		setCreateJob(false);
	};

	const [createReferral, setCreateReferral] = useState(false);

	const onLocationAdded = (referral: ReferralSourceEntity) => {
		form.setFieldValue(`referralSource.id`, referral.id);
		setReferralSources([
			...referralSources,
			referral
		]);
		setCreateReferral(false);
	}

	useEffectAsync(async () => {
		const userApi = new UserApi();
		const data = await userApi.list();
		setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
	}, []);

	const today = new Date();
	const OldThan18Year = new Date(
		today.getFullYear() - 18,
		today.getMonth(),
		today.getDate()
	)
		.toLocaleString('en-US',{ timeZone: 'America/New_York' })
		.split("T")[0];

	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);



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
						hireApplicantForm.setValues({ applicantId: entity.id }),
				},
			]}
		>
			<Row>
				<Col className="p-0 px-lg-2 mt-3">
					<ViewCard title="BASIC_DETAILS">
						<Row className="mb-2">
							<Col md="4" className="px-2">
								<BaseSelect
									// className="col-12 my-2"
									readOnly={
										!Boolean(isSuperAdmin) ||
										!Boolean(isCompanyAdmin) ||
										Boolean(entity?.is_hired)
									}
									label="ASSIGNED_RECRUITER"
									name="assignedUserId"
									placeholder
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
									placeholder="FIRST_NAME"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="LAST_NAME"
									required
									name="last_name"
									placeholder="LAST_NAME"
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
									placeholder="PHONE"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="EMAIL"
									required
									type="email"
									name="email"
									placeholder="EMAIL"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="STREET"
									name="street"
									placeholder="STREET"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="CITY"
									name="city"
									placeholder="CITY"
									formik={form}
								/>
								<Row className="px-3">
									<StateSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="STATE"
										name="state"
										placeholder="STATE"
										formik={form}
									/>
									<BaseInput
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="ZIP_CODE"
										name="zip_code"
										placeholder="ZIP_CODE"
										formik={form}
									/>
									<BaseCheck
										className="col-12 my-2"
										disabled={Boolean(entity?.is_hired)}
										label="AUTOMATED_RECRUITING_LEAD"
										name={`extras[${form.values?.extras?.findIndex(
											(v) => v.type == ApplicantExtras.AUTOMATED_RECRUITING_LEAD
										)}].value`}
										formik={form}
									/>
									<BaseSelect
										className="col-12 p-0 px-lg-2"
										label="LEAD_TYPE"
										labelPrefix="ApplicantType"
										name="type"
										placeholder
										formik={form}
										enumType={ApplicantType}
									/>
									<BaseSelect
										className="col-12 p-0 px-lg-2"
										label="REFERRAL_SOURCE"
										name="referralSource.id"
										placeholder
										formik={form}
										valueKey="id"
										createLabel={v => buildReferral(v)}
										options={referralSources}
										append={<Button variant="btn create_btn" onClick={() => setCreateReferral(true)}><PlusCircle /> {t("CREATE")}</Button>}
									/>
								</Row>
							</Col>
							<Col md="4" className="px-2">
								<BaseInput
									className="col-12"
									label="driver's_license_number"
									name="license_number"
									placeholder="driver_license_number"
									formik={form}
								// readOnly={
								// 	!protectedFields.license_number || Boolean(entity?.is_hired)
								// }
								/>
								{/* <BaseInput
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="expiration_date"
									name="license_expiry"
									min={
										new Date(
											current_date.getFullYear(),
											current_date.getMonth() + 6,
											current_date.getDate()
										)
											.toISOString()
											.split("T")[0]
									}
									type="date"
									placeholder="expiration_date"
									formik={form}
								/> */}
								<Row className="px-3">
									<BaseInput
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="expiration_date"
										name="license_expiry"
										min={(new Date(current_date.getFullYear(), current_date.getMonth() + 6, current_date.getDate())).toLocaleString('en-US',{ timeZone: 'America/New_York' }).split("T")[0]}
										type="date"
										placeholder="expiration_date"
										formik={form}
									/>
									<StateSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="state_issued"
										name="license_state"
										placeholder="state_issued"
										formik={form}
									/>
								</Row>
								<Row className="px-3">
									<BaseSelect
										className="col-6"
										readOnly={Boolean(entity?.is_hired)}
										label="CDL_CLASS"
										name="license_type"
										placeholder
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
										placeholder="years_cdl_experience"
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
											className="col-12"
											label="BUSINESS_NAME"
											name={`extras[${form.values?.extras?.findIndex(
												(v) => v.type == ApplicantExtras.BUSINESS_NAME
											)}].value`}
											formik={form}
										/>
										<BaseInput
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
									name={`extras[${form.values?.extras?.findIndex(
										(v) => v.type == ApplicantExtras.ROUTES
									)}].value`}
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
								<BaseSelect
									className="col-12"
									readOnly={Boolean(entity?.is_hired)}
									label="HIGHEST_DEGREE"
									name="highest_degree"
									placeholder="HIGHEST_DEGREE"
									formik={form}
									labelPrefix="EducationLevel"
									enumType={EducationLevel}
								/>
								<Col xs="12" className="mt-2">
									<ViewCard title="EMERGENCY_CONTACT">
										<BaseInput
											className="col-12"
											readOnly={Boolean(entity?.is_hired)}
											name={`emergency_contact_name`}
											label="NAME"
											placeholder="FULL_NAME"
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
											placeholder="RELATIONSHIP"
											formik={form}
										/>
									</ViewCard>
								</Col>
							</Col>
						</Row>
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Row>
					<Col className="col-md-4 p-2 mt-2">
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
									{form.values?.equipment_experience.map((entity, i) => (
										<Row key={i}>
											<div className="col-md-6 mt-2">
												<Col className="p-0">
													<strong>{t("TYPE")}</strong>
												</Col>

												<BaseSelect
													readOnly={Boolean(props?.entity?.is_hired)}
													name={`equipment_experience[${i}].type`}
													placeholder="TYPE"
													labelPrefix="JobEquipmentType"
													enumType={JobEquipmentType}
													formik={form}
												/>
											</div>
											<div className="col-md-5 mt-2">
												<Col className="p-0">
													<strong>{t("YEARS")}</strong>
												</Col>

												<BaseInput
													readOnly={Boolean(props?.entity?.is_hired)}
													name={`equipment_experience[${i}].years`}
													placeholder="YEARS"
													type="int"
													min="1"
													formik={form}
												/>
											</div>
											{entity.type === JobEquipmentType.OTHER && (
												<div>
													<BaseInput
														readOnly={Boolean(props?.entity?.is_hired)}
														className="my-2"
														name={`equipment_experience[${i}].type_other`}
														placeholder="TYPE"
														formik={form}
													/>
												</div>
											)}
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
											<div className="12">
												<hr />
											</div>
										</Row>
									))}
								</>
							)}
						</ViewCard>
					</Col>
					<Col md="4" className="px-2">
						{form.values?.is_owner_operator && (
							<Col xs="12" className="mt-3">
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
												</Col>
												<Col>
													<strong>{t("QUANTITY")}</strong>
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
															formik={form}
														/>
													</Col>
													{entity.type === JobEquipmentType.OTHER && (
														<Col xs="11">
															<BaseInput
																readOnly={Boolean(props?.entity?.is_hired)}
																name={`equipment_owned[${i}].type_other`}
																placeholder="TYPE"
																formik={form}
															/>
														</Col>
													)}
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
													<Col xs="12">
														<hr />
													</Col>
												</Row>
											))}
										</>
									)}
								</ViewCard>
							</Col>
						)}
					</Col>
					<Col className="col-md-4 p-2 mt-2">
						<ViewCard
							title="ANY_ACTIVE_DRIVERS_LICENSE"
							actions={
								<Button
									// disabled={Boolean(entity?.is_hired)}
									size="sm"
									onClick={() => {
										const extras = form.values?.extras || [];
										form.setValues({
											...form.values,
											extras: extras.map((item) =>
												item.type === ApplicantExtras.CDL_NUMBER
													? { ...item, value: [new CdlExtras(), ...(item.value || [])] }
													: item
											),
										});
									}}

								>
									<PlusCircle /> {t("ADD")}
								</Button>
							}
						>
							{form.values?.extras?.find(v => v.type === ApplicantExtras.CDL_NUMBER)?.value?.length > 0 && (
								<>
									{form.values?.extras?.find(v => v.type === ApplicantExtras.CDL_NUMBER)?.value?.map((entity, i) => (

										<Row key={i} className={` single-past-employer-items my-3`}>
											<BaseInput
												name={`extras[${form.values?.extras?.findIndex(
													(v) => v.type == ApplicantExtras.CDL_NUMBER
												)}].value[${i}].license_number`}
												className="col-md-4 my-3"
												placeholder="CDL_NUMBER_1"
												label="CDL_NUMBER"
												required
												formik={form}
											/>
											<StateSelect
												className="col-md-4 my-3"
												name={`extras[${form.values?.extras?.findIndex(
													(v) => v.type == ApplicantExtras.CDL_NUMBER
												)}].value[${i}].state`}
												placeholder="STATE"
												label="CHOOSE"
												required
												formik={form}
											/>
											<BaseInput
												className="col-md-4 my-3"
												type="date"
												name={`extras[${form.values?.extras?.findIndex(
													(v) => v.type == ApplicantExtras.CDL_NUMBER
												)}].value[${i}].date`}
												placeholder="expiration_date"
												label="DATE"
												required
												formik={form}
											/>

											<Button
												className="rounded-lg"
												variant="outline-danger close_btn w-25 mx-auto my-2"
												onClick={() =>
													form.setValues({
														...form.values,
														extras: [...form.values?.extras?.map((item) => {
															if (item.type === ApplicantExtras.CDL_NUMBER) {
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
												<DashCircle /></Button>
											<div className='Row' style={{ height: '3px', borderBottom: 'solid 2px #8d8c8c', marginTop: '0px' }}></div >

										</Row>
									))}

								</>
							)}

						</ViewCard>
					</Col>

				</Row>
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
											defaultExpanded={i === 0 || !meta.touched || hasError}
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
																(v, idx) => idx !== i
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
														className="col-12"
														name={`employers[${i}].name`}
														label="NAME"
														required
														placeholder="COMPANY_NAME"
														formik={form}
													/>
													<BaseInput
														readOnly={Boolean(entity?.is_hired)}
														className="col-6"
														name={`employers[${i}].start_at`}
														label="DATES_EMPLOYED"
														type="date"
														max={new Date().toISOString().split("T")[0]}
														formik={form}
													/>

													<BaseInput
														className="col-6"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].end_at`}
														label="THROUGH_OPTIONAL"
														type="date"
														formik={form}
													/>

													<BaseInput
														className="col-12"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].title`}
														label="TITLE"
														placeholder="TITLE"
														formik={form}
													/>
													<BaseInput
														className="col-12"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].street`}
														label="STREET"
														placeholder="STREET"
														formik={form}
													/>
													<BaseInput
														className="col-12"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].city`}
														label="CITY"
														placeholder="CITY"
														formik={form}
													/>
													<StateSelect
														className="col-6"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].state`}
														label="STATE"
														placeholder="STATE"
														formik={form}
													/>
													<BaseInput
														className="col-6"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].zip_code`}
														label="ZIP_CODE"
														placeholder="ZIP_CODE"
														formik={form}
													/>
													<BaseInputPhone
														className="col-12"
														readOnly={Boolean(entity?.is_hired)}
														name={`employers[${i}].phone`}
														label="PHONE"
														placeholder="PHONE"
														formik={form}
													/>
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
									className="my-3 col float-left p-0"
									required
									name={`extras[${form.values?.extras?.findIndex(
										(v) => v.type == ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
									)}].value`}
									label="APPLIED_HERE_BEFORE"
									formik={form}
								/>
							</Col>
						</Row>
						{Boolean(
							form.values?.extras.find(
								({ type }) =>
									type === ApplicantExtras.ALREADY_APPLIED_TO_COMPANY
							)?.value
						) && (
								<>
									<Row>
										<Col>
											<BaseCheck
												className="my-3 col float-left p-0"
												required
												name="is_worked_before"
												label="WORKED_HERE_BEFORE"
												checked={Boolean(isWorkedBefore)}
												onChange={() => setIsWorkedBefore(!isWorkedBefore)}
											/>
										</Col>
									</Row>
									{isWorkedBefore && (
										<Row>
											<BaseInput
												className="col-md-6 my-3 font-weight-bold"
												type="date"
												name={`extras[${form.values?.extras?.findIndex(
													(v) =>
														v.type == ApplicantExtras.ALREADY_WORKED_TO_COMPANY
												)}].value.start_date`}
												placeholder="DATE"
												label="FROM"
												max={new Date((new Date().getFullYear()), new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
												formik={form}
											/>
											<BaseInput
												className="col-md-6 my-3 font-weight-bold"
												type="date"
												name={`extras[${form.values?.extras?.findIndex(
													(v) =>
														v.type == ApplicantExtras.ALREADY_WORKED_TO_COMPANY
												)}].value.end_date`}
												placeholder="DATE"
												required
												label="TO"
												max={new Date((new Date().getFullYear()), new Date().getMonth(), new Date().getDate()).toISOString().split("T")[0]}
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
															dui_years: [
																...(form.values?.dui_years || []),
																"",
															],
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
																		placeholder="YEAR"
																		type="int"
																		required
																		min={new Date().getFullYear() - 5}
																		max={new Date().getFullYear()}
																		formik={form}
																	/>
																</td>
																<td>
																	<a
																		href="#"
																		onClick={() =>
																			form.setValues({
																				...form.values,
																				dui_years:
																					form.values?.dui_years?.filter(
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
								<BaseTextArea
									className="col-12 mt-2"
									readOnly={Boolean(entity?.is_hired)}
									label="criminal_history_last_3_years"
									name="criminal_history"
									formik={form}
								/>
								<BaseInput
									className="col-12 mt-2"
									readOnly={Boolean(entity?.is_hired)}
									label="accidents_last_5_years"
									name="accident_count"
									type="int"
									min="0"
									formik={form}
								/>
								{form.values?.accident_count > 0 && (
									<BaseTextArea
										className="col-12 mt-2"
										readOnly={Boolean(entity?.is_hired)}
										label="accident_details"
										name="accident_details"
										formik={form}
									/>
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
											name="violations_details"
											formik={form}
										/>
									)}
									<BaseCheck
										className="col-12 mt-2"
										disabled={Boolean(entity?.is_hired)}
										label="has_had_tickets_last_5_years"
										name="tickets"
										formik={form}
									/>
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
								disabled={
									Boolean(
										form.values?.documents?.length ===
										Object.keys(ApplicantDocumentType).length
									) || Boolean(entity?.is_hired)
								}
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
										<th>{t("TYPE")}</th>
										<th>{t("DOCUMENT")}</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{form.values?.documents?.map((entity, i) => (
										<tr key={i}>
											<td>
												<BaseSelect
													name={`documents[${i}].type`}
													required
													placeholder="TYPE"
													labelPrefix="ApplicantDocumentType"
													enumType={ApplicantDocumentType}
													readOnly={
														Boolean(!!entity.id && !entity.file_base64) ||
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
													accept="application/pdf"
													allowedSizeInByte={3145728}
													formik={form}
												/>
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
													{entity.id ? (
														entity.job.title
													) : (
														<BaseSelect
															name={`jobs[${i}].job.id`}
															readOnly={Boolean(props?.entity?.is_hired)}
															required
															placeholder="JOB"
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
														placeholder="STATUS"
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
				title={t("CREATE_{name}", { name: "REFERRAL_SOURCE" }, { translateProps: true })}
				show={createReferral}
				onCloseClick={() => setCreateReferral(false)}
			>
				<ReferralSourceForm
					onSaveComplete={onLocationAdded}
				/>
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

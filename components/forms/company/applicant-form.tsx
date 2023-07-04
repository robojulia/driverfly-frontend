import { useEffect, useState } from "react";
import { useEffectAsync } from "../../../utils/react";

import { toast } from "react-toastify";
import { formFailed, formSuccess } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/use-translation";
import { useAuth } from "../../../hooks/use-auth";

import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { Button, Col, Row, Table } from "react-bootstrap";
import { ChevronUp, DashCircle, PlusCircle, XCircle } from "react-bootstrap-icons";

import { BaseFormProps } from "./base-form-props";
import EntityForm from "../../layouts/page/entity-form";
import ViewCard from "../../view-details/view-card";
import BaseCheckList from "../base-check-list";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import BaseTextArea from "../base-text-area";
import BaseInputPhone from "../base-input-phone";
import StateSelect from "../state-select";
import BaseCheck from "../base-check";
import FileInput from "../file-input";

import JobApi from "../../../pages/api/job";
import ApplicantApi from "../../../pages/api/applicant";

import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { ApplicantEquipmentEntity } from "../../../models/applicant/applicant-equipment.entity";
import { ApplicantExperienceEntity } from "../../../models/applicant/applicant-experience.entity";
import { ApplicantEmployerEntity } from "../../../models/applicant/applicant-employer.entity";
import { ApplicantJobEntity } from "../../../models/applicant/applicant-job.entity";
import { JobEntity } from "../../../models/job/job.entity";
import { DocumentEntity } from "../../../models/documents/document.entity";

import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { CompanyManagerEntity } from "../../../models/company/company-manager.entity";
import CompanyApi from "../../../pages/api/company";
import ViewModal from "../../view-details/view-modal";
import { EmployeeEntity } from "../../../models/applicant/employee.entity";
import EmployeeApi from "../../../pages/api/employee";
import UserApi from "../../../pages/api/user";
import { UserEntity } from "../../../models/user/user.entity";
import { JobForm } from "./job-form";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> {
}

export function ApplicantForm(props: ApplicantFormProps) {
	const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([])
	const { t } = useTranslation();
	let { className, entity, onSaveComplete, onSaveError } = props;

	let { user, hasPermission, isSuperAdmin } = useAuth();

	const [protectedFields, setProtectedFields] = useState({
		license_number: false,
		social_security_number: false
	});

	useEffect(() => {
		setProtectedFields({
			license_number: hasPermission("CanViewApplicant.license_number"),
			social_security_number: hasPermission("CanViewApplicant.social_security_number"),
		});
	}, [user]);

	const form = useFormik({
		initialValues: new ApplicantEntity(),
		validationSchema: ApplicantEntity.yupSchema(),
		onSubmit: async (values) => {
			const api = new ApplicantApi();

			const jobs = values.jobs || [];
			if ("jobs" in values)
				delete values.jobs;

			try {
				if (entity?.id) {
					values = await api.update(entity.id, values);
				}
				else {
					values = await api.create(values);
				}

				for (let i = 0; i < entity?.jobs?.length; i++) {
					let job = entity.jobs[i];

					if (!jobs.some(v => v.job?.id === job.job.id)) {
						await api.jobs.remove(values.id, job.job.id);
					}
				}

				for (let i = 0; i < jobs.length; i++) {
					let job = jobs[i];

					if (job.id) {
						await api.jobs.update(values.id, job.job.id, job);
					}
					else {
						await api.jobs.create(values.id, job.job.id, job);
					}
				}

				formSuccess(t, entity?.id ? "update" : "create", "APPLICANT");
				if (onSaveComplete) onSaveComplete(values);
			} catch (e) {
				console.error("Unable to save applicant info", e);
				if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast }))
					formFailed(t, entity?.id ? "update" : "create", "APPLICANT");

				if (onSaveError) onSaveError(e);
			}
		}
	});

	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [managers, setManagers] = useState<CompanyManagerEntity[]>([]);

	useEffectAsync(async () => {
		const api = new JobApi();
		const jobs = await api.list();

		setJobs(jobs);

		const companyApi = new CompanyApi();
		const data = await companyApi.manager.list();

		setManagers(data);
	}, [user]);

	useEffect(() => {
		if (entity && !form.dirty) {
			entity.documents = entity.documents.filter(v => Object.values(ApplicantDocumentType).includes(v.type as ApplicantDocumentType))
			form.setValues(entity);
		}
	}, [entity]);

	const [jobHired, setJobHired] = useState<ApplicantJobEntity>(null)

	useEffect(() => {
		setJobHired(
			form.values.jobs?.find(j => j?.status?.startsWith("COMPLETED")) ?? null
		)
	}, [form.values.jobs]);

	const hireApplicantForm = useFormik({
		initialValues: new EmployeeEntity(),
		validationSchema: EmployeeEntity.yupSchema(),
		onSubmit: async (values) => {
			try {
				const employeeApi = new EmployeeApi()
				const data = await employeeApi.create(entity.id, values.job.id, values)
				entity.employee = data;
				hireApplicantForm.resetForm();
				formSuccess(t, "hired", "STATUS");
			} catch (e) {
				globalAjaxExceptionHandler(e, { formik: hireApplicantForm, t: t, toast: toast });
			}
		},
	});

	const [createJob, setCreateJob] = useState(false);

	const onJobAdded = (job: JobEntity) => {
		setJobs([
			...jobs,
			job
		])
		setCreateJob(false);
	}

	useEffect(() => {
		console.log("hireApplicantForm.errors", hireApplicantForm.errors);
	}, [hireApplicantForm.errors]);


	const userApi = new UserApi()
	useEffectAsync(async () => {
		const data = await userApi.list()
		setCompanyUsers(data)
	}, [])
	return (
		<EntityForm
			id={entity?.id}
			formik={form}
			onSubmit={form.handleSubmit}
			className={className}
			actions={[
				{
					label: "HIRE",
					className: "btn theme-primary-btn",
					hide: !Boolean(form.values.id),
					disabled: form.isSubmitting,
					onClick: () => {
						hireApplicantForm.setValues({ ...(entity.employee ?? new EmployeeEntity()) })
						hireApplicantForm.setFieldValue('job.id', entity?.employee?.job?.id ?? null)
						hireApplicantForm.setFieldValue('status', ApplicantStatus.COMPLETED_EMPLOYED)
					},
				}
			]}
		>

			<Row>

				<Col className="p-0 px-lg-2 mt-3">
					<ViewCard title="BASIC_DETAILS">
						<Row className="mb-2">
							<Col md='4'>
								<BaseSelect
									// className="col-12 my-2"
									readOnly={!Boolean(isSuperAdmin)}
									label="ASSIGNED_RECRUITER"
									name="assignedUserId"
									placeholder
									options={companyUsers}
									valueKey="id"
									createLabel={c => `${c.name} (#${c.id})`}
									formik={form}
								/>
							</Col>
						</Row>
						<Row>
							<Col md="4" className="px-2">
								<BaseInput
									className="col-12"
									label="FIRST_NAME"
									required
									name="first_name"
									placeholder="FIRST_NAME"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									label="LAST_NAME"
									required
									name="last_name"
									placeholder="LAST_NAME"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									label="BIRTHDATE"
									type="date"
									name="birthdate"
									placeholder="MM/DD/YYYY"
									formik={form}
								/>

								<BaseInputPhone
									className="col-12"
									label="PHONE"
									name="phone"
									placeholder="PHONE"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									label="EMAIL"
									required
									type="email"
									name="email"
									placeholder="EMAIL"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									label="STREET"
									name="street"
									placeholder="STREET"
									formik={form}
								/>
								<BaseInput
									className="col-12"
									label="CITY"
									name="city"
									placeholder="CITY"
									formik={form}
								/>
								<Row className='px-3'>
									<StateSelect
										className="col-6"
										label="STATE"
										name="state"
										placeholder="STATE"
										formik={form}
									/>
									<BaseInput
										className="col-6"
										label="ZIP_CODE"
										name="zip_code"
										placeholder="ZIP_CODE"
										formik={form}
									/>
								</Row>
							</Col>
							<Col md="4" className="px-2">
								<BaseInput
									className="col-12"
									label="driver_license_number"
									name="license_number"
									placeholder="driver_license_number"
									formik={form}
									readOnly={!protectedFields.license_number}
								/>
								<BaseInput
									className="col-12"
									label="expiration_date"
									name="license_expiry"
									type="date"
									placeholder="expiration_date"
									formik={form}
								/>
								<Row className="px-3">
									<StateSelect
										className="col-6"
										label="state_issued"
										name="license_state"
										placeholder="state_issued"
										formik={form}
									/>
									<BaseSelect
										className="col-6"
										label="CDL_CLASS"
										name="license_type"
										placeholder
										labelPrefix="DriverLicenseType"
										enumType={DriverLicenseType}
										formik={form}
									/>
								</Row>
								<BaseInput
									className="col-12"
									label="years_cdl_experience"
									name="years_cdl_experience"
									type="number"
									placeholder="years_cdl_experience"
									formik={form}
								/>
								<BaseCheck
									className="col-12 mt-2"
									label="OWNER_OPERATOR"
									name="is_owner_operator"
									formik={form}
								/>
								<BaseCheck
									className="col-12 mt-2"
									label="AUTHORIZED_TO_WORK_IN_THE_US"
									name="authorized_to_work_in_us"
									formik={form}
								/>
								<BaseCheckList
									className="col-12 mt-2"
									label="PREFERRED_LOCATION"
									name="preferred_location"
									formik={form}
									labelPrefix="JobGeography"
									enumType={JobGeography}

								/>

								{form.values.id
									&& <BaseSelect
										className="col-12 mt-2"
										name={`current_application_status`}
										required
										placeholder="APPLICANT_CURRENT_STATUS"
										label="APPLICANT_CURRENT_STATUS"
										labelPrefix="ApplicantStatus"
										enumType={ApplicantStatus}
										formik={form}
									/>
								}

							</Col>
							<Col md="4" className="px-2">
								<BaseCheckList
									className="col-12"
									label="TRANSMISSION_EXPERIENCE"
									name="transmission_type"
									labelPrefix="VehicleTransmissionType"
									enumType={VehicleTransmissionType}
									formik={form}
									cols="2"
								/>
								<BaseCheckList
									className="col-12"
									label="ENDORSEMENTS"
									name="endorsements"
									labelPrefix="DriverEndorsement"
									enumType={DriverEndorsement}
									formik={form}
									cols="2"
								/>
								<BaseSelect
									className="col-12"
									label="HIGHEST_DEGREE"
									name="highest_degree"
									placeholder="HIGHEST_DEGREE"
									formik={form}
									labelPrefix="EducationLevel"
									enumType={EducationLevel}
								/>
								<Col xs="12" className='mt-2'>
									<ViewCard title="EMERGENCY_CONTACT">
										<BaseInput
											className="col-12"
											name={`emergency_contact_name`}
											label="NAME"
											placeholder="FULL_NAME"
											formik={form}
										/>

										<BaseInputPhone
											className="col-12"
											name={`emergency_contact_number`}
											label="PHONE"
											placeholder="PHONE"
											formik={form}
										/>
										<BaseInput
											className="col-12"
											name={`emergency_contact_relationship`}
											label="RELATIONSHIP"
											placeholder="RELATIONSHIP"
											formik={form}
										/>

									</ViewCard>
								</Col>
							</Col>
						</Row>
						<Row>
							<Col className="col-md-6">
								<Col xs="12" className='p-2 mt-2' >
									<ViewCard
										title="equipment_experience"
										actions={<Button size='sm' onClick={() => form.setValues({
											...form.values,
											equipment_experience: [
												...(form.values.equipment_experience || []),
												new ApplicantExperienceEntity()
											]
										})}><PlusCircle /> {t("ADD")}</Button>}
									>
										{
											form.values.equipment_experience?.length > 0 &&
											<>
												{form.values
													.equipment_experience
													.map((entity, i) => (
														<Row key={i}>
															<div className="col-md-6 mt-2">
																<Col className="p-0"><strong>{t("TYPE")}</strong></Col>

																<BaseSelect
																	name={`equipment_experience[${i}].type`}
																	placeholder="TYPE"
																	labelPrefix="JobEquipmentType"
																	enumType={JobEquipmentType}
																	formik={form}
																/>
															</div >
															<div className="col-md-5 mt-2">
																<Col className="p-0"><strong>{t("YEARS")}</strong></Col>

																<BaseInput
																	name={`equipment_experience[${i}].years`}
																	placeholder="YEARS"
																	type="int"
																	min="1"
																	formik={form}
																/>
															</div >
															{
																entity.type === JobEquipmentType.OTHER &&
																<div >
																	<BaseInput
																		className="my-2"
																		name={`equipment_experience[${i}].type_other`}
																		placeholder="TYPE"
																		formik={form}
																	/>
																</div >
															}
															<div className="pl-sm-1 pt-lg-2 col-lg-1 col-md-12">
																<Col className="mt-4"></Col>
																<a href="#" onClick={() => form.setValues({
																	...form.values,
																	equipment_experience: form.values.equipment_experience.filter((v, idx) => i != idx)
																})}><DashCircle color="red" /></a>
															</div >
															<div className="12">
																<hr />
															</div >

														</Row>
													))}
											</>
										}
									</ViewCard>
								</Col>
							</Col>
							<Col md="6" className='px-2'>
								{
									form.values.is_owner_operator &&
									<Col xs="12" className='mt-3'>
										<ViewCard
											title="equipment_owned"
											actions={<Button size='sm' onClick={() => form.setValues({
												...form.values,
												equipment_owned: [
													...form.values.equipment_owned,
													new ApplicantEquipmentEntity()
												]
											})}><PlusCircle /> {t("ADD")}</Button>}
										>
											{
												form.values.equipment_owned.length > 0 &&
												<>
													<Row className='d-sm-none d-md-flex'>
														<Col><strong>{t("TYPE")}</strong></Col>
														<Col><strong>{t("QUANTITY")}</strong></Col>
													</Row>
													{form.values
														.equipment_owned
														.map((entity, i) => (
															<Row key={i}>
																<Col xs="12" className='d-sm-flex d-md-none'>
																	<Col><strong>{t("TYPE")}</strong></Col>
																	<Col><strong>{t("QUANTITY")}</strong></Col>
																</Col>
																<Col xs="6">
																	<BaseSelect
																		name={`equipment_owned[${i}].type`}
																		placeholder="TYPE"
																		labelPrefix="JobEquipmentType"
																		enumType={JobEquipmentType}
																		formik={form}
																	/>
																</Col>
																<Col xs="5">
																	<BaseInput
																		name={`equipment_owned[${i}].quantity`}
																		placeholder="QUANTITY"
																		type="int"
																		min="1"
																		formik={form}
																	/>
																</Col>
																{
																	entity.type === JobEquipmentType.OTHER &&
																	<Col xs="11">
																		<BaseInput
																			name={`equipment_owned[${i}].type_other`}
																			placeholder="TYPE"
																			formik={form}
																		/>
																	</Col>
																}
																<Col xs="1">
																	<a href="#" onClick={() => form.setValues({
																		...form.values,
																		equipment_owned: form.values.equipment_owned.filter((v, idx) => i != idx)
																	})}><DashCircle color="red" /></a>
																</Col>
																<Col xs="12">
																	<hr />
																</Col>

															</Row>
														))}
												</>
											}
										</ViewCard>
									</Col>
								}
							</Col>

						</Row>
					</ViewCard>
				</Col>
			</Row>
			<Row>
				<Col md="4" className="p-0 px-lg-2">
					<ViewCard
						title="WORK_HISTORY"
						actions={<Button size='sm' onClick={() => form.setValues({
							...form.values,
							employers: [
								...(form.values.employers || []),
								new ApplicantEmployerEntity()
							]
						})}><PlusCircle /> {t("ADD")}</Button>}
					>
						{!form.values.employers?.length &&
							<>{t("NONE")}</>
						}
						{form.values.employers?.length > 0 &&
							<>
								{form.values.employers.map((e, i) => {

									const meta = form.getFieldMeta(`employers[${i}]`);

									const hasError = Object.keys(e || {}).some(v => form.getFieldMeta(`employers[${i}].${v}`).error);

									return (
										<Accordion
											key={i}
											defaultExpanded={i === 0 || !meta.touched || hasError}
											expanded={hasError || undefined}
										>
											<AccordionSummary
												expandIcon={<ChevronUp />}
											>
												<Button
													type="button"
													size="sm"
													variant="danger"
													onClick={v => form.setValues({
														...form.values,
														employers: form.values.employers.filter((v, idx) => idx !== i),
													})}
												>
													<XCircle /> {t("REMOVE")}
												</Button>
												<span style={{ marginLeft: "10px" }} >{e.name || t("NEW_EMPLOYER")}</span>

											</AccordionSummary>
											<AccordionDetails>
												<Row>
													<BaseInput
														className="col-12"
														name={`employers[${i}].name`}
														label="NAME"
														required
														placeholder="COMPANY_NAME"
														formik={form}
													/>
													<BaseInput
														className="col-6"
														name={`employers[${i}].start_at`}
														label="DATES_EMPLOYED"
														type="date"
														formik={form}
													/>
													<BaseInput
														className="col-6"
														name={`employers[${i}].end_at`}
														label="THROUGH_OPTIONAL"
														type="date"
														formik={form}
													/>
													<BaseInput
														className="col-12"
														name={`employers[${i}].title`}
														label="TITLE"
														placeholder="TITLE"
														formik={form}
													/>
													<BaseInput
														className="col-12"
														name={`employers[${i}].street`}
														label="STREET"
														placeholder="STREET"
														formik={form}
													/>
													<BaseInput
														className="col-12"
														name={`employers[${i}].city`}
														label="CITY"
														placeholder="CITY"
														formik={form}
													/>
													<StateSelect
														className="col-6"
														name={`employers[${i}].state`}
														label="STATE"
														placeholder="STATE"
														formik={form}
													/>
													<BaseInput
														className="col-6"
														name={`employers[${i}].zip_code`}
														label="ZIP_CODE"
														placeholder="ZIP_CODE"
														formik={form}
													/>
													<BaseInputPhone
														className="col-12"
														name={`employers[${i}].phone`}
														label="PHONE"
														placeholder="PHONE"
														formik={form}
													/>
													<BaseCheck
														className="col-12 mt-2"
														name={`employers[${i}].can_contact`}
														label="MAY_CONTACT_COMPANY"
														formik={form}
													/>
													<BaseCheck
														className="col-12 mt-2"
														name={`employers[${i}].is_subject_to_fmcsrs`}
														label="SUBJECT_TO_FMCSRS"
														formik={form}
													/>
													<BaseCheck
														className="col-12 mt-2"
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
						}
					</ViewCard>
				</Col>
				<Col md="8" className="p-0 px-lg-2">
					<ViewCard title="SAFETY_BACKGROUND">
						<Row>
							<Col md="6">
								<BaseCheck
									className="col-12 mt-2"
									label="CAN_PASS_DRUG_TEST"
									name="can_pass_drug_test"
									formik={form}
								/>
								<BaseCheck
									className="col-12 mt-2"
									label="HAS_DUIS"
									name="has_past_dui"
									formik={form}
								/>
								{
									form.values.has_past_dui &&
									<Col xs="12" className='mt-2'>
										<ViewCard
											title="PAST_DUIS"
											actions={<Button size='sm' onClick={() => form.setValues({
												...form.values,
												dui_years: [
													...(form.values.dui_years || []),
													""
												]
											})}><PlusCircle /> {t("ADD")}</Button>}
										>
											{
												form.values.dui_years?.length > 0 &&

												<Table striped>
													<thead>
														<tr>
															<th colSpan={2}>{t("YEAR")}</th>
														</tr>
													</thead>
													<tbody>
														{form.values
															.dui_years
															.map((entity, i) => (
																<tr key={i}>
																	<td className='w-100'>
																		<BaseInput
																			name={`dui_years[${i}]`}
																			placeholder="YEAR"
																			type="int"
																			required
																			min={new Date().getFullYear() - 5}
																			max={new Date().getFullYear()}
																			formik={form}
																		/>
																	</td>
																	<td>
																		<a href="#" onClick={() => form.setValues({
																			...form.values,
																			dui_years: form.values.dui_years.filter((v, idx) => i != idx)
																		})}><DashCircle color="red" /></a>
																	</td>

																</tr>
															))}
													</tbody>
												</Table>
											}
										</ViewCard>
									</Col>
								}
								<BaseTextArea
									className="col-12 mt-2"
									label="criminal_history_last_3_years"
									name="criminal_history"
									formik={form}
								/>
								<BaseInput
									className="col-12 mt-2"
									label="accidents_last_5_years"
									name="accident_count"
									type="int"
									min="0"
									formik={form}
								/>
								{
									form.values.accident_count > 0 &&
									<BaseTextArea
										className="col-12 mt-2"
										label="accident_details"
										name="accident_details"
										formik={form}
									/>
								}
							</Col>
							<Col md="6">
								<Row>
									<BaseCheck
										className="col-12 mt-2"
										label="has_had_license_revoked"
										name="license_revoked"
										formik={form}
									/>
									{
										form.values.license_revoked &&
										<BaseTextArea
											className="col-12 mt-2"
											label="details"
											name="license_revoked_details"
											formik={form}
										/>
									}
									<BaseCheck
										className="col-12 mt-2"
										label="has_had_psp_violations"
										name="psp_violations"
										formik={form}
									/>
									{
										form.values.psp_violations &&
										<BaseTextArea
											className="col-12 mt-2"
											label="details"
											name="violations_details"
											formik={form}
										/>
									}
									<BaseCheck
										className="col-12 mt-2"
										label="has_had_tickets_last_5_years"
										name="tickets"
										formik={form}
									/>
									{
										form.values.tickets &&
										<BaseTextArea
											className="col-12 mt-2"
											label="details"
											name="tickets_details"
											formik={form}
										/>
									}
									<BaseCheck
										className="col-12 mt-2"
										label="has_had_positive_drug_test"
										name="positive_drug_test"
										formik={form}
									/>
									{
										form.values.positive_drug_test &&
										<BaseTextArea
											className="col-12 mt-2"
											label="details"
											name="positive_drug_test_details"
											formik={form}
										/>
									}
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
						actions={<Button size='sm'
							disabled={form.values.documents?.length === Object.keys(ApplicantDocumentType).length}
							onClick={() => form.setValues({
								...form.values,
								documents: [
									...(form.values.documents || []),
									new DocumentEntity()
								]
							})}><PlusCircle /> {t("ADD")}</Button>}
					>
						{!form.values.documents?.length &&
							<>{t("NONE")}</>
						}
						{
							form.values.documents?.length > 0 &&

							<Table striped>
								<thead>
									<tr>
										<th>{t("TYPE")}</th>
										<th>{t("DOCUMENT")}</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{form.values
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
														formik={form}
													/>
												</td>
												<td>
													<FileInput
														name={`documents[${i}]`}
														required
														accept="application/pdf"
														allowedSizeInByte={3145728}
														formik={form}
													/>
												</td>
												<td>
													<a href="#" onClick={() => form.setValues({
														...form.values,
														documents: form.values.documents.filter((v, idx) => i != idx)
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
			<Row>
				<Col md="12" className="p-0 px-lg-2">
					<ViewCard
						title="JOBS_APPLIED_TO_WITH_YOU"
						actions={<Button size='sm'
							onClick={() => form.setValues({
								...form.values,
								jobs: [
									...(form.values.jobs || []),
									new ApplicantJobEntity()
								]
							})}><PlusCircle /> {t("ADD")}</Button>}
					>
						{!form.values.jobs?.length &&
							<>{t("NONE")}</>
						}
						{
							form.values.jobs?.length > 0 &&

							<Table striped>
								<thead>
									<tr>
										<th>{t("JOB")}*</th>
										<th>{t("STATUS")}*</th>
										<th>{t("MANAGER")}*</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{form.values
										.jobs
										.map((entity, i) => {
											const hideStatus = (jobHired && (jobHired?.job?.id != entity?.job?.id)) ? [
												ApplicantStatus.COMPLETED_EMPLOYED,
												ApplicantStatus.COMPLETED_PROMOTED_TO_ROLE,
												ApplicantStatus.COMPLETED_TRANSFERED_TO_ROLE
											] : []
											return (
												<tr key={i}>
													<td>
														{entity.id
															? entity.job.title
															: <BaseSelect
																name={`jobs[${i}].job.id`}
																required
																placeholder="JOB"
																options={jobs}
																labelKey="title"
																valueKey="id"
																formik={form}
															/>
														}
													</td>
													<td>
														<BaseSelect
															name={`jobs[${i}].status`}
															required
															placeholder="STATUS"
															labelPrefix="ApplicantStatus"
															hideOptions={hideStatus}
															enumType={ApplicantStatus}
															formik={form}
														/>
													</td>
													<td>
														<BaseSelect
															name={`jobs[${i}].manager.id`}
															required
															placeholder="MANAGER"
															options={managers}
															labelKey="name"
															valueKey="id"
															formik={form}
														/>
													</td>
													<td>
														<a href="#" onClick={() => form.setValues({
															...form.values,
															jobs: form.values.jobs.filter((v, idx) => i != idx)
														})}><DashCircle color="red" /></a>
													</td>

												</tr>
											)
										})}
								</tbody>
							</Table>
						}
					</ViewCard>
				</Col>
			</Row>

			<ViewModal
				title={t("HIRE")}
				show={Boolean(hireApplicantForm.values.status)}
				onCloseClick={() => hireApplicantForm.resetForm()}
				size='sm'
			>
				<EntityForm
					onSubmit={hireApplicantForm.handleSubmit}
					id={hireApplicantForm?.values?.id}
					formik={hireApplicantForm}
					canSubmit={hireApplicantForm.isValid}
					submitLabel="HIRE"
				>
					<Row className="py-3 px-5">
						<Col>
							<BaseSelect
								name={`job.id`}
								required
								placeholder="JOB"
								options={jobs}
								labelKey="title"
								label="JOB"
								valueKey="id"
								formik={hireApplicantForm}
							/>
							<button
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
				<JobForm
					onSaveComplete={onJobAdded}
				/>
			</ViewModal>
		</EntityForm>
	);
}
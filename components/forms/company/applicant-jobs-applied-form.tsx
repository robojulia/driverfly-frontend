import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Col, Form, Row, Table } from "react-bootstrap";
import {
	DashCircle,
	PlusCircle
} from "react-bootstrap-icons";
import { toast } from "react-toastify";

import { ApplicantDocumentType } from "../../../enums/applicants/applicant-document-type.enum";
import { ApplicantExtras } from "../../../enums/applicants/applicant-extras.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantExtrasEntity } from "../../../models/applicant";
import { ApplicantJobEntity } from "../../../models/applicant/applicant-job.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { JobEntity } from "../../../models/job/job.entity";
import ApplicantApi from "../../../pages/api/applicant";
import JobApi from "../../../pages/api/job";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { focusOnErrorField } from "../../../utils/form-error";
import { useEffectAsync } from "../../../utils/react";
import { formFailed, formSuccess } from "../../../utils/toast";
import ViewCard from "../../view-details/view-card";
import BaseSelect from "../base-select";
import { BaseFormProps } from "./base-form-props";

export interface ApplicantFormProps extends BaseFormProps<ApplicantEntity> { }

export function ApplicantJobsAppliedForm(props: any) {
	let { className, entity, onSaveComplete, onSaveError } = props?.props;
	let { user } = useAuth();
	const { t } = useTranslation();


	const applicantApi = new ApplicantApi();

	const [jobs, setJobs] = useState<JobEntity[]>([]);
	const [jobHired, setJobHired] = useState<ApplicantJobEntity>(null);

	const form = useFormik({
		initialValues: new ApplicantEntity(),
		validationSchema: ApplicantEntity.yupSchemaForApplicantJobsAppliedWithYouForm(),
		onSubmit: async (values) => {
			values.extras = values.extras?.filter(
				(v) => v.value != undefined || v.value != null
			);
			const jobs = values.jobs || [];
			// if ("jobs" in values) delete values.jobs;
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
				});
		}

	}, [entity]);

	useEffect(() => {
		setJobHired(
			form.values?.jobs?.find((j) => j?.status?.startsWith("COMPLETED")) ?? null
		);
	}, [form.values?.jobs]);


	useEffectAsync(async () => {
		const api = new JobApi();
		const jobs = await api.list();

		setJobs(jobs);
	}, [user]);



	useEffect(() => {
		console.log("form.values", form.values);
		console.log("form.errors", form.errors);
	}, [form.values, form.errors]);

	useEffect(() => focusOnErrorField(form), [form.submitCount])

	return (
		<Form
			onSubmit={form.handleSubmit}
			className={className}
		>
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
						<div style={{ display: "flex", flexDirection: "row" }}>
							{!form.values?.jobs?.length && <>{t("NONE")}</>}
							<Button disabled={form.isSubmitting} style={{ marginTop: "2%" }} type="submit" className="theme-secondary-btn">
								{t("UPDATE")}
							</Button>
						</div>
					</ViewCard>
				</Col>
			</Row>
		</Form>
	);
}

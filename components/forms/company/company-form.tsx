import { useFormik } from "formik";
import { useEffect } from "react";
import { Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "../../../hooks/use-translation";
import { CompanyEntity } from "../../../models/company/company.entity";
import CompanyApi from "../../../pages/api/company";
import { useAuth } from "../../../hooks/use-auth";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { formSuccess } from "../../../utils/toast";
import BaseClickToCopyInput from "../../../components/forms/base-click-to-copy-input";

import EntityForm from "../../layouts/page/entity-form";
import BaseInput from "../base-input";
import BaseTextArea from "../base-text-area";
import FileInput from "../file-input";
import { BaseFormProps } from "./base-form-props";
import { UncontrolledTooltip } from "reactstrap";
import {  Facebook, Instagram, Linkedin, Telephone, Twitter } from "react-bootstrap-icons";
import BaseInputPhone from "../base-input-phone";



export interface CompanyFormProps extends BaseFormProps<CompanyEntity> {
	showClickToCopy?: boolean | (() => boolean);
}

export function CompanyForm(props: CompanyFormProps) {
	const { user } = useAuth();
	const { t } = useTranslation();
	let { className, entity, onSaveComplete, onSaveError, showClickToCopy } = props;

	const form = useFormik({
		initialValues: new CompanyEntity(),
		validationSchema: CompanyEntity.yupSchema(),
		onSubmit: async (dto) => {
			const api = new CompanyApi();
			try {
				let company = null;
				if (entity?.id) {
					company = await api.update(entity.id, dto);
				}
				else {
					company = await api.create(dto);
				}
				formSuccess(t, !!entity?.id ? "update" : "create", "COMPANY");
				if (onSaveComplete) onSaveComplete(company);
			}
			catch (e) {
				console.error("Unable to save entity", e.response);
				globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t });

				if (onSaveError) onSaveError(e);
			}
		},
	});

	useEffect(() => {
		if (entity && !form.dirty)
			form.setValues(entity);
	}, [entity]);

	return (
		<EntityForm
			className={className}
			onSubmit={form.handleSubmit}
			formik={form}
			id={entity?.id}
		>
			<Row>
				<BaseInput
					className="col-12"
					label={t("NAME")}
					name={`name`}
					required
					placeholder={t("NAME")}
					formik={form}
				/>
				<BaseInput
					className="col-12"
					label={t("HEADQUATERS")}
					name={`location`}
					placeholder={t("ADD_HEADQUATERS_LOCATION")}
					formik={form}
				/>
				<BaseInput
					className="col-12"
					label={t("WEBSITE")}
					name={`website`}
					placeholder="http://www.example.com"
					formik={form}
				/>
				{Boolean(showClickToCopy) &&
					<BaseClickToCopyInput
						label="COMPANY_JOBS_PAGE"
						className="rounded"
						value={`${process.env.FRONTEND_BASE_URL ?? ""}employer/${user?.company?.slug
							}`}
						tooltipText={t("CLICK_TO_COPY")}
					/>
				}
				<BaseTextArea
					className="col-12"
					label={t("ABOUT")}
					name={`about`}
					rows={3}
					placeholder={t("ABOUT")}
					formik={form}
				/>
				<FileInput
					className="col-12"
					label={`photo_logo`}
					id="imgpurpose"
					name={`photo`}
					accept="image/*"
					allowedSizeInByte={3145728}
					documentType={"PHOTO"}
					formik={form}
				/>
				<UncontrolledTooltip delay={0} placement="top" target="imgpurpose">
					{t("IMAGE_PURPOSE")}
				</UncontrolledTooltip>

				<BaseInputPhone
					className="col-3"
					label="PHONE"
					name="phone"
					placeholder="PHONE"
					formik={form}
				/>
 
				<p className="mt-3" >{t("SOCIAL_MEDIA_LINKS")}</p>
				<div className="p-0 d-flex justify-content-start ">
					<div className="col-3">
						<BaseInput
						className=""
						label={t("FACEBOOK")}
						name={`facebook`}
						placeholder="http://www.facebook.com"
						formik={form}
						/>
					</div>
					<div className="col-3">
						<BaseInput
							className=""
							label={t("INSTAGRAM")}
							name={`instagram`}
							placeholder="http://www.instagram.com"
							formik={form}
						/>
					</div>
					<div className="col-3">
						<BaseInput
							className=""
							label={t("LINKEDIN")}
							name={`linkedin`}
							placeholder="http://www.linkedin.com"
							formik={form}
						/>
					</div>
					<div className="col-3">
						<BaseInput
							className=""
							label={t("TWITTER")}
							name={`twitter`}
							placeholder="http://www.twitter.com"
							formik={form}
						/>
					</div>
				</div>
			</Row>
		</EntityForm>
	);
}
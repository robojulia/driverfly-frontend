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

export interface CompanyFormProps extends BaseFormProps<CompanyEntity> {}

export function CompanyForm(props: CompanyFormProps) {
    const { user } = useAuth();
    const { t } = useTranslation();
    let { className, entity, onSaveComplete, onSaveError } = props;

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
                label={t("WEBSITE")}
                name={`website`}
                placeholder="http://www.example.com"
                formik={form}
                />
             	<BaseClickToCopyInput
                label="COMPANY_JOBS_PAGE"
                className="rounded"
                value={`${process.env.FRONTEND_BASE_URL ?? ""}employer/${user?.company?.id
                  }?`}
                tooltipText={t("CLICK_TO_COPY")}
              />
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
                label={`photo`}
                name={`photo`}
                accept="image/*"
                allowedSizeInByte={3145728}
                documentType={"PHOTO"}
                formik={form}
              />
            </Row>
        </EntityForm>
    );
}
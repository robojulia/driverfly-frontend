import { toast } from 'react-toastify';

import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/use-translation";
import { useEffect } from "react";

import { Row } from "react-bootstrap";

import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import BaseInput from "../base-input";
import EntityForm from "../../layouts/page/entity-form";
import StateSelect from "../state-select";

import { LocationEntity } from "../../../models/company/location.entity";
import LocationApi from "../../../pages/api/location";
import { BaseFormProps } from "./base-form-props";

export interface LocationFormProps extends BaseFormProps<LocationEntity> {

}

export function LocationForm(props: LocationFormProps) {
    const { t } = useTranslation();
    let { className, entity, onSaveComplete, onSaveError } = props;

    const form = useFormik({
        initialValues: new LocationEntity(),
        validationSchema: LocationEntity.yupSchema(),
        onSubmit: async (dto) => {
            const api = new LocationApi();
            try {
                let location = null;
                if (entity?.id) {
                    location = await api.update(entity.id, dto);
                }
                else {
                    location = await api.create(dto);
                }
                toast.success(t("Forms.SUCCESS_{action}_{name}", { action: !!entity?.id ? "Forms.UPDATED" : "Forms.CREATED", name: "TERMINAL" }, { translateProps: true }));
                if (onSaveComplete) onSaveComplete(location);
            }
            catch (e) {
                console.error("Unable to save entity", e);
                globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast, defaultMessage: t("Forms.FAIL_{action}_{name}", { action: !!entity?.id ? "Forms.UPDATED" : "Forms.CREATED", name: "TERMINAL" }, { translateProps: true }) });
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
            id={entity?.id}
            formik={form}
        >
            <Row className="my-2">
                <BaseInput
                    className="col-12"
                    label="STREET"
                    name="street"
                    required
                    placeholder="STREET"
                    formik={form}
                />
                <BaseInput
                    className="col-md-4 mt-3"
                    label="CITY"
                    name="city"
                    required
                    placeholder="CITY"
                    formik={form}
                />
                <StateSelect
                    className="col-md-4 mt-3"
                    label="STATE"
                    name="state"
                    required
                    placeholder="STATE"
                    formik={form}
                />
                <BaseInput
                    className="col-md-4 mt-3"
                    label="ZIP_CODE"
                    required
                    name="zip_code"
                    placeholder="ZIP_CODE"
                    formik={form}
                />
            </Row>
        </EntityForm>
    );
}
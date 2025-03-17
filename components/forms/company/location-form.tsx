import { toast } from 'react-toastify';

import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "../../../hooks/use-translation";

import { Row } from "react-bootstrap";

import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import EntityForm from "../../layouts/page/entity-form";
import BaseInput from "../base-input";
import StateSelect from "../state-select";

import { LocationEntity } from "../../../models/company/location.entity";
import LocationApi from "../../../pages/api/location";
import MapboxApi from '../../../pages/api/mapbox';
import { BaseFormProps } from "./base-form-props";

export interface LocationFormProps extends BaseFormProps<LocationEntity> {

}

export function LocationForm(props: LocationFormProps) {
    const { t } = useTranslation();
    let { className, entity, onSaveComplete, onSaveError } = props;
    const [error, setError] = useState<string>();

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

    const valicateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        const address: string = `${(form.values.street + ' ').trim()}, ${form.values.city}, ${form.values.state} ${form.values.zip_code}`.trim();

        const mapboxApi = new MapboxApi();
        const results = await mapboxApi.forwardGeocoding(address)
        // console.log({ results });

        if (!!results?.features?.some((v) => (v?.relevance == 1))) {
            setError(null);
            form.handleSubmit();
        } else {
            setError("INVALID_LOCATION");
        }
    }

    useEffect(() => {
        if (entity && !form.dirty)
            form.setValues(entity);
    }, [entity]);

    useEffect(() => {
        setError(null);
    }, [form.values]);

    return (
        <EntityForm
            className={className}
            onSubmit={valicateLocation}
            id={entity?.id}
            formik={form}
        >
            <>
                {error && <div className="text-danger">{t(error)}</div>}
                <Row className="my-2">
                    <BaseInput
                        className="col-12"
                        label="STREET"
                        name="street"
                        // required
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
                        // required
                        name="zip_code"
                        placeholder="ZIP_CODE"
                        formik={form}
                    />
                </Row>
            </>
        </EntityForm>
    );
}
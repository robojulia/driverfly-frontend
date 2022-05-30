import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/useTranslation";
import { toast } from 'react-toastify'
import { useEffect } from "react";
import { Row } from "react-bootstrap";

import BaseInput from "../BaseInput";
import EntityForm from "../../layouts/EntityForm";
import StateSelect from "../StateSelect";

import { LocationEntity } from "../../../models/company/location.entity";
import LocationApi from "../../../pages/api/location";

/**
 * 
 * @param {object} props 
 * @param {number} props.id
 * @param {LocationEntity} props.location
 * @param {string} props.className
 * @param {(LocationEntity) => void} props.onSaveComplete
 * @param {(Error) => void} props.onSaveError
 * @param {(Error) => void} props.onLoadError
 * @returns 
 */
export function LocationForm(props) {
    const { t } = useTranslation();
    let { className, id, location, onSaveComplete, onSaveError, onLoadError } = props;

    if (!location) location = new LocationEntity();

    if (!id) id = location?.id;

    const form = useFormik({
        initialValues: location,
        validationSchema: LocationEntity.yupSchema(),
        onSubmit: async (dto) => {
            const api = new LocationApi();
            try {
                let location = null;
                if (id) {
                    location = await api.update(id, dto);
                }
                else {
                    location = await api.create(dto);
                }
                toast.success(t("Forms.SUCCESS_{action}_{name}", { action: !!id ? "Forms.UPDATED" : "Forms.CREATED", name: "LOCATION" }, { translateProps: true }));
                if (onSaveComplete) onSaveComplete(location);
            }
            catch (e) {
                console.error("Unable to save entity", e);
                toast.error(t("Forms.FAIL_{action}_{name}", { action: !!id ? "Forms.UPDATED" : "Forms.CREATED", name: "LOCATION" }, { translateProps: true }));
                if (onSaveError) onSaveError(e);
            }
        },
    });

    useEffect(async () => {
        if (id && !location.id) {
            const api = new LocationApi();

            const entity = await api.getById(id);
            if (!entity) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "LOCATION" }, { translateProps: true }));
                if (onLoadError) onLoadError();
                return;
            }

            form.initialValues = {
                ...form.initialValues,
                ...entity
            };
            form.setValues(entity);
        }
    }, [ id ]);

    return (
        <EntityForm
            className={className}
            onSubmit={form.handleSubmit}
            id={id}
            >
            <Row className="mt-2">
                <BaseInput
                    className="col-12"
                    label="STREET"
                    name="street"
                    required
                    placeholder="STREET"
                    formik={form}
                    />
                <BaseInput
                    className="col-4"
                    label="CITY"
                    name="city"
                    required
                    placeholder="CITY"
                    formik={form}
                    />
                <StateSelect
                    className="col-4"
                    label="STATE"
                    name="state"
                    placeholder="STATE"
                    formik={form}
                    />
                <BaseInput
                    className="col-4"
                    label="ZIP_CODE"
                    name="zip_code"
                    required
                    placeholder="ZIP_CODE"
                    formik={form}
                    />
            </Row>
        </EntityForm>
    );
}
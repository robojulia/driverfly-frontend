import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/use-translation";
import { VehicleEntity } from "../../../models/company/vehicle.entity";
import VehicleApi from "../../../pages/api/vehicle";
import { toast } from 'react-toastify'
import { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import { VehicleType } from "../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { VehicleAccessory } from "../../../enums/vehicles/vehicle-accessory.enum";

import { DocumentType } from "../../../models/documents/document.entity";

import BaseSelect from "../base-select";
import BaseCheckList from "../base-check-list";
import BaseCheck from "../base-check";
import BaseInput from "../base-input";
import FileInput from "../file-input";
import BaseTextArea from "../base-text-area";
import EntityForm from "../../layouts/page/entity-form";
import { BaseFormProps } from "./base-form-props";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";

export interface VehicleFormProps extends BaseFormProps<VehicleEntity> {

}

export function VehicleForm(props: VehicleFormProps) {
    const { t } = useTranslation();
    let { className, entity, onSaveComplete, onSaveError } = props;

    const action = !!entity?.id ? "Forms.UPDATED" : "Forms.CREATED";

    const form = useFormik({
        initialValues: new VehicleEntity(),
        validationSchema: VehicleEntity.yupSchema(),
        onSubmit: async (dto) => {
            if (dto.max_speed)
                dto.max_speed = +dto.max_speed;

            const api = new VehicleApi();
            try {
                let vehicle = null;
                if (entity?.id) {
                    vehicle = await api.update(entity.id, dto);
                }
                else {
                    vehicle = await api.create(dto);
                }
                toast.success(t("Forms.SUCCESS_{action}_{name}", { action: action, name: "VEHICLE" }, { translateProps: true }));
                if (onSaveComplete) onSaveComplete(vehicle);
            }
            catch (e) {
                console.error("Unable to save entity", e);
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: t("Forms.FAIL_{action}_{name}", { action: action, name: "VEHICLE" }, { translateProps: true }) });
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
            <Row className="mt-2">
                <BaseSelect
                    className={`col-${form.values.type === VehicleType.OTHER ? 3 : 6}`}
                    name="type"
                    label="TYPE"
                    placeholder="TYPE"
                    required
                    enumType={VehicleType}
                    labelPrefix="VehicleType"
                    formik={form}
                />
                {
                    form.values.type === VehicleType.OTHER &&
                    <BaseInput
                        className="col-3"
                        name="type_other"
                        label="OTHER"
                        placeholder="TYPE"
                        required
                        formik={form}
                    />
                }
                <BaseSelect
                    className={`col-${form.values.trailer_type === VehicleTrailerType.OTHER ? 3 : 6}`}
                    label="TRAILER_TYPE"
                    name="trailer_type"
                    placeholder="TRAILER_TYPE"
                    enumType={VehicleTrailerType}
                    labelPrefix="VehicleTrailerType"
                    formik={form}
                />
                {
                    form.values.trailer_type === VehicleTrailerType.OTHER &&
                    <BaseInput
                        className="col-3"
                        name="trailer_type_other"
                        label="OTHER"
                        placeholder="TRAILER_TYPE"
                        required
                        formik={form}
                    />
                }
            </Row>
            <Row className="mt-2">
                <BaseSelect
                    className="col-md-3 mt-3"
                    name="transmission_type"
                    label="TRANSMISSION"
                    placeholder="TRANSMISSION"
                    enumType={VehicleTransmissionType}
                    labelPrefix="VehicleTransmissionType"
                    formik={form}
                />
                <BaseInput
                    className="col-md-3 mt-3"
                    label="MAKE"
                    name="make"
                    required
                    placeholder="MAKE"
                    formik={form}
                />
                <BaseInput
                    className="col-md-3 mt-3"
                    label="MODEL"
                    name="model"
                    placeholder="MODEL"
                    formik={form}
                />
                <BaseInput
                    className="col-md-3 mt-3"
                    label="YEAR"
                    name="year"
                    type="int"
                    placeholder="YEAR"
                    formik={form}
                />
            </Row>
            <Row className="mt-md-2">
                <FileInput
                    className="col-md-4 pt-3"
                    label="photo"
                    name="photo"
                    accept="image/*"
                    documentType={DocumentType.PHOTO}
                    formik={form}
                    allowedSizeInByte={3072}
                />
                <BaseCheckList
                    className="col-md-4 pt-3"
                    label="ACCESSORIES"
                    name="accessories"
                    cols={2}
                    labelPrefix="VehicleAccessory"
                    enumType={VehicleAccessory}
                    formik={form}
                />
                {
                    form.values.accessories.includes(VehicleAccessory.OTHER) &&
                    <BaseTextArea
                        className="col-md-3 mt-3"
                        label="OTHER"
                        name="accessory_other"
                        required
                        rows={3}
                        placeholder="ACCESSORIES"
                        formik={form}
                    />
                }
                <Col className="col-md-4">
                    <BaseCheck
                        className="col-12 pt-3 p-0"
                        label="GOVERNED_SPEED"
                        name="is_governed"
                        formik={form}
                    />
                    {
                        form.values.is_governed &&
                        <BaseInput
                            className="col-12 mt-2 p-0"
                            label="MAX_SPEED"
                            name="max_speed"
                            type="int"
                            placeholder="MAX_SPEED"
                            formik={form}
                        />
                    }

                </Col>
                <Row>
                    <Col>
                        <BaseCheck
                            className="col-12 pt-3 p-0"
                            label="SHOW_VEHICLES_TO_PUBLIC_USERS"
                            name="is_public"
                            formik={form}
                        />
                    </Col>
                </Row>
            </Row>
        </EntityForm>
    );
}
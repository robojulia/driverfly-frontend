import { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { formFailed, formSuccess } from "../../../utils/toast";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";

import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/use-translation";
import { useAuth } from "../../../hooks/use-auth";
import { BaseFormProps } from "../company/base-form-props";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import EntityForm from "../../layouts/page/entity-form";
import { Button, Row } from "react-bootstrap";
import BaseInput from "../base-input";
import { ArrowClockwise } from "react-bootstrap-icons";


export interface ReferralSourceFormProps extends BaseFormProps<ReferralSourceEntity> {}

export function ReferralSourceForm(props: ReferralSourceFormProps) {
    const { t } = useTranslation();

    let { className, entity, onSaveComplete, onSaveError } = props;

    let { user, hasPermission } = useAuth();

    // this field is used to validate the referral code
    // during validation to prevent excessive API calls.
    const referralCodeRef = useRef(null);

    const form = useFormik({
        initialValues: new ReferralSourceEntity(),
        validationSchema: ReferralSourceEntity.yupSchema(),
        validate: async (dto) => {
            if (dto.code && referralCodeRef.current != entity.code) {
                referralCodeRef.current = entity.code;

                const api = new ReferralSourceApi();

                const existing = (await api.list()).find(v => v.code === dto.code);

                if (existing && dto.id !== existing.id) {
                    form.setFieldError("code", t("ALREADY_EXISTS"));
                }
            }
        },
        onSubmit: async (dto) => {
            const api = new ReferralSourceApi();

            try {
                if (dto.id) {
                    dto = await api.update(dto.id, dto);
                } else {
                    dto = await api.create(dto);
                }
                formSuccess(t, entity?.id ? "update": "create", "REFERRAL_SOURCE");
                if (onSaveComplete) onSaveComplete(dto);
            }
            catch (e) {
                console.error("Unable to save referral source info", e);
                if (!globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast }))
                    formFailed(t, entity?.id ? "update": "create", "REFERRAL_SOURCE");

                if (onSaveError) onSaveError(e);
            }
        }
    });

    useEffect(() => {
        if (entity && !form.dirty) {
            referralCodeRef.current = entity.code;
            form.setValues(entity);
        }
    }, [ entity ]);

    const [ generatingCode, setGeneratingCode ] = useState(false);

    async function generateCode() {
        setGeneratingCode(true);
        const api = new ReferralSourceApi();

        try {
            const code = await api.generateCode();

            form.setFieldValue("code", `${code}`);
        }
        catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        } finally {
            setGeneratingCode(false);
        }
    }

    return (
        <EntityForm
            id={entity?.id}
            formik={form}
            onSubmit={form.handleSubmit}
            className={className}
            >
            <Row>
                <BaseInput
                    className="col-6"
                    label="NAME"
                    required
                    name="name"
                    placeholder
                    formik={form}
                />
                <BaseInput
                    className="col-6"
                    label="REFERRAL_CODE"
                    required
                    name="code"
                    placeholder
                    formik={form}
                    append={<Button
                        disabled={generatingCode}
                        onClick={generateCode}
                        >
                        <ArrowClockwise />{' '}
                        {t("GENERATE")}
                    </Button>}
                />

            </Row>

        </EntityForm>
    );
}
import { ChangeEvent, useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { formFailed, formSuccess } from "../../../utils/toast";

import { useFormik } from "formik";
import { Button, Col, Row } from "react-bootstrap";
import { ArrowClockwise } from "react-bootstrap-icons";
import { useTranslation } from "../../../hooks/use-translation";
import { ReferralSourceEntity } from "../../../models/referral-source/referral-source.entity";
import { ReferralSourceApi } from "../../../pages/api/referral-source";
import { slugify } from "../../../utils/common";
import EntityForm from "../../layouts/page/entity-form";
import BaseInput from "../base-input";
import { BaseFormProps } from "../company/base-form-props";

export interface ReferralSourceFormProps
    extends BaseFormProps<ReferralSourceEntity> { }

export function ReferralSourceForm(props: ReferralSourceFormProps) {
    const { t } = useTranslation();

    let { className, entity, onSaveComplete, onSaveError } = props;

    const [generatingCode, setGeneratingCode] = useState(false);

    // this field is used to validate the referral code
    // during validation to prevent excessive API calls.
    const referralCodeRef = useRef(null);

    const referralSourceApi = new ReferralSourceApi();

    const form = useFormik({
        initialValues: new ReferralSourceEntity(),
        validationSchema: ReferralSourceEntity.yupSchema(),
        validate: async (dto) => {
            if (dto?.code && referralCodeRef?.current != entity?.code) {
                referralCodeRef.current = entity?.code;

                const existing = (await referralSourceApi.list())?.find((v) => v?.code == dto?.code);

                if (existing && dto.id !== existing.id) {
                    form.setFieldError("code", t("ALREADY_EXISTS"));
                }
            }
        },
        onSubmit: async (dto) => {

            try {
                if (dto.id) {
                    dto = await referralSourceApi.update(dto.id, dto);
                } else {
                    dto = await referralSourceApi.create(dto);
                }
                formSuccess(t, entity?.id ? "update" : "create", "REFERRAL_SOURCE");
                if (onSaveComplete) onSaveComplete(dto);
            } catch (e) {
                console.error("Unable to save referral source info", e);
                if (
                    !globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast })
                )
                    formFailed(t, entity?.id ? "update" : "create", "REFERRAL_SOURCE");

                // if (onSaveError) onSaveError(e);
            }
        },
    });

    useEffect(() => {
        if (entity && !form.dirty) {
            referralCodeRef.current = entity?.code;
            form.setValues(entity);
        }
    }, [entity]);

    async function generateCode() {
        setGeneratingCode(true);
        const api = new ReferralSourceApi();

        try {
            const code = await api.generateCode();

            form.setFieldValue("code", `${code}`);
        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, toast: toast });
        } finally {
            setGeneratingCode(false);
        }
    }

    function slugifyHandler(e: ChangeEvent<HTMLInputElement>): void {
        e.target.value = slugify(e?.target?.value)
        form.handleChange(e)
    }

    return (
        <EntityForm
            id={entity?.id}
            formik={form}
            onSubmit={form.handleSubmit}
            className={className}
        >
            <Row>
                <Col md="6">
                    <BaseInput
                        label="NAME"
                        required
                        name="name"
                        displayPlaceholder
                        placeholder="ENTER_NAME"
                        formik={form}
                    />
                </Col>
                <Col md="6">
                    <BaseInput
                        label="REFERRAL_CODE"
                        required
                        name="code"
                        readOnly={Boolean(entity?.id)}
                        displayPlaceholder
                        placeholder="ENTER_REFERREL_CODE"
                        formik={form}
                        append={
                            <Button disabled={Boolean(entity?.id) || generatingCode} onClick={generateCode}>
                                <ArrowClockwise /> {t("GENERATE")}
                            </Button>
                        }
                    />
                    {!Boolean(entity?.id) && <span className="small text-muted">{t('UTM_FIELD_HELP_TEXT')}</span>}
                </Col>
            </Row>
            <Row className="mt-2">
                <Col md="6">
                    <BaseInput
                        label="SOURCE"
                        required
                        name="source"
                        placeholder="SOURCES"
                        displayPlaceholder
                        formik={form}
                    // onChange={slugifyHandler}
                    />
                    {/* <span className="small text-muted">{t('UTM_FIELD_HELP_TEXT')}</span> */}
                </Col>
                <Col md="6">
                    <BaseInput
                        label="MEDIUM"
                        required
                        name="medium"
                        placeholder="MEDIUMS"
                        displayPlaceholder
                        formik={form}
                    // onChange={slugifyHandler}
                    />
                    {/* <span className="small text-muted">{t('UTM_FIELD_HELP_TEXT')}</span> */}
                </Col>
            </Row>
        </EntityForm>
    );
}

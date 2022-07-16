import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/useTranslation";
import { Row } from "react-bootstrap";
import BaseInput from "../BaseInput";
import BaseInputPhone from "../BaseInputPhone";
import EntityForm from "../../layouts/page/EntityForm";
import { UserEntity } from "../../../models/user/user.entity";
import UserApi from "../../../pages/api/user";
import { formSuccess } from "../../../utils/toast";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../utils/ajax";
import { BaseFormProps } from "./BaseFormProps";
import { useEffect } from "react";


export interface UserFormProps extends BaseFormProps<UserEntity> {
}

export function UserForm(props: UserFormProps) {
    const { t } = useTranslation();
    let { className, entity, onSaveComplete, onSaveError } = props;

    const form = useFormik({
        initialValues: new UserEntity(),
        validationSchema: UserEntity.yupSchema(),
        onSubmit: async (dto) => {
            const api = new UserApi();
            try {
                let user = null;
                if (entity?.id) {
                    user = await api.update(entity.id, dto);
                }
                else {
                    user = await api.create(dto);
                }
                formSuccess(t, !!entity?.id ? "update" : "create", "USER");
                if (onSaveComplete) onSaveComplete(user);
            }
            catch (e) {
                console.error("Unable to save entity", e.response);
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SIGNUP" });

                if (onSaveError) onSaveError(e);
            }
        },
    });

    useEffect(() => {
        if (entity)
            form.setValues(entity);
    }, [ entity ])

    return (
        <EntityForm
            className={className}
            onSubmit={form.handleSubmit}
            formik={form}
            id={entity?.id}
        >
            <Row className="mt-2">
                <BaseInput
                    className="col-6 mt-1"
                    label="FIRST_NAME"
                    name="first_name"
                    required
                    placeholder
                    formik={form}
                />
                <BaseInput
                    className="col-6 mt-1"
                    label="LAST_NAME"
                    name="last_name"
                    required
                    placeholder
                    formik={form}
                />
                <BaseInputPhone
                    className="col-6 mt-1"
                    label="phone"
                    name="contact_number"
                    formik={form}
                />
                <BaseInputPhone
                    className="col-6 mt-1"
                    label="phone_cell"
                    name="cell_number"
                    placeholder="phone_cell"
                    formik={form}
                />
                <BaseInput
                    className="col-12 mt-1"
                    label="EMAIL"
                    name="email"
                    required
                    placeholder
                    formik={form}
                    readOnly={!!entity?.id}
                />
                {!entity?.id &&
                    <BaseInput
                        className="col-12 mt-1"
                        label="PASSWORD"
                        required
                        type="password"
                        name="password"
                        formik={form}
                    />
                }
            </Row>
        </EntityForm>
    );
}
import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/useTranslation";
import { toast } from 'react-toastify'
import { Col, Row } from "react-bootstrap";
import BaseInput from "../BaseInput";
import BaseInputPhone from "../BaseInputPhone";
import EntityForm from "../../layouts/EntityForm";
import { UserEntity } from "../../../models/user/user.entity";
import UserApi from "../../../pages/api/user";

/**
 * 
 * @param {object} props 
 * @param {number} props.id
 * @param {UserEntity} props.user
 * @param {string} props.className
 * @param {(UserEntity) => void} props.onSaveComplete
 * @param {(Error) => void} props.onSaveError
 * @param {(Error) => void} props.onLoadError
 * @returns 
 */
export function UserForm(props) {
    const { t } = useTranslation();
    let { className, id, user, onSaveComplete, onSaveError, onLoadError } = props;

    if (!user) user = new UserEntity();

    if (!id) id = user?.id;

    const form = useFormik({
        initialValues: user,
        validationSchema: UserEntity.yupSchema(),
        onSubmit: async (dto) => {
            console.log(dto);
            const api = new UserApi();
            try {
                let user = null;
                if (id) {
                    user = await api.update(id, dto);
                }
                else {
                    user = await api.create(dto);
                }
                toast.success(t("Forms.SUCCESS_{action}_{name}", { action: !!id ? "Forms.UPDATED" : "Forms.CREATED", name: "USER" }, { translateProps: true }));
                if (onSaveComplete) onSaveComplete(vehicle);
            }
            catch (e) {
                console.error("Unable to save entity", e);
                toast.error(t("Forms.FAIL_{action}_{name}", { action: !!id ? "Forms.UPDATED" : "Forms.CREATED", name: "USER" }, { translateProps: true }));
                if (onSaveError) onSaveError(e);
            }
        },
    });

    // useEffect(async () => {
    //     if (id && !user.id) {
    //         const api = new UserApi();

    //         const entity = await api.getById(id);
    //         if (!entity) {
    //             toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
    //             if (onLoadError) onLoadError();
    //             return;
    //         }

    //         form.initialValues = {
    //             ...form.initialValues,
    //             ...entity
    //         };
    //         form.setValues(entity);
    //     }
    // }, [ id ]);

    return (
        <EntityForm
            className={className}
            onSubmit={form.handleSubmit}
            id={id}
            >
            <Row className="mt-2">
                <BaseInput
                    className="col-6 mt-1"
                    label={t("FIRST_NAME")}
                    name={`first_name`}
                    required
                    placeholder={t("FIRST_NAME")}
                    formik={form}
                />
                <BaseInput
                    className="col-6 mt-1"
                    label={t("LAST_NAME")}
                    name={`last_name`}
                    required
                    placeholder={t("LAST_NAME")}
                    formik={form}
                />
                <BaseInputPhone
                    className="col-6 mt-1"
                    label={t("phone")}
                    name="contact_number"
                    type="tel"
                    required
                    placeholder={t("phone")}
                    formik={form}
                />
                <BaseInputPhone
                    className="col-6 mt-1"
                    label={t("phone_cell")}
                    name={`cell_number`}
                    type="tel"
                    required
                    placeholder={t("phone_cell")}
                    formik={form}
                />
                <BaseInput
                    className="col-12 mt-1"
                    label="EMAIL"
                    name={`email`}
                    required
                    placeholder="EMAIL"
                    formik={form}
                />
                <BaseInput
                    className="col-6 mt-1"
                    label={t("PASSWORD")}
                    required
                    type="password"
                    name="password"
                    formik={form}
                />
            </Row>
        </EntityForm>
    );
}
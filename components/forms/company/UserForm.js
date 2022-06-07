import { useEffect } from "react";
import { useFormik } from "formik";
import { useTranslation } from "../../../hooks/useTranslation";
import { Row } from "react-bootstrap";
import BaseInput from "../BaseInput";
import BaseInputPhone from "../BaseInputPhone";
import EntityForm from "../../layouts/EntityForm";
import { UserEntity } from "../../../models/user/user.entity";
import UserApi from "../../../pages/api/user";
import * as toast from "../../../utils/toast";

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
            const api = new UserApi();
            try {
                let user = null;
                if (id) {
                    user = await api.update(id, dto);
                }
                else {
                    user = await api.create(dto);
                }
                !!id ? toast.formSuccess(t, "update", "USER") : toast.formSuccess(t, "create", "USER");
                if (onSaveComplete) onSaveComplete(user);
            }
            catch (e) {
                console.error("Unable to save entity", e);
                !!id ? toast.formSuccess(t, "update", "USER") : toast.formSuccess(t, "create", "USER");
                if (onSaveError) onSaveError(e);
            }
        },
    });

    useEffect(async () => {
        if (id && !user.id) {
            const api = new UserApi();

            const entity = await api.findById(id);
            if (!entity) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: "USER" }, { translateProps: true }));
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
                />
                {!id && 
                    <BaseInput
                    className="col-6 mt-1"
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
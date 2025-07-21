import { useFormik } from 'formik';
import { useTranslation } from '../../../hooks/use-translation';
import { Row } from 'react-bootstrap';
import BaseInput from '../base-input';
import BaseInputPhone from '../base-input-phone';
import BaseCheck from '../base-check';
import EntityForm from '../../layouts/page/entity-form';
import { UserEntity } from '../../../models/user/user.entity';
import UserApi from '../../../pages/api/user';
import { formSuccess } from '../../../utils/toast';
import { toast } from 'react-toastify';
import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { BaseFormProps } from './base-form-props';
import { useEffect } from 'react';
import { useAuth } from '../../../hooks/use-auth';
// import { RoleSelect } from "../entities/role-select";

export interface UserFormProps extends BaseFormProps<UserEntity> {}

export function UserForm(props: UserFormProps) {
  const { t } = useTranslation();
  let { className, entity, onSaveComplete, onSaveError } = props;

  const { user, hasPermission } = useAuth();

  // const { company } = useAuth();

  const form = useFormik({
    initialValues: new UserEntity(),
    validationSchema: UserEntity.yupSchema(),
    onSubmit: async (dto) => {
      if (dto.cell_number?.length < 7) delete dto.cell_number;
      if (dto.contact_number?.length < 7) delete dto.contact_number;

      const api = new UserApi();
      try {
        let user = null;
        if (entity?.id) {
          user = await api.update(entity.id, dto);
        } else {
          user = await api.create(dto);
        }
        formSuccess(t, !!entity?.id ? 'update' : 'create', 'USER');
        if (onSaveComplete) onSaveComplete(user);
      } catch (e) {
        console.error('Unable to save entity', e.response);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: 'UNABLE_TO_SIGNUP',
        });

        if (onSaveError) onSaveError(e);
      }
    },
  });

  useEffect(() => {
    if (entity && !form.dirty) form.setValues(entity);
  }, [entity]);

  return (
    <EntityForm className={className} onSubmit={form.handleSubmit} formik={form} id={entity?.id}>
      <Row className="mt-2">
        <BaseInput
          className="col-6 mt-1"
          label="FIRST_NAME"
          name="first_name"
          required
          displayPlaceholder
          formik={form}
        />
        <BaseInput
          className="col-6 mt-1"
          label="LAST_NAME"
          name="last_name"
          required
          displayPlaceholder
          formik={form}
        />
        <BaseInputPhone className="col-6 mt-1" label="phone" name="contact_number" formik={form} />
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
          displayPlaceholder
          formik={form}
        />
        {/* <RoleSelect
                    className="col-12 mt-1"
                    label="ROLE"
                    name="roles[0]"
                    required
                    displayPlaceholder
                    formik={form}
                    /> */}

        {!entity?.id && (
          <BaseInput
            className="col-12 mt-1"
            label="PASSWORD"
            required
            type="password"
            name="password"
            formik={form}
          />
        )}

        {entity?.id && hasPermission('CanUpdateUser') && (
          <div className="col-12 mt-3">
            <BaseCheck label="Disable User" name="company_disabled" formik={form} />
            <div className="mt-2">
              <small className="text-muted">
                When disabled, this user will be immediately logged out and unable to log back in
                until re-enabled by a company administrator.
              </small>
              <br />
              <small className="text-danger">
                <strong>
                  This action takes effect immediately and will terminate any active sessions.
                </strong>
              </small>
            </div>
          </div>
        )}
      </Row>
    </EntityForm>
  );
}

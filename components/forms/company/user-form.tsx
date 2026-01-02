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
import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/use-auth';
import { useUnsavedChangesWarning } from '../../../hooks/use-unsaved-changes-warning';
import BaseMultiSelect from '../base-multiselect';
// import { RoleSelect } from "../entities/role-select";

export interface UserFormProps extends BaseFormProps<UserEntity> {}

export function UserForm(props: UserFormProps) {
  const { t } = useTranslation();
  let { className, entity, onSaveComplete, onSaveError } = props;

  const { user, hasPermission } = useAuth();
  const [availableCompanies, setAvailableCompanies] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  // const { company } = useAuth();

  const form = useFormik({
    initialValues: new UserEntity(),
    validationSchema: UserEntity.yupSchema(),
    // @ts-ignore - context is used by Yup validation but not recognized by FormikConfig types
    context: { isSuperAdmin: user?.jwt?.super_admin },
    onSubmit: async (dto) => {
      if (dto.cell_number?.length < 7) delete dto.cell_number;
      if (dto.contact_number?.length < 7) delete dto.contact_number;

      // Transform payload based on user type
      const payload = { ...dto };
      if (user?.jwt?.super_admin && dto.company_ids?.length > 0) {
        // Super admin - send company_ids
        console.log('🚀 Super admin - sending company_ids:', dto.company_ids);
        delete payload.company;
      } else if (user?.company) {
        // Regular admin - send single company
        console.log('🚀 Regular admin - sending single company:', user.company);
        payload.company = user.company;
        delete payload.company_ids;
      }

      console.log('📤 Payload being sent to backend:', payload);

      const api = new UserApi();
      try {
        let savedUser = null;
        if (entity?.id) {
          savedUser = await api.update(entity.id, payload);
        } else {
          savedUser = await api.create(payload);
        }
        console.log('📥 Response from backend:', savedUser);
        console.log('📥 User companies in response:', savedUser?.companies);

        formSuccess(t, !!entity?.id ? 'update' : 'create', 'USER');
        // Reset dirty state after successful save to prevent unsaved changes warning
        form.resetForm({ values: savedUser });
        if (onSaveComplete) onSaveComplete(savedUser);
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
    if (entity && !form.dirty) {
      const values = { ...entity };

      // If editing user with multiple companies, extract IDs
      if (entity.companies && entity.companies.length > 0) {
        values.company_ids = entity.companies.map((c) => c.id);
      }

      form.setValues(values);
    }
  }, [entity]);

  // Load available companies for super admins
  useEffect(() => {
    const isSuperAdmin = user?.jwt?.super_admin;
    const managedCompanies = user?.jwt?.companies || [];

    console.log('🔍 Debug - isSuperAdmin:', isSuperAdmin);
    console.log('🔍 Debug - managedCompanies:', managedCompanies);
    console.log('🔍 Debug - user object:', user);

    if (isSuperAdmin && managedCompanies.length > 0) {
      setAvailableCompanies(managedCompanies);

      // Format options for react-select (needs {value, label} format)
      const formatted = managedCompanies.map((c) => ({
        value: c.id,
        label: c.name,
      }));
      setCompanyOptions(formatted);
      console.log('✅ Setting company options:', formatted);

      // Pre-select all companies for new users (but only if the form hasn't been submitted yet)
      if (!entity?.id && !form.dirty && !form.isSubmitting && form.submitCount === 0) {
        const companyIds = managedCompanies.map((c) => c.id);
        console.log('✅ Pre-selecting company IDs:', companyIds);
        form.setFieldValue('company_ids', companyIds);
      }
    } else {
      console.log('❌ Conditions not met - super admin check or no companies');
    }
  }, [user, entity]);

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !form.isSubmitting,
  });

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .btn-check:checked + .btn-outline-primary {
          background-color: #0d6efd !important;
          border-color: #0d6efd !important;
          color: white !important;
        }
        .btn-check:checked + .btn-outline-primary:hover {
          background-color: #0b5ed7 !important;
          border-color: #0a58ca !important;
        }
      `}</style>
      {unsavedChangesWarning}
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

        {/* Company multi-select for super admins */}
        {(() => {
          const shouldShow = user?.jwt?.super_admin && companyOptions.length > 0;
          console.log('🎨 Render check - shouldShow:', shouldShow, {
            isSuperAdmin: user?.jwt?.super_admin,
            optionsCount: companyOptions.length,
            options: companyOptions
          });
          return shouldShow;
        })() && (
          <>
            <BaseMultiSelect
              className="col-12 mt-3"
              label="COMPANIES"
              name="company_ids"
              required
              formik={form}
              options={companyOptions}
              placeholder="SELECT_COMPANIES"
              displayPlaceholder
            />
            <div className="col-12">
              <small className="text-muted">{t('MULTI_COMPANY_USER_HELPER_TEXT')}</small>
            </div>
          </>
        )}

        {/* Read-only company display for regular admins */}
        {!user?.jwt?.super_admin && user?.company && (
          <div className="col-12 mt-3">
            <label className="form-label">{t('COMPANY')}</label>
            <div className="form-control-plaintext">{user.company.name}</div>
            <small className="text-muted">{t('COMPANY_AUTO_ASSIGNED')}</small>
          </div>
        )}

        {/* <RoleSelect
                    className="col-12 mt-1"
                    label="ROLE"
                    name="roles[0]"
                    required
                    displayPlaceholder
                    formik={form}
                    /> */}

        <div className="col-12 mt-3">
          <label className="form-label">
            {t('USER_ROLE')}
            <span className="text-danger">*</span>
          </label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="user_role"
              id="role-regular"
              value="false"
              checked={form.values.company_admin === false}
              onChange={() => form.setFieldValue('company_admin', false)}
            />
            <label className="btn btn-outline-primary" htmlFor="role-regular">
              {t('REGULAR_USER')}
            </label>

            <input
              type="radio"
              className="btn-check"
              name="user_role"
              id="role-admin"
              value="true"
              checked={form.values.company_admin === true}
              onChange={() => form.setFieldValue('company_admin', true)}
            />
            <label className="btn btn-outline-primary" htmlFor="role-admin">
              {t('COMPANY_ADMIN')}
            </label>
          </div>
        </div>

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
    </>
  );
}

import { toast } from 'react-toastify';
import { Col, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../../../hooks/use-auth';
import { useTranslation } from '../../../../hooks/use-translation';

import { globalAjaxExceptionHandler } from '../../../../utils/ajax';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import EntityForm from '../../../../components/layouts/page/entity-form';
import BaseInputPhone from '../../../../components/forms/base-input-phone';
import BaseInput from '../../../../components/forms/base-input';

import UserApi from '../../../api/user';
import { ChangePasswordDto } from '../../../../models/auth/change-password.dto';

const profileSchema = yup.object({
  first_name: yup.string().required().nullable(),
  last_name: yup.string().required().nullable(),
  email: yup.string().email().required().nullable(),
  contact_number: yup.string().nullable(),
  cell_number: yup.string().nullable(),
});

export default function Profile() {
  const { t } = useTranslation();

  const { user, updateUser } = useAuth();

  const form = useFormik({
    initialValues: user,
    enableReinitialize: true,
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      const api = new UserApi();

      try {
        const updatedUser = await api.me.update(values);
        updateUser({
          ...user,
          ...updatedUser,
          company: user.company,
        });
        toast.success(t('successfully_saved_information'));
      } catch (e) {
        console.error('Unable to save user', e);
        globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast });
      }
    },
  });

  const passwordForm = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: ChangePasswordDto.yupSchema(),
    onSubmit: async (values) => {
      const api = new UserApi();

      try {
        await api.changePassword(values);
        toast.success(t('SUCCESS_RESET_PASSWORD'));
        passwordForm.resetForm();
      } catch (e) {
        console.error('Unable to change password', e);
        globalAjaxExceptionHandler(e, { formik: passwordForm, t: t, toast: toast });
      }
    },
  });
  return (
    <PageLayout title="MY_PROFILE">
      <EntityForm id={user?.id} canSubmit={true} onSubmit={form.handleSubmit}>
        <Row>
          <BaseInput
            className="col-sm-6 mt-1"
            label="FIRST_NAME"
            name="first_name"
            required
            displayPlaceholder
            formik={form}
          />
          <BaseInput
            className="col-sm-6 mt-1"
            label="LAST_NAME"
            name="last_name"
            required
            displayPlaceholder
            formik={form}
          />

          <BaseInputPhone
            className="col-sm-6 mt-1"
            label="phone"
            name="contact_number"
            displayPlaceholder
            formik={form}
          />

          <BaseInputPhone
            className="col-sm-6 mt-1"
            label="phone_cell"
            name="cell_number"
            displayPlaceholder
            formik={form}
          />
          <BaseInput
            className="col-12 mt-1"
            label="EMAIL"
            name="email"
            displayPlaceholder
            formik={form}
          />
        </Row>
      </EntityForm>

      {/* Password Change Form */}
      <div className="mt-5">
        <h4>{t('CHANGE_PASSWORD')}</h4>
        <EntityForm formik={passwordForm} submitLabel="CHANGE_PASSWORD">
          <Row>
            <BaseInput
              className="col-12 mt-1"
              label="CURRENT_PASSWORD"
              name="oldPassword"
              type="password"
              required
              displayPlaceholder
              formik={passwordForm}
            />
            <BaseInput
              className="col-sm-6 mt-1"
              label="NEW_PASSWORD"
              name="password"
              type="password"
              required
              displayPlaceholder
              formik={passwordForm}
            />
            <BaseInput
              className="col-sm-6 mt-1"
              label="CONFIRM_PASSWORD"
              name="passwordConfirm"
              type="password"
              required
              displayPlaceholder
              formik={passwordForm}
            />
          </Row>
        </EntityForm>
      </div>
    </PageLayout>
  );
}

Profile.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

import { toast } from 'react-toastify'
import { Col, Row } from "react-bootstrap";

import { useFormik } from "formik";
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from "../../../../hooks/useTranslation";

import { globalAjaxExceptionHandler } from "../../../../utils/ajax";

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../components/layouts/page/PageLayout";
import EntityForm from "../../../../components/layouts/page/EntityForm";
import BaseInputPhone from "../../../../components/forms/BaseInputPhone";
import BaseInput from "../../../../components/forms/BaseInput";

import UserApi from "../../../api/user";
import { UserEntity } from "../../../../models/user/user.entity";

export default function Profile() {
  const { t } = useTranslation();

  const { user, updateUser } = useAuth();

  const form = useFormik({
    initialValues: user,
    validationSchema: UserEntity.yupSchema(),
    onSubmit: async (values) => {
      const api = new UserApi();

      try {
        const updatedUser = await api.me.update(values);
        updateUser({
          ...user,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          name: updatedUser.name,
          contact_number: updatedUser.contact_number,
          cell_number: updatedUser.cell_number
        });
        toast.success(t("successfully_saved_information"));
      }
      catch (e) {
        console.error("Unable to save user", e);
        globalAjaxExceptionHandler(e, { formik: form, t: t, toast: toast });
      }
    }
  });

  return (
    <PageLayout
      title="MY_PROFILE"
    >
      <EntityForm
        id={user.id}
        canSubmit={true}
        onSubmit={form.handleSubmit}
      >
        <Row>
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
            placeholder
            formik={form}
          />

          <BaseInputPhone
            className="col-6 mt-1"
            label="phone_cell"
            name="cell_number"
            placeholder
            formik={form}
          />
          <BaseInput
            className="col-12 mt-1"
            label="EMAIL"
            name="email"
            readOnly
            placeholder
            formik={form}
          />
        </Row>
      </EntityForm>
    </PageLayout>
  )
};

Profile.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

import { Col, Row } from "reactstrap";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { useFormik } from "formik";

// layouts
import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";

// hooks
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";

// inputs
import BaseInputPhone from "../../../../components/forms/base-input-phone";
import BaseInput from "../../../../components/forms/base-input";

// api
import UserApi from "../../../api/user";
import ApplicantApi from "../../../api/applicant";

// entities
import { UserEntity } from "../../../../models/user/user.entity";

import * as toast from "../../../../utils/toast";
import EntityForm from "../../../../components/layouts/page/entity-form";
import FileInput from "../../../../components/forms/file-input";

export default function Profile() {
  const { t } = useTranslation();

  const { user, updateUser } = useAuth();

  const form = useFormik({
    initialValues: new UserEntity(),
    validationSchema: UserEntity.yupSchema(),
    onSubmit: async (values) => {

      const userApi = new UserApi();
      const applicantApi = new ApplicantApi();

      try {
        await applicantApi.me.update({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.contact_number,
        });
        const savedUser = await userApi.me.update(values);

        updateUser({
          ...user,
          ...savedUser,
          photo: savedUser.photo || null
        });
        toast.formSuccess(t, "update", "USER");
      }
      catch (e) {
        console.error("Unable to save user", e);
        toast.formFailed(t, "update", "USER");
      }
    }
  });

  useEffect(() => {
    if (user) {
      form.setValues(user);
    }
  }, [user, form]);

  return (
    <PageLayout title="MY_ACCOUNT">
      <EntityForm
        id={user?.id}
        formik={form}
      >
        <Row>
          <BaseInput
            className="col-sm-6"
            label="first_name"
            name="first_name"
            placeholder="first_name"
            required
            formik={form}
          />
          <BaseInput
            className="col-sm-6"
            label="last_name"
            name="last_name"
            placeholder="last_name"
            required
            formik={form}
          />

          <BaseInputPhone
            className="col-sm-6"
            label="phone"
            name="contact_number"
            placeholder="phone"
            required
            formik={form}
          />
          <BaseInputPhone
            className="col-sm-6"
            label="phone_cell"
            name="cell_number"
            placeholder="phone_cell"
            formik={form}
          />
          <BaseInput
            className="col-12"
            label="email"
            name="email"
            placeholder="email"
            type="email"
            required
            formik={form}
          />
          <FileInput
            className="col-12"
            label={`photo`}
            name={`photo`}
            accept="image/*"
            documentType={"PHOTO"}
            allowedSizeInByte={3145728}
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

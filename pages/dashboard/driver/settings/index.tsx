import { Col, Row } from "reactstrap";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { useFormik } from "formik";

// layouts
import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import PageLayout from "../../../../components/layouts/page/PageLayout";

// hooks
import { useAuth } from '../../../../hooks/useAuth';
import { useTranslation } from "../../../../hooks/useTranslation";

// inputs
import BaseInputPhone from "../../../../components/forms/BaseInputPhone";
import BaseInput from "../../../../components/forms/BaseInput";

// api
import UserApi from "../../../api/user";
import ApplicantApi from "../../../api/applicant";

// entities
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { UserEntity } from "../../../../models/user/user.entity";

import * as toast from "../../../../utils/toast";

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
    form.setValues({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      contact_number: user.contact_number,
      cell_number: user.cell_number,
      timezone: user.timezone,
      language: user.language,
    });
  }, [ user ]);

  return (
    <PageLayout title="MY_ACCOUNT">
      <form onSubmit={form.handleSubmit} >
        <Row>
          <BaseInput
            className="col-6"
            label="first_name"
            name="first_name"
            placeholder="first_name"
            required
            formik={form}
          />
          <BaseInput
            className="col-6"
            label="last_name"
            name="last_name"
            placeholder="last_name"
            required
            formik={form}
          />

          <BaseInputPhone
            className="col-6"
            label="phone"
            name="contact_number"
            placeholder="phone"
            required
            formik={form}
          />
          <BaseInputPhone
            className="col-6"
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
            readOnly
            required
            formik={form}
          />
        </Row>
        <Row className="mt-2">
          <div className="col-12 border-0 text-end">
            <div className="col">
              <button type="submit" className={`btn btn-primary`} >
                {t("UPDATE")}
              </button>
            </div>
          </div>
        </Row>
      </form>
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

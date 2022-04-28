import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react'
import useRedirect from '../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";
import * as yup from "yup";
import "../../../../utils/yup";

import BaseInput from "../../../../components/forms/BaseInput";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

import { useTranslation } from "../../../../hooks/useTranslation";

import UserApi from "../../../api/user";

export default function Profile() {
  const { t } = useTranslation();

  const { authCompany } = useRedirect();

  authCompany();

  const router = useRouter();

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const form = useFormik({
    initialValues: {
      email: user.email,
      password: null,
      first_name: user.first_name,
      last_name: user.last_name,
      enabled_notifications: user.enabled_notifications || false,
      theme_color: user.theme_color || false,
      swipe_actions: user.swipe_actions || false,
      timezone: user.timezone,
      language: user.language,
      contact_number: user.contact_number,
      cell_number: user.cell_number
    },
    validationSchema: yup.object({
      email: yup.string().required(t("this_field_is_required")).nullable(),
      password: yup.string().nullable(),
      first_name: yup.string().required(t("this_field_is_required")).nullable(),
      last_name: yup.string().required(t("this_field_is_required")).nullable(),
      contact_number: yup.string().nullable(),
      cell_number: yup.string().nullable(),
    }),
    onSubmit: async (values) => {
      const dto = {
        first_name: values.first_name,
        last_name: values.last_name,
        name: `${values.first_name} ${values.last_name}`,
        contact_number: values.contact_number,
        cell_number: values.cell_number
      };
      const api = new UserApi();

      try {
        const updatedUser = await api.update(user.id, dto);
        setAuth({
          ...user,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          name: updatedUser.name,
          contact_number: updatedUser.contact_number,
          cell_number: updatedUser.cell_number
        });
        toast.success(t("successfully_saved_information"));
        setTimeout(() => {
          router.reload();
        }, 2000);
      }
      catch (e) {
        console.error("Unable to save company", e);
        toast.error(t("unable_to_save_information"));
      }

    }
  });

  return (
    <>
      <ToastContainer />
      <div>

        <Row>
          <h2>{t("MY_PROFILE")}</h2>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body" onSubmit={form.handleSubmit} >
            <Row>
              <BaseInput
                className="col-6 mt-1"
                label={t("FIRST_NAME")}
                name={`first_name`}
                required
                placeholder={t("FIRST_NAME")}
                value={form.values.first_name}
                touched={form.touched.first_name}
                error={form.errors.first_name}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <BaseInput
                className="col-6 mt-1"
                label={t("LAST_NAME")}
                name={`last_name`}
                required
                placeholder={t("LAST_NAME")}
                value={form.values.last_name}
                touched={form.touched.last_name}
                error={form.errors.last_name}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <BaseInput
                className="col-6 mt-1"
                label={t("phone")}
                name={`contact_number`}
                type="tel"
                placeholder={t("phone")}
                value={form.values.contact_number}
                touched={form.touched.contact_number}
                error={form.errors.contact_number}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <BaseInput
                className="col-6 mt-1"
                label={t("phone_cell")}
                name={`cell_number`}
                type="tel"
                placeholder={t("phone_cell")}
                value={form.values.cell_number}
                touched={form.touched.cell_number}
                error={form.errors.cell_number}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <BaseInput
                className="col-12 mt-1"
                label={t("EMAIL")}
                name={`email`}
                readOnly
                placeholder={t("EMAIL")}
                value={form.values.email}
                touched={form.touched.email}
                error={form.errors.email}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
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
        </div>
      </div>
    </>
  )
};

Profile.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

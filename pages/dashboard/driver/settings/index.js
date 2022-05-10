import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useImperativeHandle, useState } from 'react'
import useRedirect from '../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

import { useFormik } from "formik";
import * as yup from "yup";
import "../../../../utils/yup";

import BaseFile from "../../../../components/forms/BaseFile";
import BaseInput from "../../../../components/forms/BaseInput";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

import { useTranslation } from "../../../../hooks/useTranslation";

import UserApi from "../../../api/user";
import ApplicantApi from "../../../api/applicant";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";

/**
 * @type {ApplicantEntity}
 */
const APPLICANT_PROTO = null;

export default function Profile() {
  const { t } = useTranslation();

  const router = useRouter();

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const [ applicant, setApplicant ] = useState(APPLICANT_PROTO);

  const form = useFormik({
    initialValues: {
      first_name: null,
      last_name: null,
      email: null,
      contact_number: null,
      cell_number: null,
      timezone: null,
      language: null,
    },
    validationSchema: yup.object({
      first_name: yup.string().required().nullable(),
      last_name: yup.string().required().nullable(),
      contact_number: yup.string().required().nullable(),
      cell_number: yup.string().required().nullable(),
      timezone: yup.string().required().nullable().optional(),
      language: yup.string().required().nullable().optional(),
    }),
    onSubmit: async (values) => {
      const dto = {
        first_name: values.first_name,
        last_name: values.last_name,
        contact_number: values.contact_number,
        cell_number: values.cell_number,
        timezone: values.timezone,
        language: values.language,
      };

      const userApi = new UserApi();
      const applicantApi = new ApplicantApi();

      try {
        await applicantApi.update(applicant.id, {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.contact_number,
        });
        const savedUser = await userApi.update(user.id, dto);
        setAuth({
          ...user,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          contact_number: savedUser.contact_number,
          cell_number: savedUser.cell_number,
          timezone: savedUser.timezone,
          language: savedUser.language,
        });
        toast.success(t("successfully_saved_information"));
        setTimeout(router.reload, 2000);
      }
      catch (e) {
        console.error("Unable to save user", e);
        toast.error(t("unable_to_save_information"));
      }

    }
  });

  useEffect(async () => {
    const applicant = await new ApplicantApi().getByUserId();

    setApplicant(applicant);

    form.setValues({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      contact_number: user.contact_number,
      cell_number: user.cell_number,
      timezone: user.timezone,
      language: user.language,
    });
  }, [ ]);

  return (
    <>
      <ToastContainer />
      <div>

        <Row>
          <h2>{t("MY_ACCOUNT")}</h2>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body" onSubmit={form.handleSubmit} >
            <Row>
              <BaseInput
                  className="col-6"
                  label={t("first_name")}
                  name="first_name"
                  placeholder={t("first_name")}
                  value={form.values.first_name}
                  touched={form.touched.first_name}
                  error={form.errors.first_name}
                  onChange={form.handleChange}
                  handleBlur={form.handleBlur}
                />
              <BaseInput
                  className="col-6"
                  label={t("last_name")}
                  name="last_name"
                  placeholder={t("last_name")}
                  value={form.values.last_name}
                  touched={form.touched.last_name}
                  error={form.errors.last_name}
                  onChange={form.handleChange}
                  handleBlur={form.handleBlur}
                />
              <BaseInput
                  className="col-6"
                  label={t("phone")}
                  name="contact_number"
                  placeholder={t("phone")}
                  type="tel"
                  value={form.values.contact_number}
                  touched={form.touched.contact_number}
                  error={form.errors.contact_number}
                  onChange={form.handleChange}
                  handleBlur={form.handleBlur}
                />
              <BaseInput
                  className="col-6"
                  label={t("phone_cell")}
                  name="cell_number"
                  placeholder={t("phone_cell")}
                  type="tel"
                  value={form.values.cell_number}
                  touched={form.touched.cell_number}
                  error={form.errors.cell_number}
                  onChange={form.handleChange}
                  handleBlur={form.handleBlur}
                />
              <BaseInput
                  className="col-12"
                  label={t("email")}
                  name="email"
                  placeholder={t("email")}
                  type="email"
                  readOnly={true}
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

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

import { useTranslation } from "react-i18next";

import CompanyApi from "../../../api/company";

export default function Settings() {
  const { t } = useTranslation();

  const { authCompany } = useRedirect();

  authCompany();

  const router = useRouter();

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const form = useFormik({
    initialValues: {
      name: null,
      about: null
    },
    validationSchema: yup.object({
      name: yup.string().required(t("this_field_is_required")).nullable(),
      about: yup.string().nullable()
    }),
    onSubmit: async (values) => {
      const dto = {
        name: values.name,
        about: values.about
      };
      const api = new CompanyApi();

      try {
        const company = await api.update(dto);
        setAuth({
          ...user,
          company: {
            ...user.company,
            name: company.name,
            about: company.about
          }
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

  useEffect(async () => {
    const api = new CompanyApi();

    const company = await api.getById();

    form.setValues({
      name: company.name,
      about: company.about
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <div>

        <Row>
          <h2>{t("COMPANY")}</h2>
        </Row>
        <div className='container-fluid'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body" onSubmit={form.handleSubmit} >
            <Row>
              <BaseInput
                className="col-12"
                label={t("NAME")}
                name={`name`}
                required
                placeholder={t("NAME")}
                value={form.values.name}
                touched={form.touched.name}
                error={form.errors.name}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <BaseTextArea
                className="col-12"
                label={t("ABOUT")}
                name={`about`}
                rows={3}
                placeholder={t("ABOUT")}
                value={form.values.about}
                touched={form.touched.about}
                error={form.errors.about}
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

Settings.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

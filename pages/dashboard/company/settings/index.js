import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Row } from "reactstrap";
import { useAuth } from '../../../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";
import "../../../../utils/yup";

import BaseInput from "../../../../components/forms/BaseInput";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

import { useTranslation } from "../../../../hooks/useTranslation";

import CompanyApi from "../../../api/company";

import FileInput from "../../../../components/forms/FileInput";
import { CompanyEntity } from "../../../../models/company/company.entity";
import { DocumentType } from "../../../../models/documents/document.entity";

export default function Settings() {
  const { t } = useTranslation();

  const { user, updateUser } = useAuth();

  const form = useFormik({
    initialValues: new CompanyEntity(),
    validationSchema: CompanyEntity.yupSchema(),
    onSubmit: async (values) => {
      const api = new CompanyApi();

      try {
        const company = await api.update(values);
        updateUser({
          ...user,
          company: {
            ...user.company,
            name: company.name,
            about: company.about,
            photo: company.photo
          }
        })
        toast.success(t("successfully_saved_information"));
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

    form.setValues(company);

  }, []);

  return (
    <>
      <ToastContainer />
      <div>

        <Row>
          <h2>{t("COMPANY")}</h2>
        </Row>
        <div className='container-fluid p-0'>
          <div className="modal-header border-0">
          </div>
          <form className="modal-body p-0" onSubmit={form.handleSubmit} >
            <Row>
              <BaseInput
                className="col-12"
                label={t("NAME")}
                name={`name`}
                required
                placeholder={t("NAME")}
                formik={form}
                />
              <BaseInput
                className="col-12"
                label={t("WEBSITE")}
                name={`website`}
                placeholder="http://www.example.com"
                formik={form}
                />
              <BaseTextArea
                className="col-12"
                label={t("ABOUT")}
                name={`about`}
                rows={3}
                placeholder={t("ABOUT")}
                formik={form}
                />
              <FileInput
                className="col-12"
                label={`photo`}
                name={`photo`}
                accept="image/*"
                documentType={DocumentType.PHOTO}
                formik={form}
              />
            </Row>
            <Row className="mt-2">
                <div className="col-12 border-0 text-right">
                    <div className="col">
                        <button type="submit" className={`theme-secondary-btn`} >
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

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Row } from "reactstrap";
import useAuth from '../../../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import useRedirect from '../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useFormik } from "formik";
import "../../../../utils/yup";

import BaseInput from "../../../../components/forms/BaseInput";
import BaseTextArea from "../../../../components/forms/BaseTextArea";

import { useTranslation } from "../../../../hooks/useTranslation";

import CompanyApi from "../../../api/company";
import DocumentApi from "../../../api/document";

import FileInput from "../../../../components/forms/FileInput";
import { CompanyEntity } from "../../../../models/company/company.entity";

export default function Settings() {
  const { t } = useTranslation();

  const { authCompany } = useRedirect();

  authCompany();

  const router = useRouter();

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const form = useFormik({
    initialValues: new CompanyEntity,
    validationSchema: CompanyEntity.yupSchema(),
    onSubmit: async (values) => {
      const dto = {
        name: values.name,
        about: values.about,
        website: values.website,
        photo: values.photo
      };

      const api = new CompanyApi();

      try {
        const company = await api.update(dto);
        setAuth({
          ...user,
          company: {
            ...user.company,
            name: company.name,
            about: company.about,
            photo: company.photo
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
    const documentApi = new DocumentApi();

    const company = await api.getById();

    form.setValues({
      name: company.name,
      about: company.about,
      website: company.website,
      photo: company.photo
    });

  }, []);

      /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
       const uploadHandler = async (e) => {
        e.preventDefault();
        const { target: { name, files } } = e;
    
        let photo = null;
  
        if (files && files[0]) {
          const file = files[0];
  
          photo = {
            visibility: "PUBLIC",
            name: file.name,
            mime_type: file.type,
            path: URL.createObjectURL(file),
            file_base64: await getBase64(file)
          };
        }
  
        form.setFieldValue(name, photo);
    }

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
                value={form.values.about}
                touched={form.touched.about}
                error={form.errors.about}
                onChange={form.handleChange}
                handleBlur={form.handleBlur}
                />
              <FileInput
                className="col-12"
                label={t("photo")}
                name={`photo`}
                accept="image/*"
                formik={form}
              />
            </Row>
            <Row className="mt-2">
                <div className="col-12 border-0 text-right">
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

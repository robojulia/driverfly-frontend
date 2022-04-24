import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row } from "reactstrap";
import useAuth from '../../../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
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

import { useTranslation } from "react-i18next";

import CompanyApi from "../../../api/company";
import DocumentApi from "../../../api/document";
import { getBase64 } from "../../../../utils/file";

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
      about: null,
      website: null,
      photo: null,
    },
    validationSchema: yup.object({
      name: yup.string().required(t("this_field_is_required")).nullable(),
      about: yup.string().nullable(),
      website: yup.string().url(t("MUST_BE_A_VALID_URL")).nullable(),
      photo: yup.object({}).nullable(),
    }),
    onSubmit: async (values) => {
      const dto = {
        name: values.name,
        about: values.about,
        website: values.website,
        photo: values.photo?.file_base64 ? {
          visibility: values.photo.visibility,
          name: values.photo.name,
          mime_type: values.photo.mime_type,
          file_base64: values.photo.file_base64
        } : null
      };
      if (values.photo && !values.photo.file_base64 && values.photo.id)
        delete dto.photo;

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
  const [ pdfModel, set_pdfModel ] = useState({
      name: null,
      url: null,
    });

  const viewHandler = async (e) => {
      e.preventDefault();
      const { target: { name } } = e;
  
      const file = form.getFieldMeta(name).value;
      console.log(file);
  
      let url = file.path;

      if (file.id) {
          const api = new DocumentApi();
          const document = await api.getSignedUrl(file.id);
          url = document.path;
      }
  
      set_pdfModel({
        name: file.name,
        url: url
      });
    }
  
    const hideModelHandler = (e) => {
      set_pdfModel({
        name: null, url: null
      });
    }

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
              <BaseInput
                className="col-12"
                label={t("WEBSITE")}
                name={`website`}
                placeholder="http://www.example.com"
                value={form.values.website}
                touched={form.touched.website}
                error={form.errors.website}
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
              <BaseFile
                  className="col-12"
                  label={t("photo")}
                  name={`photo`}
                  accept="image/*"
                  value={form.values.photo}
                  onChange={uploadHandler}
                  onView={viewHandler}
                  onDelete={uploadHandler}
                  handleBlur={form.handleBlur}
                  touched={form.touched.photo}
                  error={form.errors.photo}
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
      <Modal show={!!pdfModel.name} onHide={() => hideModelHandler()}>
        <Modal.Header>{pdfModel.name}</Modal.Header>

        <Modal.Body>
        {(
            pdfModel.name &&
                <img className="img-thumbnail" src={pdfModel.url} />
        )}
        </Modal.Body>

        <Modal.Footer>
            <Button variant="secondary" onClick={() => hideModelHandler()}>{t("close")}</Button>
        </Modal.Footer>

      </Modal>
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

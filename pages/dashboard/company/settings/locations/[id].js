import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "react-i18next";

import {ArrowLeft} from 'react-bootstrap-icons';

import LocationApi from "../../../../api/location";
import { useRouter } from "next/router"

import { useFormik } from "formik"
import * as yup from "yup"

import "../../../../../utils/yup";

import stateList from "../../../../../utils/stateList";

import BaseInput from "../../../../../components/forms/BaseInput";
import BaseSelect from "../../../../../components/forms/BaseSelect";

export default function Location() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/locations";

    if (isNaN(parseInt(id))) id = null; // create mode

    const { t } = useTranslation();

    const { authCompany } = useRedirect();

    authCompany()

    const { authCheck, setAuth } = useAuth();
    const user = authCheck();

    const form = useFormik({
        initialValues: {
            street: null,
            city: null,
            state: null,
            zip_code: null,
        },
        validationSchema: yup.object({
            street: yup.string().required(t("this_field_is_required")).nullable(),
            city: yup.string().required(t("this_field_is_required")).nullable(),
            state: yup.string().required(t("this_field_is_required")).nullable(),
            zip_code: yup.string().required(t("this_field_is_required")).nullable(),
        }),
        onSubmit: async (values) => {
            const dto = {
                street: values.street,
                city: values.city,
                state: values.state,
                zip_code: values.zip_code
            };

            const api = new LocationApi();

            try {
                if (id) {
                    await api.update(id, dto);
                }
                else {
                    await api.create(dto);
                }
                toast.success(t("successfully_saved_information"));
                setTimeout(
                    () => {
                        router.push(backPath);
    
                    },
                    3000);
            }
            catch (e) {
                console.error("Unable to save location", e);
                toast.error(t("unable_to_save_information"));
            }
    }
    });

    useEffect(async () => {
        if (id) {
            const api = new LocationApi();

            const location = await api.getById(id);

            if (!location) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("LOCATION") }));
                setTimeout(
                    () => {
                        router.push(backPath);
    
                    },
                    3000);
                return;
            }

            form.setValues({
                street: location.street,
                city: location.city,
                state: location.state,
                zip_code: location.zip_code
            });
        }
    }, [ id ]);

      const handleBack = (e) => {
          e.preventDefault();
          router.push(backPath);

      }

  return (
    <>
      <ToastContainer />
      <h2>
        <span style={{cursor: "pointer"}} onClick={handleBack}><ArrowLeft /></span>
          {t(id ? "EDIT_LOCATION" : "CREATE_LOCATION")}
        </h2>
      <div className="container_fluid">
          <form className="model-body mt-4" onSubmit={form.handleSubmit}>
            <Row>
                <BaseInput
                    className="col-sm-12"
                    label={t("STREET")}
                    name={`street`}
                    required
                    placeholder={t("STREET")}
                    value={form.values.street}
                    touched={form.touched.street}
                    error={form.errors.street}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
            </Row>
            <Row>
                <BaseInput
                    className="col-sm-4"
                    label={t("CITY")}
                    name={`city`}
                    required
                    placeholder={t("CITY")}
                    value={form.values.city}
                    touched={form.touched.city}
                    error={form.errors.city}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                <BaseSelect
                    className={`col-sm-4`}
                    label={t("STATE")}
                    name="state"
                    placeholder={t("STATE")}
                    options={stateList}
                    value={form.values.state}
                    touched={form.touched.state}
                    error={form.errors.state}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                <BaseInput
                    className="col-sm-4"
                    label={t("ZIP_CODE")}
                    name={`zip_code`}
                    required
                    placeholder={t("ZIP_CODE")}
                    value={form.values.zip_code}
                    touched={form.touched.zip_code}
                    error={form.errors.zip_code}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
              </Row>
              <Row className="mt-2">
                <div className="col-12 border-0 text-end">
                    <div className="col">
                        <button type="submit" className={`btn btn-primary`} >
                        {t(id ? "UPDATE" : "CREATE")}
                        </button>
                    </div>
                </div>
              </Row>
          </form>
      </div>
    </>
  )
};

Location.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

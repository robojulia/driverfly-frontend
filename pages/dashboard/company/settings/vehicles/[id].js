import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"


import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import VehicleApi from "../../../../api/vehicle";
import DocumentApi from "../../../../api/document";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../../../../enums/vehicles/vehicle-accessory.enum";
import { VehicleTransmissionType } from "../../../../../enums/vehicles/vehicle-transmission-type.enum";
import VehicleEntity from "../../../../../models/company/vehicle.entity";
import { useRouter } from "next/router"

import { useFormik } from "formik"
import * as yup from "yup"

import { getBase64 } from "../../../../../utils/file";

import "../../../../../utils/yup";

import BaseInput from "../../../../../components/forms/BaseInput";
import BaseSelect from "../../../../../components/forms/BaseSelect";
import BaseCheckList from "../../../../../components/forms/BaseCheckList";
import BaseTextArea from "../../../../../components/forms/BaseTextArea";
import BaseFile from "../../../../../components/forms/BaseFile";

import { preventNegative, positiveInt } from "../../../../../utils/input";
import Link from "next/link";

export default function Vehicle() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/vehicles";

    if (isNaN(parseInt(id))) id = null; // create mode

    const { t } = useTranslation();

    const { authCompany } = useRedirect();

    authCompany()

    const { authCheck, setAuth } = useAuth();
    const user = authCheck();

    const form = useFormik({
        initialValues: {
            type: null,
            type_other: null,
            trailer_type: null,
            trailer_type_other: null,
            transmission_type: null,
            make: null,
            model: null,
            year: null,
            photo: null,
            accessories: [],
            accessory_other: null
        },
        validationSchema: yup.object({
            type: yup.string().enum(VehicleType).required(t("this_field_is_required")).nullable(),
            type_other: yup.string().when("type", {
                is: VehicleType.OTHER,
                then: yup.string().required(t("this_field_is_required")).nullable(),
            }).nullable(),
            trailer_type: yup.string().enum(VehicleTrailerType).nullable(),
            trailer_type_other: yup.string().when("trailer_type", {
                is: VehicleTrailerType.OTHER,
                then: yup.string().required(t("this_field_is_required")).nullable(),
            }).nullable(),
            transmission_type: yup.string().enum(VehicleTransmissionType).nullable(),
            make: yup.string().nullable(),
            model: yup.string().nullable(),
            year: yup.number().nullable(),
            photo: yup.object({}).nullable(),
            accessories: yup.array(
                yup.string().enum(VehicleAccessory)
            ),
            accessory_other: yup.string().when("accessories", {
                is: v => v.includes(VehicleAccessory.OTHER),
                then: yup.string().required(t("this_field_is_required")).nullable(),
            }).nullable(),
        }),
        onSubmit: async (values) => {
            const dto = {
                type: values.type,
                type_other: values.type_other,
                trailer_type: values.trailer_type,
                trailer_type_other: values.trailer_type_other,
                transmission_type: values.transmission_type,
                make: values.make,
                model: values.model,
                year: values.year,
                accessories: values.accessories || [],
                accessory_other: values.accessory_other,
                photo: values.photo?.file_base64 ? {
                    visibility: values.photo.visibility,
                    name: values.photo.name,
                    mime_type: values.photo.mime_type,
                    file_base64: values.photo.file_base64
                } : null
            };
            if (values.photo && !values.photo.file_base64 && values.photo.id)
                delete dto.photo;

            const api = new VehicleApi();

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
                console.error("Unable to save vehicle", e);
                toast.error(t("unable_to_save_information"));
            }
    }
    });

    useEffect(async () => {
        if (id) {
            const api = new VehicleApi();

            const vehicle = await api.getById(id);

            if (!vehicle) {
                toast.error(t("UNABLE_TO_FIND_{name}", { name: t("VEHICLE") }));
                setTimeout(
                    () => {
                        router.push(backPath);
    
                    },
                    3000);
                return;
            }

            form.setValues({
                type: vehicle.type,
                type_other: vehicle.type_other,
                trailer_type: vehicle.trailer_type,
                trailer_type_other: vehicle.trailer_type_other,
                transmission_type: vehicle.transmission_type,
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                accessories: vehicle.accessories || [],
                accessory_other: vehicle.accessory_other,
                photo: vehicle.photo ? {
                    id: vehicle.photo.id,
                    name: vehicle.photo.name,
                    path: vehicle.photo.path
                } : null
            });
        }
    }, [ id ]);

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

      const handleBack = (e) => {
          e.preventDefault();
          router.push(backPath);

      }

  return (
    <>
      <ToastContainer />
      <h2>
        <span style={{cursor: "pointer"}} onClick={handleBack}><ArrowBackIosNewIcon /></span>
          {t(id ? "EDIT_VEHICLE" : "CREATE_VEHICLE")}
        </h2>
      <div className="container_fluid">
          <form className="model-body mt-4" onSubmit={form.handleSubmit}>
              <Row>
                <BaseSelect
                    className={`col-sm-${form.values.type === VehicleType.OTHER ? 3 : 6}`}
                    label={t("TYPE")}
                    required
                    name="type"
                    placeholder={t("TYPE")}
                    enumType={VehicleType}
                    labelPrefix="VehicleType"
                    value={form.values.type}
                    touched={form.touched.type}
                    error={form.errors.type}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                {
                    form.values.type === VehicleType.OTHER &&
                    <BaseInput
                        className="col-sm-3"
                        label={t("OTHER")}
                        name={`type_other`}
                        required
                        placeholder={t("TYPE")}
                        value={form.values.type_other}
                        touched={form.touched.type_other}
                        error={form.errors.type_other}
                        onChange={form.handleChange}
                        handleBlur={form.handleBlur}
                        />
                }
                <BaseSelect
                    className={`col-sm-${form.values.trailer_type === VehicleTrailerType.OTHER ? 3 : 6}`}
                    label={t("TRAILER_TYPE")}
                    name="trailer_type"
                    placeholder={t("NONE")}
                    enumType={VehicleTrailerType}
                    labelPrefix="VehicleTrailerType"
                    value={form.values.trailer_type}
                    touched={form.touched.trailer_type}
                    error={form.errors.trailer_type}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                {
                    form.values.trailer_type === VehicleTrailerType.OTHER &&
                    <BaseInput
                        className="col-sm-3"
                        label={t("OTHER")}
                        name={`trailer_type_other`}
                        required
                        placeholder={t("TRAILER_TYPE")}
                        value={form.values.trailer_type_other}
                        touched={form.touched.trailer_type_other}
                        error={form.errors.trailer_type_other}
                        onChange={form.handleChange}
                        handleBlur={form.handleBlur}
                        />
                }
              </Row>
              <Row>
                <BaseSelect
                    className={`col-sm-3`}
                    label={t("TRANSMISSION")}
                    name="transmission_type"
                    placeholder={t("TRANSMISSION")}
                    enumType={VehicleTransmissionType}
                    labelPrefix="VehicleTransmissionType"
                    value={form.values.transmission_type}
                    touched={form.touched.transmission_type}
                    error={form.errors.transmission_type}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                <BaseInput
                    className="col-sm-3"
                    label={t("MAKE")}
                    name={`make`}
                    required
                    placeholder={t("MAKE")}
                    value={form.values.make}
                    touched={form.touched.make}
                    error={form.errors.make}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                <BaseInput
                    className="col-sm-3"
                    label={t("MODEL")}
                    name={`model`}
                    required
                    placeholder={t("MODEL")}
                    value={form.values.model}
                    touched={form.touched.model}
                    error={form.errors.model}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
                <BaseInput
                    className="col-sm-3"
                    label={t("YEAR")}
                    name={`year`}
                    type="number"
                    required
                    placeholder={t("YEAR")}
                    value={form.values.year}
                    touched={form.touched.year}
                    error={form.errors.year}
                    onKeyDown={positiveInt}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
              </Row>
              <Row>
                    <BaseFile
                        className="col-sm-4"
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
                  <BaseCheckList
                    className="col-sm-4"
                    label={t("ACCESSORIES")}
                    name="accessories"
                    cols={2}
                    value={form.values.accessories}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    touched={form.touched.accessories}
                    error={form.errors.accessories}
                    labelPrefix="VehicleAccessory"
                    enumType={VehicleAccessory}
                    />
                {
                    form.values.accessories.includes(VehicleAccessory.OTHER) &&
                    <BaseTextArea
                        className="col-sm-4"
                        label={t("OTHER")}
                        name="accessory_other"
                        required
                        rows="3"
                        placeholder={t("ACCESSORIES")}
                        value={form.values.accessory_other}
                        touched={form.touched.accessory_other}
                        error={form.errors.accessory_other}
                        onChange={form.handleChange}
                        handleBlur={form.handleBlur}
                        />
                }
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

Vehicle.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

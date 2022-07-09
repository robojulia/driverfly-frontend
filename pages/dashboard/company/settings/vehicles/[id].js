import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../../../../hooks/useTranslation";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"


import {ArrowLeft} from 'react-bootstrap-icons';

import VehicleApi from "../../../../api/vehicle";
import DocumentApi from "../../../../api/document";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../../../../enums/vehicles/vehicle-accessory.enum";
import { VehicleTransmissionType } from "../../../../../enums/vehicles/vehicle-transmission-type.enum";
import { VehicleEntity } from "../../../../../models/company/vehicle.entity";
import { useRouter } from "next/router"

import { useFormik } from "formik"
import * as yup from "yup"

import { getBase64 } from "../../../../../utils/file";

import "../../../../../utils/yup";

import BaseInput from "../../../../../components/forms/BaseInput";
import BaseSelect from "../../../../../components/forms/BaseSelect";
import BaseCheckList from "../../../../../components/forms/BaseCheckList";
import BaseTextArea from "../../../../../components/forms/BaseTextArea";

import { preventNegative, positiveInt } from "../../../../../utils/input";
import Link from "next/link";
import { VehicleForm } from "../../../../../components/forms/company/VehicleForm";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";

export default function Vehicle() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/vehicles";

    if (isNaN(parseInt(id))) id = null; // create mode

    const { authCompany } = useRedirect();

    authCompany()

    const goBack = () => {
        setTimeout(
            () => {
                router.push(backPath);

            },
            3000);
    }

  return (
    <>
        <ChildPageLayout
            title={id ? "EDIT_VEHICLE" : "CREATE_VEHICLE"}
            backPath={backPath}
            >
          <VehicleForm
            id={id}
            onSaveComplete={goBack}
            onLoadError={goBack}
            />
        </ChildPageLayout>
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

import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import Router from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "react-i18next";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";

import CompanyApi from "../../../../api/company";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../../../../enums/vehicles/vehicle-accessory.enum";
import VehicleEntity from "../../../../../models/company/vehicle.entity";

export default function VehicleList() {
  const { t } = useTranslation();

  const { authCompany } = useRedirect();

  authCompany()

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();
  console.log('user', user);

  const [ vehicles, setVehicles ] = useState([]);

  useEffect(async () => {
    const api = new CompanyApi(user.company.id);

    const v = await api.vehicles.get({ withPhoto: true });

    console.log(v);

    setVehicles(v);
  }, []);

  /**
   * 
   * @param {React.MouseEvent} e 
   */
  const onEditClick = (e) => {
    e.preventDefault();
    const { name } =  e.currentTarget;

    alert("trying to edit " + name)
  }

  /**
   * 
   * @param {React.MouseEvent} e 
   */
   const onDeleteClick = async (e) => {
    e.preventDefault();
    const { name } =  e.currentTarget;

    const api = new CompanyApi(user.company.id);

    await api.vehicles.remove(name);

    setVehicles(vehicles.filter(v => v.id != name));
  }


  return (
    <>
      <ToastContainer />
      <div className="container_fluid">

        <Row>
          <h1>{t("VEHICLES")}</h1>
        </Row>
        <Row className="mt-5">
          <div className="table-responsive">
              <Table striped>
                  <thead className="listing_head">
                      <tr>
                        <th>{t("PHOTO")}</th>
                        <th>{t("TYPE")}</th>
                        <th>{t("TRAILER")}</th>
                        <th>{t("TRANSMISSION")}</th>
                        <th>{t("MAKE")}</th>
                        <th>{t("MODEL")}</th>
                        <th>{t("YEAR")}</th>
                        <th>{t("ACCESSORIES")}</th>
                        <th>{/* ACTIONS */}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {!vehicles || !vehicles.length &&
                        <tr>
                          <td colSpan={9}>
                            {t("NO_{name}_FOUND", { name: t("VEHICLES") })}

                          </td>
                        </tr>
                      }
                      {vehicles && vehicles.map((v, i) => (
                        <tr key={i}>
                          <td>{v.photo && <img className="img-thumbnail" style={{maxWidth: "100px"}} src={v.photo.path} />}</td>
                          <td>{v.type === VehicleType.OTHER ? v.type_other : t(v.type.toLowerCase())}</td>
                          <td>{v.trailer_type === VehicleTrailerType.OTHER ? v.trailer_type_other : (v.trailer_type && t(`VehicleTrailerType.${v.trailer_type}`) || "")}</td>
                          <td>{t(v.transmission_type)}</td>
                          <td>{v.make}</td>
                          <td>{v.model}</td>
                          <td>{v.year}</td>
                          <td>
                            {v.accessories?.map((a, i) => (
                                a === VehicleAccessory.OTHER && v.accessory_other ? v.accessory_other : t(`VehicleAccessory.${a}`)
                              ))?.join(", ")}
                          </td>
                          <td>
                            <button name={v.id} className="btn" onClick={onEditClick}>
                              <EditIcon />
                            </button>
                            <button name={v.id} className="btn" onClick={onDeleteClick}>
                              <DeleteIcon />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
              </Table>
          </div>
        </Row>
      </div>
    </>
  )
};

VehicleList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

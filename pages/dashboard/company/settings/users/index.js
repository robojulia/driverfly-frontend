import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../../../../hooks/useTranslation";

import {PenFill, TrashFill} from 'react-bootstrap-icons';


import UserApi from "../../../../api/user";
import { VehicleType } from "../../../../../enums/vehicles/vehicle-type.enum";
import { VehicleTrailerType } from "../../../../../enums/vehicles/vehicle-trailer-type.enum";
import { VehicleAccessory } from "../../../../../enums/vehicles/vehicle-accessory.enum";
import { VehicleEntity } from "../../../../../models/company/vehicle.entity";
import ViewDataTable from "../../../../../components/viewDetails/viewDataTable";

export default function UserList() {

  const { authCompany } = useRedirect();
  authCompany();

  const { t } = useTranslation();
  const router = useRouter();
  // const { authCheck, setAuth } = useAuth();
  // const user = authCheck();
  // console.log('user', user);

  const [ users, setUsers ] = useState([]);

  useEffect(async () => {
    const api = new UserApi();

    const v = await api.list();

    console.log(v);

    setUsers(v);
  }, []);

  /**
   * 
   * @param {React.MouseEvent} e 
   */
   const onAddClick = (e) => {
    e.preventDefault();

    router.push(`${router.pathname}/create`);
  }

  /**
   * 
   * @param {React.MouseEvent} e 
   */
  const onEditClick = (e) => {
    e.preventDefault();
    const { name } =  e.currentTarget;

    router.push(`${router.pathname}/${name}`);
  }

  /**
   * 
   * @param {React.MouseEvent} e 
   */
   const onDeleteClick = async (e) => {
    e.preventDefault();
    const { name } =  e.currentTarget;

    const api = new VehicleApi();

    await api.remove(name);

    setVehicles(vehicles.filter(v => v.id != name));
  }


  return (
    <>
      <Row>
        <Col xs="10">
          <h2>{t("USERS")}</h2>
        </Col>
        <Col xs="2" className="text-right">
          <button className="btn btn-primary" onClick={onAddClick}>
            + {t("CREATE")}
          </button>
        </Col>
      </Row>
      <Row className="mt-5 my_company_users">
        <Col  lg="12">
          <ViewDataTable
            columns={[
                {
                    name: "job_title",
                    selector: j => j.title,
                    hidable: false
                },
                {
                    name: "location",
                    selector: j => buildAddress(j.location || {})
                },
                {
                    name: "drivers_needed",
                    selector: j => j.drivers_needed
                },
                {
                    name: "expiration_date",
                    selector: j => j.expiry_date ? new Date(j.expiry_date).toDateString() : null
                },
                {
                    name: "GEOGRAPHY",
                    selector: j => j.geography ? t("JobGeography." + j.geography) : null
                },
                {
                    name: "schedule",
                    selector: j => j.schedule ? t("JobSchedule." + j.schedule) : null
                },
                {
                    name: "employment_type",
                    selector: j => j.employment_type ? t("JobEmploymentType." + j.employment_type) : null
                },
                {
                    name: "delivery_type",
                    selector: j => j.delivery_type ? t("JobDeliveryType." + j.delivery_type) : null
                },
                {
                    name: "team_drivers",
                    selector: j => j.team_drivers ? t("JobTeamDriver." + j.team_drivers) : null
                },
            ]}
            actions={j => ([
                {
                    onClick: e => onEditClick(j.id),
                    label: (<><PenFill /> {t("EDIT")}</>)
                },
                {
                    onClick: e => onDeleteClick(j.id),
                    label: (<><TrashFill /> {t("DELETE")}</>)
                },
            ])}
            items={users}
          />
        </Col>
      </Row>
    </>
  )
};

UserList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

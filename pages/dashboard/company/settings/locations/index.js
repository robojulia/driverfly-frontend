import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import useRedirect from '../../../../../hooks/useRedirect';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "react-i18next";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";

import LocationApi from "../../../../api/location";
import LocationEntity from "../../../../../models/company/location.entity";

export default function LocationList() {

  const router = useRouter();
  const { t } = useTranslation();

  const { authCompany } = useRedirect();

  authCompany()

  const { authCheck, setAuth } = useAuth();
  const user = authCheck();
  console.log('user', user);

  const [ locations, setLocations ] = useState([]);

  useEffect(async () => {
    const api = new LocationApi();

    const v = await api.list();

    setLocations(v);
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

    const api = new LocationApi();

    await api.remove(name);

    setLocations(locations.filter(v => v.id != name));
  }


  return (
    <>
      <ToastContainer />
      <div className="container_fluid">

        <Row>
          <Col xs="10">
            <h1>{t("LOCATIONS")}</h1>
          </Col>
          <Col xs="2">
            <button className="btn btn-primary" onClick={onAddClick}>
              + {t("CREATE")}
            </button>
          </Col>
        </Row>
        <Row className="mt-5">
          <div className="table-responsive">
              <Table striped>
                  <thead className="listing_head">
                      <tr>
                        <th>{t("STREET")}</th>
                        <th>{t("CITY")}</th>
                        <th>{t("STATE")}</th>
                        <th>{t("ZIP_CODE")}</th>
                        <th>{/* ACTIONS */}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {!locations || !locations.length &&
                        <tr>
                          <td colSpan={9}>
                            {t("NO_{name}_FOUND", { name: t("LOCATIONS") })}

                          </td>
                        </tr>
                      }
                      {locations && locations.map((v, i) => (
                        <tr key={i}>
                          <td>{v.street}</td>
                          <td>{v.city}</td>
                          <td>{v.state}</td>
                          <td>{v.zip_code}</td>
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

LocationList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

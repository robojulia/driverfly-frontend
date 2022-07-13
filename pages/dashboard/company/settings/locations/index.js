import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, Row, Table } from "reactstrap";
import { useRouter } from "next/router"
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useTranslation } from "../../../../../hooks/useTranslation";


import {PenFill, TrashFill} from 'react-bootstrap-icons';


import LocationApi from "../../../../api/location";
import LocationEntity from "../../../../../models/company/location.entity";

export default function LocationList() {

  const router = useRouter();
  const { t } = useTranslation();

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
            <h2>{t("TERMINALS")}</h2>
          </Col>
          <Col xs="2" className="text-right">
            <button className="theme-secondary-btn" onClick={onAddClick}>
              + {t("CREATE")}
            </button>
          </Col>
        </Row>
   
        <Row className="mt-2 overflow_cls ">
          <div className="table-responsive p-0">
              <Table striped>
              <thead className="listing_heads location_table__hed ">
                      <tr>
                        <th>{t("STREET")}</th>
                        <th>{t("CITY")}</th>
                        <th>{t("STATE")}</th>
                        <th>{t("ZIP_CODE")}</th>
                        <th>{/* ACTIONS */}</th>
                      </tr>
                </thead>
                  <tbody >
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
                          <td className="">
                            <button name={v.id} className="btn" onClick={onEditClick}>
                              <PenFill />
                            </button>
                            <button name={v.id} className="btn" onClick={onDeleteClick}>
                              <TrashFill />
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

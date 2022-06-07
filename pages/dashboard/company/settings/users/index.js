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
import ViewDataTable from "../../../../../components/viewDetails/viewDataTable";

export default function UserList() {

  const { authCompany } = useRedirect();
  authCompany();

  const { t } = useTranslation();
  const router = useRouter();
  const { authCheck, setAuth } = useAuth();
  const user = authCheck();

  const [ users, setUsers ] = useState([]);

  useEffect(async () => {
    const api = new UserApi();
    const v = await api.list();
    setUsers(v.filter((u) => u.id !== user.id && u.status === "ACTIVE"));
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
   * @param {number} id
   */
  const onEditClick = (id) => {
    router.push(`${router.pathname}/${id}`);
  }

  /**
   * 
   * @param {number} id
   */
   const onDeleteClick = async (id) => {
    const api = new UserApi();

    await api.remove(id);

    setUsers(users.filter(v => v.id != id));
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
                name: "name",
                selector: j => `${j.first_name} ${j.last_name}`,
                hidable: false
              },
              {
                name: "roles",
                selector: j => j.roles.map((role) => role.name).join(", "),
                hidable: false
              },
              {
                name: "email",
                selector: j => j.email,
                hidable: false
              },
              {
                name: "contact_number",
                selector: j => j.contact_number,
                hidable: false
              }
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

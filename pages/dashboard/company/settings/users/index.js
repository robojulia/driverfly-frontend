import { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../../components/layouts/PageLayout";
import { Col, Row, Table } from "reactstrap";
import useAuth from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import useRedirect from '../../../../../hooks/useRedirect';
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
  const { authCheck, hasPermission } = useAuth();
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
    <PageLayout 
      title="USERS" 
      actions={[
        {
          title: "CREATE",
          onClick: onAddClick
        }
      ]}>
      <Row className="mt-5">
        <Col  lg="12">
          <ViewDataTable
            columns={[
              {
                name: "name",
                selector: j => j.name,
                hidable: false
              },
              {
                name: "ROLES",
                selector: j => j.roles.map((role) => role.name).join(", "),
                hidable: true
              },
              {
                name: "email",
                selector: j => j.email,
                hidable: true
              },
              {
                name: "phone",
                selector: j => j.contact_number,
                hidable: true
              },
              {
                name: "phone_cell",
                selector: j => j.cell_number,
                hidable: true,
                hide: true
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
    </PageLayout>
  )
};

UserList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

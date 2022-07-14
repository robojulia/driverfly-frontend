import { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../../components/layouts/PageLayout";
import { Col, Row } from "reactstrap";
import { useAuth } from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useTranslation } from "../../../../../hooks/useTranslation";
import {PenFill, TrashFill} from 'react-bootstrap-icons';
import UserApi from "../../../../api/user";
import ViewDataTable from "../../../../../components/viewDetails/viewDataTable";
import { Status } from '../../../../../enums/status.enum';
import { UserEntity } from '../../../../../models/user/user.entity';
import { useEffectAsync } from '../../../../../utils/react';

export default function UserList() {

  const { t } = useTranslation();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const [ users, setUsers ] = useState([]);

  useEffectAsync(async () => {
    const api = new UserApi();
    const v = await api.list();
    setUsers(v.filter((u) => u.id !== user.id && u.status === Status.ACTIVE));
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
      actions={
        <>
          {
            hasPermission("CanCreateUser") &&
              <button className="btn btn-primary" onClick={onAddClick}>
                + {t("CREATE")}
              </button>
          }
        </>
      }>
      <Row className="mt-5">
        <Col>
          <ViewDataTable<UserEntity>
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
                hide: 1
              }
            ]}
            actions={j => ([
                {
                    onClick: e => onEditClick(j.id),
                    label: (<><PenFill /> {t("EDIT")}</>),
                    hide: !hasPermission("CanUpdateUser")
                },
                {
                    onClick: e => onDeleteClick(j.id),
                    label: (<><TrashFill /> {t("DELETE")}</>),
                    hide: !hasPermission("CanDeleteUser")
                }
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

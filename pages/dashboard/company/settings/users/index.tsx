import React, { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../../components/layouts/page/PageLayout";
import { TabbedLayout } from '../../../../../components/layouts/page/TabbedLayout';
import { useAuth } from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useTranslation } from "../../../../../hooks/useTranslation";
import {EyeFill, PenFill, TrashFill} from 'react-bootstrap-icons';
import UserApi from "../../../../api/user";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/viewDetails/viewDataTable";
import { Status } from '../../../../../enums/status.enum';
import { UserEntity } from '../../../../../models/user/user.entity';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { join } from 'path/posix';

export default function UserList() {

  const { t } = useTranslation();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const columnSettingKey = getDataTableColumnKey("company", user, "users");

  const [ users, setUsers ] = useState([]);

  useEffectAsync(async () => {
    if (!user) return;

    const api = new UserApi();
    const v = await api.list();
    setUsers(v.filter((u) => u.id !== user.id && u.status === Status.ACTIVE));
  }, [ user ]);

   const onAddClick = (e: React.MouseEvent) => {
    e.preventDefault();

    router.push(`${router.pathname}/create`);
  }

  const onEditClick = (id: number) => {
    router.push(`${router.pathname}/${id}/edit`);
  }

  const onViewClick = (id: number) => {
    router.push(`${router.pathname}/${id}`);
  }

  const onDeletedUserClick = (e: React.MouseEvent) => {
    e.preventDefault();

    router.push(`${router.pathname}/deleted-users`);
  }

  const onDeleteClick = async (id: number) => {
    try {
      const api = new UserApi();

      await api.remove(id);

      setUsers(users.map(v => {
        if (v.id === id) {
          return {...v, status: Status.DELETED};
        }
      
        return v;
      }));

    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_DELETE", toast: toast });
    }
  }

  return (
    <PageLayout 
      title="USERS" 
      actions={
        <>
          {
            hasPermission("CanCreateUser") &&
              <Button variant='primary' onClick={onAddClick}>
                + {t("CREATE")}
              </Button>
          }
        </>
      }>
        <ViewDataTable<UserEntity>
          columnSettingKey={columnSettingKey}
          columns={[
            {
              id: "name",
              name: "name",
              selector: j => j.name,
              cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.name}</a></Link>),
              hidable: false
            },
            {
              id: "roles",
              name: "ROLES",
              selector: j => j.roles.map((role) => role.name).join(", "),
            },
            {
              id: "email",
              name: "email",
              selector: j => j.email,
            },
            {
              id: "phone",
              name: "phone",
              selector: j => j.contact_number,
            },
            {
              id: "phone_cell",
              name: "phone_cell",
              selector: j => j.cell_number,
              hide: 1
            }
          ]}
          actions={j => ([
              {
                  onClick: e => onViewClick(j.id),
                  icon: EyeFill,
                  label: "VIEW",
                  hide: !hasPermission("CanViewUser")
              },
              {
                  onClick: e => onEditClick(j.id),
                  icon: PenFill,
                  label: "EDIT",
                  hide: !hasPermission("CanUpdateUser")
              },
              {
                  onClick: e => onDeleteClick(j.id),
                  icon: TrashFill,
                  label: "DELETE",
                  hide: !hasPermission("CanDeleteUser")
              }
          ])}
          items={users}
        />
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

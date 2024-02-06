import React, { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { TabbedLayout } from '../../../../../components/layouts/page/tabbed-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useRouter } from "next/router"
import { useTranslation } from "../../../../../hooks/use-translation";
import { EyeFill, PenFill, TrashFill, ArrowCounterclockwise } from 'react-bootstrap-icons';
import UserApi from "../../../../api/user";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/view-details/view-data-table";
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

  const [users, setUsers] = useState([]);

  useEffectAsync(async () => {
    if (!user) return;

    const api = new UserApi();
    const v = await api.list();
    setUsers(v);
  }, [user]);

  const can = {
    createUser: hasPermission("CanCreateUser"),
    viewUser: hasPermission("CanViewUser"),
    editUser: hasPermission("CanUpdateUser"),
    deleteUser: hasPermission("CanDeleteUser"),
  };

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

  const onDeleteClick = async (id: number) => {
    try {
      const api = new UserApi();

      await api.remove(id);

      setUsers(users.map(v => {
        if (v.id == id) {
          return { ...v, status: Status.DELETED };
        }

        return v;
      }));

    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_DELETE", toast: toast });
    }
  }

  const onRestoreClick = async (id: number) => {
    try {
      const api = new UserApi();

      await api.restore(id);

      setUsers(users.map(v => {
        if (v.id == id) {
          return { ...v, status: Status.ACTIVE };
        }

        return v;
      }));

    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_RESTORE", toast: toast });
    }
  }

  const tabs = {
    [`Status.${Status.ACTIVE}`]: createUsersTable(users.filter((u) => u.id != user.id && u.status == Status.ACTIVE)),
    [`Status.${Status.DELETED}`]: createUsersTable(users.filter((u) => u.id != user.id && u.status == Status.DELETED)),
  };


  function createUsersTable(users: UserEntity[]) {
    return (
      <ViewDataTable<UserEntity>
        columnSettingKey={columnSettingKey}
        customStyles={{
          headRow: {
            style: {
              background: "linear-gradient(to bottom right, #2ec8c4, #1b4454ba)",
              color: "white"
            },
          },
        }}
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
            hide: !can.viewUser
          },
          {
            onClick: e => onEditClick(j.id),
            icon: PenFill,
            label: "EDIT",
            hide: !can.editUser
          },
          {
            onClick: e => onDeleteClick(j.id),
            icon: TrashFill,
            label: "DELETE",
            hide: !(can.deleteUser && j.status == Status.ACTIVE)
          },
          {
            onClick: e => onRestoreClick(j.id),
            icon: ArrowCounterclockwise,
            label: "RESTORE",
            hide: !(can.deleteUser && j.status == Status.DELETED)
          }
        ])}
        items={users}
      />
    );
  }

  return (
    <PageLayout
      title="USERS"
      desciption="USERS_DESC"
      actions={
        <>
          {
            can.createUser &&
            <Button variant='primary' onClick={onAddClick}>
              + {t("CREATE")}
            </Button>
          }
        </>
      }>
      <TabbedLayout items={tabs}></TabbedLayout>
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

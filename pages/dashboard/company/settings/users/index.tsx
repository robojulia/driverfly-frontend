import React, { useEffect, useState } from 'react';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { TabbedLayout } from '../../../../../components/layouts/page/tabbed-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useRouter } from 'next/router';
import { useTranslation } from '../../../../../hooks/use-translation';
import {
  EyeFill,
  PenFill,
  TrashFill,
  ArrowCounterclockwise,
  PersonX,
  PersonCheck,
} from 'react-bootstrap-icons';
import UserApi from '../../../../api/user';
import ViewDataTable, {
  getDataTableColumnKey,
} from '../../../../../components/view-details/view-data-table';
import { Status } from '../../../../../enums/status.enum';
import { UserEntity } from '../../../../../models/user/user.entity';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import { join } from 'path/posix';
import ViewModal from '../../../../../components/view-details/view-modal';

export default function UserList() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const [showModal, setShowModal] = useState<boolean>(false);
  const columnSettingKey = getDataTableColumnKey('company', user, 'users');
  const [confirmationModal, setConfirmationModal] = useState<any>({
    value: false,
    userId: null,
  });
  const [users, setUsers] = useState([]);

  useEffectAsync(async () => {
    if (!user) return;

    const api = new UserApi();
    const v = await api.list();
    setUsers(v);
  }, [user]);

  const can = {
    createUser: hasPermission('CanCreateUser'),
    viewUser: hasPermission('CanViewUser'),
    editUser: hasPermission('CanUpdateUser'),
    deleteUser: hasPermission('CanDeleteUser'),
    disableUser: hasPermission('CanUpdateUser'), // Company admins can disable users
  };

  const onAddClick = (e: React.MouseEvent) => {
    e.preventDefault();

    router.push(`${router.pathname}/create`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.pathname}/${id}/edit`);
  };

  const onViewClick = (id: number) => {
    router.push(`${router.pathname}/${id}`);
  };

  const onDeleteClick = async (id: number) => {
    setShowModal(true);
    setConfirmationModal({
      value: !confirmationModal.value,
      userId: id,
    });
  };

  const handleDeleteClick = async (id: number) => {
    try {
      const api = new UserApi();
      await api.remove(id);
      setUsers(
        users.map((v) => {
          if (v.id == id) {
            return { ...v, status: Status.DELETED };
          }
          return v;
        })
      );
      setShowModal(false);
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: 'UNABLE_TO_DELETE',
        toast: toast,
      });
    }
  };

  const onRestoreClick = async (id: number) => {
    try {
      const api = new UserApi();

      await api.restore(id);

      setUsers(
        users.map((v) => {
          if (v.id == id) {
            return { ...v, status: Status.ACTIVE };
          }

          return v;
        })
      );
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: 'UNABLE_TO_RESTORE',
        toast: toast,
      });
    }
  };

  const onToggleCompanyDisabledClick = async (id: number, disabled: boolean) => {
    try {
      const api = new UserApi();

      const updatedUser = await api.toggleCompanyDisabled(id, disabled);

      setUsers(
        users.map((v) => {
          if (v.id == id) {
            return { ...v, company_disabled: updatedUser.company_disabled };
          }

          return v;
        })
      );

      toast.success(t(disabled ? 'USER_DISABLED_BY_COMPANY' : 'USER_ENABLED_BY_COMPANY'));
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: disabled ? 'UNABLE_TO_DISABLE_USER' : 'UNABLE_TO_ENABLE_USER',
        toast: toast,
      });
    }
  };

  const tabs = {
    [`Status.${Status.ACTIVE}`]: createUsersTable(
      users.filter((u) => u.status == Status.ACTIVE && !u.company_disabled)
    ),
    [`Status.${Status.DEACTIVE}`]: createUsersTable(
      users.filter((u) => u.status == Status.DEACTIVE || u.company_disabled)
    ),
    [`Status.${Status.DELETED}`]: createUsersTable(users.filter((u) => u.status == Status.DELETED)),
  };

  function createUsersTable(users: UserEntity[]) {
    return (
      <ViewDataTable<UserEntity>
        columnSettingKey={columnSettingKey}
        columns={[
          {
            id: 'id',
            name: 'Id',
            selector: (j) => j.id,
          },
          {
            id: 'name',
            name: 'name',
            selector: (j) => j.name,
            cell: (j) => (
              <Link href={`${router.asPath}/${j.id}`}>
                <a>{j.name}</a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: 'roles',
            name: 'ROLES',
            selector: (j) => j.roles.map((role) => role.name).join(', '),
          },

          {
            id: 'email',
            name: 'email',
            selector: (j) => j.email,
          },
          {
            id: 'phone',
            name: 'phone',
            selector: (j) => j.contact_number,
          },
          {
            id: 'phone_cell',
            name: 'phone_cell',
            selector: (j) => j.cell_number,
            hide: 1,
          },
          {
            id: 'company_disabled',
            name: 'Company Status',
            selector: (j) => (j.company_disabled ? 'Disabled by Company' : 'Active'),
            cell: (j) => (
              <span className={`badge ${j.company_disabled ? 'bg-warning' : 'bg-success'}`}>
                {j.company_disabled ? 'Disabled' : 'Active'}
              </span>
            ),
          },
        ]}
        actions={(j) => [
          {
            onClick: (e) => onViewClick(j.id),
            icon: EyeFill,
            label: 'VIEW',
            hide: !can.viewUser,
          },
          {
            onClick: (e) => onEditClick(j.id),
            icon: PenFill,
            label: 'EDIT',
            hide: !can.editUser || j.id === user.id,
          },
          {
            onClick: (e) => onToggleCompanyDisabledClick(j.id, !j.company_disabled),
            icon: j.company_disabled ? PersonCheck : PersonX,
            label: j.company_disabled ? 'ENABLE_USER' : 'DISABLE_USER',
            hide: !can.disableUser || j.status !== Status.ACTIVE || j.id === user.id,
          },
          {
            onClick: (e) => onDeleteClick(j.id),
            icon: TrashFill,
            label: 'DELETE',
            hide:
              !((can.deleteUser && j.status == Status.ACTIVE) || j.status == Status.DEACTIVE) ||
              j.id === user.id,
          },
          {
            onClick: (e) => onRestoreClick(j.id),
            icon: ArrowCounterclockwise,
            label: 'RESTORE',
            hide: !(can.deleteUser && j.status == Status.DELETED) || j.id === user.id,
          },
        ]}
        items={users}
      />
    );
  }

  return (
    <>
      {showModal && (
        <ViewModal show={showModal} onCloseClick={() => setShowModal(false)} closeText="CANCEL">
          <div
            className="d-flex flex-column align-items-center justify-content-between w-100 gap-5"
            style={{ background: '1D4345' }}
          >
            <h2>{t('ARE_YOU_SURE_YOU_WANT_TO_DELETE_USER')}</h2>
            <div className="gap-4 d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-danger px-5"
                onClick={() => handleDeleteClick(confirmationModal?.userId)}
              >
                {t('yes')}
              </button>
            </div>
          </div>
        </ViewModal>
      )}

      <PageLayout
        title="USERS"
        desciption="USERS_DESC" // TODO: Fix spelling in PageLayoutProps (should be 'description')
        actions={
          <>
            {can.createUser && (
              <Button variant="primary" onClick={onAddClick}>
                + {t('CREATE')}
              </Button>
            )}
          </>
        }
      >
        <TabbedLayout items={tabs}></TabbedLayout>
      </PageLayout>
    </>
  );
}

UserList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

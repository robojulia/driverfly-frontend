import React, { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../../components/layouts/page/PageLayout";
import { Col, Row } from "reactstrap";
import { useAuth } from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useTranslation } from "../../../../../hooks/useTranslation";
import {
    ArrowLeftSquareFill
} from 'react-bootstrap-icons';
import UserApi from "../../../../api/user";
import ViewDataTable, { getDataTableColumnKey } from "../../../../../components/viewDetails/viewDataTable";
import { Status } from '../../../../../enums/status.enum';
import { UserEntity } from '../../../../../models/user/user.entity';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from 'react-bootstrap';

export default function DeletedUsersList() {

    const { t } = useTranslation();
    const router = useRouter();
    const { user, hasPermission } = useAuth();

    const columnSettingKey = getDataTableColumnKey("company", user, "users");

    const [users, setUsers] = useState([]);

    useEffectAsync(async () => {
        if (!user) return;

        const api = new UserApi();
        const v = await api.list();
        setUsers(v.filter((u) => u.id !== user.id && u.status === Status.DELETED));
    }, [user]);

    const onRestoreUserClick = async (id: number) => {
        try {
            const userApi = new UserApi();
            await userApi.mark(id, Status.ACTIVE)
                .then(data => {
                    setUsers(users.filter(v => v.id != id));
                })

        } catch (e) {
            globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_UPDATE", toast: toast });
        }
    }

    return (
        <PageLayout
            title="DELETED_USERS"
        >
            <ViewDataTable<UserEntity>
                columnSettingKey={columnSettingKey}
                columns={[
                    {
                        id: "name",
                        name: "ID",
                        selector: j=> j.id,
                      },
                    {
                        id: "name",
                        name: "name",
                        selector: j => j.name,
                        cell: (j) => j.name,
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
                        onClick: e => onRestoreUserClick(j.id),
                        icon: ArrowLeftSquareFill,
                        label: "RESTORE",
                        hide: !hasPermission("CanUpdateUser")
                    }
                ])}
                items={users}
            />
        </PageLayout>
    )
};

DeletedUsersList.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

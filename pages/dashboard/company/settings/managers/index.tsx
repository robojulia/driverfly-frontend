import React, { useEffect, useState } from "react";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { TabbedLayout } from "../../../../../components/layouts/page/tabbed-layout";
import { useAuth } from "../../../../../hooks/use-auth";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../../hooks/use-translation";
import {
  EyeFill,
  PenFill,
  TrashFill,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";
import UserApi from "../../../../api/user";
import ViewDataTable, {
  getDataTableColumnKey,
} from "../../../../../components/view-details/view-data-table";
import { Status } from "../../../../../enums/status.enum";
import { UserEntity } from "../../../../../models/user/user.entity";
import { useEffectAsync } from "../../../../../utils/react";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { join } from "path/posix";
import { CompanyManagerEntity } from "../../../../../models/company/company-manager.entity";
import CompanyApi from "../../../../api/company";

export default function UserList() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, hasPermission } = useAuth();
  const companyApi = new CompanyApi();
  const columnSettingKey = getDataTableColumnKey("company", user, "managers");

  const [managers, setManagers] = useState<CompanyManagerEntity[]>([]);

  useEffectAsync(async () => {
    if (!user) return;

    const v = await companyApi.manager.list();
    setManagers(v);
  }, [user]);

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

  function createManagersTable(managers: CompanyManagerEntity[]) {
    return (
      <ViewDataTable<CompanyManagerEntity>
        columnSettingKey={columnSettingKey}
        columns={[
          {
            id: "id",
            name: "ID",
            selector: (j) => j?.id,
            cell: (j) => <a>{j?.id}</a>,
            hidable: false,
          },
          {
            id: "name",
            name: "name",
            selector: (j) => j.name,
            cell: (j) => (
              <Link href={`${router.asPath}/${j.id}`}>
                <a>{j.name}</a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "email",
            name: "email",
            selector: (j) => j.email,
          },
          {
            id: "phone",
            name: "phone",
            selector: (j) => j.phone,
          },
        ]}
        actions={(j) => [
          {
            onClick: (e) => onViewClick(j.id),
            icon: EyeFill,
            label: "VIEW",
          },
          {
            onClick: (e) => onEditClick(j.id),
            icon: PenFill,
            label: "EDIT",
          },
        ]}
        items={managers}
      />
    );
  }

  return (
    <PageLayout
      title="MANAGERS"
      desciption="MANAGERS_DESC"
      actions={
        <Button variant="primary" onClick={onAddClick}>
          + {t("CREATE")}
        </Button>
      }
    >
      {createManagersTable(managers)}
    </PageLayout>
  );
}

UserList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

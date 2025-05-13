import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import { Col, Row, Table } from "reactstrap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "../../../../../hooks/use-translation";

import { EyeFill, PenFill, TrashFill } from "react-bootstrap-icons";

import LocationApi from "../../../../api/location";
import { LocationEntity } from "../../../../../models/company/location.entity";
import { useAuth } from "../../../../../hooks/use-auth";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useEffectAsync } from "../../../../../utils/react";
import { Button, ButtonGroup } from "react-bootstrap";
import ViewDataTable, {
  getDataTableColumnKey,
} from "../../../../../components/view-details/view-data-table";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import Link from "next/link";

export default function LocationList() {
  const router = useRouter();
  const { t } = useTranslation();

  const { user, hasPermission } = useAuth();

  const columnSettingKey = getDataTableColumnKey("company", user, "locations");

  const [locations, setLocations] = useState([]);

  useEffectAsync(async () => {
    try {
      const api = new LocationApi();

      const v = await api.list();

      setLocations(v);
    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, toast: toast });
    }
  }, [user]);

  /**
   *
   * @param {React.MouseEvent} e
   */
  const onAddClick = (e: React.MouseEvent) => {
    e.preventDefault();

    router.push(`${router.asPath}/create`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.asPath}/${id}/edit`);
  };

  const onViewClick = (id: number) => {
    router.push(`${router.asPath}/${id}`);
  };

  const onDeleteClick = async (id: number) => {
    try {
      const api = new LocationApi();

      await api.remove(id);

      setLocations(locations.filter((v) => v.id != id));
    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, toast: toast });
    }
  };

  const can = {
    create: hasPermission("CanCreateLocation"),
    view: hasPermission("CanViewLocation"),
    update: hasPermission("CanUpdateLocation"),
    delete: hasPermission("CanDeleteLocation"),
  };

  return (
    <PageLayout
      title="TERMINALS"
      desciption="TERMINALS_DESC"
      actions={
        <ButtonGroup>
          {can.create && <Button onClick={onAddClick}>+ {t("CREATE")}</Button>}
        </ButtonGroup>
      }
    >
      <ViewDataTable<LocationEntity>
        columnSettingKey={columnSettingKey}
        columns={[
          {
            id: "name",
            name: "ID",
            selector: (v) => v.id,
          },
          {
            id: "street",
            name: "STREET",
            selector: (v) => v.street,
            cell: (v) => (
              <Link href={`${router.asPath}/${v.id}`}>
                <a>{v.street}</a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "city",
            name: "CITY",
            selector: (v) => v.city,
          },
          {
            id: "state",
            name: "STATE",
            selector: (v) => v.state,
          },
          {
            id: "zip_code",
            name: "ZIP_CODE",
            selector: (v) => v.zip_code,
          },
        ]}
        actions={(l) => [
          {
            onClick: (e) => onViewClick(l.id),
            icon: EyeFill,
            label: "VIEW",
            hide: !can.view,
          },
          {
            onClick: (e) => onEditClick(l.id),
            icon: PenFill,
            label: "EDIT",
            hide: !can.update,
          },
          {
            onClick: (e) => onDeleteClick(l.id),
            icon: TrashFill,
            label: "DELETE",
            hide: !can.delete,
          },
        ]}
        items={locations}
      />
    </PageLayout>
  );
}

LocationList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

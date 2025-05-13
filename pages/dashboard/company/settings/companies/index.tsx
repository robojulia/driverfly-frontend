import React, { useEffect, useState } from "react";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { Col, Row } from "reactstrap";
import { useAuth } from "../../../../../hooks/use-auth";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../../hooks/use-translation";
import { EyeFill, PenFill, TrashFill } from "react-bootstrap-icons";
import ViewDataTable, {
  getDataTableColumnKey,
} from "../../../../../components/view-details/view-data-table";
import { Status } from "../../../../../enums/status.enum";
import { useEffectAsync } from "../../../../../utils/react";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "react-bootstrap";
import CompanyApi from "../../../../api/company";
import { CompanyEntity } from "../../../../../models/company/company.entity";

export default function CompanyList() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, company, hasPermission, isCompanyAdmin, refreshToken } =
    useAuth();

  const columnSettingKey = getDataTableColumnKey("company", user, "companies");

  const [companies, setCompanies] = useState([]);

  useEffectAsync(async () => {
    const api = new CompanyApi();
    const v = await api.list({ withPhoto: true });
    setCompanies(
      v.filter((u) => u.id != company.id && u.status == Status.ACTIVE)
    );
  }, [company]);

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
    try {
      const api = new CompanyApi();

      await api.remove(id);

      await refreshToken();
      setCompanies(companies.filter((v) => v.id != id));
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        defaultMessage: "UNABLE_TO_DELETE",
        toast: toast,
      });
    }
  };

  return (
    <PageLayout
      title="COMPANIES"
      actions={
        <>
          {(hasPermission("CanCreateCompany") || isCompanyAdmin) && (
            <Button variant="primary" onClick={onAddClick}>
              + {t("CREATE")}
            </Button>
          )}
        </>
      }
    >
      <ViewDataTable<CompanyEntity>
        columnSettingKey={columnSettingKey}
        columns={[
          {
            id: "id",
            name: "ID",
            selector: (j) => j.id,
          },
          {
            id: "photo",
            name: "PHOTO",
            cell: (v) =>
              v.photo && (
                <img
                  className="img-thumbnail"
                  style={{ maxWidth: "100px" }}
                  src={v.photo.path}
                />
              ),
          },
          {
            id: "name",
            name: "NAME",
            selector: (j) => j.name,
            cell: (j) => (
              <Link href={`${router.asPath}/${j.id}`}>
                <a>{j.name}</a>
              </Link>
            ),
            hidable: false,
          },
          {
            id: "website",
            name: "WEBSITE",
            selector: (j) => j.website,
          },
        ]}
        actions={(j) => [
          {
            onClick: (e) => onViewClick(j.id),
            icon: EyeFill,
            label: "VIEW",
            hide: !hasPermission("CanViewCompany"),
          },
          {
            onClick: (e) => onEditClick(j.id),
            icon: PenFill,
            label: "EDIT",
            hide: !hasPermission("CanUpdateCompany"),
          },
          {
            onClick: (e) => onDeleteClick(j.id),
            icon: TrashFill,
            label: "DELETE",
            hide: !hasPermission("CanDeleteCompany"),
          },
        ]}
        items={companies}
      />
    </PageLayout>
  );
}

CompanyList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

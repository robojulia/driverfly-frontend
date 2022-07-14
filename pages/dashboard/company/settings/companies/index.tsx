import React, { useEffect, useState } from 'react';
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import PageLayout from "../../../../../components/layouts/PageLayout";
import { Col, Row } from "reactstrap";
import { useAuth } from '../../../../../hooks/useAuth';
import { useRouter } from "next/router"
import { useTranslation } from "../../../../../hooks/useTranslation";
import {EyeFill, PenFill, TrashFill} from 'react-bootstrap-icons';
import ViewDataTable from "../../../../../components/viewDetails/viewDataTable";
import { Status } from '../../../../../enums/status.enum';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import CompanyApi from '../../../../api/company';
import { CompanyEntity } from '../../../../../models/company/company.entity';

export default function CompanyList() {

  const { t } = useTranslation();
  const router = useRouter();
  const { company, hasPermission } = useAuth();

  const [ companies, setCompanies ] = useState([]);

  useEffectAsync(async () => {
    const api = new CompanyApi();
    const v = await api.list();
    setCompanies(v.filter((u) => u.id !== company.id && u.status === Status.ACTIVE));
  }, [ company ]);

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
      const api = new CompanyApi();

      await api.remove(id);

      setCompanies(companies.filter(v => v.id != id));
    } catch (e) {
      globalAjaxExceptionHandler(e, { t: t, defaultMessage: "UNABLE_TO_DELETE", toast: toast });
    }
  }

  return (
    <PageLayout 
      title="COMPANIES" 
      actions={
        <>
          {
            hasPermission("CanCreateCompany") &&
              <Button variant='primary' onClick={onAddClick}>
                + {t("CREATE")}
              </Button>
          }
        </>
      }>
      <Row className="mt-5">
        <Col>
          <ViewDataTable<CompanyEntity>
            columns={[
              {
                name: "NAME",
                selector: j => j.name,
                cell: (j) => (<Link href={`${router.asPath}/${j.id}`} ><a>{j.name}</a></Link>),
                hidable: false
              },
              {
                name: "WEBSITE",
                selector: j => j.website,
              },
            ]}
            actions={j => ([
                {
                    onClick: e => onViewClick(j.id),
                    label: (<><EyeFill /> {t("VIEW")}</>),
                    hide: !hasPermission("CanViewCompany")
                },
                {
                    onClick: e => onEditClick(j.id),
                    label: (<><PenFill /> {t("EDIT")}</>),
                    hide: !hasPermission("CanUpdateCompany")
                },
                {
                    onClick: e => onDeleteClick(j.id),
                    label: (<><TrashFill /> {t("DELETE")}</>),
                    hide: !hasPermission("CanDeleteCompany")
                }
            ])}
            items={companies}
          />
        </Col>
      </Row>
    </PageLayout>
  )
};

CompanyList.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

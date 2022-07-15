import React from "react";
import { Container } from "reactstrap";
import Header from "../header/Header";
import Sidebar from "../sidebars/Sidebar";
import Head from "next/head";
import Scripts from "../../../scripts";

import { useTranslation } from "../../../../hooks/useTranslation";
import {TelephoneFill,  Building, CardImage, HouseFill, BagFill, PersonFill, FileEarmarkFill, GeoAltFill, CheckSquareFill, GiftFill, GearFill, EnvelopeFill, PeopleFill, Hospital } from 'react-bootstrap-icons';
import CompanyProfileNav from "../header/CompanyProfileNav";
import { useAuth } from "../../../../hooks/useAuth";

// company layout
const FullLayout = ({ children }) => {
  const { t } = useTranslation();

  const { user } = useAuth();

  if (!user?.company) {
    return <></>
  }

  const menuItems = [
    {
      pathname: "/dashboard/company",
      icon: HouseFill,
      text: "dashboard"
    },
    {
      pathname: "/dashboard/company/jobs",
      icon: BagFill,
      text: "JOB_LISTINGS",
      permissions: "CanViewJob",
      startsWith: true
    },
    {
      pathname: "/dashboard/company/applicants",
      icon: FileEarmarkFill,
      text: "APPLICANTS",
      permissions: "CanViewApplicant",
      startsWith: true
    },
    {
      pathname: "/dashboard/company/messages",
      icon: EnvelopeFill,
      text: "MESSAGES",
      startsWith: true
    },
    {
      pathname: "/dashboard/company/call",
      icon: TelephoneFill,
      text: "CALL",
      startsWith: true
    },
  
    {
      pathname: "/dashboard/company/settings",
      icon: GearFill,
      text: "SETTINGS",
      items: [
        {
            pathname: "/dashboard/company/settings",
            icon: Building,
            text: "company",
            permissions: "CanViewCompany",
        },
        {
          pathname: "/dashboard/company/settings/companies",
          icon: Hospital,
          text: "COMPANIES",
          permissions: "CanViewCompany",
          startsWith: true
        },
        {
            pathname: "/dashboard/company/settings/users",
            icon: PeopleFill,
            text: "USERS",
            permissions: "CanViewUser",
            startsWith: true
        },
        {
            pathname: "/dashboard/company/settings/vehicles",
            icon: CardImage,
            text: "VEHICLES",
            permissions: "CanViewVehicle",
            startsWith: true
        },
        {
            pathname: "/dashboard/company/settings/locations",
            icon: GeoAltFill,
            text: "TERMINALS",
            permissions: "CanViewLocation",
            startsWith: true
        },
        {
            pathname: "/dashboard/company/settings/profile",
            icon: PersonFill,
            text: "MY_PROFILE",
        },
      ],
    },
  
  ];


return (
    <>
      <Head>
        <title>{t("DRIVERFLY_COMPANY_DASHBOARD")}</title>
        <meta
          name="description"
          content={t("DRIVERFLY_COMPANY_DASHBOARD")}
        />
        <link rel="icon" href="/img/DriverFly-Official-Favicon.png" />
      </Head>
      <Scripts  />
      <div className="header">
            <div className="contentArea ">
              {/********header**********/}
              <Header>
                <CompanyProfileNav />
              </Header>
            </div>
            </div>
      <main className="maincontainer">
        < div className="dashboardsidebar">
          <div className="pageWrapper d-md-block d-lg-flex">
            {/******** Sidebar **********/}
            <Sidebar items={menuItems} />
            {/********Content Area**********/}
            <div className="header">
           

              {/********Middle Content**********/}
              <Container className="p-4 wrapper" fluid>
                <div>{children}</div>
              </Container>
            </div>
            </div>
          </div>
       
      </main>
    </>
  );
};

export default FullLayout;

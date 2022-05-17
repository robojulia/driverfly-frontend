import React from "react";
import { Container } from "reactstrap";
import Header from "../header/Header";
import Sidebar from "../sidebars/Sidebar";
import Head from "next/head";

import { useTranslation } from "../../../../hooks/useTranslation";
import { Building, CardImage, HouseFill, BagFill, PersonFill, FileEarmarkFill, GeoAltFill, CheckSquareFill, GiftFill, GearFill, EnvelopeFill } from 'react-bootstrap-icons';

// company layout
const FullLayout = ({ children }) => {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

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
      startsWith: true
    },
    {
      pathname: "/dashboard/company/applicants",
      icon: FileEarmarkFill,
      text: "APPLICANTS",
      startsWith: true
    },
    {
      pathname: "/dashboard/company/messages",
      icon: EnvelopeFill,
      text: "MESSAGES",
      startsWith: true
    },
    // {
    //   pathname: "/dashboard/company/driver-applications-and-resume",
    //   icon: AssignmentIcon,
    //   text: t("DRIVER_APPLICATION")
    // },
    // {
    //   pathname: "/dashboard/company/sms",
    //   icon: EmailIcon,
    //   text: t("MESSAGES")
    // },
    // {
    //   pathname: "/dashboard/company/driver-directory",
    //   icon: ContactPageIcon,
    //   text: t("DRIVER_DIRECTORY")
    // },
    // {
    //   pathname: "/dashboard/company/safety-and-complience",
    //   icon: GppGoodIcon,
    //   text: t("SAFETY_COMPLIANCE")
    // },
    {
      pathname: "/dashboard/company/settings",
      icon: GearFill,
      text: "SETTINGS",
      items: [
        {
            pathname: "/dashboard/company/settings",
            icon: Building,
            text: "company"
        },
        {
            pathname: "/dashboard/company/settings/vehicles",
            icon: CardImage,
            text: "VEHICLES"
        },
        {
          pathname: "/dashboard/company/settings/locations",
          icon: GeoAltFill,
          text: "TERMINALS"
        },
        {
          pathname: "/dashboard/company/settings/profile",
          icon: PersonFill,
          text: "MY_PROFILE",
        },
      ],
    },
    // {
    //   pathname: "/dashboard/company/admin-approval-jobs",
    //   icon: null,
    //   text: "Admin approval for jobs"
    // }
  ];


return (
    <>
      <Head>
        <title>{t("DRIVERFLY_COMPANY_DASHBOARD")}</title>
        <meta
          name="description"
          content={t("DRIVERFLY_COMPANY_DASHBOARD")}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="header">
            <div className="contentArea ">
              {/********header**********/}
              <Header showMobmenu={() => showMobilemenu()} />
            </div>
            </div>
      <main className="maincontainer">
        < div className="dashboardsidebar">
          <div className="pageWrapper d-md-block d-lg-flex">
            {/******** Sidebar **********/}
            <Sidebar open={open} items={menuItems} />
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

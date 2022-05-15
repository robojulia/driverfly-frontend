import React from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/Sidebar";
import Head from "next/head";

import { useTranslation } from "../../../hooks/useTranslation";
import { Search, ClockHistory, HouseFill, BagFill, PersonFill, FileEarmarkFill, BellFill, SearchHeartFill, CheckSquareFill, GiftFill, GearFill, ShareFill } from 'react-bootstrap-icons';


// driver layout
const FullLayout = ({ children }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      pathname: "/dashboard/driver",
      icon: HouseFill,
      text: "dashboard"
    },
    {
      pathname: "/dashboard/driver/my-account",
      icon: PersonFill,
      text: "my_account",
    },
    // {
    //   pathname: "/dashboard/driver/my-application",
    //   icon: FileEarmarkFill,
    //   text: "my_application"
    // },
    // {
    //   pathname: "/dashboard/driver/my-docs",
    //   icon: FileEarmarkMedicalFill,
    //   text: "my_docs"
    // },
    {
      pathname: "/find-jobs",
      icon: Search,
      text: "find_new_job"
    },
    {
      pathname: "/dashboard/driver/jobs-offered",
      icon: BagFill,
      text: "jobs_offered"
    },
    {
      pathname: "/dashboard/driver/jobs-applied-to",
      icon: CheckSquareFill,
      text: "jobs_applied_to"
    },
    {
      pathname: "/dashboard/driver/jobs-saved",
      icon: ClockHistory,
      text: "jobs_saved"
    },
    {
      pathname: "/dashboard/driver/free-resources",
      icon: GiftFill,
      text: "free_resources"
    },
    {
      icon: GearFill,
      text: "SETTINGS",
      items: [
        {
          pathname: "/dashboard/driver/settings",
          icon: PersonFill,
          text: "MY_ACCOUNT",
        },
        {
          pathname: "/dashboard/driver/settings/applicant",
          icon: FileEarmarkFill,
          text: "my_application",
        },
        {
          pathname: "/dashboard/driver/settings/communication",
          icon: BellFill,
          text: "COMMUNICATION",
        },
        {
          pathname: "/dashboard/driver/settings/sharing",
          icon: ShareFill,
          text: "SHARING",
        },
        {
          pathname: "/dashboard/driver/settings/matching",
          icon: SearchHeartFill,
          text: "JOB_MATCHING",
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{t("driverfly_driver_dashboard")}</title>
        <meta
          name="description"
          content="Ample Admin Next Js Aadmin Dashboard "
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
            {/* <aside
              className={`sidebarArea ${!open ? "" : "showSidebar"
                }`}
            >
              <Sidebar showMobilemenu={() => showMobilemenu()} />
            </aside> */}
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

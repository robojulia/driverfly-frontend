import React, { useEffect } from "react";
import { Container } from "reactstrap";
import Header from "./header/Header";
import Sidebar from "./sidebars/Sidebar";
import Head from "next/head";

import { useTranslation } from "../../../hooks/useTranslation";
import { Search, ClockHistory, HouseFill, BagFill, PersonFill, FileEarmarkFill, BellFill, SearchHeartFill, CheckSquareFill, GiftFill, GearFill, ShareFill, EnvelopeFill, CardList } from 'react-bootstrap-icons';
import useAuth from "../../../hooks/useAuth";


// driver layout
const FullLayout = ({ children }) => {
  const { t } = useTranslation();

  const { user } = useAuth();

  useEffect(() => {
    console.log("FullLayout: USER", user);

  }, [ user ]);

  // const { isDriver } = useAuth();

  // isDriver();

  const menuItems = [
    {
      pathname: "/dashboard/driver",
      icon: HouseFill,
      text: "dashboard"
    },
    {
      pathname: "/dashboard/driver/find-jobs",
      icon: Search,
      text: "find_new_job"
    },
    {
      pathname: "/dashboard/driver/applications",
      icon: CardList,
      text: "MY_APPLICATIONS"
    },
    {
      pathname: "/dashboard/driver/jobs-offered",
      icon: BagFill,
      text: "jobs_offered"
    },
    // {
    //   pathname: "/dashboard/driver/jobs-applied-to",
    //   icon: CheckSquareFill,
    //   text: "jobs_applied_to"
    // },
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
      pathname: "/dashboard/driver/messages",
      icon: EnvelopeFill,
      text: "Messages"
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
         <link rel="icon" href="/img/DriverFly-Official-Favicon.png" />
      </Head>
      <div className="header">
        <div className="contentArea ">
          {/********header**********/}
          <Header />
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

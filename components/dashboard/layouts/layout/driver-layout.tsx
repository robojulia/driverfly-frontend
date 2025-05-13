import Head from "next/head";
import { Scripts } from "../../../scripts/scripts";
import React from "react";

import {
  BagFill,
  BellFill,
  CardList,
  ClockHistory,
  FileEarmarkFill,
  GearFill,
  GiftFill,
  HouseFill,
  PersonFill,
  QuestionCircleFill,
  Search,
  SearchHeartFill,
  ShareFill,
} from "react-bootstrap-icons";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import DashboardLayout from "./dashboard-layout";

// Driver layout
const DriverLayout = ({ children }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (user?.company) {
    return <></>;
  }

  const menuItems = [
    {
      pathname: "/dashboard/driver",
      icon: HouseFill,
      text: "DASHBOARD",
      group: "MAIN",
    },
    {
      pathname: "/dashboard/driver/jobs",
      icon: Search,
      text: "FIND_JOBS",
      group: "MAIN",
    },
    {
      pathname: "/dashboard/driver/applications",
      icon: CardList,
      text: "MY_APPLICATIONS",
      group: "MAIN",
    },
    {
      pathname: "/dashboard/driver/jobs/offered",
      icon: BagFill,
      text: "JOBS_OFFERED",
      group: "JOBS",
    },
    {
      pathname: "/dashboard/driver/jobs/saved",
      icon: ClockHistory,
      text: "JOBS_SAVED",
      group: "JOBS",
    },
    {
      pathname: "/dashboard/driver/free-resources",
      icon: GiftFill,
      text: "FREE_RESOURCES",
      group: "RESOURCES",
    },
    {
      icon: GearFill,
      text: "SETTINGS",
      group: "ADMIN",
      items: [
        {
          pathname: "/dashboard/driver/settings",
          icon: PersonFill,
          text: "MY_ACCOUNT",
        },
        {
          pathname: "/dashboard/driver/settings/applicant",
          icon: FileEarmarkFill,
          text: "MY_APPLICATION",
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
        {
          pathname: "/dashboard/driver/settings/support",
          icon: QuestionCircleFill,
          text: "SUPPORT",
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>{t("driverfly_driver_dashboard")}</title>
        <meta name="description" content={t("driverfly_driver_dashboard")} />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>
      <Scripts />
      <DashboardLayout sidebarItems={menuItems}>{children}</DashboardLayout>
    </>
  );
};

export default DriverLayout;

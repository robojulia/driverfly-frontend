import React from "react";
import LogoutButton from '../../../buttons/Logout';
import { Container } from "reactstrap";
import Header from "../header/Header";
import Sidebar from "../sidebars/vertical/Company-Profile/Sidebar";
import SettingsSidebar from "../sidebars/vertical/Company-Profile/SettingsSidebar";
import Head from "next/head";

import { useTranslation } from "../../../../hooks/useTranslation";
import { useRouter } from "next/router";


const FullLayout = ({ children }) => {
  const { t } = useTranslation();

  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

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
            <aside
              className={`sidebarArea ${!open ? "" : "showSidebar"
                }`}
            >
              <Sidebar showMobilemenu={() => showMobilemenu()} />
            </aside>
            {
              router.asPath.startsWith("/dashboard/company/settings") &&
              <aside className={`sidebarArea ${!open ? "" : "showSidebar"}`}>
                <SettingsSidebar showMobilemenu={() => showMobilemenu()} />
              </aside>
            }
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

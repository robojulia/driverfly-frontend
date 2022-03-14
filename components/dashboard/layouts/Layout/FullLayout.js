import React from "react";
import LogoutButton from '../../../buttons/Logout';
import { Container } from "reactstrap";
import Header from "../header/Header";
import Sidebar from "../sidebars/vertical/Company-Profile/Sidebar";
import Head from "next/head";


const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const showMobilemenu = () => {
    setOpen(!open);
  };

  return (
    <>
      <Head>
        <title>Company-Dashboard</title>
        <meta
          name="description"
          content="Driverfly Dashboard"
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

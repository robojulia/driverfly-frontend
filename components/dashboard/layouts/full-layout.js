import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect, useRef } from "react";
import { Container } from "reactstrap";
import Header from "./header/header.tsx";
import Sidebar from "./sidebars/sidebar";

import { BagFill, BellFill, CardList, ClockHistory, FileEarmarkFill, GearFill, GiftFill, HouseFill, PersonFill, QuestionCircleFill, Search, SearchHeartFill, ShareFill } from 'react-bootstrap-icons';
import { useAuth } from "../../../hooks/use-auth";
import { useTranslation } from "../../../hooks/use-translation";

import { Scripts } from "../../scripts/scripts";
import DriverProfileNav from "./header/driver-profile-nav";


// driver layout
const FullLayout = ({ children }) => {
    const { t } = useTranslation();
    const router = useRouter()
    const { user } = useAuth();

    //  Code below is to set scroll to top on each child page
    const dashboardContainer = useRef(null)
    const resetScrollEffect = ({ element: { current } }) => { current.scrollTop = 0 }
    useEffect(() => resetScrollEffect({ element: dashboardContainer }), [children])

    if (user?.company) {
        return <></>
    }

    const menuItems = [
        {
            pathname: "/dashboard/driver",
            icon: HouseFill,
            text: "DASHBOARD"
        },
        {
            pathname: "/dashboard/driver/jobs",
            icon: Search,
            text: "FIND_JOBS"
        },
        {
            pathname: "/dashboard/driver/applications",
            icon: CardList,
            text: "MY_APPLICATIONS"
        },
        {
            pathname: "/dashboard/driver/jobs/offered",
            icon: BagFill,
            text: "JOBS_OFFERED"
        },
        {
            pathname: "/dashboard/driver/jobs/saved",
            icon: ClockHistory,
            text: "JOBS_SAVED"
        },
        {
            pathname: "/dashboard/driver/free-resources",
            icon: GiftFill,
            text: "FREE_RESOURCES"
        },
        // {
        //     pathname: "/dashboard/driver/messages",
        //     icon: EnvelopeFill,
        //     text: "MESSAGES"
        // },
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
                <meta
                    name="description"
                    content="Ample Admin Next Js Aadmin Dashboard "
                />
                <link rel="icon" href="/img/favicon.ico" />
            </Head>
            <Scripts />
            <div className="header">
                <div className="contentArea ">
                    {/********header**********/}
                    <Header>
                        <DriverProfileNav />
                    </Header>
                </div>
            </div>
            <main className="maincontainer">
                < div className="dashboardsidebar">
                    <div className="pageWrapper d-md-block d-lg-flex">
                        {/******** Sidebar **********/}
                        <Sidebar items={menuItems} />
                        {/********Content Area**********/}
                        <div className="header" ref={dashboardContainer}>


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

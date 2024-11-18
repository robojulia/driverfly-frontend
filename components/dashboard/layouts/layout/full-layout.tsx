
import { Container } from "reactstrap";
import Header from "../header/header";
import Sidebar from "../sidebars/sidebar";
import Head from "next/head";
import { Scripts } from "../../../scripts/scripts";
import React, { useEffect, useRef } from "react";

import { useTranslation } from "../../../../hooks/use-translation";
import {
	QuestionCircleFill,
	TelephoneFill,
	Building,
	CardImage,
	HouseFill,
	BagFill,
	PersonFill,
	FileEarmarkFill,
	GeoAltFill,
	GearFill,
	EnvelopeFill,
	PeopleFill,
	Hospital,
	UmbrellaFill,
	PersonHearts,
	FileEarmarkImage,
	ShieldFillCheck,
	Sliders,
	PersonBadgeFill,
	PersonLinesFill,
	Link45deg
} from 'react-bootstrap-icons';
import CompanyProfileNav from "../header/company-profile-nav";
import { useAuth } from "../../../../hooks/use-auth";
import { useRouter } from 'next/router';
import ContactSupportNote from "../../components/dashboard/banner/contact-support-note";

// company layout
const FullLayout = ({ children }) => {
	const { t } = useTranslation();
	const router = useRouter()

	const { user, isSuperAdmin, company, isCompanyAdmin } = useAuth();

	console.log("FullLayout", { user, isSuperAdmin, isCompanyAdmin })

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
		// {
		// 	pathname: "/dashboard/company/call",
		// 	icon: TelephoneFill,
		// 	text: "CALL",
		// 	startsWith: true
		// },
		{
			pathname: "/dashboard/company/compliance/employee-directory",
			icon: GeoAltFill,
			text: "EMPLOYEES",
			startsWith: true

		},
		{
			icon: FileEarmarkImage,
			text: "STORED_FILES",
			pathname: "/dashboard/company/compliance/stored-files",
			startsWith: true

		},
		{
			pathname: "/dashboard/company/company-preferences",
			icon: Sliders,
			text: "DIGITAL_HIRING_APPLICATION",
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
					startsWith: true,
					visible: isCompanyAdmin && Boolean(!company?.parent),
				},
				{
					pathname: "/dashboard/company/settings/users",
					icon: PeopleFill,
					text: "USERS",
					permissions: "CanViewUser",
					startsWith: true
				},
				{
					pathname: "/dashboard/company/settings/managers",
					icon: PersonLinesFill,
					text: "MANAGERS",
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
				{
					pathname: "/dashboard/company/settings/support",
					icon: QuestionCircleFill,
					text: "SUPPORT",
				},
				// superadmin panel
				{
					icon: Link45deg,
					text: "REFERRALS",
					// visible: isSuperAdmin,
					items: [
						{
							pathname: "/dashboard/company/settings/admin/referral",
							icon: PersonHearts,
							text: "REFERRAL_SOURCES",
							// visible: isCompanyAdmin,
							startsWith: true,
						},
					],
				},
			],

		},



	];
	//  Code below is to set scroll to top on each child page
	const dashboardContainer = useRef(null)
	const resetScrollEffect = ({ element: { current } }) => { current.scrollTop = 0 }
	useEffect(() => resetScrollEffect({ element: dashboardContainer }), [children])

	return (
		<>
			<Head>
				<title>{t("DRIVERFLY_COMPANY_DASHBOARD")}</title>
				<meta
					name="description"
					content={t("DRIVERFLY_COMPANY_DASHBOARD")}
				/>
				<link rel="icon" href="/img/favicon.ico" />
			</Head>
			<Scripts />
			<ContactSupportNote />
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
						<div className="header dashboard-container" ref={dashboardContainer}>
							{/********Middle Content**********/}
							<Container className="px-4 pt-4 wrapper " fluid>
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

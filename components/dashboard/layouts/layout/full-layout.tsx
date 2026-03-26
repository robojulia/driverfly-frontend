import { Container } from 'reactstrap';
import Header from '../header/header';
import Sidebar from '../sidebars/sidebar';
import Head from 'next/head';
import { Scripts } from '../../../scripts/scripts';
import React from 'react';

import { useTranslation } from '../../../../hooks/use-translation';
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
  Link45deg,
  Grid3x3GapFill,
  CarFront,
  Robot,
  Lightning,
  BookFill,
  CreditCard,
} from 'react-bootstrap-icons';
import CompanyProfileNav from '../header/company-profile-nav';
import { useAuth } from '../../../../hooks/use-auth';
import { useRouter } from 'next/router';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import DashboardLayout from './dashboard-layout';

// company layout
const FullLayout = ({ children }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isFeatureEnabled } = useFeatureFlags();

  const { user, isSuperAdmin, company, isCompanyAdmin } = useAuth();

  console.log('FullLayout', { user, isSuperAdmin, isCompanyAdmin });
  console.log('🔍 DEBUG - isCompanyAdmin value:', isCompanyAdmin, 'type:', typeof isCompanyAdmin);
  console.log('🔍 DEBUG - JWT payload:', user?.jwt);
  console.log('🔍 DEBUG - company_admin in JWT:', user?.jwt?.company_admin);

  if (!user?.company) {
    return <></>;
  }

  const menuItems = [
    {
      pathname: '/dashboard/company',
      icon: HouseFill,
      text: 'dashboard',
      group: 'MAIN',
    },
    {
      pathname: '/dashboard/company/jobs',
      icon: BagFill,
      text: 'JOB_LISTINGS',
      permissions: 'CanViewJob',
      startsWith: true,
      group: 'MAIN',
    },
    {
      pathname: '/dashboard/company/applicants',
      icon: FileEarmarkFill,
      text: 'APPLICANTS',
      permissions: 'CanViewApplicant',
      startsWith: true,
      group: 'MAIN',
    },
    {
      pathname: '/dashboard/company/company-preferences',
      icon: Sliders,
      text: 'Recruitment',
      group: 'MAIN',
    },
    {
      pathname: '/dashboard/company/messages',
      icon: EnvelopeFill,
      text: 'MESSAGES',
      startsWith: true,
      group: 'MAIN',
    },
    {
      pathname: '/dashboard/company/campaigns',
      icon: Robot,
      text: 'CAMPAIGNS',
      startsWith: true,
      group: 'MAIN',
      visible: isFeatureEnabled('CAMPAIGNS_ENABLED'),
    },
    // {
    // 	pathname: "/dashboard/company/call",
    // 	icon: TelephoneFill,
    // 	text: "CALL",
    // 	startsWith: true
    // },
    {
      pathname: '/dashboard/company/compliance/employee-directory',
      icon: PeopleFill,
      text: 'EMPLOYEES',
      startsWith: true,
      group: 'COMPANY',
    },
    {
      pathname: '/dashboard/company/auto-recruiting',
      icon: Lightning,
      text: 'AUTO_RECRUITING',
      startsWith: true,
      group: 'COMPANY',
      visible: isFeatureEnabled('AUTORECRUITING_ENABLED'),
    },
    {
      icon: FileEarmarkImage,
      text: 'STORED_FILES',
      pathname: '/dashboard/company/compliance/stored-files',
      startsWith: true,
      group: 'COMPANY',
    },

    {
      pathname: '/dashboard/company/settings/vehicles',
      icon: CarFront,
      text: 'VEHICLES',
      permissions: 'CanViewVehicle',
      startsWith: true,
      group: 'COMPANY',
    },
    {
      pathname: '/dashboard/company/settings',
      icon: GearFill,
      text: 'SETTINGS',
      group: 'ADMIN',
      items: [
        {
          pathname: '/dashboard/company/settings',
          icon: Building,
          text: 'company',
        },
        {
          pathname: '/dashboard/company/settings/billing',
          icon: CreditCard,
          text: 'BILLING',
          permissions: 'CanViewCompany',
          startsWith: true,
        },
        {
          pathname: '/dashboard/company/settings/locations',
          icon: GeoAltFill,
          text: 'LOCATIONS',
          permissions: 'CanViewLocation',
          startsWith: true,
        },
        {
          pathname: '/dashboard/company/settings/companies',
          icon: Hospital,
          text: 'COMPANIES',
          permissions: 'CanViewCompany',
          startsWith: true,
          visible: isCompanyAdmin && Boolean(!company?.parent),
        },
        {
          pathname: '/dashboard/company/settings/users',
          icon: PeopleFill,
          text: 'USERS',
          permissions: 'CanViewUser',
          startsWith: true,
        },
        {
          pathname: '/dashboard/company/settings/managers',
          icon: PersonLinesFill,
          text: 'MANAGERS',
          startsWith: true,
        },
        {
          pathname: '/dashboard/company/settings/profile',
          icon: PersonFill,
          text: 'MY_PROFILE',
        },
        {
          pathname: '/dashboard/company/settings/support',
          icon: QuestionCircleFill,
          text: 'SUPPORT',
        },
        {
          pathname: '/dashboard/company/settings/integrations/facebook',
          icon: Grid3x3GapFill,
          text: 'INTEGRATIONS',
          startsWith: true,
        },
        // superadmin panel
        {
          icon: Link45deg,
          text: 'REFERRALS',
          items: [
            {
              pathname: '/dashboard/company/settings/admin/referral',
              icon: PersonHearts,
              text: 'REFERRAL_SOURCES',
              startsWith: true,
            },
          ],
        },
      ],
    },
    {
      pathname: 'https://learning.driverfly.co',
      icon: BookFill,
      text: 'TRAINING_ACADEMY',
      external: true,
    },
  ];

  return (
    <>
      <Head>
        <title>{t('DRIVERFLY_COMPANY_DASHBOARD')}</title>
        <meta name="description" content={t('DRIVERFLY_COMPANY_DASHBOARD')} />
        <link rel="icon" href="/img/favicon.ico" />
      </Head>
      <Scripts />
      <DashboardLayout sidebarItems={menuItems}>{children}</DashboardLayout>
    </>
  );
};

export default FullLayout;

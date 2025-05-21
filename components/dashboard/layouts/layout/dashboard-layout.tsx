import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../sidebars/sidebar';
import { Dropdown, Modal } from 'react-bootstrap';
import { useAuth } from '../../../../hooks/use-auth';
import { useTranslation } from '../../../../hooks/use-translation';
import { BoxArrowRight, Person, List, QuestionCircle, X, InfoCircle } from 'react-bootstrap-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQuery } from 'react-responsive';
import CompanyProfileNav from '../header/company-profile-nav';
import Impersonate from '../../../impersonate/impersonate';
import styles from '../../../../public/css/dashboard-layout.module.css';
import { getBuildInfo } from '../../../../utils/version';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: any[];
}

export default function DashboardLayout({ children, sidebarItems }: DashboardLayoutProps) {
  // Initialize sidebar to closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasSubmenu, setHasSubmenu] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery({ query: `(max-width: 991.98px)` });
  const buildInfo = getBuildInfo();

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    console.log('Toggling sidebar from', sidebarOpen, 'to', !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  // Function to explicitly set sidebar state
  const setSidebarState = (isOpen: boolean) => {
    console.log('Setting sidebar state to', isOpen);
    setSidebarOpen(isOpen);
  };

  // Function to handle submenu status from Sidebar component
  const handleHasSubmenu = (hasSubmenuValue: boolean) => {
    console.log('Setting has submenu to:', hasSubmenuValue);
    // Only apply has-submenu class if we're not on mobile
    // This prevents the content from being pushed on mobile
    setHasSubmenu(hasSubmenuValue && !isMobile);
  };

  // Close sidebar on route change for mobile (only if route doesn't have submenu)
  useEffect(() => {
    if (isMobile && !hasSubmenu) {
      setSidebarOpen(false);
    }
  }, [router.asPath, isMobile, hasSubmenu]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event) => {
      // Skip if the toggle button was clicked
      if (event.target.closest('.btn-mobile-toggle')) return;

      // If sidebar is open and click is outside sidebar
      if (sidebarOpen && !event.target.closest('.sidebarArea')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  // On mobile size change, reset the hasSubmenu state
  useEffect(() => {
    if (isMobile) {
      setHasSubmenu(false);
    }
  }, [isMobile]);

  const getCurrentPath = () => {
    // Get the full URL including query parameters
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '';
  };

  return (
    <div className={`dashboard-container ${hasSubmenu ? 'has-submenu' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        items={sidebarItems}
        onToggle={setSidebarState}
        onHasSubmenu={handleHasSubmenu}
      />

      {/* Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="main-header">
          {/* Mobile toggle button - ONLY shown on mobile */}
          {isMobile && (
            <button
              className="btn-mobile-toggle"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <X size={20} /> : <List size={20} />}
            </button>
          )}

          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              {/* Company Profile Component - only for company switching */}
              <CompanyProfileNav />

              <div className="profile d-flex align-items-center">
                {/* User Profile Dropdown */}
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" id="dropdown-profile">
                    {user && 'profile_photo' in user ? (
                      <img
                        src={user.profile_photo as string}
                        alt={user?.first_name}
                        className="profile-photo"
                      />
                    ) : (
                      <Person size={24} />
                    )}
                    <span className="d-none d-md-inline ml-2">
                      {user?.first_name} {user?.last_name}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={styles['dropdown-menu']}>
                    <Dropdown.Item href="/dashboard/my-profile" className={styles['dropdown-item']}>
                      <Person className="me-2" size={16} /> {t('MY_PROFILE')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setShowSupportModal(true)}
                      className={styles['dropdown-item']}
                    >
                      <QuestionCircle className="me-2" size={16} style={{ color: '#1b4454' }} />{' '}
                      {t('CONTACT_SUPPORT')}
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    {/* Add Impersonate feature */}
                    <Impersonate />
                    <Dropdown.Item onClick={logout} className={styles['dropdown-item']}>
                      <BoxArrowRight className="me-2" size={16} /> {t('LOGOUT')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* Version Info Button */}
                <button
                  className="btn btn-link ms-2 p-0"
                  onClick={() => setShowVersionModal(true)}
                  style={{ color: '#1b4454', opacity: 0.6 }}
                  title="Version Info"
                >
                  <InfoCircle size={14} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>

      {/* Support Modal */}
      <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('CONTACT_SUPPORT')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t('CONTACT_SUPPORT_MESSAGE_THROUGH')}&nbsp;
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowSupportModal(false);
                const currentPath = getCurrentPath();
                router.push(
                  `${
                    user?.company
                      ? `/dashboard/company/settings/support`
                      : `/dashboard/driver/settings/support`
                  }?page_url=${encodeURIComponent(currentPath)}`
                );
              }}
            >
              {t('CONTACT_SUPPORT_MESSAGE_LINK')}
            </a>
            &nbsp;{t('CONTACT_SUPPORT_MESSAGE_EMAIL')}&nbsp;
            <a href="mailto:help@driverfly.co" onClick={() => setShowSupportModal(false)}>
              help@driverfly.co
            </a>
            .
          </p>
        </Modal.Body>
      </Modal>

      {/* Version Info Modal */}
      <Modal show={showVersionModal} onHide={() => setShowVersionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Build Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>{t('VERSION')}:</strong> {buildInfo.version}
          </div>
          <div className="mb-3">
            <strong>{t('BUILD TIME')}:</strong> {new Date(buildInfo.buildTime).toLocaleString()}
          </div>
          <div>
            <strong>{t('ENVIRONMENT')}:</strong> {buildInfo.environment}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

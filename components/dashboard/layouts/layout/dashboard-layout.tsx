import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../sidebars/sidebar";
import { Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import {
  BoxArrowRight,
  Person,
  List,
  QuestionCircle,
  X,
} from "react-bootstrap-icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: any[];
}

export default function DashboardLayout({
  children,
  sidebarItems,
}: DashboardLayoutProps) {
  // Initialize sidebar to closed
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasSubmenu, setHasSubmenu] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();
  const isMobile = useMediaQuery({ query: `(max-width: 991.98px)` });

  // Toggle sidebar open/closed
  const toggleSidebar = () => {
    console.log("Toggling sidebar from", sidebarOpen, "to", !sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  // Function to explicitly set sidebar state
  const setSidebarState = (isOpen: boolean) => {
    console.log("Setting sidebar state to", isOpen);
    setSidebarOpen(isOpen);
  };

  // Function to handle submenu status from Sidebar component
  const handleHasSubmenu = (hasSubmenuValue: boolean) => {
    console.log("Setting has submenu to:", hasSubmenuValue);
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
      if (event.target.closest(".btn-mobile-toggle")) return;

      // If sidebar is open and click is outside sidebar
      if (sidebarOpen && !event.target.closest(".sidebarArea")) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen]);

  // On mobile size change, reset the hasSubmenu state
  useEffect(() => {
    if (isMobile) {
      setHasSubmenu(false);
    }
  }, [isMobile]);

  const supportPopover = (
    <Popover id="popover-support">
      <Popover.Header as="h3">{t("CONTACT_SUPPORT")}</Popover.Header>
      <Popover.Body>
        {t("CONTACT_SUPPORT_MESSAGE_THROUGH")}&nbsp;
        <Link
          legacyBehavior
          href={
            user?.company
              ? `/dashboard/company/settings/support`
              : `/dashboard/driver/settings/support`
          }
        >
          {t("CONTACT_SUPPORT_MESSAGE_LINK")}
        </Link>
        &nbsp;{t("CONTACT_SUPPORT_MESSAGE_EMAIL")}&nbsp;
        <Link legacyBehavior href={`mailto:help@driverfly.co`}>
          help@driverfly.co
        </Link>
        .
      </Popover.Body>
    </Popover>
  );

  return (
    <div className={`dashboard-container ${hasSubmenu ? "has-submenu" : ""}`}>
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        items={sidebarItems}
        onToggle={setSidebarState}
        onHasSubmenu={handleHasSubmenu}
      />

      {/* Mobile toggle button - ONLY shown on mobile */}
      {isMobile && (
        <button
          className="btn-mobile-toggle"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? <X size={20} /> : <List size={20} />}
        </button>
      )}

      {/* Content */}
      <div className="content-wrapper">
        {/* Header */}
        <header className="main-header">
          <div className="container-fluid">
            <div className="profile">
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" id="dropdown-profile">
                  {user && "profile_photo" in user ? (
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

                <Dropdown.Menu>
                  <Dropdown.Item href="/dashboard/my-profile">
                    <Person className="me-2" size={16} /> {t("MY_PROFILE")}
                  </Dropdown.Item>
                  <OverlayTrigger
                    trigger="click"
                    placement="left"
                    overlay={supportPopover}
                    rootClose
                  >
                    <Dropdown.Item>
                      <QuestionCircle
                        className="me-2"
                        size={16}
                        style={{ color: "#1b4454" }}
                      />{" "}
                      {t("CONTACT_SUPPORT")}
                    </Dropdown.Item>
                  </OverlayTrigger>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={logout}>
                    <BoxArrowRight className="me-2" size={16} /> {t("LOGOUT")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

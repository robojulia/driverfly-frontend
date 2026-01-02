import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/use-auth';
import LoginButton from '../buttons/login';
import SignupButton from '../buttons/signup';
import LogoutButton from '../buttons/logout';
import DashboardButton from '../buttons/dashboard-button';
import { Bell, List, ChevronDown, X } from 'react-bootstrap-icons';

interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Find A Job', href: '/find-jobs' },
  {
    label: 'Driver Resources',
    children: [
      { label: 'FAQs', href: '/faq' },
      { label: 'Resources', href: '/resources' },
      { label: 'Get Your CDL', href: '/find-schools' },
      { label: 'Owner-Operator', href: '/owner-operators' },
    ],
  },
  {
    label: 'Motor Carrier Solutions',
    children: [
      { label: 'Our Solutions', href: 'https://driverfly.co/our-software/', external: true },
      { label: 'Pricing', href: 'https://driverfly.co/pricing', external: true },
      { label: 'Request Quote', href: 'https://driverfly.co/contact-us/', external: true },
      { label: 'Digital Hiring App', href: 'https://digitalhiringapp.com/', external: true },
      { label: 'Third Party Resources', href: '/third-party-resources' },
    ],
  },
  { label: 'Blog', href: 'https://driverfly.co/blog/', external: true },
];

export default function Header({ hideAuthButtons = false }: { hideAuthButtons?: boolean }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState<NavItem[]>(navItems);
  const [overflowItems, setOverflowItems] = useState<NavItem[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isJobsHost, setIsJobsHost] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const desktop = windowWidth >= 992;
      setIsDesktop(desktop);

      if (desktop) {
        setIsMobileMenuOpen(false);
        // Small delay to ensure DOM is ready
        setTimeout(calculateVisibleItems, 100);
      } else {
        // On mobile, all items go to mobile menu
        setVisibleItems([]);
        setOverflowItems([]);
      }
    };

    const calculateVisibleItems = () => {
      if (!containerRef.current) {
        // Default to showing all items if we can't measure
        setVisibleItems(navItems);
        setOverflowItems([]);
        return;
      }

      // For now, show all items on desktop unless screen is very small
      const containerWidth = containerRef.current.offsetWidth;

      // Only use overflow on very small desktop screens (less than 1200px)
      if (containerWidth < 1200) {
        const visible = navItems.slice(0, Math.max(2, 4)); // Show at least 2, up to 4 items
        const overflow = navItems.slice(visible.length);
        setVisibleItems(visible);
        setOverflowItems(overflow);
      } else {
        // Show all items on larger screens
        setVisibleItems(navItems);
        setOverflowItems([]);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Calculate after fonts load
    if (document.fonts) {
      document.fonts.ready.then(handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute if current hostname starts with jobs.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsJobsHost(window.location.hostname.startsWith('jobs.'));
    }
  }, []);

  const shouldShowAuthButtons = !hideAuthButtons && !isJobsHost;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (itemLabel: string) => {
    setOpenDropdown(openDropdown === itemLabel ? null : itemLabel);
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const renderNavItem = (item: NavItem, isMobile = false) => {
    if (item.children) {
      return (
        <li key={item.label} className={`nav-item dropdown ${isMobile ? 'mobile' : ''}`}>
          <button
            className="nav-link dropdown-toggle"
            onClick={() => toggleDropdown(item.label)}
            aria-expanded={openDropdown === item.label}
          >
            {item.label}
          </button>
          <ul className={`dropdown-menu ${openDropdown === item.label ? 'show' : ''}`}>
            {item.children.map((child) => (
              <li key={child.label}>
                {child.external ? (
                  <a
                    href={child.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                  >
                    {child.label}
                  </a>
                ) : (
                  <Link href={child.href || '#'}>
                    <a className="dropdown-item" onClick={() => setIsMobileMenuOpen(false)}>
                      {child.label}
                    </a>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </li>
      );
    }

    return (
      <li key={item.label} className={`nav-item ${isMobile ? 'mobile' : ''}`}>
        {item.external ? (
          <a href={item.href} target="_blank" rel="noopener noreferrer" className="nav-link">
            {item.label}
          </a>
        ) : (
          <Link href={item.href || '#'}>
            <a className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              {item.label}
            </a>
          </Link>
        )}
      </li>
    );
  };

  return (
    <header className="modern-header">
      <div className="header-container" ref={containerRef}>
        {/* Logo */}
        <div className="logo-section">
          <Link href="/">
            <a className="logo-link">
              <img src="/img/DriverFly-Official-Favicon.png" alt="DriverFly" className="logo-img" />
            </a>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isDesktop && (
          <nav ref={navRef} className="desktop-nav">
            <ul className="nav-list">
              {visibleItems.map((item) => renderNavItem(item))}

              {/* More dropdown for overflow items */}
              {overflowItems.length > 0 && (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    onClick={() => toggleDropdown('more')}
                    aria-expanded={openDropdown === 'more'}
                  >
                    More
                  </button>
                  <ul className={`dropdown-menu ${openDropdown === 'more' ? 'show' : ''}`}>
                    {overflowItems.map((item) => (
                      <li key={item.label}>
                        {item.children ? (
                          <div className="dropdown-submenu">
                            <span className="dropdown-item-text">{item.label}</span>
                            <ul className="submenu">
                              {item.children.map((child) => (
                                <li key={child.label}>
                                  {child.external ? (
                                    <a
                                      href={child.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="dropdown-item"
                                    >
                                      {child.label}
                                    </a>
                                  ) : (
                                    <Link href={child.href || '#'}>
                                      <a className="dropdown-item">{child.label}</a>
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dropdown-item"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link href={item.href || '#'}>
                            <a className="dropdown-item">{item.label}</a>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Action Buttons */}
        {isDesktop && shouldShowAuthButtons && (
          <div className="action-buttons">
            {user ? (
              <>
                <DashboardButton className="action-btn primary" />
                <LogoutButton className="action-btn secondary" />
              </>
            ) : (
              <>
                <LoginButton className="action-btn secondary" />
                <SignupButton className="action-btn primary" />
              </>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {!isDesktop && (
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <List size={24} />}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {!isDesktop && shouldShowAuthButtons && (
        <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-list">{navItems.map((item) => renderNavItem(item, true))}</ul>

          {/* Mobile Action Buttons */}
          <div className="mobile-actions">
            {user ? (
              <>
                <DashboardButton className="mobile-action-btn primary" />
                <LogoutButton className="mobile-action-btn secondary" />
              </>
            ) : (
              <>
                <LoginButton className="mobile-action-btn secondary" />
                <SignupButton className="mobile-action-btn primary" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </header>
  );
}

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Navbar } from 'react-bootstrap';
import { Icon } from 'react-bootstrap-icons';
import { ChevronDown, ChevronRight, X } from 'react-bootstrap-icons';
import { useMediaQuery } from 'react-responsive';
import { useAuth, useToken } from '../../../../hooks/use-auth';
import { TranslateInterface, useTranslation } from '../../../../hooks/use-translation';
import { useEffect, useState } from 'react';
import { useFeatureFlags } from '../../../../context/feature-flag-context';
import CompanyApi from '../../../../pages/api/company';
import PromotionalCTA from '../../../shared/PromotionalCTA';

export interface SidebarProps {
  open?: boolean;
  items: SidebarItem[];
  showLogo?: boolean;
  isSubmenu?: boolean;
  onToggle?: (open: boolean) => void;
  onHasSubmenu?: (hasSubmenu: boolean) => void;
}

export interface SidebarItem {
  pathname?: string;
  icon?: Icon;
  text?: string;
  startsWith?: boolean;
  permissions?: string | string[];
  visible?: boolean;
  items?: SidebarItem[];
  isSelected?: boolean;
  group?: string;
  external?: boolean;
}

/**
 * Sidebar component for navigation
 * @param {SidebarProps} props
 */
export default function Sidebar(props: SidebarProps) {
  const { items, open = false, showLogo = true, isSubmenu = false, onToggle, onHasSubmenu } = props;

  const isMobile = useMediaQuery({ query: `(max-width: 991.98px)` });
  const router = useRouter();
  const { t } = useTranslation();
  const { hasPermission, company } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();

  // Auto recruiting state
  const [isAutoRecruitingEnabled, setIsAutoRecruitingEnabled] = useState<boolean | null>(null);
  const companyApi = new CompanyApi();

  // Check auto recruiting status
  useEffect(() => {
    const checkAutoRecruitingStatus = async () => {
      try {
        if (company?.id) {
          const preferences = await companyApi.preferences.list(company.id, {
            label: 'ENROLL_IN_AUTO_RECRUITING',
          });
          const autoRecruitingPref = preferences.find(
            (pref) => pref.label === 'ENROLL_IN_AUTO_RECRUITING'
          );
          setIsAutoRecruitingEnabled(autoRecruitingPref?.value === true);
        }
      } catch (error) {
        console.error('Error fetching auto-recruiting status:', error);
        setIsAutoRecruitingEnabled(false);
      }
    };

    checkAutoRecruitingStatus();
  }, [company?.id]);

  const filteredItems = filterItems(items, hasPermission);

  // Find selected item
  let current = findLast(filteredItems, (v) => IsSelected(v, router.asPath));
  if (!current) current = filteredItems[0];

  // Add debug log to show if submenu should be visible
  const hasVisibleSubmenu = !isMobile && current?.items?.length > 0;

  // Notify parent component if the current item has a visible submenu
  useEffect(() => {
    if (onHasSubmenu) {
      // Only notify parent of submenu if this is the MAIN sidebar (not a submenu itself)
      // and if we actually have a visible submenu to display
      if (!isSubmenu && hasVisibleSubmenu) {
        onHasSubmenu(true);
      } else {
        onHasSubmenu(false);
      }
    }
  }, [current, hasVisibleSubmenu, onHasSubmenu, isSubmenu, router.asPath]);

  // Group items by their group property
  const groupedItems = groupItemsByCategory(filteredItems);

  const handleNavigation = (item: SidebarItem) => {
    if (isMobile) {
      // Only close the sidebar if the item doesn't have children items
      if (!item.items || item.items.length === 0) {
        if (onToggle) onToggle(false);
      }
    }
  };

  const handleAutoRecruiting = () => {
    router.push('/dashboard/company/auto-recruiting');
  };

  useEffect(() => {
    console.log('Sidebar submenu visible:', hasVisibleSubmenu, 'for path:', router.asPath);
  }, [hasVisibleSubmenu, router.asPath]);

  return (
    <>
      <aside
        className={`sidebarArea ${open ? 'showSidebar' : ''} ${isSubmenu ? 'submenu-sidebar' : ''}`}
      >
        {/* Close button for mobile */}
        {isMobile && !isSubmenu && (
          <button
            className="sidebar-close-btn"
            onClick={() => onToggle && onToggle(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}

        {showLogo ? (
          <div className="logo-container">
            <img
              src="/img/logo.png"
              alt="DriverFly Logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        ) : (
          <div className="logo-placeholder"></div>
        )}
        <SidebarArea isMobile={isMobile}>
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <div key={group} className="nav-group">
              {group !== 'undefined' && <div className="nav-group-title">{t(group)}</div>}
              {groupItems.map((v) => (
                <SidebarLink
                  key={v.text}
                  isMobile={isMobile}
                  item={v}
                  t={t}
                  currentPath={router.asPath}
                  onNavigate={() => handleNavigation(v)}
                />
              ))}
            </div>
          ))}
        </SidebarArea>

        {/* Auto Recruiting Promotional CTA - Only show if auto recruiting is not enabled and feature is enabled */}
        {!isSubmenu &&
          isFeatureEnabled('AUTORECRUITING_ENABLED') &&
          isAutoRecruitingEnabled === false && (
            <div style={{ padding: '1rem', marginTop: 'auto' }}>
              <PromotionalCTA
                title="Sign Up For Auto Recruiting"
                buttonText="Get Drivers Now!"
                onClick={handleAutoRecruiting}
              />
            </div>
          )}
      </aside>
      {hasVisibleSubmenu && (
        <Sidebar
          open={open}
          items={current.items}
          showLogo={false}
          isSubmenu={true}
          onToggle={onToggle}
        />
      )}
    </>
  );
}

function SidebarArea({ children, isMobile }) {
  return (
    <div className="side_bar">
      <Navbar expand={isMobile ? true : 'lg'}>
        <Container className="p-0">
          <Navbar.Collapse id="sidebar-nav" className="show">
            <ul>{children}</ul>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

function groupItemsByCategory(items: SidebarItem[]) {
  return items.reduce((acc, item) => {
    const group = item.group || 'undefined';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {});
}

function filterItems(values: SidebarItem[], hasPermission): SidebarItem[] {
  return values
    .map((i) => {
      let { permissions, items, visible } = i;

      if (visible === false) return null;

      if (items) {
        items = filterItems(items, hasPermission);
        if (!items?.length) return null;

        if (items.length === 1)
          return {
            ...items[0],
            text: i.text,
            icon: i.icon,
            group: i.group,
          };

        return {
          ...i,
          pathname: items[0].pathname,
          items: items,
        };
      }

      if (permissions) {
        if (!Array.isArray(permissions)) {
          permissions = [permissions];
        }

        if (!hasPermission(...permissions)) return null;
      }

      return i;
    })
    .filter((v) => v != null);
}

function IsSelected(item: SidebarItem, currentPath) {
  if ('isSelected' in item) return item.isSelected;

  if (item.items) {
    return (item.isSelected = !!findLast(item.items, (v) => IsSelected(v, currentPath)));
  }

  if (item.startsWith) return (item.isSelected = currentPath.startsWith(item.pathname));

  return (item.isSelected = currentPath === item.pathname);
}

function findLast<In>(arr: In[], predicate: (value: In, index: number) => boolean) {
  for (let i = arr.length - 1; i > -1; i--) {
    let value = arr[i];
    if (predicate(value, i)) return value;
  }
}

interface SidebarLinkProps {
  item: SidebarItem;
  isMobile: boolean;
  currentPath: string;
  t: TranslateInterface;
  onNavigate?: () => void;
}

function SidebarLink(props: SidebarLinkProps) {
  const { isMobile, t, currentPath, onNavigate } = props;
  let { icon: Cmp, pathname, items, text, external } = props.item;
  const [expanded, setExpanded] = useState(false);
  const { getToken } = useToken();

  if (!pathname && items) pathname = items[0]?.pathname;

  // Safety check to prevent undefined pathname
  if (!pathname) {
    console.warn('SidebarLink: pathname is undefined for item:', props.item);
    pathname = '#';
  }

  const isActive = IsSelected(props.item, currentPath);
  const hasSubItems = items && items.length > 0;

  // Automatically expand submenu if any child item is active
  useEffect(() => {
    if (hasSubItems && isMobile) {
      const hasActiveChild = items.some((item) => IsSelected(item, currentPath));
      if (hasActiveChild) {
        setExpanded(true);
      }
    }
  }, [currentPath, hasSubItems, isMobile, items]);

  const handleClick = (e) => {
    if (isMobile && hasSubItems) {
      e.preventDefault();
      setExpanded(!expanded);
    }

    // Handle external links with SSO token
    if (external) {
      e.preventDefault();
      const token = getToken();
      if (token) {
        const separator = pathname.includes('?') ? '&' : '?';
        window.open(`${pathname}${separator}sso_token=${encodeURIComponent(token)}`, '_blank');
      } else {
        window.open(pathname, '_blank');
      }
    }

    if (onNavigate) {
      onNavigate();
    }
  };

  // For external links, render without Link wrapper
  if (external) {
    return (
      <li
        className={`${isActive ? 'active' : ''} ${hasSubItems ? 'has-subitems' : ''} ${
          expanded ? 'expanded' : ''
        }`}
      >
        <a href={pathname} onClick={handleClick} target="_blank" rel="noopener noreferrer">
          {Cmp && <Cmp className="icon_left" />}
          <span>{t(text)}</span>
        </a>
      </li>
    );
  }

  return (
    <li
      className={`${isActive ? 'active' : ''} ${hasSubItems ? 'has-subitems' : ''} ${
        expanded ? 'expanded' : ''
      }`}
    >
      <Link href={pathname} scroll={true}>
        <a onClick={handleClick}>
          {Cmp && <Cmp className="icon_left" />}
          <span>{t(text)}</span>
        </a>
      </Link>
      {isMobile && hasSubItems && (
        <ul className={expanded ? 'show' : 'hide'}>
          {items.map((v, i) => (
            <SidebarLink
              key={i}
              isMobile={isMobile}
              item={v}
              t={t}
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

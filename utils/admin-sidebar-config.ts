/**
 * Shared admin sidebar configuration
 * This ensures all admin pages have consistent navigation
 */
export const adminSidebarItems = [
  {
    name: 'Dashboard',
    pathname: '/dashboard/company',
    icon: 'home',
    text: 'Dashboard',
  },
  {
    name: 'Admin Tools',
    pathname: '/admin',
    icon: 'shield',
    text: 'Admin Tools',
    // Exact match only - don't use startsWith so sub-pages don't match this
  },
  {
    name: 'Microservices',
    pathname: '/admin/microservices',
    icon: 'grid',
    text: 'Microservices',
  },
  {
    name: 'Phone Numbers',
    pathname: '/admin/phone-numbers',
    icon: 'phone',
    text: 'Phone Numbers',
  },
  {
    name: 'Companies',
    pathname: '/admin/companies',
    icon: 'building',
    text: 'Companies',
  },
  {
    name: 'Users',
    pathname: '/admin/users',
    icon: 'person',
    text: 'Users',
  },
  {
    name: 'Feature Flags',
    pathname: '/admin/feature-flags',
    icon: 'flag',
    text: 'Feature Flags',
  },
];

/**
 * Get admin sidebar items with the specified item marked as active
 * @param activeItemName - The name of the sidebar item to mark as active
 * @returns Array of sidebar items with the specified item marked as active
 */
export function getAdminSidebarItems(activeItemName: string) {
  return adminSidebarItems.map((item) => ({
    ...item,
    isSelected: item.name === activeItemName,
  }));
}

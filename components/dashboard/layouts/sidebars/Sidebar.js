import { Navbar, Container } from "react-bootstrap";

import { Icon } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/useTranslation";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import useAuth from "../../../../hooks/useAuth";
/**
 * @typedef SidebarProps
 * @property {boolean} open indicates if the sidebar is open or not
 * @property {SidebarItem[]} items
 */

/**
 * @typedef SidebarItem
 * @property {string} pathname The logical path for the link
 * @property {SidebarItem[]} items Indicates whether to check for exact equality or if the path starts with the text
 * @property {Icon} icon
 * @property {string} text 
 * @property {boolean} startsWith
 * @property {string | string[]} permissions
 */

/**
 * 
 * @param {SidebarProps} props 
 */
export default function Sidebar(props) {
    const isMobile = !useMediaQuery({ query: `(min-width: 992px)` });

    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission } = useAuth();

    const items = filterItems(props.items, hasPermission);

    let current = findLast(items, v => IsSelected(v, router.asPath));

    if (!current) current = items[0];

    return (<>
        <aside
            className={`sidebarArea ${!props.open ? "" : "showSidebar"}`}>
            <SidebarArea>
                {items.map((v, i) => (<SidebarLink key={i} isMobile={isMobile} item={v} t={t} currentPath={router.asPath} />))}
            </SidebarArea>
        </aside>
        {!isMobile && current?.items?.length > 0 &&
        <Sidebar open={props.open} items={current.items} />
        }
    </>);
}

/**
 * 
 * @param {SidebarItem[]} items 
 * @param {(string[]) => boolean} hasPermission 
 * @returns {SidebarItem[]}
 */
function filterItems(items, hasPermission) {

    return items.map(i => {
        let { permissions, items } = i;

        if (items) {
            items = filterItems(items, hasPermission);
            if (!items) return null;

            return {
                ...i,
                items: items
            };
        }

        if (permissions) {
            if (!Array.isArray(permissions)) permissions = [permissions];

            if (!hasPermission(...permissions)) return null;
        }

        return i;
    }).filter(v => !!v);

}

function SidebarArea({ children }) {
    return (
        <div className="side_bar">
        <Navbar bg="light" expand="lg">
          <Container className="p-0">
            <Navbar.Toggle aria-controls="basic-navbar-nav " />
            <Navbar.Collapse id="basic-navbar-nav">
              <ul>{children}</ul>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
}

/**
 * 
 * @param {SidebarItem} item 
 */
function IsSelected(item, currentPath) {
    if ("isSelected" in item) return item.isSelected;

    if (item.items) {
        return item.isSelected = !!findLast(item.items, v => IsSelected(v, currentPath));
    }

    if (item.startsWith) return item.isSelected = currentPath.startsWith(item.pathname);

    return item.isSelected = currentPath == item.pathname;
}

/**
 * 
 * @param {any[]} arr 
 * @param {(value, index: number) => boolean} predicate 
 */
function findLast(arr, predicate) {
    for (let i = arr.length - 1; i > -1; i--) {
        let value = arr[i];

        if (predicate(value, i)) return value;
    }
}

/**
 * @typedef SidebarLinkProps
 * @property {SidebarItem} item the sidebar item
 * @property {boolean} isMobile Indicates whether the view is mobile mode or not
 * @property {string} currentPath Indicates if current item is selected
 * @property {(string) => string} t translation
 */

/**
 * 
 * @param {SidebarLinkProps} props 
 */
function SidebarLink(props) {
    let { isMobile, t, currentPath } = props;
    let { pathname, items, icon, text, permissions } = props.item;

    if (!pathname && items) pathname = items[0]?.pathname;

    return (
    <li className={IsSelected(props.item, currentPath) ? "active" : ""}>
        <Link href={pathname}>
            <a href="#">
            {
            icon &&
            <span className="float-left">
                < props.item.icon className="icon_left" />
            </span>
            }
            {t(text)}
            </a>
        </Link>
        {isMobile && items &&
            <ul>
                {items.map((v, i) => (<SidebarLink key={i} isMobile={isMobile} item={v} t={t} currentPath={currentPath} />))}
            </ul>
        }
    </li>);
}
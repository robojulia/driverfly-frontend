import { Navbar, Container } from "react-bootstrap";

import { Icon } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/useTranslation";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
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
 */

/**
 * 
 * @param {SidebarProps} props 
 */
export default function Sidebar(props) {
    const isMobile = !useMediaQuery({ query: `(min-width: 992px)` });

    const router = useRouter();

    const { t } = useTranslation();

    const current = props.items.find(v => IsSelected(v, router.asPath));

    if (!current) throw new Error("Path not properly mapped");

    return (<>
        <aside
            className={`sidebarArea ${!props.open ? "" : "showSidebar"}`}>
            <SidebarArea>
                {props.items.map(v => (<SidebarLink isMobile={isMobile} item={v} t={t} currentPath={router.asPath} />))}
            </SidebarArea>
        </aside>
        {!isMobile && current.items?.length > 0 &&
        <Sidebar open={props.open} items={current.items} />
        }
    </>);
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
        return item.isSelected = item.items.some(v => IsSelected(v, currentPath));
    }

    if (item.startsWith) return item.isSelected = currentPath.startsWith(item.pathname);

    return item.isSelected = currentPath == item.pathname;
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
    let { pathname, items, icon, text } = props.item;

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
                {items.map(v => (<SidebarLink isMobile={isMobile} item={v} t={t} currentPath={currentPath} />))}
            </ul>
        }
    </li>);
}
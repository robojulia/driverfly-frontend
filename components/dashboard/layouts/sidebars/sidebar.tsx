import Link from "next/link";
import { useRouter } from "next/router";
import { Container, Navbar } from "react-bootstrap";
import { Icon } from "react-bootstrap-icons";
import { useMediaQuery } from "react-responsive";
import { useAuth } from "../../../../hooks/use-auth";
import { TranslateInterface, useTranslation } from "../../../../hooks/use-translation";
import { useEffect } from "react";

export interface SidebarProps {
    open?: boolean;
    items: SidebarItem[];
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
}

/**
 * 
 * @param {SidebarProps} props 
 */
export default function Sidebar(props: SidebarProps) {
    let { items, open } = props;

    const isMobile = !useMediaQuery({ query: `(min-width: 992px)` });

    const router = useRouter();

    const { t } = useTranslation();

    const { hasPermission } = useAuth();

    items = filterItems(items, hasPermission);

    let current = findLast(items, v => IsSelected(v, router.asPath));
    // if(current == null) router.back();
    if (!current) current = items[0];

    return (<>
        <aside
            className={`sidebarArea ${!open ? "" : "showSidebar"}`}>
            <SidebarArea>
                {items.map((v, i) => (<SidebarLink key={v.text} isMobile={isMobile} item={v} t={t} currentPath={router.asPath} />))}
            </SidebarArea>
        </aside>
        {!isMobile && current?.items?.length > 0 &&
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

function filterItems(values: SidebarItem[], hasPermission): SidebarItem[] {

    return values.map(i => {
        let { permissions, items, visible } = i;

        if (visible == false) return null;

        if (items) {
            items = filterItems(items, hasPermission);
            if (!items?.length) return null;

            if (items.length == 1) return {
                ...items[0],
                text: i.text,
                icon: i.icon,
            };

            return {
                ...i,
                pathname: items[0].pathname,
                items: items
            };
        }

        if (permissions) {
            if (!Array.isArray(permissions)) {
                permissions = [permissions];
            }

            if (!hasPermission(...permissions)) return null;
        }

        return i;
    }).filter(v => v != null);

}

function IsSelected(item: SidebarItem, currentPath) {
    if ("isSelected" in item) return item.isSelected;

    if (item.items) {
        return item.isSelected = !!findLast(item.items, v => IsSelected(v, currentPath));
    }

    if (item.startsWith) return item.isSelected = currentPath.startsWith(item.pathname);

    return item.isSelected = currentPath == item.pathname;
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
}

function SidebarLink(props: SidebarLinkProps) {
    const router = useRouter();

    let { isMobile, t, currentPath } = props;
    let { icon: Cmp, pathname, items, text } = props.item;

    if (!pathname && items) pathname = items[0]?.pathname;

    return (
        <li className={IsSelected(props.item, currentPath) ? "active" : ""}>
            <Link href={pathname} scroll={true} >
                <a>
                    {
                        Cmp &&
                        <span className="float-left">
                            < Cmp className="icon_left" />
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
import Link from "next/link";
import { Icon } from "react-bootstrap-icons";

export interface BaseSocialLinkProps {
    href?: string;
    text?: string;
    iconSize?: number | string;
    icon?: Icon;
    color?: string;
    background?: string;
}

export function BaseSocialLink(props: BaseSocialLinkProps) {
    const { href, iconSize, text, icon: Ico, color, background } = props;

    return (
        <Link href={href || "#"}>
            <a target="_blank" style={{ color: color, background: background }}>
                < Ico size={iconSize} style={text ? { paddingRight: "5px" } : undefined} />
                {text}
            </a>
        </Link >
    );
}
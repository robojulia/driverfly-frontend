import Link from "next/link";
import { Icon } from "react-bootstrap-icons";

export interface BaseSocialLinkProps {
    href?: string;
    text?: string;
    iconSize?: number | string;
    icon?: Icon;
}

export function BaseSocialLink(props: BaseSocialLinkProps) {
    const { href, iconSize, text, icon: Ico } = props;

    return (
        <Link href={href || "#"}>
            <a target="_blank">
                < Ico size={iconSize} style={text ? { paddingRight: "5px" } : undefined} />
                {text}
            </a>
        </Link>
    );
}
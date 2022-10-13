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

    /*
.instagram{
  background: #f09433; 
background: -moz-linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); 
background: -webkit-linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#f09433', endColorstr='#bc1888',GradientType=1 );
  }    */

    return (
        <Link href={href || "#"}>
            <a target="_blank" style={{ color: color, background: background }}>
                < Ico size={iconSize} style={{ paddingRight: text ? "5px" : undefined }} />
                {text}
            </a>
        </Link >
    );
}
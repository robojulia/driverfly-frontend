import { FacebookLink } from "./links/FacebookLink";
import { InstagramLink } from "./links/InstagramLink";
import { LinkedinLink } from "./links/LinkedinLink";
import { SocialLinkProps } from "./links/SocialLinkProps";

export interface SocialLinksProps extends SocialLinkProps {
    breakComponent?: React.ReactChild;
}

export function SocialLinks(props: SocialLinksProps) {
    const { showText, iconSize, breakComponent } = props;

    return (<>
        <FacebookLink
            showText={showText}
            iconSize={iconSize}
            />
        {breakComponent}
        <InstagramLink
            showText={showText}
            iconSize={iconSize}
            />
        {breakComponent}
        <LinkedinLink
            showText={showText}
            iconSize={iconSize}
            />
    </>);
}
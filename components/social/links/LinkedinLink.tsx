import { Linkedin } from 'react-bootstrap-icons';
import { BaseSocialLink } from './BaseSocialLink';
import { SocialLinkProps } from './SocialLinkProps';

export function LinkedinLink(props: SocialLinkProps) {
    const { showText, iconSize } = props;

    return (
        <BaseSocialLink
            color='#0077B5'
            href="https://www.linkedin.com/company/driverfly"
            text={showText ? "linkedin.com/company/driverfly" : null}
            iconSize={iconSize}
            color="#0072b1"
            icon={Linkedin}
        />
    );

}
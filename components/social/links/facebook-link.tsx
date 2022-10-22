import { Facebook } from 'react-bootstrap-icons';
import { BaseSocialLink } from './base-social-link';
import { SocialLinkProps } from './social-link-props';

export function FacebookLink(props: SocialLinkProps) {
    const { showText, iconSize } = props;

    return (
        <BaseSocialLink
            color="#4267B2"
            href="https://www.facebook.com/DriverFlyJobs/"
            text={showText ? "facebook.com/DriverFlyJobs" : null}
            iconSize={iconSize}
            icon={Facebook}
            
        />
    );

}
import { Facebook } from 'react-bootstrap-icons';
import { BaseSocialLink } from './BaseSocialLink';
import { SocialLinkProps } from './SocialLinkProps';

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
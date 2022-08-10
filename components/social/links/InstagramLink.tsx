import { Instagram } from 'react-bootstrap-icons';
import { BaseSocialLink } from './BaseSocialLink';
import { SocialLinkProps } from './SocialLinkProps';

export function InstagramLink(props: SocialLinkProps) {
    const { showText, iconSize } = props;

    return (
        <BaseSocialLink
            color='#C13584'
            href="https://www.instagram.com/driver_hiring"
            text={showText ? "@driver_hiring" : null}
            iconSize={iconSize}
            icon={Instagram}
        />
    );

}
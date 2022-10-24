import { Instagram } from 'react-bootstrap-icons';
import { BaseSocialLink } from './base-social-link';
import { SocialLinkProps } from './social-link-props';

export function InstagramLink(props: SocialLinkProps) {
    const { showText, iconSize } = props;

    return (
        <BaseSocialLink
            color='#C13584'
            href="https://www.instagram.com/driver_hiring"
            text={showText ? "@driver_hiring" : null}
            iconSize={iconSize}
            // background="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
            icon={Instagram}
        />
    );

}
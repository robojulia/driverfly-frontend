import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "../../hooks/useTranslation";
import { Dropdown } from "react-bootstrap";

export interface LogoutProps {
    as?: React.ElementType;
    className?: string;
}

export default function Logout(props: LogoutProps) {
    let { as: Cmp = Dropdown.Item, className } = props;

    const { t } = useTranslation();
    const { removeAuth } = useAuth();

    const handleLogoutClick = () => {
        removeAuth()
        Router.push('/login')
    }

    return (
        <Cmp
            className={className}
            onClick={handleLogoutClick}>
            {t("LOGOUT")}
        </Cmp>
    )
}
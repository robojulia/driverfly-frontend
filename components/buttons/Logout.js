import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "../../hooks/useTranslation";
import { DropdownItem } from 'reactstrap';


export default function Logout(props) {
    const { t } = useTranslation();
    const { removeAuth } = useAuth();

    const handleLogoutClick = () => {
        removeAuth()
        Router.push('/login')
    }

    return (
        <DropdownItem
            onClick={handleLogoutClick}>
            {t("LOGOUT")}
        </DropdownItem>
    )
}
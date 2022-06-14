import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "../../hooks/useTranslation";
import { Dropdown } from "react-bootstrap";


export default function Logout(props) {
    const { t } = useTranslation();
    const { removeAuth } = useAuth();

    const handleLogoutClick = () => {
        removeAuth()
        Router.push('/login')
    }

    return (
        <Dropdown.Item
            onClick={handleLogoutClick}>
            {t("LOGOUT")}
        </Dropdown.Item>
    )
}
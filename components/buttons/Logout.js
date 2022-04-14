import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "react-i18next";


export default function Logout(props) {
    const { t } = useTranslation();
    const { removeAuth } = useAuth();

    const handleLogoutClick = () => {
        removeAuth()
        Router.push('/login')
    }

    return (
        <>
            <button
                onClick={handleLogoutClick}
                type="button"
                className={props.className}>
                 {t("LOGOUT")}
            </button>
        </>
    )
}
import useAuth from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "react-i18next";


export default function DashboardButton(props) {
    const { t } = useTranslation();
    const { isDriver, isCompany } = useAuth();

    const handleRedirect = () => {
        if (isCompany()) {
            Router.push('dashboard/company')
        } else if (isDriver()) {
            Router.push('dashboard/driver')
        } else {
            Router.push('/')
        }
    }

    return (
        <>
            <button
                onClick={handleRedirect}
                type="button"
                className={props.className}>
                {t("dashboard")}
            </button>
        </>
    )
}
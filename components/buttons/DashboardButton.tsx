import { useAuth } from '../../hooks/useAuth';
import Router from 'next/router'
import { useTranslation } from "../../hooks/useTranslation";


export default function DashboardButton(props) {
    const { t } = useTranslation();
    const { getUser } = useAuth();

    const handleRedirect = () => {
        const user = getUser();

        if (user?.company) {
            Router.push('/dashboard/company')
        } else if (user) {
            Router.push('/dashboard/driver')
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
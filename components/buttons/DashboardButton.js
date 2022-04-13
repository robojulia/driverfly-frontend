import useAuth from '../../hooks/useAuth';
import Router from 'next/router'

export default function DashboardButton(props) {

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
                Dashbaord
            </button>
        </>
    )
}
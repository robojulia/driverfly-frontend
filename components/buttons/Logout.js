import useAuth from '../../hooks/useAuth';
import Router from 'next/router'

export default function Logout() {

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
                className="btn btn-primary mr-4">
                Logout
            </button>
        </>
    )
}
import useAuth from '../../hooks/useAuth';
import Router from 'next/router'

export default function Logout(props) {

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
                Logout
            </button>
        </>
    )
}
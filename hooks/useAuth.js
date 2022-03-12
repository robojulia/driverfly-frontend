import useStorage from './useStorage';
import Router from 'next/router'

const useAuth = () => {

    const { getItem, setItem, removeItem } = useStorage();

    const setAuth = (user) => {
        return setItem('user', JSON.stringify(user));
    }

    const authCheck = () => {
        return getItem('user') ? JSON.parse(getItem('user')) : false;
    }

    const isDriver = () => {
        const user = authCheck();
        return user && user.roles == 'driver'
    }

    const authenticateDriver = () => {
        if (isDriver()) {
            return true;
        }
        Router.push('/')
    }

    const isCompany = () => {
        const user = authCheck();
        return user && user.roles == 'company'
    }

    const authenticateCompany = () => {
        if (isCompany()) {
            return true;
        }
        Router.push('/')
    }

    const removeAuth = () => {
        return removeItem('user')
    }

    return {
        setAuth,
        authCheck,
        isDriver,
        authenticateDriver,
        isCompany,
        authenticateCompany,
        removeAuth,
    };
};


export default useAuth;

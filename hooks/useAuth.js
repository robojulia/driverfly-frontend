import useStorage from './useStorage';
import Router from 'next/router'

import { UserEntity, UserRole } from "../models/user/user.entity";

const useAuth = () => {

    const { getItem, setItem, removeItem } = useStorage();

    /**
     * 
     * @param {UserEntity} user 
     * @returns 
     */
    const setAuth = (user) => {
        return setItem('user', JSON.stringify(user));
    }

    /**
     * 
     * @returns {UserEntity}
     */
     const authCheck = () => {
        const json = getItem('user');
        const user = json ? JSON.parse(json) : false;
        return user;
    }

    const isDriver = () => {
        const user = authCheck();
        return user && user.roles === UserRole.DRIVER
    }

    const authenticateDriver = () => {
        if (isDriver()) {
            return true;
        }
        Router.push('/')
    }

    const isCompany = () => {
        const user = authCheck();
        return !!(user && user.company);
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

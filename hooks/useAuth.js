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
        if (user.roles) {
            const permissions = new Set();

            user.roles.forEach(r => {
                r.permissions.forEach(p => permissions.add(p));
            });

            user.permissions = Array.from(permissions);
        }
        return setItem('user', JSON.stringify(user));
    }

    const hasPermission = (...permissions) => {
        console.log("PermissionCheck: ", permissions);

        const user = authCheck();

        const currentPermissions = new Set(user.permissions || []);

        return user.permissions && permissions.some(p => currentPermissions.has(p));
        
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
        return !!(user && !user.company)
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
        hasPermission,
    };
};


export default useAuth;

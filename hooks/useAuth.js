import useStorage from './useStorage';
import Router from 'next/router'

import { UserEntity, UserRole } from "../models/user/user.entity";

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    let decodedBase64 = null;
    if (window.Buffer) {
        decodedBase64 = Buffer.from(base64, "base64").toString();
    }
    else if (window.atob) {
        decodedBase64 = atob(base64);
    }
    else {
        throw new Error("Unable to decode Base64 str");
    }

    var jsonPayload = decodeURIComponent(decodedBase64.split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const useAuth = () => {

    const { getItem, setItem, removeItem } = useStorage();

    /**
     * 
     * @param {UserEntity} user 
     * @returns 
     */
    const setAuth = (user) => {
        if (user.token && !user.jwt)
            user.jwt = parseJwt(user.token);

        return setItem('user', JSON.stringify(user));
    }

    const hasPermission = (...permissions) => {
        console.log("PermissionCheck: ", permissions);

        const user = authCheck();

        if (user.jwt?.super_admin) return true;

        const currentPermissions = new Set(user.jwt?.permissions || []);

        return user.jwt?.permissions && permissions.some(p => currentPermissions.has(p));
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

    const isSuperUser = () => {
        const user = authCheck();

        return user.jwt?.impersonatedBy || user.jwt?.super_admin || false;
    };

    const isImpersonating = () => {
        const user = authCheck();

        return !!user.jwt?.impersonatedBy;
    };

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
        isSuperUser,
        isImpersonating,
        authenticateDriver,
        isCompany,
        authenticateCompany,
        removeAuth,
        hasPermission,
    };
};


export default useAuth;

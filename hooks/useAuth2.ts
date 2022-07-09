import useStorage from './useStorage';
import { useRouter } from 'next/router'
import { UserEntity } from "../models/user/user.entity";
import { useEffect, useState } from 'react';
import { useEffectAsync } from '../utils/react';

export function parseJwt(token) {
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

export function useToken() {
    const { getItem, setItem, removeItem } = useStorage();
    const storageKey = "user";

    function setUser(user: UserEntity) {
        if (!user.token) throw new Error("User does not have a jwt token");

        if (user.token && !user.jwt)
            user.jwt = parseJwt(user.token);
        
        setItem(storageKey, JSON.stringify(user));
    }

    function removeUser() {
        removeItem(storageKey);
    }

    function getToken(validateExpiry: boolean = true) {
        return getUser(validateExpiry)?.token;
    }

    function getUser(validateExpiry: boolean = true): UserEntity {
        const json = getItem(storageKey);

        let user: UserEntity = null;
        if (json) {
            user = JSON.parse(json);

            if (user) {
                if (!user.jwt) {
                    removeUser();
                    user = null;
                }

                else if (validateExpiry && user.jwt.exp) {
                    const now = new Date().getTime();
                    const exp = user.jwt.exp * 1000;

                    if (exp < now) {
                        removeUser();
                        user = null;
                    }
                }
            }
        }

        return user;
    }

    return {
        setUser,
        removeUser,
        getToken,
        getUser
    };

}

export function useAuth() {
    const {
        setUser,
        removeUser,
        getToken,
        getUser
    } = useToken();

    const [ user, setUserState ] = useState<UserEntity>(getUser(false));

    const router = useRouter();

    useEffectAsync(async () => {
        if (user && user.jwt.exp) {
            const now = new Date().getTime();
            const exp = user.jwt.exp * 1000;
            const expWindow = new Date(exp).setMinutes(15); // refresh timeout
            if (exp < now) {
                if (expWindow < now) {
                    logout();
                    return;
                }
                // todo: refresh token
            }
        }
    }, [ user ]);

    function login(u: UserEntity) {
        setUser(u);
        setUserState(u);

        if (u.company) router.push("/dashboard/company");
        else router.push("/dashboard/driver");
    }

    function logout() {
        setUserState(null);
        loginGuard();
    }

    function loginGuard() {
        if (!user?.jwt) {
            console.log("loginGuard:: is not user")
            if (user)
                removeUser();
            router.push("/login");
            return false;
        }

        console.log("loginGuard:: is user", router.asPath)
        if (user.company) {
            console.log("loginGuard:: is company user", router.asPath)
            if (!router.asPath.toLowerCase().startsWith("/dashboard/company")) {
                router.push("/dashboard/company");
                return false;
            }
        }
        else {
            console.log("loginGuard:: is driver user", router.asPath)
            if (!router.asPath.toLowerCase().startsWith("/dashboard/driver")) {
                router.push("/dashboard/driver");
                return false;
            }
        }

        return true;
    }

    function hasPermission(...permissions) {
        console.log("PermissionCheck: ", permissions);

        if (loginGuard()) {
            if (user.jwt?.super_admin) return true;

            const currentPermissions = new Set(user.jwt?.permissions || []);

            return user.jwt?.permissions && permissions.some(p => currentPermissions.has(p));
        }

        return false;
    }

    return {
        user,
        company: user?.company,
        login,
        logout,
        hasPermission,
        loginGuard,
    };

}
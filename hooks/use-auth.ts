import { useRouter } from 'next/router';
import { useUserContext } from '../context/user-context';
import { JwtRefreshTokenPayload } from '../models/auth/jwt-refresh-token-payload.interface';
import { CompanyEntity } from '../models/company/company.entity';
import { UserEntity } from "../models/user/user.entity";
import AuthApi from '../pages/api/auth';
import useStorage from './use-storage';

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

    var jsonPayload = decodeURIComponent(decodedBase64.split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export function useToken() {
    const storageKey = "user";
    const { getItem, setItem, removeItem } = useStorage();

    function setUser(user: UserEntity) {
        if (!user.token) throw new Error("User does not have a jwt token");

        if (user.token && !user.jwt)
            user.jwt = parseJwt(user.token);


        if (user.refreshToken && !user.jwtRefresh)
            user.jwtRefresh = parseJwt(user.refreshToken);

        setItem(storageKey, JSON.stringify(user));
    }

    function removeUser() {
        removeItem(storageKey);
    }

    function getToken(): string {
        const user = getUser();
        if (user && !isJwtExpired(user.jwt)) return user.token;

        return null;
    }

    function getUser(): UserEntity {
        const json = getItem(storageKey);

        let user: UserEntity = null;
        if (json) {
            user = JSON.parse(json);

            if (user.jwt) {
                let expired = isJwtExpired(user.jwtRefresh || user.jwt);

                if (expired) {
                    console.log("EXPIRED :: Removing user");
                    removeUser();
                    user = null;
                }
            } else {
                removeUser();
                user = null;
            }
        }

        return user;
    }

    function getCompany(): CompanyEntity {
        return getUser()?.company;
    }


    return {
        setUser,
        removeUser,
        getToken,
        getUser,
        getCompany
    };

}

export function jwtExpiryTimeout(jwt: JwtRefreshTokenPayload) {
    const now = new Date();
    const nowMsSinceEpoc = now.getTime();// + (now.getTimezoneOffset() * 60 * 1000);
    const expMsSinceEpoc = jwt.exp * 1000;

    const refreshBufferWindow = 10 * 1000; // 10 seconds

    const msToExpiry = Math.max(0, (expMsSinceEpoc - nowMsSinceEpoc) - refreshBufferWindow);
    // console.log("jwtExpiryTimeout", { nowMsSinceEpoc, expMsSinceEpoc, refreshBufferWindow, msToExpiry });

    // console.log("EXPIRE CHECK", { jwt, now: new Date(nowMsSinceEpoc), exp: new Date(expMsSinceEpoc), msToExpiry })

    return msToExpiry;
}

export function isJwtExpired(jwt: JwtRefreshTokenPayload) {
    if (jwt.exp) {
        const msToExpiration = jwtExpiryTimeout(jwt);
        return msToExpiration <= 0;
    }

    return false;
}

export function useAuth() {
    const {
        setUser,
        removeUser,
    } = useToken();

    const { clearStorageItemsWithPrefix } = useStorage();

    const router = useRouter();

    const userContext = useUserContext();

    function login(u: UserEntity) {
        updateUser(u);

        if (u.company) router.push("/dashboard/company");
        else router.push("/dashboard/driver");
    }

    function updateUser(u: UserEntity) {
        setUser(u);
        userContext.setUser(u);
    }

    async function logout() {
        removeUser();
        clearStorageItemsWithPrefix(`draft_user_${userContext?.user?.id}_`)
        userContext.setUser(null);
    }

    function hasPermission(...permissions) {
        // console.log("PermissionCheck: ", permissions);

        const user = userContext.user;

        if (!user?.jwt) return false;

        if (user.jwt.super_admin) return true;

        const currentPermissions = new Set(user.jwt?.permissions || []);

        return user.jwt?.permissions && permissions.some(p => currentPermissions.has(p));
    }

    async function logoutAndRedirect() {
        logout();
        if (router.asPath.toLowerCase().startsWith("/dashboard")) {
            await router.push("/login");
            return true;
        }

        return false;
    }

    async function loginGuard(): Promise<boolean> {
        const user = userContext.user;

        if (user) {
            if (!user.jwt) {
                console.log("Not valid user");
                return !(await logoutAndRedirect());
            }

            // redirect to correct dashboard if needed
            if (user.company) {
                console.log("loginGuard:: is company user", router.asPath)
                if (router.asPath.toLowerCase().startsWith("/dashboard/driver")) {
                    await router.push("/dashboard/company");
                    return false;
                }
            }
            else {
                console.log("loginGuard:: is driver user", router.asPath)
                if (router.asPath.toLowerCase().startsWith("/dashboard/company")) {
                    await router.push("/dashboard/driver");
                    return false;
                }
            }

            // check validation
            if (isJwtExpired(user.jwt)) {
                console.log("loginGuard:: jwt expired", router.asPath)
                if (user.jwtRefresh) {
                    if (isJwtExpired(user.jwtRefresh)) {
                        console.log("loginGuard:: jwt refresh expired", router.asPath)
                        return !(await logoutAndRedirect());
                    }

                    await refreshToken();
                    return false;
                } else {
                    return !(await logoutAndRedirect());
                }
            } else {
                return true;
            }
        } else {
            return !(await logoutAndRedirect());
        }
    }

    async function refreshToken() {
        const { user } = userContext;
        // console.log("refreshToken:: refreshing jwt", router.asPath);
        try {
            const api = new AuthApi();
            const newUser = await api.refreshToken(user.refreshToken);

            updateUser(newUser);
            return newUser;
        } catch (e) {
            console.error("Unable to refresh jwt token", e);
            await logoutAndRedirect();
        }
    }

    return {
        user: userContext.user,
        company: userContext.user?.company,
        isImpersonating: !!userContext.user?.jwt?.impersonatedBy,
        isSuperAdmin: !!userContext.user?.jwt?.super_admin,
        isCompanyAdmin: !!userContext.user?.jwt?.company_admin,
        updateUser,
        getUser: () => userContext.user,
        getCompany: () => userContext.user?.company,
        login,
        logout,
        hasPermission,
        loginGuard,
        refreshToken,
        logoutAndRedirect
    };

}
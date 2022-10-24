import React, { useState } from "react";
import { useToken } from "../../hooks/use-auth";

import { UserContext } from "../../context/user-context";
import { UserGuard } from "./user-guard";
import { TranslationProvider } from "./translation-provider";

export interface AuthProviderProps {
    Component: React.ElementType;
    pageProps: any
}

export function AuthProvider(props: AuthProviderProps) {
    const { Component, pageProps } = props;
    const { getUser } = useToken();

    const [ userContext, setUserContext ] = useState({
        user: getUser(),
        setUser: updateUserContext
      });
    
    function updateUserContext(u) {
        setUserContext({ user: u, setUser: updateUserContext })
    }
    const getPermissions = (Component as any).Permissions;
    const getLayout = (Component as any).getLayout || ((page) => page)

    return (
        <UserContext.Provider value={userContext}>
            <TranslationProvider>
                <UserGuard permissions={getPermissions}>
                    {getLayout(<Component {...pageProps} />)}
                </UserGuard>
            </TranslationProvider>
        </UserContext.Provider>
    );
}
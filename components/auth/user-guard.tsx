import { useRouter } from "next/router";
import React, { useState } from "react";
import { jwtExpiryTimeout, useAuth } from "../../hooks/useAuth";
import { useEffectAsync } from "../../utils/react";

export interface UserGuardProps {
    permissions?: string | string[];
    readonly children: React.ReactChildren | React.ReactChild
}

export function UserGuard({ permissions, children }: UserGuardProps) {
    const router = useRouter();

    const [ isLoading, setIsLoading ] = useState(true);
    const { user, hasPermission, loginGuard } = useAuth();

    const [ timeoutId, setTimeoutId ] = useState(null);

    useEffectAsync(CheckAuth, [ isLoading, user, router.asPath ], () => {
        if (timeoutId) window.clearTimeout(timeoutId);
    });

    async function CheckAuth() {
        console.log("Checking Auth...");
        if (await loginGuard()) {
            if (permissions) {
                if (user) {
                    if (typeof permissions === "string")
                        permissions = [permissions];

                    if (hasPermission(...permissions)) setIsLoading(false);
                }
            }
            else
                setIsLoading(false);

            if (user && user.jwt.exp) {
                const msToExpiration = jwtExpiryTimeout(user.jwt);
                console.log("Expires in ms: ", msToExpiration);

                const timeoutId = window.setTimeout(CheckAuth, msToExpiration);

                setTimeoutId(timeoutId);
            }
        }
    }
  
    if (isLoading) {
        // todo: build loading page
        return <>Checking authorization...</>;
    }

    return <>{children}</>

}
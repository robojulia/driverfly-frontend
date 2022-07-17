import { useRouter } from "next/router";
import React, { useState } from "react";
import { jwtExpiryTimeout, useAuth } from "../../hooks/useAuth";
import { useEffectAsync } from "../../utils/react";
import { Loading } from "../loading/loading";

export interface UserGuardProps {
    permissions?: string | string[];
    readonly children: React.ReactChildren | React.ReactChild
}

export function UserGuard({ permissions, children }: UserGuardProps) {
    const router = useRouter();

    const { user, hasPermission, loginGuard } = useAuth();

    const [ timeoutId, setTimeoutId ] = useState(null);

    function destructor() {
        if (timeoutId) window.clearTimeout(timeoutId);
    }

    async function CheckAuth() {
        console.log("Checking Auth...");
        if (await loginGuard()) {
            if (permissions) {
                if (user) {
                    if (typeof permissions === "string")
                        permissions = [permissions];

                    if (!hasPermission(...permissions)) {
                        await router.push("/");
                        return;
                    }
                }
            }

            if (user && user.jwt.exp) {
                const msToExpiration = jwtExpiryTimeout(user.jwt);
                console.log("Expires in ms: ", msToExpiration);

                const timeoutId = window.setTimeout(CheckAuth, msToExpiration);

                setTimeoutId(timeoutId);
            }
        }
    }

    return (<Loading
        fetch={CheckAuth}
        triggers={[ user, router.asPath ]}
        destructor={destructor}
        loadingText={"Checking authorization..."}
        >
        {children}
    </Loading>);
}
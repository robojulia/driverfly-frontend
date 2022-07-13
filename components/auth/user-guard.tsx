import { useState } from "react";
import { jwtExpiryTimeout, useAuth } from "../../hooks/useAuth";
import { useEffectAsync } from "../../utils/react";

export default function UserGuard({ children }) {
    const [ isLoading, setIsLoading ] = useState(true);
    const { user, loginGuard } = useAuth();

    const [ timeoutId, setTimeoutId ] = useState(null);

    useEffectAsync(CheckAuth, [ isLoading, user ], () => {
        if (timeoutId) window.clearTimeout(timeoutId);
    });

    async function CheckAuth() {
        console.log("Checking Auth...");
        if (await loginGuard()) {
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
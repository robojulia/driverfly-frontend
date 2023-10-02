import { useState } from "react";
import { useEffectAsync } from "../../utils/react";

export interface LoadingProps {
    fetch: (() => void | boolean) | (() => Promise<void | boolean>);
    triggers?: any[];
    loadingText?: string;
    destructor?: () => void;
    readonly children: any;
}

export function Loading(props: LoadingProps) {
    const { fetch, children, triggers, loadingText, destructor } = props;

    const [loading, setLoading] = useState(true);

    useEffectAsync(async () => {
        let result = fetch();

        if (result instanceof Promise) {
            result = await result;
        }

        setLoading(typeof result === "boolean" ? !result : false);
    }, triggers || [], destructor);

    // todo: build spash screen
    if (loading) return <>{loadingText || "Loading..."}</>;

    return children;
}

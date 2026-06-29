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
        try {
            let result = fetch();

            if (result instanceof Promise) {
                result = await result;
            }

            setLoading(typeof result == "boolean" ? !result : false);
        } catch (e) {
            // Never leave the user stuck on the spinner: if the fetch throws
            // (e.g. an auth check or a redirect that rejects), reveal the
            // children rather than spinning forever.
            console.error('[Loading] fetch failed; rendering children to avoid a stuck spinner', e);
            setLoading(false);
        }
    }, triggers || [], destructor);

    // todo: build spash screen
    if (loading) return <>{loadingText || "Loading..."}</>;

    return children;
}

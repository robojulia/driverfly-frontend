
import { DependencyList, useEffect } from "react";

function useEffectAsync(effect: () => Promise<void>, deps?: DependencyList, destructor?: () => void): void {
    return useEffect(() => {
        effect().catch((e) => {
            console.error('[useEffectAsync] Unhandled async error:', e);
        });

        return destructor;
    }, deps);
}

export {
    useEffectAsync
};
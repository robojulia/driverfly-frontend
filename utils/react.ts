
import { DependencyList, useEffect } from "react";

function useEffectAsync(effect: () => Promise<void>, deps?: DependencyList): void {
    return useEffect(() => {
        effect();
    }, deps);
}

export {
    useEffectAsync
};
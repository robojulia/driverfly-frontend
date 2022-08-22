
import { useEffectAsync } from "../utils/react";

const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

export function ScrollToTOp() {
    useEffectAsync(async () => {
        if (isBrowser) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }  
    }, []);
}
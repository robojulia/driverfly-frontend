import { createContext, useContext } from "react";

const TranslationContext = createContext<{
}>({
});
TranslationContext.displayName = "Translations";

export {
    TranslationContext
}

export function useTranslationContext() {
    return useContext(TranslationContext);
}

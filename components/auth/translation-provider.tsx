import React, { useState } from "react";

import { useRouter } from "next/router";
import { useAuth } from "../../hooks/use-auth";
import { TranslationContext } from "../../context/translation-context";
import { Loading } from "../loading/loading";
import translations_EN_US from "../../public/assets/locales/en-us/translation.json";
import { i18n } from "../../next.config";

export interface TranslationProviderProps {
    readonly children: React.ReactChildren | React.ReactChild
}

export function TranslationProvider(props: TranslationProviderProps) {
    const { children } = props;

    let { locale } = useRouter();
    const { user } = useAuth();

    if (user) {
        if (i18n?.locales.some(v => v == user.language))
            locale = user.language;
    }

    const [translationContext, setTranslationContext] = useState({});

    async function fetchTranslations() {
        const locales = {
            "en": translations_EN_US,
            "en-us": translations_EN_US,
        };

        let json = locales[locale];// await fetchTranslations(locale, ns);

        if (!json) {
            json = locales['en'];
            // json = await fetchTranslations("en-us", ns);
        }

        setTranslationContext(json);
    }
    return (
        <Loading fetch={fetchTranslations} triggers={[locale]}>
            <TranslationContext.Provider value={translationContext}>
                {children}
            </TranslationContext.Provider>
        </Loading>
    );
}
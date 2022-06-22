import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
// import * as fs from "fs/promises";
// const fsp = require('fs').promises

import useAuth from "./useAuth";
import { i18n } from "../next.config";

import translations_EN_US from "../public/assets/locales/en-us/translation.json";

export interface TranslateInterface {
    (name: string, props?: { [key: string]: string }, options?: { translateProps: boolean }): string;
    ready: boolean;
}

export function useTranslation (ns?: string) {
    const locales = {
        "en": translations_EN_US,
        "en-us": translations_EN_US,
    };
    let { locale } = useRouter();

    // if (!ns) ns = "translation";

    const [ translations, setTranslations ] = useState({});

    const { authCheck } = useAuth();
    const user = authCheck();

    if (user) {
        if (i18n?.locales.some(v => v === user.language))
            locale = user.language;
    }

    /**
     * 
     * @param {string} name 
     * @param {{ [key: string]: string }} props 
     * @param {{ translateProps: boolean }} options
     */
    const t: TranslateInterface = (name, props = null, options = null) => {
        if (name == null) return;
        
        /**
         * @type {string}
         */
        let translatedText = null;

        const parts = `${name}`.split(".");
        let translationObj = translations;
        parts.forEach(p => {
            if (translationObj) translationObj = translationObj[p];
        });

        if (typeof translationObj === "string") {
            translatedText = translationObj;

            if (props) {
                Object
                    .entries(props)
                    .forEach(([key, value]) => {
                        translatedText = translatedText.replace(new RegExp("{{" + key+ "}}", "gm"), options?.translateProps ? t(value) : value);
                    });
            }
        }
        else translatedText = name;

        return translatedText;
    }

    const fetchTranslations = async (lang, ns) => {
        let url = `/assets/locales/${lang}/${ns}.json`;

        try {
            const resp = await fetch(url);

            const json = await resp.json();

            return json;
        }
        catch (e) {
            console.error("UNABLE TO FETCH TRANSLATIONS", e, url);
        }

    }

    useEffect(() => {
        
        let json = locales[locale];// await fetchTranslations(locale, ns);

        if (!json) {
            json = locales['en-us'];
            // json = await fetchTranslations("en-us", ns);
        }

        if (ns) {
            json = json[ns];
        }

        setTranslations(json);

    }, [ locale, ns ]);

    // quick check to see if we've loaded translations
    t.ready = Object.keys(translations).length > 0;

    return { t };
};


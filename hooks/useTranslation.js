import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
// import * as fs from "fs/promises";
// const fsp = require('fs').promises

import useAuth from "./useAuth";
import { i18n } from "../next.config";
/**
 * 
 * @param {string} ns the namespace to use (defaults to common)
 * @returns 
 */
export function useTranslation (ns) {
    let { locale } = useRouter();

    if (!ns) ns = "translation";

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
     * @param {{ translateProps: string }} options
     */
    const t = (name, props, options) => {
        /**
         * @type {string}
         */
        let translatedText = null;

        const parts = name.split(".");
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

    useEffect(async () => {
        const json = await fetchTranslations(locale, ns);

        if (!json) {
            json = await fetchTranslations("en-us", ns);
        }

        setTranslations(json);

    }, [ locale, ns ]);

    return { t };
};


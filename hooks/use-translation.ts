import { useTranslationContext } from "../context/translation-context";

export interface TranslateInterface {
    (name: string, props?: { [key: string]: string|number }, options?: { translateProps: boolean }): string;
    ready: boolean;
}

export function useTranslation (ns?: string) {

    let translations = useTranslationContext();

    if (ns) translations = translations[ns] || {};

    const t: TranslateInterface = (name: string, props?: Record<string, string|number>, options?: { translateProps: boolean }) => {
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
                        translatedText = translatedText.replace(new RegExp("{{" + key+ "}}", "gm"), options?.translateProps ? t(`${value}`) : value);
                    });
            }
        }
        else translatedText = name;

        return translatedText;
    }


    // quick check to see if we've loaded translations
    t.ready = Object.keys(translations).length > 0;

    return { t };
};


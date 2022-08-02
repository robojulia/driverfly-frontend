import { TranslateInterface } from "../hooks/useTranslation";

export function matchEnum(str: string, enumObj: any, labelPrefix: string, t: TranslateInterface): any {
    const options = Object.entries(enumObj);

    const found = options.find(([key, value]) => {
        const search = str.toLowerCase();
        if (search === key.toLowerCase() || search === `${value}`.toLowerCase()) return true;

        const translated = t(`${labelPrefix}.${key}`).toLowerCase();
        if (search === translated) return true;

        if (translated.includes(search)) return true;
    });

    if (found) return found[1];

    return str;

}
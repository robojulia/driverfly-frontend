import { useTranslation } from "../hooks/use-translation";

export default function joinArrayElements(arr, specialValue, labelPrefix) {
    const { t } = useTranslation();
    if (!Array.isArray(arr)) return '';

    let restrictions = arr.filter(item => item !== specialValue);

    restrictions = restrictions.map(item => t(labelPrefix) ? t(`${labelPrefix}.${item}`) : item);

    let joinedRestrictions = restrictions.join(",");

    if (arr.includes(specialValue)) {
        let translatedSpecialValue = t(labelPrefix) ? t(`${labelPrefix}.${specialValue}`) : specialValue;
        joinedRestrictions += "," + translatedSpecialValue;
    }

    return joinedRestrictions || t("NONE");
}
import { useTranslation } from "react-i18next";

export default function ShowEnumFromString(props) {
    const { t } = useTranslation();

    if (!props.str) {
        return <></>
    }

    let str = Array.isArray(props.str) ? props.str.toString() : `${props.str}`
    // console.log("props.str", props.str);
    // console.log("str", str);
    const separator = props.separator ? props.separator : ','
    const skipTranslate = props.skipTranslate ? true : false
    const skipLowerCase = props.skipLowerCase ? true : false

    const arr = str.split(separator)
    // console.log("arr", arr);
    // console.log("t", t(''));

    const templateString = arr.map(item => {
        const enumValue = !(props.enumArray[item]) ? '' : (skipLowerCase ? props.enumArray[item] : props.enumArray[item].toLowerCase())
        // t((props.labelPrefix ? props.labelPrefix + "." : "") + enumValue)
        return skipTranslate ? enumValue : t((props.labelPrefix ? props.labelPrefix + "." : "") + enumValue)
    }).join(', ')
    return templateString
}
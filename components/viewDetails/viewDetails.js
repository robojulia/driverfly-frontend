import { TableCell, Table, TableRow, TableHead, TableContainer } from "@mui/material";

import { useTranslation } from "../../hooks/useTranslation";

/**
 * @typedef ViewDetailProps
 * @property {object.<string, string|boolean|Date|ListValue>} obj
 * @property {string|() => string} default The value to display if the text is null
 */

/**
 * @typedef ListValue
 * @property {boolean|() => boolean} show Indicates if the cell will be shown or not
 * @property {string} label The label translation key to use, if not specified the object key will be used
 * @property {Array<string|boolean|Date|ListValue>} items The list of items to display
 * @property {string|number|boolean|Date} text The value of the label to display
 * @property {string|() => string} default The default value to display
 */

/**
 * 
 * @param {ViewDetailProps} props 
 * @returns 
 */
export default function ViewDetails(props) {
    const { t } = useTranslation();

    /**
     * 
     * @param {ListValue} value 
     */
    const resolveText = (value) => {
        return resolveValue(value) || resolveValue(value?.default || props.default);
    }

    /**
     * 
     * @param {string|boolean|Date|ListValue} value 
     */
    const resolveValue = (value) => {
        switch (typeof value) {
            case "function": return value();
            case "boolean":
                switch (value) {
                    case true: return t("YES");
                    case false: return t("NO");
                }
                break;
            case "object":
                if (value instanceof Date) {
                    return value.toDateString();
                }

                if (value instanceof Array) {
                    return value.map(t).join(", ");
                }
                return resolveValue(value?.text);
            default: return value?.toString();
        }

    }

    /**
     * 
     * @param {string} key 
     * @param {ListValue} value 
     * @param {number} i 
     */
    const resolveItem = (key, value, i) => {
        // coherse value into ListValue compatible type
        if (value && typeof value === "object")
        {
            if (value instanceof Array) {
                value = {
                    label: key,
                    items: value
                };
            }
            else if (value instanceof Date) {
                value = {
                    label: key,
                    text: value
                }
            }
            else {
                value.label = value.label || key;
            }
        }
        else {
            value = {
                label: key,
                text: value
            };
        }

        // resolve display property
        if (typeof value.show === "function") {
            value.show = value.show();
        }

        if (value.show === false) return;

        if (typeof value.default === "function") {
            value.default = value.default();
        }

        if (value.items) {
            // nested table
            const firstValue = value.items[0];
            if (typeof firstValue === "object")
            {
                return (
                    <>
                    <TableRow>
                        <TableCell colSpan={2}>
                            {t(value.label)}
                            <hr />
                            <Table>
                                {
                                    <TableRow>
                                        {Object.entries(firstValue).map(([subKey, subValue], subI) => (
                                            <TableCell key={subI}><strong>{t(subValue.label || subKey)}</strong></TableCell>
                                        ))}
                                    </TableRow>
                                }
                                {
                                    value.items.map(v => (
                                    <TableRow>
                                        {Object.values(v).map((subValue, subI) => (
                                            <TableCell key={subI}>{resolveText(subValue)}</TableCell>
                                        ))}
                                    </TableRow>
                                    ))
                                }
                            </Table>
                        </TableCell>
                    </TableRow>
                    </>
                );
            }
            else {
                value.text = value.items;
                delete value.items;
            }
        }

        return (<>
            <TableRow>
                <TableCell>{t(value.label)}</TableCell>
                <TableCell>{resolveText(value)}</TableCell>
            </TableRow>
        </>);
    }

    return (
        <Table>
            {Object
                .entries(props.obj)
                .map(([ key, value ], i) => resolveItem(key, value, i))}
        </Table>
    );

}
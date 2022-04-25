import ViewTableStyle from "../../public/components/styles/css/ViewTable.module.css"
import { useTranslation } from "react-i18next";
import { Table } from "react-bootstrap";

/**
 * @typedef ViewTableProps
 * @property {object} headers
 * @property {string} type
 * @property {object[]} items
 */

/**
 * 
 * @param {ViewTableProps} props 
 * @returns 
 */
export default function ViewTable(props) {
    const { t } = useTranslation();

    const { headers, type, items } = props;
    if (!headers) return null;

    const headerLabels = Object.values(headers);

    if (headerLabels.length == 0) return null;

    const headerKeys = Object.keys(headers);

    return (
        <Table bordered striped className={ViewTableStyle.view_table} >
            <thead>
                <tr>
                    {headerLabels?.map((label, i) => (<th key={i}>{label && typeof label === "string" ? t(label) : label}</th>))}
                </tr>
            </thead>

            <tbody>
                {!items?.length && type &&
                    <tr>
                        <td colSpan={headerLabels.length}>
                            {t("NO_{name}_FOUND", { name: t(type) })}
                        </td>
                    </tr>
                }
                {items?.map((item, i) => (
                    <tr key={i}>
                        {headerKeys?.map(v => (<td>{item[v]}</td>))}
                    </tr>
                ))}
            </tbody>
    </Table>
    );

}
import { useTranslation } from "../../hooks/useTranslation";
import { Button, Dropdown } from "react-bootstrap";
import DataTable, { TableColumn } from 'react-data-table-component';
import BaseInput from "../forms/BaseInput";
import { Gear, Search } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import ListActions, { ListActionOptions } from "../list-actions/ListActions";
import useStorage from "../../hooks/useStorage";
import { ExpandableRowsComponent } from "react-data-table-component/dist/src/DataTable/types";

export interface ViewTableProps<TElement> {
    columns: ViewTableColumn<TElement>[];
    items: TElement[];
    columnSettingKey?: string;
    actions?: (row: TElement) => ListActionOptions[];
    preExpanded?: boolean | ((TElement) => boolean);
    expandableRowsComponent?: ExpandableRowsComponent<TElement>;
    hideSearch?: boolean;

}

export interface ViewTableColumn<TElement> extends TableColumn<TElement> {
    hidable?: boolean;
}

export default function ViewDataTable<TElement>(props: ViewTableProps<TElement>) {

    const { t } = useTranslation();

    const storageApi = useStorage();

    const storageType = null;

    const [items, setItems] = useState([]);
    const [columns, setColumns] = useState<ViewTableColumn<TElement>[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        setItems(props.items);
        let newColumns: ViewTableColumn<TElement>[] = [];
        if (props.actions) {
            newColumns = [
                ...props.columns,
                {
                    maxWidth: "10px",
                    selector: j => (
                        <ListActions
                            options={props.actions(j)}
                        />
                    )
                }
            ] as any;
        }
        else
            newColumns = props.columns;

        if (props.columnSettingKey) {
            const presetColumnsStr = storageApi.getItem(props.columnSettingKey);

            if (presetColumnsStr) {
                try {
                    const presetColumns: string[] = JSON.parse(presetColumnsStr);

                    const columnsSet = new Set<string>(presetColumns);

                    newColumns.forEach(v => {
                        if (v.hidable && typeof v.name === "string")
                            v.hide = columnsSet.has(v.name) ? 0 : 1;
                    });
                }
                catch {

                }
            }

        }

        setColumns(newColumns);
    }, [ props ]);

    const onSearchClick = (e?: React.MouseEvent) => {
        setItems(
            props.items.filter(v =>
                columns.some(c => c.name && !c.hide && c.selector && !!c.selector(v)?.toString()?.toLowerCase()?.includes(search)))
        )

    };

    const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onSearchClick();

    };

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onColumnHide = (idx) => {
        const newColumns = columns.map((v, i) => ({
            ...v,
            hide: idx == i ? (v.hidable !== false && !v.hide ? 1 : 0) : v.hide
        }));

        if (props.columnSettingKey)
            storageApi.setItem(props.columnSettingKey, JSON.stringify(newColumns.filter(v => !v.hide && !v.name && v.hidable).map(v => v.name)));

        setColumns(newColumns);
    }

    const canHideColumns = props.columns.some(v => !("hidable" in v) || v.hidable);

    return (
        <DataTable<TElement>
            columns={columns.filter(v => !v.hide).map(v => ({
                ...v,
                name: typeof v.name === "string" ? t(v.name) : v.name,
                hide: v.hide ? 1 : 0,
                sortable: !!v.name,
            }))}
            striped
            responsive
            fixedHeader

            noDataComponent={(<>{t("NO_RECORDS_FOUND")}</>)}

            expandOnRowClicked
            expandableRowsHideExpander
            expandableRowExpanded={row => !props.preExpanded ? false : (typeof props.preExpanded === "boolean" ? props.preExpanded : props.preExpanded(row))}
            expandableRows={!!props.expandableRowsComponent}
            expandableRowsComponent={props.expandableRowsComponent}

            subHeader
            subHeaderComponent={!props.hideSearch && <>
                <BaseInput
                    placeholder="SEARCH"
                    onKeyDown={onSearchKey}
                    onChange={e => setSearch(e.target.value.toLowerCase())}
                    value={search}
                    append={(<>
                        <Button variant="primary" type="button" onClick={onSearchClick}><Search /></Button>
                        {canHideColumns &&
                            <Dropdown
                                autoClose="outside"
                            >
                                <Dropdown.Toggle variant="" className="theme-general-btn">
                                    <Gear />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="select_dropdown">
                                    {
                                        columns.filter(v => !!v.name).map((v, i) => (
                                            <Dropdown.Item disabled={v.hidable === false} key={i} onClick={() => onColumnHide(i)}>
                                                {v.hide ? (<del>{typeof v.name === "string" ? t(v.name) : v.name}</del>) : (v.hidable === false ? (<i>{t(v.name as any)}</i>) : t(v.name as any))}
                                            </Dropdown.Item>
                                        ))
                                    }
                                </Dropdown.Menu>

                            </Dropdown>
                        }
                    </>)}
                />
            </>}

            data={items}
        />

    );

}

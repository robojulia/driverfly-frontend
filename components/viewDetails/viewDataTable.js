import ViewTableStyle from "../../public/components/styles/css/ViewTable.module.css"
import { useTranslation } from "../../hooks/useTranslation";
import { Button, Dropdown, DropdownButton, Table } from "react-bootstrap";
import DataTable from 'react-data-table-component';
import BaseInput from "../forms/BaseInput";
import { Columns, Gear, Search } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import BaseCheck from "../forms/BaseCheck";
import ListActions from "../list-actions/ListActions";

/**
 * @typedef ViewTableProps
 * @property {import("react-data-table-component/dist/src/DataTable/types").TableColumn[]} columns
 * @property {object[]} items
 * @property {(object) => object[]} actions
 */

/**
 * 
 * @param {ViewTableProps} props 
 * @returns 
 */
export default function ViewDataTable(props) {
    const { t } = useTranslation();

    const [ items, setItems ] = useState([]);
    const [ columns, setColumns ] = useState([]);
    const [ search, setSearch ] = useState("");

    useEffect(() => {
        setItems(props.items);
        if (props.actions) {
            setColumns([
                ...props.columns,
                {
                    maxWidth: "10px",
                    selector: j => (
                        <ListActions
                            options={props.actions(j)}
                            />
                    )
                }
            ]);
        }
        else
            setColumns(props.columns);
    }, [ props ]);

    const onSearchClick = (e) => {
        setItems(
            props.items.filter(v => 
                columns.some(c => c.name && !c.hide && !!c.selector(v)?.toLowerCase().includes(search)))
        )

    };


    /**
     * 
     * @param {React.KeyboardEvent<HTMLInputElement>} e 
     */
    const onSearchKey = (e) => {
        if (e.key === "Enter") onSearchClick();

    };

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onColumnHide = (idx) => {
        // const { name, value } = e.target;
        setColumns(columns.map((v, i) => ({
            ...v,
            hide: idx == i ? v.hidable !== false && !v.hide : !!v.hide

        })))
    }

    return (
        <DataTable
            columns={columns.filter(v => !v.hide).map(v => ({
                ...v,
                name: t(v.name),
                sortable: !!v.name,
            }))}
            striped
            responsive
            fixedHeader

            subHeader
            subHeaderComponent={<>
                <BaseInput
                    placeholder="SEARCH"
                    onKeyDown={onSearchKey}
                    onChange={e => setSearch(e.target.value.toLowerCase())}
                    value={search}
                    append={(<>
                        <Button variant="primary" type="button" onClick={onSearchClick}><Search /></Button>
                        <Dropdown
                            autoClose="outside"
                        >
                            <Dropdown.Toggle variant="secondary">
                                <Gear />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {
                                    columns.filter(v => !!v.name).map((v, i) => (
                                        <Dropdown.Item disabled={v.hidable === false} key={i} onClick={() => onColumnHide(i)}>
                                            {v.hide ? (<del>{t(v.name)}</del>) : ( v.hidable === false ? (<i>{t(v.name)}</i>) : t(v.name))}
                                        </Dropdown.Item>
                                    ))
                                }
                            </Dropdown.Menu>

                        </Dropdown>
                        {/* <DropdownButton
                            variant="secondary"
                            // title={<Gear />}
                            title={<Dropdown.Toggle>
                                <Gear />
                            </Dropdown.Toggle>}
                            onClick={onColumnClick}
                        >
                        </DropdownButton> */}
                    </>)}
                />
            </>}
            
            data={items}
        />

    );

}
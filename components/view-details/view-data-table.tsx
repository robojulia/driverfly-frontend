import React, { ReactNode, useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Dropdown } from "react-bootstrap";
import { Gear, Search } from "react-bootstrap-icons";
import DataTable, {
  TableColumn,
  TableStyles,
} from "react-data-table-component";
// import {
//     ExpandableRowsComponent,
// } from "react-data-table-component/dist/src/DataTable/types";
import { useStatefulStorage } from "../../hooks/use-stateful-storage";
import { useTranslation } from "../../hooks/use-translation";
import { UserEntity } from "../../models/user/user.entity";
import BaseInput from "../forms/base-input";
import ListActions, { ListActionOptions } from "../list-actions/list-actions";

export interface ViewTableProps<TElement> {
  columns: ViewTableColumn<TElement>[];
  items: TElement[];
  columnSettingKey?: string;
  actions?: (row: TElement) => ListActionOptions[];
  preExpanded?: boolean | ((row: TElement) => boolean);
  enableSelectableRows?: boolean | (() => boolean);
  selectableRowChangeHandler?: (e?: any) => void;
  expandableRowsComponent?: any;

  // expandableRowsComponent?: ExpandableRowsComponent<TElement>;
  hideSearch?: boolean;
  hideSetting?: boolean;
  subHeader?: ReactNode;
  noDataComponent?: ReactNode;
  customStyles?: TableStyles;
  description?: string;
}

export interface ViewTableColumn<TElement> extends TableColumn<TElement> {
  hidable?: boolean;
}

export function getDataTableColumnKey(
  type: "company" | "driver" | "admin",
  user: UserEntity,
  entity: string
) {
  return `${type}.${user?.id || 0}.${entity}.columns`;
}

export default function ViewDataTable<TElement>(
  props: ViewTableProps<TElement>
) {
  const { t } = useTranslation();

  // const storageApi = useStorage();
  const description = props?.description;
  const storage = useStatefulStorage<(string | number)[]>({
    type: "local",
    key: props.columnSettingKey || "default",
  });

  const hideable = new Set(
    props.columns
      .filter((v) => v.id != null && (!("hidable" in v) || v.hidable))
      .map((v) => v.id)
  );

  const [items, setItems] = useState([]);
  const [columns, setColumns] = useState<TableColumn<TElement>[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!search) setItems(props.items);

    const visible = new Set(
      (props.columnSettingKey ? storage?.item : null) ||
        props.columns.filter((v) => v.id && !v.hide).map((v) => v.id)
    );
    const columns: TableColumn<TElement>[] = props.columns.map((v) => ({
      ...v,
      hide: v.id ? (visible.has(v.id) ? 0 : 1) : v.hide,
    }));
    if (props.actions) {
      columns.push({
        maxWidth: "10px",
        cell: (j) => <ListActions options={props.actions(j)} />,
      });
    }
    setColumns(columns);
  }, [props, storage?.item, search]);

  // useEffect(() => {
  // }, [
  //     storage?.item
  // ]);

  const doSearch = (search: string) => {
    setItems(
      props.items.filter((v) =>
        columns.some(
          (c) =>
            !c.hide &&
            c.selector &&
            !!c.selector(v)?.toString()?.toLowerCase()?.includes(search)
        )
      )
    );
  };

  const onSearchClick = (e?: React.MouseEvent) => {
    doSearch(search);
  };

  // const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (e.key == "Enter") onSearchClick();

  // };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value.toLowerCase();

    setSearch(search);
    doSearch(search);
  };

  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  const onColumnHide = (column: TableColumn<TElement>) => {
    if (column.id && hideable.has(column.id)) {
      const newColumns = columns.map((v, i) => ({
        ...v,
        hide: v.id == column.id ? (v.hide ? 0 : 1) : v.hide,
      }));

      storage?.setItem(
        newColumns.filter((v) => v.id != null && !v.hide).map((v) => v.id)
      );

      setColumns(newColumns);
    }
  };

  const canHideColumns = hideable.size > 0;

  return (
    <>
      {description && <p className="small text-secondary">{t(description)}</p>}
      <DataTable<TElement>
        customStyles={props.customStyles}
        columns={columns
          .filter((v) => !v.hide)
          .map((v) => ({
            ...v,
            name: typeof v.name == "string" ? t(v.name) : v.name,
            // hide: v.id && hideable.has(`${v.id}`) && !visible.has(`${v.id}`) ? 1 : 0,
            sortable: v.sortable || !!v.name,
          }))}
        striped
        responsive
        fixedHeader
        noDataComponent={props.noDataComponent || <>{t("NO_RECORDS_FOUND")}</>}
        selectableRows={Boolean(props.enableSelectableRows)}
        onSelectedRowsChange={props.selectableRowChangeHandler}
        expandableRowExpanded={(row) =>
          !props.preExpanded
            ? false
            : typeof props.preExpanded == "boolean"
            ? props.preExpanded
            : props.preExpanded(row)
        }
        expandableRows={!!props.expandableRowsComponent}
        expandableRowsComponent={
          props.expandableRowsComponent
            ? (expandableProps) => (
                <Container fluid className="bg-light pl-5 pr-0">
                  {<props.expandableRowsComponent {...expandableProps} />}
                </Container>
              )
            : null
        }
        subHeader={!props.hideSearch || props.hideSetting}
        subHeaderComponent={
          <>
            {props.subHeader}
            {!props.hideSearch && (
              <>
                <ButtonGroup>
                  {!props.hideSetting && (
                    <>
                      <BaseInput
                        placeholder="SEARCH"
                        onChange={onSearchChange}
                        value={search}
                      />

                      <Button
                        variant="primary"
                        type="button"
                        onClick={onSearchClick}
                      >
                        <Search />
                      </Button>
                    </>
                  )}

                  {canHideColumns && (
                    <Dropdown autoClose="outside">
                      <Dropdown.Toggle
                        variant=""
                        className="btn-group-end theme-general-btn"
                      >
                        <Gear />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="select_dropdown data_table_dropdown">
                        {columns
                          .filter((v) => !!v.id)
                          .map((v, i) => (
                            <Dropdown.Item
                              disabled={!hideable.has(v.id)}
                              key={i}
                              onClick={() => onColumnHide(v)}
                            >
                              {v.hide == 1 ? (
                                <del>
                                  {typeof v.name == "string"
                                    ? t(v.name)
                                    : v.name}
                                </del>
                              ) : !hideable.has(v.id) ? (
                                <>{t(v.name as any)}</>
                              ) : (
                                t(v.name as any)
                              )}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </ButtonGroup>
              </>
            )}
          </>
        }
        data={items}
      />
    </>
  );
}

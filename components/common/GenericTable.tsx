import React, { ReactNode, useEffect, useState, useMemo } from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { Gear, Search } from 'react-bootstrap-icons';
import { useStatefulStorage } from '../../hooks/use-stateful-storage';
import { useTranslation } from '../../hooks/use-translation';
import BaseInput from '../forms/base-input';
import ListActions, { ListActionOptions } from '../list-actions/list-actions';
import styles from '../../styles/generic-table.module.css';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  hidable?: boolean;
  hide?: boolean;
  selector?: (item: T) => any;
}

export interface TableFilter {
  key: string;
  label: string;
  type: 'select' | 'checkbox' | 'text';
  options?: { value: any; label: string }[];
  value: any;
  onChange: (value: any) => void;
}

export interface GenericTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  refreshing?: boolean;
  emptyTitle?: string;
  emptyText?: string;
  filters?: TableFilter[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadMoreText?: string;
  className?: string;
  // New features from ViewDataTable
  actions?: (row: T) => ListActionOptions[];
  enableSearch?: boolean;
  enableColumnHiding?: boolean;
  columnSettingKey?: string;
  enableSelectableRows?: boolean;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
  expandableRowsComponent?: React.ComponentType<{ data: T }>;
  preExpanded?: boolean | ((row: T) => boolean);
  description?: string;
  subHeader?: ReactNode;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onSearch?: (searchTerm: string) => void;
}

export function GenericTable<T = any>({
  data,
  columns,
  loading = false,
  refreshing = false,
  emptyTitle = 'No Data Found',
  emptyText = 'No items match the current criteria.',
  filters = [],
  onLoadMore,
  hasMore = false,
  loadMoreText = 'Load More',
  className = '',
  actions,
  enableSearch = false,
  enableColumnHiding = false,
  columnSettingKey,
  enableSelectableRows = false,
  onSelectedRowsChange,
  expandableRowsComponent,
  preExpanded = false,
  description,
  subHeader,
  sortBy,
  sortDirection = 'asc',
  onSort,
  onSearch,
}: GenericTableProps<T>) {
  const { t } = useTranslation();

  const storage = useStatefulStorage<string[]>({
    type: 'local',
    key: columnSettingKey || 'default',
  });

  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Column visibility management
  const hideable = useMemo(
    () => new Set(columns.filter((col) => col.hidable !== false).map((col) => col.key)),
    [columns]
  );

  const visibleColumns = useMemo(() => {
    const storedVisible = columnSettingKey ? storage?.item : null;

    // Get default visible columns (those not marked as hide: true)
    const defaultVisible = columns.filter((col) => !col.hide).map((col) => col.key);

    // Use stored visibility if available, otherwise use defaults
    const visible = new Set(storedVisible || defaultVisible);

    let processedColumns = columns.map((col) => ({
      ...col,
      // Column is hidden if:
      // 1. It's not in the visible set AND it's hidable, OR
      // 2. It's explicitly marked as hide: true in the column definition (unless overridden by stored preferences)
      hide: storedVisible
        ? !visible.has(col.key) && hideable.has(col.key)
        : col.hide || (!visible.has(col.key) && hideable.has(col.key)),
    }));

    // Add actions column if actions prop is provided
    if (actions) {
      processedColumns.push({
        key: '__actions__',
        label: '',
        width: '10px',
        hidable: false,
        hide: false,
        render: (item: T) => <ListActions options={actions(item)} />,
      });
    }

    return processedColumns;
  }, [columns, storage?.item, actions, hideable, columnSettingKey]);

  // Search functionality
  useEffect(() => {
    // If onSearch callback is provided, use API-level search
    if (onSearch) {
      // Debounce the search to avoid too many API calls
      const debounceTimer = setTimeout(() => {
        onSearch(search);
      }, 300);

      return () => clearTimeout(debounceTimer);
    }

    // Otherwise, use client-side search
    if (!enableSearch || !search) {
      setFilteredData(data);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = data.filter((item) =>
      visibleColumns.some((col) => {
        if (col.hide || col.key === '__actions__') return false;

        let value;
        if (col.selector) {
          value = col.selector(item);
        } else if (col.render) {
          // For rendered columns, we can't easily search, skip them
          return false;
        } else {
          value = (item as any)[col.key];
        }

        return value?.toString()?.toLowerCase()?.includes(searchLower);
      })
    );

    setFilteredData(filtered);
  }, [data, search, visibleColumns, enableSearch, onSearch]);

  // When using API search, always show all data (filtering is done server-side)
  useEffect(() => {
    if (onSearch) {
      setFilteredData(data);
    }
  }, [data, onSearch]);

  // Handle column visibility toggle
  const onColumnToggle = (columnKey: string) => {
    if (!hideable.has(columnKey)) return;

    // Get currently visible columns (excluding actions)
    const currentVisible = visibleColumns
      .filter((col) => !col.hide && col.key !== '__actions__')
      .map((col) => col.key);

    // Toggle the column visibility
    const newVisible = currentVisible.includes(columnKey)
      ? currentVisible.filter((key) => key !== columnKey)
      : [...currentVisible, columnKey];

    // Save to localStorage
    if (columnSettingKey) {
      storage?.setItem(newVisible);
    }
  };

  // Handle row selection
  const handleRowSelect = (item: T, selected: boolean) => {
    const newSelected = selected
      ? [...selectedRows, item]
      : selectedRows.filter((row) => row !== item);

    setSelectedRows(newSelected);
    onSelectedRowsChange?.(newSelected);
  };

  // Handle row expansion
  const handleRowExpand = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!onSort) return;

    const newDirection = sortBy === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnKey, newDirection);
  };

  const isRowExpanded = (index: number) => {
    if (typeof preExpanded === 'boolean') return preExpanded;
    if (typeof preExpanded === 'function') return preExpanded(filteredData[index]);
    return expandedRows.has(index);
  };
  console.log('GenericTable - data:', data, 'loading:', loading, 'data.length:', data.length);

  if (loading && filteredData.length === 0) {
    return (
      <div className={`${styles.tableContainer} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const canHideColumns = enableColumnHiding && hideable.size > 0;
  const showSubHeader = enableSearch || canHideColumns || subHeader;

  return (
    <div
      className={`${styles.tableContainer} ${className} ${styles.fadeIn} ${
        refreshing ? styles.refreshing : ''
      }`}
    >
      {refreshing && <div className={styles.refreshingIndicator}></div>}
      {/* Description */}
      {description && <p className="small text-secondary">{t(description)}</p>}

      {/* Sub Header */}
      {showSubHeader && (
        <div className={styles.subHeader}>
          {subHeader}
          {(enableSearch || canHideColumns) && (
            <div className={styles.tableControls}>
              {enableSearch && (
                <div className={styles.searchGroup}>
                  <BaseInput
                    placeholder="SEARCH"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    className={styles.searchInput}
                  />
                  <Button variant="primary" type="button" className={styles.searchButton}>
                    <Search />
                  </Button>
                </div>
              )}

              {canHideColumns && (
                <Dropdown autoClose="outside">
                  <Dropdown.Toggle variant="" className="btn-group-end theme-general-btn">
                    <Gear />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="select_dropdown data_table_dropdown">
                    {visibleColumns
                      .filter((col) => col.key !== '__actions__')
                      .map((col) => (
                        <Dropdown.Item
                          key={col.key}
                          disabled={!hideable.has(col.key)}
                          onClick={() => onColumnToggle(col.key)}
                        >
                          <span className="d-flex align-items-center">
                            {!col.hide && (
                              <span className="me-2">✓</span>
                            )}
                            {t(col.label)}
                          </span>
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      {filters.length > 0 && (
        <div className={styles.filtersContainer}>
          <div className={styles.filterRow}>
            {filters.map((filter) => (
              <div key={filter.key} className={styles.filterGroup}>
                <label className={styles.filterLabel}>{filter.label}</label>
                {filter.type === 'select' && (
                  <select
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className={styles.filterSelect}
                  >
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {filter.type === 'checkbox' && (
                  <div className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      id={filter.key}
                      checked={filter.value || false}
                      onChange={(e) => filter.onChange(e.target.checked)}
                    />
                    <label htmlFor={filter.key}>{filter.label}</label>
                  </div>
                )}
                {filter.type === 'text' && (
                  <input
                    type="text"
                    value={filter.value || ''}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className={styles.filterInput}
                    placeholder={filter.label}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {enableSelectableRows && (
                <th style={{ width: '40px' }}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows([...filteredData]);
                        onSelectedRowsChange?.([...filteredData]);
                      } else {
                        setSelectedRows([]);
                        onSelectedRowsChange?.([]);
                      }
                    }}
                    checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  />
                </th>
              )}
              {expandableRowsComponent && <th style={{ width: '40px' }}></th>}
              {visibleColumns
                .filter((col) => !col.hide)
                .map((column) => (
                  <th
                    key={column.key}
                    style={column.width ? { width: column.width } : undefined}
                    className={column.sortable || onSort ? styles.sortableHeader : ''}
                    onClick={() => column.sortable && onSort && handleSort(column.key)}
                  >
                    {t(column.label)}
                    {sortBy === column.key && (
                      <span className={styles.sortIcon}>
                        {sortDirection === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  {enableSelectableRows && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(item)}
                        onChange={(e) => handleRowSelect(item, e.target.checked)}
                      />
                    </td>
                  )}
                  {expandableRowsComponent && (
                    <td>
                      <button
                        className={styles.expandButton}
                        onClick={() => handleRowExpand(index)}
                      >
                        {isRowExpanded(index) ? '▼' : '▶'}
                      </button>
                    </td>
                  )}
                  {visibleColumns
                    .filter((col) => !col.hide)
                    .map((column) => (
                      <td key={column.key}>
                        {column.render ? column.render(item) : (item as any)[column.key]}
                      </td>
                    ))}
                </tr>
                {expandableRowsComponent && isRowExpanded(index) && (
                  <tr>
                    <td
                      colSpan={
                        visibleColumns.filter((col) => !col.hide).length +
                        (enableSelectableRows ? 1 : 0) +
                        1
                      }
                    >
                      <div className={styles.expandedContent}>
                        {React.createElement(expandableRowsComponent, { data: item })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className={`${styles.textCenter} ${styles.mt3}`}>
          <button
            className={`${styles.button} ${styles.buttonOutlinePrimary}`}
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : loadMoreText}
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>{emptyTitle}</div>
          <p className={styles.emptyStateText}>{emptyText}</p>
        </div>
      )}
    </div>
  );
}

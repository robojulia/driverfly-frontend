import React, { ReactNode } from 'react';
import styles from '../../styles/generic-table.module.css';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  width?: string;
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
  emptyTitle?: string;
  emptyText?: string;
  filters?: TableFilter[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadMoreText?: string;
  className?: string;
}

export function GenericTable<T = any>({
  data,
  columns,
  loading = false,
  emptyTitle = 'No Data Found',
  emptyText = 'No items match the current criteria.',
  filters = [],
  onLoadMore,
  hasMore = false,
  loadMoreText = 'Load More',
  className = '',
}: GenericTableProps<T>) {
  console.log('GenericTable - data:', data, 'loading:', loading, 'data.length:', data.length);

  if (loading && data.length === 0) {
    return (
      <div className={`${styles.tableContainer} ${className}`}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${className} ${styles.fadeIn}`}>
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
              {columns.map((column) => (
                <th key={column.key} style={column.width ? { width: column.width } : undefined}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.render ? column.render(item) : (item as any)[column.key]}
                  </td>
                ))}
              </tr>
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
      {data.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>{emptyTitle}</div>
          <p className={styles.emptyStateText}>{emptyText}</p>
        </div>
      )}
    </div>
  );
}

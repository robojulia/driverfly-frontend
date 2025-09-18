import { TableColumn } from '../components/common/GenericTable';
import { ViewTableColumn } from '../components/view-details/view-data-table';

/**
 * Convert ViewDataTable columns to GenericTable columns
 */
export function convertViewTableColumns<T>(viewColumns: ViewTableColumn<T>[]): TableColumn<T>[] {
  return viewColumns.map((col) => ({
    key: col.id as string,
    label: col.name as string,
    render: col.cell ? (item: T) => col.cell!(item, 0, col as any, col.id!) : undefined,
    sortable: col.sortable,
    width: col.width,
    hidable: col.hidable,
    hide: Boolean(col.hide),
    selector: col.selector ? (item: T) => col.selector!(item) : undefined,
  }));
}

/**
 * Helper function to get column key for storage
 */
export function getDataTableColumnKey(
  type: 'company' | 'driver' | 'admin',
  user: any,
  entity: string
): string {
  return `${type}.${user?.id || 0}.${entity}.columns`;
}

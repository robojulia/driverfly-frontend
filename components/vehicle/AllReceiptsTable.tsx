import { useState } from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import { ArrowUp, ArrowDown, Receipt } from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/use-translation';
import {
  VehicleRepairRecordEntity,
  RepairType,
} from '../../models/company/vehicle-repair-record.entity';
import { VehicleEntity } from '../../models/company/vehicle.entity';
import styles from '../../styles/repairs.module.css';
import classNames from 'classnames';

export interface RepairWithVehicle extends VehicleRepairRecordEntity {
  vehicle?: VehicleEntity;
}

interface AllReceiptsTableProps {
  receipts: RepairWithVehicle[];
  loading?: boolean;
}

export const AllReceiptsTable: React.FC<AllReceiptsTableProps> = ({
  receipts,
  loading = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>('repair_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getRepairTypeChipClass = (type: RepairType) => {
    return classNames(styles.repairChip, {
      [styles.scheduled]: type === RepairType.SCHEDULED,
      [styles.emergency]: type === RepairType.EMERGENCY,
      [styles.warranty]: type === RepairType.WARRANTY,
      [styles.recall]: type === RepairType.RECALL,
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const getSortedReceipts = () => {
    if (!sortField) return receipts;

    return [...receipts].sort((a, b) => {
      if (sortField === 'repair_date') {
        const dateA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
        const dateB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'repair_type') {
        return sortDirection === 'asc'
          ? a.repair_type.localeCompare(b.repair_type)
          : b.repair_type.localeCompare(a.repair_type);
      }
      if (sortField === 'vehicle') {
        const vehicleA = a.vehicle ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : '';
        const vehicleB = b.vehicle ? `${b.vehicle.year} ${b.vehicle.make} ${b.vehicle.model}` : '';
        return sortDirection === 'asc'
          ? vehicleA.localeCompare(vehicleB)
          : vehicleB.localeCompare(vehicleA);
      }
      return 0;
    });
  };

  const getPaginatedReceipts = () => {
    const sortedReceipts = getSortedReceipts();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReceipts.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(receipts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (receipt: RepairWithVehicle) => {
    if (receipt.vehicle) {
      router.push(`/dashboard/company/settings/vehicles/${receipt.vehicle.id}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('Loading...')}</span>
        </Spinner>
        <p className="mt-3 text-muted">{t('Loading receipts...')}</p>
      </div>
    );
  }

  return (
    <>
      {receipts.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <Receipt size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">{t('No Receipts Found')}</h5>
          <p className="text-muted mb-3">
            {t('No repair receipts have been uploaded yet.')}
          </p>
        </div>
      ) : (
        <>
          <Table striped bordered hover className={`custom-table ${styles.repairsTable}`}>
            <thead>
              <tr>
                <th onClick={() => handleSort('vehicle')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Vehicle')}
                    {getSortIcon('vehicle')}
                  </div>
                </th>
                <th onClick={() => handleSort('repair_date')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Date')}
                    {getSortIcon('repair_date')}
                  </div>
                </th>
                <th onClick={() => handleSort('repair_type')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Type')}
                    {getSortIcon('repair_type')}
                  </div>
                </th>
                <th onClick={() => handleSort('amount')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Amount')}
                    {getSortIcon('amount')}
                  </div>
                </th>
                <th>{t('Description')}</th>
                <th>{t('Document')}</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedReceipts().map((receipt) => (
                <tr
                  key={`${receipt.vehicle?.id}-${receipt.id}`}
                  className={styles.clickableRow}
                  onClick={() => handleRowClick(receipt)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    {receipt.vehicle ? (
                      <div>
                        <div className="fw-bold">
                          {receipt.vehicle.unit_number
                            ? `Unit #${receipt.vehicle.unit_number}`
                            : t('No Unit')}
                        </div>
                        <div className="text-muted small">
                          {receipt.vehicle.year} {receipt.vehicle.make} {receipt.vehicle.model}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">{t('Unknown Vehicle')}</span>
                    )}
                  </td>
                  <td>{formatDate(receipt.repair_date)}</td>
                  <td>
                    <span className={getRepairTypeChipClass(receipt.repair_type)}>
                      {t(`RepairType.${receipt.repair_type}`)}
                    </span>
                  </td>
                  <td className="fw-bold">{formatAmount(receipt.amount)}</td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '250px' }} title={receipt.description || ''}>
                      {receipt.description || <span className="text-muted">{t('No description')}</span>}
                    </div>
                  </td>
                  <td>
                    {receipt.repair_receipt_document ? (
                      <a
                        href={receipt.repair_receipt_document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {receipt.repair_receipt_document.name || 'repair_receipt.pdf'}
                      </a>
                    ) : (
                      <span className="text-muted">{t('No document')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const pageNumber = i + 1 + Math.max(0, currentPage - 5);
                  if (pageNumber > totalPages) return null;
                  return (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                })}
                <Pagination.Next
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </>
  );
};

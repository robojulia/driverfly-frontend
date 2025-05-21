import { useState } from 'react';
import { Button, Table, Pagination } from 'react-bootstrap';
import { Plus, PenFill, TrashFill, ArrowUp, ArrowDown, Receipt } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleRepairRecordEntity,
  RepairType,
} from '../../../models/company/vehicle-repair-record.entity';
import styles from '../../../styles/repairs.module.css';
import classNames from 'classnames';

interface RepairRecordsTableProps {
  repairs: VehicleRepairRecordEntity[];
  onCreateRepair: () => void;
  onEditRepair: (id: number) => void;
  onDeleteRepair: (repair: VehicleRepairRecordEntity) => void;
}

export const RepairRecordsTable: React.FC<RepairRecordsTableProps> = ({
  repairs,
  onCreateRepair,
  onEditRepair,
  onDeleteRepair,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
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

  const getSortedRepairs = () => {
    if (!sortField) return repairs;

    return [...repairs].sort((a, b) => {
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
      return 0;
    });
  };

  const getPaginatedRepairs = () => {
    const sortedRepairs = getSortedRepairs();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedRepairs.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(repairs.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={onCreateRepair}>
          <Plus /> {t('Add Receipt')}
        </Button>
      </div>
      {repairs.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <Receipt size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">{t('No Repair Records Found')}</h5>
          <p className="text-muted mb-3">{t('No repair records have been added yet.')}</p>
          <Button variant="primary" onClick={onCreateRepair}>
            <Plus /> {t('Add Repair Record')}
          </Button>
        </div>
      ) : (
        <>
          <Table striped bordered hover className={`custom-table ${styles.repairsTable}`}>
            <thead>
              <tr>
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
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedRepairs().map((repair) => (
                <tr key={repair.id}>
                  <td>{formatDate(repair.repair_date)}</td>
                  <td>
                    <span className={getRepairTypeChipClass(repair.repair_type)}>
                      {t(`RepairType.${repair.repair_type}`)}
                    </span>
                  </td>
                  <td>{formatAmount(repair.amount)}</td>
                  <td>{repair.description}</td>
                  <td>
                    {repair.repair_receipt_document ? (
                      <a
                        href={repair.repair_receipt_document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none"
                      >
                        {repair.repair_receipt_document.name || 'repair_receipt.pdf'}
                      </a>
                    ) : (
                      <span className="text-muted">{t('No document')}</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onEditRepair(repair.id)}>
                        <div className="d-flex align-items-center gap-1">
                          <PenFill /> {t('EDIT')}
                        </div>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDeleteRepair(repair)}>
                        <div className="d-flex align-items-center gap-1">
                          <TrashFill /> {t('DELETE')}
                        </div>
                      </Button>
                    </div>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                ))}
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

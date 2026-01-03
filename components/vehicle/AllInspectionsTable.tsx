import { useState } from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import {
  ArrowUp,
  ArrowDown,
  ExclamationTriangleFill,
  ClipboardX,
} from 'react-bootstrap-icons';
import { useRouter } from 'next/router';
import { useTranslation } from '../../hooks/use-translation';
import {
  VehicleInspectionEntity,
} from '../../models/company/vehicle-inspection.entity';
import { VehicleEntity } from '../../models/company/vehicle.entity';
import styles from '../../styles/inspections.module.css';
import classNames from 'classnames';

export interface InspectionWithVehicle extends VehicleInspectionEntity {
  vehicle?: VehicleEntity;
}

interface AllInspectionsTableProps {
  inspections: InspectionWithVehicle[];
  loading?: boolean;
}

export const AllInspectionsTable: React.FC<AllInspectionsTableProps> = ({
  inspections,
  loading = false,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sortField, setSortField] = useState<string | null>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getInspectionTypeChipClass = (type: string) => {
    return classNames(styles.inspectionChip, styles.typeChip, {
      [styles.safety]: type === 'Safety',
      [styles.maintenance]: type === 'Maintenance',
      [styles.roadside]: type === 'Roadside',
    });
  };

  const getInspectionStatusChipClass = (status: string) => {
    return classNames(styles.inspectionChip, styles.statusChip, {
      [styles.passed]: status === 'Passed',
      [styles.failed]: status === 'Failed',
      [styles.pending]: status === 'Pending',
      [styles.scheduled]: status === 'Scheduled',
    });
  };

  const getRowClass = (inspection: InspectionWithVehicle) => {
    if (!inspection.due_date) return '';

    if (['Passed', 'Failed'].includes(inspection.status)) return '';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(inspection.due_date);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return styles.dangerRow;
    } else if (diffDays <= 30) {
      return styles.warningRow;
    }
    return '';
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const isDueDatePassed = (dueDate: Date | undefined) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
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

  const getSortedInspections = () => {
    if (!sortField) return inspections;

    return [...inspections].sort((a, b) => {
      if (sortField === 'due_date' || sortField === 'inspection_date') {
        const dateA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
        const dateB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'status' || sortField === 'inspection_type') {
        const valueA = sortField === 'inspection_type' ? a.inspection_type : a.status;
        const valueB = sortField === 'inspection_type' ? b.inspection_type : b.status;
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
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

  const getPaginatedInspections = () => {
    const sortedInspections = getSortedInspections();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedInspections.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(inspections.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (inspection: InspectionWithVehicle) => {
    if (inspection.vehicle) {
      router.push(`/dashboard/company/settings/vehicles/${inspection.vehicle.id}`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('Loading...')}</span>
        </Spinner>
        <p className="mt-3 text-muted">{t('Loading inspections...')}</p>
      </div>
    );
  }

  return (
    <>
      {inspections.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <ClipboardX size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">{t('No Inspections Found')}</h5>
          <p className="text-muted mb-3">
            {t('No inspection records found for the past inspections and those due in the next 30 days.')}
          </p>
        </div>
      ) : (
        <>
          <Table striped bordered hover className={`custom-table ${styles.inspectionsTable}`}>
            <thead>
              <tr>
                <th onClick={() => handleSort('vehicle')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Vehicle')}
                    {getSortIcon('vehicle')}
                  </div>
                </th>
                <th onClick={() => handleSort('inspection_type')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Type')}
                    {getSortIcon('inspection_type')}
                  </div>
                </th>
                <th onClick={() => handleSort('due_date')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Due Date')}
                    {getSortIcon('due_date')}
                  </div>
                </th>
                <th onClick={() => handleSort('status')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Status')}
                    {getSortIcon('status')}
                  </div>
                </th>
                <th onClick={() => handleSort('inspection_date')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Inspection Date')}
                    {getSortIcon('inspection_date')}
                  </div>
                </th>
                <th>{t('Document')}</th>
                <th>{t('Notes')}</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedInspections().map((inspection) => (
                <tr
                  key={`${inspection.vehicle?.id}-${inspection.id}`}
                  className={`${getRowClass(inspection)} ${styles.clickableRow}`}
                  onClick={() => handleRowClick(inspection)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    {inspection.vehicle ? (
                      <div>
                        <div className="fw-bold">
                          {inspection.vehicle.unit_number
                            ? `Unit #${inspection.vehicle.unit_number}`
                            : t('No Unit')}
                        </div>
                        <div className="text-muted small">
                          {inspection.vehicle.year} {inspection.vehicle.make} {inspection.vehicle.model}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted">{t('Unknown Vehicle')}</span>
                    )}
                  </td>
                  <td>
                    <span className={getInspectionTypeChipClass(inspection.inspection_type)}>
                      {t(`InspectionType.${inspection.inspection_type}`)}
                    </span>
                  </td>
                  <td>
                    {isDueDatePassed(inspection.due_date) ? (
                      <div className={styles.dueDateDanger}>
                        {formatDate(inspection.due_date)}
                        <ExclamationTriangleFill />
                      </div>
                    ) : (
                      formatDate(inspection.due_date)
                    )}
                  </td>
                  <td>
                    <span className={getInspectionStatusChipClass(inspection.status)}>
                      {t(`InspectionStatus.${inspection.status}`)}
                    </span>
                  </td>
                  <td>{formatDate(inspection.inspection_date)}</td>
                  <td>
                    {inspection.inspection_document ? (
                      <a
                        href={inspection.inspection_document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {inspection.inspection_document.name || 'inspection_document.pdf'}
                      </a>
                    ) : (
                      <span className="text-muted">{t('No document')}</span>
                    )}
                  </td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '200px' }} title={inspection.notes || ''}>
                      {inspection.notes || <span className="text-muted">{t('No notes')}</span>}
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

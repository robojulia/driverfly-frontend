import { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import {
  Plus,
  PenFill,
  CheckCircleFill,
  TrashFill,
  ArrowUp,
  ArrowDown,
  ExclamationTriangleFill,
} from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleInspectionEntity,
  InspectionStatus,
} from '../../../models/company/vehicle-inspection.entity';
import styles from '../../../styles/inspections.module.css';
import classNames from 'classnames';

interface InspectionsTableProps {
  inspections: VehicleInspectionEntity[];
  onCreateInspection: () => void;
  onEditInspection: (id: number) => void;
  onDeleteInspection: (inspection: VehicleInspectionEntity) => void;
  onCompleteInspection: (inspection: VehicleInspectionEntity) => void;
}

export const InspectionsTable: React.FC<InspectionsTableProps> = ({
  inspections,
  onCreateInspection,
  onEditInspection,
  onDeleteInspection,
  onCompleteInspection,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const getRowClass = (inspection: VehicleInspectionEntity) => {
    if (!inspection.due_date) return '';

    if (inspection.status === 'Passed') return '';

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
      return 0;
    });
  };

  const canCompleteInspection = (status: string) => {
    return status === InspectionStatus.PENDING || status === InspectionStatus.SCHEDULED;
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={onCreateInspection}>
          <Plus /> {t('Add Inspection')}
        </Button>
      </div>
      <Table striped bordered hover className={`custom-table ${styles.inspectionsTable}`}>
        <thead>
          <tr>
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
            <th>{t('Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {getSortedInspections().map((inspection) => (
            <tr key={inspection.id} className={getRowClass(inspection)}>
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
                  >
                    {inspection.inspection_document.name || 'inspection_document.pdf'}
                  </a>
                ) : (
                  <span className="text-muted">{t('No document')}</span>
                )}
              </td>
              <td>{inspection.notes}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditInspection(inspection.id)}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <PenFill /> {t('EDIT')}
                    </div>
                  </Button>
                  {canCompleteInspection(inspection.status) && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => onCompleteInspection(inspection)}
                    >
                      <div className="d-flex align-items-center gap-1">
                        <CheckCircleFill /> {t('Complete')}
                      </div>
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => onDeleteInspection(inspection)}>
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
    </>
  );
};

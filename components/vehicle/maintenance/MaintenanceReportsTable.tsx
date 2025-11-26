import { useState } from 'react';
import { Button, Table, Pagination } from 'react-bootstrap';
import { Plus, PenFill, TrashFill, ArrowUp, ArrowDown, Tools } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import {
  VehicleMaintenanceReportEntity,
  MaintenanceType,
} from '../../../models/company/vehicle-maintenance-report.entity';
import styles from '../../../styles/repairs.module.css';
import classNames from 'classnames';

interface MaintenanceReportsTableProps {
  maintenanceReports: VehicleMaintenanceReportEntity[];
  onCreateReport: () => void;
  onEditReport: (id: number) => void;
  onDeleteReport: (report: VehicleMaintenanceReportEntity) => void;
}

export const MaintenanceReportsTable: React.FC<MaintenanceReportsTableProps> = ({
  maintenanceReports,
  onCreateReport,
  onEditReport,
  onDeleteReport,
}) => {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const getMaintenanceTypeChipClass = (type: MaintenanceType) => {
    return classNames(styles.repairChip, {
      [styles.scheduled]: type === MaintenanceType.OIL_CHANGE || type === MaintenanceType.INSPECTION,
      [styles.emergency]: type === MaintenanceType.BRAKE_SERVICE || type === MaintenanceType.ENGINE_TUNE_UP,
      [styles.warranty]: type === MaintenanceType.TRANSMISSION_SERVICE || type === MaintenanceType.COOLANT_FLUSH,
      [styles.recall]: type === MaintenanceType.BATTERY_REPLACEMENT,
    });
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
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

  const getSortedReports = () => {
    if (!sortField) return maintenanceReports;

    return [...maintenanceReports].sort((a, b) => {
      if (sortField === 'maintenance_date') {
        const dateA = a[sortField] ? new Date(a[sortField]).getTime() : 0;
        const dateB = b[sortField] ? new Date(b[sortField]).getTime() : 0;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }
      if (sortField === 'odometer_reading') {
        const odometerA = a.odometer_reading || 0;
        const odometerB = b.odometer_reading || 0;
        return sortDirection === 'asc' ? odometerA - odometerB : odometerB - odometerA;
      }
      if (sortField === 'maintenance_type') {
        return sortDirection === 'asc'
          ? a.maintenance_type.localeCompare(b.maintenance_type)
          : b.maintenance_type.localeCompare(a.maintenance_type);
      }
      return 0;
    });
  };

  const getPaginatedReports = () => {
    const sortedReports = getSortedReports();
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedReports.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(maintenanceReports.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button onClick={onCreateReport}>
          <Plus /> {t('Upload Maintenance Report')}
        </Button>
      </div>
      {maintenanceReports.length === 0 ? (
        <div className="text-center py-5 bg-light rounded">
          <Tools size={48} className="text-muted mb-3" />
          <h5 className="text-muted mb-2">{t('No Maintenance Reports Found')}</h5>
          <p className="text-muted mb-3">{t('No maintenance reports have been uploaded yet.')}</p>
          <Button variant="primary" onClick={onCreateReport}>
            <Plus /> {t('Upload Maintenance Report')}
          </Button>
        </div>
      ) : (
        <>
          <Table striped bordered hover className={`custom-table ${styles.repairsTable}`}>
            <thead>
              <tr>
                <th onClick={() => handleSort('maintenance_date')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Date')}
                    {getSortIcon('maintenance_date')}
                  </div>
                </th>
                <th onClick={() => handleSort('maintenance_type')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Type')}
                    {getSortIcon('maintenance_type')}
                  </div>
                </th>
                <th onClick={() => handleSort('odometer_reading')} className={styles.sortableHeader}>
                  <div className="d-flex align-items-center gap-2">
                    {t('Odometer')}
                    {getSortIcon('odometer_reading')}
                  </div>
                </th>
                <th>{t('Description')}</th>
                <th>{t('Next Service')}</th>
                <th>{t('Document')}</th>
                <th>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedReports().map((report) => (
                <tr key={report.id}>
                  <td>{formatDate(report.maintenance_date)}</td>
                  <td>
                    <span className={getMaintenanceTypeChipClass(report.maintenance_type)}>
                      {t(`MaintenanceType.${report.maintenance_type}`)}
                    </span>
                  </td>
                  <td>
                    {report.odometer_reading ? (
                      `${report.odometer_reading.toLocaleString()} miles`
                    ) : (
                      <span className="text-muted">{t('Not recorded')}</span>
                    )}
                  </td>
                  <td>{report.description}</td>
                  <td>
                    {report.next_service_date || report.next_service_odometer ? (
                      <div>
                        {report.next_service_date && (
                          <div>{formatDate(report.next_service_date)}</div>
                        )}
                        {report.next_service_odometer && (
                          <div className="text-muted small">
                            @ {report.next_service_odometer.toLocaleString()} miles
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">{t('Not scheduled')}</span>
                    )}
                  </td>
                  <td>
                    {report.maintenance_document ? (
                      <a
                        href={report.maintenance_document.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-decoration-none"
                      >
                        {report.maintenance_document.name || 'maintenance_report.pdf'}
                      </a>
                    ) : (
                      <span className="text-muted">{t('No document')}</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => onEditReport(report.id!)}>
                        <div className="d-flex align-items-center gap-1">
                          <PenFill /> {t('EDIT')}
                        </div>
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDeleteReport(report)}>
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

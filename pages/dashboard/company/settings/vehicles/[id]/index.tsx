import { toast } from 'react-toastify';
import { Button, ButtonGroup, Row, Col, Table } from 'react-bootstrap';
import {
  Pencil,
  Plus,
  PenFill,
  TrashFill,
  ExclamationTriangleFill,
  ArrowUp,
  ArrowDown,
} from 'react-bootstrap-icons';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { DeleteButton } from '../../../../../../components/buttons/delete-button';
import ConfirmationModal from '../../../../../../components/modals/confirmation-modal';
import {
  BaseViewCard,
  ViewHeader,
  ViewSection,
  InfoGrid,
  InfoItem,
  ChipList,
} from '../../../../../../components/view/base-view-card';
import VehicleRegistration from '../../../../../../components/vehicle/vehicle-registration';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useEffectAsync } from '../../../../../../utils/react';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { useAuth } from '../../../../../../hooks/use-auth';

import VehicleApi from '../../../../../api/vehicle';
import VehicleInspectionApi from '../../../../../api/vehicle-inspection';
import EmployeeApi from '../../../../../api/employee';
import { VehicleEntity } from '../../../../../../models/company/vehicle.entity';
import { VehicleInspectionEntity } from '../../../../../../models/company/vehicle-inspection.entity';
import { EmployeeEntity } from '../../../../../../models/employee/employee.entity';
import { VehicleTrailerType } from '../../../../../../enums/vehicles/vehicle-trailer-type.enum';
import { VehicleType } from '../../../../../../enums/vehicles/vehicle-type.enum';
import { VehicleAccessory } from '../../../../../../enums/vehicles/vehicle-accessory.enum';
import { EmployeeStatus } from '../../../../../../enums/applicants/employee-status.enum';
import styles from '../../../../../../styles/inspections.module.css';
import classNames from 'classnames';

export default function ViewVehicle({ id }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [vehicle, setVehicle] = useState(new VehicleEntity());
  const [inspections, setInspections] = useState<VehicleInspectionEntity[]>([]);
  const [assignedEmployee, setAssignedEmployee] = useState<EmployeeEntity | null>(null);
  const [inspectionToDelete, setInspectionToDelete] = useState<VehicleInspectionEntity | null>(
    null
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const backPath = '/dashboard/company/settings/vehicles';

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  // Fetch inspections
  useEffectAsync(async () => {
    if (id) {
      try {
        const api = new VehicleInspectionApi();
        const data = await api.list(+id);
        setInspections(data);
      } catch (error) {
        console.error('Error fetching inspections:', error);
        toast.error(t('Error loading inspections'));
      }
    }
  }, [id]);

  // Fetch employee details if vehicle has current_employee_id
  useEffect(() => {
    const fetchEmployee = async () => {
      if (vehicle?.current_employee_id) {
        try {
          const employeeApi = new EmployeeApi();
          const response = await employeeApi.list({
            status: [EmployeeStatus.ACTIVE],
            is_paginated: true,
            limit: 1000,
            page: 1,
          });
          const employee = (response as any)?.items?.find(
            (emp: EmployeeEntity) => emp.id === vehicle.current_employee_id
          );
          if (employee) {
            setAssignedEmployee(employee);
          }
        } catch (error) {
          console.error('Error fetching employee:', error);
        }
      } else {
        setAssignedEmployee(null);
      }
    };
    fetchEmployee();
  }, [vehicle?.current_employee_id]);

  useEffectAsync(async () => {
    if (!user) return;

    if (id) {
      const api = new VehicleApi();
      const data = await api.findById(+id, { withDocuments: true });

      if (!data) {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'VEHICLE' }, { translateProps: true }));
        goBack();
        return;
      }

      setVehicle(data);
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'VEHICLE' }, { translateProps: true }));
      goBack();
    }
  }, [user, id]);

  const onEditClick = async () => {
    await router.push(router.asPath + `/edit`);
  };

  const onDeleteClick = async () => {
    const api = new VehicleApi();
    await api.remove(user.id);
    await router.push(backPath);
  };

  const canEdit = hasPermission('CanUpdateVehicle');
  const canDelete = hasPermission('CanDeleteVehicle');

  const getVehicleType = () => {
    return vehicle.type == VehicleType.OTHER
      ? vehicle.type_other
      : t(`VehicleType.${vehicle.type}`);
  };

  const getTrailerType = () => {
    return vehicle.trailer_type == VehicleTrailerType.OTHER
      ? vehicle.trailer_type_other
      : (vehicle.trailer_type && t(`VehicleTrailerType.${vehicle.trailer_type}`)) || '';
  };

  const onCreateInspectionClick = async () => {
    await router.push(`${router.asPath}/inspections/create`);
  };

  const onEditInspectionClick = async (inspectionId: number) => {
    await router.push(`${router.asPath}/inspections/${inspectionId}/edit`);
  };

  const onDeleteInspectionClick = (inspection: VehicleInspectionEntity) => {
    setInspectionToDelete(inspection);
    setShowDeleteModal(true);
  };

  const handleDeleteInspectionConfirm = async () => {
    if (!inspectionToDelete) return;

    try {
      const api = new VehicleInspectionApi();
      await api.remove(+id, inspectionToDelete.id);
      setInspections(inspections.filter((i) => i.id !== inspectionToDelete.id));
      toast.success(t('Inspection deleted successfully'));
    } catch (error) {
      console.error('Error deleting inspection:', error);
      toast.error(t('Error deleting inspection'));
    } finally {
      setShowDeleteModal(false);
      setInspectionToDelete(null);
    }
  };

  const handleDeleteInspectionCancel = () => {
    setShowDeleteModal(false);
    setInspectionToDelete(null);
  };

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

  return (
    <ChildPageLayout
      backPath={backPath}
      title={t('VIEW_{name}', { name: 'VEHICLE' }, { translateProps: true })}
      actions={
        <ButtonGroup>
          {canDelete && <DeleteButton onDelete={onDeleteClick} />}
          {canEdit && (
            <Button type="button" onClick={onEditClick}>
              <Pencil /> {t('EDIT')}
            </Button>
          )}
        </ButtonGroup>
      }
    >
      <div className="vehicle-view">
        <Row>
          <Col lg={8}>
            <BaseViewCard>
              <ViewHeader
                title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                image={
                  vehicle?.photo ? { src: vehicle.photo.path, alt: 'Vehicle Photo' } : undefined
                }
              >
                <InfoGrid>
                  <InfoItem label={t('TYPE')} value={getVehicleType()} />
                  <InfoItem label={t('UNIT_NUMBER')} value={vehicle.unit_number} />
                  <InfoItem label={t('VIN')} value={vehicle.vin} />
                </InfoGrid>
              </ViewHeader>

              <ViewSection title={t('Vehicle Details')}>
                <InfoGrid>
                  <InfoItem label={t('TRAILER')} value={getTrailerType()} />
                  <InfoItem
                    label={t('TRANSMISSION')}
                    value={
                      vehicle.transmission_type
                        ? t(`VehicleTransmissionType.${vehicle.transmission_type}`)
                        : undefined
                    }
                  />
                  <InfoItem label={t('TIRE_SIZE')} value={vehicle.tire_size} />
                  <InfoItem
                    label={t('ODOMETER')}
                    value={vehicle.odometer ? `${vehicle.odometer} miles` : undefined}
                  />
                  <InfoItem
                    label={t('GOVERNED_SPEED')}
                    value={vehicle.is_governed ? t('YES') : t('NO')}
                  />
                  {vehicle.is_governed && (
                    <InfoItem label={t('MAX_SPEED')} value={`${vehicle.max_speed} mph`} />
                  )}
                  <InfoItem
                    label={t('ASSIGNED_EMPLOYEE')}
                    value={
                      assignedEmployee
                        ? `${assignedEmployee.first_name} ${assignedEmployee.last_name}`
                        : t('Not Assigned')
                    }
                  />
                </InfoGrid>
              </ViewSection>

              {vehicle.accessories && vehicle.accessories.length > 0 && (
                <ViewSection title={t('ACCESSORIES')}>
                  <ChipList
                    items={vehicle.accessories.map((accessory, index) => ({
                      id: index,
                      label:
                        accessory == VehicleAccessory.OTHER && vehicle.accessory_other
                          ? vehicle.accessory_other
                          : t(`VehicleAccessory.${accessory}`),
                    }))}
                  />
                </ViewSection>
              )}

              {vehicle.other_details && (
                <ViewSection title={t('OTHER_DETAILS')}>
                  <p>{vehicle.other_details}</p>
                </ViewSection>
              )}
            </BaseViewCard>
          </Col>
          <Col lg={4}>
            <VehicleRegistration
              vehicle={vehicle}
              onRegistrationUpdated={(updatedVehicle) => setVehicle(updatedVehicle)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseViewCard>
              <ViewSection title={t('Inspections')}>
                <div className="d-flex justify-content-end mb-3">
                  <Button onClick={onCreateInspectionClick}>
                    <Plus /> {t('Add Inspection')}
                  </Button>
                </div>
                <Table striped bordered hover className={`custom-table ${styles.inspectionsTable}`}>
                  <thead>
                    <tr>
                      <th
                        onClick={() => handleSort('inspection_type')}
                        className={styles.sortableHeader}
                      >
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
                      <th
                        onClick={() => handleSort('inspection_date')}
                        className={styles.sortableHeader}
                      >
                        <div className="d-flex align-items-center gap-2">
                          {t('Inspection Date')}
                          {getSortIcon('inspection_date')}
                        </div>
                      </th>
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
                        <td>{inspection.notes}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEditInspectionClick(inspection.id)}
                            >
                              <div className="d-flex align-items-center gap-1">
                                <PenFill /> {t('EDIT')}
                              </div>
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => onDeleteInspectionClick(inspection)}
                            >
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
              </ViewSection>
            </BaseViewCard>
          </Col>
        </Row>
      </div>

      <ConfirmationModal
        show={showDeleteModal}
        title="Confirm Delete"
        message={
          inspectionToDelete && (
            <p>
              {t('Are you sure you want to delete this inspection?')}
              <br />
              <strong>
                {t(`InspectionType.${inspectionToDelete.inspection_type}`)} -{' '}
                {t(`InspectionStatus.${inspectionToDelete.status}`)}
              </strong>
            </p>
          )
        }
        onConfirm={handleDeleteInspectionConfirm}
        onCancel={handleDeleteInspectionCancel}
      />
    </ChildPageLayout>
  );
}

ViewVehicle.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps(context) {
  try {
    const id = +context.params?.id;
    if (!id) return { notFound: true };

    return {
      props: { id: id },
    };
  } catch (error) {
    console.error('ViewVehicle error:', error);
    return { props: { id: null } };
  }
}

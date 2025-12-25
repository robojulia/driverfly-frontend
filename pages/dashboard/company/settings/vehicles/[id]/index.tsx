import { toast } from 'react-toastify';
import { Button, ButtonGroup, Row, Col, ToggleButton } from 'react-bootstrap';
import { Pencil, TrashFill } from 'react-bootstrap-icons';
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
import { InspectionsTable } from '../../../../../../components/vehicle/inspections/InspectionsTable';
import { InspectionCompletionModal } from '../../../../../../components/vehicle/inspections/InspectionCompletionModal';
import { RepairRecordsTable } from '../../../../../../components/vehicle/repairs/RepairRecordsTable';
import { VehicleRepairRecordEntity } from '../../../../../../models/company/vehicle-repair-record.entity';
import VehicleRepairRecordApi from '../../../../../api/vehicle-repair-record';
import VehicleNotificationRecipients from '../../../../../../components/vehicles/VehicleNotificationRecipients';
import { MaintenanceReportsTable } from '../../../../../../components/vehicle/maintenance/MaintenanceReportsTable';
import { VehicleMaintenanceReportEntity } from '../../../../../../models/company/vehicle-maintenance-report.entity';
import VehicleMaintenanceReportApi from '../../../../../api/vehicle-maintenance-report';

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
  const [completionInspection, setCompletionInspection] = useState<VehicleInspectionEntity | null>(
    null
  );
  const [repairs, setRepairs] = useState<VehicleRepairRecordEntity[]>([]);
  const [repairToDelete, setRepairToDelete] = useState<VehicleRepairRecordEntity | null>(null);
  const [activeTab, setActiveTab] = useState('inspections');
  const [maintenanceReports, setMaintenanceReports] = useState<VehicleMaintenanceReportEntity[]>([]);
  const [maintenanceReportToDelete, setMaintenanceReportToDelete] = useState<VehicleMaintenanceReportEntity | null>(null);

  const backPath = '/dashboard/company/settings/vehicles';

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  // Add fetchInspections function
  const fetchInspections = async () => {
    try {
      const api = new VehicleInspectionApi();
      const data = await api.list(+id);
      setInspections(data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
      toast.error(t('Error loading inspections'));
    }
  };

  // Fetch inspections on mount
  useEffectAsync(async () => {
    if (id) {
      await fetchInspections();
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

  const handleCompleteInspection = async (values) => {
    if (!completionInspection) return;

    try {
      const api = new VehicleInspectionApi();
      const updatedInspection = await api.update(id, completionInspection.id, {
        ...completionInspection,
        status: values.status,
        notes: values.notes,
        inspection_date: values.inspection_date,
        inspection_document: values.inspection_document,
        follow_up_inspection: values.follow_up_inspection,
      });

      // Refresh the inspections list to include any new follow-up inspections
      await fetchInspections();
      toast.success(t('Inspection completed successfully'));
    } catch (error) {
      console.error('Error completing inspection:', error);
      toast.error(t('Error completing inspection'));
      throw error; // Re-throw to trigger error handling in modal
    }
  };

  // Fetch repairs
  useEffectAsync(async () => {
    if (id) {
      try {
        const api = new VehicleRepairRecordApi();
        const data = await api.list(+id);
        setRepairs(data);
      } catch (error) {
        console.error('Error fetching repairs:', error);
        toast.error(t('Error loading repairs'));
      }
    }
  }, [id]);

  const onCreateRepairClick = async () => {
    await router.push(`${router.asPath}/repairs/create`);
  };

  const onEditRepairClick = async (repairId: number) => {
    await router.push(`${router.asPath}/repairs/${repairId}/edit`);
  };

  const onDeleteRepairClick = (repair: VehicleRepairRecordEntity) => {
    setRepairToDelete(repair);
    setShowDeleteModal(true);
  };

  const handleDeleteRepairConfirm = async () => {
    if (!repairToDelete) return;

    try {
      const api = new VehicleRepairRecordApi();
      await api.remove(+id, repairToDelete.id);
      setRepairs(repairs.filter((r) => r.id !== repairToDelete.id));
      toast.success(t('Repair record deleted successfully'));
    } catch (error) {
      console.error('Error deleting repair record:', error);
      toast.error(t('Error deleting repair record'));
    } finally {
      setShowDeleteModal(false);
      setRepairToDelete(null);
    }
  };

  // Fetch maintenance reports
  useEffectAsync(async () => {
    if (id) {
      try {
        const api = new VehicleMaintenanceReportApi();
        const data = await api.list(+id);
        setMaintenanceReports(data);
      } catch (error) {
        console.error('Error fetching maintenance reports:', error);
        toast.error(t('Error loading maintenance reports'));
      }
    }
  }, [id]);

  const onCreateMaintenanceReportClick = async () => {
    await router.push(`${router.asPath}/maintenance-reports/create`);
  };

  const onEditMaintenanceReportClick = async (reportId: number) => {
    await router.push(`${router.asPath}/maintenance-reports/${reportId}/edit`);
  };

  const onDeleteMaintenanceReportClick = (report: VehicleMaintenanceReportEntity) => {
    setMaintenanceReportToDelete(report);
    setShowDeleteModal(true);
  };

  const handleDeleteMaintenanceReportConfirm = async () => {
    if (!maintenanceReportToDelete) return;

    try {
      const api = new VehicleMaintenanceReportApi();
      await api.remove(+id, maintenanceReportToDelete.id!);
      setMaintenanceReports(maintenanceReports.filter((r) => r.id !== maintenanceReportToDelete.id));
      toast.success(t('Maintenance report deleted successfully'));
    } catch (error) {
      console.error('Error deleting maintenance report:', error);
      toast.error(t('Error deleting maintenance report'));
    } finally {
      setShowDeleteModal(false);
      setMaintenanceReportToDelete(null);
    }
  };

  const handleSaveNotificationRecipients = (recipients: any) => {
    // TODO: Implement API call to save notification recipients
    console.log('Saving notification recipients:', recipients);
    toast.success(t('Notification recipients saved successfully'));
  };

  // If vehicle is not loaded, don't render the page
  if (!vehicle || !vehicle.make) return null;

  return (
    <ChildPageLayout
      backPath={backPath}
      title={t('VIEW_{name}', { name: 'VEHICLE' }, { translateProps: true })}
      actions={
        <ButtonGroup>
          {canDelete && <DeleteButton onDelete={onDeleteClick} />}
          {canEdit && (
            <Button type="button" onClick={onEditClick}>
              <Pencil className="me-2" /> {t('EDIT')}
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
            <VehicleNotificationRecipients
              assignedDriver={assignedEmployee}
              canEdit={canEdit}
              onSave={handleSaveNotificationRecipients}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <BaseViewCard>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <ButtonGroup>
                  <ToggleButton
                    id="inspections-tab"
                    type="radio"
                    variant="outline-primary"
                    name="tab"
                    value="inspections"
                    checked={activeTab === 'inspections'}
                    onChange={(e) => setActiveTab(e.currentTarget.value)}
                    className={activeTab === 'inspections' ? 'tab-button active' : 'tab-button'}
                  >
                    {t('Inspections')}
                  </ToggleButton>
                  <ToggleButton
                    id="maintenance-tab"
                    type="radio"
                    variant="outline-primary"
                    name="tab"
                    value="maintenance"
                    checked={activeTab === 'maintenance'}
                    onChange={(e) => setActiveTab(e.currentTarget.value)}
                    className={activeTab === 'maintenance' ? 'tab-button active' : 'tab-button'}
                  >
                    {t('Maintenance Reports')}
                  </ToggleButton>
                  <ToggleButton
                    id="repairs-tab"
                    type="radio"
                    variant="outline-primary"
                    name="tab"
                    value="repairs"
                    checked={activeTab === 'repairs'}
                    onChange={(e) => setActiveTab(e.currentTarget.value)}
                    className={activeTab === 'repairs' ? 'tab-button active' : 'tab-button'}
                  >
                    {t('Repair Receipts')}
                  </ToggleButton>
                </ButtonGroup>
              </div>

              {activeTab === 'inspections' ? (
                <>
                  <ViewSection title={t('Vehicle Inspections')}>
                    <p className="text-muted mb-4">
                      {t(
                        'Track and manage all vehicle inspections, including safety checks, maintenance inspections, and roadside inspections.'
                      )}
                    </p>
                    <InspectionsTable
                      inspections={inspections}
                      onCreateInspection={onCreateInspectionClick}
                      onEditInspection={onEditInspectionClick}
                      onDeleteInspection={onDeleteInspectionClick}
                      onCompleteInspection={setCompletionInspection}
                    />
                  </ViewSection>
                </>
              ) : activeTab === 'maintenance' ? (
                <>
                  <ViewSection title={t('Maintenance Reports')}>
                    <p className="text-muted mb-4">
                      {t(
                        'Upload and manage maintenance reports for this vehicle, including service records, maintenance schedules, and work orders.'
                      )}
                    </p>
                    <MaintenanceReportsTable
                      maintenanceReports={maintenanceReports}
                      onCreateReport={onCreateMaintenanceReportClick}
                      onEditReport={onEditMaintenanceReportClick}
                      onDeleteReport={onDeleteMaintenanceReportClick}
                    />
                  </ViewSection>
                </>
              ) : (
                <>
                  <ViewSection title={t('Repair History')}>
                    <p className="text-muted mb-4">
                      {t(
                        'View and manage vehicle repair records, including scheduled maintenance, emergency repairs, and warranty work.'
                      )}
                    </p>
                    <RepairRecordsTable
                      repairs={repairs}
                      onCreateRepair={onCreateRepairClick}
                      onEditRepair={onEditRepairClick}
                      onDeleteRepair={onDeleteRepairClick}
                    />
                  </ViewSection>
                </>
              )}
            </BaseViewCard>
          </Col>
        </Row>
      </div>

      <InspectionCompletionModal
        inspection={completionInspection}
        onClose={() => setCompletionInspection(null)}
        onComplete={handleCompleteInspection}
      />

      <ConfirmationModal
        show={showDeleteModal}
        title="Confirm Delete"
        message={
          repairToDelete ? (
            <p>
              {t('Are you sure you want to delete this repair record?')}
              <br />
              <strong>
                {t(`RepairType.${repairToDelete.repair_type}`)} - {repairToDelete.description}
              </strong>
            </p>
          ) : maintenanceReportToDelete ? (
            <p>
              {t('Are you sure you want to delete this maintenance report?')}
              <br />
              <strong>
                {t(`MaintenanceType.${maintenanceReportToDelete.maintenance_type}`)} - {maintenanceReportToDelete.description}
              </strong>
            </p>
          ) : inspectionToDelete ? (
            <p>
              {t('Are you sure you want to delete this inspection?')}
              <br />
              <strong>
                {t(`InspectionType.${inspectionToDelete.inspection_type}`)} -{' '}
                {t(`InspectionStatus.${inspectionToDelete.status}`)}
              </strong>
            </p>
          ) : null
        }
        onConfirm={
          repairToDelete
            ? handleDeleteRepairConfirm
            : maintenanceReportToDelete
            ? handleDeleteMaintenanceReportConfirm
            : handleDeleteInspectionConfirm
        }
        onCancel={() => {
          setShowDeleteModal(false);
          setRepairToDelete(null);
          setMaintenanceReportToDelete(null);
          setInspectionToDelete(null);
        }}
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

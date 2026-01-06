import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from '../../../../../hooks/use-translation';

import {
  EyeFill,
  PenFill,
  TrashFill,
  TruckFrontFill,
  ClipboardCheck,
  Receipt,
  Tools,
  BellFill,
} from 'react-bootstrap-icons';

import VehicleApi from '../../../../api/vehicle';
import EmployeeApi from '../../../../api/employee';
import VehicleInspectionApi from '../../../../api/vehicle-inspection';
import VehicleRepairRecordApi from '../../../../api/vehicle-repair-record';
import VehicleMaintenanceReportApi from '../../../../api/vehicle-maintenance-report';
import { VehicleType } from '../../../../../enums/vehicles/vehicle-type.enum';
import { VehicleTrailerType } from '../../../../../enums/vehicles/vehicle-trailer-type.enum';
import { VehicleAccessory } from '../../../../../enums/vehicles/vehicle-accessory.enum';
import { EmployeeStatus } from '../../../../../enums/applicants/employee-status.enum';
import { VehicleEntity } from '../../../../../models/company/vehicle.entity';
import { EmployeeEntity } from '../../../../../models/employee/employee.entity';
import { VehicleWithDueInspectionsDto } from '../../../../../models/company/vehicle-with-due-inspections.dto';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import ViewDataTable, {
  getDataTableColumnKey,
} from '../../../../../components/view-details/view-data-table';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import OverlyPopover from '../../../../../components/popover/overly-popover';
import Link from 'next/link';
import DueInspectionsAlert from '../../../../../components/vehicles/DueInspectionsAlert';
import VehicleNotificationSettings from '../../../../../components/vehicles/VehicleNotificationSettings';
import MultiOptionToggle from '../../../../../components/shared/MultiOptionToggle';
import { AllInspectionsTable, InspectionWithVehicle } from '../../../../../components/vehicle/AllInspectionsTable';
import { AllReceiptsTable, RepairWithVehicle } from '../../../../../components/vehicle/AllReceiptsTable';
import { AllMaintenanceReportsTable, MaintenanceReportWithVehicle } from '../../../../../components/vehicle/AllMaintenanceReportsTable';

enum VehicleViewMode {
  VEHICLES = 'vehicles',
  INSPECTIONS = 'inspections',
  MAINTENANCE = 'maintenance',
  RECEIPTS = 'receipts',
}

export default function VehicleList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleEntity[]>([]);
  const [dueInspections, setDueInspections] = useState<VehicleWithDueInspectionsDto[]>([]);
  const [isDueInspectionsLoading, setIsDueInspectionsLoading] = useState(true);
  const [employees, setEmployees] = useState<Record<number, EmployeeEntity>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleEntity | null>(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  // View mode state
  const [viewMode, setViewMode] = useState<VehicleViewMode>(() => {
    if (typeof window !== 'undefined') {
      const savedView = sessionStorage.getItem('vehicles_view_mode');
      return (savedView as VehicleViewMode) || VehicleViewMode.VEHICLES;
    }
    return VehicleViewMode.VEHICLES;
  });
  const [allInspections, setAllInspections] = useState<InspectionWithVehicle[]>([]);
  const [allReceipts, setAllReceipts] = useState<RepairWithVehicle[]>([]);
  const [allMaintenanceReports, setAllMaintenanceReports] = useState<MaintenanceReportWithVehicle[]>([]);
  const [inspectionsLoading, setInspectionsLoading] = useState(false);
  const [receiptsLoading, setReceiptsLoading] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [inspectionsFetched, setInspectionsFetched] = useState(false);
  const [receiptsFetched, setReceiptsFetched] = useState(false);
  const [maintenanceFetched, setMaintenanceFetched] = useState(false);

  const columnSettingKey = getDataTableColumnKey('company', user, 'vehicles');

  // Fetch all inspections from all vehicles
  const fetchAllInspections = async () => {
    if (vehicles.length === 0) return;

    try {
      setInspectionsLoading(true);
      const inspectionApi = new VehicleInspectionApi();

      // Fetch inspections for all vehicles in parallel
      const promises = vehicles.map((vehicle) =>
        inspectionApi.list(vehicle.id).catch(() => [])
      );
      const results = await Promise.all(promises);

      // Flatten and add vehicle info
      const inspectionsWithVehicle: InspectionWithVehicle[] = results.flatMap(
        (inspections, index) =>
          inspections.map((inspection) => ({
            ...inspection,
            vehicle: vehicles[index],
          }))
      );

      // Filter: past completed + upcoming in next 30 days
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

      const filteredInspections = inspectionsWithVehicle.filter((inspection) => {
        // Include all passed or failed inspections (completed in the past)
        if (['Passed', 'Failed'].includes(inspection.status)) {
          return true;
        }

        // Include pending/scheduled inspections due in next 30 days
        if (inspection.due_date) {
          const dueDate = new Date(inspection.due_date);
          return dueDate <= thirtyDaysFromNow;
        }

        return false;
      });

      setAllInspections(filteredInspections);
      setInspectionsFetched(true);
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: t('UNABLE_TO_LOAD_{name}', { name: 'INSPECTIONS' }, { translateProps: true }),
      });
    } finally {
      setInspectionsLoading(false);
    }
  };

  // Fetch all repair receipts from all vehicles
  const fetchAllReceipts = async () => {
    if (vehicles.length === 0) return;

    try {
      setReceiptsLoading(true);
      const repairApi = new VehicleRepairRecordApi();

      // Fetch repair records for all vehicles in parallel
      const promises = vehicles.map((vehicle) =>
        repairApi.list(vehicle.id).catch(() => [])
      );
      const results = await Promise.all(promises);

      // Flatten and add vehicle info
      const repairsWithVehicle: RepairWithVehicle[] = results.flatMap(
        (repairs, index) =>
          repairs.map((repair) => ({
            ...repair,
            vehicle: vehicles[index],
          }))
      );

      // Filter: only repairs with receipt documents
      const receiptsOnly = repairsWithVehicle.filter(
        (repair) => repair.repair_receipt_document != null
      );

      setAllReceipts(receiptsOnly);
      setReceiptsFetched(true);
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: t('UNABLE_TO_LOAD_{name}', { name: 'RECEIPTS' }, { translateProps: true }),
      });
    } finally {
      setReceiptsLoading(false);
    }
  };

  // Fetch all maintenance reports from all vehicles
  const fetchAllMaintenanceReports = async () => {
    if (vehicles.length === 0) return;

    try {
      setMaintenanceLoading(true);
      const maintenanceApi = new VehicleMaintenanceReportApi();

      // Fetch maintenance reports for all vehicles in parallel
      const promises = vehicles.map((vehicle) =>
        maintenanceApi.list(vehicle.id).catch(() => [])
      );
      const results = await Promise.all(promises);

      // Flatten and add vehicle info
      const reportsWithVehicle: MaintenanceReportWithVehicle[] = results.flatMap(
        (reports, index) =>
          reports.map((report) => ({
            ...report,
            vehicle: vehicles[index],
          }))
      );

      setAllMaintenanceReports(reportsWithVehicle);
      setMaintenanceFetched(true);
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: t('UNABLE_TO_LOAD_{name}', { name: 'MAINTENANCE_REPORTS' }, { translateProps: true }),
      });
    } finally {
      setMaintenanceLoading(false);
    }
  };

  // Handle view mode change
  const handleViewChange = (newView: string) => {
    const newViewMode = newView as VehicleViewMode;
    setViewMode(newViewMode);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('vehicles_view_mode', newViewMode);
    }
  };

  // Lazy load data when switching views
  useEffect(() => {
    if (viewMode === VehicleViewMode.INSPECTIONS && !inspectionsFetched && vehicles.length > 0) {
      fetchAllInspections();
    } else if (viewMode === VehicleViewMode.MAINTENANCE && !maintenanceFetched && vehicles.length > 0) {
      fetchAllMaintenanceReports();
    } else if (viewMode === VehicleViewMode.RECEIPTS && !receiptsFetched && vehicles.length > 0) {
      fetchAllReceipts();
    }
  }, [viewMode, vehicles, inspectionsFetched, maintenanceFetched, receiptsFetched]);

  useEffectAsync(async () => {
    const vehicleApi = new VehicleApi();
    const employeeApi = new EmployeeApi();

    try {
      const [vehiclesResponse, employeesResponse, dueInspectionsResponse] = await Promise.all([
        vehicleApi.list({ withDocuments: true }),
        employeeApi.list({
          status: [EmployeeStatus.ACTIVE],
          is_paginated: true,
          limit: 1000,
          page: 1,
        }),
        vehicleApi.getDueInspections(),
      ]);

      setVehicles(vehiclesResponse);
      setDueInspections(dueInspectionsResponse);

      // Create a map of employee IDs to employee entities
      const employeeMap = {};
      (employeesResponse as any)?.items?.forEach((emp: EmployeeEntity) => {
        employeeMap[emp.id] = emp;
      });
      setEmployees(employeeMap);
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: t('UNABLE_TO_LOAD_{name}', { name: 'VEHICLES' }, { translateProps: true }),
      });
    } finally {
      setIsDueInspectionsLoading(false);
    }
  }, [user]);

  const onAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`${router.asPath}/create`);
  };

  const onEditClick = (id: number) => {
    router.push(`${router.asPath}/${id}/edit`);
  };

  const onViewClick = (id: number) => {
    router.push(`${router.asPath}/${id}`);
  };

  const onDeleteClick = (vehicle: VehicleEntity) => {
    setVehicleToDelete(vehicle);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;

    try {
      const api = new VehicleApi();
      await api.remove(vehicleToDelete.id);
      setVehicles(vehicles.filter((v) => v.id !== vehicleToDelete.id));
      toast.success(t('Vehicle deleted successfully'));
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: 'UNABLE_TO_DELETE',
      });
    } finally {
      setShowDeleteModal(false);
      setVehicleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVehicleToDelete(null);
  };

  const canCreate = hasPermission('CanCreateVehicle');

  function getVehicleAccessories(v: VehicleEntity) {
    return v.accessories
      ?.map((a, i) =>
        a == VehicleAccessory.OTHER && v.accessory_other
          ? v.accessory_other
          : t(`VehicleAccessory.${a}`)
      )
      .join(', ');
  }

  function getVehicleType(v: VehicleEntity) {
    return v.type == VehicleType.OTHER ? v.type_other : t(`VehicleType.${v.type}`);
  }

  function getAssignedEmployee(v: VehicleEntity) {
    const employee = employees[v.current_employee_id];
    return employee ? `${employee.first_name} ${employee.last_name}` : t('Not Assigned');
  }

  return (
    <PageLayout
      title="VEHICLES"
      desciption="VEHICLES_DESC"
      actions={
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => setShowNotificationSettings(true)}>
            <BellFill size={16} className="me-2" />
            {t('Notification Settings')}
          </Button>
          {canCreate && <Button onClick={onAddClick}>{t('Add Equipment')}</Button>}
        </ButtonGroup>
      }
    >
      <div className="mb-3">
        <MultiOptionToggle
          options={[
            {
              value: VehicleViewMode.VEHICLES,
              label: 'Vehicles',
              icon: <TruckFrontFill size={16} />,
              count: vehicles.length,
            },
            {
              value: VehicleViewMode.INSPECTIONS,
              label: 'Inspections',
              icon: <ClipboardCheck size={16} />,
              count: inspectionsFetched ? allInspections.length : undefined,
            },
            {
              value: VehicleViewMode.MAINTENANCE,
              label: 'Maintenance',
              icon: <Tools size={16} />,
              count: maintenanceFetched ? allMaintenanceReports.length : undefined,
            },
            {
              value: VehicleViewMode.RECEIPTS,
              label: 'Receipts',
              icon: <Receipt size={16} />,
              count: receiptsFetched ? allReceipts.length : undefined,
            },
          ]}
          activeOption={viewMode}
          onOptionChange={handleViewChange}
          variant="pills"
          size="md"
          showCounts={true}
        />
      </div>

      {viewMode === VehicleViewMode.VEHICLES && (
        <>
          <DueInspectionsAlert dueInspections={dueInspections} isLoading={isDueInspectionsLoading} />

          <ViewDataTable<VehicleEntity>
            columnSettingKey={columnSettingKey}
            onRowClicked={(vehicle) => onViewClick(vehicle.id)}
            columns={[
          {
            id: 'id',
            name: 'ID',
            selector: (v) => v.id,
            hide: 1,
          },
          {
            id: 'photo',
            name: 'PHOTO',
            cell: (v) =>
              v.photo && (
                <img
                  className="img-thumbnail"
                  style={{ maxWidth: '100px' }}
                  src={v.photo.path}
                  alt="Vehicle Photo"
                />
              ),
          },
          {
            id: 'type',
            name: 'TYPE',
            selector: getVehicleType,
            cell: (v) => getVehicleType(v),
            hidable: false,
          },
          {
            id: 'trailer',
            name: 'TRAILER',
            selector: (v) =>
              v.trailer_type == VehicleTrailerType.OTHER
                ? v.trailer_type_other
                : (v.trailer_type && t(`VehicleTrailerType.${v.trailer_type}`)) || '',
          },
          {
            id: 'transmission',
            name: 'TRANSMISSION',
            selector: (v) =>
              v.transmission_type ? t(`VehicleTransmissionType.` + v.transmission_type) : null,
          },
          {
            id: 'make',
            name: 'MAKE',
            selector: (v) => v.make,
          },
          {
            id: 'model',
            name: 'MODEL',
            selector: (v) => v.model,
          },
          {
            id: 'year',
            name: 'YEAR',
            selector: (v) => v.year,
          },
          {
            id: 'vin',
            name: 'VIN',
            selector: (v) => v.vin,
            hide: 1,
          },
          {
            id: 'unit_number',
            name: 'UNIT_NUMBER',
            selector: (v) => v.unit_number,
          },
          {
            id: 'assigned_employee',
            name: 'ASSIGNED_EMPLOYEE',
            selector: getAssignedEmployee,
          },
          {
            id: 'tire_size',
            name: 'TIRE_SIZE',
            selector: (v) => v.tire_size,
            hide: 1,
          },
          {
            id: 'odometer',
            name: 'ODOMETER',
            selector: (v) => (v.odometer ? `${v.odometer} miles` : null),
            hide: 1,
          },
          {
            id: 'governed_speed',
            name: 'GOVERNED_SPEED',
            selector: (v) => (v.is_governed ? t('YES') : t('NO')),
            hide: 1,
          },
          {
            id: 'max_speed',
            name: 'MAX_SPEED',
            selector: (v) => (v.is_governed ? `${v.max_speed} mph` : null),
            hide: 1,
          },
          {
            id: 'accessories',
            name: 'ACCESSORIES',
            selector: getVehicleAccessories,
            cell: (v) => (
              <OverlyPopover str={getVehicleAccessories(v)} skipTranslate slice_at={5} />
            ),
            hide: 1,
          },
          {
            id: 'is_public',
            name: 'PUBLIC',
            selector: (v) => (v.is_public ? t('YES') : t('NO')),
            hide: 1,
          },
          {
            id: 'actions',
            name: '',
            cell: (v) => (
              <div className="d-flex gap-2">
                {hasPermission('CanViewVehicle') && (
                  <Button variant="primary" size="sm" onClick={() => onViewClick(v.id)}>
                    <div className="d-flex align-items-center gap-1">
                      <EyeFill /> {t('VIEW')}
                    </div>
                  </Button>
                )}
                {hasPermission('CanUpdateVehicle') && (
                  <Button variant="secondary" size="sm" onClick={() => onEditClick(v.id)}>
                    <div className="d-flex align-items-center gap-1">
                      <PenFill className="me-2" /> {t('EDIT')}
                    </div>
                  </Button>
                )}
                {hasPermission('CanDeleteVehicle') && (
                  <Button variant="danger" size="sm" onClick={() => onDeleteClick(v)}>
                    <div className="d-flex align-items-center gap-1">
                      <TrashFill className="me-2" /> {t('DELETE')}
                    </div>
                  </Button>
                )}
              </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            hidable: false,
            width: '250px',
            right: true,
          },
        ]}
            items={vehicles}
          />
        </>
      )}

      {viewMode === VehicleViewMode.INSPECTIONS && (
        <AllInspectionsTable
          inspections={allInspections}
          loading={inspectionsLoading}
        />
      )}

      {viewMode === VehicleViewMode.MAINTENANCE && (
        <AllMaintenanceReportsTable
          maintenanceReports={allMaintenanceReports}
          loading={maintenanceLoading}
        />
      )}

      {viewMode === VehicleViewMode.RECEIPTS && (
        <AllReceiptsTable
          receipts={allReceipts}
          loading={receiptsLoading}
        />
      )}

      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{t('Confirm Delete')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vehicleToDelete && (
            <p>
              {t('Are you sure you want to delete this vehicle?')}
              <br />
              <strong>
                {vehicleToDelete.year} {vehicleToDelete.make} {vehicleToDelete.model}
                {vehicleToDelete.unit_number && ` (Unit #${vehicleToDelete.unit_number})`}
              </strong>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            {t('CANCEL')}
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            {t('DELETE')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notification Settings Modal */}
      <VehicleNotificationSettings
        show={showNotificationSettings}
        onHide={() => setShowNotificationSettings(false)}
        canEdit={canCreate}
      />
    </PageLayout>
  );
}

VehicleList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

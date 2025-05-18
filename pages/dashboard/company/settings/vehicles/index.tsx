import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { useAuth } from '../../../../../hooks/use-auth';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from '../../../../../hooks/use-translation';

import { EyeFill, PenFill, TrashFill } from 'react-bootstrap-icons';

import VehicleApi from '../../../../api/vehicle';
import EmployeeApi from '../../../../api/employee';
import { VehicleType } from '../../../../../enums/vehicles/vehicle-type.enum';
import { VehicleTrailerType } from '../../../../../enums/vehicles/vehicle-trailer-type.enum';
import { VehicleAccessory } from '../../../../../enums/vehicles/vehicle-accessory.enum';
import { EmployeeStatus } from '../../../../../enums/applicants/employee-status.enum';
import { VehicleEntity } from '../../../../../models/company/vehicle.entity';
import { EmployeeEntity } from '../../../../../models/employee/employee.entity';
import PageLayout from '../../../../../components/layouts/page/page-layout';
import { ButtonGroup, Button } from 'react-bootstrap';
import ViewDataTable, {
  getDataTableColumnKey,
} from '../../../../../components/view-details/view-data-table';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import OverlyPopover from '../../../../../components/popover/overly-popover';
import Link from 'next/link';

export default function VehicleList() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const [vehicles, setVehicles] = useState<VehicleEntity[]>([]);
  const [employees, setEmployees] = useState<Record<number, EmployeeEntity>>({});

  const columnSettingKey = getDataTableColumnKey('company', user, 'vehicles');

  useEffectAsync(async () => {
    const vehicleApi = new VehicleApi();
    const employeeApi = new EmployeeApi();

    try {
      const [vehiclesResponse, employeesResponse] = await Promise.all([
        vehicleApi.list({ withPhoto: true }),
        employeeApi.list({
          status: [EmployeeStatus.ACTIVE],
          is_paginated: true,
          limit: 1000,
          page: 1,
        }),
      ]);

      setVehicles(vehiclesResponse);

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

  const onDeleteClick = async (id: number) => {
    try {
      const api = new VehicleApi();
      await api.remove(id);
      setVehicles(vehicles.filter((v) => v.id != id));
    } catch (e) {
      globalAjaxExceptionHandler(e, {
        t: t,
        toast: toast,
        defaultMessage: 'UNABLE_TO_DELETE',
      });
    }
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
          {canCreate && <Button onClick={onAddClick}>+ {t('CREATE')}</Button>}
        </ButtonGroup>
      }
    >
      <ViewDataTable<VehicleEntity>
        columnSettingKey={columnSettingKey}
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
            cell: (v) => (
              <Link href={`${router.asPath}/${v.id}`}>
                <a>{getVehicleType(v)}</a>
              </Link>
            ),
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
        ]}
        actions={(v) => [
          {
            onClick: (e) => onViewClick(v.id),
            icon: EyeFill,
            label: 'VIEW',
            hide: !hasPermission('CanViewVehicle'),
          },
          {
            onClick: (e) => onEditClick(v.id),
            icon: PenFill,
            label: 'EDIT',
            hide: !hasPermission('CanUpdateVehicle'),
          },
          {
            onClick: (e) => onDeleteClick(v.id),
            icon: TrashFill,
            label: 'DELETE',
            hide: !hasPermission('CanDeleteVehicle'),
          },
        ]}
        items={vehicles}
      />
    </PageLayout>
  );
}

VehicleList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

// export async function getServerSideProps(context) {
//   const { user } = useUserContext();

// }

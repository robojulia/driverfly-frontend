import { toast } from 'react-toastify';

import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import Image from 'next/image';

import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import ViewDetails from '../../../../../../components/view-details/view-details';
import { DeleteButton } from '../../../../../../components/buttons/delete-button';

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useEffectAsync } from '../../../../../../utils/react';
import { useTranslation } from '../../../../../../hooks/use-translation';
import { useAuth } from '../../../../../../hooks/use-auth';

import VehicleApi from '../../../../../api/vehicle';
import EmployeeApi from '../../../../../api/employee';
import { VehicleEntity } from '../../../../../../models/company/vehicle.entity';
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
  const [assignedEmployee, setAssignedEmployee] = useState<EmployeeEntity | null>(null);

  const backPath = '/dashboard/company/settings/vehicles';

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

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
          // Find the specific employee in the response
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
      const data = await api.findById(+id, { withPhoto: true });

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
      <Row>
        <Col>
          <ViewDetails
            obj={{
              PHOTO: {
                label: 'PHOTO',
                text: vehicle?.photo ? (
                  <div
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="img-thumbnail"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: 'contain',
                      }}
                      src={vehicle.photo.path}
                      alt="Vehicle Photo"
                    />
                  </div>
                ) : null,
              },
              TYPE:
                vehicle.type == VehicleType.OTHER
                  ? vehicle.type_other
                  : t(`VehicleType.${vehicle.type}`),
              TRAILER:
                vehicle.trailer_type == VehicleTrailerType.OTHER
                  ? vehicle.trailer_type_other
                  : (vehicle.trailer_type && t(`VehicleTrailerType.${vehicle.trailer_type}`)) || '',
              TRANSMISSION: vehicle.transmission_type
                ? t(`VehicleTransmissionType.` + vehicle.transmission_type)
                : null,
              MAKE: vehicle.make,
              MODEL: vehicle.model,
              YEAR: vehicle.year,
              VIN: vehicle.vin,
              UNIT_NUMBER: vehicle.unit_number,
              TIRE_SIZE: vehicle.tire_size,
              ODOMETER: vehicle.odometer ? `${vehicle.odometer} miles` : null,
              ASSIGNED_EMPLOYEE: assignedEmployee
                ? `${assignedEmployee.first_name} ${assignedEmployee.last_name}`
                : 'Not Assigned',
              GOVERNED_SPEED: vehicle.is_governed ? 'Yes' : 'No',
              MAX_SPEED: {
                show: vehicle.is_governed,
                text: vehicle.max_speed ? `${vehicle.max_speed} mph` : null,
              },
              ACCESSORIES: vehicle.accessories?.map((a, i) =>
                a == VehicleAccessory.OTHER && vehicle.accessory_other
                  ? vehicle.accessory_other
                  : t(`VehicleAccessory.${a}`)
              ),
              OTHER_DETAILS: vehicle.other_details,
              IS_PUBLIC: vehicle.is_public ? 'Yes' : 'No',
            }}
          />
        </Col>
      </Row>
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

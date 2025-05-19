import { toast } from 'react-toastify';
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';
import { Pencil } from 'react-bootstrap-icons';
import FullLayout from '../../../../../../components/dashboard/layouts/layout/full-layout';
import ChildPageLayout from '../../../../../../components/layouts/page/child-page-layout';
import { DeleteButton } from '../../../../../../components/buttons/delete-button';
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
      </div>
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

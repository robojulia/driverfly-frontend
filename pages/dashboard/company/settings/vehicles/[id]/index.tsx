import { toast } from 'react-toastify';
import { Button, ButtonGroup, Row, Col } from 'react-bootstrap';
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

  const handleCompleteInspection = async (values) => {
    if (!completionInspection) return;

    try {
      const api = new VehicleInspectionApi();
      const updatedInspection = await api.update(id, completionInspection.id, {
        ...completionInspection,
        status: values.status,
        notes: values.notes,
        inspection_date: new Date(),
        inspection_document: values.inspection_document,
      });

      setInspections(
        inspections.map((i) => (i.id === updatedInspection.id ? updatedInspection : i))
      );
      toast.success(t('Inspection completed successfully'));
    } catch (error) {
      console.error('Error completing inspection:', error);
      toast.error(t('Error completing inspection'));
      throw error; // Re-throw to trigger error handling in modal
    }
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
                <InspectionsTable
                  inspections={inspections}
                  onCreateInspection={onCreateInspectionClick}
                  onEditInspection={onEditInspectionClick}
                  onDeleteInspection={onDeleteInspectionClick}
                  onCompleteInspection={setCompletionInspection}
                />
              </ViewSection>
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

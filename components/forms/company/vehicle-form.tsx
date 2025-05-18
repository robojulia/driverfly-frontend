import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from '../../../hooks/use-translation';
import { VehicleEntity } from '../../../models/company/vehicle.entity';
import VehicleApi from '../../../pages/api/vehicle';
import { EmployeeEntity } from '../../../models/employee/employee.entity';
import { EmployeeStatus } from '../../../enums/applicants/employee-status.enum';
import EmployeeApi from '../../../pages/api/employee';

import { VehicleAccessory } from '../../../enums/vehicles/vehicle-accessory.enum';
import { VehicleTrailerType } from '../../../enums/vehicles/vehicle-trailer-type.enum';
import { VehicleTransmissionType } from '../../../enums/vehicles/vehicle-transmission-type.enum';
import { VehicleType } from '../../../enums/vehicles/vehicle-type.enum';

import { DocumentType } from '../../../models/documents/document.entity';

import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import EntityForm from '../../layouts/page/entity-form';
import BaseCheck from '../base-check';
import BaseInput from '../base-input';
import BaseMilesInput from '../base-miles-input';
import BaseSelect from '../base-select';
import BaseTextArea from '../base-text-area';
import BaseVinInput from '../base-vin-input';
import FileInput from '../file-input';
import { BaseFormProps } from './base-form-props';

export interface VehicleFormProps extends BaseFormProps<VehicleEntity> {}

export function VehicleForm(props: VehicleFormProps) {
  const { t } = useTranslation();
  let { className, entity, onSaveComplete, onSaveError } = props;
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const action = !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATE/ADD';

  const form = useFormik({
    initialValues: new VehicleEntity(),
    validationSchema: VehicleEntity.yupSchema(),
    onSubmit: async (dto) => {
      if (dto.max_speed) dto.max_speed = +dto.max_speed;
      if (dto.odometer) dto.odometer = +dto.odometer;

      const api = new VehicleApi();
      try {
        let vehicle = null;
        if (entity?.id) {
          vehicle = await api.update(entity.id, dto);
        } else {
          vehicle = await api.create(dto);
        }
        toast.success(
          t(
            'Forms.SUCCESS_{action}_{name}',
            { action: action, name: 'VEHICLE' },
            { translateProps: true }
          )
        );
        if (onSaveComplete) onSaveComplete(vehicle);
      } catch (e) {
        console.error('Unable to save entity', e);
        globalAjaxExceptionHandler(e, {
          formik: form,
          toast: toast,
          t: t,
          defaultMessage: t(
            'Forms.FAIL_{action}_{name}',
            { action: action, name: 'VEHICLE' },
            { translateProps: true }
          ),
        });
        if (onSaveError) onSaveError(e);
      }
    },
  });
  const fetchEmployees = async (): Promise<void> => {
    try {
      const employeeApi = new EmployeeApi();
      const data = await employeeApi.list({
        status: [EmployeeStatus.ACTIVE],
        is_paginated: true,
        limit: 1000, // We'll load all for now as discussed
        page: 1,
      });
      setEmployees((data as any)?.items || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error(t('Error loading employees'));
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (entity && !form.dirty) {
      form.setValues(entity);

      // If there's a current employee ID, find and display the employee name
      if (entity.current_employee_id) {
        const currentEmployee = employees.find((emp) => emp.id === entity.current_employee_id);
        if (currentEmployee) {
          setEmployeeSearch(`${currentEmployee.first_name} ${currentEmployee.last_name}`);
        }
      }
    }
  }, [entity, employees]);

  const handleAccessoryClick = (accessory: VehicleAccessory) => {
    const currentAccessories = [...form.values.accessories];
    const index = currentAccessories.indexOf(accessory);
    if (index === -1) {
      currentAccessories.push(accessory);
    } else {
      currentAccessories.splice(index, 1);
    }
    form.setFieldValue('accessories', currentAccessories);
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.first_name + ' ' + emp.last_name).toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const handleEmployeeSelect = (employee: EmployeeEntity) => {
    form.setFieldValue('current_employee_id', employee.id);
    setEmployeeSearch(`${employee.first_name} ${employee.last_name}`);
    setShowEmployeeDropdown(false);
  };

  return (
    <EntityForm
      className={`${className} vehicle-form`}
      onSubmit={form.handleSubmit}
      id={entity?.id}
      formik={form}
      submitLabel={entity?.id ? 'Forms.UPDATE_VEHICLE' : 'Forms.CREATE_VEHICLE'}
      showActionsAtBoth={true}
    >
      <Container className="px-4 py-3">
        <Row>
          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Vehicle Type</h6>
              <BaseSelect
                className="mb-3"
                name="type"
                label="Type"
                placeholder="Select vehicle type"
                required
                enumType={VehicleType}
                labelPrefix="VehicleType"
                formik={form}
              />
              {form.values.type == VehicleType.OTHER && (
                <BaseInput
                  className="mb-3"
                  name="type_other"
                  label="Other Type"
                  placeholder="Enter other vehicle type"
                  required
                  formik={form}
                />
              )}

              <BaseSelect
                className="mb-3"
                label="Trailer Type"
                name="trailer_type"
                placeholder="Select trailer type"
                enumType={VehicleTrailerType}
                labelPrefix="VehicleTrailerType"
                formik={form}
              />
              {form.values.trailer_type == VehicleTrailerType.OTHER && (
                <BaseInput
                  className="mb-3"
                  name="trailer_type_other"
                  label="Other Trailer Type"
                  placeholder="Enter other trailer type"
                  required
                  formik={form}
                />
              )}

              <BaseSelect
                className="mb-3"
                name="transmission_type"
                label="Transmission"
                placeholder="Select transmission type"
                enumType={VehicleTransmissionType}
                labelPrefix="VehicleTransmissionType"
                formik={form}
              />
            </div>
          </Col>

          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Vehicle Details</h6>
              <BaseInput
                className="mb-3"
                label="Make"
                name="make"
                required
                placeholder="e.g., Ford, Freightliner"
                formik={form}
              />

              <BaseInput
                className="mb-3"
                label="Model"
                name="model"
                placeholder="e.g., F-150, Cascadia"
                formik={form}
              />

              <BaseInput
                className="mb-3"
                label="Year"
                name="year"
                type="int"
                placeholder="e.g., 2020"
                formik={form}
              />

              <BaseVinInput
                className="mb-3"
                label="VIN"
                name="vin"
                placeholder="Enter Vehicle Identification Number"
                formik={form}
              />

              <BaseInput
                className="mb-3"
                label="Unit Number"
                name="unit_number"
                placeholder="Enter Unit Number"
                formik={form}
              />
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Employee Assignment</h6>
              <div className="position-relative">
                <BaseInput
                  className="mb-3"
                  label="Assigned Employee"
                  value={employeeSearch}
                  onChange={(e) => {
                    setEmployeeSearch(e.target.value);
                    setShowEmployeeDropdown(true);
                  }}
                  onFocus={() => setShowEmployeeDropdown(true)}
                  placeholder="Search for an employee..."
                />
                {showEmployeeDropdown && (
                  <div
                    className="employee-dropdown"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      maxHeight: '200px',
                      overflowY: 'auto',
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      zIndex: 1000,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className="employee-option"
                        onClick={() => handleEmployeeSelect(emp)}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #eee',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f5f5f5';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        {emp.first_name} {emp.last_name}
                      </div>
                    ))}
                    {filteredEmployees.length === 0 && (
                      <div style={{ padding: '8px 12px', color: '#666' }}>No employees found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Col>

          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Vehicle Specifications</h6>
              <BaseInput
                className="mb-3"
                label="Tire Size"
                name="tire_size"
                placeholder="e.g., 295/75R22.5"
                formik={form}
              />

              <BaseMilesInput
                className="mb-3"
                label="Odometer Reading"
                name="odometer"
                placeholder="Enter current odometer reading"
                formik={form}
              />

              <BaseTextArea
                className="mb-3 form-text-area"
                label="Additional Details"
                name="other_details"
                rows={3}
                placeholder="Enter any additional vehicle details or notes"
                formik={form}
              />
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Accessories</h6>
              <div className="accessories-grid">
                {Object.values(VehicleAccessory).map((accessory) => (
                  <div
                    key={accessory}
                    className={`accessory-item ${
                      form.values.accessories.includes(accessory) ? 'selected' : ''
                    }`}
                    onClick={() => handleAccessoryClick(accessory)}
                    style={{
                      padding: '12px 16px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      backgroundColor: form.values.accessories.includes(accessory)
                        ? '#f0f9ff'
                        : '#fff',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.values.accessories.includes(accessory)}
                      onChange={() => {}}
                      style={{ margin: 0 }}
                    />
                    <span style={{ flex: 1 }}>{t(`VehicleAccessory.${accessory}`)}</span>
                  </div>
                ))}
              </div>
              {form.values.accessories.includes(VehicleAccessory.OTHER) && (
                <BaseTextArea
                  className="mt-3"
                  label="Other Accessories"
                  name="accessory_other"
                  required
                  rows={3}
                  placeholder="Describe other accessories"
                  formik={form}
                />
              )}
            </div>
          </Col>
          <Col lg={6}>
            <div className="form-section h-100">
              <h6 className="section-title mb-4">Vehicle Photo & Speed</h6>
              <FileInput
                className="mb-4"
                label="Photo"
                name="photo"
                accept="image/*"
                documentType={DocumentType.PHOTO}
                formik={form}
                allowedSizeInByte={3145728}
              />

              <div className="governed-speed-section">
                <BaseCheck
                  className="mb-2"
                  label="Governed Speed"
                  name="is_governed"
                  formik={form}
                />
                {form.values.is_governed && (
                  <BaseInput
                    className="mt-2"
                    label="Max Speed"
                    name="max_speed"
                    min={1}
                    type="int"
                    placeholder="Enter maximum speed"
                    formik={form}
                  />
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <div className="form-section">
              <BaseCheck label="Show vehicle to public users" name="is_public" formik={form} />
            </div>
          </Col>
        </Row>
      </Container>
    </EntityForm>
  );
}

// Add this to your global CSS or component styles
const styles = `
.vehicle-form {
  max-width: 800px;
  margin: 0 auto;
}

.vehicle-form .form-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.vehicle-form .form-control {
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 8px 12px;
}

.vehicle-form .form-control:focus {
  border-color: #2684ff;
  box-shadow: 0 0 0 1px #2684ff;
}

.vehicle-form .form-label {
  font-weight: 500;
  margin-bottom: 8px;
}

.vehicle-form .accessories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

@media (max-width: 768px) {
  .vehicle-form .form-section {
    padding: 16px;
  }
  
  .vehicle-form .accessories-grid {
    grid-template-columns: 1fr;
  }
}
`;

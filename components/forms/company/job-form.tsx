import { PlusCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

import { Button, Col, InputGroup, Row } from 'react-bootstrap';

import { useFormik } from 'formik';
import { useEffect, useState } from 'react';

import { useAuth } from '../../../hooks/use-auth';
import { useTranslation } from '../../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../../hooks/use-unsaved-changes-warning';
import { useEffectAsync } from '../../../utils/react';

import { globalAjaxExceptionHandler } from '../../../utils/ajax';
import { counts, year2Only, year3Only, year5Only, years } from '../../../utils/jobs';
import { BaseFormProps } from './base-form-props';

import EntityForm from '../../layouts/page/entity-form';
import ViewCard from '../../view-details/view-card';
import ViewModal from '../../view-details/view-modal';
import BaseCheck from '../base-check';
import BaseCheckList from '../base-check-list';
import BaseInput from '../base-input';
import BaseRange from '../base-range';
import BaseSelect from '../base-select';
import BaseTextArea from '../base-text-area';
import { LocationForm } from './location-form';

import JobApi from '../../../pages/api/job';
import LocationApi from '../../../pages/api/location';

import { JobBenefits } from '../../../enums/jobs/job-benefits.enum';
import { JobDeliveryType } from '../../../enums/jobs/job-delivery-type.enum';
import { JobDrugTestType } from '../../../enums/jobs/job-drug-test-type.enum';
import { JobEmploymentType } from '../../../enums/jobs/job-employment-type.enum';
import { JobEquipmentType } from '../../../enums/jobs/job-equipment-type.enum';
import { JobGeography } from '../../../enums/jobs/job-geography.enum';
import { JobPayFrequency } from '../../../enums/jobs/job-pay-frequency.enum';
import { JobPayMethod } from '../../../enums/jobs/job-pay-method.enum';
import { JobSchedule } from '../../../enums/jobs/job-schedule.enum';
import { JobTeamDriver } from '../../../enums/jobs/job-team-driver.enum';
import { CriminalHistoryType } from '../../../enums/users/criminal-history-type.enum';
import { DriverEndorsement } from '../../../enums/users/driver-endorsement.enum';
import { DriverLicenseType } from '../../../enums/users/driver-license-type.enum';
import { EducationLevel } from '../../../enums/users/education-level.enum';
import { MvrType } from '../../../enums/users/mvr-type.enum';
import { LocationEntity } from '../../../models/company/location.entity';
import { JobEntity } from '../../../models/job/job.entity';
import { buildAddress } from '../../../utils/common';
import { focusOnErrorField } from '../../../utils/form-error';
import BaseHoursInput from '../base-hours-input';
import BaseMilesInput from '../base-miles-input';
import BaseMoneyInput from '../base-money-input';
import BasePercentInput from '../base-percent-input';
import { BaseListRowControl } from '../lists/base-list-row-control';

export interface JobFormProps extends BaseFormProps<JobEntity> {}

export function JobForm(props: JobFormProps) {
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();

  let { className, entity, onSaveComplete, onSaveError, type } = props;

  const formType = type || 'create';

  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [can, setCan] = useState({
    createLocation: false,
  });

  const form = useFormik({
    initialValues: {
      ...new JobEntity(),
      team_drivers: JobTeamDriver.NO_TEAM_DRIVER,
      min_experience_in_months: 0,
      min_experience_in_years: 0,
    },
    validationSchema: JobEntity.yupSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (data) => {
      setHasAttemptedSubmit(true);
      if (Object.keys(form.errors).length === 0) {
        setShowConfirmationModal(true);
      }
    },
  });

  useEffect(() => {
    form.setValues({
      ...(entity || {}),
      schedule: entity?.schedule,
      pay_method: entity?.pay_method,
      min_weekly_pay: Boolean(entity?.min_weekly_pay) ? entity.min_weekly_pay : null,
      max_weekly_pay: Boolean(entity?.max_weekly_pay) ? entity.max_weekly_pay : null,
      team_drivers: entity?.team_drivers ?? JobTeamDriver.NO_TEAM_DRIVER,
      min_experience_in_months: entity?.min_experience_in_months ?? 0,
      min_experience_in_years: entity?.min_experience_in_years ?? 0,
    });
  }, [entity]);

  useEffect(() => {
    console.log('form.values', form.values);
    console.log('form.errors', form.errors);
  }, [form.values, form.errors]);

  const [locations, setLocations] = useState<LocationEntity[]>([]);

  useEffectAsync(async () => {
    {
      const locationApi = new LocationApi();
      setLocations(await locationApi.list());
    }
    setCan({
      createLocation: hasPermission('CanCreateLocation'),
    });
  }, [user]);

  function handleMaxYearsForMvrRequirementType(e, idx) {
    const { value } = e.target;

    const label = `mvr_requirements[${idx}]`;
    const mvr_requirements = form.values.mvr_requirements[idx];
    let max_years = 5;

    switch (value) {
      case MvrType.DUI:
        max_years = 2;
        break;
      case MvrType.MOVING_VIOLATION_NOT_AT_FAULT:
        max_years = 3;
        break;
      default:
        max_years = 5;
        break;
    }

    form.setFieldValue(label, {
      ...mvr_requirements,
      type: value,
      max_years: max_years,
    });
  }

  function handlePayMethodUpdate(e) {
    const { name, value } = e.target;
    let min_miles = getOrCurrent('min_miles');
    let max_miles = getOrCurrent('max_miles');
    let min_percent = getOrCurrent('min_percent');
    let max_percent = getOrCurrent('max_percent');
    let min_hours = getOrCurrent('min_hours');
    let max_hours = getOrCurrent('max_hours');
    let min_rate = getOrCurrent('min_rate');
    let max_rate = getOrCurrent('max_rate');
    let min_salary = getOrCurrent('min_salary');
    let max_salary = getOrCurrent('max_salary');
    let min_weekly_pay = getOrCurrent('min_weekly_pay');
    let max_weekly_pay = getOrCurrent('max_weekly_pay');

    switch (form.values.pay_method) {
      case JobPayMethod.RATE_PER_MILE:
        min_percent = null;
        max_percent = null;
        min_hours = null;
        max_hours = null;
        min_salary = null;
        max_salary = null;
        min_weekly_pay =
          min_miles >= 0 && min_rate >= 0
            ? parseFloat((min_miles * min_rate).toFixed(2))
            : min_weekly_pay;
        max_weekly_pay =
          max_miles >= 0 && max_rate >= 0
            ? parseFloat((max_miles * max_rate).toFixed(2))
            : max_weekly_pay;
        break;
      case JobPayMethod.PERCENT_PER_MOVE:
      case JobPayMethod.PERCENT_PER_WEIGHT:
        min_miles = null;
        max_miles = null;
        min_hours = null;
        max_hours = null;
        min_rate = null;
        max_rate = null;
        min_salary = null;
        max_salary = null;
        break;
      case JobPayMethod.HOURLY:
        min_miles = null;
        max_miles = null;
        min_percent = null;
        max_percent = null;
        min_salary = null;
        max_salary = null;
        min_weekly_pay =
          min_hours >= 0 && min_rate >= 0
            ? parseFloat((min_hours * min_rate).toFixed(2))
            : min_weekly_pay;
        max_weekly_pay =
          max_hours >= 0 && max_rate >= 0
            ? parseFloat((max_hours * max_rate).toFixed(2))
            : max_weekly_pay;
        break;
      case JobPayMethod.SET_WEEKLY:
        /*
                                        -if set weekly		
                                            Estimated maximum weekly pay	(manual entry)
                                            Estimated minimum weekly pay	(manual entry)
                                        */
        min_miles = null;
        max_miles = null;
        min_percent = null;
        max_percent = null;
        min_hours = null;
        max_hours = null;
        min_rate = null;
        max_rate = null;
        min_salary = null;
        max_salary = null;
        break;
      case JobPayMethod.SALARY:
        /*
                                        -if salaried		
                                            Min annual salary	
                                            Max annual salary	
                                            Estimated maximum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                                            Estimated minimum weekly pay	(automatically calculates. Asks user if this looks correct? If not, allows user to modify)
                                        */
        min_miles = null;
        max_miles = null;
        min_percent = null;
        max_percent = null;
        min_hours = null;
        max_hours = null;
        min_rate = null;
        max_rate = null;
        min_weekly_pay =
          min_salary >= 0 ? parseFloat((min_salary / 52).toFixed(2)) : min_weekly_pay;
        max_weekly_pay =
          max_salary >= 0 ? parseFloat((max_salary / 52).toFixed(2)) : min_weekly_pay;
        break;
      case JobPayMethod.OPEN_TO_NEGOTIATE:
        min_weekly_pay = null;
        max_weekly_pay = null;
    }

    form.setValues({
      ...form.values,
      min_miles: min_miles,
      max_miles: max_miles,
      min_salary: min_salary,
      max_salary: max_salary,
      min_rate: min_rate,
      max_rate: max_rate,
      min_hours: min_hours,
      max_hours: max_hours,
      min_percent: min_percent,
      max_percent: max_percent,
      min_weekly_pay: min_weekly_pay,
      max_weekly_pay: max_weekly_pay,
    });

    function getOrCurrent(field) {
      const v = name == field ? value : form.values[field];
      if (v != null && v != '') return parseFloat(v);
      // return v;
    }
  }

  function addRequiredSkills(e) {
    e.preventDefault();
    const requiredSkills = form.values.required_skills || [];
    form.setValues({
      ...form.values,
      required_skills: [
        ...requiredSkills,
        {
          type: null,
          years: null,
        },
      ],
    });
  }

  function removeRequiredSkill(idx, e) {
    e.preventDefault();

    form.setValues({
      ...form.values,
      required_skills: form.values.required_skills.filter((v, i) => i != idx),
    });
  }

  function addRequiredEquipment(e) {
    e.preventDefault();
    form.setValues({
      ...form.values,
      required_equipment: [
        ...(form?.values?.required_equipment || []),
        {
          type: null,
          quantity: null,
        },
      ],
    });
  }

  function removeRequiredEquipment(e) {
    e.preventDefault();

    const { name } = e.target;
    form.setValues({
      ...form.values,
      required_equipment: form.values.required_equipment.filter((v, i) => i != name),
    });
  }

  function addMvrRequirement(e) {
    e.preventDefault();
    const MvrRequirements = form.values.mvr_requirements || [];
    form.setValues({
      ...form.values,
      mvr_requirements: [
        ...MvrRequirements,
        {
          type: null,
          max_count: 0,
          max_years: 0,
        },
      ],
    });
  }

  function removeMvrRequirement(idx, e) {
    e.preventDefault();

    form.setValues({
      ...form.values,
      mvr_requirements: form.values.mvr_requirements.filter((v, i) => i != idx),
    });
  }

  function addCriminalHistoryRequirement(e) {
    e.preventDefault();
    const criminalHistory = form.values.criminal_history || [];
    form.setValues({
      ...form.values,
      criminal_history: [
        ...criminalHistory,
        {
          type: null,
          max_count: 0,
          max_years: 0,
        },
      ],
    });
  }

  function removeCriminalHistoryRequirement(idx, e) {
    e.preventDefault();

    form.setValues({
      ...form.values,
      criminal_history: form.values.criminal_history.filter((v, i) => i != idx),
    });
  }

  const maxRadius = {
    [JobGeography.LOCAL]: 100,
    [JobGeography.REGIONAL]: 1500,
    [JobGeography.OTR]: 3000,
  };

  const onGeographyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    form.setValues({
      ...form.values,
      geography: value as JobGeography,
      max_applicant_radius: maxRadius[value],
    });
  };

  const [createLocation, setCreateLocation] = useState(false);

  const onLocationAdded = (location: LocationEntity) => {
    form.setFieldValue(`location.id`, location.id);
    setLocations([...locations, location]);
    setCreateLocation(false);
  };

  const handleConfirmClick = async () => {
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const jobApi = new JobApi();
      let job = null;
      const dto = {
        ...form.values,
      };
      // If expiry_date is provided, convert to ISO string, otherwise set to null for never expire
      if (dto.expiry_date) {
        dto.expiry_date = new Date(dto.expiry_date).toISOString();
      } else {
        dto.expiry_date = null;
      }
      // if (dto.orientation_start_at) dto.orientation_start_at = new Date(dto.orientation_start_at).toISOString();
      // if (dto.orientation_end_at) dto.orientation_end_at = new Date(dto.orientation_end_at).toISOString();
      if (dto.min_experience_in_months) {
        dto.min_experience_in_years += dto.min_experience_in_months / 12;
      }

      if (dto.orientation?.location?.id == null) {
        delete dto.orientation;
      }
      dto.min_years_experience = dto.min_experience_in_years
        ? parseFloat(dto.min_experience_in_years?.toFixed(2))
        : 0;

      if (entity?.id) {
        job = await jobApi.update(entity.id, dto);
      } else {
        job = await jobApi.create(dto);
        // Navigate to the post page and pass the URL as a prop
        // router.push({ pathname: '/dashboard/company/jobs/thank-you/', query: { id: job.id } });
      }

      setShowConfirmationModal(false);

      toast.success(
        t(
          'Forms.SUCCESS_{action}_{name}',
          {
            action: !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATED',
            name: 'JOB',
          },
          { translateProps: true }
        )
      );
      // Reset dirty state after successful save to prevent unsaved changes warning
      form.resetForm({ values: job });
      if (onSaveComplete) onSaveComplete(job);
    } catch (e) {
      console.error('Unable to save job', e);
      globalAjaxExceptionHandler(e, {
        formik: form,
        t: t,
        toast: toast,
        defaultMessage: t(
          'Forms.FAIL_{action}_{name}',
          {
            action: !!entity?.id ? 'Forms.UPDATED' : 'Forms.CREATED',
            name: 'JOB',
          },
          { translateProps: true }
        ),
      });
      if (onSaveError) onSaveError(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => focusOnErrorField(form), [form.submitCount]);

  // Only show errors if the field has been touched or form submission was attempted
  const shouldShowError = (fieldName: string) => {
    return (hasAttemptedSubmit || form.touched[fieldName]) && form.errors[fieldName];
  };

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: form.dirty,
    shouldWarn: !isSubmitting,
  });

  return (
    <>
      {unsavedChangesWarning}
      <EntityForm
        className={className}
        onSubmit={form.handleSubmit}
        id={entity?.id}
        formik={form}
        showActionsAtBoth={true}
        actionButtonDown={true}
        submitLabel={formType == 'create' ? t('Forms.ADD_JOB') : t('Forms.UPDATE_JOB')}
      >
        <Row className="mt-1">
          <Col md="6" lg="6" xl="6" className="p-0 px-lg-2">
            <ViewCard title="basic_details">
              <BaseInput
                className="col-12 p-0 px-lg-2"
                label="title"
                required
                name="title"
                displayPlaceholder
                formik={form}
                error={shouldShowError('title') ? form.errors.title : undefined}
              />
              <BaseSelect
                className="col-12 p-0 px-lg-2"
                label="location"
                name="location.id"
                required
                displayPlaceholder
                formik={form}
                valueKey="id"
                createLabel={(v) => buildAddress(v)}
                options={locations}
                append={
                  <Button
                    variant="btn create_btn"
                    disabled={!can.createLocation}
                    onClick={() => setCreateLocation(true)}
                  >
                    <PlusCircle /> {t('CREATE')}
                  </Button>
                }
              />
              <BaseInput
                className="col-12 p-0 px-lg-2"
                label="expiration_date"
                name="expiry_date"
                displayPlaceholder
                type="date"
                min={new Date().toISOString().split('T')[0]}
                placeholder="Leave empty for no expiration"
                formik={form}
              />
              <BaseInput
                className="col-12 p-0 px-lg-2"
                label="drivers_needed"
                name="drivers_needed"
                displayPlaceholder
                type="int"
                min="0"
                formik={form}
              />
              <BaseSelect
                className="col-12 p-0 px-lg-2"
                label="GEOGRAPHY"
                displayPlaceholder
                name="geography"
                required
                formik={form}
                onChange={onGeographyChange}
                labelPrefix="JobGeography"
                enumType={JobGeography}
              />
              {form.values.geography && (
                <BaseRange
                  className="col-12 p-0 px-lg-2 fire-fox-cls"
                  label="max_applicant_radius"
                  name="max_applicant_radius"
                  valueSuffix="mi"
                  required
                  min={1}
                  max={maxRadius[form.values.geography]}
                  formik={form}
                />
              )}

              <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <BaseSelect
                  className={`col-${
                    form.values.schedule == JobSchedule.OTHER ? 6 : 12
                  } p-0 px-lg-2`}
                  label="SCHEDULE"
                  name="schedule"
                  required
                  displayPlaceholder
                  labelPrefix="JobSchedule"
                  enumType={JobSchedule}
                  formik={form}
                />
                {form.values.schedule == JobSchedule.OTHER && (
                  <BaseInput
                    className="col-6"
                    label="other_schedule"
                    required
                    name="schedule_other"
                    displayPlaceholder
                    formik={form}
                  />
                )}
              </Row>
              <BaseSelect
                className="col-12 p-0 px-lg-2"
                label="EMPLOYMENT_TYPE"
                name="employment_type"
                required
                displayPlaceholder
                labelPrefix="JobEmploymentType"
                enumType={JobEmploymentType}
                formik={form}
              />
              <BaseCheckList
                className="col-12 p-0 px-lg-2"
                label="EQUIPMENT_TYPE"
                name="equipment_type"
                cols={2}
                labelPrefix="JobEquipmentType"
                enumType={JobEquipmentType}
                formik={form}
              />
              {form.values.equipment_type?.includes(JobEquipmentType.OTHER) && (
                <BaseInput
                  className="col-12 p-0 px-lg-2"
                  required
                  label="other_equipment_type"
                  name="equipment_type_other"
                  displayPlaceholder
                  formik={form}
                />
              )}
              <BaseCheckList
                className="col-12 p-0 px-lg-2"
                label="DELIVERY_TYPE"
                name="delivery_type"
                cols={2}
                labelPrefix="JobDeliveryType"
                enumType={JobDeliveryType}
                formik={form}
              />
              <BaseSelect
                className="col-12 p-0 px-lg-2"
                label="TEAM_DRIVERS"
                name="team_drivers"
                labelPrefix="JobTeamDriver"
                enumType={JobTeamDriver}
                formik={form}
              />
            </ViewCard>
          </Col>
          <Col md="6" lg="6" xl="6" className="p-0 px-lg-2">
            <ViewCard title="BENEFITS">
              <BaseSelect
                className="col-12 p-0 px-lg-2 mb-2"
                label="PAY_FREQUENCY"
                name="pay_frequency"
                displayPlaceholder
                formik={form}
                labelPrefix="JobPayFrequency"
                enumType={JobPayFrequency}
              />
              <BaseSelect
                className="col-12 p-0 px-lg-2"
                label="PAY_METHOD"
                name="pay_method"
                required
                displayPlaceholder
                labelPrefix="JobPayMethod"
                enumType={JobPayMethod}
                formik={form}
              />
              {(form.values.pay_method == JobPayMethod.PERCENT_PER_MOVE ||
                form.values.pay_method == JobPayMethod.PERCENT_PER_WEIGHT) && (
                <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <BasePercentInput
                    className="col-6"
                    label="min_percent"
                    name="min_percent"
                    required
                    placeholder="10"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                  <BasePercentInput
                    className="col-6"
                    label="max_percent"
                    name="max_percent"
                    required
                    placeholder="20"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                </Row>
              )}
              {form.values.pay_method == JobPayMethod.RATE_PER_MILE && (
                <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <BaseMilesInput
                    className="col-6"
                    label="min_miles"
                    name="min_miles"
                    required
                    placeholder="1500"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                  <BaseMilesInput
                    className="col-6"
                    label="max_miles"
                    name="max_miles"
                    required
                    placeholder="3000"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                </Row>
              )}
              {form.values.pay_method == JobPayMethod.HOURLY && (
                <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <BaseHoursInput
                    className="col-6"
                    label="min_hours"
                    name="min_hours"
                    required
                    placeholder="3"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                  <BaseHoursInput
                    className="col-6"
                    label="max_hours"
                    name="max_hours"
                    required
                    placeholder="5"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                </Row>
              )}
              {(form.values.pay_method == JobPayMethod.RATE_PER_MILE ||
                form.values.pay_method == JobPayMethod.HOURLY) && (
                <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <BaseMoneyInput
                    className="col-6"
                    label="min_rate"
                    name="min_rate"
                    required
                    placeholder="0.50"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                  <BaseMoneyInput
                    className="col-6"
                    label="max_rate"
                    name="max_rate"
                    required
                    placeholder="0.70"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                </Row>
              )}
              {form.values.pay_method == JobPayMethod.SALARY && (
                <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <BaseMoneyInput
                    className="col-6"
                    label="min_salary"
                    name="min_salary"
                    required
                    placeholder="50000.00"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                  <BaseMoneyInput
                    className="col-6"
                    label="max_salary"
                    name="max_salary"
                    placeholder="60000.00"
                    onChange={handlePayMethodUpdate}
                    formik={form}
                  />
                </Row>
              )}
              <Row style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                <BaseMoneyInput
                  className="col-md-6 p-0 px-lg-2"
                  label="min_weekly"
                  name="min_weekly_pay"
                  required
                  placeholder="1000.00"
                  formik={form}
                />
                <BaseMoneyInput
                  className="col-md-6 p-0 px-lg-2"
                  label="max_weekly"
                  name="max_weekly_pay"
                  required
                  placeholder="2000.00"
                  formik={form}
                />
              </Row>
              {/* todo: add job pay information */}
              <BaseCheckList
                className="col-12 p-0 px-lg-2"
                label="BENEFITS"
                name="benefits"
                cols={2}
                labelPrefix="JobBenefits"
                enumType={JobBenefits}
                formik={form}
              />
              {form.values.benefits?.includes(JobBenefits.OTHER) && (
                <BaseInput
                  className="col-12 p-0 px-lg-2"
                  label="additional_benefits"
                  name="benefits_other"
                  required
                  displayPlaceholder
                  formik={form}
                />
              )}
            </ViewCard>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="p-0 px-lg-2">
            <ViewCard title="DESCRIPTION">
              <Row>
                <BaseTextArea
                  className="col-md-12"
                  name="description"
                  required
                  rows={3}
                  maxLength={1500}
                  displayPlaceholder
                  formik={form}
                />
              </Row>
            </ViewCard>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col className="p-0 px-lg-2">
            <ViewCard title="requirements">
              <Row>
                <Col md="6">
                  <BaseSelect
                    className="col-12"
                    label="MINIMUM_CDL_CLASS"
                    name="cdl_class"
                    labelPrefix="DriverLicenseType"
                    required
                    displayPlaceholder
                    enumType={DriverLicenseType}
                    formik={form}
                  />
                  <Row className="mt-1 p-3 ">
                    <Col>
                      <label>{t('MIN_YEARS_EXPERIENCE')}</label>
                      <InputGroup className="flex-nowrap rounded d-block">
                        <BaseInput
                          className="col-md-6 d-inline-block p-0 mb-2"
                          placeholder="5"
                          name={`min_experience_in_years`}
                          required
                          min="0"
                          type="int"
                          append={<InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>}
                          formik={form}
                        />
                        <BaseInput
                          className="col-md-6 d-inline-block p-0"
                          placeholder="5"
                          name={`min_experience_in_months`}
                          required
                          min="0"
                          max="11"
                          type="int"
                          append={<InputGroup.Text>{t('MONTHS_SHORT')}</InputGroup.Text>}
                          formik={form}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <BaseSelect
                    className="col-12"
                    label="min_degree"
                    name="min_degree"
                    displayPlaceholder
                    labelPrefix="EducationLevel"
                    enumType={EducationLevel}
                    formik={form}
                  />
                  <Col xs="12" className="mt-2">
                    <ViewCard
                      title="REQUIRED_SKILLS"
                      titleAs="span"
                      variant="secondary"
                      actions={
                        <Button variant="primary" size="sm" onClick={addRequiredSkills}>
                          <PlusCircle /> {t('ADD')}
                        </Button>
                      }
                    >
                      {form.values.required_skills?.length > 0 &&
                        form.values.required_skills.map((v, i) => (
                          <BaseListRowControl
                            key={i}
                            index={i}
                            onRemoveClick={(idx, e) => removeRequiredSkill(idx, e)}
                          >
                            <BaseSelect
                              className="mx-1"
                              placeholder="TYPE"
                              name={`required_skills.${i}.type`}
                              required
                              labelPrefix="JobEquipmentType"
                              enumType={JobEquipmentType}
                              formik={form}
                            />
                            <BaseInput
                              className="mr-1"
                              placeholder="5"
                              name={`required_skills.${i}.years`}
                              required
                              min="0"
                              type="int"
                              append={<InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>}
                              formik={form}
                            />
                            <BaseInput
                              className="mr-1"
                              placeholder="5"
                              name={`required_skills.${i}.months`}
                              required
                              min="0"
                              max="11"
                              type="int"
                              append={<InputGroup.Text>{t('MONTHS_SHORT')}</InputGroup.Text>}
                              formik={form}
                            />
                          </BaseListRowControl>
                        ))}
                    </ViewCard>
                  </Col>
                  <BaseTextArea
                    className="col-12"
                    label="other_required_skills"
                    name="required_skills_other"
                    displayPlaceholder
                    rows={1}
                    formik={form}
                  />
                  {form.values.employment_type === JobEmploymentType.OWNER_OPERATOR && (
                    <Col xs="12" className="mt-1">
                      <ViewCard
                        title="REQUIRED_EQUIPMENT"
                        variant="secondary"
                        titleAs="span"
                        actions={
                          <Button variant="primary" size="sm" onClick={addRequiredEquipment}>
                            <PlusCircle /> {t('ADD')}
                          </Button>
                        }
                      >
                        {form.values.required_equipment?.length > 0 &&
                          form.values.required_equipment.map((v, i) => (
                            <BaseListRowControl
                              key={i}
                              index={i}
                              onRemoveClick={(idx, e) => removeRequiredEquipment(e)}
                            >
                              <BaseSelect
                                className="mx-1"
                                placeholder={t(
                                  'SELECT_{name}',
                                  { name: 'TYPE' },
                                  { translateProps: true }
                                )}
                                name={`required_equipment.${i}.type`}
                                required
                                labelPrefix="JobEquipmentType"
                                enumType={JobEquipmentType}
                                formik={form}
                              />
                              <BaseInput
                                className="mr-1"
                                placeholder="QUANTITY"
                                name={`required_equipment.${i}.quantity`}
                                required
                                min="1"
                                type="int"
                                formik={form}
                              />
                            </BaseListRowControl>
                          ))}
                      </ViewCard>
                    </Col>
                  )}
                  <BaseCheckList
                    className="col-12"
                    label="special_endorsements"
                    name="required_endorsement"
                    cols={2}
                    labelPrefix="DriverEndorsement"
                    enumType={DriverEndorsement}
                    formik={form}
                  />
                </Col>

                <Col md="6">
                  <BaseCheckList
                    className="col-12"
                    label="drug_test_type"
                    name="drug_test_type"
                    cols={2}
                    labelPrefix="JobDrugTestType"
                    enumType={JobDrugTestType}
                    formik={form}
                  />

                  <BaseCheck
                    className="col-12"
                    label="must_have_clean_mvr"
                    name="must_have_clean_mvr"
                    formik={form}
                  />
                  {!form.values.must_have_clean_mvr && (
                    <Col className="mt-1" xs="12">
                      <ViewCard
                        title="MVR_REQUIREMENTS"
                        variant="secondary"
                        titleAs="span"
                        actions={
                          <Button variant="primary" size="sm" onClick={addMvrRequirement}>
                            <PlusCircle /> {t('ADD')}
                          </Button>
                        }
                      >
                        {form.values.mvr_requirements?.length > 0 && (
                          <>
                            <Row>
                              <Col className="offset-1" xs="3">
                                {t('MAX')}
                              </Col>
                              <Col xs="4">{t('TYPE')}</Col>
                              <Col xs="3">{t('within')}</Col>
                            </Row>
                            {form.values.mvr_requirements.map((v, i) => (
                              <BaseListRowControl
                                key={i}
                                index={i}
                                onRemoveClick={(idx, e) => removeMvrRequirement(idx, e)}
                              >
                                <BaseSelect
                                  className="mx-1 col-3"
                                  placeholder={t(
                                    'SELECT_{name}',
                                    { name: 'MAX' },
                                    { translateProps: true }
                                  )}
                                  name={`mvr_requirements.${i}.max_count`}
                                  required
                                  value={v.max_count}
                                  options={counts}
                                  formik={form}
                                />
                                <BaseSelect
                                  className="mr-1 col-4"
                                  placeholder="TYPE"
                                  name={`mvr_requirements.${i}.type`}
                                  required
                                  labelPrefix="MvrType"
                                  enumType={MvrType}
                                  onChange={(e) => handleMaxYearsForMvrRequirementType(e, i)}
                                  formik={form}
                                />
                                <BaseSelect
                                  className="mr-1 col-3"
                                  name={`mvr_requirements.${i}.max_years`}
                                  required
                                  value={v.max_years}
                                  options={(() => {
                                    switch (form.values.mvr_requirements[i].type) {
                                      case MvrType.DUI:
                                        return year2Only;
                                      case MvrType.MOVING_VIOLATION_NOT_AT_FAULT:
                                        return year3Only;
                                      default:
                                        return year5Only;
                                    }
                                  })()}
                                  append={<InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>}
                                  formik={form}
                                />
                              </BaseListRowControl>
                            ))}
                          </>
                        )}
                      </ViewCard>
                    </Col>
                  )}
                  <BaseCheck
                    className="col-12"
                    label="accept_sap_graduates"
                    name="accept_sap_graduates"
                    formik={form}
                  />
                  <BaseCheck
                    className="col-12"
                    label="no_criminal_history"
                    name="must_have_clean_criminal_history"
                    formik={form}
                  />
                  {!form.values.must_have_clean_criminal_history && (
                    <Col className="mt-1" xs="12">
                      <ViewCard
                        title="CRIMINAL_HISTORY"
                        titleAs="span"
                        variant="secondary"
                        actions={
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={addCriminalHistoryRequirement}
                          >
                            <PlusCircle /> {t('ADD')}
                          </Button>
                        }
                      >
                        {form.values.criminal_history?.length > 0 && (
                          <>
                            <Row>
                              <Col className="offset-1" xs="3">
                                {t('MAX')}
                              </Col>
                              <Col xs="4">{t('TYPE')}</Col>
                              <Col xs="3">{t('within')}</Col>
                            </Row>
                            {form.values.criminal_history.map((v, i) => (
                              <BaseListRowControl
                                key={i}
                                index={i}
                                onRemoveClick={(idx, e) => removeCriminalHistoryRequirement(idx, e)}
                              >
                                <BaseSelect
                                  className="mx-1 col-3"
                                  name={`criminal_history.${i}.max_count`}
                                  required
                                  placeholder="MAX"
                                  options={counts}
                                  formik={form}
                                />
                                <BaseSelect
                                  className="mr-1 col-4"
                                  placeholder="TYPE"
                                  name={`criminal_history.${i}.type`}
                                  required
                                  labelPrefix="CriminalHistoryType"
                                  enumType={CriminalHistoryType}
                                  formik={form}
                                />
                                <BaseSelect
                                  className="mr-1 col-3"
                                  name={`criminal_history.${i}.max_years`}
                                  required
                                  options={years}
                                  append={
                                    form.getFieldMeta(`criminal_history.${i}.max_years`)?.value >
                                      0 && <InputGroup.Text>{t('YEARS_SHORT')}</InputGroup.Text>
                                  }
                                  formik={form}
                                />
                              </BaseListRowControl>
                            ))}
                          </>
                        )}
                      </ViewCard>
                    </Col>
                  )}
                  <BaseTextArea
                    className="col-12"
                    label="other_safety_requirements"
                    name="safety_requirements_other"
                    displayPlaceholder
                    rows={1}
                    formik={form}
                  />
                  <BaseCheck
                    className="col-12 mt-2"
                    label="Job Orientation"
                    name="is_orientation_needed"
                    formik={form}
                  />

                  {form.values.is_orientation_needed && (
                    <Col className="mt-2" xs="12">
                      <ViewCard title="ORIENTATION_DETAILS" titleAs="span" variant="secondary">
                        <Row className="m-1">
                          <BaseSelect
                            className="col-12 p-0"
                            label="location"
                            name="orientation.location.id"
                            // required
                            displayPlaceholder
                            formik={form}
                            valueKey="id"
                            createLabel={(v) => buildAddress(v)}
                            options={locations}
                            append={
                              <Button
                                variant="outline-secondary create_btn"
                                disabled={!can.createLocation}
                                onClick={() => setCreateLocation(true)}
                              >
                                <PlusCircle /> {t('CREATE')}
                              </Button>
                            }
                          />
                        </Row>
                        <Row className="mx-1 my-3">
                          <BaseInput
                            className="col-md-6 p-0"
                            label="START_DATE"
                            name="orientation.start_datetime"
                            displayPlaceholder
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            formik={form}
                          />
                          <BaseInput
                            className="col-md-6 mt-2 m-lg-0 p-0"
                            label="END_DATE"
                            name="orientation.end_datetime"
                            placeholder="END_DATE"
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            formik={form}
                          />
                        </Row>
                      </ViewCard>
                    </Col>
                  )}
                </Col>
              </Row>
            </ViewCard>
          </Col>
        </Row>
      </EntityForm>
      <ViewModal
        title={t('CREATE_{name}', { name: 'TERMINAL' }, { translateProps: true })}
        show={createLocation}
        onCloseClick={() => setCreateLocation(false)}
      >
        <LocationForm onSaveComplete={onLocationAdded} />
      </ViewModal>
      <ViewModal
        title="CONFIRMATION"
        show={showConfirmationModal}
        onCloseClick={isSubmitting ? undefined : () => setShowConfirmationModal(false)}
        footer={
          <button
            type="button"
            className="btn btn-primary w-100 p-lg-3 p-5 mx-2"
            onClick={handleConfirmClick}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {t('PROCESSING')}...
              </>
            ) : (
              t('CONFIRM')
            )}
          </button>
        }
      >
        <p className="m-3">{t('JOB_CREATION_CONFIRMATION')}</p>
      </ViewModal>
    </>
  );
}

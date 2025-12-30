import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { PlusCircle, Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { VehicleTransmissionType } from '../../../../enums/vehicles/vehicle-transmission-type.enum';
import { DriverEndorsement } from '../../../../enums/users/driver-endorsement.enum';
import { LicenseRestrictions } from '../../../../enums/applicants/applicant-license-restrictions-type.enum';
import { JobEquipmentType } from '../../../../enums/jobs/job-equipment-type.enum';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { ApplicantExperienceEntity } from '../../../../models/applicant';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { DocumentEntity } from '../../../../models/documents/document.entity';
import { CdlExtras } from '../../../../models/jot-form/long-form/cdl-object/index.dto';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { FormActions } from '../form-buttons';
import { Input, Select, CheckboxGroup, EquipmentCard, Button, MaskedInput, DocumentCard, Checkbox } from '../../../shared/dha';
import BaseSelect from '../../base-select';
import FileInput from '../../file-input';
import { CameraComponent } from './camera';
import ViewModal from '../../../view-details/view-modal';
import ViewPdf from '../../../view-details/view-pdf';
import DocumentApi from '../../../../pages/api/document';
import { getCDLFormat } from '../../../../utils/cdl-formats';
import stateList from '../../../../utils/stateList';
import {
  DRIVER_LICENSE_SIZE_LIMIT,
  getFileSizeLimitDescription,
} from '../../../../constants/file-upload.constants';

const useScreenSize = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isSmallScreen;
};

export function CombinedLicenseEdit() {
  const {
    state: { applicant, applicantExtras, steps },
    method: { setApplicant, stepNext, stepBack, setApplicantExtras, updateApplicantExtras },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedIssuedState, setSelectedIssuedState] = useState<string>(applicant?.license_state || '');
  const [additionalLicenses, setAdditionalLicenses] = useState<CdlExtras[]>([]);
  const [viewDoc, setViewDoc] = useState('');
  const isSmallScreen = useScreenSize();

  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

  const cdlFormat = getCDLFormat(selectedIssuedState);

  const isDriverLicense = (v: DocumentEntity): boolean =>
    v?.type == ApplicantDocumentType.DRIVER_LICENSE;

  const isNotDriverLicense = (v: DocumentEntity): boolean =>
    v?.type != ApplicantDocumentType.DRIVER_LICENSE;

  const validationSchema = yup.object({
    // Step 4 fields
    license_type: yup.string().required().nullable(),
    years_cdl_experience: yup.number().min(0).max(99).required().nullable(),

    // Step 13 fields
    license_number: yup.string().required().nullable(),
    license_state: yup.string().required().nullable(),
    license_expiry: yup.date().required().nullable(),

    // Step 6 fields
    transmission_type: yup.array().nullable(),
    endorsements: yup.array().nullable(),
    endorsements_other: yup.string().when('endorsements', {
      is: (v) => v && v.includes(DriverEndorsement.OTHER),
      then: yup.string().required(),
    }).nullable(),
    license_restrictions: yup.array().nullable(),
    license_restrictions_other: yup.string().when('license_restrictions', {
      is: (v) => v && v.includes(LicenseRestrictions.OTHER),
      then: yup.string().required(),
    }).nullable(),

    // Step 7 fields
    equipment_experience: yup.array().nullable(),

    // Step 14 fields
    document: yup.object().nullable(),
    mediaOptions: yup.boolean(),
  });

  const form = useFormik({
    initialValues: {
      // Step 4
      license_type: applicant?.license_type || null,
      years_cdl_experience: applicant?.years_cdl_experience || null,

      // Step 13
      license_number: applicant?.license_number || '',
      license_state: applicant?.license_state || '',
      license_expiry: applicant?.license_expiry || '',

      // Step 6
      transmission_type: applicant?.transmission_type || [],
      endorsements: applicant?.endorsements || [],
      endorsements_other: applicant?.endorsements_other || null,
      license_restrictions: applicant?.license_restrictions || [],
      license_restrictions_other: applicant?.license_restrictions_other || null,

      // Step 7
      equipment_experience: applicant?.equipment_experience || [],

      // Step 14
      document: applicant?.documents?.find(isDriverLicense) || {
        ...new DocumentEntity(),
        type: ApplicantDocumentType.DRIVER_LICENSE,
      },
      mediaOptions: false,
    },
    validationSchema,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const {
        license_type,
        years_cdl_experience,
        license_number,
        license_state,
        license_expiry,
        transmission_type,
        endorsements,
        endorsements_other,
        license_restrictions,
        license_restrictions_other,
        equipment_experience,
        document,
      } = values;

      // Prepare documents array
      let documents: DocumentEntity[] = applicant?.documents?.filter(isNotDriverLicense) || [];
      if (document?.file_base64) {
        documents = [...documents, { ...document }];
      }

      const updatedApplicant = {
        ...applicant,
        license_type,
        years_cdl_experience,
        license_number,
        license_state,
        license_expiry,
        transmission_type,
        endorsements,
        endorsements_other,
        license_restrictions,
        license_restrictions_other,
        equipment_experience,
        documents,
      };

      setApplicant(updatedApplicant);

      // Handle additional CDL licenses
      try {
        const hasValidLicenses =
          additionalLicenses &&
          additionalLicenses.length > 0 &&
          additionalLicenses.some(
            (license) =>
              license.license_number?.trim() &&
              license.state?.trim() &&
              (typeof license.date === 'string' ? license.date.trim() : license.date)
          );

        if (hasValidLicenses) {
          const cdlExtrasEntity = new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER);
          cdlExtrasEntity.value = additionalLicenses;
          updateApplicantExtras(cdlExtrasEntity);
        } else {
          setApplicantExtras(
            (prev) => prev?.filter((extra) => extra.type !== ApplicantExtras.CDL_NUMBER) || []
          );
        }
      } catch (error) {
        console.error('Error submitting additional licenses:', error);
      }

      saveFormData({
        applicant: updatedApplicant,
      });

      stepNext();
    },
    onReset: () => {
      stepBack();
    },
  });

  // Load additional licenses from applicantExtras
  useEffect(() => {
    const apx_cdl = applicantExtras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER);
    if (apx_cdl?.value && Array.isArray(apx_cdl.value)) {
      setAdditionalLicenses(apx_cdl.value);
    }
  }, [applicantExtras]);

  // Update selectedIssuedState when license_state changes
  useEffect(() => {
    if (form.values.license_state) {
      setSelectedIssuedState(form.values.license_state);
    }
  }, [form.values.license_state]);

  // Check form validity
  useEffect(() => {
    const hasNoErrors = Object.keys(form.errors).length === 0;

    let additionalLicensesValid = true;
    if (additionalLicenses.length > 0) {
      additionalLicensesValid = additionalLicenses.every(
        (license) =>
          !!license.license_number &&
          !!license.state &&
          (typeof license.date === 'string' ? !!license.date : !!license.date)
      );
    }

    setIsFormValid(hasNoErrors && additionalLicensesValid);
  }, [form.values, form.errors, additionalLicenses]);

  const handleNext = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleSubmit(syntheticEvent);
  };

  const handleBack = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: {},
    } as any;
    form.handleReset(syntheticEvent);
  };

  const handleIssuedStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    if (newState !== selectedIssuedState) {
      setSelectedIssuedState(newState);
      form.setFieldValue('license_state', newState);
      form.setFieldValue('license_number', '');
    } else {
      form.setFieldValue('license_state', newState);
    }
  };

  const handleLicenseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    form.setFieldValue('license_number', uppercaseValue);
  };

  const handleTransmissionChange = (values: string[]) => {
    form.setFieldValue('transmission_type', values);
  };

  const handleEndorsementsChange = (values: string[]) => {
    form.setFieldValue('endorsements', values);
  };

  const handleLicenseRestrictionsChange = (values: string[]) => {
    form.setFieldValue('license_restrictions', values);
  };

  const addEquipmentExperience = () => {
    form.setFieldValue('equipment_experience', [
      ...(form.values?.equipment_experience || []),
      new ApplicantExperienceEntity(),
    ]);
  };

  const removeEquipmentExperience = (index: number) => {
    const newExperiences = form.values?.equipment_experience?.filter((_, idx) => idx !== index);
    form.setFieldValue('equipment_experience', newExperiences);
  };

  const addCDLLicense = () => {
    setAdditionalLicenses([...additionalLicenses, new CdlExtras()]);
  };

  const removeCDLLicense = (index: number) => {
    const newLicenses = additionalLicenses.filter((_, idx) => idx !== index);
    setAdditionalLicenses(newLicenses);
  };

  const handleLicenseFieldChange = (index: number, field: keyof CdlExtras, value: string) => {
    const newLicenses = [...additionalLicenses];
    newLicenses[index][field] = value;
    setAdditionalLicenses(newLicenses);
  };

  const handleAdditionalLicenseNumberChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    const newLicenses = [...additionalLicenses];
    newLicenses[index].license_number = uppercaseValue;
    setAdditionalLicenses(newLicenses);
  };

  const handleRemoveDocument = () => {
    form.setFieldValue('document', {
      ...new DocumentEntity(),
      type: ApplicantDocumentType.DRIVER_LICENSE,
    });

    if (applicant?.documents) {
      const documentsWithoutLicense = applicant.documents.filter(isNotDriverLicense);
      setApplicant({
        ...applicant,
        documents: documentsWithoutLicense,
      });
    }

    handleApplicantExtrasCleanup();
  };

  const handleApplicantExtrasCleanup = () => {
    if (setApplicantExtras) {
      setApplicantExtras(
        (prev) => prev?.filter((extra) => extra.type !== ApplicantExtras.CDL_NUMBER) || []
      );
    }
  };

  const handleViewDocument = async () => {
    const doc = applicant?.documents?.find(isDriverLicense);
    if (doc?.id) {
      try {
        const api = new DocumentApi();
        const document = await api.getSignedUrl(doc.id);
        setViewDoc(document.path);
      } catch (error) {
        console.error('Error getting signed URL:', error);
        toast.error('Failed to load document');
      }
    } else if (doc?.path) {
      setViewDoc(doc.path);
    }
  };

  const closeDocumentViewer = () => {
    setViewDoc('');
  };

  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        Driver's License Information
      </h1>

      <div className={styles.formInfoBox}>
        <p className={styles.formInfoBoxTitle}>📋 Complete License Information</p>
        <p>
          Please provide all your driver's license information including your CDL details,
          endorsements, restrictions, and equipment experience.
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div className={styles.formContainerPadded}>
          {/* Section 1: CDL Class & Experience */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>CDL Class & Experience</h3>
            <Row className="my-3">
              <div className="col-md-6">
                <BaseSelect
                  label="TYPE_CDL_CLASS"
                  placeholder="SELECT_ONE_PLACEHOLDER"
                  name="license_type"
                  required
                  labelPrefix="DriverLicenseType"
                  enumType={DriverLicenseType}
                  formik={form}
                />
              </div>
              <div className="col-md-6">
                <Input
                  name="years_cdl_experience"
                  type="number"
                  label={t('years_cdl_experience')}
                  placeholder={t('PLACEHOLDER_FOR_DIGITS')}
                  value={form.values.years_cdl_experience?.toString() || ''}
                  onChange={(e) => {
                    let value = parseFloat(e.target.value) || 0;
                    value = Math.min(Math.max(value, 0), 99);
                    form.setFieldValue('years_cdl_experience', value);
                  }}
                  onBlur={form.handleBlur}
                  required
                  min="0"
                  max="99"
                  error={
                    form.touched.years_cdl_experience && form.errors.years_cdl_experience
                      ? String(form.errors.years_cdl_experience)
                      : undefined
                  }
                  icon={<span>🚛</span>}
                  helperText="Enter your years of experience"
                />
              </div>
            </Row>
          </div>

          {/* Section 2: License Number, State, Expiry */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>License Details</h3>
            <Row className="my-3">
              <div className="col-md-4">
                <Select
                  name="license_state"
                  label={t('state_issued')}
                  placeholder={t('ISSUANCE_STATE')}
                  options={responsiveStateList}
                  value={form.values.license_state || ''}
                  onChange={handleIssuedStateChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.license_state && form.errors.license_state
                      ? String(form.errors.license_state)
                      : undefined
                  }
                  helperText="Select the state where your CDL was issued"
                />
              </div>
              <div className="col-md-4">
                <MaskedInput
                  name="license_number"
                  label={t('CDL_NUMBER')}
                  placeholder={cdlFormat.placeholder}
                  mask={cdlFormat.mask}
                  value={form.values.license_number || ''}
                  onChange={handleLicenseNumberChange}
                  onBlur={form.handleBlur}
                  required
                  disabled={!selectedIssuedState}
                  error={
                    form.touched.license_number && form.errors.license_number
                      ? String(form.errors.license_number)
                      : undefined
                  }
                  helperText={t(cdlFormat.description)}
                />
              </div>
              <div className="col-md-4">
                <Input
                  name="license_expiry"
                  label={t('expiration_date')}
                  placeholder={t('expiration_date')}
                  type="date"
                  value={formatDateForInput(form.values.license_expiry)}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  required
                  error={
                    form.touched.license_expiry && form.errors.license_expiry
                      ? t('LICENSE_HAS_EXPIRED')
                      : undefined
                  }
                  helperText="Enter the expiration date of your CDL"
                />
              </div>
            </Row>
          </div>

          {/* Section 3: Transmissions, Endorsements, Restrictions */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>Transmissions, Endorsements & Restrictions</h3>

            <div className="my-4">
              <CheckboxGroup
                name="transmission_type"
                label={t('TRANSMISSION_EXPERIENCE')}
                enumType={VehicleTransmissionType}
                value={form.values.transmission_type || []}
                onChange={handleTransmissionChange}
                labelPrefix="VehicleTransmissionType"
                columns={2}
                variant="compact"
              />
            </div>

            <div className="my-4">
              <CheckboxGroup
                name="endorsements"
                label={t('ENDORSEMENTS')}
                enumType={DriverEndorsement}
                value={form.values.endorsements || []}
                onChange={handleEndorsementsChange}
                labelPrefix="DriverEndorsement"
                columns={2}
                variant="compact"
              />

              {form.values?.endorsements?.includes(DriverEndorsement.OTHER) && (
                <div className="mt-3">
                  <Input
                    name="endorsements_other"
                    label={t('OTHER_ENDORSEMENTS')}
                    placeholder={t('OTHER_ENDORSEMENTS')}
                    value={form.values.endorsements_other || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    required
                    error={
                      form.touched.endorsements_other && form.errors.endorsements_other
                        ? String(form.errors.endorsements_other)
                        : undefined
                    }
                    helperText="Please specify your other endorsements"
                  />
                </div>
              )}
            </div>

            <div className="my-4">
              <CheckboxGroup
                name="license_restrictions"
                label={t('DHA_CDL_RESTRICTIONS')}
                enumType={LicenseRestrictions}
                value={form.values.license_restrictions || []}
                onChange={handleLicenseRestrictionsChange}
                labelPrefix="LicenseRestrictions"
                columns={2}
                variant="compact"
              />

              {form.values?.license_restrictions?.includes(LicenseRestrictions.OTHER) && (
                <div className="mt-3">
                  <Input
                    name="license_restrictions_other"
                    label={t('OTHER_LICENSE_RESTRICTIONS')}
                    placeholder={t('OTHER_LICENSE_RESTRICTIONS')}
                    value={form.values.license_restrictions_other || ''}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    required
                    error={
                      form.touched.license_restrictions_other &&
                      form.errors.license_restrictions_other
                        ? String(form.errors.license_restrictions_other)
                        : undefined
                    }
                    helperText="Please specify your other license restrictions"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Equipment Experience */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>Equipment Experience</h3>
            <EquipmentCard
              title="EQUIPMENT_EXPERIENCE"
              emptyStateText="No equipment experience added"
              emptyStateSubtext="Click 'Add Equipment' to get started"
              actions={
                <Button
                  size="sm"
                  variant="outline"
                  icon={<PlusCircle />}
                  onClick={addEquipmentExperience}
                >
                  Add Equipment
                </Button>
              }
            >
              {form.values.equipment_experience && form.values.equipment_experience.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {form.values.equipment_experience.map((equipment, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e0e5eb',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                      }}
                    >
                      <Row>
                        <div className="col-md-6">
                          <Select
                            name={`equipment_experience[${i}].type`}
                            label="Equipment Type"
                            placeholder="Select Equipment"
                            options={Object.values(JobEquipmentType).map((type) => ({
                              value: type,
                              label: type,
                            }))}
                            value={equipment.type || ''}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <Input
                            name={`equipment_experience[${i}].years`}
                            type="number"
                            label="Years of Experience"
                            placeholder="Years"
                            value={equipment.years?.toString() || ''}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            required
                            min="0"
                            max="99"
                          />
                        </div>
                      </Row>
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash />}
                          onClick={() => removeEquipmentExperience(i)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </EquipmentCard>
          </div>

          {/* Section 5: Additional Licenses */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>Additional CDL Licenses</h3>
            <EquipmentCard
              title="ADDITIONAL_CDL_LICENSES"
              emptyStateText="No additional CDL licenses provided"
              emptyStateSubtext="Click 'Add CDL Detail' to get started"
              actions={
                <Button
                  size="sm"
                  variant="outline"
                  icon={<PlusCircle />}
                  onClick={addCDLLicense}
                >
                  {t('TITLE_ADD_CDL_DETAIL')}
                </Button>
              }
            >
              {additionalLicenses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {additionalLicenses.map((entity, i) => {
                    const additionalCdlFormat = getCDLFormat(entity.state || '');

                    return (
                      <div
                        key={i}
                        style={{
                          padding: '1.5rem',
                          border: '2px solid #e0e5eb',
                          borderRadius: '8px',
                          backgroundColor: '#f8f9fa',
                        }}
                      >
                        <Row>
                          <div className="col-md-4">
                            <Select
                              name={`additional_license_state_${i}`}
                              label={t('state_issued')}
                              placeholder={t('SELECT_STATE')}
                              options={responsiveStateList}
                              value={entity.state || ''}
                              onChange={(e) => {
                                handleLicenseFieldChange(i, 'state', e.target.value);
                                handleLicenseFieldChange(i, 'license_number', '');
                              }}
                              required
                              helperText="Select the state where this CDL was issued"
                            />
                          </div>
                          <div className="col-md-4">
                            <MaskedInput
                              name={`additional_license_number_${i}`}
                              label={t("driver's_license_number")}
                              placeholder={additionalCdlFormat.placeholder}
                              mask={additionalCdlFormat.mask}
                              value={entity.license_number || ''}
                              onChange={handleAdditionalLicenseNumberChange(i)}
                              required
                              disabled={!entity.state}
                              helperText={
                                entity.state ? t(additionalCdlFormat.description) : 'Select state first'
                              }
                            />
                          </div>
                          <div className="col-md-4">
                            <Input
                              name={`additional_license_date_${i}`}
                              label={t('expiration_date')}
                              placeholder={t('expiration_date')}
                              type="date"
                              value={typeof entity.date === 'string' ? entity.date : ''}
                              onChange={(e) => handleLicenseFieldChange(i, 'date', e.target.value)}
                              required
                              helperText="Expiration date must be at least 6 months from today"
                            />
                          </div>
                        </Row>
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<Trash />}
                            onClick={() => removeCDLLicense(i)}
                          >
                            {t('REMOVE')}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </EquipmentCard>
          </div>

          {/* Section 6: License Document Upload */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className={`${styles.jot_form_headers_font}`}>License Document</h3>
            <div className={styles.formInfoBox}>
              <p>
                Please upload a clear photo or scan of your driver&apos;s license. Accepted formats:
                PDF, Word documents, or images (JPG, PNG).{' '}
                {getFileSizeLimitDescription(DRIVER_LICENSE_SIZE_LIMIT)}.
              </p>
            </div>

            <div className="my-3">
              <Checkbox
                name="mediaOptions"
                label={t('MEDIA_PREFERENCE')}
                checked={form.values.mediaOptions || false}
                onChange={(e) => form.setFieldValue('mediaOptions', e.target.checked)}
                onBlur={form.handleBlur}
                helperText="Check this option to use your camera instead of uploading a file"
              />
            </div>

            <DocumentCard
              title="DRIVER_LICENSE_DOCUMENT"
              subtitle="Upload your driver's license"
              icon="📄"
            >
              <div className={styles.documentUploadSection}>
                {(() => {
                  const existingDoc = applicant?.documents?.find(isDriverLicense);
                  if (existingDoc && !form.values.mediaOptions) {
                    return (
                      <div className={styles.existingDocumentPreview} style={{ marginBottom: '1rem' }}>
                        <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                          <div className="d-flex align-items-center">
                            <span className="me-2">📄</span>
                            <div>
                              <div className="fw-bold">Current Driver&apos;s License</div>
                              <small className="text-muted">
                                {existingDoc.name || 'Uploaded document'}
                              </small>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Eye />}
                              onClick={handleViewDocument}
                            >
                              View
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              icon={<Trash />}
                              onClick={handleRemoveDocument}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {Boolean(form.values.mediaOptions) ? (
                  <CameraComponent form={form} onRemove={handleApplicantExtrasCleanup} />
                ) : (
                  <FileInput
                    hideView={Boolean(form.values?.document?.id)}
                    className="my-3"
                    name="document"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    allowedTypesFriendlyName="PDF, Word, or Image files"
                    allowedSizeInByte={DRIVER_LICENSE_SIZE_LIMIT}
                    formik={form}
                    onRemove={handleApplicantExtrasCleanup}
                  />
                )}
              </div>
            </DocumentCard>
          </div>
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          showBackButton={true}
          nextButtonText="Save and continue"
          backButtonText={t('BACK')}
        />
      </Form>

      {/* Document Viewers */}
      {(() => {
        const existingDoc = applicant?.documents?.find(isDriverLicense);
        if (viewDoc && existingDoc) {
          const fileName = existingDoc.name || '';
          const isPdf =
            existingDoc.mime_type?.includes('application/pdf') ||
            fileName.toLowerCase().endsWith('.pdf');
          const isImage =
            existingDoc.mime_type?.includes('image/') ||
            /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

          if (isPdf) {
            return (
              <ViewPdf name={existingDoc?.name} url={viewDoc} onCloseClick={closeDocumentViewer} />
            );
          } else if (isImage) {
            return (
              <ViewModal
                show={!!viewDoc}
                title={existingDoc?.name || 'Driver License'}
                onCloseClick={closeDocumentViewer}
              >
                <img className="img-thumbnail w-100" src={viewDoc} alt="Driver License" />
              </ViewModal>
            );
          } else {
            return (
              <ViewModal
                show={!!viewDoc}
                title={existingDoc?.name || 'Driver License'}
                onCloseClick={closeDocumentViewer}
              >
                <img className="img-thumbnail w-100" src={viewDoc} alt="Driver License" />
              </ViewModal>
            );
          }
        }
        return null;
      })()}
    </>
  );
}

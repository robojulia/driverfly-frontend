import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Trash, Eye, PlusCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { DocumentEntity } from '../../../../models/documents/document.entity';
import { DocumentsDto } from '../../../../models/jot-form/long-form/documents.dto';
import { FormActions } from '../form-buttons';
import { DocumentCard, Checkbox, Button, Input, Select, MaskedInput, EquipmentCard } from '../../../shared/dha';
import FileInput from '../../file-input';
import { CameraComponent } from './camera';
import ViewModal from '../../../view-details/view-modal';
import ViewPdf from '../../../view-details/view-pdf';
import DocumentApi from '../../../../pages/api/document';
import {
  DRIVER_LICENSE_SIZE_LIMIT,
  getFileSizeLimitDescription,
} from '../../../../constants/file-upload.constants';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { ApplicantExtrasEntity } from '../../../../models/applicant/applicant-extras.entity';
import { CdlExtras } from '../../../../models/jot-form/long-form/cdl-object/index.dto';
import stateList from '../../../../utils/stateList';
import { getCDLFormat } from '../../../../utils/cdl-formats';

// Custom hook to detect screen size for responsive state list
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

export function DriverLicense() {
  const {
    state: { applicant, steps, applicantExtras },
    method: { setApplicant, stepNext, stepBack, setApplicantExtras, updateApplicantExtras },
  }: JotFormContextType = useContext(JotformContext);

  const [isFormValid, setIsFormValid] = useState(false);
  const [viewDoc, setViewDoc] = useState('');
  const [additionalLicenses, setAdditionalLicenses] = useState<CdlExtras[]>([]);
  const isSmallScreen = useScreenSize();

  // Initialize async form saving
  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  const isDriverLicense = (v: DocumentEntity): boolean =>
    v?.type == ApplicantDocumentType.DRIVER_LICENSE;

  const isNotDriverLicense = (v: DocumentEntity): boolean =>
    v?.type != ApplicantDocumentType.DRIVER_LICENSE;

  const { t } = useTranslation();
  const router = useRouter();
  const isMissingDocRouteActive = router.route.includes(
    'longform/[applicant_uuid]/missing-document'
  );
  const isLongFormRouteActive = router.route.includes('apply/longform/[applicant_uuid]');
  const quickApplyRouteActive = router.route.includes('apply/quick-apply');
  const dhaRouteActive = router.route.includes('apply/[slug]');

  // Create responsive state list
  const responsiveStateList = isSmallScreen
    ? stateList.map((state) => ({ ...state, label: state.value }))
    : stateList;

  const form = useFormik({
    initialValues: new DocumentsDto(),
    validationSchema: DocumentsDto.yupSchema(),
    onSubmit: (values, { resetForm }) => {
      const { document } = values;

      let updatedApplicant = { ...applicant };
      let documents: DocumentEntity[] = applicant?.documents?.filter(isNotDriverLicense) || [];

      if (!!document?.file_base64) {
        documents = [...documents, { ...document }];
      }

      updatedApplicant = {
        ...updatedApplicant,
        documents,
      };

      setApplicant(updatedApplicant);

      // Handle additional CDL licenses
      try {
        // Check if there are any valid CDL licenses
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
          // Update with valid CDL licenses
          const cdlExtrasEntity = new ApplicantExtrasEntity(ApplicantExtras.CDL_NUMBER);
          cdlExtrasEntity.value = additionalLicenses;
          updateApplicantExtras(cdlExtrasEntity);
        } else {
          // Remove CDL_NUMBER entry entirely if no valid licenses
          setApplicantExtras(
            (prev) => prev?.filter((extra) => extra.type !== ApplicantExtras.CDL_NUMBER) || []
          );
        }
      } catch (error) {
        console.error('Error submitting additional licenses:', error);
      }

      // Save form data on submit
      saveFormData({
        applicant: updatedApplicant,
      });

      stepNext();
    },
    onReset: (values) => {
      stepBack();
    },
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
  });

  // Check if form is valid
  useEffect(() => {
    const hasNoErrors = Object.keys(form.errors).length === 0;

    // Check additional licenses validation
    let additionalLicensesValid = true;
    if (additionalLicenses.length > 0) {
      additionalLicensesValid = additionalLicenses.every(
        (license) =>
          !!license.license_number &&
          !!license.state &&
          (typeof license.date === 'string' ? !!license.date : !!license.date)
      );
    }

    // Form is valid even without document, but only invalid if there are errors or invalid additional licenses
    setIsFormValid(hasNoErrors && additionalLicensesValid);
  }, [form.values, form.errors, additionalLicenses]);

  // Check if document is missing for warning display
  const hasDocument = !!form.values.document?.file_base64;

  useEffect(() => {
    const doc: DocumentEntity = applicant?.documents?.find(isDriverLicense);

    form.setValues({
      document: doc ?? {
        ...new DocumentEntity(),
        type: ApplicantDocumentType.DRIVER_LICENSE,
      },
      mediaOptions: false,
    });
  }, [applicant]);

  // Load existing additional licenses from applicantExtras
  useEffect(() => {
    const apx_cdl = applicantExtras?.find((v) => v.type == ApplicantExtras.CDL_NUMBER);
    if (apx_cdl?.value && Array.isArray(apx_cdl.value)) {
      setAdditionalLicenses(apx_cdl.value);
    }
  }, [applicantExtras]);

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

  const handleRemoveDocument = () => {
    // Clear the document from form
    form.setFieldValue('document', {
      ...new DocumentEntity(),
      type: ApplicantDocumentType.DRIVER_LICENSE,
    });

    // Also remove from applicant documents if it exists
    if (applicant?.documents) {
      const documentsWithoutLicense = applicant.documents.filter(isNotDriverLicense);
      setApplicant({
        ...applicant,
        documents: documentsWithoutLicense,
      });
    }

    // Remove related applicant extras (CDL_NUMBER) when driver's license is removed
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
        console.log('Document response:', document);
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

  // Additional licenses management functions
  const addCDLLicense = () => {
    setAdditionalLicenses([...additionalLicenses, new CdlExtras()]);
  };

  const removeCDLLicense = (index: number) => {
    const newLicenses = additionalLicenses.filter((_, idx) => idx !== index);
    setAdditionalLicenses(newLicenses);
  };

  const handleLicenseNumberChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const uppercaseValue = e.target.value.toUpperCase();
    const newLicenses = [...additionalLicenses];
    newLicenses[index].license_number = uppercaseValue;
    setAdditionalLicenses(newLicenses);
  };

  const handleLicenseFieldChange = (index: number, field: keyof CdlExtras, value: string) => {
    const newLicenses = [...additionalLicenses];
    newLicenses[index][field] = value;
    setAdditionalLicenses(newLicenses);
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('DRIVER_LICENSE_PHOTO')}
      </h1>

      <div className={styles.formInfoBox}>
        <p className={styles.formInfoBoxTitle}>📄 {t('DRIVER_LICENSE_UPLOAD_HELP_TITLE')}</p>
        <p>
          Please upload a clear photo or scan of your driver&apos;s license. Accepted formats: PDF,
          Word documents, or images (JPG, PNG).{' '}
          {getFileSizeLimitDescription(DRIVER_LICENSE_SIZE_LIMIT)}.
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div className={styles.formContainerPadded}>
          {/* Media Preference Section */}
          <div className={styles.marginBottomLarge}>
            <Checkbox
              name="mediaOptions"
              label={t('MEDIA_PREFERENCE')}
              checked={form.values.mediaOptions || false}
              onChange={(e) => form.setFieldValue('mediaOptions', e.target.checked)}
              onBlur={form.handleBlur}
              helperText="Check this option to use your camera instead of uploading a file"
            />
          </div>

          {/* Document Upload Section */}
          <DocumentCard
            title="DRIVER_LICENSE_DOCUMENT"
            subtitle="Upload your driver's license"
            icon="📄"
          >
            <div className={styles.documentUploadSection}>
              {/* Show existing document preview if available */}
              {(() => {
                const existingDoc = applicant?.documents?.find(isDriverLicense);
                if (existingDoc && !form.values.mediaOptions) {
                  return (
                    <div
                      className={styles.existingDocumentPreview}
                      style={{ marginBottom: '1rem' }}
                    >
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

              {/* Remove button - appears when document exists */}
              {hasDocument && (
                <div className={styles.documentRemoveSection}>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash />}
                    onClick={handleRemoveDocument}
                    className={styles.dangerButton}
                  >
                    {Boolean(form.values.mediaOptions) ? t('CLEAR_PHOTO') : t('REMOVE_DOCUMENT')}
                  </Button>
                </div>
              )}
            </div>
          </DocumentCard>

          {/* Additional CDL Licenses Section */}
          <div style={{ marginTop: '2rem' }}>
            <h2 className={`${styles.carrierName} ${styles.jot_form_headers_font}`} style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              {t('HAVE_ANY_ACTIVE_DRIVERS_LICENSE')}
            </h2>

            <div className={styles.formInfoBox} style={{ marginBottom: '1.5rem' }}>
              <p className={styles.formInfoBoxTitle}>🚗 {t('ADDITIONAL_CDL_LICENSES_HELP_TITLE')}</p>
              <p>
                Please add any additional Commercial Driver&apos;s Licenses you hold from other states.
                Include the license number, issuing state, and expiration date for each.
              </p>
            </div>

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
                  className="ml-2"
                >
                  {t('TITLE_ADD_CDL_DETAIL')}
                </Button>
              }
            >
              {additionalLicenses.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {additionalLicenses.map((entity, i) => {
                    const cdlFormat = getCDLFormat(entity.state || '');

                    return (
                      <div
                        key={i}
                        style={{
                          padding: '1.5rem',
                          border: '2px solid #e0e5eb',
                          borderRadius: '8px',
                          backgroundColor: '#f8f9fa',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                            alignItems: 'end',
                            marginBottom: '1rem',
                          }}
                        >
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
                          <MaskedInput
                            name={`additional_license_number_${i}`}
                            label={t("driver's_license_number")}
                            placeholder={cdlFormat.placeholder}
                            mask={cdlFormat.mask}
                            value={entity.license_number || ''}
                            onChange={handleLicenseNumberChange(i)}
                            required
                            disabled={!entity.state}
                            helperText={
                              entity.state ? t(cdlFormat.description) : 'Select state first'
                            }
                          />
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

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                        >
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
        </div>

        <FormActions
          onNext={handleNext}
          onBack={handleBack}
          isSubmitting={form.isSubmitting}
          isValid={isFormValid}
          showBackButton={!!steps}
          nextButtonText={t('NEXT')}
          backButtonText={t('BACK')}
        />
      </Form>

      {/* Document Viewers */}
      {(() => {
        const existingDoc = applicant?.documents?.find(isDriverLicense);
        if (viewDoc && existingDoc) {
          // Determine file type from name or mime_type
          const fileName = existingDoc.name || '';
          const isPdf =
            existingDoc.mime_type?.includes('application/pdf') ||
            fileName.toLowerCase().endsWith('.pdf');
          const isImage =
            existingDoc.mime_type?.includes('image/') ||
            /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

          console.log('Viewer logic:', {
            fileName,
            isPdf,
            isImage,
            mime_type: existingDoc.mime_type,
            viewDoc,
          });

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
            // Default to image viewer for unknown types
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

import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Trash, Eye } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { ApplicantExtras } from '../../../../enums/applicants/applicant-extras.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { useAsyncFormSave } from '../../../../hooks/use-async-form-save';
import { DocumentEntity } from '../../../../models/documents/document.entity';
import { DocumentsDto } from '../../../../models/jot-form/long-form/documents.dto';
import { FormActions } from '../form-buttons';
import { DocumentCard, Checkbox, Button } from '../../../shared/dha';
import FileInput from '../../file-input';
import { CameraComponent } from './camera';
import ViewModal from '../../../view-details/view-modal';
import ViewPdf from '../../../view-details/view-pdf';
import DocumentApi from '../../../../pages/api/document';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function DriverLicense() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack, setApplicantExtras },
  }: JotFormContextType = useContext(JotformContext);

  const [isFormValid, setIsFormValid] = useState(false);
  const [viewDoc, setViewDoc] = useState('');

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
    // Form is valid even without document, but only invalid if there are errors
    setIsFormValid(hasNoErrors);
  }, [form.values, form.errors]);

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

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('DRIVER_LICENSE_PHOTO')}
      </h1>

      <div className={styles.formInfoBox}>
        <p className={styles.formInfoBoxTitle}>📄 {t('DRIVER_LICENSE_UPLOAD_HELP_TITLE')}</p>
        <p>
          Please upload a clear photo or scan of your driver&apos;s license. Accepted formats: PDF,
          Word documents, or images (JPG, PNG). Maximum file size: 3MB.
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
                            <div className="fw-bold">Current Driver's License</div>
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
                  allowedSizeInByte={3145728}
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

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
import {
  MEDICAL_CARD_SIZE_LIMIT,
  getFileSizeLimitDescription,
} from '../../../../constants/file-upload.constants';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function MedicalCard() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack, setApplicantExtras },
  }: JotFormContextType = useContext(JotformContext);

  const [isFormValid, setIsFormValid] = useState(false);
  const [viewDoc, setViewDoc] = useState('');

  // Initialize async form saving
  const { saveFormData } = useAsyncFormSave(applicant?.id, steps);

  const isMedicalCard = (v: DocumentEntity): boolean =>
    v?.type == ApplicantDocumentType.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD;

  const isNotMedicalCard = (v: DocumentEntity): boolean =>
    v?.type != ApplicantDocumentType.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD;

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
      let documents: DocumentEntity[] = applicant?.documents?.filter(isNotMedicalCard) || [];

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
    const hasDocument = !!form.values.document?.file_base64;
    const hasNoErrors = Object.keys(form.errors).length === 0;
    // Form is valid even without document, but only invalid if there are errors
    setIsFormValid(hasNoErrors);
  }, [form.values, form.errors]);

  // Check if document is missing for warning display
  const hasDocument = !!form.values.document?.file_base64;

  useEffect(() => {
    const doc: DocumentEntity = applicant?.documents?.find(isMedicalCard);

    form.setValues({
      document: doc ?? {
        ...new DocumentEntity(),
        type: ApplicantDocumentType.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD,
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
      type: ApplicantDocumentType.MEDICAL_EXAMINER_CERTIFICATE_MEDICAL_CARD,
    });

    // Also remove from applicant documents if it exists
    if (applicant?.documents) {
      const documentsWithoutMedicalCard = applicant.documents.filter(isNotMedicalCard);
      setApplicant({
        ...applicant,
        documents: documentsWithoutMedicalCard,
      });
    }

    // Handle applicant extras cleanup
    handleApplicantExtrasCleanup();
  };

  const handleApplicantExtrasCleanup = () => {
    // Note: Medical card doesn't have specific related applicant extras like CDL_NUMBER,
    // but this structure is maintained for consistency and future extensibility
    // If medical card related extras are added in the future, they should be removed here
    // Example of how to remove specific extras if needed in the future:
    // if (setApplicantExtras) {
    //   setApplicantExtras(
    //     (prev) => prev?.filter((extra) => extra.type !== ApplicantExtras.SOME_MEDICAL_EXTRA) || []
    //   );
    // }
  };

  const handleViewDocument = async () => {
    const doc = applicant?.documents?.find(isMedicalCard);
    if (doc?.id) {
      try {
        const api = new DocumentApi();
        const document = await api.getSignedUrl(doc.id);
        console.log('Medical card document response:', document);
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
        {t('MEDICAL_CARD_UPLOAD_TITLE')}
      </h1>

      <div className={styles.formInfoBox}>
        <p className={styles.formInfoBoxTitle}>🏥 {t('MEDICAL_CARD_UPLOAD_HELP_TITLE')}</p>
        <p>
          Please upload a clear photo or scan of your DOT medical card. Accepted formats: PDF, Word
          documents, or images (JPG, PNG). {getFileSizeLimitDescription(MEDICAL_CARD_SIZE_LIMIT)}.
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
            title="MEDICAL_CARD_DOCUMENT"
            subtitle="Upload your DOT medical card"
            icon="🏥"
          >
            <div className={styles.documentUploadSection}>
              {/* Show existing document preview if available */}
              {(() => {
                const existingDoc = applicant?.documents?.find(isMedicalCard);
                if (existingDoc && !form.values.mediaOptions) {
                  return (
                    <div
                      className={styles.existingDocumentPreview}
                      style={{ marginBottom: '1rem' }}
                    >
                      <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
                        <div className="d-flex align-items-center">
                          <span className="me-2">🏥</span>
                          <div>
                            <div className="fw-bold">Current Medical Card</div>
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
                  allowedSizeInByte={MEDICAL_CARD_SIZE_LIMIT}
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
        const existingDoc = applicant?.documents?.find(isMedicalCard);
        if (viewDoc && existingDoc) {
          // Determine file type from name or mime_type
          const fileName = existingDoc.name || '';
          const isPdf =
            existingDoc.mime_type?.includes('application/pdf') ||
            fileName.toLowerCase().endsWith('.pdf');
          const isImage =
            existingDoc.mime_type?.includes('image/') ||
            /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);

          console.log('Medical card viewer logic:', {
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
                title={existingDoc?.name || 'Medical Card'}
                onCloseClick={closeDocumentViewer}
              >
                <img className="img-thumbnail w-100" src={viewDoc} alt="Medical Card" />
              </ViewModal>
            );
          } else {
            // Default to image viewer for unknown types
            return (
              <ViewModal
                show={!!viewDoc}
                title={existingDoc?.name || 'Medical Card'}
                onCloseClick={closeDocumentViewer}
              >
                <img className="img-thumbnail w-100" src={viewDoc} alt="Medical Card" />
              </ViewModal>
            );
          }
        }
        return null;
      })()}
    </>
  );
}

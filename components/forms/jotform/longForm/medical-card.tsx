import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../context/jotform-context';
import { ApplicantDocumentType } from '../../../../enums/applicants/applicant-document-type.enum';
import { useTranslation } from '../../../../hooks/use-translation';
import { DocumentEntity } from '../../../../models/documents/document.entity';
import { DocumentsDto } from '../../../../models/jot-form/long-form/documents.dto';
import { FormActions } from '../form-buttons';
import { DocumentCard, Checkbox, Button } from '../../../shared/dha';
import FileInput from '../../file-input';
import { CameraComponent } from './camera';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function MedicalCard() {
  const {
    state: { applicant, steps },
    method: { setApplicant, stepNext, stepBack },
  }: JotFormContextType = useContext(JotformContext);

  const [isFormValid, setIsFormValid] = useState(false);

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

      if (isMissingDocRouteActive || isLongFormRouteActive) {
        if (!!document?.file_base64) {
          const documents: DocumentEntity[] = applicant?.documents?.filter(isNotMedicalCard) || [];
          setApplicant({
            ...applicant,
            documents: [...documents, { ...document }],
          });
        }
        stepNext();
      } else if (dhaRouteActive || quickApplyRouteActive) {
        if (!!document?.file_base64) {
          const documents: DocumentEntity[] = applicant?.documents?.filter(isNotMedicalCard) || [];
          setApplicant({
            ...applicant,
            documents: [...documents, { ...document }],
          });
        }
        stepNext();
      } else {
        toast.error(t('MUST_ADD_FILE'));
      }
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
  };

  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('MEDICAL_CARD_UPLOAD_TITLE')}
      </h1>

      <div
        style={{
          maxWidth: '100%',
          margin: '0 auto 2rem auto',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e5eb',
          borderRadius: '8px',
          color: '#667788',
          fontSize: '0.95rem',
          lineHeight: '1.5',
        }}
      >
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600', color: '#1a2b3c' }}>
          🏥 {t('MEDICAL_CARD_UPLOAD_HELP_TITLE')}
        </p>
        <p style={{ margin: 0 }}>
          Please upload a clear photo or scan of your DOT medical card. Accepted formats: PDF, Word
          documents, or images (JPG, PNG). Maximum file size: 3MB.
        </p>
      </div>

      <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.formStep}>
        <div style={{ maxWidth: '100%', margin: '0', padding: '0 1rem' }}>
          {/* Media Preference Section */}
          <div style={{ marginBottom: '2rem' }}>
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
            <div style={{ position: 'relative' }}>
              {Boolean(form.values.mediaOptions) ? (
                <CameraComponent form={form} />
              ) : (
                <FileInput
                  hideView={Boolean(form.values?.document?.id)}
                  className="my-3"
                  name="document"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                  allowedSizeInByte={3145728}
                  formik={form}
                />
              )}

              {/* Remove button - appears when document exists */}
              {hasDocument && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1rem',
                    padding: '1rem',
                    borderTop: '1px solid #e0e5eb',
                  }}
                >
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash />}
                    onClick={handleRemoveDocument}
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
    </>
  );
}

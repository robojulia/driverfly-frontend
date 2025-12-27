import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { EditApplicantFormNew } from '../../../../../components/forms/company/edit-applicant-form-new';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../../../../hooks/use-unsaved-changes-warning';
import { ApplicantEntity } from '../../../../../models/applicant/applicant.entity';
import { ApplicantSuggestedJobEntity } from '../../../../../models/applicant/applicant-suggested-job.entity';
import { useEffectAsync } from '../../../../../utils/react';
import ApplicantApi from '../../../../api/applicant';
import { HireApplicantForm } from '../../../../../components/forms/company/hire-applicant-form';
import { ApplicantExtras as ApplicantExtrasEnum } from '../../../../../enums/applicants/applicant-extras.enum';
import ValidationErrorPanel from '../../../../../components/validation/ValidationErrorPanel';
// DOT verification panel is now rendered inside EditApplicantForm

export default function EditApplicant({ id }) {
  const router = useRouter();
  const { t } = useTranslation();

  const backPath = '/dashboard/company/applicants';

  const goBack = () => window.setTimeout(() => router.back(), 2000);

  const [applicant, setApplicant] = useState(new ApplicantEntity());
  const [eligibility, setEligibility] = useState<any>(null);
  const [refetchApplicant, setRefetchApplicant] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [applicantSuggestedJobs, setApplicantSuggestedJobs] = useState<ApplicantSuggestedJobEntity[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ formId: string; errors: any }[]>([]);

  useEffectAsync(async () => {
    if (id) {
      const api = new ApplicantApi();
      const entity = await api.getById(+id, true, ['documents', 'notes', 'notes.user', 'jobs', 'extras', 'dac', 'employers', 'accident_history', 'moving_violation_history', 'equipment_experience', 'equipment_owned']);

      const suggestedJobs = await api.suggestedJobs.get(id);
      setApplicantSuggestedJobs(suggestedJobs || []);

      if (entity) {
        setApplicant(entity);
        // Extract eligibility from the response if it exists
        if ((entity as any).eligibility) {
          setEligibility((entity as any).eligibility);
        }
      } else {
        toast.error(t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true }));
        goBack();
      }
    } else {
      toast.error(t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true }));
      goBack();
    }
  }, [id, refetchApplicant]);

  // Check if any registered form has unsaved changes
  useEffect(() => {
    const checkDirtyState = () => {
      const dirtyRegistry = (window as any).__applicantFormDirty || {};
      const isDirty = Object.keys(dirtyRegistry).some((formId) => {
        const getDirtyFn = dirtyRegistry[formId];
        if (getDirtyFn && typeof getDirtyFn === 'function') {
          return getDirtyFn();
        }
        return false;
      });
      setHasUnsavedChanges(isDirty);
    };

    // Check immediately
    checkDirtyState();

    // Poll for changes every 500ms
    const interval = setInterval(checkDirtyState, 500);

    return () => clearInterval(interval);
  }, []);

  // Warn user about unsaved changes when navigating away
  const unsavedChangesWarning = useUnsavedChangesWarning({
    isDirty: hasUnsavedChanges,
    shouldWarn: !isSaving && !isSubmitting,
  });

  // No page refresh after save; forms show their own success/failure notifications

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Check for validation errors in all forms
      const validationRegistry = (window as any).__applicantFormValidation || {};
      const validationErrors: { formId: string; errors: any }[] = [];

      Object.keys(validationRegistry).forEach((formId) => {
        const validateFn = validationRegistry[formId];
        if (validateFn && typeof validateFn === 'function') {
          const errors = validateFn();
          if (errors && Object.keys(errors).length > 0) {
            validationErrors.push({ formId, errors });
          }
        }
      });

      // If there are validation errors, stop and notify user
      if (validationErrors.length > 0) {
        console.error('Validation errors found:', validationErrors);
        toast.error(t('Please fix validation errors before saving. Check the highlighted fields.'));
        setIsSaving(false);

        // Set validation errors to display the error panel
        setValidationErrors(validationErrors);

        return;
      }

      // Call all registered getter functions to get CURRENT form values
      const registry = (window as any).__applicantFormRegistry || {};
      const allValues: any = { ...applicant };

      // Collect all extras arrays from forms to merge them
      const extrasArrays: any[] = [];

      // Call each getter function to get current values
      Object.keys(registry).forEach((formId) => {
        const getter = registry[formId];
        if (getter && typeof getter === 'function') {
          const formValues = getter();
          if (formValues && typeof formValues === 'object') {
            // Collect extras arrays separately for intelligent merging
            if (formValues.extras && Array.isArray(formValues.extras)) {
              extrasArrays.push({ formId, extras: formValues.extras });
            }
            // Assign all other fields (will overwrite, but that's OK for scalar fields)
            const { extras, ...otherFields } = formValues;
            Object.assign(allValues, otherFields);
          }
        }
      });

      // Intelligently merge extras: keep all unique types, last one wins for duplicates
      const extrasMap = new Map();

      // Start with existing extras from entity
      (applicant?.extras || []).forEach((extra: any) => {
        if (extra?.type &&
            extra.type !== ApplicantExtrasEnum.DOT_NUMBER &&
            extra.type !== ApplicantExtrasEnum.BUSINESS_NAME) {
          extrasMap.set(extra.type, extra);
        }
      });

      // Merge in extras from all forms (later forms overwrite earlier ones)
      if (extrasArrays.length > 0) {
        const sortedExtrasArrays = extrasArrays.sort((a, b) => {
          if (a.formId === 'licensing') return 1; // Process licensing last
          if (b.formId === 'licensing') return -1;
          return 0;
        });

        sortedExtrasArrays.forEach(({ formId, extras: extrasArray }) => {
          extrasArray.forEach((extra: any) => {
            if (extra?.type) {
              extrasMap.set(extra.type, extra);
            }
          });
        });
      }

      // Completely replace allValues.extras with merged extras
      allValues.extras = Array.from(extrasMap.values());

      // Strip out fields that shouldn't be sent to backend
      const {
        jobs, documents, notes, dac, voeData,
        ...payload
      } = allValues;

      // Keep certain relations and objects that should be sent
      if (allValues.employers) payload.employers = allValues.employers;
      if (allValues.extras) payload.extras = allValues.extras;
      if (allValues.accident_history) payload.accident_history = allValues.accident_history;
      if (allValues.moving_violation_history) payload.moving_violation_history = allValues.moving_violation_history;
      if (allValues.equipment_experience) payload.equipment_experience = allValues.equipment_experience;
      if (allValues.equipment_owned) payload.equipment_owned = allValues.equipment_owned;
      if (allValues.vehicles) payload.vehicles = allValues.vehicles;
      if (allValues.meta) payload.meta = allValues.meta;

      // Debug logging
      console.log('=== Applicant Update Payload ===');
      console.log('SSN in payload:', payload.ssn);
      console.log('Full payload:', payload);

      // Send ONE consolidated PUT request
      const applicantApi = new ApplicantApi();
      const saved = await applicantApi.update(applicant?.id, payload);

      // Debug logging
      console.log('=== Applicant Update Response ===');
      console.log('SSN in response:', (saved as any)?.ssn);
      console.log('SSN last4 in response:', (saved as any)?.ssn_last4);

      // Update the entity
      setApplicant({ ...applicant, ...saved });

      toast.dismiss();
      toast.success(t('Applicant Updated Successfully') || 'Changes saved');

      // Clear validation errors on successful save
      setValidationErrors([]);

      // Reset dirty state for all forms after successful save
      const dirtyRegistry = (window as any).__applicantFormDirty || {};
      Object.keys(dirtyRegistry).forEach((formId) => {
        const resetDirtyFn = (window as any).__applicantFormResetDirty?.[formId];
        if (resetDirtyFn && typeof resetDirtyFn === 'function') {
          resetDirtyFn();
        }
      });
      setHasUnsavedChanges(false);

      // Refetch to get updated data
      setRefetchApplicant(!refetchApplicant);

    } catch (error) {
      console.error('Save error:', error);
      toast.error(t('Failed to save changes'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {unsavedChangesWarning}

      {/* Validation Error Panel */}
      {validationErrors.length > 0 && (
        <ValidationErrorPanel
          validationErrors={validationErrors}
          onClose={() => setValidationErrors([])}
        />
      )}

      {/* Fixed Update Button - stays in upper right as user scrolls */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            opacity: 1,
            padding: '10px 20px',
            borderRadius: '0.375rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
            fontWeight: 500,
            fontSize: '14px',
            border: '1px solid #dee2e6',
            color: '#000'
          }}
        >
          {applicant?.first_name} {applicant?.last_name}
        </div>
        <Button
          type="button"
          className={`btn btn-primary`}
          onClick={handleSave}
          disabled={isSaving}
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            borderRadius: '0.375rem'
          }}
        >
          {isSaving ? 'Updating' : t('UPDATE') || 'Update'}
        </Button>
      </div>

      <ChildPageLayout
        title={t('EDIT_{name}', { name: 'APPLICANT' }, { translateProps: true })}
        backPath={backPath}
        actions={(
          <div className="d-flex gap-2">
            <HireApplicantForm entity={applicant} />
            <Button
              type="button"
              className="btn theme-primary-btn"
              onClick={handleSave}
              disabled={isSaving}
              style={{ borderRadius: '0.375rem' }}
            >
              {isSaving ? 'Updating' : t('UPDATE') || 'Update'}
            </Button>
          </div>
        )}
      >
      {/* Identity summary and sticky sub-nav removed per design direction */}
      {applicant?.first_name && applicant?.last_name && (
        <div className="px-2 mb-3">
          <h4 style={{ fontWeight: 'bold' }}>
            {applicant.first_name} {applicant.last_name}
          </h4>
        </div>
      )}

      <EditApplicantFormNew
        entity={applicant}
        setEntity={setApplicant}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        applicantSuggestedJobs={applicantSuggestedJobs}
        hideHeaderActions
        hideGlobalSave
        onSaveComplete={() => {
          // Trigger refetch to reload fresh data from database
          setRefetchApplicant(!refetchApplicant);
        }}
      />
    </ChildPageLayout>
    </>
  );
}

EditApplicant.getLayout = function getLayout(page) {
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
    console.error('EditApplicant error:', error);
    return { props: { id: null } };
  }
}



import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { XCircleFill, ShieldFillX, ArrowLeft } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import FullLayout from '../../../../../components/dashboard/layouts/layout/full-layout';
import { EditApplicantFormNew } from '../../../../../components/forms/company/edit-applicant-form-new';
import ChildPageLayout from '../../../../../components/layouts/page/child-page-layout';
import { useTranslation } from '../../../../../hooks/use-translation';
import { useUnsavedChangesWarning } from '../../../../../hooks/use-unsaved-changes-warning';
import { ApplicantEntity } from '../../../../../models/applicant/applicant.entity';
import { ApplicantSuggestedJobEntity } from '../../../../../models/applicant/applicant-suggested-job.entity';
import { useEffectAsync } from '../../../../../utils/react';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Track scroll position to show/hide floating header
  useEffect(() => {
    const handleScroll = () => {
      // Show floating header after scrolling down 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffectAsync(async () => {
    if (id) {
      try {
        const api = new ApplicantApi();
        const entity = await api.getById(+id, true, ['documents', 'notes', 'notes.user', 'jobs', 'jobs.job', 'extras', 'dac', 'employers', 'accident_history', 'moving_violation_history', 'equipment_experience', 'equipment_owned']);

        const suggestedJobs = await api.suggestedJobs.get(id);
        setApplicantSuggestedJobs(suggestedJobs || []);

        if (entity) {
          // Debug logging to verify jobs.job relation is loaded
          const jobsWithoutTitle = entity.jobs?.filter(j => !j.job?.title) || [];
          console.log('EditApplicant: Loaded applicant with jobs:', {
            totalJobs: entity.jobs?.length || 0,
            jobsWithTitle: entity.jobs?.filter(j => j.job?.title).length || 0,
            jobsWithoutTitle: jobsWithoutTitle.length,
            sampleJob: entity.jobs?.[0],
          });

          // WORKAROUND: If jobs don't have titles (relation not fully loaded), fetch job details separately
          if (jobsWithoutTitle.length > 0) {
            console.warn('Jobs.job relation not loaded by backend. Fetching job details separately...', {
              jobsToFetch: jobsWithoutTitle.map(j => ({
                applicantJobId: j.id,
                jobId: j.job?.id || (j.job as any),
                jobStructure: typeof j.job,
              })),
            });

            const JobApi = (await import('../../../../api/job')).default;
            const jobApi = new JobApi();

            // Fetch job details for each applicant job that's missing the relation
            const jobPromises = jobsWithoutTitle.map(async (appliedJob) => {
              // The job might be just an ID number, an object with ID, or undefined
              const jobId = typeof appliedJob.job === 'number' ? appliedJob.job : appliedJob.job?.id;

              if (jobId) {
                try {
                  const jobDetails = await jobApi.getById(jobId);
                  return { appliedJobId: appliedJob.id, jobDetails };
                } catch (error) {
                  console.error(`Failed to fetch job ${jobId}:`, error);
                  return null;
                }
              }
              console.warn('Cannot fetch job - no ID available for applicant job:', appliedJob.id);
              return null;
            });

            const jobResults = await Promise.all(jobPromises);

            // Merge the job details back into the applicant jobs
            entity.jobs = entity.jobs?.map(appliedJob => {
              if (!appliedJob.job?.title) {
                const result = jobResults.find(r => r && r.appliedJobId === appliedJob.id);
                if (result?.jobDetails) {
                  return { ...appliedJob, job: result.jobDetails };
                }
              }
              return appliedJob;
            }) || [];

            console.log('After enriching jobs:', {
              totalJobs: entity.jobs.length,
              jobsWithTitle: entity.jobs.filter(j => j.job?.title).length,
              jobsStillMissing: entity.jobs.filter(j => !j.job?.title).length,
            });
          }

          setApplicant(entity);
          // Extract eligibility from the response if it exists
          if ((entity as any).eligibility) {
            setEligibility((entity as any).eligibility);
          }
          setLoading(false);
        } else {
          // If entity is null, treat as not found
          setError({
            status: 404,
            message: t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true })
          });
          setLoading(false);
        }
      } catch (error: any) {
        console.error('Error loading applicant:', error);

        // Handle 403 Forbidden and 404 Not Found the same way (don't reveal if resource exists)
        if (error?.response?.status === 403 || error?.response?.status === 404) {
          setError({
            status: 404,
            message: t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true })
          });
          setLoading(false);
          return;
        }

        // For other errors, set generic error message
        setError({
          status: error?.response?.status || 500,
          message: t('ERROR_MESSAGE_DEFAULT')
        });
        setLoading(false);
      }
    } else {
      setError({
        status: 404,
        message: t('UNABLE_TO_FIND_{name}', { name: 'APPLICANT' }, { translateProps: true })
      });
      setLoading(false);
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

      // Update the entity, but preserve relations that weren't included in the update response
      // The update response doesn't include nested relations like jobs.job, documents, notes, etc.
      const { jobs: _jobs, documents: _documents, notes: _notes, dac: _dac, voeData: _voeData, ...savedWithoutRelations } = saved as any;
      setApplicant({ ...applicant, ...savedWithoutRelations });

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

    } catch (error: any) {
      console.error('Save error:', error);

      // Try to extract validation errors from backend response
      const backendErrors = error?.response?.data;

      // Map of fields to their corresponding forms
      const fieldToFormMap: Record<string, string> = {
        // Licensing form fields
        'license_expiry': 'licensing',
        'license_number': 'licensing',
        'license_state': 'licensing',
        'license_type': 'licensing',
        'years_cdl_experience': 'licensing',
        'endorsements': 'licensing',
        'endorsements_other': 'licensing',
        'license_restrictions': 'licensing',
        'license_restrictions_other': 'licensing',
        'transmission_type': 'licensing',

        // Basic details form fields
        'first_name': 'basic-details',
        'last_name': 'basic-details',
        'phone': 'basic-details',
        'email': 'basic-details',
        'address_1': 'basic-details',
        'address_2': 'basic-details',
        'city': 'basic-details',
        'state': 'basic-details',
        'zip_code': 'basic-details',
        'birthdate': 'basic-details',
        'ssn': 'basic-details',
      };

      if (backendErrors && typeof backendErrors === 'object') {
        // Check if it's a standard validation error response
        if (backendErrors.errors && typeof backendErrors.errors === 'object') {
          const errors = backendErrors.errors;
          let hasSetError = false;

          // Group errors by form
          const errorsByForm: Record<string, Record<string, string>> = {};

          // Try to set errors on the appropriate form
          Object.keys(errors).forEach((fieldName) => {
            const formId = fieldToFormMap[fieldName];

            if (formId) {
              const errorMessage = errors[fieldName];
              console.log(`Backend validation error for ${fieldName} in form ${formId}:`, errorMessage);
              hasSetError = true;

              // Group errors by form
              if (!errorsByForm[formId]) {
                errorsByForm[formId] = {};
              }
              errorsByForm[formId][fieldName] = t(errorMessage) || errorMessage;
            }
          });

          // Set errors on each form using the registry
          let firstErrorFormId: string | null = null;
          let firstErrorField: string | null = null;

          Object.keys(errorsByForm).forEach((formId) => {
            const formErrors = errorsByForm[formId];
            const setErrorsFn = (window as any).__applicantFormSetErrors?.[formId];
            if (setErrorsFn && typeof setErrorsFn === 'function') {
              setErrorsFn(formErrors);

              // Track the first error for scrolling
              if (!firstErrorFormId) {
                firstErrorFormId = formId;
                firstErrorField = Object.keys(formErrors)[0];
              }
            }

            // Also set validation errors to trigger the panel
            setValidationErrors(prev => [
              ...prev,
              { formId, errors: formErrors }
            ]);
          });

          if (hasSetError) {
            // Scroll to the first error field
            if (firstErrorFormId) {
              // Scroll to the form section
              const sectionElement = document.getElementById(firstErrorFormId);
              if (sectionElement) {
                sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }

              // Try to focus the specific field after a brief delay
              if (firstErrorField) {
                setTimeout(() => {
                  const fieldElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
                  if (fieldElement) {
                    fieldElement.focus();
                  }
                }, 300);
              }
            }

            // Show a generic message
            toast.error(t('Please fix validation errors before saving. Check the highlighted fields.'));
            return; // Don't show the generic "Failed to save" message
          }
        } else if (backendErrors.message) {
          // Handle class-validator error format
          const messages = Array.isArray(backendErrors.message) ? backendErrors.message : [backendErrors.message];
          messages.forEach(msg => toast.error(t(msg)));
          return;
        }
      }

      toast.error(t('Failed to save changes'));
    } finally {
      setIsSaving(false);
    }
  };

  // Show nothing while loading (prevents flash of default content)
  if (loading && !error) {
    return null;
  }

  // If error exists, show full-page error instead of normal content
  if (error) {
    return (
      <ChildPageLayout
        backPath={backPath}
        title={t('APPLICANT_NOT_FOUND')}
      >
        <Container className="py-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="mb-4">
                <XCircleFill size={64} className="text-danger mb-3" />
                <h4 className="mb-3">{t('APPLICANT_NOT_FOUND')}</h4>
                <p className="text-muted mb-4">{error.message}</p>
                <Link href={backPath}>
                  <Button variant="primary">
                    <ArrowLeft className="me-2" />
                    {t('BACK_TO_APPLICANTS')}
                  </Button>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </ChildPageLayout>
    );
  }

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

      {/* Fixed Update Button - appears when user scrolls down */}
      {isScrolled && (
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
      )}

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



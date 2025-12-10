import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import { EditApplicantFormNew } from "../../../../components/forms/company/edit-applicant-form-new";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../api/applicant";

export default function CreateApplicant() {
  const router = useRouter();
  const { t } = useTranslation();

  const backPath = "/dashboard/company/applicants";
  const [applicant, setApplicant] = useState<ApplicantEntity>(new ApplicantEntity());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

  const handleSave = async () => {
    try {
      // Call all registered getter functions to get CURRENT form values
      const registry = (window as any).__applicantFormRegistry || {};
      const validationRegistry = (window as any).__applicantFormValidation || {};
      const allValues: any = { ...applicant };

      // First, collect all validation errors
      const allErrors: any = {};
      Object.keys(validationRegistry).forEach((formId) => {
        const validator = validationRegistry[formId];
        if (validator && typeof validator === 'function') {
          const formErrors = validator();
          if (formErrors && Object.keys(formErrors).length > 0) {
            allErrors[formId] = formErrors;
          }
        }
      });

      // If there are validation errors, scroll to first error and show toast
      if (Object.keys(allErrors).length > 0) {
        const firstFormWithErrors = Object.keys(allErrors)[0];
        const firstError = allErrors[firstFormWithErrors];
        const firstErrorField = Object.keys(firstError)[0];
        const firstErrorMessage = firstError[firstErrorField];

        // Try to find and focus the first error field
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }

        toast.dismiss();
        toast.error(`Validation Error: ${firstErrorMessage}`);
        return;
      }

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
            // Assign all other fields
            const { extras, ...otherFields } = formValues;
            Object.assign(allValues, otherFields);
          }
        }
      });

      // Intelligently merge extras
      const extrasMap = new Map();

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

      allValues.extras = Array.from(extrasMap.values());

      // Strip out fields that shouldn't be sent to backend
      const {
        jobs, documents, notes, dac, voeData, meta,
        ...payload
      } = allValues;

      // Keep certain relations that should be sent
      if (allValues.employers) payload.employers = allValues.employers;
      if (allValues.extras) payload.extras = allValues.extras;
      if (allValues.accident_history) payload.accident_history = allValues.accident_history;
      if (allValues.moving_violation_history) payload.moving_violation_history = allValues.moving_violation_history;
      if (allValues.equipment_experience) payload.equipment_experience = allValues.equipment_experience;
      if (allValues.equipment_owned) payload.equipment_owned = allValues.equipment_owned;
      if (allValues.vehicles) payload.vehicles = allValues.vehicles;

      // Create the applicant
      const applicantApi = new ApplicantApi();
      const saved = await applicantApi.create(payload);

      // Update the entity
      setApplicant({ ...applicant, ...saved });

      toast.dismiss();
      toast.success(t('Applicant Created Successfully') || 'Applicant created successfully');

      // Redirect
      goBack();
    } catch (error: any) {
      console.error('Save error:', error);

      // Handle validation errors from the backend
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(t('Failed to create applicant'));
      }
    }
  };

  return (
    <ChildPageLayout
      title={t("ADD_{name}", { name: "APPLICANT" }, { translateProps: true })}
      backPath={backPath}
      actions={
        <>
          <Button
            type="button"
            className={`btn btn-light me-2`}
            onClick={() => router.push(backPath)}
          >
            {t("BACK")}
          </Button>
          <Button
            type="button"
            className={`btn theme-general-btn`}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {t("SAVE")}
          </Button>
        </>
      }
    >
      <nav aria-label="breadcrumb" className="px-2 mb-2">
        <div className="d-flex align-items-center small text-muted">
          <Link href="/dashboard">
            <a className="text-muted text-decoration-none">Dashboard</a>
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/dashboard/company/applicants">
            <a className="text-muted text-decoration-none">Applicants</a>
          </Link>
          <span className="mx-2">&gt;</span>
          <strong className="text-dark">Add Applicant</strong>
        </div>
      </nav>

      <EditApplicantFormNew
        entity={applicant}
        setEntity={setApplicant}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        hideHeaderActions
        onSaveComplete={() => {
          // After creating, redirect to the list
          goBack();
        }}
      />
    </ChildPageLayout>
  );
}

CreateApplicant.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};


import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import { BaseFormProps } from "./base-form-props";
import { ApplicantBasicDetailsFormNew } from "./applicant-basic-details-form-new";
import { ApplicantWorkHistoryForm } from "./applicant-work-history-form";
import { ApplicantEquipmentExperienceForm } from "./applicant-equipment-experience-form";
import { ApplicantEquipmentOwnForm } from "./applicant-equipment-own-form";
import { ApplicantSafetyBackgroundForm } from "./applicant-safety-background-form";
import { ApplicantSignedAgreementsForm } from "./applicant-signed-agreements-form";
import { ApplicantAlreadyWorkedForm } from "./applicant-already-worked-form";
import { HireApplicantForm } from "./hire-applicant-form";
import { ApplicantLicensingForm } from "./applicant-licensing-form";
import Section from "../../view-details/section";
import CompanyApi from "../../../pages/api/company";
import ApplicantApi from "../../../pages/api/applicant";
import { ApplicantExtras as ApplicantExtrasEnum } from "../../../enums/applicants/applicant-extras.enum";
import ApplicantJobsAppliedTo from "../../applicants/applicant-jobs-applied-to";
import { ApplicantSuggestedJobEntity } from "../../../models/applicant/applicant-suggested-job.entity";
import OnboardingChecklist from "../../applicants/onboarding-checklist";
import { ApplicantApplicationChecklistForm } from "./applicant-application-checklist-form";
import { ApplicantNotesForm } from "./applicant-notes-form";
import { ApplicantEmergencyContactForm } from "./applicant-emergency-contact-form";
import { ApplicantPreferencesForm } from "./applicant-preferences-form";

export interface EditApplicantFormNewProps extends BaseFormProps<ApplicantEntity> {
  isSubmitting: boolean;
  setIsSubmitting(value: boolean): void;
  applicantSuggestedJobs?: ApplicantSuggestedJobEntity[];
  hideHeaderActions?: boolean;
  hideGlobalSave?: boolean;
  onSaveComplete?: () => void;
}

// Global registry for form values
if (typeof window !== 'undefined') {
  (window as any).__applicantFormRegistry = (window as any).__applicantFormRegistry || {};
}

export function EditApplicantFormNew(props: EditApplicantFormNewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const routeToApplicants = () => router.push("/dashboard/company/applicants");

  return (
    <>
      {/* Header actions (optional) */}
      {!props?.hideHeaderActions && (
        <Row className="px-2">
          <Col xs="12" className="text-end">
            <HireApplicantForm entity={props?.entity} className={props?.className} />
            <Button
              type="button"
              className={`btn theme-general-btn mr-2`}
              onClick={() => routeToApplicants()}
            >
              {t("BACK")}
            </Button>
          </Col>
        </Row>
      )}
      {/* Basic information, contact, address */}
      <div id="basic-info" />
      <Row className="px-2">
        <ApplicantBasicDetailsFormNew
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
          showLicensing={false}
          showPreferences={false}
          hideActions
        />
      </Row>

      {/* CDL Information */}
      <div id="licensing" />
      <ApplicantLicensingForm entity={props?.entity} setEntity={props?.setEntity} />


      {/* Equipment experience */}
      <div id="equipment" />
      <Row className="px-2">
        <ApplicantEquipmentExperienceForm
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          entity={props?.entity}
          className={props?.className}
          setEntity={props?.setEntity}
          hideActions
          hideAddButton={false}
        />
      </Row>

      {/* Equipment owned (for owner-operators) */}
      <div id="equipment-owned" />
      <Row className="px-2">
        <ApplicantEquipmentOwnForm
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          entity={props?.entity}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Previous employment */}
      <div id="work-history" />
      <Row className="px-2">
        <ApplicantWorkHistoryForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
          hideActions
        />
      </Row>

      {/* Safety background */}
      <div id="safety" />
      <Row className="px-2">
        <ApplicantSafetyBackgroundForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
          hideActions
        />
      </Row>

      {/* Already worked/applied at company */}
      <div id="already-worked" />
      <Row className="px-2">
        <ApplicantAlreadyWorkedForm
          entity={props?.entity}
          isSubmitting={props?.isSubmitting}
          setIsSubmitting={props?.setIsSubmitting}
          className={props?.className}
          setEntity={props?.setEntity}
        />
      </Row>

      {/* Preferences */}
      <div id="preferences" />
      <ApplicantPreferencesForm entity={props?.entity} setEntity={props?.setEntity} hideActions />

      {/* Job(s) Applied To */}
      <div id="jobs-applied-to" />
      <ApplicantJobsAppliedTo applicant={props?.entity} applicantSuggestedJobs={props?.applicantSuggestedJobs || []} />


      {/* Onboarding Documents */}
      <div id="onboarding-documents" />
      {props?.entity?.id && (
        <Row>
          <Col>
            <OnboardingChecklist
              showHistory
              title="ONBOARDING_DOCUMENTS"
              useSectionContainer
              applicant={props?.entity as any}
              canEdit={!Boolean(props?.entity?.is_hired)}
              showCompleted={true}
              canEditSafetyPerformance={true}
              showResendButton={true}
            />
          </Col>
        </Row>
      )}

      {/* Application Checklist */}
      <div id="application-checklist" />
      <ApplicantApplicationChecklistForm entity={props?.entity} setEntity={props?.setEntity} />

      {/* Notes */}
      <div id="notes" />
      <ApplicantNotesForm entity={props?.entity} setEntity={props?.setEntity} />

      {/* Emergency Contact Information */}
      <div id="emergency-contact" />
      <ApplicantEmergencyContactForm entity={props?.entity} setEntity={props?.setEntity} />

      {/* Global Save (optional) */}
      {!props?.hideGlobalSave && (
        <div className="px-2 py-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button
            type="button"
            className={`btn btn-light`}
            onClick={() => routeToApplicants()}
          >
            {t('BACK')}
          </Button>
          <Button
            type="button"
            className={`btn theme-general-btn`}
            onClick={async () => {
              try {
                // Call all registered getter functions to get CURRENT form values
                const registry = (window as any).__applicantFormRegistry || {};
                const allValues: any = { ...props?.entity };
                
                console.log('Registry keys:', Object.keys(registry));
                console.log('Initial entity extras DOT_NUMBER:', 
                  (props?.entity?.extras || []).find((e: any) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value);
                
                // Collect all extras arrays from forms to merge them
                const extrasArrays: any[] = [];
                const formExtrasMap = new Map(); // Track which form provided which extras
                
                // Call each getter function to get current values
                Object.keys(registry).forEach((formId) => {
                  const getter = registry[formId];
                  if (getter && typeof getter === 'function') {
                    const formValues = getter();
                    console.log(`${formId} values:`, formValues);
                    if (formValues && typeof formValues === 'object') {
                      // Collect extras arrays separately for intelligent merging
                      if (formValues.extras && Array.isArray(formValues.extras)) {
                        extrasArrays.push({ formId, extras: formValues.extras });
                        // Track which extras come from which form
                        formValues.extras.forEach((extra: any) => {
                          if (extra?.type) {
                            formExtrasMap.set(extra.type, { formId, extra });
                          }
                        });
                      }
                      // Assign all other fields (will overwrite, but that's OK for scalar fields)
                      const { extras, ...otherFields } = formValues;
                      Object.assign(allValues, otherFields);
                    }
                  }
                });
                
                console.log('Form extras map DOT_NUMBER:', formExtrasMap.get(ApplicantExtrasEnum.DOT_NUMBER));
                
                // Intelligently merge extras: keep all unique types, last one wins for duplicates
                const extrasMap = new Map();
                
                // Start with existing extras from entity, but filter out DOT_NUMBER and BUSINESS_NAME
                // (these are managed by licensing form and should come from there)
                (props?.entity?.extras || []).forEach((extra: any) => {
                  if (extra?.type && 
                      extra.type !== ApplicantExtrasEnum.DOT_NUMBER &&
                      extra.type !== ApplicantExtrasEnum.BUSINESS_NAME) {
                    extrasMap.set(extra.type, extra);
                  }
                });
                
                // Merge in extras from all forms (later forms overwrite earlier ones)
                // Process licensing form last to ensure its DOT_NUMBER and BUSINESS_NAME win
                if (extrasArrays.length > 0) {
                  const sortedExtrasArrays = extrasArrays.sort((a, b) => {
                    if (a.formId === 'licensing') return 1; // Process licensing last
                    if (b.formId === 'licensing') return -1;
                    return 0;
                  });
                  
                  sortedExtrasArrays.forEach(({ formId, extras: extrasArray }) => {
                    console.log(`Processing extras from ${formId}:`, extrasArray);
                    extrasArray.forEach((extra: any) => {
                      if (extra?.type) {
                        const oldValue = extrasMap.get(extra.type)?.value;
                        extrasMap.set(extra.type, extra);
                        console.log(`  Set ${extra.type} = ${extra.value} from ${formId} (was: ${oldValue})`);
                      }
                    });
                  });
                }
                
                // Completely replace allValues.extras with merged extras
                allValues.extras = Array.from(extrasMap.values());
                console.log('Final merged extras DOT_NUMBER:', 
                  allValues.extras.find((e: any) => e.type === ApplicantExtrasEnum.DOT_NUMBER)?.value);
                console.log('Final merged extras count:', allValues.extras.length);
                
                console.log('Merged values:', allValues);
                
                // Strip out fields that shouldn't be sent to backend (relations handled separately)
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
                
                console.log('Final payload:', payload);
                
                // Send ONE consolidated PUT request
                const applicantApi = new ApplicantApi();
                const saved = await applicantApi.update(props?.entity?.id, payload);
                
                // Update the entity
                props?.setEntity?.({ ...props?.entity, ...saved });
                
                toast.dismiss();
                toast.success(t('Applicant Updated Successfully') || 'Changes saved');
                
                // Refetch to get updated data
                if (props.onSaveComplete) {
                  props.onSaveComplete();
                }
              } catch (error) {
                console.error('Save error:', error);
                toast.error(t('Failed to save changes'));
              }
            }}
          >
            {t('SAVE')}
          </Button>
        </div>
      )}

    </>
  );
}



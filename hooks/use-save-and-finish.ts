import { useContext } from 'react';
import { toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../context/jotform-context';
import { useTranslation } from '../hooks/use-translation';
import ApplicantApi from '../pages/api/applicant';
import { ApplicantStatus } from '../enums/applicants/applicant-status.enum';

/**
 * Hook for handling Save & Finish functionality in prefilled applications
 */
export const useSaveAndFinish = () => {
  const {
    state: { applicant, applicantExtras, jobs },
    method: { setSteps },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();

  const handleSaveAndFinish = async () => {
    try {
      if (!applicant?.id) {
        throw new Error('No applicant found');
      }

      const applicantApi = new ApplicantApi();

      // Update the applicant with current form data
      await applicantApi.update(applicant.id, {
        ...applicant,
        // Ensure we save the applicant extras as well
        extras: applicantExtras,
      });

      // If there are selected jobs, create job applications
      if (jobs && jobs.length > 0) {
        for (const job of jobs) {
          await applicantApi.jobs.create(applicant.id, job.id, {
            status: ApplicantStatus.NEW_APPLIED_SHORT_FORM,
          });
        }
      }

      toast.success(t('APPLICATION_SAVED_SUCCESSFULLY'));

      // Navigate to thank you page
      setSteps(28); // Thank you page step
    } catch (error) {
      console.error('Error saving and finishing application:', error);
      toast.error(t('ERROR_SAVING_APPLICATION'));
    }
  };

  return { handleSaveAndFinish };
};

/**
 * Translation keys to add to your translation files:
 *
 * APPLICATION_SUMMARY: "Application Summary"
 * REVIEW_YOUR_INFORMATION_BELOW: "Review your information below and make any necessary changes."
 * CLICK_ANY_SECTION_TO_EDIT: "Click any section to edit that information."
 * CONTINUE_TO_DETAILED_APPLICATION: "Continue to Detailed Application"
 * YOU_CAN_RETURN_TO_THIS_SUMMARY_ANYTIME: "You can return to this summary anytime during the application process."
 * RETURN_TO_SUMMARY: "Return to Summary"
 * SAVE_AND_FINISH: "Save & Finish"
 * APPLICATION_SAVED_SUCCESSFULLY: "Your application has been saved successfully!"
 * ERROR_SAVING_APPLICATION: "There was an error saving your application. Please try again."
 * UPDATE_MODE_INDICATOR: "Updating existing application"
 */

import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Alert, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import JotformContext, { JotFormContextType } from '../../../../../context/jotform-context';
import { ApplicantExtras } from '../../../../../enums/applicants/applicant-extras.enum';
import { ApplicantStatus } from '../../../../../enums/applicants/applicant-status.enum';
import { MessageStatus } from '../../../../../enums/conversation/message-status.enum';
import { useTranslation } from '../../../../../hooks/use-translation';
import { ApplicantOTPEntity } from '../../../../../models/applicant/applicant-otp.entity';
import { PhoneNumberDto } from '../../../../../models/jot-form/short-form/phone-number.dto';
import ApplicantApi from '../../../../../pages/api/applicant';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { globalAjaxExceptionHandler } from '../../../../../utils/ajax';
import { LoaderIcon } from '../../../../loading/loader-icon';
import ViewModal from '../../../../view-details/view-modal';
import BaseInputPhone from '../../../base-input-phone';
import { FormActions } from '../../form-buttons';
import { OTPInput, FormLabel } from '../../../../shared/dha';
import { PrimaryButton, SecondaryButton } from '../../form-buttons';
import { socketInitializer } from './socketInitializer';
import { SameCompanySameJobAlert } from './SameCompanySameJobAlert';
import { DifferentCompanySameApplicantAlert } from './DifferentCompanySameApplicantAlert';

// Types for better UX flow management
interface ExistingApplicantScenario {
  type:
    | 'SAME_COMPANY_SAME_JOB'
    | 'SAME_COMPANY_NEW_JOB'
    | 'SAME_COMPANY_NO_JOB'
    | 'DIFFERENT_COMPANY'
    | 'DIFFERENT_COMPANY_PREFILL'
    | 'NEW_APPLICANT';
  applicant?: any;
  hasAppliedToCurrentJob?: boolean;
  jobTitle?: string;
  companyName?: string;
  mostRecentCompanyName?: string;
  mostRecentApplicant?: any;
}

export function PhoneNumber() {
  const {
    state: { applicant, companyJobs, steps, company, directJob, isDirectJobApplication },
    method: {
      setApplicant,
      setJobs,
      setSteps,
      stepNext,
      stepBack,
      setIsEditingExistingApplicant,
      setIsPrefilled,
      setApplicantExtras,
    },
  }: JotFormContextType = useContext(JotformContext);

  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [showOtpField, seShowtOtpField] = useState<boolean>(false);
  const [otpApplicant, setOtpApplicant] = useState<ApplicantOTPEntity>(null);
  const [otpException, setOtpException] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isVerificationSuccessful, setIsVerificationSuccessful] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [applicantScenario, setApplicantScenario] = useState<ExistingApplicantScenario | null>(
    null
  );
  const [isCreatingJobApplication, setIsCreatingJobApplication] = useState<boolean>(false);
  const [showAlreadyAppliedAlert, setShowAlreadyAppliedAlert] = useState<boolean>(false);
  const [shouldPrefillApplication, setShouldPrefillApplication] = useState<boolean>(false);

  // Helper function to analyze applicant scenario
  const analyzeApplicantScenario = (existingApplicants: any[]): ExistingApplicantScenario => {
    const currentCompanyApplicant = existingApplicants.find(
      (applicant) => applicant.company?.id === company?.id
    );

    if (currentCompanyApplicant) {
      // Check if they've already applied to this specific job (if it's a direct job application)
      if (isDirectJobApplication && directJob) {
        const hasAppliedToCurrentJob = currentCompanyApplicant.jobs?.some(
          (job: any) => job.job?.id === directJob.id
        );

        if (hasAppliedToCurrentJob) {
          return {
            type: 'SAME_COMPANY_SAME_JOB',
            applicant: currentCompanyApplicant,
            hasAppliedToCurrentJob: true,
            jobTitle: directJob.title,
            companyName: company.name,
          };
        } else {
          return {
            type: 'SAME_COMPANY_NEW_JOB',
            applicant: currentCompanyApplicant,
            hasAppliedToCurrentJob: false,
            jobTitle: directJob.title,
            companyName: company.name,
          };
        }
      } else {
        // No direct job application, but same company - this is a general application update
        return {
          type: 'SAME_COMPANY_NO_JOB',
          applicant: currentCompanyApplicant,
          hasAppliedToCurrentJob: true, // They have a general application
          companyName: company.name,
        };
      }
    } else if (existingApplicants.length > 0) {
      // Has applied to other companies - get most recent for potential prefill
      const mostRecentApplicant = existingApplicants[0]; // Already ordered by created_at DESC
      return {
        type: 'DIFFERENT_COMPANY_PREFILL',
        companyName: company.name,
        jobTitle: directJob?.title,
        mostRecentCompanyName: mostRecentApplicant?.company?.name,
        mostRecentApplicant: mostRecentApplicant,
      };
    } else {
      // Completely new applicant
      return {
        type: 'NEW_APPLICANT',
        companyName: company.name,
        jobTitle: directJob?.title,
      };
    }
  };

  // Enhanced function to create job application immediately after phone verification
  const createJobApplicationImmediately = async (applicantData: any) => {
    if (!isDirectJobApplication || !directJob) return;

    try {
      setIsCreatingJobApplication(true);
      const applicantApi = new ApplicantApi();

      // Create the applicant-job relationship immediately
      await applicantApi.jobs.create(applicantData.id, directJob.id, {
        status: ApplicantStatus.NEW_APPLIED_SHORT_FORM,
      });

      toast.success(t('JOB_APPLICATION_CREATED_SUCCESS', { jobTitle: directJob.title }));
    } catch (error) {
      console.error('Failed to create job application:', error);
      toast.error(t('JOB_APPLICATION_CREATION_FAILED'));
    } finally {
      setIsCreatingJobApplication(false);
    }
  };

  const form = useFormik({
    initialValues: new PhoneNumberDto(),
    validationSchema: PhoneNumberDto.yupSchema(),
    onSubmit: async (values, { setErrors }) => {
      try {
        const { phone } = values;
        const applicantApi = new ApplicantApi();

        // Check if applicant has already applied for any jobs with this phone number
        const appliedJobs = await applicantApi.getAppliedJobsByPhone(phone);

        // Check if they've already applied to this specific job
        if (isDirectJobApplication && directJob) {
          const hasAppliedToCurrentJob = appliedJobs.some(
            (appliedJob) =>
              appliedJob.job?.id === directJob.id && appliedJob.company?.id === company?.id
          );

          if (hasAppliedToCurrentJob) {
            // User has already applied to this specific job - show immediate alert
            setShowAlreadyAppliedAlert(true);
            setApplicantScenario({
              type: 'SAME_COMPANY_SAME_JOB',
              hasAppliedToCurrentJob: true,
              jobTitle: directJob.title,
              companyName: company.name,
            });
            return; // Don't proceed further
          }
        }

        // If no direct conflict, continue with the existing applicant search flow
        const existingApplicants = await applicantApi.searchApplicantsByPhone({
          phone,
        });

        // Analyze the scenario for better UX
        const scenario = analyzeApplicantScenario(existingApplicants);
        setApplicantScenario(scenario);

        if (scenario.type === 'SAME_COMPANY_NEW_JOB') {
          // Show modal to confirm they want to apply to a new job with existing profile
          setOpenModal(true);
        } else if (scenario.type === 'SAME_COMPANY_NO_JOB') {
          // Show "Already Applied" alert for general applications when user already has a company application
          setShowAlreadyAppliedAlert(true);
          // Don't proceed - let user choose to access existing application or try different phone
        } else if (scenario.type === 'DIFFERENT_COMPANY_PREFILL') {
          // Show modal to offer prefilling with previous application data
          setOpenModal(true);
        } else {
          // NEW_APPLICANT or other scenarios - proceed normally
          setApplicant({
            ...applicant,
            phone,
          });
          stepNext();
        }
      } catch (error) {
        console.log('error', error);
        // If there's an error (like applicant not found), just proceed
        setApplicant({
          ...applicant,
          phone: values.phone,
        });
        stepNext();
      }
    },
    onReset: (values) => {
      companyJobs.length > 0 ? stepBack() : setSteps(steps - 2);
    },
  });

  useEffect(() => {
    form.setValues({
      ...form.values,
      phone: applicant.phone,
    });
  }, []);

  const verifyOTP = async () => {
    const applicantApi = new ApplicantApi();
    const applicantId = otpApplicant?.applicantId;

    try {
      setIsLoadingProfile(true);

      // For DIFFERENT_COMPANY_PREFILL, we need to get the full profile for prefilling
      let applicantProfile;
      if (applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' && shouldPrefillApplication) {
        // Get the most recent applicant profile with full data for prefilling
        applicantProfile = await applicantApi.getMostRecentApplicantForPrefill({
          phone: form.values.phone,
        });

        // Clear sensitive company-specific data while keeping personal information
        if (applicantProfile) {
          // Reset company-specific fields but keep personal data
          applicantProfile.company = company;
          applicantProfile.id = null; // This will create a new applicant
          applicantProfile.uuid_token = null;
          applicantProfile.jobs = [];
          applicantProfile.notes = [];
          applicantProfile.created_at = null;

          // Keep personal information for prefilling
          // first_name, last_name, phone, email, birthdate, etc. will be preserved
        }
      } else {
        // For same company scenarios, verify OTP and get existing profile
        applicantProfile = await applicantApi.verifyOTP({
          applicantId,
          otp,
        });
      }

      // Show verification success state
      setIsVerificationSuccessful(true);

      // Set applicant data
      if (applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' && shouldPrefillApplication) {
        // Use prefilled data for new company
        setApplicant({
          ...applicantProfile,
          documents: applicantProfile.documents || [], // Ensure documents are explicitly set
        });
        setApplicantExtras(applicantProfile.extras || []); // Set the extras from the prefilled profile
        setIsEditingExistingApplicant(false); // This is a new applicant with prefilled data
      } else {
        // Use existing profile for same company
        setApplicant({
          ...applicantProfile,
          documents: applicantProfile.documents || [], // Ensure documents are explicitly set
        });
        setApplicantExtras(applicantProfile.extras || []); // Set the extras from the existing profile
        setIsEditingExistingApplicant(true);
      }

      // Handle job application creation for SAME_COMPANY_NEW_JOB scenario
      if (
        applicantScenario?.type === 'SAME_COMPANY_NEW_JOB' &&
        isDirectJobApplication &&
        directJob
      ) {
        await createJobApplicationImmediately(applicantProfile);
      }

      // Ensure jobs are properly set in context for returning drivers
      // This is critical for the final submission to work correctly
      if (isDirectJobApplication && directJob) {
        // For direct job applications, ensure the direct job is in the jobs array
        setJobs([directJob]);
      } else if (applicantProfile?.jobs && applicantProfile.jobs.length > 0) {
        // For general applications, use the jobs from the applicant's profile
        // Extract just the job entities from the applicant-job relationships
        const jobEntities = applicantProfile.jobs.map((applicantJob: any) => applicantJob.job).filter((job: any) => job != null);
        if (jobEntities.length > 0) {
          setJobs(jobEntities);
        }
      }

      // Add a slight delay before proceeding to next step for better UX
      setTimeout(() => {
        setOpenModal(false);
        setIsLoadingProfile(false);

        // For users with existing profiles applying to new jobs, advance to Names & Basic Info
        // to allow them to review and update their basic information
        if (applicantScenario?.type === 'SAME_COMPANY_NEW_JOB') {
          // For returning users updating their application, show ApplicationSummary
          setIsPrefilled(true);
          setIsEditingExistingApplicant(true);
          setSteps(-1); // Special step for ApplicationSummary
        } else if (applicantScenario?.type === 'SAME_COMPANY_SAME_JOB') {
          // For returning users updating the same job application, show ApplicationSummary
          setIsPrefilled(true);
          setIsEditingExistingApplicant(true);
          setSteps(-1); // Special step for ApplicationSummary
        } else if (applicantScenario?.type === 'SAME_COMPANY_NO_JOB') {
          // For general company applications, show ApplicationSummary to review existing application
          setIsPrefilled(true);
          setIsEditingExistingApplicant(true);
          setSteps(-1); // Special step for ApplicationSummary
        } else if (
          applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' &&
          shouldPrefillApplication
        ) {
          // For prefilled applications, set the prefilled flag and go to ApplicationSummary
          setIsPrefilled(true);
          setIsEditingExistingApplicant(true);
          setSteps(-1); // Special step for ApplicationSummary
        } else {
          // For other scenarios, proceed normally to next step
          stepNext();
        }
      }, 2000);
    } catch (error) {
      globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
      setOtpException(true);
      setIsLoadingProfile(false);
    }
  };

  // Helper function to get modal title based on scenario
  const getModalTitle = (): string => {
    switch (applicantScenario?.type) {
      case 'SAME_COMPANY_SAME_JOB':
        return t('EXISTING_APPLICATION_FOUND');
      case 'SAME_COMPANY_NEW_JOB':
        return t('EXISTING_PROFILE_FOUND');
      case 'DIFFERENT_COMPANY_PREFILL':
        return t('PREVIOUS_APPLICATION_FOUND');
      default:
        return t('EXISTING_ACCOUNT_FOUND');
    }
  };

  // Helper function to get modal content based on scenario
  const getModalContent = (): JSX.Element => {
    if (!applicantScenario) return null;

    switch (applicantScenario.type) {
      case 'SAME_COMPANY_SAME_JOB':
        return (
          <Alert variant="warning" className="mb-4">
            <div className="text-center">
              <i
                className="fa fa-exclamation-triangle mb-3"
                style={{ fontSize: '48px', color: '#ffc107' }}
              />
              <h5 className="mb-3">{t('ALREADY_APPLIED_TO_THIS_JOB')}</h5>
              <p className="mb-2">
                {t('ALREADY_APPLIED_MESSAGE', {
                  jobTitle: applicantScenario.jobTitle,
                  companyName: applicantScenario.companyName,
                })}
              </p>
              <p className="mb-3">{t('REVIEW_AND_UPDATE_ENCOURAGEMENT')}</p>
              <p className="mb-0 text-success">
                <i className="fa fa-check-circle me-2" />
                {t('CHOOSE_REVIEW_UPDATE')}
              </p>
            </div>
          </Alert>
        );

      case 'SAME_COMPANY_NEW_JOB':
        return (
          <Alert variant="success" className="mb-4">
            <div className="text-center">
              <i className="fa fa-user-check mb-3" style={{ fontSize: '48px', color: '#28a745' }} />
              <h5 className="mb-3">{t('WELCOME_BACK')}</h5>
              <p className="mb-2">
                {t('WELCOME_BACK_EXISTING_PROFILE', {
                  companyName: applicantScenario.companyName,
                })}
              </p>
              {applicantScenario.jobTitle && (
                <p className="mb-2">
                  <strong>
                    {t('YOU_ARE_APPLYING_FOR_JOB', {
                      jobTitle: applicantScenario.jobTitle,
                    })}
                  </strong>
                </p>
              )}
              <p className="mb-0">
                We will update your profile and submit your application for this new position.
              </p>
            </div>
          </Alert>
        );

      case 'DIFFERENT_COMPANY_PREFILL':
        return (
          <Alert variant="info" className="mb-4">
            <div className="text-center">
              <i className="fa fa-copy mb-3" style={{ fontSize: '48px', color: '#17a2b8' }} />
              <h5 className="mb-3">Prefill Application Available</h5>
              <p className="mb-2">
                We found a previous application from {applicantScenario.mostRecentCompanyName}.
                Would you like to prefill your application for {applicantScenario.companyName} to
                save time?
              </p>
              {applicantScenario.jobTitle && (
                <p className="mb-2">
                  <strong>
                    {t('YOU_ARE_APPLYING_FOR_JOB', {
                      jobTitle: applicantScenario.jobTitle,
                    })}
                  </strong>
                </p>
              )}
              <p className="mb-0 text-success">
                <i className="fa fa-clock-o me-2" />
                Save time by using your previous application data
              </p>
            </div>
          </Alert>
        );

      default:
        return (
          <Alert variant="info" className="mb-4">
            <h5 className="mb-2">{t('EXISTING_PROFILE_FOUND')}</h5>
            <p className="mb-0">
              This phone number is associated with an existing application to this company.
            </p>
          </Alert>
        );
    }
  };

  const onCloseClick = () => {
    setOpenModal(false);
  };

  const handleGoToMyApplication = async () => {
    // User wants to access their existing application
    try {
      const applicantApi = new ApplicantApi();
      const { phone } = form.values;
      const OTPresponse = await applicantApi.requestOTP({ phone });
      setOtpApplicant(OTPresponse);
      seShowtOtpField(true);
      setOpenModal(true); // Open the modal to show OTP verification
      // Don't hide the alert immediately - let the OTP flow take precedence
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error(t('UNABLE_TO_SEND_OTP'));
    }
  };

  const handleTryDifferentPhone = () => {
    // Reset the form to allow user to enter a different phone number
    setShowAlreadyAppliedAlert(false);
    setApplicantScenario(null);
    form.resetForm();
  };

  const requestOTP = async () => {
    setIsResending(true);
    setOtpException(false);
    const applicantApi = new ApplicantApi();
    const { phone } = form.values;
    try {
      let otpResponse;

      if (applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL') {
        // For cross-company prefill, we don't need existing applicant ID
        // We'll use the phone number to get the most recent profile
        otpResponse = await applicantApi.requestOTP({ phone });
      } else {
        // For same company scenarios, use the existing flow
        otpResponse = await applicantApi.requestOTP({ phone });
      }

      setOtpApplicant(otpResponse);
      seShowtOtpField(true);
    } catch (error) {
      console.log('errors', error);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const typesToExclude = [
      ApplicantExtras.SIGNATURE,
      ApplicantExtras.SIGNATURE_VOE_AUTHORIZATION,
      ApplicantExtras.SIGNATURE_DISCLOSURE_AUTHORIZATION,
      ApplicantExtras.SIGNATURE_IMPORTANT_BACKGROUND,
      ApplicantExtras.SIGNATURE_GENERAL_CONSENT,
    ];

    const filteredSignature = applicant?.extras.filter((v) => !typesToExclude.includes(v.type));
    // if (!!applicant?.extras) setApplicantExtras([...filteredSignature])
  }, [applicant]);

  useEffect(() => {
    if (Boolean(otpApplicant?.applicant?.id) || Boolean(otpApplicant?.applicantId)) {
      console.log('socketInitializer');

      socketInitializer(
        otpApplicant?.applicantId || applicant?.id,
        ({ error_message, status, expiry }) => {
          if (expiry == new Date(otpApplicant?.expiry).toISOString()) {
            console.log('SmsStatus', {
              error_message,
              status,
              expiry,
            });
            if (Boolean(error_message)) {
              toast.error(t('UNABLE_TO_SEND_OTP'));
            }
            if (status == MessageStatus.SENT) {
              toast(t('OTP_MESSAGES_SENT'));
            }
            if (status == MessageStatus.DELIVERED) {
              toast.success(t('OTP_MESSAGES_DELIVERED'));
            }
          }
        }
      );
    }
  }, [otpApplicant, applicant]);

  return (
    <>
      <ToastContainer />
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('phone')}</h1>

      <div className="mb-4">
        <Alert variant="light" className="border">
          <h5 className="mb-3">{t('PHONE_NUMBER_FORM.WHY_WE_NEED_PHONE_NUMBER')}</h5>

          <div className="d-flex align-items-start mb-3">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-phone-square text-primary"
                style={{ fontSize: '24px' }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>{t('PHONE_NUMBER_FORM.JOB_UPDATES')}</strong>
              <p className="mb-0">{t('PHONE_NUMBER_FORM.JOB_UPDATES_DESCRIPTION')}</p>
            </div>
          </div>

          <div className="d-flex align-items-start mb-3">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-shield text-primary"
                style={{ fontSize: '24px' }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>{t('PHONE_NUMBER_FORM.SECURE_ACCOUNT_ACCESS')}</strong>
              <p className="mb-0">{t('PHONE_NUMBER_FORM.SECURE_ACCOUNT_ACCESS_DESCRIPTION')}</p>
            </div>
          </div>

          <div className="d-flex align-items-start">
            <div className="mr-3 mt-1">
              <i
                className="fa fa-bell text-primary"
                style={{ fontSize: '24px' }}
                aria-hidden="true"
              ></i>
            </div>
            <div>
              <strong>{t('PHONE_NUMBER_FORM.JOB_ALERTS')}</strong>
              <p className="mb-0">{t('PHONE_NUMBER_FORM.JOB_ALERTS_DESCRIPTION')}</p>
            </div>
          </div>

          <p className="mt-3 mb-0 text-muted font-italic">
            {t('PHONE_NUMBER_FORM.STANDARD_MESSAGE_RATES_APPLY')}
          </p>
        </Alert>
      </div>

      {/* Already Applied Alert - Show immediately when user has already applied but not during OTP flow */}
      {showAlreadyAppliedAlert && applicantScenario && !showOtpField && (
        <div className="mb-4">
          <Alert variant="warning" className="border-warning">
            <div className="text-center">
              <i
                className="fa fa-exclamation-triangle mb-3"
                style={{ fontSize: '48px', color: '#ffc107' }}
              />
              {applicantScenario.type === 'SAME_COMPANY_NO_JOB' ? (
                <>
                  <h4 className="mb-3">Already Applied to This Company</h4>
                  <p className="mb-3">
                    You already have an application with{' '}
                    <strong>{applicantScenario.companyName}</strong>.
                  </p>
                  <p className="mb-4 text-info">
                    You can access your existing application to review or update it, or try with a
                    different phone number if this is not your application.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="mb-3">{t('ALREADY_APPLIED_TO_THIS_JOB')}</h4>
                  <p className="mb-3">
                    {t('ALREADY_APPLIED_MESSAGE', {
                      jobTitle: applicantScenario.jobTitle,
                      companyName: applicantScenario.companyName,
                    })}
                  </p>
                  <p className="mb-4 text-info">
                    You can access your existing application to review or update it, or try with a
                    different phone number if this is not your application.
                  </p>
                </>
              )}

              <div className="d-flex justify-content-center gap-3">
                <PrimaryButton
                  onClick={handleGoToMyApplication}
                  style={{ padding: '0.75rem 1rem', minWidth: '160px' }}
                >
                  <i className="fa fa-file-text me-2" />
                  {applicantScenario.type === 'SAME_COMPANY_NO_JOB'
                    ? 'View My Application'
                    : t('GO_TO_MY_APPLICATION')}
                </PrimaryButton>

                <SecondaryButton
                  onClick={handleTryDifferentPhone}
                  style={{ padding: '0.75rem 1rem', minWidth: '160px' }}
                >
                  <i className="fa fa-phone me-2" />
                  {applicantScenario.type === 'SAME_COMPANY_NO_JOB'
                    ? 'Try Different Phone'
                    : 'Try Different Phone Number'}
                </SecondaryButton>
              </div>
            </div>
          </Alert>
        </div>
      )}

      <ViewModal
        show={openModal}
        title={getModalTitle()}
        size="lg"
        onCloseClick={onCloseClick}
        footer={
          showOtpField ? (
            <div className="d-flex justify-content-between w-100">
              <SecondaryButton
                onClick={() => {
                  seShowtOtpField(false);
                  setOtp('');
                  setOtpException(false);
                  setOtpApplicant(null);
                }}
                disabled={isVerificationSuccessful || isLoadingProfile}
              >
                {t('BACK')}
              </SecondaryButton>
              <PrimaryButton
                onClick={verifyOTP}
                disabled={isVerificationSuccessful || isLoadingProfile || isCreatingJobApplication}
              >
                {isLoadingProfile || isCreatingJobApplication ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: '0.5rem' }}
                    />
                    Creating Application...
                  </>
                ) : (
                  'Verify Code'
                )}
              </PrimaryButton>
            </div>
          ) : null
        }
      >
        <div>
          <ToastContainer />

          {showOtpField ? (
            <>
              {isVerificationSuccessful ? (
                <Alert variant="success" className="mb-4">
                  <div className="text-center">
                    <i
                      className="fa fa-check-circle mb-3"
                      style={{ fontSize: '48px', color: '#28a745' }}
                      aria-hidden="true"
                    ></i>
                    <h5 className="mb-2">{t('VERIFICATION_SUCCESSFUL')}</h5>
                    <p className="mb-0">
                      {applicantScenario?.type === 'SAME_COMPANY_SAME_JOB'
                        ? 'Preparing your application for updates...'
                        : applicantScenario?.type === 'SAME_COMPANY_NEW_JOB'
                        ? 'Advancing to application review...'
                        : 'Loading profile data...'}
                    </p>
                    {applicantScenario?.type === 'SAME_COMPANY_SAME_JOB' && (
                      <p className="mt-2 mb-0 text-success">
                        <i className="fa fa-edit me-2" />
                        Taking you to your existing application to review and update.
                      </p>
                    )}
                    <div className="mt-3">
                      <Spinner animation="border" variant="primary" />
                    </div>
                  </div>
                </Alert>
              ) : (
                <Alert variant="info" className="mb-4">
                  <h5 className="mb-2">{t('VERIFICATION_CODE_SENT')}</h5>
                  <p className="mb-0">{t('VERIFICATION_CODE_SENT_DESCRIPTION')}</p>
                </Alert>
              )}

              {!isVerificationSuccessful && (
                <div className="w-100 d-flex flex-column align-items-center mt-4 mb-4">
                  <FormLabel variant="bold">{t('ENTER_CODE')}</FormLabel>
                  <OTPInput
                    value={otp}
                    onChange={setOtp}
                    hasErrored={otpException}
                    isDisabled={isVerificationSuccessful || isLoadingProfile}
                  />
                  <p className="text-muted mt-2 small text-center">
                    Can&apos;t find the code? Check your messages or request a new one.
                  </p>
                </div>
              )}

              {otpException && !isVerificationSuccessful && (
                <Alert variant="warning" className="text-center">
                  <p className="mb-0">
                    {t('INCORRECT_CODE_ERROR')}
                    <br />
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0073b1',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: '0',
                        marginLeft: '0.25rem',
                        fontSize: 'inherit',
                        fontWeight: '600',
                        transition: 'color 0.2s ease',
                      }}
                      onClick={requestOTP}
                      disabled={isResending}
                      onMouseEnter={(e) => {
                        if (!isResending) {
                          e.currentTarget.style.color = '#005582';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isResending) {
                          e.currentTarget.style.color = '#0073b1';
                        }
                      }}
                    >
                      {isResending ? 'Sending...' : 'Send a new code'}
                    </button>
                  </p>
                </Alert>
              )}
            </>
          ) : (
            <>
              {/* Smart content based on scenario */}
              {getModalContent()}

              {applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' && (
                <div className="mb-4">
                  <h6 className="mb-3">Choose Application Method</h6>

                  <div className="d-flex flex-column gap-3">
                    {/* Option 1: Prefill with existing data */}
                    <div
                      className={`border rounded p-3 cursor-pointer ${
                        shouldPrefillApplication ? 'border-primary bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShouldPrefillApplication(true)}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="applicationMethod"
                          checked={shouldPrefillApplication}
                          onChange={() => setShouldPrefillApplication(true)}
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1">Use Previous Application Data</h6>
                          <p className="mb-0 text-muted small">
                            Save time by copying your information from{' '}
                            {applicantScenario.mostRecentCompanyName}.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Option 2: Start fresh */}
                    <div
                      className={`border rounded p-3 cursor-pointer ${
                        !shouldPrefillApplication ? 'border-primary bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setShouldPrefillApplication(false)}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="applicationMethod"
                          checked={!shouldPrefillApplication}
                          onChange={() => setShouldPrefillApplication(false)}
                          className="me-3"
                        />
                        <div>
                          <h6 className="mb-1">Start Fresh Application</h6>
                          <p className="mb-0 text-muted small">
                            Enter all your information from scratch.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-4">
                {applicantScenario?.type === 'SAME_COMPANY_SAME_JOB' ? (
                  <h5>Update Existing Application</h5>
                ) : (
                  <h5>Continue with Existing Profile</h5>
                )}

                <div className="d-flex justify-content-center mt-4">
                  <div
                    className="text-center mx-auto p-4 border rounded"
                    style={{
                      maxWidth: '400px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                    onClick={requestOTP}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8f9fa';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <h6 className="font-weight-bold text-primary mb-3">
                      {applicantScenario?.type === 'SAME_COMPANY_SAME_JOB'
                        ? t('UPDATE_MY_APPLICATION')
                        : applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL'
                        ? shouldPrefillApplication
                          ? 'Continue with Previous Data'
                          : 'Start Fresh'
                        : 'Use Existing Profile'}
                    </h6>
                    <p className="text-muted mb-3">
                      {applicantScenario?.type === 'SAME_COMPANY_SAME_JOB'
                        ? "Review and enhance your existing application. We'll verify your identity first and then let you update your information."
                        : applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL'
                        ? shouldPrefillApplication
                          ? "We'll verify your identity first, then prefill your application with previous data."
                          : "We'll verify your identity first, then start a fresh application."
                        : "Submit your existing information for this position. You'll be able to review and update your details after applying."}
                    </p>
                    <Button
                      variant="primary"
                      className="px-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle special case for DIFFERENT_COMPANY_PREFILL without prefilling
                        if (
                          applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' &&
                          !shouldPrefillApplication
                        ) {
                          // Skip OTP verification and proceed with fresh application
                          setApplicant({
                            ...applicant,
                            phone: form.values.phone,
                          });
                          setOpenModal(false);
                          stepNext();
                        } else {
                          // Normal flow with OTP verification
                          requestOTP();
                        }
                      }}
                    >
                      {applicantScenario?.type === 'DIFFERENT_COMPANY_PREFILL' &&
                      !shouldPrefillApplication
                        ? 'Start Application'
                        : 'Continue'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ViewModal>

      {/* Show form only if not showing already applied alert AND not showing OTP field */}
      {!showAlreadyAppliedAlert && !showOtpField && (
        <Form
          className={`${styles.align__text_left} ${styles.formStep}`}
          onSubmit={form.handleSubmit}
          onReset={form.handleReset}
        >
          <div style={{ maxWidth: '600px', margin: '0' }}>
            <Row className={styles.bold}>
              <div className="col-12 my-3">
                <BaseInputPhone
                  className="w-100"
                  required
                  name="phone"
                  label="Phone Number"
                  formik={form}
                />
              </div>
            </Row>
          </div>

          <FormActions
            onNext={() => {
              const syntheticEvent = {
                preventDefault: () => {},
                target: {},
              } as any;
              form.handleSubmit(syntheticEvent);
            }}
            onBack={() => {
              const syntheticEvent = {
                preventDefault: () => {},
                target: {},
              } as any;
              form.handleReset(syntheticEvent);
            }}
            isSubmitting={form.isSubmitting}
            isValid={form.isValid && !form.isValidating}
            nextButtonText={
              <>
                Next <LoaderIcon isLoading={!!form?.isSubmitting} />
              </>
            }
            backButtonText="Back"
          />
        </Form>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { Col, Row, Alert, Spinner } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { useAuth } from '../../hooks/use-auth';
import { useTranslation } from '../../hooks/use-translation';
import { useJobAnalytics } from '../../hooks/use-job-analytics';
import { ApplicantEntity } from '../../models/applicant/applicant.entity';
import { DocumentEntity } from '../../models/documents/document.entity';
import { ApplicantExtrasEntity } from '../../models/applicant';
import { ApplicantOTPEntity } from '../../models/applicant/applicant-otp.entity';
import { ApplicantExtras } from '../../enums/applicants/applicant-extras.enum';
import { HearAboutUsType } from '../../enums/jotform/hear-about-type.enum';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { BooleanTypeExtra } from '../../enums/jotform/bool-and-not-sure.enum';
import { JobEntity } from '../../models/job/job.entity';
import JobApi from '../../pages/api/job';
import styles from './enhanced-job-apply.module.css';
import ApplicantApi from '../../pages/api/applicant';
import { globalAjaxExceptionHandler } from '../../utils/ajax';
import { useEffectAsync } from '../../utils/react';
import ViewModal from '../view-details/view-modal';
import { LoaderIcon } from '../loading/loader-icon';
import { QuickApplyDriversLicense } from './quick-apply-drivers-license';
import { Input, Select, Checkbox, DhaPhoneInput, Button, FormLabel, OTPInput } from '../shared/dha';
import { PrimaryButton, SecondaryButton } from '../forms/jotform/form-buttons';
import { ReferralSourceApi } from '../../pages/api/referral-source';
import { ReferralSourceEntity } from '../../models/referral-source/referral-source.entity';
import { Status } from '../../enums/status.enum';

interface EnhancedJobApplyProps {
  job: JobEntity;
  setEncourageModal: (show: boolean) => void;
}

// Custom validation schema for the enhanced quick apply form
const enhancedQuickApplyValidationSchema = yup.object({
  first_name: yup.string().required('First name is required').trim(),
  last_name: yup.string().required('Last name is required').trim(),
  email: yup.string().email('Invalid email format').required('Email is required'),
  phone: yup
    .string()
    .required('Phone number is required')
    .test({
      test: (value, context) => {
        if (!value || value.length < 10) {
          return context.createError({ message: 'Please enter a valid phone number' });
        }
        return true;
      },
    }),
  zip_code: yup.string().required('Zip code is required').trim(),
  license_type: yup.string().required('CDL class is required'),
  years_cdl_experience: yup.number().when('license_type', {
    is: (value) => !!value && value !== DriverLicenseType.NO_CDL,
    then: yup.number().min(0, 'Experience cannot be negative').required('Experience is required'),
    otherwise: yup.number().min(0).nullable(),
  }),
  authorize_to_communicate: yup.string().required('SMS consent is required'),
  can_pass_drug_test: yup.boolean().required(),
  // Optional fields
  highest_degree: yup.string().nullable(),
  moving_violations_count: yup.number().min(0).nullable(),
  all_violations_count: yup.number().min(0).nullable(),
  accident_count: yup.number().min(0).nullable(),
  is_owner_operator: yup.boolean().nullable(),
  owner_operator_company_name: yup.string().trim().nullable(),
  owner_operator_dot_number: yup.string().trim().nullable(),
  documents: yup.array().nullable(),
});

export function EnhancedJobApply({ job, setEncourageModal }: EnhancedJobApplyProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { trackJobClick, trackApplicationStart } = useJobAnalytics();
  const jobApi = new JobApi();
  const applicantApi = new ApplicantApi();

  const [showModal, setShowModal] = useState(false);
  const [showDriversLicenseModal, setShowDriversLicenseModal] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [showDrugErrorMessage, setShowDrugErrorMessage] = useState(false);
  const [applicant, setApplicant] = useState<ApplicantEntity>();

  // Phone number checking state
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [showPhoneConflict, setShowPhoneConflict] = useState(false);
  const [existingApplicant, setExistingApplicant] = useState<ApplicantEntity | null>(null);
  const [hasAppliedToCurrentJob, setHasAppliedToCurrentJob] = useState(false);

  // Quick prefill state
  const [showPrefillSection, setShowPrefillSection] = useState(false);
  const [prefillPhone, setPrefillPhone] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpApplicant, setOtpApplicant] = useState<ApplicantOTPEntity | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpException, setOtpException] = useState(false);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    'new' | 'update' | 'additional' | null
  >(null);
  const [referralSources, setReferralSources] = useState<ReferralSourceEntity[]>([]);

  // Fetch referral sources
  useEffect(() => {
    const fetchReferralSources = async () => {
      try {
        const referralSourceApi = new ReferralSourceApi();
        const data = await referralSourceApi.list();
        setReferralSources(data?.filter((r) => r.status === Status.ACTIVE) || []);
      } catch (error) {
        console.error('Error fetching referral sources:', error);
        setReferralSources([]);
      }
    };

    fetchReferralSources();
  }, []);

  // Helper function to extract error string
  const getErrorString = (error: any): string | undefined => {
    if (typeof error === 'string') return error;
    return undefined;
  };

  // Check if phone number has existing applicant
  const checkPhoneNumber = async (phone: string) => {
    if (!phone || phone.length < 10) return;

    setIsCheckingPhone(true);
    try {
      const appliedJobs = await applicantApi.getAppliedJobsByPhone(phone);

      // Check if they've already applied to this specific job
      const hasAppliedToThisJob = appliedJobs.some(
        (appliedJob) => appliedJob.job?.id === job.id && appliedJob.company?.id === job.company?.id
      );

      if (hasAppliedToThisJob) {
        setHasAppliedToCurrentJob(true);
        setShowPhoneConflict(true);
        return true;
      }

      // Check for existing applicants at this company
      const existingApplicants = await applicantApi.searchApplicantsByPhone({ phone });
      const companyApplicant = existingApplicants.find(
        (applicant) => applicant.company?.id === job.company?.id
      );

      if (companyApplicant) {
        setExistingApplicant(companyApplicant);
        setShowPhoneConflict(true);
        setHasAppliedToCurrentJob(false);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    } finally {
      setIsCheckingPhone(false);
    }
  };

  // Quick prefill functions
  const handlePrefillPhone = async () => {
    if (!prefillPhone || prefillPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSendingOtp(true);
    try {
      const otpResponse = await applicantApi.requestOTP({ phone: prefillPhone });
      setOtpApplicant(otpResponse);
      setShowOtpField(true);
      toast.success('Verification code sent!');
    } catch (error) {
      console.error('Failed to send OTP:', error);

      // Handle specific error cases
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === 'PHONE_NUMBER_NOT_FOUND'
      ) {
        toast.error(
          `No Driverfly profile found for this phone number. Please check the number or apply as a new applicant.`
        );
      } else {
        toast.error('Unable to send verification code. Please try again.');
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtpAndPrefill = async () => {
    if (!otp || !otpApplicant) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpException(false);

    try {
      // Verify OTP and get applicant profile
      const applicantProfile = await applicantApi.verifyOTP({
        applicantId: otpApplicant.applicantId,
        otp,
      });

      // Check if this phone number has already applied to this specific job
      const appliedJobs = await applicantApi.getAppliedJobsByPhone(prefillPhone);
      const hasAppliedToThisJob = appliedJobs.some(
        (appliedJob) => appliedJob.job?.id === job.id && appliedJob.company?.id === job.company?.id
      );

      if (hasAppliedToThisJob) {
        setHasAppliedToCurrentJob(true);
        setShowPhoneConflict(true);
      }

      // Prefill the form with existing data
      apply_form.setValues({
        ...applicantProfile,
        phone: prefillPhone, // Keep the phone number locked
        // Ensure required fields have fallback values
        first_name: applicantProfile.first_name || '',
        last_name: applicantProfile.last_name || '',
        email: applicantProfile.email || '',
        zip_code: applicantProfile.zip_code || '',
        years_cdl_experience: applicantProfile.years_cdl_experience || 0,
        moving_violations_count: applicantProfile.moving_violations_count || 0,
        all_violations_count: applicantProfile.all_violations_count || 0,
        accident_count: applicantProfile.accident_count || 0,
        can_pass_drug_test: applicantProfile.can_pass_drug_test ?? true,
        authorize_to_communicate: applicantProfile.authorize_to_communicate || BooleanTypeExtra.YES,
        documents: applicantProfile.documents || [],
        is_owner_operator: applicantProfile.is_owner_operator ?? false,
        owner_operator_company_name: applicantProfile.owner_operator_company_name || '',
        owner_operator_dot_number: applicantProfile.owner_operator_dot_number || '',
      });

      setIsPrefilled(true);
      setShowPrefillSection(false);
      setShowOtpField(false);

      // Only clear phone conflicts if they haven't already applied to this job
      if (!hasAppliedToThisJob) {
        setShowPhoneConflict(false);
        setExistingApplicant(null);
        setHasAppliedToCurrentJob(false);
      }

      // Track "Used Quick Fill" analytics event
      trackJobClick(job.id, job.company?.id, 'apply-button', {
        source: 'enhanced-quick-apply',
        buttonType: 'quick_fill',
        additional: {
          quickFillUsed: true,
          prefillPhone: prefillPhone.substr(-4), // Only track last 4 digits for privacy
        },
      });

      toast.success('Profile loaded successfully!');
    } catch (error) {
      setOtpException(true);
      console.error('OTP verification failed:', error);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resetPrefill = () => {
    setShowPrefillSection(false);
    setShowOtpField(false);
    setOtp('');
    setOtpApplicant(null);
    setOtpException(false);
    setIsPrefilled(false);
    setPrefillPhone('');

    // Clear phone conflicts when resetting prefill
    setShowPhoneConflict(false);
    setExistingApplicant(null);
    setHasAppliedToCurrentJob(false);

    // Reset form to clean initial state
    apply_form.resetForm();

    // Reinitialize with clean default values
    const cleanData = new ApplicantEntity();
    cleanData.years_cdl_experience = 0;
    cleanData.moving_violations_count = 0;
    cleanData.accident_count = 0;
    cleanData.all_violations_count = 0;
    cleanData.documents = [];
    cleanData.phone = '';
    cleanData.first_name = '';
    cleanData.last_name = '';
    cleanData.email = '';
    cleanData.zip_code = '';
    cleanData.can_pass_drug_test = true;
    cleanData.authorize_to_communicate = BooleanTypeExtra.YES;

    apply_form.setValues({
      ...apply_form.initialValues,
      ...cleanData,
    });
  };
  const apply_form = useFormik({
    initialValues: {
      ...new ApplicantEntity(),
      phone: '', // Explicitly initialize phone as empty string
      first_name: '',
      last_name: '',
      email: '',
      zip_code: '',
      years_cdl_experience: 0,
      moving_violations_count: 0,
      all_violations_count: 0,
      accident_count: 0,
      documents: [],
      can_pass_drug_test: true,
      authorize_to_communicate: BooleanTypeExtra.YES, // Default to YES
      is_owner_operator: false,
      owner_operator_company_name: '',
      owner_operator_dot_number: '',
    },
    validationSchema: enhancedQuickApplyValidationSchema,
    onSubmit: async (dto, { resetForm }) => {
      // Skip phone check if this is a prefilled application - phone was already verified
      // Or if we already know they have applied to this job (allow updates)
      if (!isPrefilled && !hasAppliedToCurrentJob) {
        const hasConflict = await checkPhoneNumber(dto.phone);
        if (hasConflict && !hasAppliedToCurrentJob) {
          return; // Show conflict UI instead of submitting (only block for different jobs, not updates)
        }
      }

      if (!Boolean(dto?.can_pass_drug_test)) {
        setShowDrugErrorMessage(true);
        setEncourageModal(false);
        setShowForm(false);
      } else {
        // Prepare the data
        dto.years_cdl_experience = Number(dto.years_cdl_experience);
        dto.moving_violations_count = Number(dto.moving_violations_count);
        dto.all_violations_count = Number(dto.all_violations_count);
        dto.accident_count = Number(dto.accident_count);

        // Map JOB_BOARD to referralSourceId
        const jobBoardSource = referralSources.find(
          (source) =>
            source.name?.toLowerCase() === 'job_board' ||
            source.name?.toLowerCase() === 'job board' ||
            source.name?.toLowerCase() === t('HearAboutUsType.JOB_BOARD')?.toLowerCase()
        );

        if (jobBoardSource) {
          dto.referralSourceId = jobBoardSource.id;
        }

        // Remove HEAR_ABOUT_US from extras as we're now using referralSourceId
        dto.extras = dto.extras?.filter((e) => e.type !== ApplicantExtras.HEAR_ABOUT_US) || [];

        try {
          let applicantResult;
          let statusMessage = '';

          // Always search for existing applicants by phone first
          const existingApplicants = await applicantApi.searchApplicantsByPhone({
            phone: dto.phone,
          });

          const companyApplicant = existingApplicants.find(
            (applicant) => applicant.company?.id === job.company?.id
          );

          if (companyApplicant) {
            // Case 2 & 3: Existing applicant for this company

            // Check if they've already applied to this specific job
            const existingJobApplication = companyApplicant.jobs?.find(
              (appliedJob) => appliedJob.id === job.id
            );

            if (existingJobApplication) {
              // Case 3: Same company, same job - update their information
              setApplicationStatus('update');
              applicantResult = await applicantApi.jotform.update(companyApplicant.id, {
                applicant: dto,
                jobs: [{ id: job.id }], // Keep the existing job application
                applicantExtras: dto.extras || [],
                utm: {},
              });

              statusMessage = `Your application for "${job.title}" has been updated successfully! We have your latest information and will be in touch soon.`;

              // Track update event
              trackApplicationStart(job.id, job.company?.id, {
                applicationSource: isPrefilled
                  ? 'enhanced-quick-apply-prefilled-update'
                  : 'enhanced-quick-apply-update',
                applicationType: 'update_existing',
                additional: {
                  hasDriversLicense: !!dto.documents?.length,
                  isPrefilled,
                  isUpdate: true,
                  existingApplicantId: companyApplicant.id,
                },
              });
            } else {
              // Case 2: Same company, different job - add new job application
              setApplicationStatus('additional');
              const existingJobs = companyApplicant.jobs || [];
              applicantResult = await applicantApi.jotform.update(companyApplicant.id, {
                applicant: dto,
                jobs: [...existingJobs.map((j) => ({ id: j.id })), { id: job.id }], // Add new job
                applicantExtras: dto.extras || [],
                utm: {},
              });

              statusMessage = t('job_applied_success_message');

              // Track new job application for existing applicant
              trackApplicationStart(job.id, job.company?.id, {
                applicationSource: isPrefilled
                  ? 'enhanced-quick-apply-prefilled-existing'
                  : 'enhanced-quick-apply-existing',
                applicationType: 'additional_job',
                additional: {
                  hasDriversLicense: !!dto.documents?.length,
                  isPrefilled,
                  existingApplicantId: companyApplicant.id,
                  totalJobsApplied: existingJobs.length + 1,
                },
              });
            }
          } else {
            // Case 1: New applicant - create using jotform endpoint
            setApplicationStatus('new');
            applicantResult = await applicantApi.jotform.create(job.company.id, {
              applicant: dto,
              jobs: [{ id: job.id }],
              applicantExtras: dto.extras || [],
              utm: {},
            });

            statusMessage = t('job_applied_success_message');

            // Track new applicant creation
            trackApplicationStart(job.id, job.company?.id, {
              applicationSource: isPrefilled
                ? 'enhanced-quick-apply-prefilled-new'
                : 'enhanced-quick-apply-new',
              applicationType: 'new_applicant',
              additional: {
                hasDriversLicense: !!dto.documents?.length,
                isPrefilled,
                isNewApplicant: true,
              },
            });
          }

          setApplicant(applicantResult);
          toast.success(statusMessage);
          setShowForm(false);
        } catch (e) {
          globalAjaxExceptionHandler(e, { formik: apply_form, toast: toast, t: t });
          if (e.response?.data?.message == 'ApplicantJobService.APPLICANT_ALREADY_APPLIED') {
            setShowModal(false);
          }
        }
      }
    },
  });

  useEffectAsync(async () => {
    // Initialize form with default values
    let data = new ApplicantEntity();
    data.years_cdl_experience = 0;
    data.moving_violations_count = 0;
    data.accident_count = 0;
    data.all_violations_count = 0;
    data.documents = [];
    data.phone = ''; // Ensure phone is initialized as empty string
    data.can_pass_drug_test = true; // Default to true for drug test
    data.authorize_to_communicate = BooleanTypeExtra.YES; // Default to YES

    apply_form.setValues({
      ...apply_form.values,
      ...data,
    });
  }, [showModal]);

  // Check phone number when form gets prefilled
  useEffectAsync(async () => {
    if (isPrefilled && apply_form.values.phone && apply_form.values.phone.length >= 10) {
      await checkPhoneNumber(apply_form.values.phone);
    }
  }, [isPrefilled, apply_form.values.phone]);

  const onApplyClick = (): void => {
    // Track "Clicked Apply Now" analytics event
    trackJobClick(job.id, job.company?.id, 'apply-button', {
      source: 'enhanced-quick-apply',
      buttonType: 'apply_now',
      additional: {
        clickType: 'quick_apply_modal_open',
      },
    });

    // Reset all states when opening modal for a clean start
    setShowPhoneConflict(false);
    setExistingApplicant(null);
    setHasAppliedToCurrentJob(false);
    setApplicationStatus(null);
    setShowPrefillSection(false);
    setShowOtpField(false);
    setOtp('');
    setOtpApplicant(null);
    setOtpException(false);
    setIsPrefilled(false);
    setPrefillPhone('');
    setShowForm(true);
    setShowDrugErrorMessage(false);

    // Reset the form to initial clean state
    apply_form.resetForm();

    // Reinitialize with clean default values
    const cleanData = new ApplicantEntity();
    cleanData.years_cdl_experience = 0;
    cleanData.moving_violations_count = 0;
    cleanData.accident_count = 0;
    cleanData.all_violations_count = 0;
    cleanData.documents = [];
    cleanData.phone = '';
    cleanData.first_name = '';
    cleanData.last_name = '';
    cleanData.email = '';
    cleanData.zip_code = '';
    cleanData.can_pass_drug_test = true;
    cleanData.authorize_to_communicate = BooleanTypeExtra.YES;

    apply_form.setValues({
      ...apply_form.initialValues,
      ...cleanData,
    });

    setShowModal(true);
  };

  const onCloseClick = () => {
    setShowModal(false);
    setShowForm(true);
    setShowDrugErrorMessage(false);
    setEncourageModal(false); // Always set to false since we don't need the encourage modal

    // Reset all form and prefill states when closing modal
    setShowPrefillSection(false);
    setShowOtpField(false);
    setOtp('');
    setOtpApplicant(null);
    setOtpException(false);
    setIsPrefilled(false);
    setPrefillPhone('');
    setShowPhoneConflict(false);
    setExistingApplicant(null);
    setHasAppliedToCurrentJob(false);
    setApplicationStatus(null);

    // Reset the form to initial values
    apply_form.resetForm();

    // Reinitialize with clean default values
    const cleanData = new ApplicantEntity();
    cleanData.years_cdl_experience = 0;
    cleanData.moving_violations_count = 0;
    cleanData.accident_count = 0;
    cleanData.all_violations_count = 0;
    cleanData.documents = [];
    cleanData.phone = '';
    cleanData.first_name = '';
    cleanData.last_name = '';
    cleanData.email = '';
    cleanData.zip_code = '';
    cleanData.can_pass_drug_test = true;
    cleanData.authorize_to_communicate = BooleanTypeExtra.YES;

    apply_form.setValues({
      ...apply_form.initialValues,
      ...cleanData,
    });
  };

  const handleDriversLicenseSubmit = (document: DocumentEntity) => {
    // Add the driver's license document to the form
    const currentDocuments = apply_form.values.documents || [];
    const updatedDocuments = [...currentDocuments, document];

    apply_form.setFieldValue('documents', updatedDocuments);
    setShowDriversLicenseModal(false);

    toast.success("Driver's license added successfully!");
  };

  const hasDriversLicense = apply_form.values.documents?.length > 0;

  return (
    <>
      {applicant?.jobs?.length > 0 && applicant?.jobs?.some((item) => item?.job?.id == job?.id) ? (
        <div className="ort-btn mt-lg-4 mt-0">
          <button type="button" className="btn theme-primary-btn w-100" disabled={true}>
            {t('APPLIED')}
          </button>
        </div>
      ) : (
        <div className="ort-btn mt-lg-4 mt-0">
          <button type="button" className="btn theme-primary-btn w-100" onClick={onApplyClick}>
            {t('APPLY_NOW')} <ArrowRight className="ms-2" />
          </button>
        </div>
      )}

      {/* Main Application Modal */}
      <ViewModal
        size="xl"
        show={showModal}
        closeText="CANCEL"
        onCloseClick={onCloseClick}
        title={hasAppliedToCurrentJob ? 'Update Your Application' : 'apply_for_this_job'}
        footer={
          showForm && (
            <Button
              disabled={
                !!apply_form.isSubmitting ||
                !apply_form.isValid ||
                !!apply_form.isValidating ||
                (showPhoneConflict && !isPrefilled) || // Disable if phone conflict exists and not yet verified via OTP
                isCheckingPhone
              }
              type="submit"
              className="w-100"
              onClick={() => apply_form.handleSubmit()}
              loading={!!apply_form.isSubmitting || isCheckingPhone}
            >
              {isCheckingPhone
                ? t('CHECKING_PHONE')
                : showPhoneConflict && !isPrefilled
                ? 'Verify Identity to Continue'
                : hasAppliedToCurrentJob
                ? 'Update Application'
                : t('submit')}
            </Button>
          )
        }
      >
        {showForm ? (
          <form onSubmit={apply_form.handleSubmit}>
            {/* Existing Application Notice */}
            {showPhoneConflict && hasAppliedToCurrentJob && !isPrefilled && (
              <div className="mb-4">
                <Alert variant="info">
                  <div className="text-center">
                    <i
                      className="fa fa-info-circle mb-3"
                      style={{
                        fontSize: '48px',
                        color: 'var(--info)',
                      }}
                    />
                    <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>
                      You Have Already Applied to This Position
                    </h5>
                    <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
                      You previously submitted an application for &quot;{job.title}&quot; at{' '}
                      {job.company?.name}.
                    </p>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      To update your application, please verify your identity with a code sent to
                      your phone.
                    </p>

                    {!showOtpField ? (
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={() => {
                          // Trigger the Quick Fill flow with the current phone number
                          setShowPhoneConflict(false);
                          setShowPrefillSection(true);
                          setPrefillPhone(apply_form.values.phone);
                        }}
                        disabled={!apply_form.values.phone}
                      >
                        <>
                          <i className="fa fa-mobile me-2" />
                          Send Verification Code
                        </>
                      </Button>
                    ) : (
                      <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
                        <i className="fa fa-arrow-down me-2" />
                        Use the Quick Fill section below to verify your identity
                      </p>
                    )}
                  </div>
                </Alert>
              </div>
            )}

            {/* Quick Prefill CTA Header */}
            {!isPrefilled && !showPrefillSection && !showPhoneConflict && (
              <div className={`mb-4 p-4 ${styles.ctaSection}`}>
                <div className="text-center">
                  <i
                    className={`fa fa-clock me-2 ${styles.iconMedium}`}
                    style={{ color: 'var(--primary-button)' }}
                  />
                  <h5 className={`mb-3 fw-bold ${styles.sectionTitle}`}>
                    Applied with Driverfly before?
                  </h5>
                  <p className={`mb-3 ${styles.sectionText}`}>
                    Save time by using your existing profile. Just enter your phone number and
                    verify with a code sent to your phone.
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className={`fw-bold px-4 py-2 ${styles.buttonPrimary}`}
                    onClick={() => setShowPrefillSection(true)}
                  >
                    <i className="fa fa-magic me-2" />
                    Quick Fill with Existing Profile
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Prefill Section */}
            {showPrefillSection && !isPrefilled && (
              <div className={`mb-4 p-4 ${styles.prefillSection}`}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <h5 className={`mb-0 fw-bold ${styles.sectionTitle}`}>
                    <i className="fa fa-magic me-2" />
                    Quick Fill with Existing Profile
                  </h5>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowPrefillSection(false)}
                  >
                    Cancel
                  </Button>
                </div>

                {!showOtpField ? (
                  <>
                    <p className={`mb-3 small ${styles.sectionText}`}>
                      Enter the phone number from your previous Driverfly application:
                    </p>
                    <Row className={`align-items-end ${styles.phoneInputAlignment}`}>
                      <Col md={8}>
                        <DhaPhoneInput
                          name="prefill_phone"
                          label="Phone Number"
                          value={prefillPhone}
                          onChange={(e) => setPrefillPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          noMargin={true}
                        />
                      </Col>
                      <Col md={4}>
                        <div className="d-grid">
                          <Button
                            variant="primary"
                            onClick={handlePrefillPhone}
                            disabled={!prefillPhone || prefillPhone.length < 10 || isSendingOtp}
                          >
                            {isSendingOtp ? (
                              <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Sending...
                              </>
                            ) : (
                              'Send Code'
                            )}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Alert variant="info" className="mb-3">
                      <p className="mb-0" style={{ color: 'var(--text-primary)' }}>
                        <i className="fa fa-mobile me-2" style={{ color: 'var(--info)' }} />
                        Verification code sent to {prefillPhone}
                      </p>
                    </Alert>
                    <div className="text-center">
                      <FormLabel variant="bold" style={{ color: 'var(--text-primary)' }}>
                        Enter Verification Code
                      </FormLabel>
                      <OTPInput
                        value={otp}
                        onChange={setOtp}
                        hasErrored={otpException}
                        isDisabled={isVerifyingOtp}
                      />
                      {otpException && (
                        <p className="mt-2 small" style={{ color: 'var(--danger)' }}>
                          Incorrect code. Please try again.
                        </p>
                      )}
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <SecondaryButton onClick={resetPrefill} disabled={isVerifyingOtp}>
                        Cancel
                      </SecondaryButton>
                      <PrimaryButton
                        onClick={verifyOtpAndPrefill}
                        disabled={!otp || isVerifyingOtp}
                      >
                        {isVerifyingOtp ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Fill Form'
                        )}
                      </PrimaryButton>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Prefilled Success Alert - Show when profile is loaded via OTP */}
            {isPrefilled && (
              <div className="mb-4">
                <Alert variant="success">
                  <div className="text-center">
                    <i
                      className="fa fa-check-circle me-2"
                      style={{
                        fontSize: '1.5rem',
                        color: 'var(--success)',
                      }}
                    />
                    <strong style={{ color: 'var(--text-primary)' }}>
                      Profile Loaded Successfully!
                    </strong>
                    <p className="mb-0 mt-2" style={{ color: 'var(--text-primary)' }}>
                      Your information has been prefilled. Review and update as needed, then submit
                      your application.
                      <br />
                      <small style={{ color: 'var(--text-secondary)' }}>
                        Note: Phone number is locked and cannot be changed.
                      </small>
                    </p>
                  </div>
                </Alert>
              </div>
            )}

            {/* Form Instructions */}
            <div className={`mb-4 p-4 ${styles.instructionsBox}`}>
              <p className={`mb-0 ${styles.sectionText}`}>
                <strong>Required fields:</strong> Name, Email, Phone, Zip Code, CDL Class, and SMS
                consent agreement.
                <br />
                <strong>Optional fields:</strong> Education level, years of experience, violation
                history, and driver&apos;s license upload can help improve your application.
              </p>
            </div>

            {/* Phone Conflict Alert - Only for existing profile, different job */}
            {showPhoneConflict && !hasAppliedToCurrentJob && (
              <div className="mb-4">
                <Alert variant="info">
                  <div className="text-center">
                    <i
                      className="fa fa-user-check mb-3"
                      style={{
                        fontSize: '48px',
                        color: 'var(--info)',
                      }}
                    />
                    <h5 className="mb-3" style={{ color: 'var(--text-primary)' }}>
                      {t('EXISTING_PROFILE_FOUND')}
                    </h5>
                    <p className="mb-3" style={{ color: 'var(--text-primary)' }}>
                      {`We found an existing profile for this phone number at ${job.company?.name}.`}
                    </p>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      You can use your existing profile to apply faster, or continue with a new
                      application using different contact information.
                    </p>

                    <div className="d-flex justify-content-center gap-3">
                      <Button
                        variant="primary"
                        onClick={() => {
                          // For existing profile, trigger quick fill flow
                          setShowPhoneConflict(false);
                          setExistingApplicant(null);
                          setShowPrefillSection(true);
                          setPrefillPhone(apply_form.values.phone);
                        }}
                      >
                        <i className="fa fa-file-text me-2" />
                        Use Existing Profile
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPhoneConflict(false);
                          setExistingApplicant(null);
                          setHasAppliedToCurrentJob(false);
                          apply_form.setFieldValue('phone', '');
                        }}
                      >
                        <i className="fa fa-phone me-2" />
                        Use Different Phone
                      </Button>
                    </div>
                  </div>
                </Alert>
              </div>
            )}

            {/* Personal Information */}
            <Row>
              <Col md={6}>
                <Input
                  label="First Name"
                  name="first_name"
                  required
                  value={apply_form.values.first_name}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.first_name && apply_form.errors.first_name
                  )}
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Last Name"
                  name="last_name"
                  required
                  value={apply_form.values.last_name}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.last_name && apply_form.errors.last_name
                  )}
                />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={6}>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  value={apply_form.values.email}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(apply_form.touched.email && apply_form.errors.email)}
                />
              </Col>
              <Col md={6}>
                <div className="position-relative">
                  <DhaPhoneInput
                    label="Phone Number"
                    name="phone"
                    required
                    disabled={isPrefilled}
                    value={apply_form.values.phone || ''}
                    onChange={apply_form.handleChange}
                    onBlur={(e) => {
                      apply_form.handleBlur(e);
                      // Check phone number after user finishes typing (only if not prefilled)
                      if (!isPrefilled && e.target.value && e.target.value.length >= 10) {
                        checkPhoneNumber(e.target.value);
                      }
                    }}
                    error={getErrorString(apply_form.touched.phone && apply_form.errors.phone)}
                  />
                  {isCheckingPhone && (
                    <div className="position-absolute" style={{ top: '35px', right: '10px' }}>
                      <Spinner size="sm" animation="border" />
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            {/* Education and Location */}
            <Row className="mt-3">
              <Col md={6}>
                <Select
                  label="Highest Degree (Optional)"
                  name="highest_degree"
                  value={apply_form.values.highest_degree}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.highest_degree && apply_form.errors.highest_degree
                  )}
                  options={Object.entries(EducationLevel).map(([key, value]) => ({
                    value: value,
                    label: t(`EducationLevel.${value}`),
                  }))}
                />
              </Col>
              <Col md={6}>
                <Input
                  label="Zip Code"
                  name="zip_code"
                  type="text"
                  required
                  value={apply_form.values.zip_code}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(apply_form.touched.zip_code && apply_form.errors.zip_code)}
                />
              </Col>
            </Row>

            {/* CDL Information */}
            <Row className="mt-3">
              <Col md={6}>
                <Select
                  label="CDL Class"
                  name="license_type"
                  required
                  value={apply_form.values.license_type}
                  onChange={(e) => {
                    apply_form.handleChange(e);
                    if (
                      ![DriverLicenseType.CDL_CLASS_A, DriverLicenseType.CDL_CLASS_B].includes(
                        e.target.value as DriverLicenseType
                      )
                    ) {
                      apply_form.setFieldValue('years_cdl_experience', 0);
                      apply_form.setFieldValue('is_owner_operator', false);
                    }
                  }}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.license_type && apply_form.errors.license_type
                  )}
                  options={Object.entries(DriverLicenseType).map(([key, value]) => ({
                    value: value,
                    label: t(`DriverLicenseType.${value}`),
                  }))}
                />
              </Col>
              {apply_form.values.license_type &&
                apply_form.values.license_type !== DriverLicenseType.NO_CDL && (
                  <Col md={6}>
                    <Input
                      label="Years of CDL Experience"
                      name="years_cdl_experience"
                      type="number"
                      min="0"
                      required
                      value={apply_form.values.years_cdl_experience?.toString() || ''}
                      onChange={apply_form.handleChange}
                      onBlur={apply_form.handleBlur}
                      error={getErrorString(
                        apply_form.touched.years_cdl_experience &&
                          apply_form.errors.years_cdl_experience
                      )}
                    />
                  </Col>
                )}
            </Row>

            {/* Owner Operator Question */}
            {[DriverLicenseType.CDL_CLASS_A, DriverLicenseType.CDL_CLASS_B].includes(
              apply_form.values?.license_type
            ) && (
              <>
                <Row className="mt-3">
                  <Col>
                    <Checkbox
                      name="is_owner_operator"
                      label="Are you an owner operator?"
                      checked={apply_form.values.is_owner_operator}
                      onChange={(e) => {
                        apply_form.setFieldValue('is_owner_operator', e.target.checked);
                        if (!e.target.checked) {
                          apply_form.setFieldValue('owner_operator_company_name', '');
                          apply_form.setFieldValue('owner_operator_dot_number', '');
                        }
                      }}
                      error={getErrorString(
                        apply_form.touched.is_owner_operator && apply_form.errors.is_owner_operator
                      )}
                    />
                  </Col>
                </Row>

                {/* Owner Operator DBA Name and DOT Number */}
                {apply_form.values.is_owner_operator && (
                  <Row className="mt-3">
                    <Col md={6}>
                      <Input
                        label="DBA Name (Optional)"
                        name="owner_operator_company_name"
                        type="text"
                        value={apply_form.values.owner_operator_company_name || ''}
                        onChange={apply_form.handleChange}
                        onBlur={apply_form.handleBlur}
                        error={getErrorString(
                          apply_form.touched.owner_operator_company_name &&
                            apply_form.errors.owner_operator_company_name
                        )}
                      />
                    </Col>
                    <Col md={6}>
                      <Input
                        label="DOT Number (Optional)"
                        name="owner_operator_dot_number"
                        type="text"
                        value={apply_form.values.owner_operator_dot_number || ''}
                        onChange={apply_form.handleChange}
                        onBlur={apply_form.handleBlur}
                        error={getErrorString(
                          apply_form.touched.owner_operator_dot_number &&
                            apply_form.errors.owner_operator_dot_number
                        )}
                      />
                    </Col>
                  </Row>
                )}
              </>
            )}

            {/* Driver's License Section */}
            <Row className="mt-4">
              <Col>
                <div className={`p-4 mb-3 ${styles.driversLicenseCard}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className={`mb-2 fw-bold ${styles.sectionTitle}`}>
                        📄 Driver&apos;s License{' '}
                        <span
                          className={`fw-normal ${styles.sectionSubtext}`}
                          style={{ fontSize: '0.9rem' }}
                        >
                          (Optional)
                        </span>
                      </h6>
                      <p className={`mb-0 small ${styles.sectionText}`}>
                        {hasDriversLicense
                          ? "Driver's license uploaded ✓"
                          : "Upload your driver's license to improve your chances of getting noticed by employers"}
                      </p>
                    </div>
                    <Button
                      variant={hasDriversLicense ? 'success' : 'primary'}
                      size="sm"
                      type="button"
                      onClick={() => setShowDriversLicenseModal(true)}
                    >
                      {hasDriversLicense ? 'Update' : 'Upload License'}
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Violation History */}
            <Row className="mt-3">
              <Col md={4}>
                <Input
                  label="Moving Violations (Last 3 Years)"
                  name="moving_violations_count"
                  type="number"
                  min="0"
                  value={apply_form.values.moving_violations_count?.toString() || '0'}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.moving_violations_count &&
                      apply_form.errors.moving_violations_count
                  )}
                />
              </Col>
              <Col md={4}>
                <Input
                  label="All Violations (Last 3 Years)"
                  name="all_violations_count"
                  type="number"
                  min="0"
                  value={apply_form.values.all_violations_count?.toString() || '0'}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.all_violations_count &&
                      apply_form.errors.all_violations_count
                  )}
                />
              </Col>
              <Col md={4}>
                <Input
                  label="Accidents (Last 5 Years)"
                  name="accident_count"
                  type="number"
                  min="0"
                  value={apply_form.values.accident_count?.toString() || '0'}
                  onChange={apply_form.handleChange}
                  onBlur={apply_form.handleBlur}
                  error={getErrorString(
                    apply_form.touched.accident_count && apply_form.errors.accident_count
                  )}
                />
              </Col>
            </Row>

            {/* Drug Test and Communication Consent */}
            <Row className="mt-4">
              <Col>
                <div className={`p-4 mb-4 ${styles.confirmationsSection}`}>
                  <h6 className={`mb-4 fw-bold ${styles.sectionTitle}`}>Required Confirmations</h6>

                  <div className="mb-4">
                    <Checkbox
                      name="can_pass_drug_test"
                      label="Can you pass a drug & alcohol test?"
                      checked={apply_form.values.can_pass_drug_test}
                      onChange={(e) =>
                        apply_form.setFieldValue('can_pass_drug_test', e.target.checked)
                      }
                      error={getErrorString(
                        apply_form.touched.can_pass_drug_test &&
                          apply_form.errors.can_pass_drug_test
                      )}
                    />
                    <small className={`d-block mt-2 ${styles.sectionSubtext}`}>
                      Please be honest as {job?.company?.name || 'Country Rogue'} will require you
                      to take a pre-employment drug screening as required by DOT regulations.
                    </small>
                  </div>

                  <div className="mb-3">
                    <Select
                      label={`I authorize ${
                        job?.company?.name || 'Country Rogue'
                      } and any applicable third parties to send me SMS and email communications regarding job availabilities`}
                      name="authorize_to_communicate"
                      required
                      value={apply_form.values.authorize_to_communicate}
                      onChange={apply_form.handleChange}
                      onBlur={apply_form.handleBlur}
                      error={getErrorString(
                        apply_form.touched.authorize_to_communicate &&
                          apply_form.errors.authorize_to_communicate
                      )}
                      options={Object.entries(BooleanTypeExtra).map(([key, value]) => ({
                        value: value,
                        label: t(`BooleanPreferenceType.${value}`),
                      }))}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </form>
        ) : (
          <Row>
            {showDrugErrorMessage ? (
              <Col>
                <div className={`text-center ${styles.errorMessage}`}>
                  <i
                    className={`fa fa-exclamation-triangle mb-3 ${styles.iconLarge}`}
                    style={{ color: 'var(--danger)' }}
                  />
                  <h5 className="mb-3" style={{ color: 'var(--danger)' }}>
                    Application Cannot Proceed
                  </h5>
                  <p className={styles.sectionText}>
                    We appreciate your honesty. Unfortunately, we cannot process your application at
                    this time as this position requires passing a drug and alcohol test as mandated
                    by DOT regulations.
                  </p>
                </div>
              </Col>
            ) : (
              <Col>
                <div className={`text-center ${styles.successMessage}`}>
                  <i
                    className={`fa fa-check-circle mb-3 ${styles.iconLarge}`}
                    style={{ color: 'var(--success)' }}
                  />
                  <h5 className="mb-3" style={{ color: 'var(--success)' }}>
                    {applicationStatus === 'update'
                      ? 'Application Updated Successfully!'
                      : 'Application Submitted Successfully!'}
                  </h5>
                  <p className={styles.sectionText}>
                    {applicationStatus === 'update'
                      ? `Your application for "${job.title}" has been updated with your latest information. We will review the changes and contact you soon.`
                      : 'Thank you for your interest. We will review your application and contact you soon.'}
                  </p>
                </div>
              </Col>
            )}
          </Row>
        )}
      </ViewModal>

      {/* Driver's License Upload Modal */}
      <QuickApplyDriversLicense
        show={showDriversLicenseModal}
        onClose={() => setShowDriversLicenseModal(false)}
        onSubmit={handleDriversLicenseSubmit}
        jobId={job.id}
        companyId={job.company?.id || 0}
        isSubmitting={false}
      />
    </>
  );
}

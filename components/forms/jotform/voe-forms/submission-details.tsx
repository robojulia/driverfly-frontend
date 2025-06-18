import { useFormik } from 'formik';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VoeFormContext, { VoeFormContextType } from '../../../../context/voeform-context';
import { useTranslation } from '../../../../hooks/use-translation';
import { ApplicantVoeEntity } from '../../../../models/applicant/applicant-voe.entity';
import ApplicantApi from '../../../../pages/api/applicant';
import styles from '../../../../styles/digitalhiringapp.module.css';
import { globalAjaxExceptionHandler } from '../../../../utils/ajax';
import { LoaderIcon } from '../../../loading/loader-icon';
import OverlyPopover from '../../../popover/overly-popover';
import BaseCheck from '../../base-check';
import BaseInput from '../../base-input';
import BaseInputPhone from '../../base-input-phone';
import { SignatureComponent } from '../../signature';

export function SubmissionDetails() {
  const {
    state: { voe, applicant, employer },
    method: { stepBack, stepNext, jumpToStep },
  }: VoeFormContextType = useContext(VoeFormContext);

  const { t } = useTranslation();
  const [hasSignature, setHasSignature] = useState(false);
  const applicantApi = useMemo(() => new ApplicantApi(), []);

  const getCurrentDate = useCallback((): string => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const handleSignatureChange = useCallback((signature: string | null) => {
    form.setFieldValue('signature', signature);
    setHasSignature(!!signature);
  }, []);

  const initialValues = useMemo(() => new ApplicantVoeEntity(), []);

  const handleSubmit = useCallback(
    async ({
      signature,
      focal_person_name,
      focal_person_title,
      focal_person_phone,
      focal_person_email,
      signed_date,
      allow_share,
    }) => {
      try {
        await applicantApi.voeform.submitVoe({
          applicant_uuid_token: applicant?.uuid_token,
          employer_uuid_token: employer?.uuid_token,
          voeData: {
            ...voe,
            signature,
            focal_person_name,
            focal_person_title,
            focal_person_phone,
            focal_person_email,
            signed_date,
            allow_share,
          },
        });
        stepNext();
      } catch (error) {
        console.log(error);
        globalAjaxExceptionHandler(error, { formik: form, toast: toast, t: t });
      }
    },
    [applicant?.uuid_token, employer?.uuid_token, voe, stepNext, t]
  );

  const handleReset = useCallback(() => {
    if (!!voe.was_employed) {
      stepBack();
    } else {
      jumpToStep(1);
    }
  }, [voe.was_employed, stepBack, jumpToStep]);

  // Add function to split the focal person's name
  const getNameParts = useCallback((fullName: string = '') => {
    const parts = fullName
      .trim()
      .split(' ')
      .filter((part) => part.length > 0);
    if (parts.length < 2) {
      return {
        firstName: parts[0] || '',
        lastName: '',
      };
    }
    return {
      firstName: parts.slice(0, -1).join(' '), // Combine first and any middle names
      lastName: parts[parts.length - 1], // Last word is the last name
    };
  }, []);

  // Add name format validation
  const validateNameFormat = useCallback(
    (value: string) => {
      if (!value) return t('REQUIRED_FIELD');
      const parts = value
        .trim()
        .split(' ')
        .filter((part) => part.length > 0);
      if (parts.length < 2) {
        return t('PLEASE_ENTER_FULL_NAME_WITH_LAST_NAME');
      }
      return undefined;
    },
    [t]
  );

  const form = useFormik({
    initialValues,
    validate: (values) => {
      const errors: any = {};
      const nameError = validateNameFormat(values.focal_person_name);
      if (nameError) {
        errors.focal_person_name = nameError;
      }
      return errors;
    },
    validationSchema: ApplicantVoeEntity.yupSchemaSubmissionDetails(),
    onSubmit: handleSubmit,
    onReset: handleReset,
  });

  // Effect to initialize form values
  useEffect(() => {
    const {
      id,
      signature,
      focal_person_name,
      focal_person_title,
      focal_person_phone,
      focal_person_email,
      signed_date,
      allow_share = true,
    } = voe;

    // Only update if values have changed
    const newValues = {
      signature,
      focal_person_name: Boolean(id) ? focal_person_name : employer.manager_name,
      focal_person_title: Boolean(id) ? focal_person_title : employer.title,
      focal_person_phone: Boolean(id) ? focal_person_phone : employer.phone,
      focal_person_email: Boolean(id) ? focal_person_email : employer.email,
      signed_date: Boolean(signed_date) ? signed_date : getCurrentDate(),
      allow_share,
    };

    // Check if any values have actually changed before setting
    const hasChanged = Object.keys(newValues).some((key) => form.values[key] !== newValues[key]);

    if (hasChanged) {
      form.setValues((prev) => ({
        ...prev,
        ...newValues,
      }));
    }

    // Set initial signature state
    setHasSignature(!!signature);
  }, [voe, employer]); // Removed form from dependencies

  const isSubmitDisabled = useMemo(
    () => form.isValidating || form.isSubmitting || !form.isValid || !hasSignature,
    [form.isValidating, form.isSubmitting, form.isValid, hasSignature]
  );
  return (
    <Form onSubmit={form.handleSubmit} onReset={form.handleReset} className={styles.fadeIn}>
      <div className={styles.formContainer}>
        <div className={styles.formStep}>
          <div className={styles.formStepContent}>
            <h1 className={styles.heading__sty}>{t('SUBMISSION_DETAILS')}</h1>

            <ToastContainer />

            <div className={styles.formGridTwoColumn}>
              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  label="MY_NAME"
                  name="focal_person_name"
                  formik={form}
                  placeholder={t('ENTER_FULL_NAME_WITH_LAST_NAME')}
                />
              </div>
              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  label="TITLE"
                  name="focal_person_title"
                  formik={form}
                />
              </div>
            </div>

            <div className={styles.marginBottomMedium}>
              <BaseInput
                className="w-100"
                label="company"
                value={employer.name}
                type="text"
                readOnly
              />
            </div>

            <div className={styles.formGridTwoColumn}>
              <div className={styles.marginBottomMedium}>
                <BaseInputPhone
                  className="w-100"
                  label="PHONE"
                  required
                  name="focal_person_phone"
                  formik={form}
                />
              </div>
              <div className={styles.marginBottomMedium}>
                <BaseInput
                  className="w-100"
                  label="EMAIL"
                  name="focal_person_email"
                  formik={form}
                />
              </div>
            </div>

            <div className={styles.marginBottomMedium}>
              <BaseInput
                className="w-100"
                label="DATE"
                name="signed_date"
                type="date"
                required
                formik={form}
              />
            </div>

            <div className={styles.marginBottomMedium}>
              <OverlyPopover str="TOOLTIP_ALLOW_VOE_SHARE" placement="top">
                <BaseCheck
                  className="w-100"
                  label={t('ALLOW_VOE_SHARE_FOR_{APPLICANT_NAME}', {
                    APPLICANT_NAME: `${applicant.first_name} ${applicant.last_name}`,
                  })}
                  name="allow_share"
                  formik={form}
                />
              </OverlyPopover>
            </div>

            <div className={styles.formCard}>
              <div className={styles.formCardHeader}>
                <h3 className={styles.formCardTitle}>
                  {t('SIGNATURE')}
                  <span className={styles.required}></span>
                </h3>
              </div>
              <div className={styles.formCardBody}>
                <SignatureComponent
                  firstName={getNameParts(form.values.focal_person_name).firstName}
                  lastName={getNameParts(form.values.focal_person_name).lastName}
                  onSignatureChange={handleSignatureChange}
                  initialSignature={form.values.signature}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formStepNavigation}>
            <div className={styles.navigationButtons}>
              <Button onClick={stepBack} className={styles.secondaryButton}>
                {t('BACK')}
              </Button>
              <Button type="submit" className={styles.formButton} disabled={isSubmitDisabled}>
                {t('SUBMIT')}
                <LoaderIcon isLoading={!!form?.isSubmitting} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}

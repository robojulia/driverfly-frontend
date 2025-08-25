import { useFormik } from 'formik';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Col, Row, Card, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import styles from '../../../../styles/hiring-criteria.module.css';

import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import BaseClickToCopyInput from '../../../../components/forms/base-click-to-copy-input';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { DriverLicenseType } from '../../../../enums/users/driver-license-type.enum';
import { useAuth } from '../../../../hooks/use-auth';
import { CompanyPreferenceEntity } from '../../../../models/company/company-preferences.entity';
import CompanyApi from '../../../api/company';

import BaseCheckList from '../../../../components/forms/base-check-list';
import BaseInput from '../../../../components/forms/base-input';
import ViewModal from '../../../../components/view-details/view-modal';
import UnifiedModal from '../../../../components/modals/Modal';
import { CompanyPreferenceCategory } from '../../../../enums/company/company-preference-category.enum';
import { CompanyPreferenceEnhancementLabel } from '../../../../enums/company/company-preference-enhancement-label.enum';
import { CompanyPreferenceAutoRecrutingLabel } from '../../../../enums/company/company-preferences-auto-recruiting-label.enum';
import { CompanyPreferenceJotformLabel } from '../../../../enums/company/company-preferences-jotform-label.enum';
import { JobEmploymentType } from '../../../../enums/jobs/job-employment-type.enum';
import { JobGeography } from '../../../../enums/jobs/job-geography.enum';
import { useEffectAsync } from '../../../../utils/react';
import { CompanyPreferenceVoeLabel } from '../../../../enums/company/company-preferences-voe-label.enum';

// New components
import { SsnToggle } from '../../../../components/company-preferences/SsnToggle';
import { ReferBackProgram } from '../../../../components/company-preferences/ReferBackProgram';
import { SystemPreferences } from '../../../../components/company-preferences/SystemPreferences';
import HiringCriteriaBuilder from '../../../../components/company-preferences/HiringCriteriaBuilder';

export default function CompanyPreference() {
  const [preferences, setPreferences] = useState<CompanyPreferenceEntity[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAutoVoeModal, setShowAutoVoeModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { user, isSuperAdmin, isCompanyAdmin, company } = useAuth();

  const removeEmploymentTypes = [
    JobEmploymentType.SEASONAL,
    JobEmploymentType.PART_TIME,
    JobEmploymentType.ONE_TIME_GIG,
  ];
  const FilteredEmploymentTypes = Object.values(JobEmploymentType).filter(
    (v) => !removeEmploymentTypes.includes(v)
  );

  const api = new CompanyApi();

  const form = useFormik({
    initialValues: {
      cdl_class: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.CDL_CLASS,
        value: [],
      } as CompanyPreferenceEntity,
      employment_type: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.EMPLOYMENT_TYPE,
        value: [],
      } as CompanyPreferenceEntity,
      job_geography: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.JOB_GEOGRAPHY,
        value: [],
      } as CompanyPreferenceEntity,
      maximum_accidents: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.MAXIMUM_ACCIDENTS,
        value: 0,
      } as CompanyPreferenceEntity,
      maximum_moving_violations: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.MAXIMUM_MOVING_VIOLATIONS,
        value: 0,
      } as CompanyPreferenceEntity,
      years_cdl_experience: {
        ...new CompanyPreferenceEntity(),
        category: CompanyPreferenceCategory.JOTFORM,
        label: CompanyPreferenceJotformLabel.YEARS_CDL_EXPERIENCE,
        value: 0,
      },
    } as any,

    validationSchema: yup.object({
      cdl_class: CompanyPreferenceEntity.yupSchema(),
      maximum_moving_violations: CompanyPreferenceEntity.yupSchema(),
      maximum_accidents: CompanyPreferenceEntity.yupSchema(),
      years_cdl_experience: CompanyPreferenceEntity.yupSchema(),
      employment_type: CompanyPreferenceEntity.yupSchema(),
      job_geography: CompanyPreferenceEntity.yupSchema(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = await Promise.all(
          Object.values(values).map(async (preference: any) => {
            if (
              preference.value &&
              (Array.isArray(preference.value)
                ? preference.value.length > 0
                : preference.value !== 0)
            ) {
              if (preference.id)
                preference = await api.preferences.update(
                  user?.company.id,
                  preference.id,
                  preference
                );
              else {
                preference = await api.preferences.create(user?.company.id, preference);
              }
            } else if (preference.id) {
              await api.preferences.remove(user?.company.id, preference.id);
              delete preference.id;
            }

            return preference;
          })
        );
        setPreferences([
          ...preferences.filter((p) => ![CompanyPreferenceCategory.JOTFORM].includes(p.category)),
          ...data,
        ]);
        populateForm(data);
        toast.success('Company preferences updated successfully');
      } catch (e) {
        console.error('Unable to save preferences', e);
        toast.error('Unable to save information');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffectAsync(async () => {
    if (user.company) {
      const api = new CompanyApi();
      let data = await api.preferences.list(user.company.id);
      if (
        !data?.find(
          (d) => d?.label == CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM
        )
      ) {
        const referProgram: CompanyPreferenceEntity = await api.preferences.create(
          user?.company?.id,
          {
            category: CompanyPreferenceCategory.AUTO_RECRUITING,
            label: CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM,
            value: true,
          }
        );
        data = [...data, { ...referProgram }];
      }
      setPreferences(data);
      populateForm(
        data?.filter((pref) => [CompanyPreferenceCategory.JOTFORM].includes(pref?.category))
      );
    }
  }, []);

  const populateForm = function (preferences) {
    preferences.forEach((v) => {
      const label = v.label?.toLowerCase();
      if (label in form.values) {
        form.initialValues[label] = v;
        form.setFieldValue(label, v);
      }
    });
  };

  const handleReferBackChange = async (enabled: boolean) => {
    try {
      setLoading(true);
      let pref = preferences?.find(
        (p) => p?.label == CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM
      );
      if (pref?.id) {
        pref = await api.preferences.update(user?.company?.id, pref?.id, {
          ...pref,
          value: enabled,
        });
      } else {
        pref = await api.preferences.create(user?.company?.id, {
          category: CompanyPreferenceCategory.AUTO_RECRUITING,
          label: CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM,
          value: enabled,
        });
      }
      setPreferences([...(preferences?.filter((p) => p?.id != pref?.id) ?? []), { ...pref }]);
    } catch (e) {
      console.error('Unable to update refer back preference', e);
      toast.error('Unable to save information');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoVoeChange = async (enabled: boolean) => {
    try {
      setLoading(true);
      let pref = preferences?.find(
        (p) =>
          p.category == CompanyPreferenceCategory.VOE &&
          p?.label == CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES
      );
      if (pref?.id) {
        pref = await api.preferences.update(user?.company?.id, pref?.id, {
          ...pref,
          value: enabled,
        });
      } else {
        pref = await api.preferences.create(user?.company?.id, {
          category: CompanyPreferenceCategory.VOE,
          label: CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES,
          value: enabled,
        });
      }
      setPreferences([...(preferences?.filter((p) => p?.id != pref?.id) ?? []), { ...pref }]);
    } catch (e) {
      console.error('Unable to update auto VOE preference', e);
      toast.error('Unable to save information');
    } finally {
      setLoading(false);
    }
  };

  const handleSsnChange = async (enabled: boolean) => {
    try {
      setLoading(true);
      let pref = preferences?.find(
        (p) => p.label == CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA
      );
      if (pref?.id) {
        pref = await api.preferences.update(user?.company?.id, pref?.id, {
          ...pref,
          value: enabled,
        });
      } else {
        pref = await api.preferences.create(user?.company?.id, {
          category: CompanyPreferenceCategory.ENHANCEMENT,
          label: CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA,
          value: enabled,
        });
      }
      setPreferences([...(preferences?.filter((p) => p?.id != pref?.id) ?? []), { ...pref }]);
    } catch (e) {
      console.error('Unable to update SSN preference', e);
      toast.error('Unable to save information');
    } finally {
      setLoading(false);
    }
  };

  // Get current preference values
  const referBackEnabled = Boolean(
    preferences?.find(
      (pref) => pref?.label == CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM
    )?.value
  );

  const autoVoeEnabled = Boolean(
    preferences?.find(
      (p) =>
        p.category == CompanyPreferenceCategory.VOE &&
        p?.label == CompanyPreferenceVoeLabel.AUTOMATE_VOE_REQUEST_TO_PAST_EMPLOYEES
    )?.value
  );

  const ssnEnabled = Boolean(
    preferences?.find((p) => p.label == CompanyPreferenceEnhancementLabel.ADD_SSN_ON_DHA)?.value
  );

  return (
    <>
      <PageLayout>
        <Container fluid>
          {/* DHA Information Section */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h5 className="mb-3">Digital Hiring Application</h5>
              <p className="mb-3">
                Share your unique application URL with potential applicants to streamline your
                hiring process.
              </p>
              <BaseClickToCopyInput
                label="DIGITAL_HIRING_APP_URL"
                className="my-2 border p-3 rounded link-background"
                value={`${process.env.FRONTEND_BASE_URL ?? ''}apply/${user?.company?.slug}`}
                tooltipText="Click to copy"
              />
              <p className="text-muted small mt-2">
                Share this URL on job boards, social media, or anywhere you recruit candidates.
              </p>
            </Card.Body>
          </Card>

          {/* Driver Persona Builder - Revolutionary Hiring Criteria */}
          <HiringCriteriaBuilder
            companyId={company?.id}
            form={form}
            loading={loading}
            filteredEmploymentTypes={FilteredEmploymentTypes}
            onSubmit={form.handleSubmit}
            onReset={() => form.resetForm()}
          />

          {/* Refer Back Program Component */}
          <ReferBackProgram
            isEnabled={referBackEnabled}
            onChange={handleReferBackChange}
            loading={loading}
          />

          {/* Privacy Settings - SSN Toggle */}
          <SsnToggle checked={ssnEnabled} onChange={handleSsnChange} loading={loading} />

          {/* System Preferences - Auto VOE */}
          <SystemPreferences
            autoVoeEnabled={autoVoeEnabled}
            onAutoVoeChange={handleAutoVoeChange}
            onAutoVoeInfoClick={() => setShowAutoVoeModal(true)}
            loading={loading}
          />
        </Container>

        {/* Auto VOE Information Modal */}
        {showAutoVoeModal && (
          <UnifiedModal
            show={showAutoVoeModal}
            onClose={() => setShowAutoVoeModal(false)}
            title="Automate VOE Request to Past Employees"
            size="lg"
          >
            <div className="mb-4">
              <p>
                When new applicants apply to your organization, we automatically send verification
                of employment requests to their previous employers listed on their application.
              </p>

              <div className="alert alert-info" role="alert">
                <h6 className="mb-2">How It Works</h6>
                <ul className="mb-0">
                  <li>New applicant submits their application with employment history</li>
                  <li>We automatically send VOE requests to their previous employers</li>
                  <li>We track all verification attempts and responses</li>
                  <li>Documentation is automatically attached to the applicant&apos;s profile</li>
                </ul>
              </div>

              <p className="mb-2">
                <strong>Benefits:</strong>
              </p>
              <ul>
                <li>Streamlines your verification process</li>
                <li>Ensures compliance with DOT regulations</li>
                <li>Creates complete audit trail for each applicant</li>
                <li>Reduces manual administrative work</li>
              </ul>

              <p className="text-muted small mt-3">
                All verification attempts and responses are documented and stored with the
                applicant&apos;s records for your review.
              </p>
            </div>
          </UnifiedModal>
        )}

        {/* Welcome Modal */}
        {showModal && (
          <ViewModal show={showModal} onCloseClick={() => setShowModal(false)} closeText="Cancel">
            <div className="text-center">
              <h2>Welcome to Digital Hiring Application</h2>
              <p>
                Streamline your hiring process with our digital application system. Share your
                unique URL with candidates and manage applications efficiently.
              </p>
              <p>
                Learn more about the benefits of digital hiring:
                <span className="text-blue">
                  <span> </span>
                  <Link href="https://digitalhiringapp.com/">
                    <a target="_blank">Digital Hiring Application</a>
                  </Link>
                </span>
              </p>
            </div>
          </ViewModal>
        )}
      </PageLayout>
    </>
  );
}

CompanyPreference.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

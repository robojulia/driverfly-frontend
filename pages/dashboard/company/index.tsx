import { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Row } from 'reactstrap';
import { ApplicantPieChart } from '../../../components/charts/company/applicant-pipeline-chart';
import { ApplicantsPerRecruiterChart } from '../../../components/charts/company/applicants-per-recruiter-chart';
import { SourceBreakdownChart } from '../../../components/charts/company/source-breakdown-chart';
import { TotalApplicantBarChart } from '../../../components/charts/company/total-applicants-bar-chart';
import { HistoricalRangeFiltersComponent, HistoricalRangeFilters } from '../../../components/charts/company/historical-range-filters';
import FullLayout from '../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../components/layouts/page/page-layout';

import { useRouter } from 'next/router';
import ViewModal from '../../../components/view-details/view-modal';
import { CompanyPreferenceCategory } from '../../../enums/company/company-preference-category.enum';
import { CompanyPreferenceAutoRecrutingLabel } from '../../../enums/company/company-preferences-auto-recruiting-label.enum';
import { useTranslation } from '../../../hooks/use-translation';
import { CompanyPreferenceEntity } from '../../../models/company/company-preferences.entity';
import CompanyApi from '../../api/company';

import { DashboardStats } from '../../../components/charts/dashboard-stats';
import { WelcomeBanner } from '../../../components/dashboard/WelcomeBanner';
import DashboardChartContext from '../../../context/dashboard-chart-context';
import { EmployeeStatus } from '../../../enums/applicants/employee-status.enum';
import { Status } from '../../../enums/status.enum';
import { useAuth } from '../../../hooks/use-auth';
import { useFeatureFlags } from '../../../context/feature-flag-context';
import { ApplicantEntity } from '../../../models/applicant';
import { EmployeeEntity } from '../../../models/employee/employee.entity';
import { JobEntity } from '../../../models/job/job.entity';
import { useEffectAsync } from '../../../utils/react';
import ApplicantApi from '../../api/applicant';
import EmployeeApi from '../../api/employee';
import JobApi from '../../api/job';

export default function Dashboard() {
  const { hasPermission, company } = useAuth();
  const { isFeatureEnabled } = useFeatureFlags();
  const [applicants, setApplicants] = useState<ApplicantEntity[]>([]);
  const [employees, setEmployees] = useState<EmployeeEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isSuperAdmin, isCompanyAdmin } = useAuth();
  const api = new CompanyApi();
  const { t } = useTranslation();
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CompanyPreferenceEntity[]>([]);
  const [modalAction, setModalAction] = useState<{
    label:
      | CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING
      | CompanyPreferenceAutoRecrutingLabel.PARTICIPATE_IN_REFER_BACK_PROGRAM;
  }>(null);

  const [jobs, setJobs] = useState<JobEntity[]>([]);
  const [historicalFilters, setHistoricalFilters] = useState<HistoricalRangeFilters>({
    ownerOperator: 'all',
    recruiterIds: [],
    states: [],
    sourceTypes: [],
    statuses: [],
    referralSourceIds: [],
    timePeriod: 'month',
  });
  const applicantApi = new ApplicantApi();
  const employeeApi = new EmployeeApi();
  const jobApi = new JobApi();

  const isNewUser = !isLoading && !applicants.length && !employees.length && !jobs.length;

  useEffectAsync(async () => {
    let todayDate = new Date();
    if (company?.id) {
      try {
        // DRIV-144 - Get all applicants without any filtering
        // Explicitly don't exclude referralSource to ensure it loads for source tracking
        const a = await applicantApi.list({
          is_paginated: false,
        });
        setApplicants(a as ApplicantEntity[]);
      } catch (e) {
        console.error('Failed to load applicants:', e);
      }

      try {
        const e = (await employeeApi.list({
          status: [EmployeeStatus.ACTIVE],
        })) as EmployeeEntity[];
        setEmployees(e);
      } catch (e) {
        console.error('Failed to load employees:', e);
      }

      try {
        const j = (
          (await jobApi.list({
            companyId: company?.id,
          })) as JobEntity[]
        )?.filter(
          (job) =>
            job?.status == Status.ACTIVE &&
            (!job?.expiry_date || new Date(job?.expiry_date) >= todayDate)
        );
        setJobs(j);
      } catch (e) {
        console.error('Failed to load jobs:', e);
      }

      setIsLoading(false);
    }
  }, [company?.id]);

  const handleAdditinonalPreferenceChange = async ({ label }) => {
    let pref = await preferences?.find((p) => p?.label == label);
    if (pref?.id) {
      pref = await api.preferences.update(user?.company?.id, pref?.id, {
        ...pref,
        value: !pref.value,
      });
    } else {
      pref = await api.preferences.create(user?.company?.id, {
        category: CompanyPreferenceCategory.AUTO_RECRUITING,
        label,
        value: true,
      });
    }
    if (!!pref) setModalAction(null);
    setPreferences([...(preferences?.filter((p) => p?.id != pref?.id) ?? []), { ...pref }]);
  };

  useEffectAsync(async () => {
    setShowModal(true);
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
    }
  }, []);

  return (
    <PageLayout title="">
      {Boolean(modalAction) && (
        <ViewModal
          size="sm"
          show={Boolean(modalAction)}
          onCloseClick={() => setModalAction(null)}
          closeText="CANCEL"
        >
          <>
            <h2 className="text-center">{t('AUTO_RECURUITING_REGISTRATION')}</h2>
            <p>
              {Boolean(
                preferences?.find(
                  (v) => v?.label == CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING
                )?.value
              )
                ? t('AUTO_RECURUITING_REGISTRATION_TEXT_2')
                : t('AUTO_RECURUITING_REGISTRATION_TEXT_1')}
            </p>
            <div className="d-flex justify-content-center">
              <Button
                onClick={() => {
                  handleAdditinonalPreferenceChange(modalAction);
                  router.push('/dashboard/company/company-preferences');
                }}
              >
                {t('CONFIRM')}
              </Button>
            </div>
          </>
        </ViewModal>
      )}

      {/* Main Dashboard Container with Max Width */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {hasPermission('CanViewApplicant') && (
          <DashboardChartContext.Provider
            value={{
              state: {
                applicants,
                employees,
                jobs,
              },
              historicalFilters,
            }}
          >
            <div className="px-4 py-3">
              {isNewUser && <WelcomeBanner userName={user?.first_name} />}

              {/* Dashboard Stats - No wrapper needed */}
              <DashboardStats />

              {/* Chart Section */}
              <Row className="g-4 mb-4">
                <Col md="4">
                  <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                    <div className="mb-3">
                      <h5 className="fw-semibold mb-1">{t('APPLICANT_SOURCE')}</h5>
                      <small className="text-muted">{t('APPLICANT_SOURCE_HELP_TEXT')}</small>
                    </div>
                    <SourceBreakdownChart />
                  </div>
                </Col>

                <Col md="4">
                  <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                    <div className="mb-3">
                      <h5 className="fw-semibold mb-1">{t('APPLICATION_STATUS')}</h5>
                      <small className="text-muted">{t('APPLICATION_STATUS_HELP_TEXT')}</small>
                    </div>
                    <ApplicantPieChart />
                  </div>
                </Col>

                <Col md="4">
                  <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                    <div className="mb-3">
                      <h5 className="fw-semibold mb-1">{t('LEAD_ASSIGNMENT')}</h5>
                      <small className="text-muted">{t('LEAD_ASSIGNMENT_HELP_TEXT')}</small>
                    </div>
                    <ApplicantsPerRecruiterChart />
                  </div>
                </Col>
              </Row>

              {/* Historical Chart Section */}
              <Row className="g-4">
                <Col lg={12} md={12} sm={12}>
                  <div className="bg-white rounded-3 shadow-sm p-4">
                    <div className="mb-3">
                      <h5 className="fw-semibold mb-1">{t('HISTORICAL_RANGE')}</h5>
                    </div>
                    <HistoricalRangeFiltersComponent onFiltersChange={setHistoricalFilters} />
                    <TotalApplicantBarChart />
                  </div>
                </Col>
              </Row>
            </div>
          </DashboardChartContext.Provider>
        )}
      </div>
    </PageLayout>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

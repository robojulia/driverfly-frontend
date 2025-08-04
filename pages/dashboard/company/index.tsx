import { useState } from 'react';
import { Button, Col } from 'react-bootstrap';
import { Row } from 'reactstrap';
import { ChartInerWrapper, ChartWrapper } from '../../../components/charts/chart-wrapper';
import { ApplicantPieChart } from '../../../components/charts/company/applicant-pipeline-chart';
import { ApplicantsPerRecruiterChart } from '../../../components/charts/company/applicants-per-recruiter-chart';
import { SourceBreakdownChart } from '../../../components/charts/company/source-breakdown-chart';
import { TotalApplicantBarChart } from '../../../components/charts/company/total-applicants-bar-chart';
import FullLayout from '../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../components/layouts/page/page-layout';
import PromotionalCTA from '../../../components/shared/PromotionalCTA';

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
import { ApplicantEntity } from '../../../models/applicant';
import { EmployeeEntity } from '../../../models/employee/employee.entity';
import { JobEntity } from '../../../models/job/job.entity';
import { useEffectAsync } from '../../../utils/react';
import ApplicantApi from '../../api/applicant';
import EmployeeApi from '../../api/employee';
import JobApi from '../../api/job';

export default function Dashboard() {
  const { hasPermission, company } = useAuth();
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
  const applicantApi = new ApplicantApi();
  const employeeApi = new EmployeeApi();
  const jobApi = new JobApi();

  const isNewUser = !isLoading && !applicants.length && !employees.length && !jobs.length;

  useEffectAsync(async () => {
    let todayDate = new Date();
    if (company?.id) {
      const a = await applicantApi.list({
        withHired: true,
        is_paginated: false,
        // Ensure we get all applicant data without exclusions
        without: [],
      });
      setApplicants(a as ApplicantEntity[]);
      const e = (await employeeApi.list({
        status: [EmployeeStatus.ACTIVE],
      })) as EmployeeEntity[];
      setEmployees(e);
      const j = ((await jobApi.list({
        companyId: company?.id,
      })) as JobEntity[])?.filter(
        (job) => job?.status == Status.ACTIVE && new Date(job?.expiry_date) >= todayDate
      );
      setJobs(j);
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

  const handleAutoRecruiting = () => {
    preferences?.find(
      (pref) => pref?.label == CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING
    )?.value;

    setModalAction({
      label: CompanyPreferenceAutoRecrutingLabel.ENROLL_IN_AUTO_RECRUITING,
    });
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
      <Row>
        {hasPermission('CanViewApplicant') && (
          <DashboardChartContext.Provider
            value={{
              state: {
                applicants,
                employees,
                jobs,
              },
            }}
          >
            <div className="my_chart px-4">
              {isNewUser && <WelcomeBanner userName={user?.first_name} />}

              <ChartWrapper title={null} sm="12" md="12" lg="12" className="">
                <DashboardStats />
              </ChartWrapper>

              <Row className="px-3 my-3 innerChart-parent">
                <Col md="4">
                  <ChartInerWrapper
                    title="APPLICANT_SOURCE"
                    className=" py-1 ChartWrapper innerChart stat-items"
                    subHeading="APPLICANT_SOURCE_HELP_TEXT"
                  >
                    <SourceBreakdownChart />
                  </ChartInerWrapper>
                </Col>

                <Col md="4">
                  <ChartInerWrapper
                    title="APPLICATION_STATUS"
                    className=" py-1 ChartWrapper innerChart stat-items"
                    subHeading="APPLICATION_STATUS_HELP_TEXT"
                  >
                    <ApplicantPieChart />
                  </ChartInerWrapper>
                </Col>

                <Col md="4">
                  <ChartInerWrapper
                    title="LEAD_ASSIGNMENT"
                    className=" py-1 ChartWrapper innerChart stat-items"
                    subHeading="LEAD_ASSIGNMENT_HELP_TEXT"
                  >
                    <ApplicantsPerRecruiterChart />
                  </ChartInerWrapper>
                </Col>
              </Row>

              <Row className="my-2 px-2 mr-2">
                <Col lg={9} md={8} sm={12}>
                  <ChartWrapper
                    title="HISTORICAL_RANGE"
                    md="12"
                    lg="12"
                    sm="12"
                    className="py-4 ChartWrapper stat-items"
                  >
                    <TotalApplicantBarChart />
                  </ChartWrapper>
                </Col>

                <Col lg={3} md={4} sm={12}>
                  <PromotionalCTA
                    title="Sign Up For Auto Recruiting"
                    buttonText="Get Drivers Now!"
                    onClick={handleAutoRecruiting}
                  />
                </Col>
              </Row>
            </div>
          </DashboardChartContext.Provider>
        )}
      </Row>
    </PageLayout>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

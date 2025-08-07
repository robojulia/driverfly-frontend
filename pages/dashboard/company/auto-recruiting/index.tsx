import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { useAuth } from '../../../../hooks/use-auth';
import AutoRecruitingOnboarding from '../../../../components/auto-recruiting/auto-recruiting-onboarding';
import AutoRecruitingDashboard from '../../../../components/auto-recruiting/auto-recruiting-dashboard';
import CompanyApi from '../../../api/company';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import { LoaderIcon } from '../../../../components/loading/loader-icon';
import { toast } from 'react-toastify';
import { CompanyPreferenceCategory } from '../../../../enums/company/company-preference-category.enum';

const AutoRecruitingPage = () => {
  const { company } = useAuth();
  const [isAutoRecruitingEnabled, setIsAutoRecruitingEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const companyApi = new CompanyApi();

  useEffect(() => {
    const checkAutoRecruitingStatus = async () => {
      try {
        if (company?.id) {
          const preferences = await companyApi.preferences.list(company.id, {
            label: 'ENROLL_IN_AUTO_RECRUITING',
          });
          const autoRecruitingPref = preferences.find(
            (pref) => pref.label === 'ENROLL_IN_AUTO_RECRUITING'
          );
          setIsAutoRecruitingEnabled(autoRecruitingPref?.value === true);
        }
      } catch (error) {
        console.error('Error fetching auto-recruiting status:', error);
        setIsAutoRecruitingEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkAutoRecruitingStatus();
  }, [company?.id]);

  const handleEnableAutoRecruiting = async () => {
    try {
      if (company?.id) {
        // First, try to find if the preference already exists
        const preferences = await companyApi.preferences.list(company.id, {
          label: 'ENROLL_IN_AUTO_RECRUITING',
        });
        const autoRecruitingPref = preferences.find(
          (pref) => pref.label === 'ENROLL_IN_AUTO_RECRUITING'
        );

        if (autoRecruitingPref?.id) {
          // Update existing preference to true
          await companyApi.preferences.update(company.id, autoRecruitingPref.id, {
            ...autoRecruitingPref,
            value: true,
          });
        } else {
          // Create new preference
          await companyApi.preferences.create(company.id, {
            category: CompanyPreferenceCategory.AUTO_RECRUITING,
            label: 'ENROLL_IN_AUTO_RECRUITING',
            value: true,
          });
        }

        setIsAutoRecruitingEnabled(true);
        toast.success('Auto Recruiting has been enabled successfully!');
      }
    } catch (error) {
      console.error('Error enabling auto-recruiting:', error);
      toast.error('Failed to enable Auto Recruiting. Please try again.');
    }
  };

  const handleDisableAutoRecruiting = async () => {
    try {
      if (company?.id) {
        // Find the existing preference
        const preferences = await companyApi.preferences.list(company.id, {
          label: 'ENROLL_IN_AUTO_RECRUITING',
        });
        const autoRecruitingPref = preferences.find(
          (pref) => pref.label === 'ENROLL_IN_AUTO_RECRUITING'
        );

        if (autoRecruitingPref?.id) {
          // Update the existing preference to false
          await companyApi.preferences.update(company.id, autoRecruitingPref.id, {
            ...autoRecruitingPref,
            value: false,
          });
        } else {
          // Create a new preference set to false
          await companyApi.preferences.create(company.id, {
            category: CompanyPreferenceCategory.AUTO_RECRUITING,
            label: 'ENROLL_IN_AUTO_RECRUITING',
            value: false,
          });
        }

        setIsAutoRecruitingEnabled(false);
        toast.success('Auto Recruiting has been disabled successfully.');
      }
    } catch (error) {
      console.error('Error disabling auto-recruiting:', error);
      toast.error('Failed to disable Auto Recruiting. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container
        fluid
        className="p-4 d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
      >
        <LoaderIcon isLoading={true} />
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          {isAutoRecruitingEnabled ? (
            <AutoRecruitingDashboard onDisable={handleDisableAutoRecruiting} />
          ) : (
            <AutoRecruitingOnboarding onEnable={handleEnableAutoRecruiting} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

AutoRecruitingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <FullLayout>{page}</FullLayout>;
};

export default AutoRecruitingPage;

import React, { useState } from 'react';
import { Card, CardBody, Button, Form, FormGroup, Input, Label } from 'reactstrap';
import OnboardingHero from './components/onboarding-hero';
import HowItWorksSection from './components/how-it-works-section';
import BenefitsVisualization from './components/benefits-visualization';
import ProcessFlow from './components/process-flow';
import LegalConsent from './components/legal-consent';
import styles from './styles/auto-recruiting.module.css';

interface AutoRecruitingOnboardingProps {
  onEnable: () => Promise<void>;
}

const AutoRecruitingOnboarding: React.FC<AutoRecruitingOnboardingProps> = ({ onEnable }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [enabling, setEnabling] = useState(false);

  const handleEnableAutoRecruiting = async () => {
    if (!agreedToTerms) return;

    setEnabling(true);
    try {
      await onEnable();
    } finally {
      setEnabling(false);
    }
  };

  return (
    <div className={styles['auto-recruiting-onboarding']}>
      {/* Hero Section */}
      <OnboardingHero />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Benefits Visualization */}
      <BenefitsVisualization />

      {/* Process Flow */}
      <ProcessFlow />

      {/* Legal Consent and Enable Button */}
      <Card className="border-0 shadow-sm">
        <CardBody className="p-5">
          <div className="text-center">
            <h3 className="mb-4">Ready to Enable Auto Recruiting?</h3>

            <LegalConsent />

            <Form className="mt-4">
              <FormGroup check className="mb-4">
                <Input
                  type="checkbox"
                  id="consent-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className={styles['consent-checkbox']}
                />
                <Label check for="consent-checkbox" className="ms-2 fs-6">
                  I understand how Auto Recruiting works and agree to the terms outlined above
                </Label>
              </FormGroup>

              <Button
                color="primary"
                size="lg"
                disabled={!agreedToTerms || enabling}
                onClick={handleEnableAutoRecruiting}
                className={`px-5 ${styles['enable-button']} ${
                  enabling ? styles['loading-pulse'] : ''
                }`}
              >
                {enabling ? 'Enabling...' : 'Enable Auto Recruiting'}
              </Button>
            </Form>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AutoRecruitingOnboarding;

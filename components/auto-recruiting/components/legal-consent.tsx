import React from 'react';
import { Alert } from 'reactstrap';
import { InfoCircle, ShieldCheck } from 'react-bootstrap-icons';

const LegalConsent = () => {
  return (
    <div className="legal-consent">
      <Alert color="info" className="text-start">
        <div className="d-flex">
          <InfoCircle size={20} className="me-3 mt-1 flex-shrink-0" />
          <div>
            <h6 className="alert-heading mb-3">Auto Recruiting Terms & Understanding</h6>
            <p className="mb-3">
              By enabling Auto Recruiting, you acknowledge and agree to the following:
            </p>
            <ul className="mb-3">
              <li className="mb-2">
                <strong>Data Sharing:</strong> Driver information will be automatically shared with
                your company when they match your job requirements and have completed full
                applications elsewhere.
              </li>
              <li className="mb-2">
                <strong>Eligibility Criteria:</strong> Only drivers who meet your specific job
                requirements will be added to your pool.
              </li>
              <li className="mb-2">
                <strong>Phone Verification:</strong> Driver matching is primarily based on phone
                numbers to ensure accuracy and prevent duplicates.
              </li>
              <li className="mb-2">
                <strong>Campaign Integration:</strong> Auto-recruited drivers may trigger automated
                campaigns based on your job settings and outreach preferences.
              </li>
              <li className="mb-2">
                <strong>Privacy Compliance:</strong> All data handling complies with employment
                privacy laws and Driverfly&apos;s privacy policy.
              </li>
              <li className="mb-2">
                <strong>Service Availability:</strong> Auto Recruiting runs continuously but may be
                temporarily paused for maintenance or system updates.
              </li>
            </ul>

            <div className="d-flex align-items-center mt-3 p-3 bg-light rounded">
              <ShieldCheck size={24} className="text-success me-3" />
              <div>
                <strong>Your Commitment:</strong> You agree to treat auto-recruited drivers fairly
                and in accordance with equal employment opportunity laws.
              </div>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
};

export default LegalConsent;

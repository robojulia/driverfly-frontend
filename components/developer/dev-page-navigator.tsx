import React, { useState, useContext, useMemo } from 'react';
import { Dropdown } from 'react-bootstrap';
import { List, ChevronDown, Code } from 'react-bootstrap-icons';
import JotformContext, { JotFormContextType } from '../../context/jotform-context';

interface DevPageNavigatorProps {
  formType: 'full' | 'long' | 'missing' | 'suggested';
  currentStep: number;
  totalSteps: number;
}

interface PageInfo {
  step: number;
  name: string;
  component: string;
  section: string;
}

export function DevPageNavigator({ formType, currentStep, totalSteps }: DevPageNavigatorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const {
    method: { setSteps },
  }: JotFormContextType = useContext(JotformContext);

  // Define pages based on form type
  const pages = useMemo(() => {
    switch (formType) {
      case 'full':
        return [
          {
            step: -1,
            name: 'Application Summary',
            component: 'ApplicationSummary',
            section: 'Summary',
          },
          { step: 0, name: 'Splash Page', component: 'SplashPage', section: 'Start' },
          { step: 1, name: 'ATS Jobs', component: 'AtsJobs', section: 'Short Form' },
          { step: 2, name: 'Phone Number', component: 'PhoneNumber', section: 'Short Form' },
          {
            step: 3,
            name: 'Names & Basic Info',
            component: 'NamesAndBasicInfo',
            section: 'Short Form',
          },
          { step: 4, name: 'CDL Experience', component: 'CdlExperience', section: 'Short Form' },
          {
            step: 5,
            name: 'Accident/Violation',
            component: 'AccidentViolation',
            section: 'Short Form',
          },
          {
            step: 6,
            name: 'Transmission & Endorsement',
            component: 'TransmissionAndEndorsement',
            section: 'Short Form',
          },
          { step: 7, name: 'DUI & Equipment', component: 'DuiAndEquipment', section: 'Short Form' },
          { step: 8, name: 'Preferences', component: 'Preferences', section: 'Short Form' },
          {
            step: 9,
            name: 'Continue Long Form',
            component: 'ContinueLongForm',
            section: 'Transition',
          },
          {
            step: 10,
            name: 'Driver Application',
            component: 'DriverApplication',
            section: 'Long Form',
          },
          { step: 11, name: 'Background Info', component: 'BackgroundInfo', section: 'Long Form' },
          { step: 12, name: 'Education', component: 'HighestLevelEducation', section: 'Long Form' },
          {
            step: 13,
            name: 'Driving Experience',
            component: 'DrivingExperience',
            section: 'Long Form',
          },
          { step: 14, name: 'Other Questions', component: 'OtherQueues', section: 'Long Form' },
          { step: 15, name: 'Driver License', component: 'DriverLicense', section: 'Long Form' },
          { step: 16, name: 'Medical Card', component: 'MedicalCard', section: 'Long Form' },
          {
            step: 17,
            name: 'Emergency Contact',
            component: 'EmergencyContact',
            section: 'Long Form',
          },
          {
            step: 18,
            name: 'Employment History',
            component: 'EmploymentHistory',
            section: 'Long Form',
          },
          {
            step: 19,
            name: 'Past Employment',
            component: 'PastEmploymentHistory',
            section: 'Long Form',
          },
          {
            step: 20,
            name: 'Accident History',
            component: 'AccidentHistory',
            section: 'Long Form',
          },
          {
            step: 21,
            name: 'Violation History',
            component: 'ViolationHistory',
            section: 'Long Form',
          },
          { step: 22, name: 'Past Suspension', component: 'PastSuspension', section: 'Long Form' },
          { step: 23, name: 'Unable For Job', component: 'UnableForJob', section: 'Long Form' },
          {
            step: 24,
            name: 'Felony Conviction',
            component: 'FelonyConviction',
            section: 'Long Form',
          },
          { step: 25, name: 'Drug Test', component: 'DrugTest', section: 'Long Form' },
          {
            step: 26,
            name: 'Legal Documents',
            component: 'LegalDocumentsPage',
            section: 'Long Form',
          },
          { step: 27, name: 'Thank You', component: 'ThankyouPage', section: 'Complete' },
        ];

      case 'long':
        return [
          {
            step: 0,
            name: 'Driver Application',
            component: 'DriverApplication',
            section: 'Long Form',
          },
          { step: 1, name: 'Background Info', component: 'BackgroundInfo', section: 'Long Form' },
          { step: 2, name: 'Education', component: 'HighestLevelEducation', section: 'Long Form' },
          {
            step: 3,
            name: 'Driving Experience',
            component: 'DrivingExperience',
            section: 'Long Form',
          },
          { step: 4, name: 'Other Questions', component: 'OtherQueues', section: 'Long Form' },
          { step: 5, name: 'Driver License', component: 'DriverLicense', section: 'Long Form' },
          { step: 6, name: 'Medical Card', component: 'MedicalCard', section: 'Long Form' },
          {
            step: 7,
            name: 'Emergency Contact',
            component: 'EmergencyContact',
            section: 'Long Form',
          },
          {
            step: 7,
            name: 'Employment History',
            component: 'EmploymentHistory',
            section: 'Long Form',
          },
          {
            step: 8,
            name: 'Past Employment',
            component: 'PastEmploymentHistory',
            section: 'Long Form',
          },
          {
            step: 9,
            name: 'Accident History',
            component: 'AccidentHistory',
            section: 'Long Form',
          },
          {
            step: 10,
            name: 'Violation History',
            component: 'ViolationHistory',
            section: 'Long Form',
          },
          { step: 11, name: 'Past Suspension', component: 'PastSuspension', section: 'Long Form' },
          { step: 12, name: 'Unable For Job', component: 'UnableForJob', section: 'Long Form' },
          {
            step: 13,
            name: 'Felony Conviction',
            component: 'FelonyConviction',
            section: 'Long Form',
          },
          { step: 14, name: 'Drug Test', component: 'DrugTest', section: 'Long Form' },
          {
            step: 15,
            name: 'Legal Documents',
            component: 'LegalDocumentsPage',
            section: 'Long Form',
          },
          { step: 16, name: 'Thank You', component: 'ThankyouPage', section: 'Complete' },
        ];

      case 'missing':
        return [
          { step: 0, name: 'Driver License', component: 'DriverLicense', section: 'Documents' },
          { step: 1, name: 'Medical Card', component: 'MedicalCard', section: 'Documents' },
          {
            step: 2,
            name: 'Submit Missing Docs',
            component: 'SubmitMissingDocuments',
            section: 'Documents',
          },
          { step: 3, name: 'Thank You', component: 'ThankyouPage', section: 'Complete' },
        ];

      case 'suggested':
        return [
          {
            step: 0,
            name: 'Driver Application',
            component: 'DriverApplication',
            section: 'Application',
          },
          { step: 1, name: 'Worked Before', component: 'WorkedBefore', section: 'Application' },
          {
            step: 2,
            name: 'Legal Documents',
            component: 'LegalDocumentsPage',
            section: 'Application',
          },
          { step: 3, name: 'Thank You', component: 'ThankyouPage', section: 'Complete' },
          { step: 4, name: 'Already Applied', component: 'AlreadyAppliedPage', section: 'Info' },
        ];

      default:
        return [];
    }
  }, [formType]);

  // Group pages by section
  const pagesBySection = useMemo(() => {
    const sections: { [key: string]: PageInfo[] } = {};
    pages.forEach((page) => {
      if (!sections[page.section]) {
        sections[page.section] = [];
      }
      sections[page.section].push(page);
    });
    return sections;
  }, [pages]);

  // Only show in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Show on localhost
  } else if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handlePageSelect = (step: number) => {
    if (setSteps) {
      setSteps(step);
    }
  };

  const currentPage = pages.find((p) => p.step === currentStep);

  const getStepStatus = (step: number) => {
    if (step === currentStep) return 'current';
    if (step < currentStep) return 'completed';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return '#006078';
      case 'completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  };

  if (!isVisible) {
    return (
      <div
        className="dev-page-navigator-toggle"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#343a40',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          border: '1px solid #495057',
        }}
        onClick={() => setIsVisible(true)}
        title="Developer Page Navigator"
      >
        <Code size={14} className="me-1" />
        DEV
      </div>
    );
  }

  return (
    <div
      className="dev-page-navigator"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'white',
        border: '2px solid #006078',
        borderRadius: '8px',
        padding: '16px',
        minWidth: '320px',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0" style={{ color: '#006078', fontWeight: 'bold' }}>
            <Code size={16} className="me-2" />
            Dev Navigator
          </h6>
          <small className="text-muted">
            {formType.charAt(0).toUpperCase() + formType.slice(1)} Form • Step {currentStep + 1} of{' '}
            {totalSteps}
          </small>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#6c757d',
            padding: '0',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
          }}
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Current Page Info */}
      <div
        className="mb-3 p-2"
        style={{
          background: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #dee2e6',
        }}
      >
        <div className="small fw-bold text-primary">Current Page:</div>
        <div className="small">{currentPage?.name || 'Unknown'}</div>
        <div className="small text-muted">{currentPage?.component}</div>
      </div>

      {/* Page Navigation */}
      <Dropdown>
        <Dropdown.Toggle
          variant="outline-primary"
          size="sm"
          className="w-100 d-flex justify-content-between align-items-center"
          style={{ textAlign: 'left' }}
        >
          <span>Jump to Page</span>
          <ChevronDown size={14} />
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {Object.entries(pagesBySection).map(([sectionName, sectionPages]) => (
            <div key={sectionName}>
              <Dropdown.Header className="small fw-bold" style={{ color: '#495057' }}>
                {sectionName}
              </Dropdown.Header>
              {sectionPages.map((page) => {
                const status = getStepStatus(page.step);
                const statusColor = getStatusColor(status);

                return (
                  <Dropdown.Item
                    key={page.step}
                    onClick={() => handlePageSelect(page.step)}
                    className={`d-flex justify-content-between align-items-center ${
                      status === 'current' ? 'active' : ''
                    }`}
                    style={{
                      fontSize: '13px',
                      padding: '8px 16px',
                      borderLeft: `3px solid ${statusColor}`,
                      marginLeft: '8px',
                      marginRight: '8px',
                      borderRadius: '3px',
                    }}
                  >
                    <div>
                      <div className="fw-medium">{page.name}</div>
                      <div className="text-muted small">{page.component}</div>
                    </div>
                    <div className="small" style={{ color: statusColor }}>
                      {page.step}
                    </div>
                  </Dropdown.Item>
                );
              })}
              <Dropdown.Divider />
            </div>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {/* Quick Actions */}
      <div className="mt-3 d-flex gap-2">
        <button
          className="btn btn-outline-secondary btn-sm flex-fill"
          onClick={() => handlePageSelect(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={{ fontSize: '12px' }}
        >
          ← Prev
        </button>
        <button
          className="btn btn-outline-secondary btn-sm flex-fill"
          onClick={() => handlePageSelect(Math.min(totalSteps - 1, currentStep + 1))}
          disabled={currentStep >= totalSteps - 1}
          style={{ fontSize: '12px' }}
        >
          Next →
        </button>
      </div>

      {/* Limitations Notice */}
      <div
        className="mt-3 p-2"
        style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '4px',
          fontSize: '11px',
          color: '#856404',
        }}
      >
        <strong>Limitations:</strong>
        <br />
        • Can&apos;t skip from Short Form to Long Form
        <br />
        • Can&apos;t go back from Long Form to Short Form
        <br />• Some pages may require previous data
      </div>
    </div>
  );
}

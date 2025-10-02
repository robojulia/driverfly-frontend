import React, { memo, useMemo } from 'react';
import { CheckCircleFill, CircleFill, Circle } from 'react-bootstrap-icons';

interface DocumentStepperProps {
  documents: any[];
  currentStep: number;
  completedDocuments: string[];
  onStepClick: (step: number) => void;
  form: any;
  companyPreferences: any[];
}

const DocumentStepperComponent = memo(function DocumentStepper({
  documents,
  currentStep,
  completedDocuments,
  onStepClick,
  form,
  companyPreferences,
}: DocumentStepperProps) {
  const getStepStatus = useMemo(() => {
    return (index: number, documentId: string) => {
      if (completedDocuments.includes(documentId)) {
        return 'completed';
      }
      if (index === currentStep) {
        return 'current';
      }
      if (index < currentStep) {
        return 'visited';
      }
      return 'pending';
    };
  }, [completedDocuments, currentStep]);

  const getStepIcon = useMemo(() => {
    const StepIcon = (status: string) => {
      switch (status) {
        case 'completed':
          return <CheckCircleFill className="text-success" size={24} />;
        case 'current':
          return <CircleFill className="text-primary" size={24} />;
        case 'visited':
          return <Circle className="text-secondary" size={24} />;
        default:
          return <Circle className="text-muted" size={24} />;
      }
    };
    StepIcon.displayName = 'StepIcon';
    return StepIcon;
  }, []);

  const getStepColor = useMemo(() => {
    return (status: string) => {
      switch (status) {
        case 'completed':
          return '#28a745';
        case 'current':
          return '#006078';
        case 'visited':
          return '#6c757d';
        default:
          return '#dee2e6';
      }
    };
  }, []);

  const isSsnRequired = useMemo(() => {
    return (document: any) => {
      return (
        document.ssnRequired && companyPreferences?.find((v) => v.label === 'ADD_SSN_ON_DHA')?.value
      );
    };
  }, [companyPreferences]);

  const currentDocument = documents[currentStep];

  const progressPercentage = useMemo(() => {
    return {
      completed: (completedDocuments.length / documents.length) * 100,
      current: ((currentStep + 1 - completedDocuments.length) / documents.length) * 100,
    };
  }, [completedDocuments.length, documents.length, currentStep]);

  return (
    <div className="document-stepper mb-4">
      <style>{`
        .document-stepper .clickable:hover {
          transform: translateY(-2px);
        }
        
        .document-stepper .step-icon-container {
          min-width: 24px;
          min-height: 24px;
        }
        
        @media (max-width: 991.98px) {
          .document-stepper .col {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>

      {/* Mobile Stepper - Simplified */}
      <div className="d-lg-none">
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="d-flex align-items-center">
              {getStepIcon(getStepStatus(currentStep, currentDocument.id))}
              <div className="ms-3">
                <h6 className="mb-0">
                  Step {currentStep + 1} of {documents.length}
                </h6>
                <small className="text-muted">{currentDocument.title}</small>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar bg-success"
                style={{
                  width: `${progressPercentage.completed}%`,
                  transition: 'width 0.3s ease',
                }}
              />
              <div
                className="progress-bar bg-primary"
                style={{
                  width: `${progressPercentage.current}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Stepper - Full */}
      <div className="d-none d-lg-block">
        <div className="row">
          {documents.map((document, index) => {
            const status = getStepStatus(index, document.id);
            const stepColor = getStepColor(status);
            const isClickable =
              status === 'completed' || status === 'current' || status === 'visited';

            return (
              <div key={document.id} className="col">
                <div
                  className={`document-step ${isClickable ? 'clickable' : ''}`}
                  onClick={() => isClickable && onStepClick(index)}
                  style={{
                    cursor: isClickable ? 'pointer' : 'default',
                    opacity: status === 'pending' ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Step Icon and Connector */}
                  <div className="d-flex align-items-center mb-2">
                    {/* Icon */}
                    <div className="step-icon-container position-relative">
                      {getStepIcon(status)}

                      {/* SSN Indicator */}
                      {isSsnRequired(document) && (
                        <div
                          className="position-absolute"
                          style={{
                            top: '-8px',
                            right: '-8px',
                            background: '#ffc107',
                            borderRadius: '50%',
                            width: '12px',
                            height: '12px',
                            border: '2px solid white',
                          }}
                          title="SSN Required"
                        />
                      )}
                    </div>

                    {/* Connector Line */}
                    {index < documents.length - 1 && (
                      <div
                        className="flex-grow-1 mx-3"
                        style={{
                          height: '2px',
                          background:
                            index < currentStep || completedDocuments.includes(document.id)
                              ? '#28a745'
                              : '#dee2e6',
                          transition: 'background-color 0.3s ease',
                        }}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <h6
                      className="mb-1"
                      style={{
                        color:
                          status === 'current'
                            ? '#006078'
                            : status === 'completed'
                            ? '#28a745'
                            : '#6c757d',
                        fontSize: '0.9rem',
                        fontWeight: status === 'current' ? 'bold' : 'normal',
                      }}
                    >
                      {document.title}
                    </h6>
                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      {document.description}
                    </small>

                    {/* Status Badge */}
                    <div className="mt-2">
                      {status === 'completed' && (
                        <span className="badge bg-success">Completed</span>
                      )}
                      {status === 'current' && <span className="badge bg-primary">Current</span>}
                      {status === 'pending' && (
                        <span className="badge bg-light text-dark">Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

DocumentStepperComponent.displayName = 'DocumentStepper';

export default DocumentStepperComponent;

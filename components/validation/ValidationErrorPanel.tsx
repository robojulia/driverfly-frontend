import { useState } from 'react';
import { Alert, Badge } from 'react-bootstrap';
import { ExclamationTriangleFill, X } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';

interface ValidationError {
  formId: string;
  errors: any;
}

interface ValidationErrorPanelProps {
  validationErrors: ValidationError[];
  onClose: () => void;
}

const FORM_LABELS: Record<string, string> = {
  'basic-details': 'Basic Information',
  'basic-info': 'Basic Information',
  'licensing': 'CDL Information',
  'equipment': 'Equipment Experience',
  'equipment-owned': 'Equipment Owned',
  'work-history': 'Work History',
  'safety': 'Safety Background',
  'already-worked': 'Previous Employment',
  'preferences': 'Preferences',
  'emergency-contact': 'Emergency Contact',
  'notes': 'Notes',
};

export default function ValidationErrorPanel({ validationErrors, onClose }: ValidationErrorPanelProps) {
  const { t } = useTranslation();
  const [hoveredFormId, setHoveredFormId] = useState<string | null>(null);

  const handleErrorClick = (formId: string) => {
    // Try multiple strategies to find the form element
    let formElement = document.querySelector(`[data-form-id="${formId}"]`);

    // If not found by data-form-id, try by ID
    if (!formElement) {
      formElement = document.getElementById(formId);
    }

    // If still not found, try to find the section anchor
    if (!formElement) {
      const sectionAnchor = document.querySelector(`#${formId}`);
      if (sectionAnchor) {
        formElement = sectionAnchor.nextElementSibling;
      }
    }

    if (formElement) {
      // Scroll with some offset for better visibility
      const yOffset = -100;
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });

      // Add a temporary highlight animation
      formElement.classList.add('validation-error-highlight');
      setTimeout(() => {
        formElement?.classList.remove('validation-error-highlight');
      }, 3000);
    }
  };

  const getErrorCount = (errors: any): number => {
    if (!errors || typeof errors !== 'object') return 0;
    return Object.keys(errors).length;
  };

  const getFormLabel = (formId: string): string => {
    return FORM_LABELS[formId] || formId;
  };

  const getErrorMessages = (errors: any): string[] => {
    if (!errors || typeof errors !== 'object') return [];

    const messages: string[] = [];
    const traverse = (obj: any, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        const fieldPath = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
          // Direct error message - format the field name nicely
          const fieldName = key
            .replace(/_/g, ' ')
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/^\w/, (c) => c.toUpperCase());

          // Enhance phone validation errors with helpful format info
          let errorMessage = value;
          if (value.toLowerCase().includes('phone')) {
            errorMessage = `${value} (Expected format: (555) 123-4567 or 10-15 digits)`;
          }

          messages.push(`${fieldName}: ${errorMessage}`);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Nested errors (like nested objects)
          traverse(value, fieldPath);
        }
      });
    };

    traverse(errors);
    return messages.slice(0, 3); // Show max 3 error messages per section
  };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (formId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(formId)) {
      newExpanded.delete(formId);
    } else {
      newExpanded.add(formId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        .validation-error-panel {
          position: fixed;
          top: 80px;
          right: 20px;
          max-width: 400px;
          z-index: 9998;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .error-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          margin: 6px 0;
          background: #fff;
          border: 2px solid #dc3545;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .error-item:hover {
          background: #f8d7da;
          border-color: #bd2130;
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }

        .error-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }

        .error-icon {
          color: #dc3545;
          font-size: 18px;
          flex-shrink: 0;
        }

        .error-label {
          font-weight: 500;
          color: #333;
          flex: 1;
        }

        .error-count-badge {
          background: #dc3545;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .close-btn {
          background: transparent;
          border: none;
          color: #dc3545;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #dc3545;
          color: white;
        }

        :global(.validation-error-highlight) {
          animation: highlightPulse 3s ease-in-out;
          border: 3px solid #dc3545 !important;
          border-radius: 8px;
        }

        @keyframes highlightPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(220, 53, 69, 0);
          }
        }

        .error-details {
          margin-top: 8px;
          padding: 8px;
          background: #fff3cd;
          border-left: 3px solid #ffc107;
          border-radius: 4px;
          font-size: 12px;
        }

        .error-detail-item {
          margin: 4px 0;
          color: #856404;
        }

        .error-detail-item strong {
          color: #664d03;
        }

        .expand-icon {
          transition: transform 0.2s ease;
          margin-right: 5px;
        }

        .expand-icon.expanded {
          transform: rotate(90deg);
        }
      `}</style>

      <div className="validation-error-panel">
        <Alert variant="danger" className="shadow-lg">
          <div className="d-flex align-items-start justify-content-between mb-2">
            <div className="d-flex align-items-center gap-2">
              <ExclamationTriangleFill size={20} />
              <strong>Validation Errors ({validationErrors.length})</strong>
            </div>
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mb-2 small">
            Click on a section below to navigate and fix the errors:
          </p>
          <div>
            {validationErrors.map((error, index) => {
              const errorMessages = getErrorMessages(error.errors);
              const isExpanded = expandedSections.has(error.formId);

              return (
                <div key={index}>
                  <div
                    className="error-item"
                    onClick={() => handleErrorClick(error.formId)}
                    onMouseEnter={() => setHoveredFormId(error.formId)}
                    onMouseLeave={() => setHoveredFormId(null)}
                  >
                    <div className="error-item-content">
                      <div
                        className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSection(error.formId);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        ▶
                      </div>
                      <div className="error-label">{getFormLabel(error.formId)}</div>
                      <div className="error-count-badge">
                        {getErrorCount(error.errors)} {getErrorCount(error.errors) === 1 ? 'error' : 'errors'}
                      </div>
                    </div>
                  </div>

                  {isExpanded && errorMessages.length > 0 && (
                    <div className="error-details">
                      {errorMessages.map((msg, msgIndex) => (
                        <div key={msgIndex} className="error-detail-item">
                          {msg}
                        </div>
                      ))}
                      {getErrorCount(error.errors) > 3 && (
                        <div className="error-detail-item" style={{ fontStyle: 'italic', color: '#666' }}>
                          ... and {getErrorCount(error.errors) - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Alert>
      </div>
    </>
  );
}

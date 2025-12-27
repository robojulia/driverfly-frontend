import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill, QuestionCircleFill, InfoCircleFill } from 'react-bootstrap-icons';
import EligibilityApi, { DetailedEligibilityResponse, ScoreBreakdown } from '../../pages/api/eligibility';
import styles from '../../styles/eligibility.module.css';

interface FitComparisonModalProps {
  show: boolean;
  onHide: () => void;
  jobId: number;
  applicantId: number;
  applicantName: string;
  eligibilityStatus: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE' | 'UNKNOWN';
}

export const FitComparisonModal: React.FC<FitComparisonModalProps> = ({
  show,
  onHide,
  jobId,
  applicantId,
  applicantName,
  eligibilityStatus,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DetailedEligibilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      loadEligibilityDetails();
    }
  }, [show, jobId, applicantId]);

  const loadEligibilityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = new EligibilityApi();
      const result = await api.getApplicantJobEligibility(jobId, applicantId);
      setData(result);
    } catch (err) {
      console.error('Failed to load eligibility details:', err);
      setError('Failed to load eligibility details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRequirementIcon = (status: 'PASS' | 'FAIL' | 'PARTIAL' | 'UNKNOWN') => {
    switch (status) {
      case 'PASS':
        return <CheckCircleFill className={styles.iconSuccess} size={18} />;
      case 'FAIL':
        return <XCircleFill className={styles.iconDanger} size={18} />;
      case 'PARTIAL':
        return <InfoCircleFill className={styles.iconWarning} size={18} />;
      case 'UNKNOWN':
        return <QuestionCircleFill className={styles.iconGray} size={18} />;
      default:
        return <QuestionCircleFill className={styles.iconGray} size={18} />;
    }
  };

  const getRequirementStatusText = (status: 'PASS' | 'FAIL' | 'PARTIAL' | 'UNKNOWN') => {
    switch (status) {
      case 'PASS':
        return 'Match';
      case 'FAIL':
        return 'Does Not Match';
      case 'PARTIAL':
        return 'Partial Match';
      case 'UNKNOWN':
        return 'Unknown';
      default:
        return 'Unknown';
    }
  };

  const renderRequirementRow = (breakdown: ScoreBreakdown) => (
    <div key={breakdown.category} className={styles.requirementRow}>
      <div className={styles.requirementHeader}>
        {getRequirementIcon(breakdown.status)}
        <span className={styles.requirementCategory}>{breakdown.category}</span>
        <span className={styles.requirementStatus}>
          {getRequirementStatusText(breakdown.status)}
        </span>
      </div>
      <div className={styles.requirementDetails}>{breakdown.details}</div>
    </div>
  );

  const renderMissingFields = () => {
    if (!data?.scoringDetails?.missingFields || data.scoringDetails.missingFields.length === 0) {
      return null;
    }

    return (
      <div className={styles.missingFieldsSection}>
        <div className={styles.sectionHeader}>
          <QuestionCircleFill className={styles.iconWarning} size={20} />
          <h4>Missing Information</h4>
        </div>
        <div className={styles.missingFieldsList}>
          {data.scoringDetails.missingFields.map((field, index) => (
            <div key={index} className={styles.missingFieldItem}>
              <XCircleFill className={styles.iconDanger} size={14} />
              <span>{field}</span>
            </div>
          ))}
        </div>
        <p className={styles.missingFieldsNote}>
          These fields are required to determine full eligibility. Please update the applicant's profile or company requirements.
        </p>
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Fit Analysis: {applicantName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className={styles.modalLoading}>
            <div className={styles.loadingSpinner}></div>
            <span>Loading fit analysis...</span>
          </div>
        ) : error ? (
          <div className={styles.modalError}>
            <XCircleFill className={styles.iconDanger} size={32} />
            <p>{error}</p>
            <button onClick={loadEligibilityDetails} className={styles.retryButton}>
              Retry
            </button>
          </div>
        ) : data ? (
          <div className={styles.fitComparisonContent}>
            {/* Overall Status */}
            <div className={styles.overallStatusSection}>
              <div className={styles.overallStatusBadge}>
                <span className={`${styles.statusBadge} ${styles[eligibilityStatus.toLowerCase()]}`}>
                  {eligibilityStatus === 'ELIGIBLE' && 'Good Fit'}
                  {eligibilityStatus === 'PARTIALLY_ELIGIBLE' && 'Partial Fit'}
                  {eligibilityStatus === 'NOT_ELIGIBLE' && 'Not a Fit'}
                  {eligibilityStatus === 'UNKNOWN' && 'Unknown Fit'}
                </span>
              </div>
              <div className={styles.scoreDisplay}>
                Score: <strong>{Math.round(data.score)}%</strong>
              </div>
            </div>

            {/* Missing Fields Section (for UNKNOWN status) */}
            {eligibilityStatus === 'UNKNOWN' && renderMissingFields()}

            {/* Requirements Breakdown */}
            <div className={styles.requirementsSection}>
              <h4 className={styles.sectionTitle}>Requirements Comparison</h4>
              <div className={styles.requirementsList}>
                {data.detailedBreakdown?.cdlRequirements && renderRequirementRow(data.detailedBreakdown.cdlRequirements)}
                {data.detailedBreakdown?.experienceRequirements && renderRequirementRow(data.detailedBreakdown.experienceRequirements)}
                {data.detailedBreakdown?.geographyMatch && renderRequirementRow(data.detailedBreakdown.geographyMatch)}
                {data.detailedBreakdown?.equipmentExperience && renderRequirementRow(data.detailedBreakdown.equipmentExperience)}
                {data.detailedBreakdown?.mvrRequirements && renderRequirementRow(data.detailedBreakdown.mvrRequirements)}
                {data.detailedBreakdown?.endorsements && renderRequirementRow(data.detailedBreakdown.endorsements)}
                {data.detailedBreakdown?.preferences && renderRequirementRow(data.detailedBreakdown.preferences)}
              </div>
            </div>

            {/* Strong Matches */}
            {data.scoringDetails?.requirementsMet && data.scoringDetails.requirementsMet.length > 0 && (
              <div className={styles.strongMatchesSection}>
                <div className={styles.sectionHeader}>
                  <CheckCircleFill className={styles.iconSuccess} size={20} />
                  <h4>Strong Matches</h4>
                </div>
                <ul className={styles.requirementList}>
                  {data.scoringDetails.requirementsMet.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Requirements */}
            {data.scoringDetails?.requirementsFailed && data.scoringDetails.requirementsFailed.length > 0 && (
              <div className={styles.missingRequirementsSection}>
                <div className={styles.sectionHeader}>
                  <XCircleFill className={styles.iconDanger} size={20} />
                  <h4>Missing Requirements</h4>
                </div>
                <ul className={styles.requirementList}>
                  {data.scoringDetails.requirementsFailed.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div className={styles.recommendationsSection}>
                <div className={styles.sectionHeader}>
                  <InfoCircleFill className={styles.iconInfo} size={20} />
                  <h4>Recommendations</h4>
                </div>
                <ul className={styles.requirementList}>
                  {data.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <button onClick={onHide} className={`${styles.button} ${styles.buttonSecondary}`}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

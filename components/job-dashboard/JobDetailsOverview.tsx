import React from 'react';
import { JobEntity } from '../../models/job/job.entity';
import { useTranslation } from '../../hooks/use-translation';

interface JobDetailsOverviewProps {
  job: JobEntity;
  className?: string;
}

export const JobDetailsOverview: React.FC<JobDetailsOverviewProps> = ({ job, className = '' }) => {
  const { t } = useTranslation();

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('NOT_SPECIFIED');
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `${t('UP_TO')} $${max.toLocaleString()}`;
    return t('NOT_SPECIFIED');
  };

  // Build requirements dynamically
  const buildRequirements = () => {
    const requirements = [];

    // CDL Requirements
    if (job.cdl_class && job.cdl_class !== 'NONE') {
      requirements.push(t(`CDLClass.${job.cdl_class}`));
    }

    // Experience
    if (job.min_years_experience) {
      if (job.min_years_experience === 1) {
        requirements.push(`${job.min_years_experience}+ year CDL experience`);
      } else {
        requirements.push(`${job.min_years_experience}+ years CDL experience`);
      }
    }

    // Clean MVR
    if (job.must_have_clean_mvr) {
      requirements.push('Clean driving record');
    }

    // Drug test
    if (job.must_pass_drug_test) {
      requirements.push('DOT physical current');
    }

    // Team drivers
    if (job.team_drivers && job.team_drivers !== 'NO_TEAM_DRIVER') {
      requirements.push(t(`JobTeamDriver.${job.team_drivers}`));
    }

    // Required endorsements
    if (job.required_endorsement && job.required_endorsement.length > 0) {
      job.required_endorsement.forEach((endorsement) => {
        requirements.push(`${endorsement} endorsement`);
      });
    }

    // Minimum degree
    if (job.min_degree) {
      requirements.push(t(`EducationLevel.${job.min_degree}`));
    }

    // Accept SAP graduates
    if (job.accept_sap_graduates) {
      requirements.push('SAP graduates accepted');
    }

    return requirements;
  };

  // Build benefits dynamically
  const buildBenefits = () => {
    const benefits = [];

    // Map benefits from the job benefits array
    if (job.benefits && job.benefits.length > 0) {
      job.benefits.forEach((benefit) => {
        benefits.push(t(`JobBenefits.${benefit}`));
      });
    }

    // Benefits other
    if (job.benefits_other) {
      benefits.push(job.benefits_other);
    }

    // Pay method information as a benefit
    if (job.pay_method) {
      benefits.push(t(`JobPayMethod.${job.pay_method}`));
    }

    // Pay frequency
    if (job.pay_frequency) {
      benefits.push(t(`JobPayFrequency.${job.pay_frequency}`));
    }

    return benefits;
  };

  const requirements = buildRequirements();
  const benefits = buildBenefits();

  return (
    <div className={`${className}`}>
      {/* Job Description Card */}
      <div className="card mb-4 mt-4">
        <div className="card-body">
          <h3 className="h4 mb-3">Job Description</h3>
          <div className="text-muted" style={{ lineHeight: '1.6' }}>
            {job.description ? (
              <div dangerouslySetInnerHTML={{ __html: job.description }} />
            ) : (
              'No description provided for this position.'
            )}
          </div>
        </div>
      </div>

      {/* Requirements and Benefits Cards Grid */}
      <div className="row">
        {/* Requirements Card */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="h4 mb-3">Requirements</h3>
              {requirements.length > 0 ? (
                <ul className="list-unstyled">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="d-flex align-items-start mb-2">
                      <span className="text-success me-2" style={{ marginTop: '2px' }}>
                        •
                      </span>
                      <span className="text-muted">{requirement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No specific requirements listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Card */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="h4 mb-3">Benefits</h3>
              {benefits.length > 0 ? (
                <ul className="list-unstyled">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="d-flex align-items-start mb-2">
                      <span className="text-success me-2" style={{ marginTop: '2px' }}>
                        •
                      </span>
                      <span className="text-muted">{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No benefits information provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

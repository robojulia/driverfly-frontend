import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { JobEntity } from '../../models/job/job.entity';
import { useTranslation } from '../../hooks/use-translation';
import ViewCard from '../view-details/view-card';
import { buildAddress } from '../../utils/common';
import { JobSchedule } from '../../enums/jobs/job-schedule.enum';
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum';
import { JobEquipmentType } from '../../enums/jobs/job-equipment-type.enum';
import { JobDeliveryType } from '../../enums/jobs/job-delivery-type.enum';
import { JobTeamDriver } from '../../enums/jobs/job-team-driver.enum';
import { JobPayFrequency } from '../../enums/jobs/job-pay-frequency.enum';
import { JobPayMethod } from '../../enums/jobs/job-pay-method.enum';
import { JobBenefits } from '../../enums/jobs/job-benefits.enum';
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { EducationLevel } from '../../enums/users/education-level.enum';
import { DriverEndorsement } from '../../enums/users/driver-endorsement.enum';
import { JobDrugTestType } from '../../enums/jobs/job-drug-test-type.enum';
import { MvrType } from '../../enums/users/mvr-type.enum';
import { CriminalHistoryType } from '../../enums/users/criminal-history-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';

interface JobDetailsOverviewProps {
  job: JobEntity;
  className?: string;
}

export const JobDetailsOverview: React.FC<JobDetailsOverviewProps> = ({ job, className = '' }) => {
  const { t } = useTranslation();

  // Helper function to display field value
  const DisplayField = ({ label, value, required = false }: { label: string; value: any; required?: boolean }) => (
    <div className="mb-3">
      <label className="form-label text-muted small">
        {t(label)} {required && <span className="text-danger">*</span>}
      </label>
      <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
        {value || <span className="text-muted">{t('NOT_SPECIFIED')}</span>}
      </div>
    </div>
  );

  // Helper function to display enum value
  const getEnumLabel = (prefix: string, value: any) => {
    if (!value) return t('NOT_SPECIFIED');
    return t(`${prefix}.${value}`);
  };

  // Helper function to display array of enum values
  const getEnumArrayLabels = (prefix: string, values: any[]) => {
    if (!values || values.length === 0) return t('NOT_SPECIFIED');
    return values.map((v) => t(`${prefix}.${v}`)).join(', ');
  };

  // Format salary
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return t('NOT_SPECIFIED');
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `${t('UP_TO')} $${max.toLocaleString()}`;
    return t('NOT_SPECIFIED');
  };

  // Format experience
  const formatExperience = () => {
    if (!job.min_years_experience) return t('NOT_SPECIFIED');
    const years = Math.floor(job.min_years_experience);
    const months = Math.round((job.min_years_experience - years) * 12);
    if (years === 0 && months === 0) return t('NOT_SPECIFIED');
    const parts = [];
    if (years > 0) parts.push(`${years} ${t('YEARS_SHORT')}`);
    if (months > 0) parts.push(`${months} ${t('MONTHS_SHORT')}`);
    return parts.join(' ');
  };

  return (
    <div className={`${className}`}>
      <style>{`
        .job-overview-card .card-header {
          pointer-events: none;
          cursor: default;
        }
        .job-overview-card .card-header:hover {
          background-color: inherit;
        }
      `}</style>
      <Row className="mt-1">
        <Col md="6" lg="6" xl="6" className="p-0 px-lg-2">
          <div className="job-overview-card">
            <ViewCard title="basic_details">
            <DisplayField label="title" value={job.title} required />
            <DisplayField
              label="Street"
              value={job.location?.street}
            />
            <DisplayField
              label="City"
              value={job.location?.city}
              required
            />
            <DisplayField
              label="State"
              value={job.location?.state}
              required
            />
            <DisplayField
              label="Zip Code"
              value={job.location?.zip_code}
              required
            />
            <DisplayField
              label="expiration_date"
              value={job.expiry_date ? new Date(job.expiry_date).toLocaleDateString() : 'Never expires'}
            />
            <DisplayField
              label="drivers_needed"
              value={job.drivers_needed}
            />
            <DisplayField
              label="GEOGRAPHY"
              value={getEnumLabel('JobGeography', job.geography)}
              required
            />
            {job.geography && (
              <DisplayField
                label="max_applicant_radius"
                value={job.max_applicant_radius ? `${job.max_applicant_radius} mi` : null}
                required
              />
            )}
            <DisplayField
              label="SCHEDULE"
              value={job.schedule ? (
                job.schedule === JobSchedule.OTHER && job.schedule_other
                  ? job.schedule_other
                  : getEnumLabel('JobSchedule', job.schedule)
              ) : null}
              required
            />
            <DisplayField
              label="EMPLOYMENT_TYPE"
              value={getEnumLabel('JobEmploymentType', job.employment_type)}
              required
            />
            <div className="mb-3">
              <label className="form-label text-muted small">{t('EQUIPMENT_TYPE')}</label>
              <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
                {job.equipment_type && job.equipment_type.length > 0 ? (
                  <>
                    {getEnumArrayLabels('JobEquipmentType', job.equipment_type)}
                    {job.equipment_type.includes(JobEquipmentType.OTHER) && job.equipment_type_other && (
                      <>, {job.equipment_type_other}</>
                    )}
                  </>
                ) : (
                  <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                )}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small">{t('DELIVERY_TYPE')}</label>
              <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
                {job.delivery_type && job.delivery_type.length > 0
                  ? getEnumArrayLabels('JobDeliveryType', job.delivery_type)
                  : <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                }
              </div>
            </div>
            <DisplayField
              label="TEAM_DRIVERS"
              value={getEnumLabel('JobTeamDriver', job.team_drivers)}
            />
          </ViewCard>
          </div>
        </Col>

        <Col md="6" lg="6" xl="6" className="p-0 px-lg-2">
          <div className="job-overview-card">
            <ViewCard title="BENEFITS">
            <DisplayField
              label="PAY_FREQUENCY"
              value={getEnumLabel('JobPayFrequency', job.pay_frequency)}
            />
            <DisplayField
              label="PAY_METHOD"
              value={getEnumLabel('JobPayMethod', job.pay_method)}
              required
            />

            {(job.pay_method === JobPayMethod.PERCENT_PER_MOVE ||
              job.pay_method === JobPayMethod.PERCENT_PER_WEIGHT) && (
              <Row>
                <Col md={6}>
                  <DisplayField
                    label="min_percent"
                    value={job.min_percent ? `${job.min_percent}%` : null}
                    required
                  />
                </Col>
                <Col md={6}>
                  <DisplayField
                    label="max_percent"
                    value={job.max_percent ? `${job.max_percent}%` : null}
                    required
                  />
                </Col>
              </Row>
            )}

            {job.pay_method === JobPayMethod.RATE_PER_MILE && (
              <>
                <Row>
                  <Col md={6}>
                    <DisplayField
                      label="min_miles"
                      value={job.min_miles ? `${job.min_miles} mi` : null}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <DisplayField
                      label="max_miles"
                      value={job.max_miles ? `${job.max_miles} mi` : null}
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <DisplayField
                      label="min_rate"
                      value={job.min_rate ? `$${job.min_rate}` : null}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <DisplayField
                      label="max_rate"
                      value={job.max_rate ? `$${job.max_rate}` : null}
                      required
                    />
                  </Col>
                </Row>
              </>
            )}

            {job.pay_method === JobPayMethod.HOURLY && (
              <>
                <Row>
                  <Col md={6}>
                    <DisplayField
                      label="min_hours"
                      value={job.min_hours ? `${job.min_hours} hrs` : null}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <DisplayField
                      label="max_hours"
                      value={job.max_hours ? `${job.max_hours} hrs` : null}
                      required
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <DisplayField
                      label="min_rate"
                      value={job.min_rate ? `$${job.min_rate}` : null}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <DisplayField
                      label="max_rate"
                      value={job.max_rate ? `$${job.max_rate}` : null}
                      required
                    />
                  </Col>
                </Row>
              </>
            )}

            {job.pay_method === JobPayMethod.SALARY && (
              <Row>
                <Col md={6}>
                  <DisplayField
                    label="min_salary"
                    value={job.min_salary ? `$${job.min_salary.toLocaleString()}` : null}
                    required
                  />
                </Col>
                <Col md={6}>
                  <DisplayField
                    label="max_salary"
                    value={job.max_salary ? `$${job.max_salary.toLocaleString()}` : null}
                  />
                </Col>
              </Row>
            )}

            <Row>
              <Col md={6}>
                <DisplayField
                  label="min_weekly"
                  value={job.min_weekly_pay ? `$${job.min_weekly_pay.toLocaleString()}` : null}
                  required
                />
              </Col>
              <Col md={6}>
                <DisplayField
                  label="max_weekly"
                  value={job.max_weekly_pay ? `$${job.max_weekly_pay.toLocaleString()}` : null}
                  required
                />
              </Col>
            </Row>

            <div className="mb-3">
              <label className="form-label text-muted small">{t('BENEFITS')}</label>
              <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
                {job.benefits && job.benefits.length > 0 ? (
                  <>
                    {getEnumArrayLabels('JobBenefits', job.benefits)}
                    {job.benefits.includes(JobBenefits.OTHER) && job.benefits_other && (
                      <>, {job.benefits_other}</>
                    )}
                  </>
                ) : (
                  <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                )}
              </div>
            </div>
          </ViewCard>
          </div>
        </Col>
      </Row>

      <hr />

      <Row>
        <Col className="p-0 px-lg-2">
          <div className="job-overview-card">
            <ViewCard title="DESCRIPTION">
            <div className="mb-3">
              <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem', overflow: 'visible' }}>
                {job.description ? (
                  <div dangerouslySetInnerHTML={{ __html: job.description }} />
                ) : (
                  <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                )}
              </div>
            </div>
          </ViewCard>
          </div>
        </Col>
      </Row>

      <hr />

      <Row>
        <Col className="p-0 px-lg-2">
          <div className="job-overview-card">
            <ViewCard title="requirements">
            <Row>
              <Col md="6">
                <DisplayField
                  label="MINIMUM_CDL_CLASS"
                  value={getEnumLabel('DriverLicenseType', job.cdl_class)}
                  required
                />
                <DisplayField
                  label="MIN_YEARS_EXPERIENCE"
                  value={formatExperience()}
                  required
                />
                <DisplayField
                  label="min_degree"
                  value={getEnumLabel('EducationLevel', job.min_degree)}
                />

                {job.required_skills && job.required_skills.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">{t('REQUIRED_SKILLS')}</label>
                    <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem' }}>
                      {job.required_skills.map((skill, index) => (
                        <div key={index} className="mb-2">
                          {getEnumLabel('JobEquipmentType', skill.type)} - {skill.years} {t('YEARS_SHORT')}
                          {skill.months > 0 && ` ${skill.months} ${t('MONTHS_SHORT')}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <DisplayField
                  label="other_required_skills"
                  value={job.required_skills_other}
                />

                {job.employment_type === JobEmploymentType.OWNER_OPERATOR &&
                 job.required_equipment &&
                 job.required_equipment.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">{t('REQUIRED_EQUIPMENT')}</label>
                    <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem' }}>
                      {job.required_equipment.map((equipment, index) => (
                        <div key={index} className="mb-2">
                          {getEnumLabel('JobEquipmentType', equipment.type)} - {t('QUANTITY')}: {equipment.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-muted small">{t('special_endorsements')}</label>
                  <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
                    {job.required_endorsement && job.required_endorsement.length > 0
                      ? getEnumArrayLabels('DriverEndorsement', job.required_endorsement)
                      : <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                    }
                  </div>
                </div>
              </Col>

              <Col md="6">
                <div className="mb-3">
                  <label className="form-label text-muted small">{t('drug_test_type')}</label>
                  <div className="form-control bg-light border-0" style={{ minHeight: '38px' }}>
                    {job.drug_test_type && job.drug_test_type.length > 0
                      ? getEnumArrayLabels('JobDrugTestType', job.drug_test_type)
                      : <span className="text-muted">{t('NOT_SPECIFIED')}</span>
                    }
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">{t('must_have_clean_mvr')}</label>
                  <div className="form-control bg-light border-0">
                    {job.must_have_clean_mvr ? t('YES') : t('NO')}
                  </div>
                </div>

                {!job.must_have_clean_mvr && job.mvr_requirements && job.mvr_requirements.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">{t('MVR_REQUIREMENTS')}</label>
                    <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem' }}>
                      {job.mvr_requirements.map((req, index) => (
                        <div key={index} className="mb-2">
                          Max {req.max_count} {getEnumLabel('MvrType', req.type)} within {req.max_years} {t('YEARS_SHORT')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label text-muted small">{t('accept_sap_graduates')}</label>
                  <div className="form-control bg-light border-0">
                    {job.accept_sap_graduates ? t('YES') : t('NO')}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small">{t('no_criminal_history')}</label>
                  <div className="form-control bg-light border-0">
                    {job.must_have_clean_criminal_history ? t('YES') : t('NO')}
                  </div>
                </div>

                {!job.must_have_clean_criminal_history && job.criminal_history && job.criminal_history.length > 0 && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">{t('CRIMINAL_HISTORY')}</label>
                    <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem' }}>
                      {job.criminal_history.map((req, index) => (
                        <div key={index} className="mb-2">
                          Max {req.max_count} {getEnumLabel('CriminalHistoryType', req.type)} within {req.max_years} {t('YEARS_SHORT')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <DisplayField
                  label="other_safety_requirements"
                  value={job.safety_requirements_other}
                />

                <div className="mb-3">
                  <label className="form-label text-muted small">Job Orientation</label>
                  <div className="form-control bg-light border-0">
                    {job.is_orientation_needed ? t('YES') : t('NO')}
                  </div>
                </div>

                {job.is_orientation_needed && job.orientation && (
                  <div className="mb-3">
                    <label className="form-label text-muted small">{t('ORIENTATION_DETAILS')}</label>
                    <div className="form-control bg-light border-0" style={{ height: 'auto', padding: '0.75rem' }}>
                      {job.orientation.location && (
                        <div className="mb-2">
                          <strong>{t('location')}:</strong> {buildAddress(job.orientation.location)}
                        </div>
                      )}
                      {job.orientation.start_datetime && (
                        <div className="mb-2">
                          <strong>{t('START_DATE')}:</strong> {new Date(job.orientation.start_datetime).toLocaleDateString()}
                        </div>
                      )}
                      {job.orientation.end_datetime && (
                        <div className="mb-2">
                          <strong>{t('END_DATE')}:</strong> {new Date(job.orientation.end_datetime).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </ViewCard>
          </div>
        </Col>
      </Row>
    </div>
  );
};

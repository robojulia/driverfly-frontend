import React, { useState, useEffect, useCallback } from 'react';
import { Button, Col, Row, Card } from 'react-bootstrap';
import { FormikProps } from 'formik';
import styles from '../../styles/hiring-criteria.module.css';
import { Checkbox } from '../shared/dha/checkbox';
import CompanyApi from '../../pages/api/company';

// Import enums
import { DriverLicenseType } from '../../enums/users/driver-license-type.enum';
import { JobEmploymentType } from '../../enums/jobs/job-employment-type.enum';
import { JobGeography } from '../../enums/jobs/job-geography.enum';

interface HiringCriteriaBuilderProps {
  form: FormikProps<any>;
  loading: boolean;
  filteredEmploymentTypes: JobEmploymentType[];
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  companyId: number;
  isFirstRunExperience?: boolean;
}

const HiringCriteriaBuilder: React.FC<HiringCriteriaBuilderProps> = ({
  form,
  loading,
  filteredEmploymentTypes,
  onSubmit,
  onReset,
  isFirstRunExperience = false,
}) => {
  return (
    <>
      {/* Driver Persona Builder - Revolutionary Hiring Criteria - Only show during FRE */}
      {isFirstRunExperience && (
        <div className={styles.hiringBuilder}>
          <Card className={`border-0 shadow-lg mb-4 ${styles.brandGradient}`}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h3 className="mb-2 fw-bold text-white">Build Your Ideal Driver Profile</h3>
                <p className="mb-4 opacity-90 text-white">
                  Craft your perfect candidate persona with our smart criteria builder. See
                  real-time feedback on your hiring pool as you adjust preferences.
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Driver Qualifications Section */}
      <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
        <Card.Body className="p-4">
          <form onSubmit={onSubmit}>
            <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600' }}>Driver Qualifications</h5>

            {/* CDL Requirements */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#1a202c' }}>
                CDL Requirements
              </label>
              <div className="d-flex gap-2 mb-2">
                {Object.values(DriverLicenseType).map((cdlType) => (
                  <button
                    key={cdlType}
                    type="button"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: form.values.cdl_class.value?.includes(cdlType)
                        ? '#2d3748'
                        : 'white',
                      color: form.values.cdl_class.value?.includes(cdlType)
                        ? 'white'
                        : '#2d3748',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                      const currentValues = form.values.cdl_class.value || [];
                      const newValues = currentValues.includes(cdlType)
                        ? currentValues.filter((v) => v !== cdlType)
                        : [...currentValues, cdlType];
                      form.setFieldValue('cdl_class.value', newValues);
                    }}
                  >
                    {cdlType === DriverLicenseType.NO_CDL && 'No CDL'}
                    {cdlType === DriverLicenseType.CDL_CLASS_A && 'Class A'}
                    {cdlType === DriverLicenseType.CDL_CLASS_B && 'Class B'}
                    {cdlType === DriverLicenseType.CDL_CLASS_C && 'Class C'}
                  </button>
                ))}
              </div>
              <div className="small" style={{ color: '#718096' }}>
                Only Class A holders are eligible.
              </div>
            </div>

            {/* Employment Style */}
            <div className="mb-4">
              <label className="form-label fw-semibold mb-2" style={{ fontSize: '14px', color: '#1a202c' }}>
                Employment Style
              </label>
              <div className="d-flex gap-2">
                {filteredEmploymentTypes.map((empType) => (
                  <button
                    key={empType}
                    type="button"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      background: form.values.employment_type.value?.includes(empType)
                        ? '#2d3748'
                        : 'white',
                      color: form.values.employment_type.value?.includes(empType)
                        ? 'white'
                        : '#2d3748',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => {
                      const currentValues = form.values.employment_type.value || [];
                      const newValues = currentValues.includes(empType)
                        ? currentValues.filter((v) => v !== empType)
                        : [...currentValues, empType];
                      form.setFieldValue('employment_type.value', newValues);
                    }}
                  >
                    {empType === JobEmploymentType.W2 && 'Company Driver (W2)'}
                    {empType === JobEmploymentType.CONTRACT && 'Contractor (1099)'}
                    {empType === JobEmploymentType.OWNER_OPERATOR && 'Owner-Operator'}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Geographic Scope Section */}
      <Card className="border-0 shadow-sm mb-4" style={{ background: 'white' }}>
        <Card.Body className="p-4">
          <h5 className="mb-1" style={{ color: '#1a202c', fontWeight: '600' }}>Geographic Scope</h5>

          <div className="mb-3">
            <div className="d-flex gap-2 mb-2">
              {Object.values(JobGeography).map((geo) => (
                <button
                  key={geo}
                  type="button"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    background: form.values.job_geography.value?.includes(geo)
                      ? '#2d3748'
                      : 'white',
                    color: form.values.job_geography.value?.includes(geo)
                      ? 'white'
                      : '#2d3748',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    const currentValues = form.values.job_geography.value || [];
                    const newValues = currentValues.includes(geo)
                      ? currentValues.filter((v) => v !== geo)
                      : [...currentValues, geo];
                    form.setFieldValue('job_geography.value', newValues);
                  }}
                >
                  {geo === JobGeography.LOCAL && 'Local'}
                  {geo === JobGeography.REGIONAL && 'Regional'}
                  {geo === JobGeography.OTR && 'Over the Road'}
                </button>
              ))}
            </div>
            <div className="small" style={{ color: '#718096' }}>
              Drivers operate across multiple states and regions, covering long distances.
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Experience & Safety Metrics - Three Column Layout */}
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ background: 'white' }}>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>CDL Experience</div>
                <div style={{ color: '#718096', fontSize: '13px' }}>Minimum years required</div>
              </div>

              <div className="text-center mb-3">
                <div style={{ fontSize: '36px', fontWeight: '600', color: '#2d3748' }}>
                  {form.values.years_cdl_experience.value || 0}
                  <span style={{ fontSize: '18px', color: '#718096' }}> years</span>
                </div>
              </div>

              <div className="mb-2">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="10"
                  value={form.values.years_cdl_experience.value || 0}
                  onChange={(e) =>
                    form.setFieldValue(
                      'years_cdl_experience.value',
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ background: 'white' }}>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Maximum Accidents</div>
                <div style={{ color: '#718096', fontSize: '13px' }}>Past 3 years</div>
              </div>

              <div className="text-center mb-3">
                <div style={{ fontSize: '36px', fontWeight: '600', color: '#2d3748' }}>
                  {form.values.maximum_accidents.value || 0}
                  <span style={{ fontSize: '18px', color: '#718096' }}> max</span>
                </div>
              </div>

              <div className="mb-2">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="5"
                  value={form.values.maximum_accidents.value || 0}
                  onChange={(e) =>
                    form.setFieldValue('maximum_accidents.value', parseInt(e.target.value))
                  }
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ background: 'white' }}>
            <Card.Body className="p-4">
              <div className="mb-3">
                <div style={{ color: '#1a202c', fontWeight: '600', fontSize: '14px' }}>Maximum Violations</div>
                <div style={{ color: '#718096', fontSize: '13px' }}>Moving violations, 3 years</div>
              </div>

              <div className="text-center mb-3">
                <div style={{ fontSize: '36px', fontWeight: '600', color: '#2d3748' }}>
                  {form.values.maximum_moving_violations.value || 0}
                  <span style={{ fontSize: '18px', color: '#718096' }}> max</span>
                </div>
              </div>

              <div className="mb-2">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="8"
                  value={form.values.maximum_moving_violations.value || 0}
                  onChange={(e) =>
                    form.setFieldValue(
                      'maximum_moving_violations.value',
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default HiringCriteriaBuilder;

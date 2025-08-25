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
}

const HiringCriteriaBuilder: React.FC<HiringCriteriaBuilderProps> = ({
  form,
  loading,
  filteredEmploymentTypes,
  onSubmit,
  onReset,
}) => {
  return (
    <>
      {/* Driver Persona Builder - Revolutionary Hiring Criteria */}
      <div className={styles.hiringBuilder}>
        <Card className={`border-0 shadow-lg mb-4 ${styles.brandGradient}`}>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <h3 className="mb-2 fw-bold text-white">Build Your Ideal Driver Profile</h3>
              <p className="mb-4 opacity-90 text-white">
                Craft your perfect candidate persona with our smart criteria builder. See real-time
                feedback on your hiring pool as you adjust preferences.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Interactive Criteria Builder */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <form onSubmit={onSubmit}>
            {/* CDL & Employment Type - Visual Selection */}
            <div className="mb-5">
              <h6 className="mb-4 d-flex align-items-center">
                <span className={`${styles.sectionBadge} badge rounded-pill me-2`}>1</span>
                Driver Qualifications
              </h6>

              <div className="alert alert-info mb-4">
                Select the CDL requirements and employment types that match your hiring needs. Click
                on the cards below to select/deselect options. You can choose multiple options in
                each category.
              </div>

              <Row className="g-4">
                <Col md={6}>
                  <label className="form-label fw-semibold mb-3">CDL Requirements</label>
                  <div className="row g-2">
                    {Object.values(DriverLicenseType).map((cdlType) => (
                      <div key={cdlType} className="col-6">
                        <div
                          className={`${styles.criteriaCardSmall} card h-100 ${
                            form.values.cdl_class.value?.includes(cdlType)
                              ? `${styles.selected} ${styles.primarySelected}`
                              : 'border-light'
                          }`}
                          onClick={() => {
                            const currentValues = form.values.cdl_class.value || [];
                            const newValues = currentValues.includes(cdlType)
                              ? currentValues.filter((v) => v !== cdlType)
                              : [...currentValues, cdlType];
                            form.setFieldValue('cdl_class.value', newValues);
                          }}
                        >
                          <div className="card-body p-3 text-center position-relative">
                            <div
                              className="position-absolute top-0 end-0"
                              style={{ transform: 'scale(0.8)' }}
                            >
                              <Checkbox
                                name={`cdl-${cdlType}`}
                                checked={form.values.cdl_class.value?.includes(cdlType) || false}
                                onChange={() => {}} // Handled by card click
                                size="small"
                                className="mb-0"
                              />
                            </div>
                            <div className="fw-semibold">
                              {cdlType === DriverLicenseType.NO_CDL && 'No CDL'}
                              {cdlType === DriverLicenseType.CDL_CLASS_A && 'Class A CDL'}
                              {cdlType === DriverLicenseType.CDL_CLASS_B && 'Class B CDL'}
                              {cdlType === DriverLicenseType.CDL_CLASS_C && 'Class C CDL'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>

                <Col md={6}>
                  <label className="form-label fw-semibold mb-3">Employment Style</label>
                  <div className="row g-2">
                    {filteredEmploymentTypes.map((empType) => (
                      <div key={empType} className="col-12">
                        <div
                          className={`${styles.criteriaCard} card ${
                            form.values.employment_type.value?.includes(empType)
                              ? `${styles.selected} ${styles.brandSelected}`
                              : 'border-light'
                          }`}
                          onClick={() => {
                            const currentValues = form.values.employment_type.value || [];
                            const newValues = currentValues.includes(empType)
                              ? currentValues.filter((v) => v !== empType)
                              : [...currentValues, empType];
                            form.setFieldValue('employment_type.value', newValues);
                          }}
                        >
                          <div className="card-body p-3 d-flex align-items-center position-relative">
                            <div
                              className="position-absolute top-0 end-0"
                              style={{ transform: 'scale(0.8)' }}
                            >
                              <Checkbox
                                name={`employment-${empType}`}
                                checked={
                                  form.values.employment_type.value?.includes(empType) || false
                                }
                                onChange={() => {}} // Handled by card click
                                size="small"
                                className="mb-0"
                              />
                            </div>
                            <div>
                              <div className="fw-semibold">
                                {empType === JobEmploymentType.W2 && 'Company Driver (W2)'}
                                {empType === JobEmploymentType.CONTRACT && 'Contractor (1099)'}
                                {empType === JobEmploymentType.OWNER_OPERATOR && 'Owner-Operator'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </div>

            {/* Geographic Preferences */}
            <div className="mb-5">
              <h6 className="mb-4 d-flex align-items-center">
                <span className={`${styles.sectionBadge} badge rounded-pill me-2`}>2</span>
                Geographic Scope
              </h6>

              <div className="row g-3">
                {Object.values(JobGeography).map((geo) => (
                  <div key={geo} className="col-md-4">
                    <div
                      className={`${styles.criteriaCard} card h-100 ${
                        form.values.job_geography.value?.includes(geo)
                          ? `${styles.selected} ${styles.infoSelected}`
                          : 'border-light'
                      }`}
                      onClick={() => {
                        const currentValues = form.values.job_geography.value || [];
                        const newValues = currentValues.includes(geo)
                          ? currentValues.filter((v) => v !== geo)
                          : [...currentValues, geo];
                        form.setFieldValue('job_geography.value', newValues);
                      }}
                    >
                      <div className="card-body p-4 text-center position-relative">
                        <div
                          className="position-absolute top-0 end-0"
                          style={{ transform: 'scale(0.8)' }}
                        >
                          <Checkbox
                            name={`geography-${geo}`}
                            checked={form.values.job_geography.value?.includes(geo) || false}
                            onChange={() => {}}
                            size="small"
                            className="mb-0"
                          />
                        </div>
                        <div className="fw-bold mb-2">
                          {geo === JobGeography.LOCAL && 'Local'}
                          {geo === JobGeography.REGIONAL && 'Regional'}
                          {geo === JobGeography.OTR && 'Over The Road'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Experience & Safety Sliders */}
            <div className="mb-5">
              <h6 className="mb-4 d-flex align-items-center">
                <span className={`${styles.sectionBadge} badge rounded-pill me-2`}>3</span>
                Experience & Safety Standards
              </h6>

              <Row className="g-4">
                <Col md={4}>
                  <div className={`${styles.experienceCard} card border-0 h-100`}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div>
                          <div className="fw-semibold">CDL Experience</div>
                          <div className="text-muted small">Minimum years required</div>
                        </div>
                      </div>

                      <div className={`${styles.smartSlider} mb-3`}>
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
                        <div className="d-flex justify-content-between small text-muted">
                          <span>0</span>
                          <span>5</span>
                          <span>10+</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className={`h4 mb-1 ${styles.sliderValue}`}>
                          {form.values.years_cdl_experience.value || 0} years
                        </div>
                        <div className="small text-muted">
                          {(form.values.years_cdl_experience.value || 0) === 0 &&
                            'Open to new drivers'}
                          {(form.values.years_cdl_experience.value || 0) >= 1 &&
                            (form.values.years_cdl_experience.value || 0) <= 3 &&
                            'Building experience'}
                          {(form.values.years_cdl_experience.value || 0) >= 4 &&
                            (form.values.years_cdl_experience.value || 0) <= 7 &&
                            'Experienced professional'}
                          {(form.values.years_cdl_experience.value || 0) >= 8 && 'Industry veteran'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className={`${styles.experienceCard} card border-0 h-100`}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div>
                          <div className="fw-semibold">Maximum Accidents</div>
                          <div className="text-muted small">In past 3 years</div>
                        </div>
                      </div>

                      <div className={`${styles.smartSlider} mb-3`}>
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
                        <div className="d-flex justify-content-between small text-muted">
                          <span>0</span>
                          <span>2</span>
                          <span>5</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className={`h4 mb-1 ${styles.sliderValue}`}>
                          {form.values.maximum_accidents.value || 0} max
                        </div>
                        <div className="small text-muted">
                          {(form.values.maximum_accidents.value || 0) === 0 &&
                            'Perfect safety record only'}
                          {(form.values.maximum_accidents.value || 0) === 1 &&
                            'One minor incident allowed'}
                          {(form.values.maximum_accidents.value || 0) >= 2 &&
                            'Learning from experience'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className={`${styles.experienceCard} card border-0 h-100`}>
                    <div className="card-body p-4">
                      <div className="d-flex align-items-center mb-3">
                        <div>
                          <div className="fw-semibold">Maximum Violations</div>
                          <div className="text-muted small">Moving violations, 3 years</div>
                        </div>
                      </div>

                      <div className={`${styles.smartSlider} mb-3`}>
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
                        <div className="d-flex justify-content-between small text-muted">
                          <span>0</span>
                          <span>4</span>
                          <span>8</span>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className={`h4 mb-1 ${styles.sliderValue}`}>
                          {form.values.maximum_moving_violations.value || 0} max
                        </div>
                        <div className="small text-muted">
                          {(form.values.maximum_moving_violations.value || 0) === 0 &&
                            'Spotless driving record'}
                          {(form.values.maximum_moving_violations.value || 0) >= 1 &&
                            (form.values.maximum_moving_violations.value || 0) <= 3 &&
                            'Minor infractions OK'}
                          {(form.values.maximum_moving_violations.value || 0) >= 4 &&
                            'Room for improvement'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Action Buttons */}
            <div className={styles.floatingAction}>
              <Row>
                <Col className="d-flex justify-content-between align-items-center">
                  <div className="text-muted small">
                    <i className="fas fa-info-circle me-1"></i>
                    Changes apply immediately to all applications
                  </div>
                  <div>
                    <Button variant="outline-secondary" className="me-2" onClick={onReset}>
                      Reset to Defaults
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={form.isSubmitting || !form.isValid || loading}
                      className="px-4"
                    >
                      {form.isSubmitting || loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Save Driver Profile
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </form>
        </Card.Body>
      </Card>
    </>
  );
};

export default HiringCriteriaBuilder;

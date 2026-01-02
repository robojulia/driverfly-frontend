import { useState, useEffect, useContext, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import stateList from '../../../utils/stateList';
import { useTranslation } from '../../../hooks/use-translation';
import DashboardChartContext from '../../../context/dashboard-chart-context';
import { ApplicantStatus } from '../../../enums/applicants/applicant-status.enum';

export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export interface HistoricalRangeFilters {
  ownerOperator: string;
  recruiterIds: number[];
  states: string[];
  sourceTypes: string[];
  statuses: string[];
  referralSourceIds: number[];
  timePeriod: TimePeriod;
}

export interface HistoricalRangeFiltersProps {
  onFiltersChange: (filters: HistoricalRangeFilters) => void;
  initialFilters?: HistoricalRangeFilters;
}

const STORAGE_KEY = 'historicalRangeFilters';

export function HistoricalRangeFiltersComponent({ onFiltersChange, initialFilters }: HistoricalRangeFiltersProps) {
  const { t } = useTranslation();
  const { state } = useContext(DashboardChartContext);

  const recruiters = useMemo(() => {
    const recruiterMap = new Map<number, { id: number; name: string }>();
    state?.applicants?.forEach((applicant) => {
      if (applicant.assignedUser) {
        recruiterMap.set(applicant.assignedUser.id, {
          id: applicant.assignedUser.id,
          name:
            applicant.assignedUser.name ||
            `${applicant.assignedUser.first_name} ${applicant.assignedUser.last_name}`,
        });
      }
    });
    return Array.from(recruiterMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [state?.applicants]);

  const sourceTypes = useMemo(() => {
    const sourceMap = new Map<string, string>();
    state?.applicants?.forEach((applicant) => {
      // Use applicant.type which corresponds to "Lead Type" in the applicant profile
      if (applicant.type) {
        sourceMap.set(applicant.type, applicant.type);
      }
    });
    return Array.from(sourceMap.values()).sort();
  }, [state?.applicants]);

  const getInitialFilters = (): HistoricalRangeFilters => {
    const defaultFilters: HistoricalRangeFilters = {
      ownerOperator: 'all',
      recruiterIds: [],
      states: [],
      sourceTypes: [],
      statuses: [],
      referralSourceIds: [],
      timePeriod: 'month',
    };

    if (initialFilters) {
      return { ...defaultFilters, ...initialFilters };
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsedFilters = JSON.parse(stored) as Partial<HistoricalRangeFilters>;
          return { ...defaultFilters, ...parsedFilters };
        } catch (e) {
          console.error('Failed to parse stored filters', e);
        }
      }
    }

    return defaultFilters;
  };

  const [filters, setFilters] = useState<HistoricalRangeFilters>(getInitialFilters);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    }
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleOwnerOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, ownerOperator: e.target.value });
  };

  const handleRecruiterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, recruiterIds: [] });
      return;
    }
    const recruiterId = parseInt(value);
    const currentRecruiterIds = filters.recruiterIds || [];
    const newArray = currentRecruiterIds.includes(recruiterId)
      ? currentRecruiterIds.filter(v => v !== recruiterId)
      : [...currentRecruiterIds, recruiterId];

    setFilters({ ...filters, recruiterIds: newArray });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, states: [] });
      return;
    }
    const currentStates = filters.states || [];
    const newArray = currentStates.includes(value)
      ? currentStates.filter(v => v !== value)
      : [...currentStates, value];

    setFilters({ ...filters, states: newArray });
  };

  const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, sourceTypes: [] });
      return;
    }
    const currentSourceTypes = filters.sourceTypes || [];
    const newArray = currentSourceTypes.includes(value)
      ? currentSourceTypes.filter(v => v !== value)
      : [...currentSourceTypes, value];

    setFilters({ ...filters, sourceTypes: newArray });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, statuses: [] });
      return;
    }
    const currentStatuses = filters.statuses || [];
    const newArray = currentStatuses.includes(value)
      ? currentStatuses.filter(v => v !== value)
      : [...currentStatuses, value];

    setFilters({ ...filters, statuses: newArray });
  };

  const handleTimePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, timePeriod: e.target.value as TimePeriod });
  };

  const handleClearFilters = () => {
    const emptyFilters: HistoricalRangeFilters = {
      ownerOperator: 'all',
      recruiterIds: [],
      states: [],
      sourceTypes: [],
      statuses: [],
      referralSourceIds: [],
      timePeriod: 'month',
    };
    setFilters(emptyFilters);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const hasActiveFilters =
    filters.ownerOperator !== 'all' ||
    (filters.recruiterIds?.length ?? 0) > 0 ||
    (filters.states?.length ?? 0) > 0 ||
    (filters.sourceTypes?.length ?? 0) > 0 ||
    (filters.statuses?.length ?? 0) > 0 ||
    (filters.referralSourceIds?.length ?? 0) > 0;

  return (
    <div className="mb-3">
      <Row className="g-3 align-items-end">

        {/* TIME PERIOD */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('TIME_PERIOD')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.timePeriod}
            onChange={handleTimePeriodChange}
          >
            <option value="day">{t('DAY')}</option>
            <option value="week">{t('WEEK')}</option>
            <option value="month">{t('MONTH')}</option>
            <option value="quarter">{t('QUARTER')}</option>
            <option value="year">{t('YEAR')}</option>
          </select>
        </Col>

        {/* OWNER / OPERATOR */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('OWNER_OPERATOR')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.ownerOperator}
            onChange={handleOwnerOperatorChange}
          >
            <option value="all">{t('ALL')}</option>
            <option value="owner">{t('OWNER_OPERATOR')}</option>
            <option value="non-owner">Non-{t('OWNER_OPERATOR')}</option>
          </select>
        </Col>

        {/* RECRUITERS */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('RECRUITER')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.recruiterIds?.[filters.recruiterIds?.length - 1] ?? ''}
            onChange={handleRecruiterChange}
          >
            <option value="">{t('ALL')}</option>
            {recruiters.map((recruiter) => (
              <option key={recruiter.id} value={recruiter.id}>
                {recruiter.name}
              </option>
            ))}
          </select>

          {filters.recruiterIds.length > 0 && (
            <div className="mt-1">
              {filters.recruiterIds?.map?.((recruiterId: number, idx: number) => {
                const recruiter = recruiters?.find?.(r => r.id === recruiterId);
                if (!recruiter) return null;

                return (
                  <span key={idx} className="badge bg-primary me-1">
                    {recruiter.name}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.6rem' }}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          recruiterIds: filters.recruiterIds?.filter(id => id !== recruiterId) ?? []
                        })
                      }
                    />
                  </span>
                );
              })}
            </div>
          )}
        </Col>

        {/* STATES */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('STATE')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.states?.[filters.states?.length - 1] ?? ''}
            onChange={handleStateChange}
          >
            <option value="">{t('ALL')}</option>
            {stateList.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>

          {filters.states.length > 0 && (
            <div className="mt-1">
              {filters.states.map((state, idx) => {
                const stateLabel = stateList.find(s => s.value === state)?.label || state;
                return (
                  <span key={idx} className="badge bg-primary me-1">
                    {stateLabel}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.6rem' }}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          states: filters.states.filter(s => s !== state)
                        })
                      }
                    />
                  </span>
                );
              })}
            </div>
          )}
        </Col>

        {/* SOURCE TYPE / LEAD TYPE */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('SOURCE')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.sourceTypes?.[filters.sourceTypes?.length - 1] ?? ''}
            onChange={handleSourceTypeChange}
          >
            <option value="">{t('ALL')}</option>
            {sourceTypes.map((source) => (
              <option key={source} value={source}>
                {t(`ApplicantType.${source}`)}
              </option>
            ))}
          </select>

          {filters.sourceTypes.length > 0 && (
            <div className="mt-1">
              {filters.sourceTypes.map((source, idx) => (
                <span key={idx} className="badge bg-primary me-1">
                  {t(`ApplicantType.${source}`)}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        sourceTypes: filters.sourceTypes.filter(s => s !== source)
                      })
                    }
                  />
                </span>
              ))}
            </div>
          )}
        </Col>

        {/* STATUS */}
        <Col md={2}>
          <label className="form-label small text-muted mb-1">{t('STATUS')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.statuses?.[filters.statuses?.length - 1] ?? ''}
            onChange={handleStatusChange}
          >
            <option value="">{t('ALL')}</option>
            {Object.values(ApplicantStatus).map((status) => (
              <option key={status} value={status}>
                {t(`ApplicantStatus.${status}`)}
              </option>
            ))}
          </select>

          {filters.statuses.length > 0 && (
            <div className="mt-1">
              {filters.statuses.map((status, idx) => (
                <span key={idx} className="badge bg-primary me-1">
                  {t(`ApplicantStatus.${status}`)}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        statuses: filters.statuses.filter(s => s !== status)
                      })
                    }
                  />
                </span>
              ))}
            </div>
          )}
        </Col>

      </Row>

      {hasActiveFilters && (
        <Row className="mt-2">
          <Col>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClearFilters}
            >
              {t('CLEAR')} {t('FILTERS')}
            </button>
          </Col>
        </Row>
      )}
    </div>
  );
}

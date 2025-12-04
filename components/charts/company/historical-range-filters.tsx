import { useState, useEffect, useContext, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import stateList from '../../../utils/stateList';
import { useTranslation } from '../../../hooks/use-translation';
import DashboardChartContext from '../../../context/dashboard-chart-context';

export interface HistoricalRangeFilters {
  ownerOperator: string;
  recruiterIds: number[];
  states: string[];
  sourceTypes: string[];
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
      if (applicant.referralSource?.name) {
        sourceMap.set(applicant.referralSource.name, applicant.referralSource.name);
      }
    });
    return Array.from(sourceMap.values()).sort();
  }, [state?.applicants]);

  const getInitialFilters = (): HistoricalRangeFilters => {
    if (initialFilters) return initialFilters;

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as HistoricalRangeFilters;
        } catch (e) {
          console.error('Failed to parse stored filters', e);
        }
      }
    }

    return {
      ownerOperator: 'all',
      recruiterIds: [],
      states: [],
      sourceTypes: [],
    };
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
    const newArray = filters.recruiterIds.includes(recruiterId)
      ? filters.recruiterIds.filter(v => v !== recruiterId)
      : [...filters.recruiterIds, recruiterId];

    setFilters({ ...filters, recruiterIds: newArray });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, states: [] });
      return;
    }
    const newArray = filters.states.includes(value)
      ? filters.states.filter(v => v !== value)
      : [...filters.states, value];

    setFilters({ ...filters, states: newArray });
  };

  const handleSourceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) {
      setFilters({ ...filters, sourceTypes: [] });
      return;
    }
    const newArray = filters.sourceTypes.includes(value)
      ? filters.sourceTypes.filter(v => v !== value)
      : [...filters.sourceTypes, value];

    setFilters({ ...filters, sourceTypes: newArray });
  };

  const handleClearFilters = () => {
    const emptyFilters: HistoricalRangeFilters = {
      ownerOperator: 'all',
      recruiterIds: [],
      states: [],
      sourceTypes: [],
    };
    setFilters(emptyFilters);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const hasActiveFilters =
    filters.ownerOperator !== 'all' ||
    filters.recruiterIds.length > 0 ||
    filters.states.length > 0 ||
    filters.sourceTypes.length > 0;

  return (
    <div className="mb-3">
      <Row className="g-3 align-items-end">

        {/* OWNER / OPERATOR */}
        <Col md={3}>
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
        <Col md={3}>
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
        <Col md={3}>
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

        {/* SOURCE TYPE */}
        <Col md={3}>
          <label className="form-label small text-muted mb-1">{t('SOURCE')}</label>
          <select
            className="form-select form-select-sm"
            value={filters.sourceTypes?.[filters.sourceTypes?.length - 1] ?? ''}
            onChange={handleSourceTypeChange}
          >
            <option value="">{t('ALL')}</option>
            {sourceTypes.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

          {filters.sourceTypes.length > 0 && (
            <div className="mt-1">
              {filters.sourceTypes.map((source, idx) => (
                <span key={idx} className="badge bg-primary me-1">
                  {source}
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

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Table,
  Badge,
  Alert,
  FormGroup,
  Label,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import { Search, PersonPlus, People, GeoAlt } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import { useApplicantSearch, ApplicantLite } from '../../hooks/campaigns/useApplicantSearch';

interface ManualTargetSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTargets: (applicantIds: number[]) => Promise<void>;
  loading?: boolean;
}

export const ManualTargetSelectionModal: React.FC<ManualTargetSelectionModalProps> = ({
  isOpen,
  onClose,
  onAddTargets,
  loading = false,
}) => {
  const { t } = useTranslation();
  const { searchApplicants, loading: searchLoading, error: searchError } = useApplicantSearch();

  const [searchTerm, setSearchTerm] = useState('');
  const [applicants, setApplicants] = useState<ApplicantLite[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<number>>(new Set());
  const [selectedApplicantsMap, setSelectedApplicantsMap] = useState<Map<number, ApplicantLite>>(
    new Map()
  );
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pageSize = 20;
  const MAX_MANUAL_TARGETS = 3;

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() || hasSearched) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleSearch = async () => {
    try {
      setHasSearched(true);
      const response = await searchApplicants({
        search: searchTerm.trim() || undefined,
        limit: pageSize,
        offset: currentPage * pageSize,
      });

      setApplicants(response.applicants);
      setTotal(response.total);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handlePageChange = async (newPage: number) => {
    setCurrentPage(newPage);
    try {
      const response = await searchApplicants({
        search: searchTerm.trim() || undefined,
        limit: pageSize,
        offset: newPage * pageSize,
      });

      setApplicants(response.applicants);
    } catch (err) {
      console.error('Page change failed:', err);
    }
  };

  const toggleApplicantSelection = (applicantId: number) => {
    const applicant = applicants.find((a) => a.id === applicantId);

    setSelectedApplicants((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(applicantId)) {
        newSet.delete(applicantId);
      } else {
        // Check if we're at the limit
        if (newSet.size >= MAX_MANUAL_TARGETS) {
          setSubmitError(
            `You can only select up to ${MAX_MANUAL_TARGETS} targets at a time for targeted outreach.`
          );
          return newSet;
        }
        newSet.add(applicantId);
        // Clear any previous error when successfully adding
        setSubmitError(null);
      }
      return newSet;
    });

    // Keep track of selected applicant data for display
    if (applicant) {
      setSelectedApplicantsMap((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(applicantId)) {
          newMap.delete(applicantId);
        } else {
          // Only add if we're not at the limit
          if (selectedApplicants.size < MAX_MANUAL_TARGETS) {
            newMap.set(applicantId, applicant);
          }
        }
        return newMap;
      });
    }
  };

  const handleSelectAll = () => {
    const currentPageApplicantIds = applicants.map((a) => a.id);
    const allCurrentPageSelected = currentPageApplicantIds.every((id) =>
      selectedApplicants.has(id)
    );

    if (allCurrentPageSelected) {
      // Deselect all on current page
      setSelectedApplicants((prev) => {
        const newSet = new Set(prev);
        applicants.forEach((a) => newSet.delete(a.id));
        return newSet;
      });
      setSelectedApplicantsMap((prev) => {
        const newMap = new Map(prev);
        applicants.forEach((a) => newMap.delete(a.id));
        return newMap;
      });
      setSubmitError(null); // Clear any errors when deselecting
    } else {
      // Select all on current page (up to the limit)
      const remainingSlots = MAX_MANUAL_TARGETS - selectedApplicants.size;
      const applicantsToSelect = applicants.slice(0, remainingSlots);

      if (remainingSlots <= 0) {
        setSubmitError(
          `You can only select up to ${MAX_MANUAL_TARGETS} targets at a time for targeted outreach.`
        );
        return;
      }

      if (applicantsToSelect.length < applicants.length) {
        setSubmitError(
          `Only selected first ${applicantsToSelect.length} applicant(s) due to ${MAX_MANUAL_TARGETS} target limit.`
        );
      } else {
        setSubmitError(null);
      }

      setSelectedApplicants((prev) => {
        const newSet = new Set(prev);
        applicantsToSelect.forEach((a) => newSet.add(a.id));
        return newSet;
      });
      setSelectedApplicantsMap((prev) => {
        const newMap = new Map(prev);
        applicantsToSelect.forEach((a) => newMap.set(a.id, a));
        return newMap;
      });
    }
  };

  const handleSubmit = async () => {
    if (selectedApplicants.size === 0) {
      setSubmitError('Please select at least one applicant to add as a target.');
      return;
    }

    try {
      setSubmitError(null);
      await onAddTargets(Array.from(selectedApplicants));
      // Reset modal state
      setSelectedApplicants(new Set());
      setSelectedApplicantsMap(new Map());
      setSearchTerm('');
      setApplicants([]);
      setHasSearched(false);
      setCurrentPage(0);
      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to add manual targets. Please try again.');
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="lg" backdrop="static">
      <ModalHeader toggle={onClose}>
        <PersonPlus size={20} className="me-2" />
        {t('ADD_TARGETS')}
      </ModalHeader>
      <ModalBody>
        <div className="mb-4">
          <p className="text-muted mb-3">{t('ADD_MANUAL_TARGETS_DESCRIPTION')}</p>

          {/* Target Limit Notice */}
          <Alert color="info" className="mb-3">
            <div className="d-flex align-items-start">
              <People size={16} className="me-2 mt-1 flex-shrink-0" />
              <div>
                <strong>{t('TARGETED_OUTREACH_LIMIT')}</strong>
                <br />
                <small>
                  {t('TARGETED_OUTREACH_LIMIT_DESCRIPTION', { max: MAX_MANUAL_TARGETS })}
                </small>
              </div>
            </div>
          </Alert>

          {/* Search Input */}
          <FormGroup>
            <Label for="search-applicants">{t('SEARCH_APPLICANTS')}</Label>
            <div className="position-relative">
              <Input
                id="search-applicants"
                type="text"
                placeholder={t('SEARCH_BY_NAME_EMAIL_PHONE')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pe-5"
              />
              <Search
                size={16}
                className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
              />
            </div>
          </FormGroup>
        </div>

        {/* Search Error */}
        {searchError && (
          <Alert color="danger" className="mb-3">
            {searchError}
          </Alert>
        )}

        {/* Submit Error */}
        {submitError && (
          <Alert color="warning" className="mb-3">
            {submitError}
          </Alert>
        )}

        {/* Loading State */}
        {searchLoading && (
          <div className="text-center py-4">
            <Spinner color="primary" className="me-2" />
            {t('SEARCHING_APPLICANTS')}...
          </div>
        )}

        {/* Results */}
        {!searchLoading && hasSearched && (
          <>
            {applicants.length > 0 ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">
                    {t('SEARCH_RESULTS_COUNT', {
                      count: total,
                      start: currentPage * pageSize + 1,
                      end: Math.min((currentPage + 1) * pageSize, total),
                    })}
                  </span>
                  <Button
                    color="outline-primary"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={
                      selectedApplicants.size >= MAX_MANUAL_TARGETS &&
                      !applicants.every((a) => selectedApplicants.has(a.id))
                    }
                  >
                    {applicants.every((a) => selectedApplicants.has(a.id))
                      ? t('DESELECT_ALL')
                      : t('SELECT_ALL_PAGE')}
                  </Button>
                </div>

                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <Table hover size="sm">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th style={{ width: '40px' }}>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              checked={
                                applicants.length > 0 &&
                                applicants.every((a) => selectedApplicants.has(a.id))
                              }
                              onChange={handleSelectAll}
                              className="form-check-input"
                            />
                          </div>
                        </th>
                        <th>{t('NAME')}</th>
                        <th>{t('EMAIL')}</th>
                        <th>{t('PHONE')}</th>
                        <th>{t('LOCATION')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant) => {
                        const isSelected = selectedApplicants.has(applicant.id);
                        const isDisabled =
                          !isSelected && selectedApplicants.size >= MAX_MANUAL_TARGETS;

                        return (
                          <tr
                            key={applicant.id}
                            style={{
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              opacity: isDisabled ? 0.5 : 1,
                            }}
                            onClick={() => !isDisabled && toggleApplicantSelection(applicant.id)}
                            className={isSelected ? 'table-primary' : ''}
                          >
                            <td>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    !isDisabled && toggleApplicantSelection(applicant.id)
                                  }
                                  className="form-check-input"
                                  onClick={(e) => e.stopPropagation()}
                                  disabled={isDisabled}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">{applicant.fullName || 'N/A'}</div>
                            </td>
                            <td>
                              <small className="text-muted">{applicant.email || 'N/A'}</small>
                            </td>
                            <td>
                              <small className="text-muted">{applicant.phone || 'N/A'}</small>
                            </td>
                            <td>
                              <small className="text-muted">
                                {applicant.city && applicant.state ? (
                                  <>
                                    <GeoAlt size={12} className="me-1" />
                                    {applicant.city}, {applicant.state}
                                  </>
                                ) : (
                                  'N/A'
                                )}
                              </small>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>

                {/* Selected Applicants Summary */}
                {selectedApplicants.size > 0 && (
                  <div className="mt-3 mb-3">
                    <Alert color="info" className="mb-0">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <People size={16} className="me-2" />
                          <strong>
                            {t('SELECTED_COUNT', { count: selectedApplicants.size })} /{' '}
                            {MAX_MANUAL_TARGETS}
                          </strong>
                        </div>
                        {selectedApplicants.size >= MAX_MANUAL_TARGETS && (
                          <Badge color="warning" pill>
                            {t('LIMIT_REACHED')}
                          </Badge>
                        )}
                      </div>
                      {selectedApplicants.size > 0 && (
                        <div className="mt-2">
                          <small className="text-muted d-block mb-2">
                            {selectedApplicants.size <= 10
                              ? t('SELECTED_APPLICANTS')
                              : t('SELECTED_APPLICANTS_SHOWING_MAX', {
                                  max: 10,
                                  total: selectedApplicants.size,
                                })}
                            :
                          </small>
                          <div className="d-flex flex-wrap gap-1">
                            {Array.from(selectedApplicantsMap.entries())
                              .slice(0, 10)
                              .map(([applicantId, applicant]) => (
                                <Badge
                                  key={applicantId}
                                  color="primary"
                                  pill
                                  className="text-truncate"
                                  style={{ maxWidth: '150px' }}
                                  title={applicant.fullName || `ID: ${applicantId}`}
                                >
                                  {applicant.fullName || `ID: ${applicantId}`}
                                </Badge>
                              ))}
                            {selectedApplicants.size > 10 && (
                              <Badge color="secondary" pill>
                                +{selectedApplicants.size - 10} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </Alert>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination pagination-sm">
                        <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                          >
                            {t('PREVIOUS')}
                          </button>
                        </li>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = Math.max(
                            0,
                            Math.min(currentPage - 2 + i, totalPages - 1)
                          );
                          return (
                            <li
                              key={pageNum}
                              className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum + 1}
                              </button>
                            </li>
                          );
                        })}
                        <li
                          className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                          >
                            {t('NEXT')}
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-5">
                <People size={48} className="text-muted mb-3" />
                <h6 className="text-muted mb-2">{t('NO_APPLICANTS_FOUND')}</h6>
                <p className="text-muted small mb-0">
                  {searchTerm ? t('NO_SEARCH_RESULTS_MESSAGE') : t('NO_APPLICANTS_MESSAGE')}
                </p>
              </div>
            )}
          </>
        )}

        {/* Initial State */}
        {!searchLoading && !hasSearched && (
          <div className="text-center py-5">
            <Search size={48} className="text-muted mb-3" />
            <h6 className="text-muted mb-2">{t('START_SEARCHING')}</h6>
            <p className="text-muted small mb-0">{t('START_SEARCHING_MESSAGE')}</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose} disabled={loading}>
          {t('CANCEL')}
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={selectedApplicants.size === 0 || loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" />
              {t('ADDING_TARGETS')}...
            </>
          ) : (
            <>
              <PersonPlus size={16} className="me-2" />
              {t('ADD_SELECTED_TARGETS', { count: selectedApplicants.size })}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

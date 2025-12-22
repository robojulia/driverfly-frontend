import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/use-translation';
import CompanyApi from '../../pages/api/company';
import { Search } from 'react-bootstrap-icons';

interface FMCSACompany {
  legal_name?: string;
  dba_name?: string;
  phy_street?: string;
  phy_city?: string;
  phy_state?: string;
  phy_zip?: string;
  phone?: string;
  email_address?: string;
  dot_number?: string;
}

interface CompanyLookupModalProps {
  show: boolean;
  onHide: () => void;
  onSelectCompany: (company: FMCSACompany) => void;
  searchTerm: string;
}

export default function CompanyLookupModal({
  show,
  onHide,
  onSelectCompany,
  searchTerm,
}: CompanyLookupModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<FMCSACompany[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a company name to search');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const companyApi = new CompanyApi();
      const result = await companyApi.fmcsaCompanySearch(searchTerm);

      const records = (result as any)?.records ?? result;
      if (Array.isArray(records)) {
        setCompanies(records);
        if (records.length === 0) {
          setError('No companies found matching your search');
        }
      } else {
        setCompanies([]);
        setError('No companies found matching your search');
      }
    } catch (err: any) {
      console.error('FMCSA search error:', err);
      setError(err?.response?.data?.message || 'Failed to search companies. Please try again.');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCompany = (company: FMCSACompany) => {
    onSelectCompany(company);
    onHide();
    setCompanies([]);
    setHasSearched(false);
    setError(null);
  };

  const handleClose = () => {
    onHide();
    setCompanies([]);
    setHasSearched(false);
    setError(null);
  };

  // Auto-search when modal opens
  useEffect(() => {
    if (show && searchTerm.trim()) {
      handleSearch();
    } else if (!show) {
      // Reset state when modal closes
      setCompanies([]);
      setHasSearched(false);
      setError(null);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <Search style={{ marginRight: '0.5rem' }} />
          FMCSA Company Lookup
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner animation="border" role="status" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#667788' }}>Searching for: <strong>{searchTerm}</strong></p>
          </div>
        )}

        {error && !loading && (
          <Alert variant="warning" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {hasSearched && !loading && companies.length > 0 && (
          <div>
            <h6 style={{ marginBottom: '1rem', color: '#1a2b3c', fontWeight: '600' }}>
              Select a Company ({companies.length} results)
            </h6>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {companies.map((company, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #e0e5eb',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#ffffff',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#0d6efd';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#e0e5eb';
                  }}
                  onClick={() => handleSelectCompany(company)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#1a2b3c', fontSize: '1.05rem' }}>
                      {company.legal_name || company.dba_name || 'N/A'}
                    </strong>
                    {company.dot_number && (
                      <span
                        style={{
                          backgroundColor: '#e7f3ff',
                          color: '#0d6efd',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                        }}
                      >
                        DOT: {company.dot_number}
                      </span>
                    )}
                  </div>
                  <div style={{ color: '#667788', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    {company.phy_street && (
                      <div>
                        {company.phy_street}
                        {company.phy_city && `, ${company.phy_city}`}
                        {company.phy_state && `, ${company.phy_state}`}
                        {company.phy_zip && ` ${company.phy_zip}`}
                      </div>
                    )}
                    {company.phone && <div>Phone: {company.phone}</div>}
                    {company.email_address && <div>Email: {company.email_address}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

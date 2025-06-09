import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../../hooks/use-translation';

// Helper function to format location object into readable string
const formatLocation = (location: any): string => {
  if (!location) return '';

  if (typeof location === 'string') return location;

  // If location is an object, format it properly
  const parts = [];
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);

  return parts.join(', ');
};

interface JobSelectProps {
  jobs: any[];
  selectedJobId: string | number | null;
  onJobSelect: (jobId: string | number | null) => void;
  placeholder?: string;
}

export const JobSelect: React.FC<JobSelectProps> = ({
  jobs,
  selectedJobId,
  onJobSelect,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm) return jobs;
    return jobs.filter((job) => {
      const locationStr = formatLocation(job.location);
      return (
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locationStr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [jobs, searchTerm]);

  const selectedJob = jobs.find((job) => job.id == selectedJobId);

  const handleJobSelect = (job: any) => {
    onJobSelect(job.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const styles = {
    dropdownContainer: {
      position: 'relative' as const,
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '1px solid #e0e5eb',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: '#ffffff',
      color: '#1a2b3c',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    dropdownMenu: {
      position: 'absolute' as const,
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#ffffff',
      border: '1px solid #e0e5eb',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      maxHeight: '300px',
      overflowY: 'auto' as const,
      marginTop: '4px',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: 'none',
      borderBottom: '1px solid #e0e5eb',
      fontSize: '0.9rem',
      color: '#1a2b3c',
      outline: 'none',
    },
    jobItem: {
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #f5f7fa',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    jobTitle: {
      fontWeight: '600' as const,
      marginBottom: '4px',
      color: '#1a2b3c',
    },
    jobMeta: {
      fontSize: '0.875rem',
      color: '#667788',
    },
    placeholder: {
      color: '#a0aec0',
    },
    selectedJobTitle: {
      fontWeight: 'bold' as const,
      color: '#1a2b3c',
    },
    selectedJobLocation: {
      color: '#667788',
      marginLeft: '8px',
    },
    dropdownArrow: {
      float: 'right' as const,
      color: '#667788',
    },
    noResults: {
      padding: '1rem',
      textAlign: 'center' as const,
      color: '#667788',
    },
  };

  return (
    <div style={styles.dropdownContainer} ref={dropdownRef}>
      <div style={styles.input} onClick={() => setIsOpen(!isOpen)}>
        {selectedJob ? (
          <div>
            <span style={styles.selectedJobTitle}>{selectedJob.title}</span>
            {selectedJob.location && (
              <span style={styles.selectedJobLocation}>
                • {formatLocation(selectedJob.location)}
              </span>
            )}
          </div>
        ) : (
          <span style={styles.placeholder}>{placeholder || 'Select a position'}</span>
        )}
        <span style={styles.dropdownArrow}>▼</span>
      </div>

      {isOpen && (
        <div style={styles.dropdownMenu}>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            autoFocus
          />

          {filteredJobs.length === 0 ? (
            <div style={styles.noResults}>No jobs found</div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                style={styles.jobItem}
                onClick={() => handleJobSelect(job)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f7fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={styles.jobTitle}>{job.title}</div>
                <div style={styles.jobMeta}>
                  {job.location && <span>{formatLocation(job.location)}</span>}
                  {job.department && <span> • {job.department}</span>}
                  {job.employment_type && <span> • {job.employment_type}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

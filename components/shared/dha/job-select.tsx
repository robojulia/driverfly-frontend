import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const { t } = useTranslation();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLDivElement>(null);

  // Update dropdown position when opening
  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Close dropdown when clicking outside and handle scroll/resize
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
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
      position: 'relative' as const,
      width: '100%',
      padding: '0.75rem 3rem 0.75rem 1rem',
      border: '1px solid var(--medium-gray)',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'var(--light)',
      color: 'var(--text-primary)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    dropdownMenu: {
      position: 'fixed' as const,
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      width: dropdownPosition.width,
      backgroundColor: 'var(--light)',
      border: '1px solid var(--medium-gray)',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999,
      maxHeight: '300px',
      overflowY: 'auto' as const,
      marginTop: '4px',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: 'none',
      borderBottom: '1px solid var(--medium-gray)',
      fontSize: '0.9rem',
      color: 'var(--text-primary)',
      outline: 'none',
    },
    jobItem: {
      padding: '0.75rem 1rem',
      borderBottom: '1px solid var(--form-info-bg)',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    },
    jobTitle: {
      fontWeight: '600' as const,
      marginBottom: '4px',
      color: 'var(--text-primary)',
    },
    jobMeta: {
      fontSize: '0.875rem',
      color: 'var(--text-secondary)',
    },
    placeholder: {
      color: 'var(--text-muted)',
    },
    selectedJobTitle: {
      fontWeight: 'bold' as const,
      color: 'var(--text-primary)',
    },
    selectedJobLocation: {
      color: 'var(--text-secondary)',
      marginLeft: '8px',
    },
    dropdownArrow: {
      position: 'absolute' as const,
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '0',
      height: '0',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid var(--text-secondary)',
      transition: 'transform 0.2s ease',
      pointerEvents: 'none' as const,
    },
    noResults: {
      padding: '1rem',
      textAlign: 'center' as const,
      color: 'var(--text-secondary)',
    },
  };

  const handleToggleDropdown = () => {
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const dropdownContent = isOpen && (
    <div style={styles.dropdownMenu} ref={dropdownRef}>
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
  );

  return (
    <>
      <div style={styles.dropdownContainer}>
        <div style={styles.input} onClick={handleToggleDropdown} ref={inputRef}>
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
          <div
            style={{
              ...styles.dropdownArrow,
              transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
            }}
          />
        </div>
      </div>

      {typeof document !== 'undefined' &&
        dropdownContent &&
        createPortal(dropdownContent, document.body)}
    </>
  );
};

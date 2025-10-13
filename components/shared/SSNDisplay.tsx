import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import ApplicantApi from "../../pages/api/applicant";

interface SSNDisplayProps {
  applicantId: number;
  last4?: string | null;
  className?: string;
}

const SSNDisplay: React.FC<SSNDisplayProps> = ({ applicantId, last4, className }) => {
  const [showFullSSN, setShowFullSSN] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [fullSSN, setFullSSN] = useState<string | null>(null);

  // Function to format SSN as XXX-XX-XXXX
  const formatSSN = (ssn: string): string => {
    if (!ssn) return "";
    // Remove any non-numeric characters
    const cleanSSN = ssn.replace(/\D/g, "");

    // Only format if we have enough digits
    if (cleanSSN.length >= 9) {
      return `${cleanSSN.substring(0, 3)}-${cleanSSN.substring(
        3,
        5
      )}-${cleanSSN.substring(5, 9)}`;
    }

    return cleanSSN; // Return as is if not enough digits
  };

  // Function to mask SSN, showing only last 4 digits
  const getMaskedSSN = () => {
    if (!last4) return "XXX-XX-XXXX";
    const digits = String(last4).replace(/\D/g, "").slice(-4);
    if (!digits) return "XXX-XX-XXXX";
    return `XXX-XX-${digits}`;
  };

  // Effect to handle timer countdown and auto-hide SSN
  useEffect(() => {
    if (showFullSSN) {
      setTimeRemaining(20);

      // Start countdown timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // When timer reaches zero, hide SSN and clear interval
            setShowFullSSN(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Clear timer when SSN is manually hidden
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup function to clear interval when component unmounts
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [showFullSSN]);

  // Toggle SSN visibility (fetch securely on first reveal)
  const toggleSSNVisibility = async () => {
    if (!showFullSSN && !fullSSN && applicantId) {
      try {
        // Use authenticated API client so Authorization header is included
        const api = new ApplicantApi();
        const data = await api.getSecureSsn(applicantId);
        setFullSSN(data?.ssn || null);
      } catch (e) {
        // Detailed debug logging to investigate failures (kept out of UI)
        try {
          const url = `/api/applicants/fetch-applicant-ssn/${applicantId}`;
          const storedUserJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          let hasToken = false;
          let tokenExp: number | null = null;
          try {
            if (storedUserJson) {
              const storedUser = JSON.parse(storedUserJson);
              hasToken = Boolean(storedUser?.token);
              tokenExp = storedUser?.jwt?.exp || null;
            }
          } catch {}

          // Axios-style error shape
          const ax: any = e as any;
          const status = ax?.response?.status;
          const statusText = ax?.response?.statusText;
          const data = ax?.response?.data;
          const baseURL = ax?.config?.baseURL;
          const requestUrl = ax?.config?.url;
          const hasAuthHeader = Boolean(ax?.config?.headers?.Authorization);

          // Only log in non-production to avoid noisy logs
          if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.groupCollapsed('SSN fetch failed');
            // eslint-disable-next-line no-console
            console.log('Frontend request URL (debug):', url);
            // eslint-disable-next-line no-console
            console.log('Axios baseURL:', baseURL);
            // eslint-disable-next-line no-console
            console.log('Axios request URL:', requestUrl);
            // eslint-disable-next-line no-console
            console.log('Has Authorization header:', hasAuthHeader);
            // eslint-disable-next-line no-console
            console.log('Has stored token:', hasToken);
            // eslint-disable-next-line no-console
            console.log('JWT exp (unix seconds):', tokenExp);
            // eslint-disable-next-line no-console
            console.log('Response status:', status, statusText);
            // eslint-disable-next-line no-console
            console.log('Response data:', data);
            // eslint-disable-next-line no-console
            console.groupEnd();
          }
        } catch {}

        // Silently fail in UI to avoid leaking info
        setFullSSN(null);
      }
    }
    setShowFullSSN((prev) => !prev);
  };

  if (!last4) {
    return <div className={className}>SSN not provided</div>;
  }

  return (
    <div className={`ssn-display-container ${className}`}>
      <div className="d-flex align-items-center">
        <div className="ssn-value mr-2" style={{ fontFamily: "monospace" }}>
          {showFullSSN ? formatSSN(fullSSN || '') : getMaskedSSN()}
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={toggleSSNVisibility}
          className="mx-2"
          aria-label={showFullSSN ? "Hide SSN" : "Show full SSN"}
        >
          {showFullSSN ? <EyeSlashFill /> : <EyeFill />}
          {showFullSSN ? " Hide SSN" : " Show full SSN"}
        </Button>
      </div>

      {/* Helper text and timer */}
      <div className="small text-muted mt-1">
        {!showFullSSN && (
          <div>
            <em>
              Ensure you are using a private computer before viewing the full
              SSN.
            </em>
          </div>
        )}
        {showFullSSN && (
          <div className="text-danger">
            <strong>SSN will be hidden in {timeRemaining} seconds</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default SSNDisplay;

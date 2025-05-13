import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";

interface SSNDisplayProps {
  ssn: string;
  className?: string;
}

const SSNDisplay: React.FC<SSNDisplayProps> = ({ ssn, className }) => {
  const [showFullSSN, setShowFullSSN] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!ssn) return "";
    const cleanSSN = ssn.replace(/\D/g, "");
    if (cleanSSN.length >= 9) {
      const lastFour = cleanSSN.slice(-4);
      return `XXX-XX-${lastFour}`;
    }
    return "XXX-XX-XXXX"; // Return placeholder if SSN not valid
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

  // Toggle SSN visibility
  const toggleSSNVisibility = () => {
    setShowFullSSN((prev) => !prev);
  };

  if (!ssn) {
    return <div className={className}>SSN not provided</div>;
  }

  return (
    <div className={`ssn-display-container ${className}`}>
      <div className="d-flex align-items-center">
        <div className="ssn-value mr-2" style={{ fontFamily: "monospace" }}>
          {showFullSSN ? formatSSN(ssn) : getMaskedSSN()}
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

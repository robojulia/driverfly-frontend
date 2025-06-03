import React, { useRef, useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';
import { useTranslation } from '../../../hooks/use-translation';
import styles from '../../../styles/digitalhiringapp.module.css';

interface SignatureComponentProps {
  firstName?: string;
  lastName?: string;
  onSignatureChange: (signature: string | null) => void;
  initialSignature?: string;
  required?: boolean;
}

export function SignatureComponent({
  firstName,
  lastName,
  onSignatureChange,
  initialSignature,
  required = false,
}: SignatureComponentProps) {
  const { t } = useTranslation();
  const padRef = useRef<SignatureCanvas>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [typedSignatureConsent, setTypedSignatureConsent] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [initialSignatureApplied, setInitialSignatureApplied] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 200 });
  const lastSignatureRef = useRef<string | null>(null);

  // Calculate canvas size based on container
  const updateCanvasSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setCanvasSize({
        width: Math.max(300, containerWidth - 2), // Subtract 2px for border
        height: 200,
      });
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
    };

    // Initial size calculation
    updateCanvasSize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update canvas size when component mounts or container changes
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Resize canvas when dimensions change
  useEffect(() => {
    if (padRef.current && canvasSize.width > 0) {
      const canvas = padRef.current.getCanvas();
      const currentSignature = hasSignature ? canvas.toDataURL() : null;

      // Clear and resize
      padRef.current.clear();

      // Restore signature if it existed
      if (currentSignature && hasSignature) {
        padRef.current.fromDataURL(currentSignature);
      }
    }
  }, [canvasSize]);

  const clearSignatureCanvas = (): void => {
    padRef?.current?.clear();
    setHasSignature(false);
    lastSignatureRef.current = null;
    onSignatureChange(null);
  };

  const handleSignatureEnd = () => {
    if (!padRef.current) return;

    const signatureValue = padRef.current.toDataURL().toString();

    // Only update if the signature has actually changed
    if (signatureValue !== lastSignatureRef.current) {
      lastSignatureRef.current = signatureValue;
      setHasSignature(true);
      onSignatureChange(signatureValue);
    }
  };

  const generateTypedSignature = () => {
    if (!typedSignatureConsent) {
      alert(t('PLEASE_CONSENT_TO_TYPED_SIGNATURE'));
      return;
    }

    if (!firstName || !lastName) {
      alert(t('NAME_REQUIRED_FOR_TYPED_SIGNATURE'));
      return;
    }

    const canvas = padRef?.current;
    if (!canvas) return;

    canvas.clear();
    const ctx = canvas.getCanvas().getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.getCanvas().width;
    const canvasHeight = canvas.getCanvas().height;

    // Set up the canvas for signature
    ctx.font = "30px 'Dancing Script', cursive";
    ctx.fillStyle = 'black';

    // Calculate position to center the signature
    const signatureText = `${firstName} ${lastName}`;
    const textMetrics = ctx.measureText(signatureText);
    const signatureX = (canvasWidth - textMetrics.width) / 2;
    const signatureY = (canvasHeight + 30) / 2;

    // Add signature text
    ctx.fillText(signatureText, signatureX, signatureY);

    // Add timestamp for legal compliance - positioned under the signature
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666'; // Slightly lighter color for timestamp
    const timestamp = new Date().toLocaleString();
    const timestampText = `Electronically signed on ${timestamp}`;

    // Measure timestamp text and center it under the signature
    const timestampMetrics = ctx.measureText(timestampText);
    const timestampX = (canvasWidth - timestampMetrics.width) / 2;
    const timestampY = signatureY + 25; // Position 25px below the signature

    ctx.fillText(timestampText, timestampX, timestampY);

    // Get the signature value
    const signatureValue = canvas.toDataURL().toString();

    // Only update if the signature has actually changed
    if (signatureValue !== lastSignatureRef.current) {
      lastSignatureRef.current = signatureValue;
      setHasSignature(true);
      onSignatureChange(signatureValue);
    }
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedSignatureConsent(e.target.checked);
    if (!e.target.checked) {
      clearSignatureCanvas();
    }
  };

  // Apply initial signature only once when component mounts or initialSignature changes
  useEffect(() => {
    if (initialSignature && padRef.current && !initialSignatureApplied && canvasSize.width > 0) {
      // Check if this is a different signature than what we already have
      if (initialSignature !== lastSignatureRef.current) {
        padRef.current.fromDataURL(initialSignature);
        lastSignatureRef.current = initialSignature;
        setHasSignature(true);
        setInitialSignatureApplied(true);
      }
    }
  }, [initialSignature, initialSignatureApplied, canvasSize]);

  // Reset initialSignatureApplied when initialSignature becomes null/undefined
  useEffect(() => {
    if (!initialSignature) {
      setInitialSignatureApplied(false);
    }
  }, [initialSignature]);

  return (
    <div className={styles.txtcolor} ref={containerRef}>
      {/* Signature Instructions */}
      <div className="mb-4">
        <p className={styles.bold}>{t('SIGNATURE_INSTRUCTIONS')}</p>
        <ul>
          <li>{t('SIGNATURE_OPTION_1')}</li>
          <li>{t('SIGNATURE_OPTION_2')}</li>
        </ul>
        <p className="text-muted">
          <em>{t('SIGNATURE_ACCESSIBILITY_NOTE')}</em>
        </p>
      </div>

      {/* Signature Canvas Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        {canvasSize.width > 0 && (
          <SignatureCanvas
            ref={padRef}
            onEnd={handleSignatureEnd}
            canvasProps={{
              width: canvasSize.width,
              height: canvasSize.height,
              style: {
                border: '2px solid #AAAAAA',
                borderRadius: '8px',
                display: 'block',
                width: '100%',
                maxWidth: '100%',
              },
              className: 'sigCanvas',
            }}
          />
        )}
      </div>

      {/* Canvas Controls */}
      <div className="mb-4">
        <button type="button" className="theme-secondary-btn me-2" onClick={clearSignatureCanvas}>
          {t('CLEAR')}
        </button>
      </div>

      {/* Typed Signature Option */}
      <div className="border-top pt-3 mb-3">
        <Form.Check
          type="checkbox"
          id="typed-signature-consent"
          label={t('I_CONSENT_TO_USE_TYPED_SIGNATURE')}
          checked={typedSignatureConsent}
          onChange={handleConsentChange}
          className={`${styles.bold} mb-2`}
        />
        {typedSignatureConsent && (
          <div className="mb-3">
            <small className="text-muted d-block mb-2">{t('TYPED_SIGNATURE_LEGAL_NOTICE')}</small>
            <button
              type="button"
              className="theme-secondary-btn"
              onClick={generateTypedSignature}
              disabled={!typedSignatureConsent || !firstName || !lastName}
              aria-label={t('USE_TYPED_SIGNATURE')}
            >
              {t('USE_TYPED_SIGNATURE')}
            </button>
          </div>
        )}
      </div>

      {required && !hasSignature && (
        <p className={`h6 text-danger ${styles.align__text_left}`}>
          <em>{t('ERROR_SIGNS_REQUIRED')}</em>
        </p>
      )}
    </div>
  );
}

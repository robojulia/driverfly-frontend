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
  const lastSignatureRef = useRef<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 600, height: 200 });

  const clearSignatureCanvas = (): void => {
    if (padRef.current && !isDrawing) {
      padRef.current.clear();
      setHasSignature(false);
      lastSignatureRef.current = null;
      onSignatureChange(null);
    }
  };

  const handleSignatureBegin = () => {
    setIsDrawing(true);
  };

  const handleSignatureEnd = () => {
    setIsDrawing(false);

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
    if (!canvas || isDrawing) return;

    canvas.clear();
    const ctx = canvas.getCanvas().getContext('2d');
    if (!ctx) return;

    const canvasElement = canvas.getCanvas();
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;

    // Scale font sizes based on canvas dimensions
    const scaleFactor = canvasWidth / 600; // Scale relative to original 600px width
    const signatureFontSize = Math.max(20, 30 * scaleFactor);
    const timestampFontSize = Math.max(10, 12 * scaleFactor);

    // Set up the canvas for signature
    ctx.font = `${signatureFontSize}px 'Dancing Script', cursive`;
    ctx.fillStyle = 'black';

    // Calculate position to center the signature
    const signatureText = `${firstName} ${lastName}`;
    const textMetrics = ctx.measureText(signatureText);
    const signatureX = (canvasWidth - textMetrics.width) / 2;
    const signatureY = (canvasHeight + signatureFontSize) / 2;

    // Add signature text
    ctx.fillText(signatureText, signatureX, signatureY);

    // Add timestamp for legal compliance - positioned under the signature
    ctx.font = `${timestampFontSize}px Arial`;
    ctx.fillStyle = '#666666'; // Slightly lighter color for timestamp
    const timestamp = new Date().toLocaleString();
    const timestampText = `Electronically signed on ${timestamp}`;

    // Measure timestamp text and center it under the signature
    const timestampMetrics = ctx.measureText(timestampText);
    const timestampX = (canvasWidth - timestampMetrics.width) / 2;
    const timestampY = signatureY + timestampFontSize * 1.5; // Position below the signature

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
    if (initialSignature && padRef.current && !initialSignatureApplied && !isDrawing) {
      // Check if this is a different signature than what we already have
      if (initialSignature !== lastSignatureRef.current) {
        try {
          padRef.current.fromDataURL(initialSignature);
          lastSignatureRef.current = initialSignature;
          setHasSignature(true);
          setInitialSignatureApplied(true);
        } catch (error) {
          console.warn('Failed to load initial signature:', error);
        }
      }
    }
  }, [initialSignature, initialSignatureApplied, isDrawing]);

  // Reset initialSignatureApplied when initialSignature becomes null/undefined
  useEffect(() => {
    if (!initialSignature) {
      setInitialSignatureApplied(false);
    }
  }, [initialSignature]);

  // Update canvas dimensions based on container size for proper scaling
  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = 200 / 600; // height / width from original dimensions
        const newWidth = Math.min(containerWidth - 32, 600); // Account for padding, max 600
        const newHeight = newWidth * aspectRatio;

        setCanvasDimensions({
          width: newWidth,
          height: newHeight,
        });
      }
    };

    updateCanvasDimensions();

    // Update on window resize
    window.addEventListener('resize', updateCanvasDimensions);
    return () => window.removeEventListener('resize', updateCanvasDimensions);
  }, []);

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
        <SignatureCanvas
          ref={padRef}
          onBegin={handleSignatureBegin}
          onEnd={handleSignatureEnd}
          canvasProps={{
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            style: {
              border: '2px solid #AAAAAA',
              borderRadius: '8px',
              display: 'block',
              width: `${canvasDimensions.width}px`,
              height: `${canvasDimensions.height}px`,
              maxWidth: '100%',
            },
            className: 'sigCanvas',
          }}
        />
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

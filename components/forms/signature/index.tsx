import React, { useRef, useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import { useTranslation } from "../../../hooks/use-translation";
import styles from "../../../styles/digitalhiringapp.module.css";

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
  const [typedSignatureConsent, setTypedSignatureConsent] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [initialSignatureApplied, setInitialSignatureApplied] = useState(false);
  const lastSignatureRef = useRef<string | null>(null);

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
      alert(t("PLEASE_CONSENT_TO_TYPED_SIGNATURE"));
      return;
    }

    if (!firstName || !lastName) {
      alert(t("NAME_REQUIRED_FOR_TYPED_SIGNATURE"));
      return;
    }

    const canvas = padRef?.current;
    if (!canvas) return;

    canvas.clear();
    const ctx = canvas.getCanvas().getContext("2d");
    if (!ctx) return;

    // Set up the canvas for signature
    ctx.font = "30px 'Dancing Script', cursive";
    ctx.fillStyle = "black";

    // Calculate position to center the signature
    const signatureText = `${firstName} ${lastName}`;
    const textMetrics = ctx.measureText(signatureText);
    const x = (canvas.getCanvas().width - textMetrics.width) / 2;
    const y = (canvas.getCanvas().height + 30) / 2;

    // Add signature text
    ctx.fillText(signatureText, x, y);

    // Add timestamp for legal compliance
    ctx.font = "12px Arial";
    const timestamp = new Date().toISOString();
    ctx.fillText(
      `Electronically signed on ${timestamp}`,
      10,
      canvas.getCanvas().height - 10
    );

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
    if (initialSignature && padRef.current && !initialSignatureApplied) {
      // Check if this is a different signature than what we already have
      if (initialSignature !== lastSignatureRef.current) {
        padRef.current.fromDataURL(initialSignature);
        lastSignatureRef.current = initialSignature;
        setHasSignature(true);
        setInitialSignatureApplied(true);
      }
    }
  }, [initialSignature, initialSignatureApplied]);

  // Reset initialSignatureApplied when initialSignature becomes null/undefined
  useEffect(() => {
    if (!initialSignature) {
      setInitialSignatureApplied(false);
    }
  }, [initialSignature]);

  return (
    <div className={styles.txtcolor}>
      {/* Signature Instructions */}
      <div className="mb-4">
        <p className={styles.bold}>{t("SIGNATURE_INSTRUCTIONS")}</p>
        <ul>
          <li>{t("SIGNATURE_OPTION_1")}</li>
          <li>{t("SIGNATURE_OPTION_2")}</li>
        </ul>
        <p className="text-muted">
          <em>{t("SIGNATURE_ACCESSIBILITY_NOTE")}</em>
        </p>
      </div>

      {/* Signature Canvas */}
      <SignatureCanvas
        ref={padRef}
        onEnd={handleSignatureEnd}
        canvasProps={{
          style: { border: "1px solid black" },
          className: "sigCanvas",
        }}
      />

      {/* Canvas Controls */}
      <div className="mb-4">
        <button
          type="button"
          className="theme-secondary-btn me-2"
          onClick={clearSignatureCanvas}
        >
          {t("CLEAR")}
        </button>
      </div>

      {/* Typed Signature Option */}
      <div className="border-top pt-3 mb-3">
        <Form.Check
          type="checkbox"
          id="typed-signature-consent"
          label={t("I_CONSENT_TO_USE_TYPED_SIGNATURE")}
          checked={typedSignatureConsent}
          onChange={handleConsentChange}
          className={`${styles.bold} mb-2`}
        />
        {typedSignatureConsent && (
          <div className="mb-3">
            <small className="text-muted d-block mb-2">
              {t("TYPED_SIGNATURE_LEGAL_NOTICE")}
            </small>
            <button
              type="button"
              className="theme-secondary-btn"
              onClick={generateTypedSignature}
              disabled={!typedSignatureConsent || !firstName || !lastName}
              aria-label={t("USE_TYPED_SIGNATURE")}
            >
              {t("USE_TYPED_SIGNATURE")}
            </button>
          </div>
        )}
      </div>

      {required && !hasSignature && (
        <p className={`h6 text-danger ${styles.align__text_left}`}>
          <em>{t("ERROR_SIGNS_REQUIRED")}</em>
        </p>
      )}
    </div>
  );
}

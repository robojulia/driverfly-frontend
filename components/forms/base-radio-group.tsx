import { FormikProps } from 'formik';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

interface Option {
  value: string;
  label: string;
}

interface BaseRadioGroupProps {
  name: string;
  options: Option[];
  formik: FormikProps<any>;
  labelPrefix?: string;
  className?: string;
  required?: boolean;
  label?: string;
  compact?: boolean;
}

export default function BaseRadioGroup({
  name,
  options,
  formik,
  labelPrefix,
  className = '',
  required = false,
  label,
  compact = false,
}: BaseRadioGroupProps) {
  const { t } = useTranslation();

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {t(label)}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className={`radio-group-container ${compact ? 'radio-group-compact' : ''}`}>
        <ButtonGroup className="w-100">
          {options.map((option) => (
            <ToggleButton
              key={option.value}
              id={`${name}-${option.value}`}
              type="radio"
              variant="outline-primary"
              name={name}
              value={option.value}
              checked={formik.values[name] === option.value}
              onChange={(e) => formik.setFieldValue(name, e.currentTarget.value)}
              className={`radio-button ${formik.values[name] === option.value ? 'active' : ''}`}
            >
              {labelPrefix ? t(`${labelPrefix}.${option.label}`) : option.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback d-block">{formik.errors[name]}</div>
      )}
      <style>{`
        .radio-group-container {
          margin-top: 0.5rem;
        }

        .radio-group-container .btn-group {
          gap: 8px;
        }

        .radio-group-container .radio-button {
          flex: 1;
          text-align: center;
          border: 1px solid #dee2e6;
          background-color: white;
          padding: ${compact ? '0.5rem' : '1rem'};
          transition: all 0.2s ease;
        }

        .radio-group-container .radio-button:hover {
          background-color: #f8f9fa;
        }

        .radio-group-container .radio-button.active {
          background-color: #f0f9ff;
          border-color: #0d6efd;
          color: #0d6efd;
        }

        .radio-group-compact .radio-button {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

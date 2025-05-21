import { FormikProps } from 'formik';
import { Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';
import { CheckCircleFill } from 'react-bootstrap-icons';
import classNames from 'classnames';
import styled from 'styled-components';

interface CardOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  description?: string;
}

interface CardRadioGroupProps {
  name: string;
  options: CardOption[];
  formik: FormikProps<any>;
  labelPrefix?: string;
  className?: string;
  required?: boolean;
  label?: string;
  compact?: boolean;
  vertical?: boolean;
}

const StyledCardRadioGroup = styled.div<{ compact?: boolean }>`
  .card-radio-group {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .card-radio-group-vertical {
    flex-direction: column;
  }

  .card-radio-button {
    flex: 1;
    position: relative;
    padding: ${(props) => (props.compact ? '1rem' : '1.5rem')};
    border-width: 2px;
    transition: all 0.2s ease;
    text-align: center;
    border-radius: 8px;
  }

  .card-radio-button:hover {
    transform: translateY(-2px);
  }

  .card-radio-button.selected {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .icon-container {
    font-size: ${(props) => (props.compact ? '1.5rem' : '2rem')};
  }

  .option-label {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .option-description {
    font-size: 0.875rem;
  }

  .selected-indicator {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    color: currentColor;
  }

  .card-radio-group-compact .card-radio-button {
    padding: 0.75rem;
  }

  .card-radio-group-compact .option-label {
    font-size: 0.9rem;
  }
`;

export default function CardRadioGroup({
  name,
  options,
  formik,
  labelPrefix,
  className = '',
  required = false,
  label,
  compact = false,
  vertical = false,
}: CardRadioGroupProps) {
  const { t } = useTranslation();

  const handleOptionClick = (value: string) => {
    formik.setFieldValue(name, value);
  };

  return (
    <StyledCardRadioGroup className={`form-group ${className}`} compact={compact}>
      {label && (
        <label className="form-label">
          {t(label)}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div
        className={classNames('card-radio-group', {
          'card-radio-group-vertical': vertical,
          'card-radio-group-compact': compact,
        })}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            variant={
              formik.values[name] === option.value
                ? option.variant || 'primary'
                : `outline-${option.variant || 'primary'}`
            }
            className={classNames('card-radio-button', {
              selected: formik.values[name] === option.value,
            })}
            onClick={() => handleOptionClick(option.value)}
          >
            <div className="d-flex flex-column align-items-center">
              {option.icon && <div className="icon-container mb-2">{option.icon}</div>}
              <span className="option-label">
                {labelPrefix ? t(`${labelPrefix}.${option.label}`) : option.label}
              </span>
              {option.description && (
                <span className="option-description text-muted small">{t(option.description)}</span>
              )}
            </div>
            {formik.values[name] === option.value && (
              <div className="selected-indicator">
                <CheckCircleFill size={16} />
              </div>
            )}
          </Button>
        ))}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <div className="invalid-feedback d-block">{formik.errors[name]}</div>
      )}
    </StyledCardRadioGroup>
  );
}

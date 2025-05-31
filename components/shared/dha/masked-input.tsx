import React from 'react';
import InputMask from 'react-input-mask';
import { Input } from './input';

interface MaskedInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  mask: string;
  maskChar?: string | null;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  autoComplete?: string;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const MaskedInput: React.FC<MaskedInputProps> = ({ mask, maskChar = null, ...props }) => {
  return (
    <InputMask
      mask={mask}
      maskChar={maskChar}
      value={props.value || ''}
      onChange={props.onChange}
      onBlur={props.onBlur}
    >
      {(inputProps: any) => <Input {...props} {...inputProps} />}
    </InputMask>
  );
};

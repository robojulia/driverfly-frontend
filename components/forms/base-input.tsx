import React from 'react';
import { useTranslation } from '../../hooks/use-translation';
import BaseControl, { BaseControlProps } from './base-control';
import styles from '../../styles/digitalhiringapp.module.css';

export interface BaseInputProps
  extends BaseControlProps,
    React.InputHTMLAttributes<HTMLInputElement> {
  accept?: string;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  min?: string | number;
  max?: string | number;
  step?: number;
  placeholder?: string;
  displayPlaceholder?: string | boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
}

const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      formik,
      accept,
      required,
      className,
      label,
      handleBlur,
      type,
      min,
      max,
      step,
      placeholder,
      displayPlaceholder,
      value,
      onChange,
      onKeyDown,
      readOnly,
      name,
      touched,
      error,
      append,
      prepend,
      ...rest
    },
    _ref
  ) => {
    const { t } = useTranslation();

    if (formik) {
      /**
       * @type {import('formik').FieldMetaProps}
       */
      const meta = formik.getFieldMeta(name);

      if (meta) {
        value = meta.value;
        touched = meta.touched;
        error = meta.error;
      }
      onChange = onChange || formik.handleChange;
      handleBlur = handleBlur || formik.handleBlur;
    }

    /* This code snippet is checking if the `type` of the input field is "date" and if the `value` is a
    string and contains the letter "T". If these conditions are met, it splits the `value` string at the
    "T" character and assigns only the part before "T" to the `value` variable. This is likely done to
    handle cases where the input value includes a time component along with the date, and the code is
    extracting only the date part for display or processing purposes. */
    if (type == 'date' && typeof value == 'string' && value?.includes('T')) {
      value = value.split('T')[0];
    }

    if (type === 'date') {
      const currentOnChange = onChange;

      onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = e?.target;

        // Split the value into year, month, and day components
        const [year, month, day] = value?.split('-');

        // Restrict the year part to 4 digits
        if (year && year?.length > 4) {
          e.target.value = `${year?.slice(0, 4)}-${month || ''}-${day || ''}`;
        }

        if (currentOnChange) currentOnChange(e);
      };
    }

    /* This code snippet is handling keyboard events for input fields based on the `type` property. */
    if (type == 'int' || type == 'integer') {
      type = 'number';
      step = 1;
      onKeyDown =
        onKeyDown ||
        /**
         * @param {React.KeyboardEvent<HTMLInputElement>} e
         */
        function (e) {
          // prevent negative if the min value is set to 0
          if (min != null && +min >= 0 && e.key == '-') e.preventDefault();

          if (e.key == '.') {
            e.preventDefault();
          }
        };
    } else if (type == 'number') {
      onKeyDown =
        onKeyDown ||
        /**
         * @param {React.KeyboardEvent<HTMLInputElement>} e
         */
        function (e) {
          // prevent negative if the min value is set to 0
          if (min != null && +min >= 0 && e.key == '-') e.preventDefault();
          // if (e.key != "-" && e.key != "." && isNaN(+e.key)) e.preventDefault();
          if (['e', 'E', '+'].includes(e.key)) e.preventDefault();
        };
    }

    /* This code snippet is a conditional check that modifies the `onChange` event handler function for the
    input field if the `type` of the input is "number". */
    if (type == 'number') {
      let currentOnChange = onChange;

      /**
       * @param {React.ChangeEvent<HTMLInputElement>} e
       */
      onChange = (e) => {
        const { value } = e.target;

        if (value && value.startsWith('.')) {
          e.target.value = `0${value}`;
        }

        if (currentOnChange) currentOnChange(e);
      };
    }

    /* This code snippet is checking if the `inputMode` property is not already set in the `rest` object.
    If it is not set, then it further checks if the `type` property is equal to "number" or if it is
    equal to "int" or "integer". If any of these conditions are true, it sets the `inputMode` property
    in the `rest` object to "numeric". This is a way to dynamically set the `inputMode` property based
    on the `type` of the input field being rendered. */
    if (!rest.inputMode) {
      if (type == 'number' || type == 'int' || type == 'integer') {
        rest.inputMode = 'numeric';
      }
    }

    return (
      <BaseControl
        className={className}
        name={name}
        label={label}
        required={required}
        formik={formik}
        touched={touched}
        error={error}
        prepend={prepend}
        append={append}
      >
        <input
          ref={_ref}
          accept={type == 'file' ? accept : null}
          onBlur={handleBlur}
          type={type || 'text'}
          min={min}
          max={max}
          step={step}
          placeholder={
            (displayPlaceholder || placeholder) &&
            t(
              (typeof displayPlaceholder == 'string' && displayPlaceholder) ||
                placeholder ||
                label ||
                name
            )
          }
          value={value == null ? '' : value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          readOnly={readOnly}
          name={name}
          id={name}
          className={`${styles.formInput} form-control ${error ? 'is-invalid' : ''}`}
          {...rest}
        />
      </BaseControl>
    );
  }
);

BaseInput.displayName = 'BaseInput';

export default BaseInput;

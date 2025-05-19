import { FormikProps } from 'formik';
import { Form } from 'react-bootstrap';
import { useTranslation } from '../../hooks/use-translation';

interface BaseDateInputProps {
  name: string;
  label: string;
  required?: boolean;
  formik: FormikProps<any>;
  className?: string;
  placeholder?: string;
}

export default function BaseDateInput({
  name,
  label,
  required = false,
  formik,
  className = '',
  placeholder,
}: BaseDateInputProps) {
  const { t } = useTranslation();
  const error = formik.touched[name] && formik.errors[name];

  return (
    <Form.Group className={className}>
      <Form.Label>
        {t(label)}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      <Form.Control
        type="date"
        name={name}
        value={formik.values[name] ? new Date(formik.values[name]).toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const date = e.target.value ? new Date(e.target.value) : null;
          formik.setFieldValue(name, date);
        }}
        onBlur={formik.handleBlur}
        isInvalid={!!error}
        placeholder={placeholder || t('Select date')}
      />
      {error && <Form.Control.Feedback type="invalid">{t(error as string)}</Form.Control.Feedback>}
    </Form.Group>
  );
}

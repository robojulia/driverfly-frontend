import { useState } from 'react';
import { Button, Row, Alert } from 'react-bootstrap';
import styles from '../../../../../styles/digitalhiringapp.module.css';
import { useTranslation } from '../../../../../hooks/use-translation';
import { FormikInterface } from '../../../../../utils/formik';
import { SimpleCamera } from './simple-camera';

interface CameraCompProps {
  form?: FormikInterface<any>;
  name?: string;
  onRemove?: () => void; // Callback for when document is removed/reset
}

interface ImageData {
  base64: string;
  blob: Blob;
  url: string;
}

export function CameraComponent({ form, name, onRemove }: CameraCompProps) {
  const [image, setImage] = useState<ImageData | null>(null);
  const [error, setError] = useState<string>('');
  const date = new Date();
  const { t } = useTranslation();

  const handleCapture = ({ base64, blob }: { base64: string; blob: Blob }) => {
    try {
      const url = URL.createObjectURL(blob);
      const imageData = { base64, blob, url };
      setImage(imageData);

      // Update form values
      form?.setFieldValue(`${name ?? 'document'}.file_base64`, base64);
      form?.setFieldValue(`${name ?? 'document'}.path`, url);
      form?.setFieldValue(`${name ?? 'document'}.mime_type`, 'image/jpeg');
      form?.setFieldValue(`${name ?? 'document'}.name`, `${date.toISOString()}.jpeg`);
    } catch (err) {
      console.error('Photo capture error:', err);
      setError(t('PHOTO_CAPTURE_FAILED'));
    }
  };

  const resetCamera = () => {
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage(null);
    setError('');

    // Clear form values
    form?.setFieldValue(`${name ?? 'document'}.file_base64`, null);
    form?.setFieldValue(`${name ?? 'document'}.path`, null);
    form?.setFieldValue(`${name ?? 'document'}.mime_type`, null);
    form?.setFieldValue(`${name ?? 'document'}.name`, null);

    // Call onRemove callback to handle applicant extras cleanup
    onRemove?.();
  };

  return (
    <div className={styles.align__text_left}>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      {!image ? (
        <SimpleCamera onCapture={handleCapture} />
      ) : (
        <Row>
          <div className={styles.camera_container}>
            <img
              src={image.url}
              alt={t('CAPTURED_PHOTO')}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <Button variant="primary" className="mt-3" onClick={resetCamera}>
            {t('NEW_IMAGE')}
          </Button>
        </Row>
      )}
    </div>
  );
}

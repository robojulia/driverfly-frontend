import { useState } from 'react';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { CloudArrowDown, Eye, Trash } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/use-translation';
import DocumentApi from '../../pages/api/document';
import { getBase64 } from '../../utils/file';
import ViewModal from '../view-details/view-modal';
import ViewPdf from '../view-details/view-pdf';
import { BaseControlProps } from './base-control';
import { handleDownloadDocument } from '../../utils/documents/button-actions';

export interface FileInputProps extends BaseControlProps {
  documentType?: string;
  accept?: string;
  allowedTypesFriendlyName?: string;
  id?: string;
  handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string | boolean;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  allowedSizeInByte?: number;
  hideView?: boolean | (() => boolean);
  onRemove?: () => void; // Callback for when document is removed/cleared
}

export default function FileInput({
  documentType,
  formik,
  accept,
  required,
  className,
  label,
  handleBlur,
  placeholder,
  value,
  onChange,
  readOnly,
  name,
  id,
  touched,
  error,
  allowedSizeInByte,
  hideView,
  allowedTypesFriendlyName,
  onRemove,
}: FileInputProps) {
  const { t } = useTranslation();
  if (formik) {
    const meta = formik.getFieldMeta(name);

    const metas = {
      name: formik.getFieldMeta(`${name}.name`),
      mime_type: formik.getFieldMeta(`${name}.mime_type`),
      file_base64: formik.getFieldMeta(`${name}.file_base64`),
    };

    if (meta) {
      value = meta.value;
      touched = meta.touched;
      error = metas.name?.error || metas.mime_type?.error || metas.file_base64?.error || meta.error;
    }
    onChange = onChange || formik.handleChange;
    // handleBlur = handleBlur || formik.handleBlur;
  }

  function onChangeProxy(e) {
    if (onChange) onChange(e);
    if (handleBlur) handleBlur(e);
  }

  /**
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e
   */
  async function formattedOnChange(e) {
    if (!onChange) return;

    if (!!allowedSizeInByte && e.target.files[0].size >= allowedSizeInByte) {
      if (formik) {
        formik.setFieldError(
          name,
          t('FILE_MUST_BE_OF_{size}_{unit}_{uploaded_size}', {
            size: allowedSizeInByte / 1048576,
            unit: 'MB',
            uploaded_size: e.target.files[0].size / 1048576,
          })
        );
      } else {
        alert(
          t('FILE_MUST_BE_OF_{size}_{unit}', { size: allowedSizeInByte / 1048576, unit: 'MB' })
        );
      }
      return;
    }

    const { type } = e.target;

    let newValue = null;
    switch (type) {
      case 'text':
        newValue = {
          ...(value || {}),
          name: e.target.value,
        };
        break;
      case 'file':
        const {
          files: [file],
        } = e.target;
        newValue = {
          ...(value || {}),
          type: documentType || value?.type,
          name: file?.name,
          mime_type: file?.type,
          path: file ? URL.createObjectURL(file) : null,
          file_base64: file ? await getBase64(file) : null,
        };
        break;
    }

    onChangeProxy({
      ...e,
      target: {
        ...e.target,
        name: name,
        value: newValue,
      },
    });
  }

  function clear(e) {
    if (!onChange) return;

    // in the situation where we control the type, we assume everything else is hidden.
    const newValue = documentType
      ? null
      : {
          ...(value || {}),
          name: null,
          mime_type: null,
          path: null,
          file_base64: null,
        };

    onChangeProxy({
      ...e,
      target: {
        ...e.target,
        name: name,
        value: newValue,
      },
    });

    // Call onRemove callback to handle applicant extras cleanup
    onRemove?.();
  }

  const [viewDoc, setViewDoc] = useState('');

  async function view(e) {
    if (value?.id) {
      const api = new DocumentApi();
      const document = await api.getSignedUrl(value.id);
      // console.log("fetched document", { document });
      setViewDoc(document.path);
    } else if (value?.path) {
      setViewDoc(value.path);
    }
  }

  async function download(e) {
    if (value?.id) {
      await handleDownloadDocument(value?.id);
    } else if (value?.path) {
      const response = await fetch(value?.path);
      const fileBlob = await response.blob();

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = URL.createObjectURL(fileBlob);
      link.download = value.name;

      document.body.appendChild(link);

      // Simulate a click on the link to trigger the download
      link.click();

      // Clean up the temporary link
      document.body.removeChild(link);
      link.remove();
    }
  }

  function close() {
    setViewDoc(null);
  }
  const canView = !value?.name?.includes('.doc') && !hideView;

  return (
    <>
      <div className={className}>
        {label && (
          <>
            <label>
              {t(label)}
              {required ? '*' : ''}:
            </label>
            <br />
          </>
        )}
        {allowedTypesFriendlyName && (
          <span className="text-muted small">
            {t('FILE_MUST_BE_OF_{types}', { types: allowedTypesFriendlyName })}
          </span>
        )}
        <InputGroup>
          <input
            id={id || name}
            accept={accept}
            onBlur={handleBlur}
            type={value?.name ? 'text' : 'file'}
            value={value?.name || ''}
            placeholder={t(placeholder == true ? label || name : (placeholder || '').toString())}
            disabled={!!value?.name}
            onChange={formattedOnChange}
            readOnly={readOnly}
            name={name}
            className={`form-control ${error ? 'is-invalid' : ''}`}
          />
          {value?.name && (
            <div className="input-group-append">
              <ButtonGroup>
                <Button name={name} variant="success" type="button" onClick={download}>
                  <CloudArrowDown />
                </Button>
                {!!canView && (
                  <Button name={name} type="button" onClick={view}>
                    <Eye />
                  </Button>
                )}
                <Button name={name} variant="danger" type="button" onClick={clear}>
                  <Trash />
                </Button>
              </ButtonGroup>
            </div>
          )}
        </InputGroup>
        {touched && error && typeof error != 'object' ? (
          <span className="text-danger small">
            {typeof error == 'string' ? t(error) : JSON.stringify(error)}
          </span>
        ) : null}
      </div>
      {/* {value?.mime_type == "application/pdf" && }*/}
      <ViewPdf name={value?.name} url={viewDoc} onCloseClick={close} />
      {value?.mime_type?.includes('image/') && (
        <ViewModal show={!!viewDoc} title={value?.name} onCloseClick={close}>
          <img className="img-thumbnail" src={viewDoc} />
        </ViewModal>
      )}
    </>
  );
}

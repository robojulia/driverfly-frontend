import Link from 'next/link';
import { useState } from 'react';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/useTranslation';
import DocumentApi from '../../pages/api/document';
import { getBase64 } from "../../utils/file";
import ViewModal from '../viewDetails/viewModal';
import ViewPdf from '../viewDetails/viewPdf';
import { BaseControlProps } from './BaseControl';

export interface FileInputProps extends BaseControlProps {
    documentType?: string;
    accept?: string;
    handleBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string | boolean;
    value?: any;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
  }
  
  export default function FileInput({ documentType, formik, accept, required, className, label, handleBlur, placeholder, value, onChange, readOnly, name, touched, error, }: FileInputProps) {
    const { t } = useTranslation();
    if (formik) {
        const meta = formik.getFieldMeta(name);

        const metas = {
            name: formik.getFieldMeta(`${name}.name`),
            mime_type: formik.getFieldMeta(`${name}.mime_type`),
            file_base64: formik.getFieldMeta(`${name}.file_base64`)
        };

        if (meta) {
          value = meta.value;
          touched = meta.touched;
          error = metas.name?.error || metas.mime_type?.error || metas.file_base64?.error || meta.error;
        }
        onChange = onChange || formik.handleChange
        handleBlur = handleBlur || formik.handleBlur;
    }

    function onChangeProxy(e) {
        if (onChange)
            onChange(e);
        if (handleBlur)
            handleBlur(e);
    }

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    async function formattedOnChange(e) {
        if (!onChange) return;
        
        if(e.target.files[0].size <= 3000000 ){
        const { type } = e.target;

        let newValue = null;
        switch (type) {
            case "text":
                newValue = {
                    ...(value || {}),
                    name: e.target.value,
                };
                break;
            case "file":
                const { files: [ file ] } = e.target;
                newValue = {
                    ...(value || {}),
                    type: documentType || value?.type,
                    name: file?.name,
                    mime_type: file?.type,
                    path: file ? URL.createObjectURL(file) : null,
                    file_base64: file ? await getBase64(file) : null
                };
                break;
        }

        onChangeProxy({
            ...e,
            target: {
                ...e.target,
                name: name,
                value: newValue
            }
        });
    }
    }

    function clear(e) {
        if (!onChange) return;

        // in the situation where we control the type, we assume everything else is hidden.
        const newValue = documentType ? null : {
            ...(value || {}),
            name: null,
            mime_type: null,
            path: null,
            file_base64: null
        };

        onChangeProxy({
            ...e,
            target: {
                ...e.target,
                name: name,
                value: newValue
            }
        });
    }

    const [ viewDoc, setViewDoc ] = useState("");

    async function view(e) {
        console.log(value);
        if (value?.id) {
            const api = new DocumentApi();
            const document = await api.getSignedUrl(value.id);
            console.log(document);
            setViewDoc(document.path);
        } else if (value?.path) {
            setViewDoc(value.path);
        }
    }

    function close() {
        setViewDoc(null);
    }

    // only supported views for right now.
    const canView = accept === "application/pdf" || accept?.startsWith("image/");

    return (
        <>
            <div className={className}>
                {label && <><label>{t(label)}{required ? "*" : ""}:</label><br /></>}
                <InputGroup>
                    <input
                        accept={accept}
                        onBlur={handleBlur}
                        type={value?.name ? "text" : "file"}
                        value={value?.name || ""}
                        placeholder={t(placeholder === true ? label || name : (placeholder || "").toString())}
                        disabled={!!value?.name}
                        onChange={formattedOnChange}
                        readOnly={readOnly}
                        name={name}
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        />
                    {value?.name &&
                        <div className='input-group-append'>
                            <ButtonGroup>
                                {canView &&
                                    <Button name={name} type="button" onClick={view}>
                                        <Eye />
                                    </Button>
                                }
                                <Button name={name} variant="danger" type="button" onClick={clear}>
                                    <Trash />
                                </Button>
                            </ButtonGroup>
                        </div>
                    }
                </InputGroup>
                {touched && error ? <span className="text-danger small">{typeof error === "string" ? t(error) : JSON.stringify(error)}</span> : null}
            </div>
            {accept === "application/pdf" &&
                <ViewPdf name={value?.name} url={viewDoc} onCloseClick={close} />}
            {accept.startsWith("image/") &&
                <ViewModal show={!!viewDoc} title={value?.name} onCloseClick={close}>
                    <img className="img-thumbnail" src={viewDoc} />
                </ViewModal>}
        </>);
}

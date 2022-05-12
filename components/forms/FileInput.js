import Link from 'next/link';
import { useState } from 'react';
import { Button, ButtonGroup, InputGroup } from 'react-bootstrap';
import { Eye, Trash } from 'react-bootstrap-icons';
import { useTranslation } from '../../hooks/useTranslation';
import DocumentApi from '../../pages/api/document';
import { getBase64 } from "../../utils/file";
import ViewModal from '../viewDetails/viewModal';
import ViewPdf from '../viewDetails/viewPdf';

export default function FileInput({ formik, accept, required, className, label, handleBlur, placeholder, value, onChange, readOnly, name, touched, error, }) {
    const { t } = useTranslation();
    if (formik) {
        /**
         * @type {import('formik').FieldMetaProps}
         */
        const meta = formik.getFieldMeta(name);

        const metas = {
            name: formik.getFieldMeta(`${name}.name`),
            mime_type: formik.getFieldMeta(`${name}.mime_type`),
            file_base64: formik.getFieldMeta(`${name}.file_base64`)
        };

        if (meta) {
          value = meta.value;
          touched = meta.touched;
          error = meta.error || metas.name?.error || metas.mime_type?.error || metas.file_base64?.error;
        }
        onChange = onChange || formik.handleChange
        handleBlur = handleBlur || formik.handleBlur;
    }

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    async function formattedOnChange(e) {
        if (!onChange) return;

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
                    name: file?.name,
                    mime_type: file?.type,
                    path: file ? URL.createObjectURL(file) : null,
                    file_base64: file ? await getBase64(file) : null
                };
                break;
        }

        onChange({
            ...e,
            target: {
                ...e.target,
                name: name,
                value: newValue
            }
        });

    }

    function clear(e) {
        if (!onChange) return;

        const newValue = {
            ...(value || {}),
            name: null,
            mime_type: null,
            path: null,
            file_base64: null
        };

        onChange({
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
        if (value?.path) {
            setViewDoc(value.path);
        }
        else if (value?.id) {
            const api = new DocumentApi();
            const document = await api.getSignedUrl(value.id);
            console.log(document);
            setViewDoc(document.path);
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
                        placeholder={t(placeholder)}
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
                {touched && error && (typeof error === "string") ? <span className="text-danger small">{t(error)}</span> : null}
            </div>
            {accept === "application/pdf" &&
                <ViewPdf name={value.name} url={viewDoc} onCloseClick={close} />}
            {accept.startsWith("image/") &&
                <ViewModal show={!!viewDoc} name={value.name} onCloseClick={close}>
                    <img className="img-thumbnail" src={viewDoc} />
                </ViewModal>}
        </>);
}

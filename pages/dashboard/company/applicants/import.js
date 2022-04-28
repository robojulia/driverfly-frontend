import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Container, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { parseCSV } from "../../../../utils/file";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";

import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { useTranslation } from '../../../../hooks/useTranslation'

import { Check, XCircle } from "react-bootstrap-icons";

import { useState } from "react";

import FileDownload from 'js-file-download';


import * as fileUtils from "../../../../utils/file";
import Switch from "../../../../components/controls/switch";
import BaseInput from "../../../../components/forms/BaseInput";
import BaseCheck from "../../../../components/forms/BaseCheck";

export default function Import() {

    const { t } = useTranslation();

    const schema = ApplicantEntity.yupSchema();

    const schemaDescribe = schema.describe();

    /**
     * @type {ApplicantEntity[]}
     */
    const initialValues = [];
    const form = useFormik({
        initialValues: initialValues,
        validationSchema: yup.array(
            schema
        ),
        onSubmit: async (values) => {

        }
    });


    const [ progress, setProgress ] = useState(0);

    const [ fileName, setFileName ] = useState("");

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onFileChange = async (e) => {
        const { target: { files: [ file ], value } } = e;
        setFileName(value);

        if (file) {
            let contents = await fileUtils.readCSV(file, {
                onProgress: (p) => setProgress(p)
            });
            // contents = parseCSV(contents);
            // if (contents.length <= 1) {
            //     toast.error("FILE_HAS_NO_RECORDS");
            //     return;
            // }

            // headers = contents[0];

            //if (contents.length > 0 && contents[0][0] === headers[0]) contents = contents.slice(1);

            contents = contents.map(row => {
                const entity = new ApplicantEntity();

                row.forEach((col, i) => {
                    const header = headers[i];

                    const desc = schemaDescribe.fields[header];
                    switch (desc.type) {
                        case "boolean": entity[header] = col === "Y"; break;
                        default: entity[header] = col ? col : entity[header];
                    }
            });

                return entity;
            });

            form.setValues(contents, true);
        }
    }

    const headers = Object.keys(schemaDescribe.fields);//Object.keys(new ApplicantEntity());

    const onDownloadClick = (e) => {
        FileDownload(headers.join(","), "Import Applicants Template.csv");
    }

    const onClearClick = (e) => {
        form.resetForm();
        setFileName("");
        setProgress(0);
    }

    const [ onlyErrors, setOnlyErrors ] = useState(false);

    /**
     * 
     * @param {React.ChangeEvent<HTMLInputElement>} e 
     */
    const onOnlyErrorsChange = (e) => {
        setOnlyErrors(e.target.checked);
    }

    const canImport = form.isValue && !form.isSubmitting && form.values.length > 0;
    const canClear = form.values.length > 0 && !form.isSubmitting;


    return (<>
        <ChildPageLayout title="IMPORT_APPLICANTS">
            <Row>
                <Col>
                    {/* <label htmlFor="formFile" className="form-label">{t("UPLOAD_YOUR_FILE")}</label> */}
                    <input onChange={onFileChange} disabled={!!fileName} className="form-control" type="file" accept=".csv" value={fileName} id="formFile" />
                    <ProgressBar variant="primary" min="0" max="100" now={progress} label={`${progress}%`} striped animated  />
                </Col>
                <Col>
                    <div style={{ float: "left" }}>
                        <button type="button" onClick={onDownloadClick} className="btn-sm btn-info pl-3">{t("DOWNLOAD_TEMPLATE")}</button>
                    </div>
                    <div style={{float: "right" }}>
                        <button type="button" disabled={!canClear} onClick={onClearClick} className="btn btn-md btn-danger">{t("CLEAR")}</button>
                        <button type="button" disabled={!canImport} onClick={form.submitForm} className={`btn btn-md btn-primary`}>{t("IMPORT")}</button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ float: "left" }}>
                        {!form.isValid && <span className="text-danger small">{t("ONE_OR_MORE_ERRORS_WERE_FOUND_ON_INPUT_FILE")}</span>}
                    </div>
                    <div className="text-nowrap" style={{float: "right"}}>
                        <Switch
                            label="ONLY_DISPLAY_ERRORS"
                            value={onlyErrors}
                            onChange={onOnlyErrorsChange}
                            />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className="force-overflow p-0">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>#</th>
                                {headers.map(k => (<th>{k}{schemaDescribe.fields[k].tests.some(v => v.name === "required") ? "*" : ""}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {form
                                .values
                                .map((v, i) => (
                            <tr className={onlyErrors && !form.errors[i] ? `d-none` : ""}>
                                <td>{form.errors[i] ? <XCircle color="red" /> : <Check color="green" />}</td>
                                <td>{i + 1}</td>
                                {headers.map(h => (
                                <td>
                                    {guessControl(form, schema, h, i, t)}
                                </td>))}
                            </tr>))}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </ChildPageLayout>
    </>);
}

/**
 * @param {import("formik").FormikConfig} form
 * @param {import("yup/lib/schema").SchemaObjectDescription} schema 
 * @param {string} header 
 */
function guessControl(form, schema, header, index, t) {

    const desc = schema.fields[header];
    const name = `${index}.${header}`;
    const meta = form.getFieldMeta(name);

    let value = meta.value;
    if (desc.type === "boolean") {
        value = value ? t("YES") : t("NO")
    }

    if (meta.error) {
        return (<>
        {value}
        <br />
        <span className="text-danger small">{meta.error}</span>
        </>);
    }
    return value;

    const required = desc.tests.some(v => v.name === "required");

    let type = desc.type;

    let subType = null;
    switch (type) {
        case "boolean":
            return (
            <BaseCheck
                name={name}
                checked={!!meta.value}
                onChange={form.handleChange}
                required={required}
                />);
        case "string":
            if (desc.tests.some(v => v.name === "email")) subType == "email";

            return (
                <BaseInput
                    type={subType || "text"}
                    required={required}
                    placeholder={header}
                    name={name}
                    value={meta.value}
                    touched={meta.touched}
                    error={meta.errors}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
            );
        case "date":
            return (
                <BaseInput
                    type={"date"}
                    required={required}
                    placeholder={header}
                    name={name}
                    value={meta.value}
                    touched={meta.touched}
                    error={meta.errors}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
            );
        case "number":
            return (
                <BaseInput
                    type="number"
                    required={required}
                    placeholder={header}
                    name={name}
                    value={meta.value}
                    touched={meta.touched}
                    error={meta.errors}
                    onChange={form.handleChange}
                    handleBlur={form.handleBlur}
                    />
            );
        default:
            // console.log("Unknown type", desc);
            return meta.value;
    }


}

Import.getLayout = function getLayout(page) {
    return (
      <FullLayout>
        {page}
      </FullLayout>
    )
  }
  
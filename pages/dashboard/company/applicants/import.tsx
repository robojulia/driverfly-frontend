import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";
import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import { Col, ProgressBar, Row, Table, InputGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as yup from "yup";

import { ApplicantEntity } from "../../../../models/applicant/applicant.entity";
import { TranslateInterface, useTranslation } from '../../../../hooks/useTranslation'

import { Check, CheckCircle, ExclamationTriangle, XCircle } from "react-bootstrap-icons";

import { useState } from "react";

import FileDownload from 'js-file-download';


import * as fileUtils from "../../../../utils/file";
import Switch from "../../../../components/controls/switch";

import * as _style from "../../../../public/components/styles/ImportApplicantsModule.module.css"
import ApplicantApi from "../../../api/applicant";
import OverlyPopover from "../../../../components/popover/overly-popover";
import { FormikInterface } from "../../../../utils/formik";
import { SchemaDescription, SchemaObjectDescription } from "yup/lib/schema";

export default function Import() {

    const style: any = _style;

    const { t } = useTranslation();

    const schema = ApplicantEntity.yupSchema();

    const schemaDescribe = schema.describe();

    const [ warnings, setWarnings ] = useState({});

    const api = new ApplicantApi();
    /**
     * @type {ApplicantEntity[]}
     */
    const initialValues = [];
    const form = useFormik({
        initialValues: {
            items: initialValues
        },
        validationSchema: yup.object({
            items: (yup
                .array(schema)
                .min(1, t("PLEASE_UPLOAD_A_FILE_WITH_AT_LEAST_ONE_ROW")) as any)
                .unique(t("{name}_must_be_unique_in_list", { name: "EMAIL" }, { translateProps: true }), "email", v => v.email),
        }),
        validate: async (values) => {
            const errors = {};

            let lastProgress = 0;
            for (let i = 0; i < values.items.length; i++) {
                const applicant = values.items[i];

                if (applicant.email) {
                    const matches = await api.list({ email: applicant.email })

                    if (matches.some(v => v.company?.id != null)) errors[i] = { email: t("{name}_ALREADY_EXISTS", { name: "EMAIL" }, { translateProps: true }) };
                    else if (matches.some(v => v.company == null)) errors[i] = { email: t("{name}_ALREADY_EXISTS_NO_MERGE", { name: "EMAIL" }, { translateProps: true }) };

                }

                let progress = Math.floor((i + 1) * 100 / values.items.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            setProgress(100);
            setWarnings(errors);
        },
        onSubmit: async (values) => {

            let lastProgress = 0;

            for (let i = 0; i < values.items.length; i++) {
                let dto = values.items[i];

                try {
                    await api.create(dto);
                }
                catch (e) {
                    console.log("error saving applicant", i, e);
                    form.setFieldError(`items.${i}.id`, t("UNABLE_TO_SAVE"));
                    toast.error(t("unable_to_save_information"))
                    return;
                }

                let progress = Math.floor((i + 1) * 100 / values.items.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            toast.success(t("successfully_saved_information"));

            setTimeout(onClearClick, 2000);
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

            if (contents.length > 0 && contents[0][0] === headers[0]) contents = contents.slice(1);

            contents = contents.map(row => {
                const entity = new ApplicantEntity();

                row.forEach((col, i) => {
                    const header = headers[i];

                    const desc = schemaDescribe.fields[header];
                    if (col) {
                        switch (desc.type) {
                            case "boolean": entity[header] = col === "Y"; break;
                            default: entity[header] = col;
                        }
                    }
            });

                return entity;
            });

            form.setValues({ items: contents }, true);
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

    const canUpload = !fileName && !form.isValidating && !form.isSubmitting;
    const canImport = form.isValid && !form.isValidating && !form.isSubmitting && form.values.items.length > 0;
    const canClear = (form.values.items.length > 0 || fileName) && !form.isValidating && !form.isSubmitting;


    return (<>
        <ChildPageLayout title="IMPORT_APPLICANTS" backPath="/dashboard/company/applicants">
            <Row>
                <Col>
                    {/* <label htmlFor="formFile" className="form-label">{t("UPLOAD_YOUR_FILE")}</label> */}
                    <InputGroup>
                        <div className="input-group-prepend">
                            <button type="button" onClick={onDownloadClick} className="btn btn-md btn-primary pl-3">{t("DOWNLOAD_TEMPLATE")}</button>
                        </div>
                        <input onChange={onFileChange} disabled={!canUpload} className="form-control" type="file" accept=".csv" value={fileName} id="formFile" />
                        {
                            !!fileName &&
                            <div className="input-group-append">
                                <button type="button" disabled={!canClear} onClick={onClearClick} className="btn btn-md btn-danger">{t("CLEAR")}</button>
                            </div>
                        }
                    </InputGroup>
                </Col>
                <Col>
                    <div style={{ float: "left" }}>
                        {/** left content */}
                    </div>
                    <div style={{float: "right" }}>
                        {/** right content */}
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
                    <OverlyPopover skipTranslate={false} str={"ONLY_DISPLAY_ERRORS_EXPLANATION"}>
                        <Switch
                            label={"ONLY_DISPLAY_ERRORS"}
                            readOnly={!canClear}
                            value={onlyErrors}
                            onChange={onOnlyErrorsChange}
                        />
                    </OverlyPopover>
                    </div>
                </Col>
            </Row>
            {progress > 0 && progress < 100 &&
            <Row>
                <Col>
                    <ProgressBar variant="primary" min={0} max={100} now={progress} label={`${progress}%`} striped animated  />
                </Col>
            </Row>
            }
            <Row>
                <Col className={`p-0 ${style.table_wrapper_overflowX}`}>
                    <Table striped bordered hover className={style.table_overflowX}>
                        <thead>
                            <tr>
                                <th className={style.frozen_col}><CheckCircle /></th>
                                <th className={style.frozen_col}>#</th>
                                {headers.map(k => (<th>{k}{(schemaDescribe.fields[k] as SchemaDescription).tests.some(v => v.name === "required") ? "*" : ""}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {typeof form.errors.items === "string" &&
                            <tr>
                                <td colSpan={headers.length + 2}>
                                    <span className="text-danger small">{form.errors.items}</span>
                                </td>
                            </tr>
                            }
                            {form
                                .values
                                .items
                                .map((v, i) => {

                                    const meta = form.getFieldMeta(`items.${i}`);

                                    const findIcon = () => {
                                        if (meta.error) return (<XCircle color="red" />);

                                        if (warnings[i]) return (<ExclamationTriangle color="orange" />);

                                        return (<Check color="green" />);
                                    }

                                    if (onlyErrors && !meta.error) return null;
                                    
                                    return (
                                    <tr className={onlyErrors && !meta.error ? `d-none` : ""}>
                                        <td className={style.frozen_col}>{findIcon()}</td>
                                        <td className={style.frozen_col}>{i + 1}</td>
                                        {headers.map(h => (
                                        <td>
                                            {guessControl(form, schema, warnings[i], h, i, t)}
                                        </td>))}
                                    </tr>);
                                })}

                        </tbody>
                    </Table>
                </Col>
            </Row>
        </ChildPageLayout>
    </>);
}

function guessControl(form: FormikInterface, schema, warnings: Record<string, string>, header: string, index: number, t: TranslateInterface) {

    const desc: SchemaObjectDescription = schema.fields[header];
    const name = `items.${index}.${header}`;
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

    if (warnings && warnings[header]) {
        return (<>
        {value}
        <br />
        <span className="text-warning small">{warnings[header]}</span>
        </>);
    }
    return value;
}

Import.getLayout = function getLayout(page) {
    return (
      <FullLayout>
        {page}
      </FullLayout>
    )
  }
  
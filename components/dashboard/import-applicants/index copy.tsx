import { useFormik } from "formik";
import { useState } from "react";
import {
    Col,
    Dropdown,
    InputGroup,
    ProgressBar,
    Row,
    Table,
} from "react-bootstrap";
import {
    Check,
    CheckCircle,
    ExclamationTriangle,
    XCircle,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import * as yup from "yup";
import { SchemaDescription, SchemaObjectDescription } from "yup/lib/schema";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { JobEquipmentType } from "../../../enums/jobs/job-equipment-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { EducationLevel } from "../../../enums/users/education-level.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import {
    TranslateInterface,
    useTranslation,
} from "../../../hooks/use-translation";
import { ApplicantExperienceEntity } from "../../../models/applicant/applicant-experience.entity";
import { ApplicantEntity } from "../../../models/applicant/applicant.entity";
import ApplicantApi from "../../../pages/api/applicant";
import * as _style from "../../../public/components/styles/ImportApplicantsModule.module.css";
import { matchEnum } from "../../../utils/enums.utils";
import * as fileUtils from "../../../utils/file";
import { FormikInterface } from "../../../utils/formik";
import Switch from "../../controls/switch";
import OverlyPopover from "../../popover/overly-popover";



const ImportApplicants = () => {
    const style: any = _style;

    const { t } = useTranslation();

    const schema = ApplicantEntity.yupSchemaForImportApplicants();

    const schemaDescribe = schema.describe();

    const [warnings, setWarnings] = useState({});

    const api = new ApplicantApi();
    /**
     * @type {ApplicantEntity[]}
     */
    const initialValues = [];
    const form = useFormik({
        initialValues: {
            items: initialValues,
        },
        validationSchema: yup.object({
            items: (
                yup
                    .array(schema)
                    .min(1, t("PLEASE_UPLOAD_A_FILE_WITH_AT_LEAST_ONE_ROW")) as any
            ).unique(
                t(
                    "{name}_must_be_unique_in_list",
                    { name: "EMAIL" },
                    { translateProps: true }
                ),
                "email",
                (v) => v.email
            ),
        }),
        validate: async (values) => {
            values.items = values
                ?.items
                ?.filter((v) => Boolean(v.email)
                    || Boolean(v.first_name)
                    || Boolean(v.last_name)
                    || Boolean(v.phone)
                )
            console.log("values validate", values);

            const errors = {};

            let lastProgress = 0;
            for (let i = 0; i < values.items.length; i++) {
                const applicant = values.items[i];

                if (applicant.email) {
                    const rowError: { email?: string; phone?: string } = {};
                    const matches = await api.list({ email: applicant.email });

                    if ((matches as ApplicantEntity[]).some((v) => v.company?.id != null))
                        rowError.email = t(
                            "{name}_ALREADY_EXISTS",
                            { name: "EMAIL" },
                            { translateProps: true }
                        );
                    else if ((matches as ApplicantEntity[]).some((v) => v.company == null))
                        rowError.email = t(
                            "{name}_ALREADY_EXISTS_NO_MERGE",
                            { name: "EMAIL" },
                            { translateProps: true }
                        );

                    if (applicant.phone) {
                        if (applicant.phone.length > 3 && !applicant.phone.startsWith("+1")) applicant.phone = "+1 " + applicant.phone

                        if ((matches as ApplicantEntity[]).some((v) => v.company?.id != null))
                            rowError.phone = t(
                                "{name}_ALREADY_EXISTS",
                                { name: "PHONE" },
                                { translateProps: true }
                            );
                        else if ((matches as ApplicantEntity[]).some((v) => v.company == null))
                            rowError.phone = t(
                                "{name}_ALREADY_EXISTS_NO_MERGE",
                                { name: "PHONE" },
                                { translateProps: true }
                            );
                    }
                    if (rowError) {
                        errors[i] = rowError;
                    }
                }

                let progress = Math.floor(((i + 1) * 100) / values.items.length);

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

                if (!!dto.birthdate) {
                    dto.birthdate = new Date(dto.birthdate).toISOString();
                }
                if (!!dto.license_expiry) {
                    dto.license_expiry = new Date(dto.license_expiry).toISOString();
                }

                try {
                    await api.create(dto);
                } catch (e) {
                    console.log("error saving applicant", i, e);
                    form.setFieldError(`items.${i}.id`, t("UNABLE_TO_SAVE"));
                    toast.error(t("unable_to_save_information"));
                    return;
                }

                let progress = Math.floor(((i + 1) * 100) / values.items.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            toast.success(t("successfully_saved_information"));

            setTimeout(onClearClick, 2000);
        },
    });

    const [progress, setProgress] = useState(0);

    const [fileName, setFileName] = useState("");

    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const onFileChange = async (e) => {
        const {
            target: {
                files: [file],
                value,
            },
        } = e;
        setFileName(value);

        if (file) {
            let contents = await fileUtils.readCSV(file, {
                onProgress: (p) => setProgress(p),
            });

            if (contents.length > 0 && contents[0][0] == headers[0])
                contents = contents.slice(1);

            contents = contents.map((row) => {
                const entity = new ApplicantEntity();

                row.forEach((col, i) => {
                    const header = headers[i];

                    const desc = schemaDescribe.fields[header];
                    if (col) {
                        switch (desc.type) {
                            case "boolean":
                                entity[header] =
                                    col.trim().toLowerCase().startsWith("y") ||
                                    col.toLowerCase().startsWith("t");
                                break;
                            case "array":
                                entity[header] = col
                                    .split(",")
                                    .map((v) => v.trim())
                                    .filter((v) => !!v);
                                break;
                            default:
                                entity[header] = col.trim();
                        }

                        switch (header) {
                            case "license_restrictions":
                                entity.license_restrictions = entity.license_restrictions.map(
                                    (v) =>
                                        matchEnum(v, LicenseRestrictions, "LicenseRestrictions", t)
                                );
                                break;
                            case "transmission_type":
                                entity.transmission_type = entity.transmission_type.map((v) =>
                                    matchEnum(
                                        v,
                                        VehicleTransmissionType,
                                        "VehicleTransmissionType",
                                        t
                                    )
                                );
                                break;
                            case "endorsements":
                                entity.endorsements = entity.endorsements.map((v) =>
                                    matchEnum(v, DriverEndorsement, "DriverEndorsement", t)
                                );
                                break;
                            case "highest_degree":
                                entity.highest_degree = matchEnum(
                                    entity.highest_degree,
                                    EducationLevel,
                                    "EducationLevel",
                                    t
                                );
                                break;
                            case "license_type":
                                entity.license_type = matchEnum(
                                    entity.license_type,
                                    DriverLicenseType,
                                    "DriverLicenseType",
                                    t
                                );
                                break;
                            case "equipment_experience":
                                entity.equipment_experience = entity.equipment_experience.map(
                                    (v) => {
                                        const equipmentExperienceObject =
                                            new ApplicantExperienceEntity();
                                        equipmentExperienceObject.type = matchEnum(
                                            v.toString(),
                                            JobEquipmentType,
                                            "JobEquipmentType",
                                            t
                                        );
                                        return equipmentExperienceObject;
                                    }
                                );
                                break;
                        }
                    }
                });
                return entity;
            });

            console.log("{ items: contents }", { items: contents });

            form?.setValues({ items: contents }, true);
        }
    };

    const headers: string[] = Object.keys(schemaDescribe.fields).filter((v) => {
        switch (v) {
            case "equipment_owned":
            case "employers":
            case "documents":
            case "jobs":
                return false;
            default:
                return true;
        }
    }); //Object.keys(new ApplicantEntity());

    const headersData: string[] = headers?.map(
        (h) =>
        ({
            license_type: DriverLicenseType.CDL_CLASS_A,
            preferred_location: `"${JobGeography.LOCAL},${JobGeography.OTR},${JobGeography.REGIONAL}"`,
            transmission_type: VehicleTransmissionType.AUTOMATIC,
        }[h] || "")
    );

    console.log("headers", headers);
    console.log("headers data", headersData);

    const onDownloadClick = (e) => {
    };

    const onClearClick = (e) => {
        form.resetForm();
        setFileName("");
        setProgress(0);
    };

    const [onlyErrors, setOnlyErrors] = useState(false);

    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const onOnlyErrorsChange = (e) => {
        setOnlyErrors(e.target.checked);
    };

    const canUpload = !fileName && !form.isValidating && !form.isSubmitting;
    const canImport =
        form.isValid &&
        !form.isValidating &&
        !form.isSubmitting &&
        form.values.items.length > 0;
    const canClear =
        (form.values.items.length > 0 || fileName) &&
        !form.isValidating &&
        !form.isSubmitting;
    return (
        <>
            <Row>
                <Col sm="6" className="my-3">
                    <InputGroup>
                        <div className="input-group-prepend">
                            <a
                                download
                                href="../../../ApplicantsTemplate.xlsx"
                                // onClick={onDownloadClick}
                                className="btn btn-md btn-primary pl-3"
                            >
                                {t("DOWNLOAD_TEMPLATE")}
                            </a>
                        </div>
                        <input
                            onChange={onFileChange}
                            disabled={!canUpload}
                            className="form-control"
                            type="file"
                            accept=".csv"
                            value={fileName}
                            id="formFile"
                        />
                        {!!fileName && (
                            <div className="input-group-append">
                                <button
                                    type="button"
                                    disabled={!canClear}
                                    onClick={onClearClick}
                                    className="btn btn-md btn-danger"
                                >
                                    {t("CLEAR")}
                                </button>
                            </div>
                        )}
                    </InputGroup>
                    <p className="small text-secondary">{t("DOWNLOAD_AND_SAVE_AS_CSV")}</p>
                </Col>
                <Col sm="6" className="my-3">
                    <div style={{ float: "right" }}>
                        <button
                            type="button"
                            disabled={!canImport}
                            onClick={form.submitForm}
                            className={`btn btn-md btn-primary`}
                        >
                            {t("IMPORT")}
                        </button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={{ float: "left" }}>
                        {!form.isValid && (
                            <span className="text-danger small">
                                {t("ONE_OR_MORE_ERRORS_WERE_FOUND_ON_INPUT_FILE")}
                            </span>
                        )}
                    </div>
                    <div className="text-nowrap" style={{ float: "right" }}>
                        <OverlyPopover
                            skipTranslate={false}
                            str={"ONLY_DISPLAY_ERRORS_EXPLANATION"}
                        >
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
            {progress > 0 && progress < 100 && (
                <Row>
                    <Col>
                        <ProgressBar
                            variant="primary"
                            min={0}
                            max={100}
                            now={progress}
                            label={`${progress}%`}
                            striped
                            animated
                        />
                    </Col>
                </Row>
            )}
            <Row>
                <Col className={`p-0 ${style.table_wrapper_overflowX}`}>
                    <Table striped bordered hover className={style.table_overflowX}>
                        <thead>
                            <tr>
                                <th className={style.frozen_col}>
                                    <CheckCircle />
                                </th>
                                <th className={style.frozen_col}>#</th>
                                {headers.map((k) => {
                                    const text = `${k}${(schemaDescribe.fields[k] as SchemaDescription).tests.some(
                                        (v) => v.name == "required"
                                    )
                                        ? "*"
                                        : ""
                                        }`;

                                    switch (k) {
                                        case "license_restrictions":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(LicenseRestrictions).map((v) => {
                                                                return (
                                                                    <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "transmission_type":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(VehicleTransmissionType).map(
                                                                (v) => {
                                                                    return (
                                                                        <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                    );
                                                                }
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "endorsements":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(DriverEndorsement).map((v) => {
                                                                return (
                                                                    <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "highest_degree":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(EducationLevel).map((v) => {
                                                                return (
                                                                    <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "license_type":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(DriverLicenseType).map((v) => {
                                                                return (
                                                                    <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "equipment_experience":
                                            return (
                                                <th>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(JobEquipmentType).map((v) => {
                                                                return (
                                                                    <Dropdown.ItemText key={v}>{v}</Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        default:
                                            return <th>{text}</th>;
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {typeof form.errors.items == "string" && (
                                <tr>
                                    <td colSpan={headers.length + 2}>
                                        <span className="text-danger small">
                                            {form.errors.items}
                                        </span>
                                    </td>
                                </tr>
                            )}
                            {form.values.items.map((v, i) => {
                                const meta = form.getFieldMeta(`items.${i}`);

                                const findIcon = () => {
                                    if (meta.error) return <XCircle color="red" />;

                                    // if (Boolean(warnings[i]) && Boolean(Object.keys((warnings[i]))?.length))
                                    if (Boolean(warnings[i]))
                                        return <ExclamationTriangle color="orange" />;

                                    return <Check color="green" />;
                                };

                                if (onlyErrors && !meta.error) return null;

                                return (
                                    <tr key={i} className={onlyErrors && !meta.error ? `d-none` : ""}>
                                        <td className={style.frozen_col}>{findIcon()}</td>
                                        <td className={style.frozen_col}>{i + 1}</td>
                                        {headers.map((h) => (
                                            <td key={h}>
                                                {guessControl(form, schema, warnings[i], h, i, t)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </>
    );
};

function guessControl(
    form: FormikInterface,
    schema,
    warnings: Record<string, string>,
    header: string,
    index: number,
    t: TranslateInterface
) {
    const desc: SchemaObjectDescription = schema.fields[header];
    const name = `items.${index}.${header}`;
    const meta = form.getFieldMeta(name);

    let value = meta.value;
    if (desc.type == "boolean") {
        value = value ? t("YES") : t("NO");
    }

    if (value) {
        switch (header) {
            case "license_restrictions":
                value = value.map((v) => {
                    const key = `LicenseRestrictions.${v}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
            case "transmission_type":
                value = value.map((v) => {
                    const key = `VehicleTransmissionType.${v}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
            case "endorsements":
                value = value.map((v) => {
                    const key = `DriverEndorsement.${v}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
            case "highest_degree":
                {
                    const key = `EducationLevel.${value}`;
                    const text = t(key);
                    if (key != text) value = text;
                }
                break;
            case "license_type":
                {
                    const key = `DriverLicenseType.${value}`;
                    const text = t(key);
                    if (key != text) value = text;
                }
                break;
            case "equipment_experience":
                value = value.map((v) => {
                    const key = `JobEquipmentType.${v.type}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
        }
    }

    if (Array.isArray(value)) {
        return (
            <>
                <ul itemType="circle">
                    {value.map((v, i) => {
                        const error = meta.error ? meta.error[i] : null;

                        if (error) {
                            return (
                                <li key={i}>
                                    {v}
                                    <br />
                                    <span className="text-danger small">{error}</span>
                                </li>
                            );
                        }

                        return <li key={i}>{v}</li>;
                    })}
                </ul>
            </>
        );
    }

    if (meta.error) {
        return (
            <>
                {value}
                <br />
                <span className="text-danger small">{meta.error}</span>
            </>
        );
    }

    if (warnings && warnings[header]) {
        return (
            <>
                {value}
                <br />
                <span className="text-warning small">{warnings[header]}</span>
            </>
        );
    }
    return value;
}
export default ImportApplicants;

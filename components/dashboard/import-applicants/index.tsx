"use client";
import { AxiosProgressEvent } from "axios";
import { useFormik } from "formik";
import Papa from "papaparse";
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
import { FormikInterface } from "../../../utils/formik";
import Switch from "../../controls/switch";
import OverlyPopover from "../../popover/overly-popover";
import { isJwtExpired, useAuth } from "../../../hooks/use-auth";

function unique<T>(value: T, index: number, self: T[]) {
    return (Boolean(value) && self.indexOf(value) == index)
}
const ImportApplicants = () => {
    const style: any = _style;

    const { t } = useTranslation();
    let { user, refreshToken, logoutAndRedirect } = useAuth();

    const schema = ApplicantEntity.yupSchemaForImportApplicants();

    const schemaDescribe = schema.describe();

    const [warnings, setWarnings] = useState({});
    const [csvErrors, setCsvErrors] = useState([]);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [onlyErrors, setOnlyErrors] = useState(false);

    const applicantApi = new ApplicantApi();
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
            // const companyApplicants = await applicantApi.list();
            const companyApplicants = [];
            const errors = {};

            let lastProgress = 0;
            for (let i = 0; i < values.items?.length; i++) {
                const applicant = values.items[i];

                if (
                    applicant.phone?.length > 3 &&
                    !applicant.phone.startsWith("+1")
                ) { applicant.phone = "+1 " + applicant.phone; }

                if (
                    applicant.emergency_contact_number?.length > 3 &&
                    !applicant.emergency_contact_number.startsWith("+1")
                ) { applicant.emergency_contact_number = "+1 " + applicant.emergency_contact_number; }

                if (applicant.email) {
                    const rowError: { email?: string; phone?: string } = {};
                    // const matches = await api.list({ email: applicant.email });
                    const matches = companyApplicants?.find(({ email }) => email == applicant.email);

                    if (!!matches) {
                        // if (matches.some((v) => v.company?.id != null))
                        if (matches?.company?.id != null)
                            rowError.email = t(
                                "{name}_ALREADY_EXISTS",
                                { name: "EMAIL" },
                                { translateProps: true }
                            );
                        // else if (matches.some((v) => v.company == null))
                        else if (matches?.company == null)
                            rowError.email = t(
                                "{name}_ALREADY_EXISTS_NO_MERGE",
                                { name: "EMAIL" },
                                { translateProps: true }
                            );

                        if (applicant.phone) {
                            // if (matches.some((v) => v.company?.id != null))
                            if (matches?.company?.id != null)
                                rowError.phone = t(
                                    "{name}_ALREADY_EXISTS",
                                    { name: "PHONE" },
                                    { translateProps: true }
                                );
                            // else if (matches.some((v) => v.company == null))
                            else if (matches?.company == null)
                                rowError.phone = t(
                                    "{name}_ALREADY_EXISTS_NO_MERGE",
                                    { name: "PHONE" },
                                    { translateProps: true }
                                );
                        }
                    }

                    if (rowError) {
                        errors[i] = rowError;
                    }
                }

                let progress = Math.floor(((i + 1) * 100) / values.items?.length);

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

            for (let i = 0; i < values.items?.length; i++) {
                let dto = values.items[i];

                if (!!dto.birthdate) {
                    const utcBirthdate = new Date(dto.birthdate)
                    dto.birthdate = new Date(utcBirthdate.getUTCFullYear(), utcBirthdate.getUTCMonth(), utcBirthdate.getUTCDate() + 2).toISOString();
                }
                if (!!dto.license_expiry) {
                    const utcLicenseExpiry = new Date(dto.license_expiry)
                    dto.license_expiry = new Date(utcLicenseExpiry.getUTCFullYear(), utcLicenseExpiry.getUTCMonth(), utcLicenseExpiry.getUTCDate() + 2).toISOString();
                }
                values.items[i] = dto;

                try {
                    // console.log("isJwtExpired(user.jwt)", isJwtExpired(user.jwt));

                    if (isJwtExpired(user.jwt)) {
                        if (user.jwtRefresh) {
                            // console.log("isJwtExpired(user.jwtRefresh)", isJwtExpired(user.jwtRefresh));
                            if (isJwtExpired(user.jwtRefresh)) {
                                // console.log("loginGuard:: jwt refresh expired", router.asPath)
                                return !(await logoutAndRedirect());
                            }
                            user = await refreshToken();
                        }
                    }
                    await applicantApi.create(dto);
                } catch (e) {
                    console.log("error saving applicant", i, e);
                    form.setFieldError(`items.${i}.id`, t("UNABLE_TO_SAVE"));
                    // toast.error(t("unable_to_save_information"));
                    toast.error(t("UNABLE_TO_SAVE_INFORMATION_FOR_{row}", { row: i + 1 }));
                    return;
                }

                let progress = Math.floor(((i + 1) * 100) / values.items?.length);

                if (progress != lastProgress) {
                    setProgress(progress);
                    lastProgress = progress;
                }
            }

            // if (isJwtExpired(user.jwt)) {
            //     if (user.jwtRefresh) {
            //         if (isJwtExpired(user.jwtRefresh)) {
            //             return !(await logoutAndRedirect());
            //         }
            //         user = await refreshToken();
            //     }
            // }
            // const response = await applicantApi.createBulk(values.items, {
            //     timeout: 0,
            //     onUploadProgress: (progressEvent: AxiosProgressEvent) =>
            //         setProgress(
            //             Math.round((progressEvent.loaded * 100) / progressEvent.total)
            //         ),
            //     onDownloadProgress: (progressEvent: AxiosProgressEvent) =>
            //         setProgress(
            //             Math.round((progressEvent.loaded * 100) / progressEvent.total)
            //         ),
            // });
            // console.log("response", response);

            // response?.forEach(({ data, error }, i) => {
            //     if (!!error) {
            //         // form.setFieldError(`items.${i}.id`, t("UNABLE_TO_SAVE"));
            //         form.setFieldError(`items.${i}.id`, t(error));
            //     } else {
            //         console.log("saved applicant", i, data);
            //     }
            // })

            // if (!response?.some(({ error }) => !!error)) {
            toast.success(t("successfully_saved_information"));

            setTimeout(onClearClick, 2000);
            // }
        },
    });

    /**
     *
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    async function onFileChange(
        e: React.ChangeEvent<HTMLInputElement>
    ): Promise<void> {
        const {
            target: {
                files: [file],
                value,
            },
        } = e;
        setFileName(value);
        setCsvErrors([]);

        if (file) {
            await Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: validateFileContent,
            });
        }
    }

    function validateFileContent(results): void {
        let {
            data,
            errors,
            meta: { fields },
        } = results;
        console.log("results", { data, errors, fields });

        const contents = data
            ?.map((row, i, self) => {
                console.log(Math.floor(((i + 1) * 100) / data?.length));

                setProgress(Math.floor(((i + 1) * 100) / data?.length))
                const entity = new ApplicantEntity();
                if (!Object.values(row)?.some(Boolean)) {
                    errors = errors.filter((v) => v.row != i);
                    return false;
                }

                Object.entries(row)
                    ?.map(([key, value]: [string, any]) => {
                        const fieldSchema = schemaDescribe.fields[key];
                        if (!fieldSchema) return;

                        switch (fieldSchema?.type) {
                            case "boolean":
                                entity[key] =
                                    value.trim().toLowerCase().startsWith("y") ||
                                    value.toLowerCase().startsWith("t");
                                break;
                            case "array":
                                entity[key] = value
                                    .split(",")
                                    ?.map((v) => v.trim())
                                    .filter((v) => !!v);
                                break;
                            case "number":
                                entity[key] = value != "" ? Number(value) : null;
                                break;
                            case "date":
                                entity[key] = value != "" ? (value) : null;
                                break;
                            default:
                                entity[key] = value.trim();
                        }

                        switch (key) {
                            case "can_pass_drug_test":
                                if (value == "") {
                                    entity.can_pass_drug_test = true;
                                }
                                break;
                            case "moving_violations_count":
                            case "moving_violations_details":
                            case "moving_violations":
                                if (!!entity.moving_violations_count || entity.moving_violations_count > 0) {
                                    entity.moving_violations = true;
                                } else {
                                    entity.moving_violations_count = 0;
                                    entity.moving_violations = false;
                                    entity.moving_violations_details = null;
                                }
                                break;
                            case "accident_count":
                            case "accident_details":
                                if (!!!entity.accident_count) {
                                    entity.accident_count = 0;
                                    entity.accident_details = null;
                                }
                                break;
                            case "license_revoked":
                            case "license_revoked_details":
                                if (!!!entity.license_revoked) {
                                    entity.license_revoked_details = null;
                                }
                                break;
                            case "psp_violations":
                            case "psp_violations_details":
                                if (!!!entity.psp_violations) {
                                    entity.psp_violations_details = null;
                                }
                                break;
                            case "tickets_count":
                            case "tickets_details":
                            case "tickets":
                                if (!entity.tickets) {
                                    if (Boolean(entity.tickets_count)) {
                                        entity.tickets = true;
                                    } else {
                                        entity.tickets_details = null;
                                    }
                                }
                                break;
                            case "infractions_count":
                            case "infractions_details":
                            case "infractions":
                                if (!entity.infractions) {
                                    if (Boolean(entity.infractions_count)) {
                                        entity.infractions = true;
                                    } else {
                                        entity.infractions_details = null;
                                    }
                                }
                                break;
                            case "license_restrictions":
                                entity.license_restrictions = entity.license_restrictions
                                    ?.filter(unique)
                                    ?.map((v, i, self) => {
                                        if (!Object.values(LicenseRestrictions).includes(v)) {
                                            entity.license_restrictions_other =
                                                v + ", " + (entity.license_restrictions_other || "");
                                            return LicenseRestrictions.OTHER;
                                        }
                                        return matchEnum(
                                            v,
                                            LicenseRestrictions,
                                            "LicenseRestrictions",
                                            t
                                        );
                                    })
                                    ?.filter(unique);
                                break;
                            case "transmission_type":
                                entity.transmission_type = entity.transmission_type
                                    ?.filter(unique)
                                    ?.map((v) =>
                                        matchEnum(
                                            v,
                                            VehicleTransmissionType,
                                            "VehicleTransmissionType",
                                            t
                                        )
                                    )
                                    ?.filter(unique);
                                break;
                            case "endorsements":
                                entity.endorsements = entity.endorsements
                                    ?.filter(unique)
                                    ?.map((v) => {
                                        if (!Object.values(DriverEndorsement).includes(v)) {
                                            entity.endorsements_other =
                                                v + ", " + (entity.endorsements_other || "");
                                            return DriverEndorsement.OTHER;
                                        }
                                        return matchEnum(
                                            v,
                                            DriverEndorsement,
                                            "DriverEndorsement",
                                            t
                                        );
                                    })
                                    ?.filter(unique);
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
                                entity.license_type = !entity.license_type
                                    ? DriverLicenseType.NO_CDL
                                    : matchEnum(
                                        entity.license_type,
                                        DriverLicenseType,
                                        "DriverLicenseType",
                                        t
                                    );
                                break;
                            case "equipment_experience":
                                entity.equipment_experience = entity.equipment_experience
                                    ?.filter(unique)
                                    ?.map(
                                        (v) => {
                                            const equipmentExperienceObject = new ApplicantExperienceEntity();
                                            if (!Object.values(JobEquipmentType).includes(v.toString() as JobEquipmentType)) {
                                                equipmentExperienceObject.type_other =
                                                    v + (equipmentExperienceObject.type_other ? `, ${equipmentExperienceObject.type_other}` : "");
                                                equipmentExperienceObject.type = JobEquipmentType.OTHER;
                                            } else {
                                                equipmentExperienceObject.type = matchEnum(
                                                    v.toString(),
                                                    JobEquipmentType,
                                                    "JobEquipmentType",
                                                    t
                                                );
                                            }
                                            return equipmentExperienceObject;
                                        }
                                    )
                                    ?.filter(unique);
                                break;
                        }
                    })
                    ?.filter(Boolean);

                if (!entity.license_revoked) entity.license_revoked_details = "";
                if (!entity.psp_violations) delete entity.psp_violations_details;
                if (!entity.tickets) entity.tickets_details = "";
                if (!entity.positive_drug_test) entity.positive_drug_test_details = "";
                if (!entity.infractions) entity.infractions_details = "";
                if (!entity.moving_violations) entity.moving_violations_details = "";

                return entity;
            })
            ?.filter(Boolean);

        if (errors?.length) setCsvErrors(errors);
        form?.setValues({ items: contents }, true);
        setProgress(0)
    }

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

    const onClearClick = (e) => {
        form.resetForm();
        setFileName("");
        setProgress(0);
        setCsvErrors([]);
    };

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
        form.values.items?.length > 0;
    const canClear =
        (form.values.items?.length > 0 || fileName) &&
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
                        <small className="text-muted d-block mt-1">
                            {t("FILE_MUST_BE_OF_{types}", { types: "CSV" })} • {t("MAXIMUM_FILE_SIZE")}: 5MB
                        </small>
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
                    <p className="small text-secondary">
                        {t("DOWNLOAD_AND_SAVE_AS_CSV")}
                    </p>
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
                            <div className="text-danger small">
                                {t("ONE_OR_MORE_ERRORS_WERE_FOUND_ON_INPUT_FILE")}
                            </div>
                        )}
                    </div>
                    <br />
                    {Boolean(csvErrors.length) && (
                        <div className="text-warning" style={{ float: "left" }}>
                            {csvErrors.map((error, i) => (
                                <div key={i} className="text-bold small">
                                    {error.message} at row {error.row + 1}
                                </div>
                            ))}
                        </div>
                    )}
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
                    <Col className="mx-2">
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
                                {headers?.map((k, i) => {
                                    const text = `${k}${(schemaDescribe.fields[k] as SchemaDescription).tests.some(
                                        (v) => v.name == "required"
                                    )
                                        ? "*"
                                        : ""
                                        }`;

                                    switch (k) {
                                        case "license_restrictions":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(LicenseRestrictions)?.map(
                                                                (v, j) => {
                                                                    return (
                                                                        <Dropdown.ItemText key={j}>
                                                                            {v}
                                                                        </Dropdown.ItemText>
                                                                    );
                                                                }
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "transmission_type":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(VehicleTransmissionType)?.map(
                                                                (v, j) => {
                                                                    return (
                                                                        <Dropdown.ItemText key={j}>
                                                                            {v}
                                                                        </Dropdown.ItemText>
                                                                    );
                                                                }
                                                            )}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "endorsements":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(DriverEndorsement)?.map((v, j) => {
                                                                return (
                                                                    <Dropdown.ItemText key={j}>
                                                                        {v}
                                                                    </Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "highest_degree":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(EducationLevel)?.map((v, j) => {
                                                                return (
                                                                    <Dropdown.ItemText key={j}>
                                                                        {v}
                                                                    </Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "license_type":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(DriverLicenseType)?.map((v, j) => {
                                                                return (
                                                                    <Dropdown.ItemText key={j}>
                                                                        {v}
                                                                    </Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        case "equipment_experience":
                                            return (
                                                <th key={i}>
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="light">
                                                            {text}
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            {Object.values(JobEquipmentType)?.filter(v => v != JobEquipmentType.OTHER)?.map((v, j) => {
                                                                return (
                                                                    <Dropdown.ItemText key={j}>
                                                                        {v}
                                                                    </Dropdown.ItemText>
                                                                );
                                                            })}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </th>
                                            );
                                        default:
                                            return <th key={i}>{text}</th>;
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {typeof form.errors.items == "string" && (
                                <tr>
                                    <td colSpan={headers?.length + 2}>
                                        <span className="text-danger small">
                                            {form.errors.items}
                                        </span>
                                    </td>
                                </tr>
                            )}
                            {form.values.items?.map((v, i) => {
                                const meta = form.getFieldMeta(`items.${i}`);

                                const findIcon = () => {
                                    // c(`items.${i} meta`, { meta }, { warnings: warnings[i] });

                                    if (!!meta.error) return <XCircle color="red" />;

                                    if (Boolean(warnings[i]) && (Object.keys((warnings[i]))?.length))
                                        // if (Boolean(warnings[i]))
                                        return <ExclamationTriangle color="orange" />;

                                    return <Check color="green" />;
                                };

                                if (onlyErrors && !meta.error) return null;

                                return (
                                    <tr
                                        key={i}
                                        className={onlyErrors && !meta.error ? `d-none` : ""}
                                    >
                                        <td className={style.frozen_col}>{findIcon()}</td>
                                        <td className={style.frozen_col}>{i + 1}</td>
                                        {headers?.map((h, j) => (
                                            <td key={j}>
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
                value = value?.map((v) => {
                    const key = `LicenseRestrictions.${v}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
            case "transmission_type":
                value = value?.map((v) => {
                    const key = `VehicleTransmissionType.${v}`;
                    const text = t(key);
                    if (key == text) return v;

                    return text;
                });
                break;
            case "endorsements":
                value = value?.map((v) => {
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
                value = value?.map((v) => {
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
            <ul itemType="circle">
                {value?.map((v, i) => {
                    const error = meta.error ? meta.error[i] : null;

                    if (error) {
                        return (
                            <li key={i} className="m-0 p-0">
                                {v}
                                <br />
                                <span className="text-danger small m-0 p-0">{error}</span>
                            </li>
                        );
                    }

                    return <li key={i} className="m-0 p-0">{v}</li>;
                })}
            </ul>
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

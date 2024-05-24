import { useFormik } from "formik";
import React, { ReactNode, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { Icon } from "react-bootstrap-icons";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { OwnerOperatorCompanyDriverEnum } from "../../../enums/company/owner-company-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { BooleanType } from "../../../enums/jotform/boolean-type.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { ApplicantFiltersDto } from "../../../models/applicant/applicant-filters.entity";
import { FormikInterface } from "../../../utils/formik";
import EntityForm from "../../layouts/page/entity-form";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import StateSelect from "../state-select";
import { UserEntity } from "../../../models/user/user.entity";
import { useEffectAsync } from "../../../utils/react";
import { Status } from "../../../enums/status.enum";
import UserApi from "../../../pages/api/user";

export interface FormActionOptions {
    icon?: Icon;
    label?: string | ReactNode | (() => string | ReactNode);
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    hide?: boolean;
    disabled?: boolean;
}

export interface EntityFormProps {
    id?: number;
    canSubmit?: boolean;
    formik?: FormikInterface;
    onSubmit?: (values: ApplicantFiltersDto) => void;
    className?: string;
    readonly children?: JSX.Element | JSX.Element[];
    actions?: FormActionOptions[];
    submitLabel?: string;
    forbidSubmit?: boolean;
    actionButtonDown?: boolean;
}

export default function ApplicantFilterForm(props: EntityFormProps) {
    const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);

    const { t } = useTranslation();

    let { canSubmit, formik, className, onSubmit } = props;


    const form = useFormik({
        initialValues: new ApplicantFiltersDto(),
        validationSchema: ApplicantFiltersDto.yupSchema(),
        onSubmit: async (values) => {
            onSubmit(values)
        },
        onReset: async () => {
            onSubmit({})
        },
    });


    useEffectAsync(async () => {
        const userApi = new UserApi();
        const data = await userApi.list();
        setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
    }, []);



    return (
        <Form
            onSubmit={form.handleSubmit}
            className={className}
            onReset={form.handleReset}
        >
            <Row >
                <React.Fragment>
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="name"
                        displayPlaceholder
                        formik={form}
                    />

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="cdl_type"
                        name="license_type"
                        labelPrefix="DriverLicenseType"
                        enumType={DriverLicenseType}
                        formik={form}
                    />
                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="LEAD_TYPE"
                        name="type"
                        labelPrefix="ApplicantType"
                        enumType={ApplicantType}
                        formik={form}
                    />

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="ENDORSEMENTS"
                        name="endorsements"
                        labelPrefix="DriverEndorsement"
                        enumType={DriverEndorsement}
                        formik={form}
                    />

                    {form.values.endorsements == DriverEndorsement.OTHER && (
                        <BaseInput
                            className="col-md-3 mt-1 mb-3"
                            placeholder="ENDORSEMENTS"
                            name="license_restrictions_other"
                            displayPlaceholder
                            formik={form}
                        />
                    )}

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="License_Restrictions"
                        name="license_restrictions"
                        labelPrefix="LicenseRestrictions"
                        enumType={LicenseRestrictions}
                        formik={form}
                    />

                    {form.values.license_restrictions == LicenseRestrictions.OTHER && (
                        <BaseInput
                            className="col-md-3 mt-1 mb-3"
                            placeholder="License_Restrictions"
                            name="license_restrictions_other"
                            displayPlaceholder
                            formik={form}
                        />
                    )}


                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="AUTOMATED_RECRUITING_LEAD"
                        name="is_automated_recruiting_lead"
                        enumType={BooleanType}
                        formik={form}
                    />

                    <StateSelect
                        className="col-md-3 mt-1 mb-3"
                        name="state"
                        placeholder="STATE"
                        formik={form}

                    />
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="city"
                        displayPlaceholder
                        formik={form}
                    />

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="STATUS"
                        name="status"
                        labelPrefix="ApplicantStatus"
                        hideOptions={[ApplicantStatus.OTHER]}
                        enumType={ApplicantStatus}
                        formik={form}
                    />


                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="ASSIGNED_RECRUITER"
                        displayPlaceholder
                        options={companyUsers}
                        name="assignedUserId"
                        valueKey="id"
                        createLabel={(c) => `${c.name} (#${c.id}) `}
                        formik={form}
                    />

                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="years_cdl_experience"
                        displayPlaceholder
                        type='number'
                        formik={form}
                    />


                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="PREFERRED_LOCATION"
                        name="preferred_location"
                        labelPrefix="JobGeography"
                        enumType={JobGeography}
                        formik={form}
                    />
                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="TRANSMISSION_EXPERIENCE"
                        name="transmission_type"
                        labelPrefix="VehicleTransmissionType"
                        enumType={VehicleTransmissionType}
                        formik={form}
                    />

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="OWNER_OP_COMPANY_DRIVER"
                        name="is_owner_operator"
                        enumType={OwnerOperatorCompanyDriverEnum}
                        formik={form}
                    />
                    <Button
                        className="col-md-1 ml-3 mt-1 mb-3 mr-3 "
                        variant="primary"
                        size='sm'
                        type="submit"
                    >
                        {t("SEARCH")}
                    </Button>

                    <Button
                        className="col-md-1 ml-3 mt-1 mb-3 theme-general-btn  mr-3"
                        variant=""
                        size='sm'
                        type="reset"
                    >
                        {t("RESET")}
                    </Button>

                </React.Fragment>

            </Row>
        </Form>
    );
}
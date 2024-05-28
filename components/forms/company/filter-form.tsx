import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { LicenseRestrictions } from "../../../enums/applicants/applicant-license-restrictions-type.enum";
import { ApplicantStatus } from "../../../enums/applicants/applicant-status.enum";
import { ApplicantType } from "../../../enums/applicants/applicant-type.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { BooleanType } from "../../../enums/jotform/boolean-type.enum";
import { Status } from "../../../enums/status.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { SearchApplicantDto } from "../../../models/applicant/search-applicant.dto";
import { UserEntity } from "../../../models/user/user.entity";
import UserApi from "../../../pages/api/user";
import { useEffectAsync } from "../../../utils/react";
import BaseInput from "../base-input";
import BaseSelect from "../base-select";
import StateSelect from "../state-select";

export interface ApplicantFilterFormProps {
    onSearch?: (values: SearchApplicantDto) => void;
    className?: string;
}

export default function ApplicantFilterForm({ className, onSearch }: ApplicantFilterFormProps) {
    const { t } = useTranslation();

    const [companyUsers, setCompanyUsers] = useState<UserEntity[]>([]);

    const form = useFormik({
        initialValues: new SearchApplicantDto(),
        validationSchema: SearchApplicantDto.yupSchema(),
        onSubmit: async (values) => {
            onSearch(values)
        },
        onReset: async () => {
            onSearch({})
        },
    });

    useEffectAsync(async () => {
        const userApi = new UserApi();
        const data = await userApi.list();
        setCompanyUsers(data?.filter((u) => u.status == Status.ACTIVE));
    }, []);

    // uncomment this in debug mode
    // useEffect(() => {
    //     console.log("filteer form.values", form.values);
    // }, [form.values])

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
                        options={([{
                            label: t("OWNER_OPERATOR"),
                            value: true
                        }, {
                            label: t("COMPANY_DRIVER"),
                            value: false
                        }])}
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
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
import stateList from "../../../utils/stateList";
import BaseInput from "../base-input";
import BaseMultiSelect from "../base-multiselect";
import BaseSelect from "../base-select";

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

    React.useEffect(() => {
        console.log("filteer form.values", form.values);
    }, [form.values])

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
                    <BaseMultiSelect
                        className="col-md-3 z-999"
                        placeholder="ENDORSEMENTS"
                        name="endorsements"
                        formik={form}
                        showNone
                        labelPrefix="DriverEndorsement"
                        enumType={DriverEndorsement} />

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
                        placeholder="cdl_type"
                        name="license_type"
                        labelPrefix="DriverLicenseType"
                        enumType={DriverLicenseType}
                        formik={form}
                    />
                    <BaseMultiSelect
                        className="col-md-3 z-3"
                        placeholder="License_Restrictions"
                        name="license_restrictions"
                        formik={form}
                        showNone
                        labelPrefix="LicenseRestrictions"
                        enumType={LicenseRestrictions} />
                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="AUTOMATED_RECRUITING_LEAD"
                        name="is_automated_recruiting_lead"
                        enumType={BooleanType}
                        formik={form}
                    />

                    <BaseMultiSelect
                        className="col-md-3 z-2 "
                        placeholder="STATUS"
                        name="status"
                        labelPrefix="ApplicantStatus"
                        hideOptions={[ApplicantStatus.OTHER]}
                        enumType={ApplicantStatus}
                        formik={form} />
                    <BaseMultiSelect
                        className="col-md-3"
                        placeholder="STATE"
                        name="state"
                        options={stateList}
                        formik={form}
                    />
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="city"
                        displayPlaceholder
                        formik={form}
                    />
                    <BaseMultiSelect
                        className="col-md-3 z-2"
                        placeholder="ASSIGNED_RECRUITER"
                        displayPlaceholder
                        options={companyUsers}
                        name="assignedUserId"
                        valueKey="id"
                        showNone
                        showNoneLabel="Unassigned"
                        createLabel={(c) => `${c?.name} (#${c?.id}) `}
                        formik={form} />
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="years_cdl_experience"
                        displayPlaceholder
                        type='number'
                        formik={form}
                    />
                    <BaseMultiSelect
                        className="col-md-3 z-2"
                        placeholder="PREFERRED_LOCATION"
                        name="preferred_location"
                        labelPrefix="JobGeography"
                        enumType={JobGeography}
                        formik={form} />
                    <BaseMultiSelect
                        className="col-md-3 z-2"
                        placeholder="TRANSMISSION_EXPERIENCE"
                        name="transmission_type"
                        labelPrefix="VehicleTransmissionType"
                        enumType={VehicleTransmissionType}
                        showNone
                        formik={form} />
                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="OWNER_OP_COMPANY_DRIVER"
                        name="is_owner_operator"
                        options={([{
                            label: t("OWNER_OPERATOR"),
                            value: 1
                        }, {
                            label: t("COMPANY_DRIVER"),
                            value: 0
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
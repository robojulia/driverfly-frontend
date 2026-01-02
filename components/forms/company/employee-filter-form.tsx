import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { EmployeeStatus } from "../../../enums/applicants/employee-status.enum";
import { JobGeography } from "../../../enums/jobs/job-geography.enum";
import { BooleanType } from "../../../enums/jotform/boolean-type.enum";
import { Status } from "../../../enums/status.enum";
import { DriverEndorsement } from "../../../enums/users/driver-endorsement.enum";
import { DriverLicenseType } from "../../../enums/users/driver-license-type.enum";
import { VehicleTransmissionType } from "../../../enums/vehicles/vehicle-transmission-type.enum";
import { useTranslation } from "../../../hooks/use-translation";
import { UserEntity } from "../../../models/user/user.entity";
import UserApi from "../../../pages/api/user";
import { useEffectAsync } from "../../../utils/react";
import stateList from "../../../utils/stateList";
import BaseInput from "../base-input";
import BaseMultiSelect from "../base-multiselect";
import BaseSelect from "../base-select";
import * as yup from "yup";

export interface EmployeeFilterDto {
    name?: string;
    endorsements?: string[];
    license_type?: string;
    status?: EmployeeStatus[];
    state?: string[];
    city?: string;
    years_cdl_experience?: number;
    preferred_location?: string[];
    transmission_type?: string[];
    is_owner_operator?: boolean;
    hireDateFrom?: string;
    hireDateTo?: string;
    birthdayThisWeek?: boolean;
}

export interface EmployeeFilterFormProps {
    onSearch?: (values: EmployeeFilterDto) => void;
    className?: string;
}

export default function EmployeeFilterForm({ className, onSearch }: EmployeeFilterFormProps) {
    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {} as EmployeeFilterDto,
        validationSchema: yup.object({}),
        onSubmit: async (values) => {
            onSearch({ ...values })
        },
        onReset: async () => {
            onSearch({})
        },
    });

    React.useEffect(() => {
        console.log("employee filter form.values", form.values);
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
                        placeholder="ENTER_EMPLOYEE_NAME"
                        formik={form}
                    />
                    <BaseMultiSelect
                        className="col-md-3 z-999  mt-1"
                        placeholder="SELECT_ENDORSEMENTS"
                        name="endorsements"
                        formik={form}
                        showNone
                        labelPrefix="DriverEndorsement"
                        enumType={DriverEndorsement} />

                    <BaseSelect
                        className="col-md-3 mt-1 mb-3"
                        placeholder="SELECT_CDL_TYPE"
                        name="license_type"
                        labelPrefix="DriverLicenseType"
                        enumType={DriverLicenseType}
                        formik={form}
                    />

                    <BaseMultiSelect
                        className="col-md-3 z-2  mt-1"
                        placeholder="SELECT_EMPLOYEE_STATUS"
                        name="status"
                        labelPrefix="EmployeeStatus"
                        hideOptions={[EmployeeStatus.DELETED]}
                        enumType={EmployeeStatus}
                        formik={form} />
                    <BaseMultiSelect
                        className="col-md-3  mt-1"
                        placeholder="SELECT_STATE"
                        name="state"
                        options={stateList}
                        formik={form}
                    />
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="city"
                        placeholder="ENTER_CITY"
                        displayPlaceholder
                        formik={form}
                    />
                    <BaseInput
                        className="col-md-3 mt-1 mb-3"
                        name="years_cdl_experience"
                        displayPlaceholder
                        placeholder="ENTER_YEARS_OF_CDL"
                        type='number'
                        formik={form}
                    />
                    <BaseMultiSelect
                        className="col-md-3 z-2  mt-1"
                        placeholder="SELECT_PREFERRED_LOCATION"
                        name="preferred_location"
                        labelPrefix="JobGeography"
                        enumType={JobGeography}
                        formik={form} />
                    <BaseMultiSelect
                        className="col-md-3 z-2 mt-1"
                        placeholder="SELECT_TRANSMISSION_EXPERIENCE"
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

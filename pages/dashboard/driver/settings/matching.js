import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import useAuth from "../../../../hooks/useAuth";
import { useTranslation } from "../../../../hooks/useTranslation";
import UserApi from "../../../api/user";
import { Row, Col, Button } from "react-bootstrap";
import PageLayout from "../../../../components/layouts/PageLayout";
import { UserPreferenceEntity } from "../../../../models/user/user-preference.entity"

import * as yup from "yup";
import { CommunicationMethod } from "../../../../enums/users/communication-method.enum";
import { UserPreferenceCategory } from "../../../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../../../enums/users/user-preferences-communication-label.enum";
import { SharePreference } from "../../../../enums/users/share-preference.enum";

import BaseCheck from "../../../../components/forms/BaseCheck";
import BaseCheckList from "../../../../components/forms/BaseCheckList";
import BaseSelect from "../../../../components/forms/BaseSelect";
import { UserPreferenceSharingLabel } from "../../../../enums/users/user-preference-sharing-label.enum";
import { UserPreferenceMatchingLabel } from "../../../../enums/users/user-preference-matching-label.enum";
import { JobGeography } from "../../../../enums/jobs/job-geography.enum";
import { JobSchedule } from "../../../../enums/jobs/job-schedule.enum";
import { JobEmploymentType } from "../../../../enums/jobs/job-employment-type.enum";
import { JobTeamDriver } from "../../../../enums/jobs/job-team-driver.enum";
import BaseInput from "../../../../components/forms/BaseInput";
import { preventNegative } from "../../../../utils/input";
import { JobPayMethod } from "../../../../enums/jobs/job-pay-method.enum";
import { JobBenefits } from "../../../../enums/jobs/job-benefits.enum";

export default function Matching() {
    const { authCheck } = useAuth();

    const { t } = useTranslation();

    const user = authCheck();

    const form = useFormik({
        initialValues: {
            geography: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.GEOGRAPHY,
                value: [],
            },
            schedule: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.SCHEDULE,
                value: [],
            },
            employment_type: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.EMPLOYMENT_TYPE,
                value: [],
            },
            team_drivers: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.TEAM_DRIVERS,
                value: [],
            },
            min_pay: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.MIN_PAY,
                value: 0,
            },
            pay_method: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.PAY_METHOD,
                value: [],
            },
            benefits: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.MATCHING,
                label: UserPreferenceMatchingLabel.BENEFITS,
                value: [],
            },
        },
        validationSchema: yup.object({
            geography: UserPreferenceEntity.yupSchema(),
            schedule: UserPreferenceEntity.yupSchema(),
            employment_type: UserPreferenceEntity.yupSchema(),
            team_drivers: UserPreferenceEntity.yupSchema(),
            min_pay: UserPreferenceEntity.yupSchema(),
            pay_method: UserPreferenceEntity.yupSchema(),
            benefits: UserPreferenceEntity.yupSchema(),
        }),
        onSubmit: async values => {
            const api = new UserApi();

            try {
                const preferences = await Promise.all(
                    Object
                        .entries(values)
                        .map(async ([key, preference]) => {
                            if (preference.value) {
                                if (preference.id) preference = await api.preferences.update(user.id, preference.id, preference);
                                else preference = await api.preferences.create(user.id, preference);
                            }
                            else if (preference.id) {
                                await api.preferences.remove(user.id, preference.id);
                                delete preference.id;
                            }

                            return preference;
                        })
                );
                populateForm(preferences);
                toast.success(t("successfully_saved_information"));
            } catch (e) {
                console.error("Unable to save preferences", e);
                toast.error(t("unable_to_save_information"));
            }
        }
    });

    useEffect(async () => {
        if (user && user.id) {
            const api = new UserApi();

            const preferences = await api.preferences.list(user.id, { category: UserPreferenceCategory.MATCHING });

            populateForm(preferences);
        }
    }, []);

    /**
     * 
     * @param {UserPreferenceEntity[]} preferences 
     */
    const populateForm = function (preferences) {
        preferences.forEach(v => {
            const label = v.label.toLowerCase();
            if (label in form.values) {
                form.initialValues[label] = v;
                form.setFieldValue(label, v);
            }
        });
    }


    return (<>
    <PageLayout title="JOB_MATCHING">
        <form onSubmit={form.handleSubmit}>
            <Row>
                <BaseCheckList
                    className="col-12 mt-3"
                    label="preferred_geography"
                    name="geography.value"
                    formik={form}
                    labelPrefix="JobGeography"
                    enumType={JobGeography}
                    />
                <BaseCheckList
                    className="col-12 mt-3"
                    label="preferred_schedule"
                    name="schedule.value"
                    cols={3}
                    formik={form}
                    labelPrefix="JobSchedule"
                    options={Object.keys(JobSchedule).filter(v => v != JobSchedule.OTHER).map(key => ({
                        value: key,
                        label: JobSchedule[key]
                    }))}
                    />
                <BaseCheckList
                    className="col-12 mt-3"
                    label="PREFERRED_EMPLOYMENT_TYPE"
                    name="employment_type.value"
                    cols={3}
                    formik={form}
                    labelPrefix="JobEmploymentType"
                    enumType={JobEmploymentType}
                    />
                <BaseCheckList
                    className="col-12 mt-3"
                    label="team_drivers"
                    name="team_drivers.value"
                    cols={3}
                    formik={form}
                    labelPrefix="JobTeamDriver"
                    enumType={JobTeamDriver}
                    />
                <BaseInput
                    className="col-12 mt-3"
                    label="preferred_min_pay_per_week"
                    name="min_pay.value"
                    type="number"
                    min="0"
                    formik={form}
                    onKeyDown={preventNegative}
                    />
                <BaseCheckList
                    className="col-12 mt-3"
                    label="preferred_pay_method"
                    name="pay_method.value"
                    cols={3}
                    formik={form}
                    labelPrefix="JobPayMethod"
                    enumType={JobPayMethod}
                    />
                <BaseCheckList
                    className="col-12 mt-3"
                    label="preferred_benefits"
                    name="benefits.value"
                    cols={3}
                    formik={form}
                    labelPrefix="JobBenefits"
                    options={Object.keys(JobBenefits).filter(v => v != JobBenefits.OTHER).map(key => ({
                        value: key,
                        label: JobBenefits[key]
                    }))}
                    />
            </Row>
            <Row className="mt-2">
                <Col className="text-end">
                    <Button type="submit" variant="primary" disabled={form.isSubmitting || !form.isValid || !form.dirty}>
                        {t("UPDATE")}
                    </Button>
                </Col>
            </Row>
        </form>
    </PageLayout>
    </>);
}

Matching.getLayout = function getLayout(page) {
    return (
      <FullLayout>
        {page}
      </FullLayout>
    )
  }
  
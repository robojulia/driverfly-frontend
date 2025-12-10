import { useFormik } from "formik";
import { useEffect } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import { useUnsavedChangesWarning } from "../../../../hooks/use-unsaved-changes-warning";
import UserApi from "../../../api/user";
import { Row, Col, Button } from "react-bootstrap";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { UserPreferenceEntity } from "../../../../models/user/user-preference.entity"

import * as yup from "yup";
import { CommunicationMethod } from "../../../../enums/users/communication-method.enum";
import { UserPreferenceCategory } from "../../../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../../../enums/users/user-preferences-communication-label.enum";
import BaseCheck from "../../../../components/forms/base-check";
import BaseCheckList from "../../../../components/forms/base-check-list";
import { useEffectAsync } from "../../../../utils/react";
import { UserPreferredHourDto } from "../../../../models/user/user-preferred-hour.dto";
import BaseInput from "../../../../components/forms/base-input";

export default function Communication() {
    const { user } = useAuth();

    const { t } = useTranslation();

    const form = useFormik({
        initialValues: {
            receive_driverfly: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.COMMUNICATION,
                label: UserPreferenceCommunicationLabel.RECEIVE_DRIVERFLY,
                value: false,
            } as UserPreferenceEntity,
            preferred_method: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.COMMUNICATION,
                label: UserPreferenceCommunicationLabel.PREFERRED_METHOD,
                value: []
            } as UserPreferenceEntity,
            receive_suggested_jobs: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.COMMUNICATION,
                label: UserPreferenceCommunicationLabel.RECEIVE_SUGGESTED_JOBS,
                value: false
            } as UserPreferenceEntity,
            receive_newsletter: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.COMMUNICATION,
                label: UserPreferenceCommunicationLabel.RECEIVE_NEWSLETTER,
                value: false
            } as UserPreferenceEntity,
            preferred_hours: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.COMMUNICATION,
                label: UserPreferenceCommunicationLabel.PREFERRED_HOURS,
                value: null
            } as UserPreferenceEntity,
        },
        validationSchema: yup.object({
            receive_driverfly: UserPreferenceEntity.yupSchema(),
            preferred_method: UserPreferenceEntity.yupSchema(),
            receive_suggested_jobs: UserPreferenceEntity.yupSchema(),
            receive_newsletter: UserPreferenceEntity.yupSchema(),
            preferred_hours: UserPreferenceEntity.yupSchema(),
        }),
        onSubmit: async values => {
            const api = new UserApi();

            try {
                const preferences = await Promise.all(
                    Object
                        .values(values)
                        .map(async (preference) => {
                            if (preference.value) {
                                console.log('preferences', preference);
                                if (preference.id) preference = await api.preferences.update(user.id, preference.id, preference);
                                else {
                                    preference = await api.preferences.create(user.id, preference);
                                } 
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
                // Reset dirty state after successful save
                const updatedValues = preferences.reduce((acc, pref) => {
                    const key = Object.keys(values).find(k => values[k].label === pref.label);
                    if (key) acc[key] = pref;
                    return acc;
                }, {} as typeof values);
                form.resetForm({ values: { ...values, ...updatedValues } });
            } catch (e) {
                console.error("Unable to save preferences", e);
                toast.error(t("unable_to_save_information"));
            }
        }
    });

    useEffectAsync(async () => {
        if (user) {
            const api = new UserApi();

            const preferences = await api.preferences.list(user.id, { category: UserPreferenceCategory.COMMUNICATION });

            populateForm(preferences);
        }
    }, [user]);

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

    const handlePreferredHourChange = ({ target: { value } }) => {

        form.setValues({
            ...form.values,
            preferred_hours: {
                ...form.values.preferred_hours,
                value: !!value ? new UserPreferredHourDto() : null
            }
        })
    }

    // Warn user about unsaved changes when navigating away
    const unsavedChangesWarning = useUnsavedChangesWarning({
        isDirty: form.dirty,
        shouldWarn: !form.isSubmitting,
    });

    return (<>
        {unsavedChangesWarning}
        <PageLayout title="COMMUNICATION">
            <form onSubmit={form.handleSubmit}>
                <Row>
                    <BaseCheck
                        className="col-12 mt-3"
                        label="communication_preferences_receive_driverfly"
                        name="receive_driverfly.value"
                        formik={form}
                    />
                    <BaseCheckList
                        className="col-12 mt-3"
                        name="preferred_method.value"
                        label="communication_preferences_preferred_method"
                        enumType={CommunicationMethod}
                        labelPrefix="CommunicationMethod"
                        formik={form}
                    />
                    <BaseCheck
                        className="col-12 mt-3"
                        label="receive_suggested_job_feeds"
                        name="receive_suggested_jobs.value"
                        formik={form}
                    />
                    <BaseCheck
                        className="col-12 mt-3"
                        label="receive_newsletters"
                        name="receive_newsletter.value"
                        formik={form}
                    />
                </Row>
                <Row className="my-3">
                    <BaseCheck
                        className="col-3 my-1"
                        label="PREFERRED_HOURS"
                        onChange={handlePreferredHourChange}
                        checked={form.values.preferred_hours.value}
                    />
                    {form.values.preferred_hours.value &&
                        <>
                            <BaseInput
                                className="col-md-4 mt-2"
                                name="preferred_hours.value.start"
                                type="time"
                                formik={form}
                            />
                            <BaseInput
                                className="col-md-4 mt-2"
                                name="preferred_hours.value.end"
                                type="time"
                                formik={form}
                            />
                        </>
                    }

                </Row>
                <Row className="mt-3">
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

Communication.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

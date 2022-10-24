import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { useAuth } from "../../../../hooks/use-auth";
import { useTranslation } from "../../../../hooks/use-translation";
import UserApi from "../../../api/user";
import { Row, Col, Button } from "react-bootstrap";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { UserPreferenceEntity } from "../../../../models/user/user-preference.entity"

import * as yup from "yup";
import { CommunicationMethod } from "../../../../enums/users/communication-method.enum";
import { UserPreferenceCategory } from "../../../../enums/users/user-preference-category.enum";
import { UserPreferenceCommunicationLabel } from "../../../../enums/users/user-preferences-communication-label.enum";
import { SharePreference } from "../../../../enums/users/share-preference.enum";

import BaseCheck from "../../../../components/forms/base-check";
import BaseCheckList from "../../../../components/forms/base-check-list";
import BaseSelect from "../../../../components/forms/base-select";
import { UserPreferenceSharingLabel } from "../../../../enums/users/user-preference-sharing-label.enum";
import { useEffectAsync } from "../../../../utils/react";
import ViewModal from "../../../../components/view-details/view-modal";

export default function Sharing() {
    const { getUser } = useAuth();

    const { t } = useTranslation();

    const user = getUser();
    const [sharingValue, setsharingValue] = useState<{
        name: string, value: string, label: string
    }>({
        name: '', value: '', label: ''
    });
    const clearSharingValue = (): void => setsharingValue({ name: '', value: '', label: '' })

    const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
    const openConfirmationModal = (): void => setShowConfirmationModal(true)
    const closeConfirmationModal = (): void => setShowConfirmationModal(false)

    const form = useFormik({
        initialValues: {
            mvr: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.SHARING,
                label: UserPreferenceSharingLabel.MVR,
                value: SharePreference.NEVER,
            } as UserPreferenceEntity,
            drivers_license: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.SHARING,
                label: UserPreferenceSharingLabel.DRIVERS_LICENSE,
                value: SharePreference.NEVER,
            } as UserPreferenceEntity,
            medical_card: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.SHARING,
                label: UserPreferenceSharingLabel.MEDICAL_CARD,
                value: SharePreference.NEVER,
            } as UserPreferenceEntity,
            employment_history: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.SHARING,
                label: UserPreferenceSharingLabel.EMPLOYMENT_HISTORY,
                value: SharePreference.NEVER,
            } as UserPreferenceEntity,
            physical: {
                ...new UserPreferenceEntity(),
                category: UserPreferenceCategory.SHARING,
                label: UserPreferenceSharingLabel.PHYSICAL,
                value: SharePreference.NEVER,
            },
        },
        validationSchema: yup.object({
            mvr: UserPreferenceEntity.yupSchema(),
            drivers_license: UserPreferenceEntity.yupSchema(),
            medical_card: UserPreferenceEntity.yupSchema(),
            employment_history: UserPreferenceEntity.yupSchema(),
            physical: UserPreferenceEntity.yupSchema(),
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

    useEffectAsync(async () => {
        if (user) {
            const api = new UserApi();

            const preferences = await api.preferences.list(user.id, { category: UserPreferenceCategory.SHARING });

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

    const onChangeSharePreference = ({ target: { name, value } }): void => {
        if (!!!name || !!!value) return

        const label_name = name.split('.')[0] || ''
        const label = t(`UserPreferenceSharingLabel.${form.values[label_name]?.label}`)

        if (value === SharePreference.ALWAYS) {
            setsharingValue({ name, value, label })
            openConfirmationModal()
        } else {
            form.setFieldValue(name, value);
        }
    }

    const handleCloseClick = (): void => {
        clearSharingValue()
        closeConfirmationModal()
    }

    const handleConfirmClick = (): void => {
        (sharingValue.name && sharingValue.value) && form.setFieldValue(sharingValue.name, sharingValue.value);
        handleCloseClick()
    }

    return (<>
        <PageLayout title="SHARING">
            <form onSubmit={form.handleSubmit}>
                <Row>
                    <BaseSelect
                        className="col-6 mt-3"
                        label="share_my_mvr"
                        name="mvr.value"
                        formik={form}
                        labelPrefix="SharePreference"
                        enumType={SharePreference}
                        onChange={onChangeSharePreference}
                    />
                    <BaseSelect
                        className="col-6 mt-3"
                        label="share_my_drivers_license"
                        name="drivers_license.value"
                        formik={form}
                        labelPrefix="SharePreference"
                        enumType={SharePreference}
                        onChange={onChangeSharePreference}
                    />
                    <BaseSelect
                        className="col-6 mt-3"
                        label="share_my_medical_card"
                        name="medical_card.value"
                        formik={form}
                        labelPrefix="SharePreference"
                        enumType={SharePreference}
                        onChange={onChangeSharePreference}
                    />
                    <BaseSelect
                        className="col-6 mt-3"
                        label="SHARE_PAST_EMPLOYMENT"
                        name="employment_history.value"
                        formik={form}
                        labelPrefix="SharePreference"
                        enumType={SharePreference}
                        onChange={onChangeSharePreference}
                    />
                    <BaseSelect
                        className="col-6 mt-3"
                        label="SHARE_MY_PHYSICALS"
                        name="physical.value"
                        formik={form}
                        labelPrefix="SharePreference"
                        enumType={SharePreference}
                        onChange={onChangeSharePreference}
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
            <ViewModal
                show={showConfirmationModal}
                closeText="CANCEL"
                onCloseClick={handleCloseClick}
                title="CONFIRMATION"
                footer=
                {
                    <>
                        <button type="button" className="btn btn-primary w-100 p-lg-3 p-5 mx-2" onClick={handleConfirmClick}>{t('CONFIRM')}</button>
                        <p className="text-center text-danger w-100">{t("NOTE_YOU_CAN_CHANGE_BACK_IN_FUTURE")}</p>
                    </>
                }
            >
                <p className="m-3">
                    {t('SHARING_CONFIRMATION_TEXT_{label}', { label: sharingValue.label }, { translateProps: true })}
                </p>
            </ViewModal>
        </PageLayout>
    </>);
}

Sharing.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

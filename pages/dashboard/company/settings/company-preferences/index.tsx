import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../../components/layouts/page/page-layout";
import { useAuth } from '../../../../../hooks/use-auth';
import { useTranslation } from "../../../../../hooks/use-translation";
import BaseClickToCopyInput from '../../../../../components/forms/base-click-to-copy-input';
import { DriverLicenseType } from "../../../../../enums/users/driver-license-type.enum";
import BaseCheckList from "../../../../../components/forms/base-check-list";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { globalAjaxExceptionHandler } from "../../../../../utils/ajax";
import { ArrowRight } from "react-bootstrap-icons";
import { useEffectAsync } from "../../../../../utils/react";
import { Button } from "react-bootstrap";
import { CompanyPreferencesEntity } from "../../../../../models/contact/company-preferences.entity";
import CompanyPreferencesApi from "../../../../api/company-preferences";

export default function CompanyPreference() {
    const { user } = useAuth();

    const { t } = useTranslation();
    const contactApi = new CompanyPreferencesApi();

    const form = useFormik({
        initialValues: new CompanyPreferencesEntity(),
        validationSchema: CompanyPreferencesEntity.yupSchema(),
        onSubmit: async (dto) => {
            try {
                await contactApi.jotformPreferences(dto);
                toast.success(t("successfully_saved_information"));
            }
            catch (e) {
                globalAjaxExceptionHandler(e, { formik: form, toast: toast, t: t, defaultMessage: "UNABLE_TO_SEND_ME" });
            }
        }
    });
    //  Uncomment this in debugging mode
    useEffectAsync(async () => {
        console.log("form", form.values)
        console.log("form", form.errors)
    }, [form])
    return (
        <PageLayout
            title="COMPANY_PREFERENCE"
        >
            <>
                <form onSubmit={form.handleSubmit}>
                    <BaseClickToCopyInput
                        label="JOTFORM_URL"
                        name="jotform_url"
                        className="my-2"
                        value={`${process.env.FRONTEND_BASE_URL ?? ""}form/jotform/${user?.company?.id}`}
                        tooltipText={t('CLICK_TO_COPY')}
                    />
                    <BaseCheckList
                        className="col-12 p-0 mt-4"
                        label="CDL_CLASS"
                        name="cdl_class"
                        labelPrefix="DriverLicenseType"
                        required
                        enumType={DriverLicenseType}
                        formik={form}
                    />
                    <Button disabled={form.isSubmitting || !form.isValid || !form.dirty}
                        type="submit"
                        className="mt-3 float-right">
                        {t("submit")} <ArrowRight />
                    </Button>
                </form>

            </>
        </PageLayout>
    )
};

CompanyPreference.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

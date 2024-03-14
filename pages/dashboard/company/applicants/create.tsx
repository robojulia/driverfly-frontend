import { useRouter } from "next/router";
import { ApplicantForm } from "../../../../components/forms/company/applicant-form";

import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";

import { useTranslation } from "../../../../hooks/use-translation";

export default function CreateApplicant() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/applicants";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("ADD_{name}", { name: "APPLICANT" }, { translateProps: true })}
            backPath={backPath}
            >
            <ApplicantForm
                onSaveComplete={goBack}
                />
        </ChildPageLayout>
    );
}

CreateApplicant.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
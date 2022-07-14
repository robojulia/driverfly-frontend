import { useRouter } from "next/router";
import { ApplicantForm } from "../../../../components/forms/company/ApplicantForm";

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";

import { useTranslation } from "../../../../hooks/useTranslation";

export default function CreateApplicant() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/applicants";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "APPLICANT" }, { translateProps: true })}
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
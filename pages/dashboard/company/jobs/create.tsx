import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/useTranslation";

import FullLayout from "../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../components/layouts/ChildPageLayout";
import { JobForm } from "../../../../components/forms/company/JobForm";

export default function CreateJob() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/jobs";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
            backPath={backPath}
            >
            <JobForm
                onSaveComplete={goBack}
                />
        </ChildPageLayout>
    );
}

CreateJob.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
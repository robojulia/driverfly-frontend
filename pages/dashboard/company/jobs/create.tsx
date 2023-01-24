import { useRouter } from "next/router";
import { useTranslation } from "../../../../hooks/use-translation";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import { JobForm } from "../../../../components/forms/company/job-form";

export default function CreateJob() {
    const router = useRouter();
    const { t } = useTranslation();

    const nextPath = "/dashboard/company/jobs/thank-you";

    const goBack = () => window.setTimeout(() => router.push(nextPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "JOB" }, { translateProps: true })}
            backPath={nextPath}
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
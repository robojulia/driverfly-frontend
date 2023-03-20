import { useRouter } from "next/router";
import FullLayout from "../../../../../components/dashboard/layouts/layout/full-layout";
import ChildPageLayout from "../../../../../components/layouts/page/child-page-layout";
import { useTranslation } from "../../../../../hooks/use-translation";
import { ManagerForm } from "../../../../../components/forms/company/manager-form";

export default function CreateUser() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/settings/managers";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "MANAGER" }, { translateProps: true })}
            backPath={backPath}
        >
            <ManagerForm
                onSaveComplete={goBack}
            />
        </ChildPageLayout>
    );
}

CreateUser.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
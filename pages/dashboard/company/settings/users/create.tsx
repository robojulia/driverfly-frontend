import { useRouter } from "next/router";
import { UserForm } from "../../../../../components/forms/company/UserForm";

import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";

import { useTranslation } from "../../../../../hooks/useTranslation";

export default function CreateUser() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/settings/users";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "USER" }, { translateProps: true })}
            backPath={backPath}
            >
            <UserForm
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
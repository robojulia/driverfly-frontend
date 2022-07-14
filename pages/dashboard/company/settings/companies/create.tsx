import { useRouter } from "next/router";
import { useTranslation } from "../../../../../hooks/useTranslation";

import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";
import { CompanyForm } from "../../../../../components/forms/company/CompanyForm";
import { useAuth } from "../../../../../hooks/useAuth";
import { CompanyEntity } from "../../../../../models/company/company.entity";

export default function CreateCompany() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/settings/companies";

    const { refreshToken } = useAuth();

    async function onSaveComplete(e: CompanyEntity) {
        await refreshToken();
        window.setTimeout(() => router.push(backPath), 2000);
    }

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "COMPANY" }, { translateProps: true })}
            backPath={backPath}
            >
            <CompanyForm
                onSaveComplete={onSaveComplete}
                />
        </ChildPageLayout>
    );
}

CreateCompany.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
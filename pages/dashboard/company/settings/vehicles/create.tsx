import { useRouter } from "next/router";
import { useTranslation } from "../../../../../hooks/useTranslation";

import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";
import { VehicleForm } from "../../../../../components/forms/company/VehicleForm";

export default function CreateVehicle() {
    const router = useRouter();
    const { t } = useTranslation();

    const backPath = "/dashboard/company/settings/vehicles";

    const goBack = () => window.setTimeout(() => router.push(backPath), 2000);

    return (
        <ChildPageLayout
            title={t("CREATE_{name}", { name: "VEHICLE" }, { translateProps: true })}
            backPath={backPath}
            >
            <VehicleForm
                onSaveComplete={goBack}
                />
        </ChildPageLayout>
    );
}

CreateVehicle.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
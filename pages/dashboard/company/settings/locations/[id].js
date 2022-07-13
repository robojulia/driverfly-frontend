import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useTranslation } from "../../../../../hooks/useTranslation";

import { useRouter } from "next/router"

import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";
import { LocationForm } from "../../../../../components/forms/company/LocationForm";

export default function Location() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/locations";

    if (isNaN(parseInt(id))) id = null; // create mode

    const { t } = useTranslation();

    const goBack = () => {
        setTimeout(
            () => {
                router.push(backPath);

            },
            3000);
    }

    return (
    <ChildPageLayout
        title={id ? "EDIT_LOCATION" : "CREATE_LOCATION"}
        backPath={backPath}
        >
        <LocationForm
            id={id}
            onSaveComplete={goBack}
            onLoadError={goBack}
            />
    </ChildPageLayout>
    );
};

Location.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

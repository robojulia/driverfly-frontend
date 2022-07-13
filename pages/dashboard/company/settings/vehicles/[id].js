import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import { useRouter } from "next/router"

import { VehicleForm } from "../../../../../components/forms/company/VehicleForm";
import ChildPageLayout from "../../../../../components/layouts/ChildPageLayout";

export default function Vehicle() {
    const router = useRouter();

    let { id } = router.query;

    const backPath = "/dashboard/company/settings/vehicles";

    if (isNaN(parseInt(id))) id = null; // create mode

    const goBack = () => {
        setTimeout(
            () => {
                router.push(backPath);

            },
            3000);
    }

  return (
    <>
        <ChildPageLayout
            title={id ? "EDIT_VEHICLE" : "CREATE_VEHICLE"}
            backPath={backPath}
            >
          <VehicleForm
            id={id}
            onSaveComplete={goBack}
            onLoadError={goBack}
            />
        </ChildPageLayout>
    </>
  )
};

Vehicle.getLayout = function getLayout(page) {
  return (
    <FullLayout>
      {page}
    </FullLayout>
  )
}

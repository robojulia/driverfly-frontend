import ChildPageLayout from "../../../../../components/layouts/page/ChildPageLayout";
import FullLayout from "../../../../../components/dashboard/layouts/Layout/FullLayout";
import ImportApplicants from "../../../../../components/dashboard/import-applicants";

export default function Import() {

    return (<>
        <ChildPageLayout title="IMPORT_APPLICANTS" backPath="/dashboard/company/compliance/employee-directory">
            <ImportApplicants />
        </ChildPageLayout>
    </>);
}
Import.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

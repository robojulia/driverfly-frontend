import ChildPageLayout from "../../../../components/layouts/page/child-page-layout";
import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import ImportApplicants from "../../../../components/dashboard/import-applicants";

export default function Import() {

    return (<>
        <ChildPageLayout title="IMPORT_APPLICANTS" backPath="/dashboard/company/applicants">
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

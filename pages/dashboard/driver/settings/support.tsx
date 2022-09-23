
import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import PageLayout from "../../../../components/layouts/page/PageLayout";
import Supports from "../../../../components/support";


export default function Support() {

    return (
        <PageLayout title="SUPPORT">
            < Supports />
        </PageLayout>
    )
};

Support.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

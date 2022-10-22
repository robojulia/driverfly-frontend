import FullLayout from "../../../../components/dashboard/layouts/layout/full-layout";
import PageLayout from "../../../../components/layouts/page/page-layout";
import Supports from "../../../../components/support";

export default function Support() {

    return (
        <PageLayout
            title="SUPPORT"
        >
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

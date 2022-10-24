import FullLayout from "../../../components/dashboard/layouts/full-layout";
import FreeResources from "../../../components/free-resources";
import PageLayout from '../../../components/layouts/page/page-layout';


export default function DriverFreeResources() {
    return (
        <PageLayout
            title="FREE_RESOURCES"
        >
            <FreeResources />

        </PageLayout>
    )
};

DriverFreeResources.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}

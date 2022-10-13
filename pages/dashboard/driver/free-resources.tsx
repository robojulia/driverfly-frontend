import FullLayout from "../../../components/dashboard/layouts/FullLayout";
import FreeResources from "../../../components/free-resources";
import PageLayout from '../../../components/layouts/page/PageLayout';


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

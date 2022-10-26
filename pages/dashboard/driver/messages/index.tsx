import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Messenger } from "../../../../components/messenger/messenger";

export default function Messages() {

    const { t } = useTranslation();

    return (
        <PageLayout
            title="MESSAGES"
            >
            <Messenger
                />
        </PageLayout>
    )
};

Messages.getLayout = function getLayout(page) {
    return (
        <FullLayout>
            {page}
        </FullLayout>
    )
}
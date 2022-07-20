import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import { useTranslation } from '../../../../hooks/useTranslation';
import PageLayout from "../../../../components/layouts/page/PageLayout";
import { Messenger } from "../../../../components/messenger/messenger";

export default function Messages() {

    const { t } = useTranslation();

    return (
        <PageLayout
            title="MESSAGES"
            >
            <Messenger
                // getOptions={getOptions}
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
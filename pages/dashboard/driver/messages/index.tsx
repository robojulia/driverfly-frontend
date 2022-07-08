import FullLayout from "../../../../components/dashboard/layouts/FullLayout";
import useRedirect from '../../../../hooks/useRedirect';
import { useTranslation } from '../../../../hooks/useTranslation';
import PageLayout from "../../../../components/layouts/PageLayout";
import { Messenger } from "../../../../components/messenger/messenger";

export default function Messages() {

    const { t } = useTranslation();
    const { authDriver } = useRedirect();
    authDriver()

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
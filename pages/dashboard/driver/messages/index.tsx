import FullLayout from "../../../../components/dashboard/layouts/full-layout";
import { useTranslation } from "../../../../hooks/use-translation";
import PageLayout from "../../../../components/layouts/page/page-layout";
import { Messenger } from "../../../../components/messenger/messenger";
import { NextPageContext } from "next";

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

export async function getServerSideProps({ query }: NextPageContext) {
    try {
        return { notFound: true };

    } catch (error) {
        console.error(`Messages: Exception when attempting to fetch details for companyId: ${query?.companyId}`, error);
        return { notFound: true }
    }
}

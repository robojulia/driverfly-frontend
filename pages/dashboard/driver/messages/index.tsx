import { CancelTokenSource } from 'axios';
import FullLayout from '../../../../components/dashboard/layouts/full-layout';
import { useTranslation } from '../../../../hooks/use-translation';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { Messenger } from '../../../../components/messenger/messenger';
import { NextPageContext } from 'next';
import { ChattableType } from '../../../../enums/conversation/chattable-type.enum';

export default function Messages() {
  const { t } = useTranslation();

  // For drivers, they might want to message company representatives
  // This is a placeholder implementation - adjust based on your business needs
  const getOptions = async (query: string, cancellationToken: CancelTokenSource) => {
    if (!query || query.length < 3) {
      return [];
    }

    // For now, return empty array since drivers typically receive messages
    // rather than initiate them, but this can be expanded based on requirements
    return [];
  };

  return (
    <PageLayout title="MESSAGES">
      <Messenger getOptions={getOptions} />
    </PageLayout>
  );
}

Messages.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

export async function getServerSideProps({ query }: NextPageContext) {
  try {
    return { notFound: true };
  } catch (error) {
    console.error(
      `Messages: Exception when attempting to fetch details for companyId: ${query?.companyId}`,
      error
    );
    return { notFound: true };
  }
}

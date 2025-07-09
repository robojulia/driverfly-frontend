import { CancelTokenSource } from 'axios';
import FullLayout from '../../../../components/dashboard/layouts/layout/full-layout';
import PageLayout from '../../../../components/layouts/page/page-layout';
import { Messenger } from '../../../../components/messenger/messenger';
import { useTranslation } from '../../../../hooks/use-translation';
import ApplicantApi from '../../../../pages/api/applicant';
import { ChattableType } from '../../../../enums/conversation/chattable-type.enum';

export default function MessageList() {
  const applicantApi = new ApplicantApi();

  // Format phone number utility
  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const getOptions = async (query: string, cancellationToken: CancelTokenSource) => {
    if (!query || query.length < 3) {
      return [];
    }

    try {
      const response = await applicantApi.searchLite({
        search: query,
        limit: 20,
      });

      return response.applicants.map((applicant) => ({
        text: `${applicant.fullName || `${applicant.firstName} ${applicant.lastName}`}${
          applicant.phone ? ` ${formatPhoneNumber(applicant.phone)}` : ''
        } (Applicant)`,
        value: {
          chattable_type: ChattableType.APPLICANT,
          chattable_id: applicant.id,
          chattable_name: applicant.fullName || `${applicant.firstName} ${applicant.lastName}`,
        },
      }));
    } catch (error) {
      console.error('Error searching applicants:', error);
      return [];
    }
  };

  return (
    <PageLayout title="SMS_MESSAGES">
      <Messenger getOptions={getOptions} />
    </PageLayout>
  );
}

MessageList.getLayout = function getLayout(page) {
  return <FullLayout>{page}</FullLayout>;
};

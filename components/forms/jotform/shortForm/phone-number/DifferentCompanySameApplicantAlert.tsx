import { Alert } from 'react-bootstrap';
import { useTranslation } from '../../../../../hooks/use-translation';
import { PrimaryButton, SecondaryButton } from '../../form-buttons';

interface DifferentCompanySameApplicantAlertProps {
  scenario: any;
  mostRecentCompanyName: string;
  onPrefillYes: () => void;
  onPrefillNo: () => void;
}

export function DifferentCompanySameApplicantAlert({
  scenario,
  mostRecentCompanyName,
  onPrefillYes,
  onPrefillNo,
}: DifferentCompanySameApplicantAlertProps) {
  const { t } = useTranslation();

  return (
    <Alert variant="info" className="my-3">
      <Alert.Heading>{t('Previous Application Found')}</Alert.Heading>
      <p>
        {t('You recently applied to')} <strong>{mostRecentCompanyName}</strong>{' '}
        {t(
          'would you like to prefill this application with that data? You will be able to review and update afterwards!'
        )}
      </p>
      <div className="d-flex gap-2 mt-3">
        <PrimaryButton onClick={onPrefillYes}>{t('Yes, prefill my application')}</PrimaryButton>
        <SecondaryButton onClick={onPrefillNo}>{t('No, start fresh')}</SecondaryButton>
      </div>
    </Alert>
  );
}

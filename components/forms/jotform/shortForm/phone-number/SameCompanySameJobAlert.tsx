import { Alert } from 'react-bootstrap';
import { useTranslation } from '../../../../../hooks/use-translation';

interface SameCompanySameJobAlertProps {
  scenario: any;
  onTryAnyway: () => void;
}

export function SameCompanySameJobAlert({ scenario, onTryAnyway }: SameCompanySameJobAlertProps) {
  const { t } = useTranslation();

  return (
    <Alert variant="warning" className="my-3">
      <Alert.Heading>{t('You have already applied for this job!')}</Alert.Heading>
      <p>
        {t('You have already applied for this position at')} <strong>{scenario.companyName}</strong>
        . {t('Each applicant can only apply for the same job once.')}{' '}
        <a href="#" onClick={onTryAnyway}>
          {t('Try anyway')}
        </a>
      </p>
    </Alert>
  );
}

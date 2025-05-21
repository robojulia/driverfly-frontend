import { useTranslation } from '../../../hooks/use-translation';
import { InspectionFrequency } from '../../../enums/vehicles/inspection-frequency.enum';
import { format, addMonths, addYears } from 'date-fns';
import { Alert } from 'react-bootstrap';
import { Calendar2Check } from 'react-bootstrap-icons';

interface NextInspectionExampleProps {
  selectedFrequency?: InspectionFrequency;
}

export default function NextInspectionExample({ selectedFrequency }: NextInspectionExampleProps) {
  const { t } = useTranslation();
  const today = new Date();

  const getNextInspectionDate = () => {
    switch (selectedFrequency) {
      case InspectionFrequency.MONTH:
        return format(addMonths(today, 1), 'MMMM yyyy');
      case InspectionFrequency.QUARTER:
        return format(addMonths(today, 3), 'MMMM yyyy');
      case InspectionFrequency.ANNUAL:
        return format(addYears(today, 1), 'MMMM yyyy');
      default:
        return null;
    }
  };

  const nextDate = getNextInspectionDate();

  if (!selectedFrequency) {
    return (
      <Alert variant="light" className="d-flex align-items-center gap-2 mt-2">
        <Calendar2Check size={20} className="text-muted" />
        <span className="text-muted">
          {t('Select an inspection frequency to see when the next inspection would be scheduled.')}
        </span>
      </Alert>
    );
  }

  return (
    <Alert variant="info" className="d-flex align-items-center gap-2 mt-2">
      <Calendar2Check size={20} />
      <div>
        <strong>{t('Example:')}</strong>{' '}
        {t('If you complete an inspection today, the next inspection would be scheduled for')}{' '}
        <strong>end of {nextDate}</strong>.
      </div>
    </Alert>
  );
}

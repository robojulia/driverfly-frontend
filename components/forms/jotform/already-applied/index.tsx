import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';

export function AlreadyAppliedPage() {
  const { t } = useTranslation();
  return (
    <>
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>
        {t('ALREADY_APPLIED')}
      </h1>
    </>
  );
}

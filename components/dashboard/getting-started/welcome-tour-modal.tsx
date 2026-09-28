import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Briefcase, ListCheck, People, ShieldCheck, Stars } from 'react-bootstrap-icons';
import { useTranslation } from '../../../hooks/use-translation';
import styles from './getting-started.module.css';

type WelcomeTourModalProps = {
  show: boolean;
  userName?: string;
  // dismissed partway through (close button, "Skip", Escape)
  onClose: () => void;
  // reached the last step and chose to get started
  onFinish: () => void;
};

const FEATURES = [
  { key: 'RECRUIT', icon: Briefcase },
  { key: 'COMPLIANCE', icon: ShieldCheck },
  { key: 'TEAM', icon: People },
];

const STEP_COUNT = 3;

export function WelcomeTourModal({ show, userName, onClose, onFinish }: WelcomeTourModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) setStep(0);
  }, [show]);

  const isLast = step === STEP_COUNT - 1;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      aria-labelledby="welcome-tour-title"
      contentClassName={styles.tourContent}
    >
      <Modal.Header closeButton className={styles.tourHeader} />
      <Modal.Body className={styles.tourBody}>
        {step === 0 && (
          <div className={styles.tourStep}>
            <span className={styles.tourBadge} aria-hidden="true">
              <Stars size={32} />
            </span>
            <h2 id="welcome-tour-title" className={styles.tourTitle}>
              {userName
                ? t('WELCOME_TO_DRIVERFLY', { name: userName })
                : t('GETTING_STARTED_WELCOME_TITLE')}
            </h2>
            <p className={styles.tourText}>{t('GETTING_STARTED_WELCOME_TEXT')}</p>
          </div>
        )}

        {step === 1 && (
          <div className={styles.tourStep}>
            <h2 id="welcome-tour-title" className={styles.tourTitle}>
              {t('GETTING_STARTED_FEATURES_TITLE')}
            </h2>
            <ul className={styles.features}>
              {FEATURES.map(({ key, icon: FeatureIcon }) => (
                <li key={key} className={styles.feature}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <FeatureIcon size={22} />
                  </span>
                  <span>
                    <strong>{t(`GETTING_STARTED_FEATURE_${key}`)}</strong>
                    <span className={styles.featureText}>
                      {t(`GETTING_STARTED_FEATURE_${key}_TEXT`)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {step === 2 && (
          <div className={styles.tourStep}>
            <span className={styles.tourBadge} aria-hidden="true">
              <ListCheck size={32} />
            </span>
            <h2 id="welcome-tour-title" className={styles.tourTitle}>
              {t('GETTING_STARTED_CHECKLIST_TITLE')}
            </h2>
            <p className={styles.tourText}>{t('GETTING_STARTED_CHECKLIST_TEXT')}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className={styles.tourFooter}>
        <div
          className={styles.dots}
          aria-label={t('GETTING_STARTED_STEP', { step: step + 1, total: STEP_COUNT })}
        >
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <span key={i} className={`${styles.dot} ${i === step ? styles.dotActive : ''}`} />
          ))}
        </div>
        <div className={styles.tourButtons}>
          {step === 0 ? (
            <Button variant="link" className={styles.linkBtn} onClick={onClose}>
              {t('GETTING_STARTED_SKIP')}
            </Button>
          ) : (
            <Button variant="outline-secondary" onClick={() => setStep(step - 1)}>
              {t('BACK')}
            </Button>
          )}
          <Button
            className={styles.primaryBtn}
            onClick={() => (isLast ? onFinish() : setStep(step + 1))}
          >
            {isLast ? t('GETTING_STARTED_LETS_GO') : t('NEXT')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

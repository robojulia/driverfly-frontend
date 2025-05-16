import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from '../../../../hooks/use-translation';
import styles from '../../../../styles/digitalhiringapp.module.css';
import JotformContext from '../../../../context/jotform-context';
import { JotFormContextType } from '../../../../context/jotform-context';

export function ThankyouPage() {
  const {
    state: { company },
  }: JotFormContextType = useContext(JotformContext);
  const { t } = useTranslation();
  useEffect(() => {
    toast.success(t('successfully_saved_information'));
  }, []);
  return (
    <>
      <ToastContainer />
      <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t('THANK_YOU')}</h1>

      <p className={styles.paragraph}>
        {company
          ? t('DHA_THANK_YOU_MESSAGE', { company: company.name })
          : t('DHA_THANK_YOU_MESSAGE_CLOSE')}
      </p>
      {company && <p className={styles.paragraph}>{t('DHA_THANK_YOU_MESSAGE_CLOSE')}</p>}
      <div className="d-flex justify-content-center">
        <Link href="/signup">
          <a className="btn btn-primary">{t('SIGN_UP')}</a>
        </Link>
      </div>
    </>
  );
}

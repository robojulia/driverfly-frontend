import Link from "next/link";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useTranslation } from "../../../../hooks/use-translation";
import styles from "../../../../styles/digitalhiringapp.module.css";

export function ThankyouPage() {
    const { t } = useTranslation();
    useEffect(() => {
        toast.success(t("successfully_saved_information"))
    }, [])
    return (

        <>
            <ToastContainer />
		    <h1 className={`${styles.carrierName} ${styles.jot_form_headers_font}`}>{t("THANK_YOU")}</h1>

            {/* <h6 className={styles.paragraph}>{t("SUBMITTED_YOUR_FORM")}</h6> */}
            <p className={styles.paragraph}>
                {t('GET_REGISTERED_MESSAGE')}
                <Link href="/signup">
                    <a className='ml-1 primary '>{t("SIGN_UP")}</a>
                </Link>
            </p>
        </>
    );
}

import styles from "../../../../styles/digitalhiringapp.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Link from "next/link";

export function ThankyouPage() {
    const { t } = useTranslation();
    useEffect(() => {
        toast.success(t("successfully_saved_information"))
    }, [])
    return (

        <>
            <ToastContainer />
            <h4 className={styles.carrierName}>{t("THANK_YOU")}</h4>
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

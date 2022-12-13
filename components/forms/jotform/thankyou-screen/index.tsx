import styles from "../../../../styles/jotform.module.css";
import { useTranslation } from "../../../../hooks/use-translation";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export function ThankyouPage() {
    const { t } = useTranslation();
    useEffect(() => {
        toast.success(t("successfully_saved_information"))
    }, [])
    return (

        <>
            <ToastContainer />
            <h4 className={styles.Application}>{t("THANK_YOU")}</h4>
            <h6 className={styles.paragraph}>{t("SUBMITTED_YOUR_FORM")}</h6>

        </>
    );
}

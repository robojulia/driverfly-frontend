import Link from "next/link";
import { useTranslation } from "../../hooks/useTranslation";


export default function Signup(props) {
    const { t } = useTranslation();
    return (
        <>
            <Link href="/signup">
                <button type="button" className={props.className}>{t("SIGN_UP")}</button>
            </Link>
        </>
    )
}
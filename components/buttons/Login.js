import Link from "next/link";
import { useTranslation } from "../../hooks/useTranslation";



export default function Login(props) {
    const { t } = useTranslation();
    return (
        <>
            <Link href="/login">
                <button type="button" className={props.className}>  {t("LOGIN")}</button>
            </Link>
        </>
    )
}
import Link from "next/link";
import { useTranslation } from "../../../../hooks/use-translation";
export default function CopyRight() {

    const { t } = useTranslation();

    return (
        <>
            <div className="copy-text">© {new Date().getFullYear()} {t("DRIVERFLY_ALL_RIGHTS_RESERVED")}</div>
        </>
    )
}
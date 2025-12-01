import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";
export default function CopyRight() {

    const { t } = useTranslation();

    return (
        <>
            <div className="copy-text">© {new Date().getFullYear()}{t("DRIVERFLY_ALL_RIGHTS_RESERVED")}</div>
            <ul id="menu-copyright" className="menu d-flex align-items-center">
                <li id="menu-item-4034" className="menu-item mr-4"><a href="#">{t("SITE_MAP")}</a></li>
                <li id="menu-item-4033" className="menu-item mr-4">
                    <Link href="/terms-and-policies">
                        <a>{t("TERMS_AND_POLICIES")}</a>
                    </Link>
                </li>
                <li id="menu-item-4035" className="menu-item">
                    <Link href="/privacy-policy">
                        <a>{t("PRIVACY_POLICY")}</a>
                    </Link>
                </li>
            </ul>

        </>
    )
}
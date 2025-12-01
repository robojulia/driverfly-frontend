import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

export default function QuickLinks() {

    const { t } = useTranslation();

    return (
        <>
            <div className="footer-inner">
                <h3 className="widget-title font-weight-normal">{t("QUICK_LINKS")}</h3>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" >{t("LOGIN")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/faq">
                            <a className="nav-link" >{t("FAQ")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://driverfly.co/blog">
                            <a className="nav-link" target="_blank">Blog</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/contact">
                            <a className="nav-link" >{t("CONTACT")}</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
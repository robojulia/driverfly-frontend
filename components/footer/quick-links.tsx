import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

export default function QuickLinks() {

    const { t } = useTranslation();

    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">{t("QUICK_LINKS")}</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" >{t("LOGIN")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://ctrecruiting.com/">
                            <a target="_blank" className="nav-link" >{t("DRIVER_RECRUITING")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">{t("FEATURED_EMPLOYERS")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/faq">
                            <a className="nav-link" >{t("FAQ")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://blog.driverfly.co/">
                            <a className="nav-link" target="_blank">{t("THE_DRIVERFLY_ON_THE_WALL_BLOG")}</a>
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
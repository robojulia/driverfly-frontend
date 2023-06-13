import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

export default function ForDrivers() {

    const { t } = useTranslation();

    return (
        <>
            <div className="footer-inner pl-lg-4 pl-0">
                <h2 className="widget-title font-weight-normal">{t("FOR_DRIVERS")}</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link">{t("MY_DASHBOARD")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/find-jobs">
                            <a className="nav-link">{t("SEARCH_JOBS")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link">{t("MY_RESUME")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link">{t("MESSAGES")}</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

export default function ForDrivers() {

    const { t } = useTranslation();

    return (
        <>
            <div className="footer-inner pl-lg-4 pl-0">
                <h3 className="widget-title font-weight-normal">{t("FOR_DRIVERS")}</h3>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/find-jobs">
                            <a className="nav-link">{t("SEARCH_JOBS")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/resources">
                            <a className="nav-link">Resources</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/find-schools">
                            <a className="nav-link">Get your CDL</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://app.driverfly.co/apply/driverfly">
                            <a className="nav-link" target="_blank">Get Matched</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
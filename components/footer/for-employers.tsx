import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";

export default function ForEmployers() {

    const { t } = useTranslation();

    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">{t("FOR_EMPLOYERS")}</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">{t("MY_DASHBOARD")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">{t("CREATE_JOB_POSTING")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">{t("MY_JOBS")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">{t("MESSAGES")}</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
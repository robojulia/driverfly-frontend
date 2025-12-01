import Link from "next/link";
import { useTranslation } from "../../hooks/use-translation";
import { useUserContext } from "../../context/user-context";

export default function ForEmployers() {

    const { t } = useTranslation();
    const { user } = useUserContext();

    const myJobsLink = user?.company?.slug ? `/employer/${user.company.slug}` : "/login";

    return (
        <>
            <div className="footer-inner">
                <h3 className="widget-title font-weight-normal">{t("FOR_EMPLOYERS")}</h3>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="https://driverfly.co/our-software/">
                            <a className="nav-link" target="_blank">Our Solutions</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://driverfly.co/book-demo/">
                            <a className="nav-link" target="_blank">Schedule Demo</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://ctrecruiting.com/">
                            <a className="nav-link" target="_blank">{t("DRIVER_RECRUITING")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">{t("CREATE_JOB_POSTING")}</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href={myJobsLink}>
                            <a className="nav-link" href="#">{t("MY_JOBS")}</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
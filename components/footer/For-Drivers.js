import Link from "next/link";
export default function ForDrivers() {
    return (
        <>
            <div className="footer-inner pl-lg-4 pl-0">
                <h2 className="widget-title font-weight-normal">For Drivers</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link  href="/login">
                            <a className="nav-link">My Dashboard</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                    <Link  href="/find-jobs">
                        <a className="nav-link">Search Jobs</a>
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link  href="/login">
                        <a className="nav-link">My Resume</a>
                    </Link>
                    </li>
                    <li className="nav-item">
                    <Link  href="/login">
                        <a className="nav-link">Messages</a>
                    </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
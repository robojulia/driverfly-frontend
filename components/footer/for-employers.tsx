import Link from "next/link";
export default function ForEmployers() {
    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">For Employers</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">My Dashboard</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">Create Job Posting</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">My Jobs</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" href="#">Messages</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
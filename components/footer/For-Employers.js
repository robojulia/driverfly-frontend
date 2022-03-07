import Link from "next/link";
export default function ForEmployers() {
    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">For Employers</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <a className="nav-link" href="#">My Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Create Job Posting</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">My Jobs</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Messages</a>
                    </li>
                </ul>
            </div>

        </>
    )
}
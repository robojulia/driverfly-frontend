import Link from "next/link";
export default function ForDrivers() {
    return (
        <>
            <div className="footer-inner pl-lg-4 pl-0">
                <h2 className="widget-title font-weight-normal">For Drivers</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <a className="nav-link" href="#">My Dashboard</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Search Jobs</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">My Resume</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Messages</a>
                    </li>
                </ul>
            </div>

        </>
    )
}
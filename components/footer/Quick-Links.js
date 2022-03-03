import Link from "next/link";
export default function QuickLinks() {
    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">Quick Links</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <a className="nav-link" href="#">Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Driver Recruiting</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Featured Employers</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">FAQ</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">The DriverFly on the Wall Blog</a>
                    </li>
                    <li className="nav-item">
                        <Link href="/contact">
                            <a className="nav-link" >Contact</a>
                        </Link>
                    </li>
                </ul>
            </div>

        </>
    )
}
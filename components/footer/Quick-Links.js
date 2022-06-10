import Link from "next/link";
export default function QuickLinks() {
    return (
        <>
            <div className="footer-inner">
                <h2 className="widget-title font-weight-normal">Quick Links</h2>
                <ul className="p-0">
                    <li className="nav-item">
                        <Link href="/login">
                            <a className="nav-link" >Login</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="https://ctrecruiting.com/">
                            <a target="_blank" className="nav-link" >Driver Recruiting</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">Featured Employers</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/faq">
                            <a className="nav-link" >FAQ</a>
                        </Link>
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
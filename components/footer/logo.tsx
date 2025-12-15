import Link from "next/link";
export default function Logo
    () {
    return (
        <>
            <div className="col-md-2 text-center">
                <Link href="/">
                    <a>
                        <img src="/img/driverfly-logo-square.png" className="footer-logo" alt="DriverFly" />
                    </a>
                </Link>
            </div>
        </>
    )
}
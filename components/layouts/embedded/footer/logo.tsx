import Link from "next/link";
export default function Logo() {
    return (
        <>
            <div className="col-md-2 text-center">
                <Link href="https://driverfly.co/">
                    <a target="__blank">
                        <img src="/img/driverfly-logo-square.png" className="footer-logo" />
                    </a>
                </Link>
            </div>
        </>
    )
}
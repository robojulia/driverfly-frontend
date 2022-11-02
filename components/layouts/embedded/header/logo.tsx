import Link from "next/link";
export default function Logo() {
    return (
        <>
            <div className="logo">
            <Link href="https://driverfly.co/">
                    <a target="__blank">
                        <img src="/img/DriverFly-Official-Favicon.png" className="logo" />
                    </a>
                </Link>
            </div>
        </>
    )
}
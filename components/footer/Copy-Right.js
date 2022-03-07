import Link from "next/link";
export default function CopyRight
    () {
    return (
        <>
            <div className="copy-text">© 2021 DriverFly. All Rights Reserved.</div>
            <ul id="menu-copyright" className="menu d-flex align-items-center">
                <li id="menu-item-4034" className="menu-item mr-4"><a href="#">Site Map</a></li>
                <li id="menu-item-4033" className="menu-item">
                    <Link href="/terms-and-policies">
                        <a>Terms and Policies</a>
                    </Link>
                </li>
            </ul>

        </>
    )
}
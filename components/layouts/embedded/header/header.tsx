import Link from "next/link";
import Logo from "./logo";

export default function Header() {
    return (

        <>
            <header>
                <div className="header-sec">
                    <div className="container-fluid">
                        <Logo />
                    </div>
                </div>
            </header>
        </>
    )
}
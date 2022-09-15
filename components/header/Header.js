import Link from "next/link";
import Logo from "./Logo";
import Nav from "./Nav";


export default function Header() {
    return (

        <>

            <header>
                <div className="header-sec">
                    <div className="container-fluid">
                        <Logo />
                        <Nav />
                    </div>
                </div>
            </header>
        </>
    )
}
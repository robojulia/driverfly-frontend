import Link from "next/link";
import Logo from "./Logo";
import Nav from "./Nav";


export default function Header() {
    return (

        <>
          
            <header>
                <div className="header-sec">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg navbar p-0">
                            <Logo />
                            <Nav />
                        </nav>

                    </div>
                </div>
            </header>
        </>
    )
}
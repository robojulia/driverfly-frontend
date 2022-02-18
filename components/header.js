import Link from "next/link";

export default function Header()
{
    return (
        <>
            <header>
                <div className="header-sec">
                    <div className="container-fluid">
                        <nav className="navbar navbar-expand-lg navbar p-0">
                            <div className="logo">
                                <img src="img/DriverFly-Official-Favicon.png" className="logo"/>
                            </div>
                            <button className="navbar-toggler" type="button" data-toggle="collapse"
                                    data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                                    aria-label="Toggle navigation">
                                <i className="fa fa-bars" aria-hidden="true"></i>
                            </button>
                            <div className="collapse navbar-collapse justify-content-between" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link href="/">
                                            <a className="nav-link active">Home</a>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/about">
                                            <a className="nav-link">About Us</a>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/find-jobs">
                                            <a className="nav-link">Find A Job</a>
                                        </Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link  dropdown-toggle" href="#"
                                           data-bs-toggle="dropdown"> Driver Resources</a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#"> FAQ</a></li>
                                            <li><a className="dropdown-item" href="#"> Get Your CDL </a></li>
                                            <li><a className="dropdown-item" href="#"> Owner Operators </a></li>
                                            <li><a className="dropdown-item" href="#"> The DriverFly On The Wall
                                                Blog </a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <a className="nav-link  dropdown-toggle" href="#"
                                           data-bs-toggle="dropdown"> Motor Carrier Solutions</a>
                                        <ul className="dropdown-menu">
                                            <li><a className="dropdown-item" href="#">Over Solution </a></li>
                                            <li><a className="dropdown-item" href="#"> Option & Pricing </a></li>
                                            <li><a className="dropdown-item" href="#"> Request A Quote </a></li>
                                            <li><a className="dropdown-item" href="#"> Free Digital Application </a>
                                            </li>
                                            <li>
                                                <Link href="/Third-Party-Resources">
                                                  <a className="dropdown-item" href="#"> Third Party Resources </a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                </ul>
                                <ul className="d-flex align-items-center">
                                    <li><a href="#" className="nav-link"> <i className="fa fa-bell-o pt-1"
                                                                             aria-hidden="true"></i></a></li>
                                    <li><a href="#" className="nav-link">
                                        <button type="button" className="btn btn-primary">Login</button>
                                    </a></li>
                                    <li><a href="#" className="nav-link">
                                        <button type="button" className="btn btn-primary">Sign Up</button>
                                    </a></li>
                                </ul>
                            </div>
                        </nav>

                    </div>
                </div>
            </header>
        </>
    )
}
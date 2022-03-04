import Link from "next/link";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-2 text-center">
                                <img src="img/driverfly-logo-square.png" alt="" className="footer-logo"/>
                            </div>
                            <div className="col-md-10 d-flex justify-content-lg-end
justify-content-md-end justify-content-center  ">
                                <div className="footer-social-icons">
                                    <h6>Follow Us</h6>
                                    <div className="social">
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                    <div className="social">
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                    </div>
                                    <div className="social">
                                        <i className="fa fa-instagram" aria-hidden="true"></i>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-sec">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-3 col-lg-3 col-sm-4">
                                <div className="footer-inner">
                                    <h2 className="widget-title">Quick Links</h2>
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
                            </div>
                            <div className="col-lg-2 col-12">
                                <div className="footer-inner">
                                    <h2 className="widget-title">For Employers</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Dashboard</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Create Job Posting</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Jobs</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Messages</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-12">
                                <div className="footer-inner pl-lg-4 pl-0">
                                    <h2 className="widget-title">For Drivers</h2>
                                    <ul className="p-0">
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Dashboard</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Search Jobs</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">My Resume</a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link" href="#">Messages</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-5 pl-lg-5 p-2">
                                <div className="footer-inner">
                                <h2 className="widget-title">Drivers Newsletter</h2>
                                    <ul className="p-0">
                                    <p className="text-secondary mb-4">Subscribe to the DriverFly Newsletter to get the latest jobs feeds.</p>
                                        <form action="">
                                            <input type="email" className="form-control" placeholder="Email Adress"/>
                                            <button type="submit" className="btn btn-danger btn-lg btn-block mt-3">Submit</button>
                                        </form>
                                    </ul>
                                </div>
                                <div className="footer-inner">
                                    <h2 className="widget-title">
                                        Companies Newsletter</h2>
                                        <p className="text-secondary mb-4">Subscribe to the DriverFly Newsletter to get the latest <br /> discount codes & coupons, and major news headlines.</p>
                                    <ul className="p-0">
                                    
                                        <form action="">
                                            <input type="email" className="form-control" placeholder="Email Adress"/>
                                            <button type="submit" className="btn btn-danger btn-lg btn-block mt-3">Submit</button>
                                        </form>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            <div className="copyright-sec">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="copy-text">© 2021 DriverFly. All Rights Reserved.</div>
                            <ul id="menu-copyright" className="menu d-flex align-items-center">
                                <li id="menu-item-4034" className="menu-item mr-4"><a href="#">Site Map</a></li>
                                <li id="menu-item-4033" className="menu-item">
                                    <Link href="/terms-and-policies">
                                    <a>Terms and Policies</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}